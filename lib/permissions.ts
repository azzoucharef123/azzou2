import { EditorCapability } from "@/types/domain";
import { AuthSession } from "@/lib/auth";
import { AuthorizationError } from "@/lib/errors";

export function hasRole(session: AuthSession, allowedRoles: AuthSession["primaryRole"][]) {
  return allowedRoles.includes(session.primaryRole);
}

export function hasCapability(session: AuthSession, capability: EditorCapability) {
  return session.capabilities.includes(capability) || session.primaryRole === "admin";
}

export function requireRole(session: AuthSession, allowedRoles: AuthSession["primaryRole"][]) {
  if (!hasRole(session, allowedRoles)) {
    throw new AuthorizationError();
  }
}

export function requireCapability(session: AuthSession, capability: EditorCapability) {
  if (!hasCapability(session, capability)) {
    throw new AuthorizationError();
  }
}

export function requireOwnership(session: AuthSession, ownerProfileId: string) {
  if (session.profile.id !== ownerProfileId && session.primaryRole !== "admin") {
    throw new AuthorizationError();
  }
}
