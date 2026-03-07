import { z } from "zod";

export const articleBodySchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      paragraphs: z.array(z.string()).default([]),
      pullQuote: z.string().optional(),
      list: z.array(z.string()).optional()
    })
  )
});

export const createArticleSchema = z.object({
  title: z.string().min(5).max(180),
  subtitle: z.string().max(240).nullable().optional(),
  excerpt: z.string().max(600).nullable().optional(),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  categorySlug: z.string().min(2).optional(),
  body: articleBodySchema,
  references: z.array(z.string()).default([]),
  tagSlugs: z.array(z.string()).default([]),
  featuredImagePath: z.string().max(255).nullable().optional(),
  coverTone: z.string().max(60).nullable().optional(),
  coverMotif: z.string().max(60).nullable().optional()
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().uuid().optional()
});

export const saveDraftSchema = z.object({
  title: z.string().min(5).max(180).optional(),
  subtitle: z.string().max(240).nullable().optional(),
  excerpt: z.string().max(600).nullable().optional(),
  body: articleBodySchema.optional(),
  references: z.array(z.string()).optional(),
  featuredImagePath: z.string().max(255).nullable().optional(),
  changeSummary: z.string().max(500).optional()
});

export const submitArticleSchema = z.object({
  coverLetter: z.string().max(2000).optional(),
  submissionType: z.enum(["initial", "revision", "commissioned"]).default("initial")
});

export const assignReviewerSchema = z.object({
  reviewerProfileId: z.string().uuid(),
  dueAt: z.string().datetime().optional()
});

export const requestRevisionSchema = z.object({
  note: z.string().min(10).max(2000),
  revisionType: z.enum(["minor_revision_requested", "major_revision_requested"])
});

export const editorRecommendationSchema = z.object({
  note: z.string().min(10).max(2000),
  recommendation: z.enum(["editor_recommended_accept", "editor_recommended_reject"])
});

export const chiefEditorDecisionSchema = z.object({
  rationale: z.string().max(2000).optional(),
  decision: z.enum(["accept", "reject", "hold"])
});

export const schedulePublicationSchema = z.object({
  publishAt: z.string().datetime()
});

export const articleListQuerySchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  q: z.string().optional()
});
