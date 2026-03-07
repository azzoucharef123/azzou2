import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarRange, Clock3 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPlatformNavigation, getPlatformRoleLabel } from "@/lib/platform";
import { getPlatformDashboardData } from "@/lib/services/dashboard-service";
import { formatDate } from "@/lib/utils";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { MetricCard } from "@/components/platform/metric-card";
import { NotificationList } from "@/components/platform/notification-list";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Platform Dashboard",
  description: "Role-aware scientific publishing dashboard with workflow, review, approval, and queue visibility."
};

export default async function PlatformDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const dashboard = await getPlatformDashboardData(session);
  const metrics = dashboard.metrics;
  const workflows = dashboard.workflows;
  const roleNavigation = getPlatformNavigation(session.activeRole);
  const roleNotifications = dashboard.notifications;
  const approvals = dashboard.approvals;
  const queue = dashboard.queue;
  const templates = dashboard.reviewTemplates;
  const notice = searchParams ? (await searchParams).notice : undefined;
  const roleLabel = getPlatformRoleLabel(session.activeRole);

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          action={
            <ButtonLink href={session.activeRole === "author" ? "/submit" : "/platform/notifications"} variant="secondary">
              {session.activeRole === "author" ? "New submission" : "Open alerts"}
            </ButtonLink>
          }
          description={`Overview for the ${roleLabel} desk. This dashboard brings active manuscripts, decisions, delivery signals, and editorial pacing into one premium control surface.`}
          eyebrow="Dashboard"
          title={`${roleLabel} operations at a glance.`}
        />
      </Reveal>

      {notice ? (
        <Reveal delay={0.04}>
          <div className="platform-panel rounded-[1.8rem] p-5">
            <p className="text-sm leading-7 text-muted">{notice}</p>
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <FilterChipBar
          items={[
            { label: roleLabel, meta: "Current role", active: true },
            { label: `${workflows.length} workflows`, meta: "Live" },
            { label: `${roleNotifications.length} notices`, meta: "Unread" },
            { label: `${queue.length} queue items`, meta: "Ops" }
          ]}
        />
      </Reveal>

      <div className="metric-grid">
        {metrics.map((metric, index) => (
          <Reveal delay={index * 0.05} key={metric.label}>
            <MetricCard metric={metric} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.18fr_0.82fr]">
        <Reveal>
          <TableCard
            action={
              <Link className="focus-ring inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-foreground/78 hover:text-foreground" href="/platform/workflows/quantum-sensors-in-noisy-labs">
                Inspect workflow
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
            description="Manuscripts moving through the protected editorial pipeline, with status, priority, and current ownership."
            title="Live article workflows"
          >
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link className="focus-ring block font-semibold text-foreground hover:text-blue-700 dark:hover:text-sky-300" href={`/platform/workflows/${item.slug}`}>
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{item.summary}</p>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <StatusBadge
                          label={item.status.replaceAll("_", " ")}
                          tone={item.status === "accepted" || item.status === "published" ? "emerald" : item.status === "under_review" ? "blue" : "amber"}
                        />
                        <StatusBadge label={`${item.priority} priority`} tone={item.priority === "High" ? "violet" : "slate"} />
                      </div>
                    </td>
                    <td>
                      <p className="font-medium text-foreground">{item.assignedTo}</p>
                      <p className="text-sm text-muted">{item.currentStep}</p>
                    </td>
                    <td>
                      <p>{formatDate(item.updatedAt)}</p>
                      <p className="text-sm text-muted">{item.category}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>

        <Reveal delay={0.08}>
          <NotificationList items={roleNotifications} />
        </Reveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal>
          <div className="platform-panel rounded-[2rem] p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Role shortcuts</p>
            <div className="mt-5 grid gap-3">
              {roleNavigation.slice(1).map((item) => (
                <Link className="focus-ring rounded-[1.3rem] border border-border bg-white/70 px-4 py-4 text-sm font-medium text-foreground/82 hover:bg-white dark:bg-slate-950/35 dark:hover:bg-slate-950/50" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="platform-panel rounded-[2rem] p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Approvals snapshot</p>
            <div className="mt-5 space-y-4">
              {approvals.slice(0, 3).map((item) => (
                <div className="rounded-[1.4rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{item.articleTitle}</p>
                    <StatusBadge
                      label={item.status.replaceAll("-", " ")}
                      tone={item.status === "approved-for-production" ? "emerald" : item.status === "hold" ? "amber" : "violet"}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="platform-panel rounded-[2rem] p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Desk rhythm</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarRange className="h-4 w-4 text-blue-700 dark:text-sky-300" />
                  Next publication window
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{queue[0]?.publishAt}</p>
              </div>
              <div className="rounded-[1.4rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock3 className="h-4 w-4 text-blue-700 dark:text-sky-300" />
                  Review standard
                </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {templates[0]?.recommendation.replace("_", " ")} currently leads the active physics feature packet.
                  </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
