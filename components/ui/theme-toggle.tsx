"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle dark mode"
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-foreground hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/50 dark:hover:bg-slate-900"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
