import "server-only";
import { Prisma, PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function getAppSetting(key: string, db: DbClient = getPrisma()) {
  return db.appSetting.findUnique({
    where: {
      key
    }
  });
}

export async function upsertAppSetting(key: string, valueJson: Prisma.InputJsonValue, db: DbClient = getPrisma()) {
  return db.appSetting.upsert({
    where: {
      key
    },
    update: {
      valueJson
    },
    create: {
      key,
      valueJson
    }
  });
}
