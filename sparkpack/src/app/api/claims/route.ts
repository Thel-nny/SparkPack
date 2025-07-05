import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { ClaimCreateInput } from "@/types";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const whereClause = userRole === 'ADMIN'
        ? {}
        : {
          application: {
            customerId: userId,
          },
        };

      const claims = await prisma.claim.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          application: {
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
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.claim.count({ where: whereClause });

      return NextResponse.json({
        success: true,
        data: {
          claims,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function POST(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const body: ClaimCreateInput = await req.json();

      // Validate required fields
      if (!body.applicationId || !body.claimNumber || !body.incidentDate || !body.claimAmount) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Verify application ownership
      const application = await prisma.application.findUnique({
        where: { id: body.applicationId },
      });

      if (!application) {
        return NextResponse.json(
          { success: false, error: "Application not found" },
          { status: 404 }
        );
      }

      if (userRole !== 'ADMIN' && application.customerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const claim = await prisma.claim.create({
        data: {
          applicationId: body.applicationId,
          claimNumber: body.claimNumber,
          incidentDate: body.incidentDate,
          claimAmount: body.claimAmount,
          description: body.description,
          veterinarianName: body.veterinarianName,
          veterinarianContact: body.veterinarianContact,
          documents: body.documents || [],
        },
        include: {
          application: {
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
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: claim,
        message: "Claim created successfully",
      });
    } catch (error) {
      console.error("Error creating claim:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}