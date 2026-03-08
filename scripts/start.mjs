import { spawn } from "node:child_process";
import { createRequire } from "node:module";

function looksLikePlaceholder(value) {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;

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

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function printConfigWarnings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const warnings = [];

  if (!siteUrl || looksLikePlaceholder(siteUrl) || !isValidHttpUrl(siteUrl)) {
    warnings.push("NEXT_PUBLIC_SITE_URL is missing/invalid. Canonical metadata will fall back to http://localhost:3000.");
  }

  if (!supabaseUrl || looksLikePlaceholder(supabaseUrl) || !isValidHttpUrl(supabaseUrl)) {
    warnings.push("Supabase Auth disabled: NEXT_PUBLIC_SUPABASE_URL is missing/placeholder/invalid.");
  }

  if (!supabaseAnon || looksLikePlaceholder(supabaseAnon)) {
    warnings.push("Supabase Auth disabled: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing/placeholder.");
  }

  if (!databaseUrl || looksLikePlaceholder(databaseUrl)) {
    warnings.push("Prisma-backed features disabled: DATABASE_URL is missing/placeholder.");
  }

  if (!directUrl || looksLikePlaceholder(directUrl)) {
    warnings.push("Prisma migrations may be skipped/fail: DIRECT_URL is missing/placeholder.");
  }

  if (warnings.length) {
    console.warn("[startup] Configuration warnings:");
    for (const warning of warnings) {
      console.warn(`[startup] - ${warning}`);
    }
  }
}

const port = process.env.PORT ?? "3000";
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

printConfigWarnings();

const child = spawn(process.execPath, [nextBin, "start", "-p", port, "-H", hostname], {
  stdio: "inherit",
  env: process.env
});

child.on("error", (error) => {
  console.error("Failed to start the Next.js production server.", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
