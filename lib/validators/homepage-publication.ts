import { z } from "zod";

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.");
const coverToneSchema = z.enum(["blue", "silver", "cyan", "amber", "violet", "emerald"]);
const coverMotifSchema = z.enum(["atoms", "waves", "lattice", "spectrum", "microscope", "crystal"]);

export const homepagePublicationActionSchema = z.object({
  slug: z.string().min(1),
  action: z.enum(["hide", "delete", "restore"])
});

export const createHomepagePublicationSchema = z.object({
  slug: z.string().min(1)
});

export const updateHomepagePublicationSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(5).max(220),
  subtitle: z.string().max(260).default(""),
  excerpt: z.string().min(20).max(900),
  authorName: z.string().min(3).max(160),
  publishedAt: dateField,
  coverTone: coverToneSchema,
  coverMotif: coverMotifSchema,
  order: z.coerce.number().int().min(0).max(99)
});
