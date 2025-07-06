import { PrismaClient } from "../generated/prisma/client";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient());
