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
      },
    });

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
