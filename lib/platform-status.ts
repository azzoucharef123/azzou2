import { ArticleStatus } from "@prisma/client";
import { WorkflowStatus } from "@/types/platform";

type StatusLike = ArticleStatus | WorkflowStatus;

export type AuthorSubmissionStatus = "pending" | "accepted" | "rejected";
export type EditorDashboardStatus = "pending_submissions" | "under_review" | "accepted" | "published";

const PENDING_STATUSES: StatusLike[] = [
  "draft",
  "submitted",
  "pending_editorial_check",
  "awaiting_reviewer_assignment",
  "review_completed",
  "minor_revision_requested",
  "major_revision_requested",
  "resubmitted",
  "editor_recommended_accept",
  "editor_recommended_reject",
  "awaiting_chief_editor_decision"
];

export function getAuthorSubmissionStatus(status: StatusLike): AuthorSubmissionStatus {
  if (status === "rejected") {
    return "rejected";
  }

  if (status === "accepted" || status === "scheduled_for_publication" || status === "published") {
    return "accepted";
  }

  return "pending";
}

export function getEditorDashboardStatus(status: StatusLike): EditorDashboardStatus {
  if (status === "published") {
    return "published";
  }

  if (status === "accepted" || status === "scheduled_for_publication") {
    return "accepted";
  }

  if (status === "under_review") {
    return "under_review";
  }

  if (PENDING_STATUSES.includes(status)) {
    return "pending_submissions";
  }

  return "pending_submissions";
}

export function getWorkflowStatusTone(status: StatusLike) {
  if (status === "published" || status === "accepted" || status === "scheduled_for_publication") {
    return "emerald" as const;
  }

  if (status === "rejected") {
    return "rose" as const;
  }

  if (status === "under_review") {
    return "blue" as const;
  }

  return "amber" as const;
}

export function formatAuthorSubmissionStatus(status: AuthorSubmissionStatus) {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
}

export function formatEditorDashboardStatus(status: EditorDashboardStatus) {
  switch (status) {
    case "pending_submissions":
      return "Pending submissions";
    case "under_review":
      return "Under review";
    case "accepted":
      return "Accepted";
    case "published":
      return "Published";
  }
}
