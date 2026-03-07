import {
  approvalItems,
  emailPreviews,
  notifications,
  platformNavigation,
  platformRoles,
  publicationQueue,
  reviewTemplates,
  roleMetrics,
  workflowItems
} from "@/data/platform";
import { PlatformRole } from "@/types/platform";

export function getPlatformRoleLabel(role: PlatformRole) {
  return platformRoles.find((item) => item.id === role)?.label ?? role;
}

export function getPlatformRoleSummary(role: PlatformRole) {
  return platformRoles.find((item) => item.id === role)?.summary ?? "";
}

export function getPlatformNavigation(role: PlatformRole) {
  return platformNavigation.filter((item) => item.roles.includes(role));
}

export function getRoleMetrics(role: PlatformRole) {
  return roleMetrics[role];
}

export function getWorkflowItems() {
  return workflowItems;
}

export function getWorkflowBySlug(slug: string) {
  return workflowItems.find((item) => item.slug === slug);
}

export function getReviewTemplates() {
  return reviewTemplates;
}

export function getApprovalItems() {
  return approvalItems;
}

export function getPublicationQueue() {
  return publicationQueue;
}

export function getNotifications(role: PlatformRole) {
  return notifications.filter((item) => item.audience.includes(role));
}

export function getEmailPreviews() {
  return emailPreviews;
}
