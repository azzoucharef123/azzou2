import { ArticleStatus } from "@prisma/client";
import { ConflictError } from "@/lib/errors";

export const WORKFLOW_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ["submitted"],
  submitted: ["pending_editorial_check"],
  pending_editorial_check: ["awaiting_reviewer_assignment", "editor_recommended_reject"],
  awaiting_reviewer_assignment: ["under_review"],
  under_review: ["review_completed", "minor_revision_requested", "major_revision_requested"],
  review_completed: ["editor_recommended_accept", "editor_recommended_reject", "minor_revision_requested", "major_revision_requested"],
  minor_revision_requested: ["resubmitted"],
  major_revision_requested: ["resubmitted"],
  resubmitted: ["under_review", "review_completed", "editor_recommended_accept", "editor_recommended_reject"],
  editor_recommended_accept: ["awaiting_chief_editor_decision"],
  editor_recommended_reject: ["awaiting_chief_editor_decision"],
  awaiting_chief_editor_decision: ["accepted", "rejected"],
  accepted: ["scheduled_for_publication"],
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
      return "Awaiting editorial triage";
    case "awaiting_reviewer_assignment":
      return "Waiting for reviewer assignment";
    case "under_review":
      return "Peer review in progress";
    case "review_completed":
      return "Reviews complete";
    case "minor_revision_requested":
      return "Minor revision requested";
    case "major_revision_requested":
      return "Major revision requested";
    case "resubmitted":
      return "Revision returned to editorial";
    case "editor_recommended_accept":
      return "Editor recommends acceptance";
    case "editor_recommended_reject":
      return "Editor recommends rejection";
    case "awaiting_chief_editor_decision":
      return "Awaiting chief editor decision";
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
