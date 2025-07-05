import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const whereClause = userRole === 'ADMIN'
        ? {}
        : {
          application: {
            customerId: userId,
          },
        };

      const payments = await prisma.payment.findMany({
        where: whereClause,
        skip,
        take: limit,
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
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.payment.count({ where: whereClause });

      return NextResponse.json({
        success: true,
        data: {
          payments,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}

export async function POST(req: NextRequest) {
  return (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      const body = await req.json();
      const { applicationId, amount, paymentMethod, transactionId } = body;

      // Validate required fields
      if (!applicationId || !amount) {
        return NextResponse.json(
          { success: false, error: "Application ID and amount are required" },
          { status: 400 }
        );
      }

      // Verify application ownership
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
      });

      if (!application) {
        return NextResponse.json(
          { success: false, error: "Application not found" },
          { status: 404 }
        );
      }

      if (userRole !== 'ADMIN' && application.customerId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }

      const payment = await prisma.payment.create({
        data: {
          applicationId,
          amount,
          paymentDate: new Date(),
          paymentMethod,
          transactionId,
          status: 'COMPLETED',
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
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: payment,
        message: "Payment recorded successfully",
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}