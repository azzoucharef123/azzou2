import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const port = process.env.PORT ?? "3000";
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

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
