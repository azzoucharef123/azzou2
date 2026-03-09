import { ArticleStatus } from "@prisma/client";
import { ConflictError } from "@/lib/errors";

export const WORKFLOW_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ["submitted"],
  submitted: ["pending_editorial_check", "under_review", "accepted", "rejected"],
  pending_editorial_check: ["under_review", "accepted", "rejected", "minor_revision_requested", "major_revision_requested"],
  awaiting_reviewer_assignment: ["under_review", "accepted", "rejected"],
  under_review: ["review_completed", "minor_revision_requested", "major_revision_requested", "accepted", "rejected"],
  review_completed: ["accepted", "rejected", "minor_revision_requested", "major_revision_requested"],
  minor_revision_requested: ["resubmitted", "rejected"],
  major_revision_requested: ["resubmitted", "rejected"],
  resubmitted: ["under_review", "accepted", "rejected"],
  editor_recommended_accept: ["accepted"],
  editor_recommended_reject: ["rejected"],
  awaiting_chief_editor_decision: ["accepted", "rejected"],
  accepted: ["scheduled_for_publication", "published"],
  rejected: [],
  scheduled_for_publication: ["published"],
  published: []
};

export function assertTransitionAllowed(currentStatus: ArticleStatus, nextStatus: ArticleStatus) {
  const allowed = WORKFLOW_TRANSITIONS[currentStatus];

  if (!allowed.includes(nextStatus)) {
    throw new ConflictError(`Articles in status "${currentStatus}" cannot transition to "${nextStatus}".`);
  }
}

export function getWorkflowStepLabel(status: ArticleStatus) {
  switch (status) {
    case "draft":
      return "Draft in progress";
    case "submitted":
      return "Submission received";
    case "pending_editorial_check":
      return "Pending editorial check";
    case "awaiting_reviewer_assignment":
      return "Pending lead editor assignment";
    case "under_review":
      return "Under editor review";
    case "review_completed":
      return "Editorial assessment complete";
    case "minor_revision_requested":
      return "Minor revision requested";
    case "major_revision_requested":
      return "Major revision requested";
    case "resubmitted":
      return "Revision returned to editorial";
    case "editor_recommended_accept":
      return "Editor marked for acceptance";
    case "editor_recommended_reject":
      return "Editor marked for rejection";
    case "awaiting_chief_editor_decision":
      return "Awaiting final editor decision";
    case "accepted":
      return "Accepted for publication";
    case "rejected":
      return "Rejected";
    case "scheduled_for_publication":
      return "Scheduled for publication";
    case "published":
      return "Published";
  }
}
