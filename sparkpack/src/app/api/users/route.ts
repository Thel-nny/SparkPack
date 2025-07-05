import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const targetUserId = pathSegments[pathSegments.length - 1];

      // Users can only access their own data unless they're admin
      if (userRole !== 'ADMIN' && userId !== targetUserId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: {
          pets: {
            include: {
              applications: {
                include: {
                  claims: true,
                  payments: true,
                },
              },
            },
          },
          applications: {
            include: {
              pet: true,
              claims: true,
              payments: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function PUT(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const targetUserId = pathSegments[pathSegments.length - 1];

      // Users can only update their own data unless they're admin
      if (userRole !== 'ADMIN' && userId !== targetUserId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const body = await req.json();

      const user = await prisma.user.update({
        where: { id: targetUserId },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNum: body.phone,
          ...(userRole === 'ADMIN' && { role: body.role }),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNum: true,
          role: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: user,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function DELETE(req: NextRequest) {
  return await (await (withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/');
      const targetUserId = pathSegments[pathSegments.length - 1];

      // Only admin can delete users
      if (userRole !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      await prisma.user.delete({
        where: { id: targetUserId },
      });

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  })))(req);
}
