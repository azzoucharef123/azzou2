import { z } from "zod";

export const submitReviewSchema = z.object({
  recommendation: z.enum(["accept", "minor_revision", "major_revision", "reject"]),
  summary: z.string().min(20).max(3000),
  confidentialNote: z.string().max(2000).optional()
});
