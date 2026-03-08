import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  const missingRuntime = [
    !env.hasDatabaseUrl ? "DATABASE_URL" : null,
    !env.hasSupabaseAuth ? "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY" : null
  ].filter(Boolean);

  const missingMigrations = [!env.hasDirectUrl ? "DIRECT_URL" : null].filter(Boolean);

  return NextResponse.json({
    status: missingRuntime.length === 0 ? "ok" : "degraded",
    service: "physics-chemistry-under-the-microscope",
    timestamp: new Date().toISOString(),
    siteUrl: env.SITE_URL,
    missingRuntimeConfiguration: missingRuntime,
    missingMigrationConfiguration: missingMigrations,
    envValidationIssues: env.validationIssues
  });
}
