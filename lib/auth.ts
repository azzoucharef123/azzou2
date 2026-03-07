import "server-only";
import { type User } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { AuthenticationError, ConfigurationError } from "@/lib/errors";
import { getPrisma } from "@/lib/db/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthSession, EditorCapability, PlatformDesk, UserRole } from "@/types/domain";

export type { AuthSession } from "@/types/domain";

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

export function getDefaultCapabilities(role: UserRole): EditorCapability[] {
  switch (role) {
    case "editor":
      return ["MANAGE_WORKFLOWS", "ASSIGN_REVIEWERS"];
    case "chief_editor":
      return ["MANAGE_WORKFLOWS", "ASSIGN_REVIEWERS", "VIEW_CHIEF_EDITOR_QUEUE", "MANAGE_QUEUE", "MANAGE_EMAILS"];
    case "admin":
      return ["MANAGE_WORKFLOWS", "ASSIGN_REVIEWERS", "VIEW_CHIEF_EDITOR_QUEUE", "MANAGE_QUEUE", "MANAGE_EMAILS"];
    default:
      return [];
  }
}

export function deriveDisplayDesk(role: UserRole, capabilities: EditorCapability[]): PlatformDesk {
  if (role === "admin" || role === "chief_editor" || capabilities.includes("VIEW_CHIEF_EDITOR_QUEUE")) {
    return "chiefEditor";
  }

  if (role === "editor" && (capabilities.includes("MANAGE_QUEUE") || capabilities.includes("MANAGE_EMAILS"))) {
    return "productionEditor";
  }

  if (role === "editor") {
    return "managingEditor";
  }

  if (role === "reviewer") {
    return "reviewer";
  }

  return "author";
}

function deriveRoleFromUser(user: User): UserRole {
  const rawRole = user.user_metadata?.role ?? user.app_metadata?.role;

  if (rawRole === "reviewer" || rawRole === "editor" || rawRole === "chief_editor" || rawRole === "admin") {
    return rawRole;
  }

  return "author";
}

export function mapUserToSession(user: User, profile?: {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  initials: string;
  primaryRole: UserRole;
  capabilities: EditorCapability[];
  avatarPath?: string | null;
  biography?: string | null;
} | null): AuthSession {
  const primaryRole = profile?.primaryRole ?? deriveRoleFromUser(user);
  const capabilities = profile?.capabilities ?? getDefaultCapabilities(primaryRole);
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

export async function getSession() {
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
}

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
