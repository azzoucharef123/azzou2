import "server-only";
import { cache } from "react";
import { type User } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { AuthenticationError, ConfigurationError } from "@/lib/errors";
import { getPrisma } from "@/lib/db/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthSession, EditorCapability, PlatformDesk, UserRole } from "@/types/domain";

export type { AuthSession } from "@/types/domain";
export const EDITOR_ACCOUNT_EMAIL = "azzoucharef3@gmail.com";

export function buildAuthorName(input: string) {
  if (!input.includes("@")) {
    return input.trim();
  }

  const local = input.split("@")[0];

  return local
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getSafeRedirectTarget(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/platform";
  }

  return value;
}

export function isEditorAccountEmail(email?: string | null) {
  return email?.trim().toLowerCase() === EDITOR_ACCOUNT_EMAIL;
}

export function resolveCanonicalRole(email?: string | null, requestedRole?: unknown): UserRole {
  if (isEditorAccountEmail(email) || requestedRole === "editor") {
    return "editor";
  }

  return "author";
}

export function getDefaultCapabilities(role: UserRole): EditorCapability[] {
  return role === "editor"
    ? ["MANAGE_WORKFLOWS", "MANAGE_QUEUE", "MANAGE_EMAILS"]
    : [];
}

export function deriveDisplayDesk(role: UserRole, capabilities: EditorCapability[]): PlatformDesk {
  void capabilities;
  return role;
}

function deriveRoleFromUser(user: User): UserRole {
  const rawRole = user.user_metadata?.role ?? user.app_metadata?.role;
  return resolveCanonicalRole(user.email, rawRole);
}

export function mapUserToSession(user: User, profile?: {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  initials: string;
  primaryRole: string;
  capabilities: EditorCapability[];
  avatarPath?: string | null;
  biography?: string | null;
} | null): AuthSession {
  const primaryRole = resolveCanonicalRole(user.email, profile?.primaryRole ?? deriveRoleFromUser(user));
  const capabilities = profile?.capabilities?.length ? profile.capabilities : getDefaultCapabilities(primaryRole);
  const name = profile?.fullName ?? buildAuthorName(user.email ?? "Science Contributor");

  return {
    userId: user.id,
    profile: {
      id: profile?.id ?? user.id,
      authUserId: user.id,
      email: profile?.email ?? user.email ?? "",
      fullName: name,
      initials: profile?.initials ?? getInitials(name),
      primaryRole,
      capabilities,
      avatarPath: profile?.avatarPath,
      biography: profile?.biography
    },
    primaryRole,
    capabilities,
    displayDesk: deriveDisplayDesk(primaryRole, capabilities),
    activeRole: deriveDisplayDesk(primaryRole, capabilities),
    email: profile?.email ?? user.email ?? "",
    name,
    initials: profile?.initials ?? getInitials(name)
  };
}

export const getSession = cache(async () => {
  if (!env.hasSupabaseAuth) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  if (!env.hasDatabaseUrl) {
    return mapUserToSession(user, null);
  }

  const prisma = getPrisma();
  const profile = await prisma.profile.findUnique({
    where: {
      authUserId: user.id
    }
  });

  return mapUserToSession(user, profile);
});

export async function requireAuthenticatedSession() {
  const session = await getSession();

  if (!session) {
    throw new AuthenticationError();
  }

  return session;
}

export function requireSupabaseAuthConfigured() {
  if (!env.hasSupabaseAuth) {
    throw new ConfigurationError("Supabase Auth is not configured.");
  }
}
