"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileClock, LayoutDashboard } from "lucide-react";
import { AuthSession } from "@/lib/auth";
import { getPlatformNavigation, getPlatformRoleLabel, getPlatformRoleSummary } from "@/lib/platform";
import { cn } from "@/lib/utils";

export function PlatformSidebar({ session }: { session: AuthSession }) {
  const pathname = usePathname();
  const navigation = getPlatformNavigation(session.activeRole);

  return (
    <>
      <div className="xl:hidden">
        <div className="platform-panel overflow-x-auto rounded-[1.8rem] p-3">
          <div className="flex gap-3">
            {navigation.map((item) => (
              <Link
                className={cn(
                  "focus-ring whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "border-blue-500/30 bg-blue-500/10 text-foreground"
                    : "border-border bg-white/70 text-muted dark:bg-slate-950/40"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <aside className="hidden xl:block">
        <div className="sticky top-28 space-y-5">
          <div className="platform-panel rounded-[2rem] p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Active desk</p>
            <h2 className="display-title mt-3 text-[2rem] font-semibold leading-[0.98]">{getPlatformRoleLabel(session.activeRole)}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{getPlatformRoleSummary(session.activeRole)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40">
                Signed in as {session.initials}
              </span>
              <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40">
                Private workspace
              </span>
            </div>
          </div>
          <nav className="platform-panel rounded-[2rem] p-4">
            <div className="mb-3 px-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Navigation</div>
            <div className="grid gap-2">
              {navigation.map((item, index) => (
                <Link
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-[1.2rem] border px-4 py-3 text-sm font-medium",
                    pathname === item.href
                      ? "border-blue-500/30 bg-[linear-gradient(135deg,rgba(23,78,207,.12),rgba(34,211,238,.08))] text-foreground"
                      : "border-transparent text-foreground/78 hover:border-border hover:bg-white/68 dark:hover:bg-slate-950/35"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {index === 0 ? <LayoutDashboard className="h-4 w-4" /> : index === navigation.length - 1 ? <Bell className="h-4 w-4" /> : <FileClock className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
