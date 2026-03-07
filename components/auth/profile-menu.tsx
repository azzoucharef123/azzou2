"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Orbit, PanelLeft, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { AuthSession } from "@/lib/auth";
import { getPlatformRoleLabel } from "@/lib/platform";

export function ProfileMenu({
  session,
  compact = false
}: {
  session: AuthSession;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRoleLabel = getPlatformRoleLabel(session.activeRole);
  const primaryAction = session.activeRole === "author" ? { href: "/submit", label: "Submit Article", icon: UserRound } : { href: "/platform", label: "Open Platform", icon: PanelLeft };

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-border bg-white/70 p-4 dark:bg-slate-950/40">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Platform access</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Access is now driven by Supabase-authenticated roles and editorial capabilities. Seeded accounts provide author, reviewer, editor, and chief editor desk coverage.
          </p>
        </div>
        <Link
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white/72 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground dark:bg-slate-950/50"
          href={primaryAction.href}
        >
          <primaryAction.icon className="h-4 w-4" />
          {primaryAction.label}
        </Link>
        <form action={logoutAction}>
          <button
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white/72 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground dark:bg-slate-950/50"
            type="submit"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative hidden lg:block" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-label="Open profile menu"
        className="focus-ring inline-flex h-11 items-center gap-3 rounded-full border border-border bg-white/72 px-3 py-2 dark:bg-slate-950/50"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#07152d,#2368c5)] text-xs font-semibold text-white">
          {session.initials}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open ? (
        <div className="editorial-card absolute right-0 top-14 z-50 w-[24rem] rounded-[1.8rem] p-4">
          <div className="rounded-[1.4rem] border border-border bg-white/65 p-4 dark:bg-slate-950/35">
            <p className="display-title text-2xl font-semibold">{session.name}</p>
            <p className="mt-1 text-sm text-muted">{session.email}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">
              <Orbit className="h-4 w-4" />
              Active desk · {activeRoleLabel}
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            <Link
              className="focus-ring inline-flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium text-foreground hover:bg-white/75 dark:hover:bg-slate-950/40"
              href={primaryAction.href}
              onClick={() => setOpen(false)}
            >
              <primaryAction.icon className="h-4 w-4" />
              {primaryAction.label}
            </Link>
            <Link
              className="focus-ring inline-flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium text-foreground hover:bg-white/75 dark:hover:bg-slate-950/40"
              href="/platform"
              onClick={() => setOpen(false)}
            >
              <PanelLeft className="h-4 w-4" />
              Platform dashboard
            </Link>
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-border bg-white/65 p-4 dark:bg-slate-950/35">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Role architecture</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              The current desk is derived from the authenticated account’s canonical role plus editorial capability flags. No client-side role switching is used in production mode.
            </p>
          </div>
          <div className="mt-4">
            <form action={logoutAction}>
              <button
                className="focus-ring inline-flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-white/75 dark:hover:bg-slate-950/40"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
