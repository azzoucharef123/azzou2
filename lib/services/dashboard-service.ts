import "server-only";
import { env } from "@/lib/env";
import { formatAuthorSubmissionStatus, formatEditorDashboardStatus, getAuthorSubmissionStatus, getEditorDashboardStatus, getWorkflowStatusTone } from "@/lib/platform-status";
import { getWorkflowStepLabel } from "@/lib/workflow";
import { listDashboardArticles } from "@/lib/repositories/article-repository";
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

type DashboardArticle = Awaited<ReturnType<typeof listDashboardArticles>>[number];

function mapArticleToWorkflow(article: DashboardArticle) {
  const dashboardStatus = getEditorDashboardStatus(article.status);
  const authorStatus = getAuthorSubmissionStatus(article.status);

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category?.name ?? "Uncategorised",
    author: article.author.fullName,
    authorId: article.author.id,
    status: article.status,
    priority: dashboardStatus === "pending_submissions" ? "High" : dashboardStatus === "under_review" ? "Standard" : "Low",
    submittedAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    assignedTo: article.reviewerAssignments[0]?.reviewer.fullName ?? "Editorial desk",
    summary: article.excerpt ?? "Editorial summary pending.",
    currentStep: getWorkflowStepLabel(article.status),
    assignedEditors: article.reviewerAssignments.map((assignment) => assignment.reviewer.fullName),
    tags: article.tags.map((item) => item.tag.name),
    dashboardStatus,
    dashboardStatusLabel: formatEditorDashboardStatus(dashboardStatus),
    authorStatus,
    authorStatusLabel: formatAuthorSubmissionStatus(authorStatus),
    tone: getWorkflowStatusTone(article.status)
  };
}

export async function getPlatformDashboardData(session: AuthSession) {
  if (!env.hasDatabaseUrl) {
    const notifications = await listNotificationsForSession(session);
    const isEditor = session.displayDesk === "editor";
    const workflows = (session.displayDesk === "author"
      ? fallbackWorkflowItems.filter((item) => item.author === session.name)
      : fallbackWorkflowItems).map((item) => {
        const dashboardStatus = getEditorDashboardStatus(item.status);
        const authorStatus = getAuthorSubmissionStatus(item.status);

        return {
          ...item,
          dashboardStatus,
          dashboardStatusLabel: formatEditorDashboardStatus(dashboardStatus),
          authorStatus,
          authorStatusLabel: formatAuthorSubmissionStatus(authorStatus),
          tone: getWorkflowStatusTone(item.status)
        };
      });

    return {
      metrics: fallbackRoleMetrics[session.displayDesk],
      workflows,
      approvals: isEditor ? fallbackApprovals : [],
      queue: isEditor ? fallbackQueue : [],
      reviewTemplates: isEditor ? fallbackReviewTemplates : [],
      notifications,
      emailPreviews: isEditor ? fallbackEmailPreviews : []
    };
  }

  const [articles, notifications] = await Promise.all([listDashboardArticles(), listNotificationsForSession(session)]);
  const scopedArticles = session.displayDesk === "author" ? articles.filter((article) => article.author.id === session.profile.id) : articles;
  const workflows = scopedArticles.map(mapArticleToWorkflow);
  const pendingCount = workflows.filter((item) => item.dashboardStatus === "pending_submissions").length;
  const reviewCount = workflows.filter((item) => item.dashboardStatus === "under_review").length;
  const acceptedCount = workflows.filter((item) => item.dashboardStatus === "accepted").length;
  const publishedCount = workflows.filter((item) => item.dashboardStatus === "published").length;
  const isEditor = session.displayDesk === "editor";
  const metrics: PlatformMetric[] = isEditor
    ? [
        { label: "Pending submissions", value: String(pendingCount).padStart(2, "0"), delta: "Needs editorial triage", tone: "amber" },
        { label: "Under review", value: String(reviewCount).padStart(2, "0"), delta: "Active editor attention", tone: "cyan" },
        { label: "Accepted articles", value: String(acceptedCount).padStart(2, "0"), delta: "Ready for publication", tone: "emerald" },
        { label: "Published articles", value: String(publishedCount).padStart(2, "0"), delta: "Live on the magazine", tone: "blue" }
      ]
    : [
        { label: "My submissions", value: String(workflows.length).padStart(2, "0"), delta: "Personal submission portfolio", tone: "blue" },
        { label: "Pending", value: String(workflows.filter((item) => item.authorStatus === "pending").length).padStart(2, "0"), delta: "Awaiting an editorial decision", tone: "amber" },
        { label: "Accepted", value: String(workflows.filter((item) => item.authorStatus === "accepted").length).padStart(2, "0"), delta: "Ready or already published", tone: "emerald" },
        { label: "Rejected", value: String(workflows.filter((item) => item.authorStatus === "rejected").length).padStart(2, "0"), delta: "Needs a new angle or revision", tone: "violet" }
      ];

  return {
    metrics,
    workflows,
    approvals: isEditor ? fallbackApprovals : [],
    queue: isEditor ? fallbackQueue : [],
    reviewTemplates: isEditor ? fallbackReviewTemplates : [],
    notifications,
    emailPreviews: isEditor ? fallbackEmailPreviews : []
  };
}
