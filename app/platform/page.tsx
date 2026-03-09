import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileClock, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPlatformNavigation, getPlatformRoleLabel } from "@/lib/platform";
import { formatAuthorSubmissionStatus, formatEditorDashboardStatus } from "@/lib/platform-status";
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
  description: "Role-aware scientific publishing dashboard for authors and editors managing submissions, decisions, and publication progress."
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
  const notice = searchParams ? (await searchParams).notice : undefined;
  const roleLabel = getPlatformRoleLabel(session.activeRole);
  const pendingWorkflows = workflows.filter((item) => item.dashboardStatus === "pending_submissions");
  const reviewWorkflows = workflows.filter((item) => item.dashboardStatus === "under_review");
  const acceptedWorkflows = workflows.filter((item) => item.dashboardStatus === "accepted");
  const publishedWorkflows = workflows.filter((item) => item.dashboardStatus === "published");
  const mySubmissions = workflows.map((item) => ({
    ...item,
    authorStatusLabel: item.authorStatusLabel ?? formatAuthorSubmissionStatus(item.authorStatus)
  }));

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          action={
            <ButtonLink href={session.activeRole === "author" ? "/submit" : "/platform/notifications"} variant="secondary">
              {session.activeRole === "author" ? "Submit article" : "Open alerts"}
            </ButtonLink>
          }
          description={`Overview for the ${roleLabel} desk. This dashboard concentrates the live submission pipeline into a clear operational surface without the removed multi-role review complexity.`}
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
            { label: `${workflows.length} articles`, meta: "Live" },
            { label: `${roleNotifications.length} notices`, meta: "Unread" },
            { label: session.activeRole === "editor" ? `${publishedWorkflows.length} published` : `${mySubmissions.filter((item) => item.authorStatus === "pending").length} pending`, meta: "Status" }
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
          {session.activeRole === "editor" ? (
            <TableCard
              action={
                pendingWorkflows[0] ? (
                  <Link className="focus-ring inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-foreground/78 hover:text-foreground" href={`/platform/workflows/${pendingWorkflows[0].slug}`}>
                    Open next article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null
              }
              description="Editors can open any article, review its timeline, and change the current submission status from the workflow detail screen."
              title="Editorial management board"
            >
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Lane</th>
                    <th>Author</th>
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
                          <StatusBadge label={item.dashboardStatusLabel ?? formatEditorDashboardStatus(item.dashboardStatus)} tone={item.tone} />
                          <StatusBadge label={item.currentStep} tone="slate" />
                        </div>
                      </td>
                      <td>
                        <p className="font-medium text-foreground">{item.author}</p>
                        <p className="text-sm text-muted">{item.assignedTo}</p>
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
          ) : (
            <TableCard
              action={
                <ButtonLink href="/submit" variant="secondary">
                  New submission
                </ButtonLink>
              }
              description="Authors see a simplified decision state for each submission: pending, accepted, or rejected."
              title="My submissions"
            >
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map((item) => (
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
                            label={item.authorStatusLabel}
                            tone={item.authorStatus === "accepted" ? "emerald" : item.authorStatus === "rejected" ? "rose" : "amber"}
                          />
                          <StatusBadge label={item.currentStep} tone="slate" />
                        </div>
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
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <NotificationList items={roleNotifications} />
        </Reveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {session.activeRole === "editor" ? (
          <>
            {[
              { title: "Pending submissions", items: pendingWorkflows, tone: "amber" as const },
              { title: "Under review", items: reviewWorkflows, tone: "blue" as const },
              { title: "Accepted articles", items: acceptedWorkflows, tone: "emerald" as const }
            ].map((group, index) => (
              <Reveal delay={index * 0.05} key={group.title}>
                <div className="platform-panel rounded-[2rem] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
                    <StatusBadge label={String(group.items.length).padStart(2, "0")} tone={group.tone} />
                  </div>
                  <div className="mt-5 space-y-4">
                    {group.items.slice(0, 3).map((item) => (
                      <Link className="focus-ring block rounded-[1.4rem] border border-border bg-white/70 p-4 transition hover:bg-white dark:bg-slate-950/35 dark:hover:bg-slate-950/50" href={`/platform/workflows/${item.slug}`} key={item.slug}>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{item.author}</p>
                      </Link>
                    ))}
                    {!group.items.length ? (
                      <div className="rounded-[1.4rem] border border-dashed border-border bg-white/55 p-4 text-sm leading-6 text-muted dark:bg-slate-950/25">
                        No articles are currently in this lane.
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.15}>
              <div className="platform-panel rounded-[2rem] p-6 xl:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Published articles</p>
                    <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Recently published work</h2>
                  </div>
                  <StatusBadge label={String(publishedWorkflows.length).padStart(2, "0")} tone="emerald" />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {publishedWorkflows.map((item) => (
                    <Link className="focus-ring rounded-[1.4rem] border border-border bg-white/70 p-4 transition hover:bg-white dark:bg-slate-950/35 dark:hover:bg-slate-950/50" href={`/platform/workflows/${item.slug}`} key={item.slug}>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.category}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </>
        ) : (
          <>
            <Reveal>
              <div className="platform-panel rounded-[2rem] p-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Author shortcuts</p>
                <div className="mt-5 grid gap-3">
                  <ButtonLink href="/submit">Submit article</ButtonLink>
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
                <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  <FileClock className="h-4 w-4" />
                  Decision guide
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    "Pending covers every manuscript still inside editorial screening, revision, or internal review.",
                    "Accepted confirms the submission has cleared editorial decision-making and is moving toward publication.",
                    "Rejected means the current manuscript will not progress further in its present form."
                  ].map((item) => (
                    <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="platform-panel rounded-[2rem] p-6">
                <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  <Sparkles className="h-4 w-4" />
                  Submission rhythm
                </p>
                <div className="mt-5 space-y-4">
                  {mySubmissions.slice(0, 3).map((item) => (
                    <div className="rounded-[1.4rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35" key={item.slug}>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.authorStatusLabel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
