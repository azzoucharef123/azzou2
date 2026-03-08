"use client";

import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useAuthSession } from "@/components/auth/use-auth-session";

export function HomeContributionActions() {
  const { session, loading } = useAuthSession();
  const chips = session
    ? session.activeRole === "author"
      ? ["Commissioned features", "Research summaries", "Interviews & essays"]
      : ["Role-based dashboards", "Editorial approvals", "Production operations"]
    : ["Author registration", "Protected submissions", "Editorial review"];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
        {loading ? (
          <>
            <span className="h-12 rounded-full border border-border bg-white/50 dark:bg-slate-950/40" />
            <span className="h-12 rounded-full border border-border bg-white/50 dark:bg-slate-950/40" />
          </>
        ) : session ? (
          session.activeRole === "author" ? (
            <>
              <ButtonLink href="/submit">Submit Article</ButtonLink>
              <ButtonLink href="/platform" variant="secondary">
                Open publishing platform
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/platform">Open publishing platform</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact the editorial desk
              </ButtonLink>
            </>
          )
        ) : (
          <>
            <ButtonLink href="/signup">Become an author</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Login to submit
            </ButtonLink>
          </>
        )}
      </div>
      <div className="relative mt-8 grid gap-4 md:grid-cols-3">
        {chips.map((item) => (
          <div className="rounded-[1.7rem] border border-border bg-white/70 p-5 text-sm font-medium text-muted dark:bg-slate-950/40" key={item}>
            <Sparkles className="mb-3 h-4 w-4 text-blue-700 dark:text-sky-300" />
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
