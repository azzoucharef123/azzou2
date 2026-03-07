import "server-only";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });
}

export function getPrisma() {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("DATABASE_URL is not configured. Prisma-backed features are unavailable.");
  }

  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient();
  }

  return globalThis.__prisma;
}

export async function withDbTransaction<T>(callback: (prisma: PrismaClient) => Promise<T>) {
  const prisma = getPrisma();
  return prisma.$transaction((tx) => callback(tx as PrismaClient));
}
