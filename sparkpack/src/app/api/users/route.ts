import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { UserCreateInput } from "@/types";

export const GET = withAuth(async (req: NextRequest, userId: string, userRole: string) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (userRole !== 'ADMIN') {
      // Regular users can only see their own profile
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          Country: true,
          City: true,
          Pronvince: true,
          PostalCode: true,
          role: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: user,
      });
    }

    // Admin can see all users
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        Country: true,
        City: true,
        Pronvince: true,
        PostalCode: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count();

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest, userId: string, userRole: string) => {
  try {
    const body: UserCreateInput = await req.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
  data: {
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    address: body.address,
    Country: body.Country,
    City: body.City,
    Pronvince: body.Pronvince,
    PostalCode: body.PostalCode ?? 0,
    role: userRole === 'ADMIN' ? 'CUSTOMER' : 'CUSTOMER',
  },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    address: true,
    Country: true,
    City: true,
    Pronvince: true,
    PostalCode: true,
    role: true,
    createdAt: true,
  },
});

    return NextResponse.json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});