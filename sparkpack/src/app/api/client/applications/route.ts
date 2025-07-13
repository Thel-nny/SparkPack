import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      if (userRole !== "CUSTOMER") {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      const applications = await prisma.application.findMany({
        where: {
          customerId: userId,
        },
        skip,
        take: limit,
        include: {
          pet: true,
          selectedAddOns: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.application.count({
        where: { customerId: userId },
      });

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
      console.error("Error fetching client applications:", error);
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  })(req);
}
