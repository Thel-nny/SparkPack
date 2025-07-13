import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { ClaimStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      // Filter for claims in queue: PENDING or PROCESSING
      const baseWhereClause =
        userRole === 'ADMIN'
          ? {
              status: { in: [ClaimStatus.PENDING, ClaimStatus.PROCESSING] },
            }
          : {
              status: { in: [ClaimStatus.PENDING, ClaimStatus.PROCESSING] },
              application: {
                customerId: userId,
              },
            };

      const claims = await prisma.claim.findMany({
        where: baseWhereClause,
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
                  petName: true,
                  species: true,
                  breed: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.claim.count({ where: baseWhereClause });

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
      console.error("Error fetching claims queue:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
