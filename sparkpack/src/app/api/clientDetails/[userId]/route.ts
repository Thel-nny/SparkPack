import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export const GET = withAuth(async (req: NextRequest, authenticatedUserId: string, userRole: string) => {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const targetUserId = pathSegments[pathSegments.length - 1];

    if (authenticatedUserId !== targetUserId && userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const clientDetails = await prisma.clientDetails.findUnique({
      where: { userId: targetUserId },
    });

    if (!clientDetails) {
      return NextResponse.json({ success: false, error: "Client details not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: clientDetails,
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});

export const PUT = withAuth(async (req: NextRequest, authenticatedUserId: string, userRole: string) => {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const targetUserId = pathSegments[pathSegments.length - 1];

    if (authenticatedUserId !== targetUserId && userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Validate advisor field
    let advisorValue = null;
    if (body.advisor && typeof body.advisor === "string") {
      const trimmedAdvisor = body.advisor.trim();
      advisorValue = trimmedAdvisor === "" || trimmedAdvisor.toUpperCase() === "N/A" ? null : trimmedAdvisor;
    }

    // Update ClientDetails with advisor field
    const updatedClientDetails = await prisma.clientDetails.update({
      where: { userId: targetUserId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dob: body.dob ? new Date(body.dob) : undefined,
        pob: body.pob,
        gender: body.gender,
        phoneNumber: body.phoneNumber,
        email: body.email,
        streetAddress: body.streetAddress,
        country: body.country,
        city: body.city,
        province: body.province,
        postalCode: body.postalCode,
        declarationAccuracy: body.declarationAccuracy,
        advisor: advisorValue,
      },
    });

    // If advisor is assigned (not null), update related applications' status to ACTIVE
    // Otherwise, set applications back to APPROVED
    if (advisorValue) {
      await prisma.application.updateMany({
        where: {
          customerId: targetUserId,
          status: {
            in: ["SUBMITTED", "APPROVED"],
          },
        },
        data: {
          status: "ACTIVE",
        },
      });
    } else {
      await prisma.application.updateMany({
        where: {
          customerId: targetUserId,
          status: "ACTIVE",
        },
        data: {
          status: "APPROVED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedClientDetails,
      message: "Client details updated successfully",
    });
  } catch (error) {
    console.error("Error updating client details:", error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
