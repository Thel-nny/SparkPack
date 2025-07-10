import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export const PUT = withAuth(async (req: NextRequest, authenticatedUserId: string, userRole: string) => {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const targetUserId = pathSegments[pathSegments.length - 1];

    if (authenticatedUserId !== targetUserId && userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

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
       advisor: body.advisor ? body.advisor.trim() : null,
      },
    });

    // If advisor is assigned (not null, not empty, not "N/A"), update related applications' status to APPROVED
    // Otherwise, set status to APPROVED (or appropriate in-progress status)
    const advisorAssigned = body.advisor && body.advisor.trim() !== "" && body.advisor.trim().toUpperCase() !== "N/A";

    if (advisorAssigned) {
      // Update all applications for this user with in-progress statuses to APPROVED (active)
      await prisma.application.updateMany({
        where: {
          customerId: targetUserId,
          status: {
            in: ["SUBMITTED", "ACTIVE"],
          },
        },
        data: {
          status: "APPROVED",
        },
      });
    } else {
      // Set applications back to in-progress statuses if advisor removed
      await prisma.application.updateMany({
        where: {
          customerId: targetUserId,
          status: "APPROVED",
        },
        data: {
          status: "ACTIVE",
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
