import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  return await (await withAuth(async (req: NextRequest, userId: string, userRole: string) => {
    try {
      if (userRole === 'ADMIN') {
        const [
          totalUsers,
          totalPets,
          totalApplications,
          totalClaims,
          pendingClaims,
          totalPayments,
          underwritingApplications,
          declinedApplications,
          pendingRenewals,
          recentApplications,
          recentClaims,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.pet.count(),
          prisma.application.count({
            where: {
              status: { in: ['APPROVED','SUBMITTED', 'DECLINED', 'ACTIVE', 'INACTIVE'] } },
            }
          ),
          prisma.claim.count({
            where: {
              status: { in: ['APPROVED', 'PENDING', 'REJECTED','PROCESSING'] }
            }
          }),
          prisma.claim.count({ where: { status: 'PENDING' } }),
          prisma.payment.aggregate({ _sum: { amount: true } }),
          prisma.application.count({
            where: {
              status: 'SUBMITTED'
            }
          }),
          prisma.application.count({
            where: {
              status: 'DECLINED'
            }
          }),
          prisma.application.count({
            where: {
              status: 'INACTIVE'
            }
          }),
          prisma.application.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              customer: { select: { firstName: true, lastName: true } },
              pet: { select: { petName: true, species: true } },
            },
          }),
          prisma.claim.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              application: {
                include: {
                  customer: { select: { firstName: true, lastName: true } },
                  pet: { select: { petName: true, species: true } },
                },
              },
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            stats: {
              totalUsers,
              totalPets,
              totalApplications,
              totalClaims,
              pendingClaims,
              totalPayments: totalPayments._sum.amount || 0,
              underwritingApplications,
              declinedApplications,
              pendingRenewals,
            },
            recentApplications,
            recentClaims,
          },
        });
      } else {
        // Customer dashboard stats
        const [
          userPets,
          userApplications,
          userClaims,
          userPayments,
          underwritingApplications,
          declinedApplications,
          pendingRenewals,
          recentClaims,
        ] = await Promise.all([
          prisma.pet.count({ where: { ownerId: userId } }),
          prisma.application.count({
            where: {
              customerId: userId,
              status: { in: ['APPROVED','SUBMITTED', 'DECLINED', 'ACTIVE', 'INACTIVE'] }
            }
          }),
          prisma.claim.count({
            where: {
              application: { customerId: userId },
              status: { in: ['APPROVED', 'PENDING', 'REJECTED','PROCESSING'] }
            }
          }),
          prisma.payment.aggregate({
            where: { application: { customerId: userId } },
            _sum: { amount: true },
          }),
          prisma.application.count({
            where: {
              customerId: userId,
              status: 'SUBMITTED'
            }
          }),
          prisma.application.count({
            where: {
              customerId: userId,
              status: 'DECLINED'
            }
          }),
          prisma.application.count({
            where: {
              customerId: userId,
              status: 'INACTIVE'
            }
          }),
          prisma.claim.findMany({
            where: { application: { customerId: userId } },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              application: {
                include: {
                  pet: { select: { petName: true, species: true } },
                },
              },
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            stats: {
              totalPets: userPets,
              totalApplications: userApplications,
              totalClaims: userClaims,
              totalPayments: userPayments._sum.amount || 0,
              underwritingApplications,
              declinedApplications,
              pendingRenewals,
            },
            recentClaims,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }))(req);
}
