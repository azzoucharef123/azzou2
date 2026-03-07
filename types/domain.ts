export type UserRole = "author" | "reviewer" | "editor" | "chief_editor" | "admin";

export type EditorCapability =
  | "MANAGE_WORKFLOWS"
  | "ASSIGN_REVIEWERS"
  | "MANAGE_QUEUE"
  | "MANAGE_EMAILS"
  | "VIEW_CHIEF_EDITOR_QUEUE";

export type PlatformDesk = "author" | "reviewer" | "managingEditor" | "chiefEditor" | "productionEditor";

export type AuthenticatedProfile = {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  initials: string;
  primaryRole: UserRole;
  capabilities: EditorCapability[];
  avatarPath?: string | null;
  biography?: string | null;
};

export type AuthSession = {
  userId: string;
  profile: AuthenticatedProfile;
  primaryRole: UserRole;
  capabilities: EditorCapability[];
  displayDesk: PlatformDesk;
  activeRole: PlatformDesk;
  email: string;
  name: string;
  initials: string;
};

export type ArticleLifecycleStatus =
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

export type ReviewRecommendationValue = "accept" | "minor_revision" | "major_revision" | "reject";

export type NotificationTypeValue = "workflow" | "review" | "editorial" | "publication" | "system";

export type DecisionTypeValue = "accept" | "reject" | "hold";

export type SessionProfileDto = {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  initials: string;
  primaryRole: UserRole;
  capabilities: EditorCapability[];
  displayDesk: PlatformDesk;
};

export type ArticleSummaryDto = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  status: ArticleLifecycleStatus;
  categoryName?: string | null;
  categorySlug?: string | null;
  authorName: string;
  authorId: string;
  updatedAt: string;
  publishedAt?: string | null;
};

export type WorkflowItemDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  status: ArticleLifecycleStatus;
  priority: "Low" | "Standard" | "High" | "Critical";
  submittedAt: string;
  updatedAt: string;
  assignedTo: string;
  currentStep: string;
  reviewers: string[];
  tags: string[];
};

export type NotificationDto = {
  id: string;
  type: NotificationTypeValue;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
};
