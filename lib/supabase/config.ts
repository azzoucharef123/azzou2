import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";

export function getSupabaseConfig() {
  if (!env.hasSupabaseAuth) {
    throw new ConfigurationError("Supabase Auth environment variables are not configured.");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  };
}

export function getSupabaseServiceRoleKey() {
  if (!env.hasSupabaseServiceRole) {
    throw new ConfigurationError("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return env.SUPABASE_SERVICE_ROLE_KEY as string;
}
