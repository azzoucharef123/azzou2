import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  displayName: z.string().max(120).nullable().optional(),
  headline: z.string().max(180).nullable().optional(),
  biography: z.string().max(3000).nullable().optional(),
  affiliation: z.string().max(180).nullable().optional(),
  avatarPath: z.string().max(255).nullable().optional()
});
