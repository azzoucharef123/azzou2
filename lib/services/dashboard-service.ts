import "server-only";
import { ArticleStatus, type Article } from "@prisma/client";
import { env } from "@/lib/env";
import { getWorkflowStepLabel } from "@/lib/workflow";
import { listArticles } from "@/lib/repositories/article-repository";
import { listNotificationsForSession } from "@/lib/services/notification-service";
import { AuthSession } from "@/lib/auth";
import { PlatformMetric } from "@/types/platform";
import {
  approvalItems as fallbackApprovals,
  emailPreviews as fallbackEmailPreviews,
  publicationQueue as fallbackQueue,
  reviewTemplates as fallbackReviewTemplates,
  roleMetrics as fallbackRoleMetrics,
  workflowItems as fallbackWorkflowItems
} from "@/data/platform";

function statusTone(status: ArticleStatus) {
  switch (status) {
    case "accepted":
    case "published":
    case "scheduled_for_publication":
      return "emerald" as const;
    case "under_review":
    case "review_completed":
      return "blue" as const;
    case "minor_revision_requested":
    case "major_revision_requested":
      return "amber" as const;
    default:
      return "violet" as const;
  }
}

function mapArticleToWorkflow(article: Article & {
  author: { fullName: string };
  category: { name: string } | null;
  reviewerAssignments: { reviewer: { fullName: string } }[];
  tags: { tag: { name: string } }[];
}) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category?.name ?? "Uncategorised",
    author: article.author.fullName,
    status: article.status,
    priority: article.status === "awaiting_chief_editor_decision" ? "High" : "Standard",
    submittedAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    assignedTo: article.reviewerAssignments[0]?.reviewer.fullName ?? "Editorial desk",
    summary: article.excerpt ?? "Editorial summary pending.",
    currentStep: getWorkflowStepLabel(article.status),
    reviewers: article.reviewerAssignments.map((assignment) => assignment.reviewer.fullName),
    tags: article.tags.map((item) => item.tag.name),
    tone: statusTone(article.status)
  };
}

export async function getPlatformDashboardData(session: AuthSession) {
  if (!env.hasDatabaseUrl) {
    return {
      metrics: fallbackRoleMetrics[session.displayDesk],
      workflows: fallbackWorkflowItems,
      approvals: fallbackApprovals,
      queue: fallbackQueue,
      reviewTemplates: fallbackReviewTemplates,
      notifications: await listNotificationsForSession(session),
      emailPreviews: fallbackEmailPreviews
    };
  }

  const articles = await listArticles();
  const workflows = articles.map(mapArticleToWorkflow);
  const acceptedCount = workflows.filter((item) => item.status === "accepted" || item.status === "scheduled_for_publication").length;
  const reviewCount = workflows.filter((item) => item.status === "under_review").length;
  const metricTone = (session.displayDesk === "chiefEditor" ? "violet" : "blue") as "violet" | "blue";
  const metrics: PlatformMetric[] = [
    { label: "Live workflows", value: String(workflows.length).padStart(2, "0"), delta: "Service-backed view", tone: metricTone },
    { label: "Under review", value: String(reviewCount).padStart(2, "0"), delta: "Reviewer activity", tone: "cyan" },
    { label: "Accepted or queued", value: String(acceptedCount).padStart(2, "0"), delta: "Ready for production", tone: "emerald" }
  ];

  return {
    metrics,
    workflows,
    approvals: fallbackApprovals,
    queue: fallbackQueue,
    reviewTemplates: fallbackReviewTemplates,
    notifications: await listNotificationsForSession(session),
    emailPreviews: fallbackEmailPreviews
  };
}
