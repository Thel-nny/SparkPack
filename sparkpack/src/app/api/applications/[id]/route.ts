import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const applicationId = req.url.split("/").pop();

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
              dateOfBirth: true,
              gender: true,
              weight: true,
              medicalConditions: true,
            },
          },
          claims: { orderBy: { createdAt: "desc" } },
          payments: { orderBy: { createdAt: "desc" } },
        },
      });

      if (!application) {
        return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
      }

      if (userRole !== "ADMIN" && application.customerId !== userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ success: true, data: application });
    } catch (error) {
      console.error("Error fetching application:", error);
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  }))(req);
}

export async function PUT(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const applicationId = req.url.split("/").pop();
      const body = await req.json();

      const existingApplication = await prisma.application.findUnique({
        where: { id: applicationId },
      });

      if (!existingApplication) {
        return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
      }

      if (userRole !== "ADMIN" && existingApplication.customerId !== userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: {
          ...(body.premiumAmount && { premiumAmount: body.premiumAmount }),
          ...(body.deductible && { deductible: body.deductible }),
          ...(body.coverageLimit && { coverageLimit: body.coverageLimit }),
          ...(body.endDate && { endDate: body.endDate }),
          ...(userRole === "ADMIN" && body.status && { status: body.status }),
        },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          pet: {
            select: { id: true, name: true, species: true, breed: true },
          },
          claims: true,
          payments: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: application,
        message: "Application updated successfully",
      });
    } catch (error) {
      console.error("Error updating application:", error);
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  }))(req);
}