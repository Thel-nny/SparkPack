import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export const PUT = withAuth(async (req: NextRequest, userId: string, userRole: string) => {
  try {
    // Only admin can approve claims
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const claimId = pathSegments[pathSegments.length - 2];

    const body = await req.json();
    const { approvedAmount, adminNotes } = body;

    const claim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        status: 'APPROVED',
        approvedAmount: approvedAmount,
        adminNotes: adminNotes,
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
      message: "Claim approved successfully",
    });
  } catch (error) {
    console.error("Error approving claim:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});
