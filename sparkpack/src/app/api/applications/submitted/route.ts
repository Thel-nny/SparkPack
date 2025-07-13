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

      // Filter for submitted applications: status SUBMITTED or DECLINED
      const whereClause =
        userRole === "ADMIN"
          ? {
              status: { in: [ApplicationStatusSimplified.SUBMITTED, ApplicationStatusSimplified.DECLINED] },
              customer: { is: { role: UserRole.CUSTOMER } },
            }
          : {
              status: { in: [ApplicationStatusSimplified.SUBMITTED, ApplicationStatusSimplified.DECLINED] },
              customerId: userId,
              customer: { is: { role: UserRole.CUSTOMER } },
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
      console.error("Error fetching submitted applications:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
