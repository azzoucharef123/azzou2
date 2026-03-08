import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfigOptional } from "@/lib/supabase/config";

export function updateSupabaseSession(
  request: NextRequest
): {
  supabase: SupabaseClient | null;
  response: NextResponse;
} {
  const response = NextResponse.next({
    request
  });
  const config = getSupabaseConfigOptional();

  if (!config) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  return { supabase, response };
}
