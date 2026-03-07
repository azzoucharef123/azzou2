import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseServiceRoleKey } from "@/lib/supabase/config";

export function createSupabaseServiceClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
