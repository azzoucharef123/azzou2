import { z } from "zod";

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.");

export const acceptedManuscriptSchema = z.object({
  title: z.string().min(5).max(220),
  authors: z.string().min(3).max(320),
  submissionDate: dateField,
  reviewDate: dateField,
  acceptanceDate: dateField,
  publicationDate: dateField,
  abstract: z.string().min(30).max(3000),
  purchasePrice: z.string().min(1).max(80)
});
