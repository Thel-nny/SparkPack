import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";
import { UserRole, ApplicationStatusSimplified } from "@prisma/client";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);

      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      // Filter for active applications: status ACTIVE or INACTIVE and advisor assigned (not null or "N/A")
      const baseWhereClause =
        userRole === "ADMIN"
          ? {
              status: { in: [ApplicationStatusSimplified.ACTIVE, ApplicationStatusSimplified.INACTIVE] },
              customer: { is: { role: UserRole.CUSTOMER } },
            }
          : {
              status: { in: [ApplicationStatusSimplified.ACTIVE, ApplicationStatusSimplified.INACTIVE] },
              customerId: userId,
              customer: { is: { role: UserRole.CUSTOMER } },
            };

      // Add filter for advisor assigned in related clientDetails
      const whereClause = {
        AND: [
          baseWhereClause,
          {
            customer: {
              is: {
                clientDetails: {
                  is: {
                    advisor: {
                      not: null,
                      notIn: ["N/A", ""]
                    }
                  }
                }
              }
            }
          }
        ]
      };

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
              role: true,
              clientDetails: {
                select: {
                  advisor: true
                }
              }
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
          claims: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
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
      console.error("Error fetching active applications:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
