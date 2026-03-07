import { Bell, ShieldCheck, Sparkles } from "lucide-react";
import { AuthSession } from "@/lib/auth";
import { getPlatformRoleLabel, getPlatformRoleSummary } from "@/lib/platform";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function PlatformLayoutShell({
  session,
  children
}: {
  session: AuthSession;
  children: React.ReactNode;
}) {
  const roleLabel = getPlatformRoleLabel(session.activeRole);
  const roleSummary = getPlatformRoleSummary(session.activeRole);

  return (
    <div className="shell-wide pt-6 pb-20">
      <Reveal>
        <section className="glass-panel relative overflow-hidden rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,78,207,.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.12),transparent_26%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-5">
              <span className="eyebrow">Private Editorial Platform</span>
              <div className="space-y-4">
                <h1 className="display-title text-4xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-5xl lg:text-[4rem]">
                  Scientific publishing operations with magazine-level clarity.
                </h1>
                <p className="max-w-4xl body-copy text-lg leading-8 text-foreground/82">
                  {roleLabel} workspace. {roleSummary}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted dark:bg-slate-950/40">
                  Active role · {roleLabel}
                </span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted dark:bg-slate-950/40">
                  Protected workspace
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href="/platform/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </ButtonLink>
              {session.activeRole === "author" ? (
                <ButtonLink href="/submit" variant="secondary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Submit article
                </ButtonLink>
              ) : (
                <ButtonLink href="/" variant="secondary">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Magazine home
                </ButtonLink>
              )}
            </div>
          </div>
        </section>
      </Reveal>
      <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <PlatformSidebar session={session} />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
