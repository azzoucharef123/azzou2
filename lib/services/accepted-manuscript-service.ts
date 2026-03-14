
import "server-only";
import type { Prisma } from "@prisma/client";
import { acceptedManuscriptFallback } from "@/data/accepted-manuscript";
import { AuthSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";
import { requireCapability, requireRole } from "@/lib/permissions";
import { getAppSetting, upsertAppSetting } from "@/lib/repositories/app-setting-repository";
import { acceptedManuscriptSchema } from "@/lib/validators/accepted-manuscript";
import { AcceptedManuscriptRecord } from "@/types/accepted-manuscript";

const HOMEPAGE_ACCEPTED_MANUSCRIPT_KEY = "homepage_accepted_manuscript";

function ensureDatabaseWritable() {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("DATABASE_URL is required to persist the homepage accepted manuscript.");
  }
}

export async function getHomepageAcceptedManuscript(): Promise<AcceptedManuscriptRecord | null> {
  if (!env.hasDatabaseUrl) {
    return acceptedManuscriptFallback;
  }

  const setting = await getAppSetting(HOMEPAGE_ACCEPTED_MANUSCRIPT_KEY);

  if (!setting) {
    return null;
  }

  return acceptedManuscriptSchema.parse(setting.valueJson);
}

export async function saveHomepageAcceptedManuscript(session: AuthSession, payload: AcceptedManuscriptRecord) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");

  const parsed = acceptedManuscriptSchema.parse(payload);
  await upsertAppSetting(HOMEPAGE_ACCEPTED_MANUSCRIPT_KEY, parsed as Prisma.InputJsonValue);

  return parsed;
}
