import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = new Proxy(
  {},
  {
    get(target, prop) {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
          log: ["warn", "error"],
        });
      }
      const client = globalForPrisma.prisma as any;
      return client[prop];
    },
  }
) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  // We can't assign a proxy to globalForPrisma.prisma, it's already handled inside the proxy!
}