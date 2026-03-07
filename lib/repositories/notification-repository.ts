import "server-only";
import { PrismaClient, type NotificationType, type Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function listNotificationsForRecipient(recipientId: string, db: DbClient = getPrisma()) {
  return db.notification.findMany({
    where: {
      recipientId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createNotification(
  input: {
    recipientId: string;
    type: NotificationType;
    title: string;
    body: string;
    dataJson?: Prisma.InputJsonValue;
  },
  db: DbClient = getPrisma()
) {
  return db.notification.create({
    data: input
  });
}

export async function createNotifications(
  inputs: {
    recipientId: string;
    type: NotificationType;
    title: string;
    body: string;
    dataJson?: Prisma.InputJsonValue;
  }[],
  db: DbClient = getPrisma()
) {
  if (!inputs.length) {
    return;
  }

  await db.notification.createMany({
    data: inputs
  });
}
