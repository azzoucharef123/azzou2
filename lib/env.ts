import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? undefined : trimmed;
}

function looksLikePlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.length === 0) {
    return true;
  }

  // Common placeholder conventions used in hosting dashboards and .env templates.
  const tokens = [
    "changeme",
    "change-me",
    "replace-me",
    "replace_this",
    "replace-this",
    "your-",
    "your_",
    "todo",
    "tbd",
    "placeholder",
    "<password>",
    "<your",
    "${",
    "xxx",
    "xxxx",
    "000000"
  ];

  if (normalized.includes("example.com") || normalized.includes("example.org") || normalized.includes("example.net")) {
    return true;
  }

  return tokens.some((token) => normalized.includes(token));
}

function dropPlaceholder(value: unknown) {
  const trimmed = emptyStringToUndefined(value);
  if (typeof trimmed !== "string") {
    return trimmed;
  }

  return looksLikePlaceholder(trimmed) ? undefined : trimmed;
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPostgresUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "postgres:" || parsed.protocol === "postgresql:";
  } catch {
    return false;
  }
}

function resolveSiteUrl(input: {
  explicit?: string;
  vercelUrl?: string;
  railwayStaticUrl?: string;
  railwayPublicDomain?: string;
}) {
  const candidates: Array<string | undefined> = [
    input.explicit,
    input.railwayStaticUrl,
    input.railwayPublicDomain ? `https://${input.railwayPublicDomain}` : undefined,
    input.vercelUrl ? `https://${input.vercelUrl}` : undefined
  ];

  for (const candidate of candidates) {
    if (candidate && isValidHttpUrl(candidate)) {
      return candidate.replace(/\/+$/, "");
    }
  }

  return "http://localhost:3000";
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  RAILWAY_STATIC_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  RAILWAY_PUBLIC_DOMAIN: z.preprocess(dropPlaceholder, z.string().optional()),
  DATABASE_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  DIRECT_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  NEXT_PUBLIC_SITE_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(dropPlaceholder, z.string().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(dropPlaceholder, z.string().optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(dropPlaceholder, z.string().optional()),
  RESEND_API_KEY: z.preprocess(emptyStringToUndefined, z.string().optional()),
  EMAIL_FROM: z.preprocess(emptyStringToUndefined, z.string().optional()),
  DEV_ENABLE_PLATFORM_IMPERSONATION: z.enum(["true", "false"]).optional()
});

const raw = {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL,
  RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  DEV_ENABLE_PLATFORM_IMPERSONATION: process.env.DEV_ENABLE_PLATFORM_IMPERSONATION
};

// Use safeParse so optional-but-invalid values (common on Railway/Vercel dashboards) do not crash the app at import time.
const parsedResult = envSchema.safeParse(raw);
const parsed = parsedResult.success
  ? parsedResult.data
  : (() => {
      const sanitized = { ...raw } as Record<string, unknown>;

      for (const issue of parsedResult.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          delete sanitized[key];
        }
      }

      return envSchema.parse(sanitized);
    })();

const siteUrl = resolveSiteUrl({
  explicit: parsed.NEXT_PUBLIC_SITE_URL && isValidHttpUrl(parsed.NEXT_PUBLIC_SITE_URL) ? parsed.NEXT_PUBLIC_SITE_URL : undefined,
  vercelUrl: parsed.VERCEL_URL,
  railwayStaticUrl: parsed.RAILWAY_STATIC_URL && isValidHttpUrl(parsed.RAILWAY_STATIC_URL) ? parsed.RAILWAY_STATIC_URL : undefined,
  railwayPublicDomain: parsed.RAILWAY_PUBLIC_DOMAIN
});

const hasSupabaseUrl = Boolean(parsed.NEXT_PUBLIC_SUPABASE_URL && isValidHttpUrl(parsed.NEXT_PUBLIC_SUPABASE_URL));
const hasSupabaseAnonKey = Boolean(parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const hasDatabaseUrl = Boolean(parsed.DATABASE_URL && isValidPostgresUrl(parsed.DATABASE_URL));
const hasDirectUrl = Boolean(parsed.DIRECT_URL && isValidPostgresUrl(parsed.DIRECT_URL));

export const env = {
  ...parsed,
  // Always safe to use in metadata and URLs. Falls back to localhost if unset/invalid.
  SITE_URL: siteUrl,
  isProduction: parsed.NODE_ENV === "production",
  isVercel: Boolean(parsed.VERCEL_ENV),
  hasDatabaseUrl,
  hasDirectUrl,
  hasSupabaseAuth: hasSupabaseUrl && hasSupabaseAnonKey,
  hasSupabaseServiceRole: Boolean(parsed.SUPABASE_SERVICE_ROLE_KEY),
  enablePlatformImpersonation: parsed.DEV_ENABLE_PLATFORM_IMPERSONATION === "true",
  validationIssues: parsedResult.success ? [] : parsedResult.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
};

export function getRequiredServerEnv<Key extends keyof typeof parsed>(key: Key) {
  const value = parsed[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }

  return value;
}

export function isPlaceholderEnvValue(value?: string | null) {
  if (!value) {
    return false;
  }

  return looksLikePlaceholder(value);
}

export function isValidSiteUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return isValidHttpUrl(value) && !looksLikePlaceholder(value);
}
