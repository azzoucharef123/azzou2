import { spawnSync } from "node:child_process";

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

function isConfigured(name) {
  const value = process.env[name];
  return Boolean(value && !looksLikePlaceholder(value));
}

function isValidPostgresUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "postgres:" || parsed.protocol === "postgresql:";
  } catch {
    return false;
  }
}

function getPrismaBin() {
  return process.platform === "win32" ? "node_modules/.bin/prisma.cmd" : "node_modules/.bin/prisma";
}

function runPrismaMigrateDeploy() {
  const prismaBin = getPrismaBin();
  const result = spawnSync(prismaBin, ["migrate", "deploy"], {
    stdio: "inherit",
    env: process.env
  });

  if (result.error) {
    console.error("[railway-predeploy] Failed to run prisma migrate deploy:", result.error);
    process.exit(1);
  }

  process.exit(result.status ?? 0);
}

const hasDatabaseUrl = isConfigured("DATABASE_URL");
const hasDirectUrl = isConfigured("DIRECT_URL");

if (!hasDatabaseUrl || !hasDirectUrl) {
  console.warn("[railway-predeploy] Skipping Prisma migrations because database env vars are not configured with real values.");
  console.warn(
    "[railway-predeploy] Required for migrations: DATABASE_URL and DIRECT_URL. Set them in Railway Variables, then redeploy."
  );
  process.exit(0);
}

if (!isValidPostgresUrl(process.env.DATABASE_URL) || !isValidPostgresUrl(process.env.DIRECT_URL)) {
  console.warn("[railway-predeploy] Skipping Prisma migrations because DATABASE_URL or DIRECT_URL is not a valid Postgres URL.");
  console.warn("[railway-predeploy] Expected schemes: postgresql:// or postgres://");
  process.exit(0);
}

runPrismaMigrateDeploy();
