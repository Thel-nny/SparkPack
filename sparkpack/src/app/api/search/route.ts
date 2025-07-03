import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Reusable string search filter
const iLike = (value: string) => ({
  contains: value,
  mode: "insensitive" as const,
});
export async function searchUsers(query: string, userId: string, role: string) {
  const where = role === "ADMIN"
    ? {
        OR: [
          { firstName: iLike(query) },
          { lastName: iLike(query) },
          { email: iLike(query) },
        ],
      }
    : {
        id: userId,
        OR: [
          { firstName: iLike(query) },
          { lastName: iLike(query) },
          { email: iLike(query) },
        ],
      };

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
    take: 10,
  });
}

export async function searchPets(query: string, userId: string, role: string) {
  const where = role === "ADMIN"
    ? {
        OR: [
          { name: iLike(query) },
          { breed: iLike(query) },
          {
            owner: {
              OR: [
                { firstName: iLike(query) },
                { lastName: iLike(query) },
              ],
            },
          },
        ],
      }
    : {
        ownerId: userId,
        OR: [
          { name: iLike(query) },
          { breed: iLike(query) },
        ],
      };

  return prisma.pet.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    take: 10,
  });
}

export async function searchApplications(query: string, userId: string, role: string) {
  const where = role === "ADMIN"
    ? {
        OR: [
          { policyNumber: iLike(query) },
          {
            customer: {
              OR: [
                { firstName: iLike(query) },
                { lastName: iLike(query) },
              ],
            },
          },
          { pet: { name: iLike(query) } },
        ],
      }
    : {
        customerId: userId,
        OR: [
          { policyNumber: iLike(query) },
          { pet: { name: iLike(query) } },
        ],
      };

  return prisma.application.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
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
    take: 10,
  });
}

export async function searchClaims(query: string, userId: string, role: string) {
  const where = role === "ADMIN"
    ? {
        OR: [
          { claimNumber: iLike(query) },
          { description: iLike(query) },
          { veterinarianName: iLike(query) },
        ],
      }
    : {
        application: { customerId: userId },
        OR: [
          { claimNumber: iLike(query) },
          { description: iLike(query) },
          { veterinarianName: iLike(query) },
        ],
      };

  return prisma.claim.findMany({
    where,
    include: {
      application: {
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
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
    take: 10,
  });
}
