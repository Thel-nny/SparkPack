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
              petName: true,
              species: true,
              breed: true,
              dobOrAdoptionDate: true,
              gender: true,
              weight: true,
              // medicalConditions: true, // Removed because it does not exist in PetSelect type
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

      // Prepare update data with validation and defaults
      const updateData: any = {};

      if (body.premiumAmount !== undefined) {
        updateData.premiumAmount = parseFloat(body.premiumAmount);
      }
      if (body.deductible !== undefined) {
        updateData.deductible = parseFloat(body.deductible);
      }
      if (body.coverageLimit !== undefined) {
        updateData.coverageLimit = parseFloat(body.coverageLimit);
      }
      if (body.endDate !== undefined) {
        updateData.endDate = new Date(body.endDate);
      }
      if (userRole === "ADMIN" && body.status !== undefined) {
        updateData.status = body.status === "SUBMITTED" ? "SUBMITTED" : body.status;
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          pet: {
            select: { id: true, petName: true, species: true, breed: true },
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
    } catch (error: any) {
      console.error("Error updating application:", error.message, error.stack);
      return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
    }
  }))(req);
}
