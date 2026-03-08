import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseConfigOptional(): SupabasePublicConfig | null {
  if (!env.hasSupabaseAuth) {
    return null;
  }

  // `env.hasSupabaseAuth` already checks for a valid http(s) URL and a non-placeholder anon key.
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  };
}

export function getSupabaseConfig(): SupabasePublicConfig {
  const config = getSupabaseConfigOptional();

  if (!config) {
    throw new ConfigurationError(
      "Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to real values."
    );
  }

  return config;
}

export function getSupabaseServiceRoleKey() {
  if (!env.hasSupabaseServiceRole) {
    throw new ConfigurationError("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return env.SUPABASE_SERVICE_ROLE_KEY as string;
}
