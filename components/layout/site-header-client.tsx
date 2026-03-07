"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { mainNavigation, siteConfig } from "@/data/site";
import { AuthSession } from "@/lib/auth";
import { getPlatformRoleLabel } from "@/lib/platform";
import { ProfileMenu } from "@/components/auth/profile-menu";
import { ButtonLink } from "@/components/ui/button";
import { NavSearch } from "@/components/ui/nav-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeaderClient({ session }: { session: AuthSession | null }) {
  const [open, setOpen] = useState(false);
  const navigation = session ? [...mainNavigation, { label: "Platform", href: "/platform" }] : mainNavigation;
  const roleLabel = session ? getPlatformRoleLabel(session.activeRole) : null;
  const primaryAction = session ? (session.activeRole === "author" ? { href: "/submit", label: "Submit Article" } : { href: "/platform", label: "Open Platform" }) : null;

  return (
    <header className="sticky top-0 z-50 py-3">
      <div className="shell-wide">
        <div className="glass-panel flex h-20 items-center justify-between gap-4 rounded-[1.8rem] px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link className="focus-ring max-w-[16rem]" href="/">
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">Scientific Magazine</span>
              <span className="display-title block text-lg font-semibold leading-tight sm:text-[1.25rem]">{siteConfig.shortName}</span>
            </Link>
            <nav className="hidden items-center gap-5 lg:flex">
              {navigation.map((item) => (
                <Link className="focus-ring text-[0.83rem] font-medium uppercase tracking-[0.16em] text-foreground/72 hover:text-foreground" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <NavSearch />
            <Link
              aria-label="Search articles"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-foreground hover:bg-white lg:hidden dark:bg-slate-950/45 dark:hover:bg-slate-900"
              href="/articles"
            >
              <Search className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            {session && roleLabel ? (
              <span className="hidden rounded-full border border-border bg-white/70 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted xl:inline-flex dark:bg-slate-950/45">
                {roleLabel}
              </span>
            ) : null}
            {session ? (
              <>
                {primaryAction ? (
                  <ButtonLink className="hidden lg:inline-flex" href={primaryAction.href} variant="secondary">
                    {primaryAction.label}
                  </ButtonLink>
                ) : null}
                <ProfileMenu session={session} />
              </>
            ) : (
              <>
                <ButtonLink className="hidden lg:inline-flex" href="/login" variant="ghost">
                  Login
                </ButtonLink>
                <ButtonLink className="hidden lg:inline-flex" href="/signup" variant="secondary">
                  Sign Up
                </ButtonLink>
              </>
            )}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 lg:hidden dark:bg-slate-950/45"
              onClick={() => setOpen((current) => !current)}
              type="button"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="shell-wide pt-3 lg:hidden">
          <div className="glass-panel flex flex-col gap-4 rounded-[1.8rem] p-5">
            <div className="flex flex-col gap-3">
              {session ? (
                <>
                  {primaryAction ? (
                    <ButtonLink className="w-full" href={primaryAction.href} variant="secondary">
                      {primaryAction.label}
                    </ButtonLink>
                  ) : null}
                  <div className="rounded-[1.5rem] border border-border bg-white/60 p-4 dark:bg-slate-950/40">
                    <p className="display-title text-2xl font-semibold">{session.name}</p>
                    <p className="mt-1 text-sm text-muted">{session.email}</p>
                    <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">
                      Active role · {roleLabel}
                    </p>
                  </div>
                  <ProfileMenu compact session={session} />
                </>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <ButtonLink className="w-full" href="/login" variant="ghost">
                    Login
                  </ButtonLink>
                  <ButtonLink className="w-full" href="/signup" variant="secondary">
                    Sign Up
                  </ButtonLink>
                </div>
              )}
            </div>
            {navigation.map((item) => (
              <Link
                className="focus-ring rounded-2xl border border-border bg-white/60 px-4 py-3 text-sm font-medium dark:bg-slate-950/40"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
