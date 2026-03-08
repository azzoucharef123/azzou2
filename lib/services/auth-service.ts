import "server-only";
import type { User } from "@supabase/supabase-js";
import { getInitials, getDefaultCapabilities, mapUserToSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";
import { upsertProfile } from "@/lib/repositories/profile-repository";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { UserRole } from "@/types/domain";

export async function ensureProfileForSupabaseUser(user: User, role: UserRole = "author") {
  if (!env.hasDatabaseUrl) {
    return mapUserToSession(user, null);
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Science Contributor";
  const affiliation = (user.user_metadata?.affiliation as string | undefined) ?? undefined;
  const headline = (user.user_metadata?.headline as string | undefined) ?? undefined;

  const profile = await upsertProfile({
    authUserId: user.id,
    email: user.email ?? "",
    fullName,
    initials: getInitials(fullName),
    primaryRole: role,
    capabilities: getDefaultCapabilities(role),
    affiliation,
    headline
  });

  return mapUserToSession(user, profile);
}

export async function bootstrapProfileForAuthUser(input: {
  authUserId: string;
  email: string;
  fullName: string;
  role?: UserRole;
}) {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("DATABASE_URL is required to bootstrap profiles.");
  }

  return upsertProfile({
    authUserId: input.authUserId,
    email: input.email,
    fullName: input.fullName,
    initials: getInitials(input.fullName),
    primaryRole: input.role ?? "author",
    capabilities: getDefaultCapabilities(input.role ?? "author")
  });
}

export async function updateAuthMetadata(authUserId: string, metadata: Record<string, unknown>) {
  const supabase = createSupabaseServiceClient();

  await supabase.auth.admin.updateUserById(authUserId, {
    user_metadata: metadata
  });
}
