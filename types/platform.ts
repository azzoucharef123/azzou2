import { PlatformDesk } from "@/types/domain";

export type PlatformRole = PlatformDesk;

export type PlatformNavItem = {
  label: string;
  href: string;
  roles: PlatformRole[];
};

export type PlatformMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "blue" | "cyan" | "amber" | "violet" | "emerald";
};

export type WorkflowStatus =
  | "draft"
  | "submitted"
  | "pending_editorial_check"
  | "awaiting_reviewer_assignment"
  | "under_review"
  | "review_completed"
  | "minor_revision_requested"
  | "major_revision_requested"
  | "resubmitted"
  | "editor_recommended_accept"
  | "editor_recommended_reject"
  | "awaiting_chief_editor_decision"
  | "accepted"
  | "rejected"
  | "scheduled_for_publication"
  | "published";

export type WorkflowPriority = "Low" | "Standard" | "High" | "Critical";

export type WorkflowStage = {
  label: string;
  detail: string;
  date: string;
  complete: boolean;
};

export type WorkflowItem = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  author: string;
  authorId?: string;
  status: WorkflowStatus;
  priority: WorkflowPriority;
  submittedAt: string;
  updatedAt: string;
  assignedTo: string;
  summary: string;
  currentStep: string;
  assignedEditors: string[];
  tags: string[];
  timeline: WorkflowStage[];
};

export type ReviewFormTemplate = {
  id: string;
  title: string;
  description: string;
  criteria: { label: string; score: number; note: string }[];
  recommendation: "accept" | "minor_revision" | "major_revision";
};

export type ApprovalItem = {
  id: string;
  articleTitle: string;
  section: string;
  leadEditor: string;
  riskLevel: "Routine" | "Elevated" | "Sensitive";
  status: "pending" | "accepted" | "rejected";
  deadline: string;
  summary: string;
};

export type QueueItem = {
  id: string;
  title: string;
  destination: string;
  channel: string;
  publishAt: string;
  owner: string;
  status: "ready" | "awaiting-assets" | "blocked" | "scheduled";
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  when: string;
  audience: PlatformRole[];
  tone: "info" | "warning" | "success";
};

export type EmailPreview = {
  slug: string;
  name: string;
  subject: string;
  preheader: string;
  audience: string;
  summary: string;
  bodySections: string[];
};
