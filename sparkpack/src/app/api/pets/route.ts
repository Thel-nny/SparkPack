import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { PetCreateInput } from "@/types";

export const GET = withAuth(async (req: NextRequest, userId: string, userRole: string) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const whereClause = userRole === 'ADMIN' ? {} : { ownerId: userId };

    const pets = await prisma.pet.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        applications: {
          include: {
            claims: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.pet.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      data: {
        pets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest, userId: string, userRole: string) => {
  try {
    const body: PetCreateInput = await req.json();

    // Validate required fields
    if (!body.name || !body.species) {
      return NextResponse.json(
        { success: false, error: "Name and species are required" },
        { status: 400 }
      );
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId: userId,
        name: body.name,
        species: body.species,
        breed: body.breed,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        weight: body.weight,
        medicalConditions: body.medicalConditions || [],
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: pet,
      message: "Pet created successfully",
    });
  } catch (error) {
    console.error("Error creating pet:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});