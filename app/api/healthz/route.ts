import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  const missing = [
    !env.hasDatabaseUrl ? "DATABASE_URL" : null,
    !env.hasSupabaseAuth ? "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY" : null
  ].filter(Boolean);

  return NextResponse.json({
    status: missing.length === 0 ? "ok" : "degraded",
    service: "physics-chemistry-under-the-microscope",
    timestamp: new Date().toISOString(),
    missingConfiguration: missing
  });
}
