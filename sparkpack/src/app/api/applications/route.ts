import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { ApplicationCreateInput } from "@/types";

export async function GET(req: NextRequest) {

  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const whereClause = userRole === 'ADMIN' ? {} : { customerId: userId };

      const applications = await prisma.application.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
            },
          },
          claims: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.application.count({ where: whereClause });

      return NextResponse.json({
        success: true,
        data: {
          applications,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req); // <-- Call the returned function with req
}

export async function POST(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const body: ApplicationCreateInput = await req.json();

      // Validate required fields
      if (!body.petId || !body.policyNumber || !body.planType || !body.premiumAmount || !body.deductible) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Verify pet ownership
      const pet = await prisma.pet.findUnique({
        where: { id: body.petId },
      });

      if (!pet) {
        return NextResponse.json(
          { success: false, error: "Pet not found" },
          { status: 404 }
        );
      }

      if (userRole !== 'ADMIN' && pet.ownerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const application = await prisma.application.create({
        data: {
          customerId: userId,
          petId: body.petId,
          policyNumber: body.policyNumber,
          planType: body.planType,
          premiumAmount: body.premiumAmount,
          deductible: body.deductible,
          coverageLimit: body.coverageLimit,
          startDate: body.startDate,
          endDate: body.endDate,
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: application,
        message: "Application created successfully",
      });
    } catch (error) {
      console.error("Error creating application:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req); // <-- Call the returned function with req
}