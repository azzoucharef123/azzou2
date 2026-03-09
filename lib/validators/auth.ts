import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.string().optional()
});

export const signupSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8),
  affiliation: z.string().min(2).max(160),
  headline: z.string().min(2).max(160).optional(),
  redirectTo: z.string().optional()
});

export const bootstrapProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  role: z.enum(["author", "editor"]).default("author")
});
