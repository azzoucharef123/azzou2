import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  DATABASE_URL: z.preprocess(emptyStringToUndefined, z.string().optional()),
  DIRECT_URL: z.preprocess(emptyStringToUndefined, z.string().optional()),
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  RESEND_API_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  EMAIL_FROM: z.preprocess(emptyStringToUndefined, z.string().optional()),
  DEV_ENABLE_PLATFORM_IMPERSONATION: z.enum(["true", "false"]).optional()
});

const parsed = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  DEV_ENABLE_PLATFORM_IMPERSONATION: process.env.DEV_ENABLE_PLATFORM_IMPERSONATION
});

export const env = {
  ...parsed,
  isProduction: parsed.NODE_ENV === "production",
  isVercel: Boolean(parsed.VERCEL_ENV),
  hasDatabaseUrl: Boolean(parsed.DATABASE_URL),
  hasSupabaseAuth: Boolean(parsed.NEXT_PUBLIC_SUPABASE_URL && parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  hasSupabaseServiceRole: Boolean(parsed.SUPABASE_SERVICE_ROLE_KEY),
  enablePlatformImpersonation: parsed.DEV_ENABLE_PLATFORM_IMPERSONATION === "true"
};

export function getRequiredServerEnv<Key extends keyof typeof parsed>(key: Key) {
  const value = parsed[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
