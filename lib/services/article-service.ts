import "server-only";
import { ArticleStatus, ReviewRecommendation, type Prisma } from "@prisma/client";
import { articles as fallbackArticles } from "@/data/articles";
import { getArticleBySlug as getFallbackArticleBySlug, getArticles as getFallbackArticles } from "@/lib/content";
import { AuthSession } from "@/lib/auth";
import { getPrisma, withDbTransaction } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { AuthorizationError, ConfigurationError, ConflictError, NotFoundError } from "@/lib/errors";
import { requireCapability, requireOwnership, requireRole } from "@/lib/permissions";
import {
  addStatusHistory,
  addSubmission,
  assignReviewer,
  createArticleRecord,
  createArticleVersion,
  createChiefEditorDecision,
  createEditorialNote,
  findCategoryBySlug,
  getArticleById,
  getArticleBySlug,
  listArticles,
  submitReview,
  updateArticleStatus
} from "@/lib/repositories/article-repository";
import { createNotifications } from "@/lib/repositories/notification-repository";
import { listProfilesByRole } from "@/lib/repositories/profile-repository";
import { assertTransitionAllowed, getWorkflowStepLabel } from "@/lib/workflow";

type ArticleCreatePayload = {
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  slug: string;
  categorySlug?: string;
  body: { sections: { id: string; title: string; paragraphs: string[]; pullQuote?: string; list?: string[] }[] };
  references: string[];
  tagSlugs: string[];
  featuredImagePath?: string | null;
  coverTone?: string | null;
  coverMotif?: string | null;
};

async function loadArticleOrThrow(articleId: string) {
  const article = await getArticleById(articleId);

  if (!article) {
    throw new NotFoundError("Article not found.");
  }

  return article;
}

function ensureDatabaseWritable() {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("Database-backed mutations require Prisma to be configured.");
  }
}

export async function listArticleSummaries(filters: { status?: ArticleStatus; categorySlug?: string; query?: string } = {}) {
  if (!env.hasDatabaseUrl) {
    return getFallbackArticles().map((article) => ({
      id: article.slug,
      slug: article.slug,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      status: "published" as const,
      categoryName: article.categorySlug,
      categorySlug: article.categorySlug,
      authorName: article.authorSlug,
      authorId: article.authorSlug,
      updatedAt: article.publishedAt,
      publishedAt: article.publishedAt
    }));
  }

  const articles = await listArticles(filters);

  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    status: article.status,
    categoryName: article.category?.name,
    categorySlug: article.category?.slug,
    authorName: article.author.fullName,
    authorId: article.author.id,
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString() ?? null
  }));
}

export async function getArticleDetail(slug: string) {
  if (!env.hasDatabaseUrl) {
    const article = getFallbackArticleBySlug(slug);

    if (!article) {
      throw new NotFoundError("Article not found.");
    }

    return article;
  }

  const article = (await getArticleBySlug(slug)) ?? (/^[0-9a-f-]{36}$/i.test(slug) ? await getArticleById(slug) : null);

  if (!article) {
    throw new NotFoundError("Article not found.");
  }

  return article;
}

export async function createArticleDraft(session: AuthSession, payload: ArticleCreatePayload) {
  ensureDatabaseWritable();
  requireRole(session, ["author", "editor"]);

  return withDbTransaction(async (db) => {
    const category = payload.categorySlug ? await findCategoryBySlug(payload.categorySlug, db) : null;
    const article = await createArticleRecord(
      {
        authorId: session.profile.id,
        slug: payload.slug,
        title: payload.title,
        subtitle: payload.subtitle,
        excerpt: payload.excerpt,
        categoryId: category?.id,
        bodyJson: payload.body as Prisma.InputJsonValue,
        referencesJson: payload.references as Prisma.InputJsonValue,
        tagSlugs: payload.tagSlugs,
        featuredImagePath: payload.featuredImagePath,
        coverTone: payload.coverTone,
        coverMotif: payload.coverMotif
      },
      db
    );

    return article;
  });
}

export async function updateArticleMetadata(session: AuthSession, articleId: string, payload: Partial<ArticleCreatePayload>) {
  ensureDatabaseWritable();
  const article = await loadArticleOrThrow(articleId);
  requireOwnership(session, article.authorId);

  const currentVersion = article.versions[0];

  return withDbTransaction(async (db) => {
    const version = await createArticleVersion(
      {
        articleId,
        createdById: session.profile.id,
        title: payload.title ?? article.title,
        subtitle: payload.subtitle ?? article.subtitle,
        excerpt: payload.excerpt ?? article.excerpt,
        bodyJson: (payload.body ?? currentVersion?.bodyJson ?? { sections: [] }) as Prisma.InputJsonValue,
        referencesJson: (payload.references ?? currentVersion?.referencesJson ?? []) as Prisma.InputJsonValue,
        featuredImagePath: payload.featuredImagePath ?? article.featuredImagePath,
        changeSummary: "Metadata updated through API."
      },
      db
    );

    return version;
  });
}

export async function saveArticleDraft(
  session: AuthSession,
  articleId: string,
  payload: {
    title?: string;
    subtitle?: string | null;
    excerpt?: string | null;
    body?: { sections: { id: string; title: string; paragraphs: string[]; pullQuote?: string; list?: string[] }[] };
    references?: string[];
    featuredImagePath?: string | null;
    changeSummary?: string;
  }
) {
  ensureDatabaseWritable();
  const article = await loadArticleOrThrow(articleId);
  requireOwnership(session, article.authorId);

  const currentVersion = article.versions[0];

  return withDbTransaction(async (db) => {
    return createArticleVersion(
      {
        articleId,
        createdById: session.profile.id,
        title: payload.title ?? article.title,
        subtitle: payload.subtitle ?? article.subtitle,
        excerpt: payload.excerpt ?? article.excerpt,
        bodyJson: (payload.body ?? currentVersion?.bodyJson ?? { sections: [] }) as Prisma.InputJsonValue,
        referencesJson: (payload.references ?? currentVersion?.referencesJson ?? []) as Prisma.InputJsonValue,
        featuredImagePath: payload.featuredImagePath ?? article.featuredImagePath,
        changeSummary: payload.changeSummary ?? "Draft saved."
      },
      db
    );
  });
}

export async function submitArticleForReview(
  session: AuthSession,
  articleId: string,
  payload: { coverLetter?: string; submissionType: "initial" | "revision" | "commissioned" }
) {
  ensureDatabaseWritable();
  const article = await loadArticleOrThrow(articleId);
  requireOwnership(session, article.authorId);
  assertTransitionAllowed(article.status, "submitted");

  return withDbTransaction(async (db) => {
    await addSubmission(
      {
        articleId,
        submittedById: session.profile.id,
        submissionType: payload.submissionType,
        coverLetter: payload.coverLetter
      },
      db
    );
    await updateArticleStatus(articleId, "submitted", db);
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: "submitted",
        note: payload.coverLetter ?? "Article submitted by author."
      },
      db
    );
    await createNotifications(
      [
        {
          recipientId: session.profile.id,
          type: "workflow",
          title: "Submission received",
          body: `${article.title} has entered the editorial pipeline.`
        }
      ],
      db
    );
  });
}

export async function assignArticleReviewer(
  session: AuthSession,
  articleId: string,
  payload: { reviewerProfileId: string; dueAt?: string }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");
  const article = await loadArticleOrThrow(articleId);

  if (article.authorId === payload.reviewerProfileId) {
    throw new ConflictError("Authors cannot review their own articles.");
  }

  const reviewer = (await listProfilesByRole("editor")).find((profile) => profile.id === payload.reviewerProfileId);

  if (!reviewer) {
    throw new NotFoundError("Editor reviewer not found.");
  }

  if (article.status === "submitted") {
    assertTransitionAllowed("pending_editorial_check", "awaiting_reviewer_assignment");
  }

  return withDbTransaction(async (db) => {
    if (article.status === "submitted") {
      await updateArticleStatus(articleId, "pending_editorial_check", db);
      await addStatusHistory(
        {
          articleId,
          actorId: session.profile.id,
          fromStatus: "submitted",
          toStatus: "pending_editorial_check",
          note: "Editorial triage complete."
        },
        db
      );
    }

    if (article.status !== "awaiting_reviewer_assignment") {
      await updateArticleStatus(articleId, "awaiting_reviewer_assignment", db);
      await addStatusHistory(
        {
          articleId,
          actorId: session.profile.id,
          fromStatus: article.status,
          toStatus: "awaiting_reviewer_assignment",
          note: "Reviewer assignment initiated."
        },
        db
      );
    }

    const assignment = await assignReviewer(
      {
        articleId,
        reviewerId: payload.reviewerProfileId,
        assignedById: session.profile.id,
        dueAt: payload.dueAt ? new Date(payload.dueAt) : undefined
      },
      db
    );

    await updateArticleStatus(articleId, "under_review", db);
    await addStatusHistory(
        {
          articleId,
          actorId: session.profile.id,
          fromStatus: "awaiting_reviewer_assignment",
          toStatus: "under_review",
          note: `Reviewing editor assigned: ${assignment.reviewer.fullName}.`
        },
        db
      );
    await createNotifications(
      [
        {
          recipientId: assignment.reviewerId,
          type: "review",
          title: "Editorial review assignment received",
          body: `${article.title} has been assigned to you for internal editorial review.`
        }
      ],
      db
    );

    return assignment;
  });
}

export async function submitAssignedReview(
  session: AuthSession,
  assignmentId: string,
  payload: { recommendation: ReviewRecommendation; summary: string; confidentialNote?: string }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  const prisma = getPrisma();
  const assignment = await prisma.reviewerAssignment.findUnique({
    where: {
      id: assignmentId
    },
    include: {
      article: true
    }
  });

  if (!assignment) {
    throw new NotFoundError("Reviewer assignment not found.");
  }

  if (assignment.reviewerId !== session.profile.id) {
    throw new AuthorizationError();
  }

  if (assignment.status === "submitted") {
    throw new ConflictError("This review has already been submitted.");
  }

  return withDbTransaction(async (db) => {
    const review = await submitReview(
      {
        assignmentId,
        articleId: assignment.articleId,
        reviewerId: session.profile.id,
        recommendation: payload.recommendation,
        summary: payload.summary,
        confidentialNote: payload.confidentialNote
      },
      db
    );

    await updateArticleStatus(assignment.articleId, "review_completed", db);
    await addStatusHistory(
      {
        articleId: assignment.articleId,
        actorId: session.profile.id,
        fromStatus: assignment.article.status,
        toStatus: "review_completed",
        note: `Review submitted with recommendation: ${payload.recommendation}.`
      },
      db
    );

    return review;
  });
}

export async function requestArticleRevision(
  session: AuthSession,
  articleId: string,
  payload: { note: string; revisionType: "minor_revision_requested" | "major_revision_requested" }
) {
  ensureDatabaseWritable();
  requireCapability(session, "MANAGE_WORKFLOWS");
  const article = await loadArticleOrThrow(articleId);
  assertTransitionAllowed(article.status, payload.revisionType);

  return withDbTransaction(async (db) => {
    await createEditorialNote(
      {
        articleId,
        authorId: session.profile.id,
        title: "Revision request",
        body: payload.note,
        isInternal: false
      },
      db
    );
    await updateArticleStatus(articleId, payload.revisionType, db);
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: payload.revisionType,
        note: payload.note
      },
      db
    );
  });
}

export async function changeArticleStatus(
  session: AuthSession,
  articleId: string,
  payload: { status: "pending_editorial_check" | "under_review" | "accepted" | "rejected" | "published"; note?: string }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");
  const article = await loadArticleOrThrow(articleId);
  assertTransitionAllowed(article.status, payload.status);

  return withDbTransaction(async (db) => {
    if (payload.note) {
      await createEditorialNote(
        {
          articleId,
          authorId: session.profile.id,
          title: "Status update",
          body: payload.note,
          isInternal: false
        },
        db
      );
    }

    if (payload.status === "published") {
      await db.article.update({
        where: {
          id: articleId
        },
        data: {
          status: "published",
          publishedAt: new Date()
        }
      });
    } else {
      await updateArticleStatus(articleId, payload.status, db);
    }

    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: payload.status,
        note: payload.note ?? `Status updated to ${payload.status.replaceAll("_", " ")}.`
      },
      db
    );

    await createNotifications(
      [
        {
          recipientId: article.authorId,
          type: "workflow",
          title: "Submission status updated",
          body: `${article.title} is now marked as ${payload.status.replaceAll("_", " ")}.`
        }
      ],
      db
    );

    return getArticleById(articleId, db);
  });
}

export async function recordEditorRecommendation(
  session: AuthSession,
  articleId: string,
  payload: { note: string; recommendation: "editor_recommended_accept" | "editor_recommended_reject" }
) {
  ensureDatabaseWritable();
  requireCapability(session, "MANAGE_WORKFLOWS");
  const article = await loadArticleOrThrow(articleId);
  assertTransitionAllowed(article.status, payload.recommendation);

  return withDbTransaction(async (db) => {
    await createEditorialNote(
      {
        articleId,
        authorId: session.profile.id,
        title: "Editor recommendation",
        body: payload.note
      },
      db
    );
    await updateArticleStatus(articleId, payload.recommendation, db);
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: payload.recommendation,
        note: payload.note
      },
      db
    );
    await updateArticleStatus(articleId, "awaiting_chief_editor_decision", db);
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: payload.recommendation,
        toStatus: "awaiting_chief_editor_decision",
        note: "Awaiting final editorial decision."
      },
      db
    );
  });
}

export async function recordChiefEditorDecision(
  session: AuthSession,
  articleId: string,
  payload: { decision: "accept" | "reject" | "hold"; rationale?: string }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  const article = await loadArticleOrThrow(articleId);

  if (payload.decision === "hold") {
    return createChiefEditorDecision({
      articleId,
      decidedById: session.profile.id,
      decision: "hold",
      rationale: payload.rationale
    });
  }

  const nextStatus = payload.decision === "accept" ? "accepted" : "rejected";
  assertTransitionAllowed(article.status, nextStatus);

  return withDbTransaction(async (db) => {
    const decision = await createChiefEditorDecision(
      {
        articleId,
        decidedById: session.profile.id,
        decision: payload.decision,
        rationale: payload.rationale
      },
      db
    );
    await updateArticleStatus(articleId, nextStatus, db);
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: nextStatus,
        note: payload.rationale
      },
      db
    );

    return decision;
  });
}

export async function scheduleArticlePublication(session: AuthSession, articleId: string, payload: { publishAt: string }) {
  ensureDatabaseWritable();
  requireCapability(session, "MANAGE_QUEUE");
  const article = await loadArticleOrThrow(articleId);
  assertTransitionAllowed(article.status, "scheduled_for_publication");

  return withDbTransaction(async (db) => {
    await updateArticleStatus(articleId, "scheduled_for_publication", db, new Date(payload.publishAt));
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: "scheduled_for_publication",
        note: `Scheduled for publication at ${payload.publishAt}.`
      },
      db
    );
  });
}

export async function markArticlePublished(session: AuthSession, articleId: string) {
  ensureDatabaseWritable();
  requireCapability(session, "MANAGE_QUEUE");
  const article = await loadArticleOrThrow(articleId);
  assertTransitionAllowed(article.status, "published");

  return withDbTransaction(async (db) => {
    await db.article.update({
      where: {
        id: articleId
      },
      data: {
        status: "published",
        publishedAt: new Date()
      }
    });
    await addStatusHistory(
      {
        articleId,
        actorId: session.profile.id,
        fromStatus: article.status,
        toStatus: "published",
        note: "Article published."
      },
      db
    );
  });
}

export async function getWorkflowDetail(slug: string) {
  if (!env.hasDatabaseUrl) {
    const fallback = fallbackArticles.find((article) => article.slug === slug);

    if (!fallback) {
      throw new NotFoundError("Workflow not found.");
    }

    return {
      id: fallback.slug,
      slug: fallback.slug,
      title: fallback.title,
      summary: fallback.excerpt,
      category: fallback.categorySlug,
      author: fallback.authorSlug,
      status: "published" as const,
      currentStep: getWorkflowStepLabel("published"),
      authorId: fallback.authorSlug,
      assignedTo: "Editorial desk",
      assignedEditors: ["Editorial desk"],
      tags: fallback.tags,
      submittedAt: fallback.publishedAt,
      updatedAt: fallback.publishedAt,
      timeline: [
        {
          label: "Published",
          detail: "This fallback article is already live in the public magazine archive.",
          date: fallback.publishedAt,
          complete: true
        }
      ]
    };
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    throw new NotFoundError("Workflow not found.");
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.excerpt ?? "Editorial summary pending.",
    category: article.category?.name ?? "Uncategorised",
    author: article.author.fullName,
    authorId: article.author.id,
    status: article.status,
    currentStep: getWorkflowStepLabel(article.status),
    assignedTo: article.reviewerAssignments[0]?.reviewer.fullName ?? "Editorial desk",
    assignedEditors: article.reviewerAssignments.map((assignment) => assignment.reviewer.fullName),
    tags: article.tags.map((item) => item.tag.name),
    submittedAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    timeline: article.statusHistory.map((entry) => ({
      label: getWorkflowStepLabel(entry.toStatus),
      detail: entry.note ?? (entry.actor?.fullName ? `Updated by ${entry.actor.fullName}.` : "Editorial status updated."),
      date: entry.createdAt.toISOString(),
      complete: true
    }))
  };
}
