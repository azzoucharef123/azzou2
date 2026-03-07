import "server-only";
import { PrismaClient, UserRole, type Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function getProfileByAuthUserId(authUserId: string, db: DbClient = getPrisma()) {
  return db.profile.findUnique({
    where: {
      authUserId
    }
  });
}

export async function updateProfileByAuthUserId(
  authUserId: string,
  data: Prisma.ProfileUpdateInput,
  db: DbClient = getPrisma()
) {
  return db.profile.update({
    where: {
      authUserId
    },
    data
  });
}

export async function upsertProfile(
  input: {
    authUserId: string;
    email: string;
    fullName: string;
    initials: string;
    primaryRole: UserRole;
    capabilities?: Prisma.ProfileCreateInput["capabilities"];
  },
  db: DbClient = getPrisma()
) {
  return db.profile.upsert({
    where: {
      authUserId: input.authUserId
    },
    create: {
      authUserId: input.authUserId,
      email: input.email,
      fullName: input.fullName,
      initials: input.initials,
      primaryRole: input.primaryRole,
      capabilities: input.capabilities ?? []
    },
    update: {
      email: input.email,
      fullName: input.fullName,
      initials: input.initials,
      primaryRole: input.primaryRole,
      capabilities: input.capabilities ?? []
    }
  });
}

export async function listProfilesByRole(role: UserRole, db: DbClient = getPrisma()) {
  return db.profile.findMany({
    where: {
      primaryRole: role
    },
    orderBy: {
      fullName: "asc"
    }
  });
}
