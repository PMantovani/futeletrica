import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (process.env.NODE_ENV === "production"
    ? new PrismaClientEdge({
        log: ["query"],
      })
    : new PrismaClient({
        log: ["query"],
      }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
