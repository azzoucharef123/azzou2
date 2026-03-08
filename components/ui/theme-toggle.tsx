"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "pc-microscope-theme";

function getSystemTheme(mediaQuery: MediaQueryList) {
  return mediaQuery.matches ? "dark" : "light";
}

function getStoredTheme() {
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme() {
      const nextTheme = getStoredTheme() ?? getSystemTheme(mediaQuery);
      applyTheme(nextTheme);
      setTheme(nextTheme);
    }

    function handleMediaChange() {
      if (!getStoredTheme()) {
        syncTheme();
      }
    }

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key === THEME_STORAGE_KEY) {
        syncTheme();
      }
    }

    syncTheme();
    mediaQuery.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("theme-change", syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("theme-change", syncTheme);
    };
  }, []);

  const isDark = theme === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <button
      aria-label="Toggle dark mode"
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-foreground hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/50 dark:hover:bg-slate-900"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
