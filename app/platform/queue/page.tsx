import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getPlatformDashboardData } from "@/lib/services/dashboard-service";
import { PlatformRole } from "@/types/platform";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Publication Queue",
  description: "Accepted and published article queue for editor operations."
};

const allowedRoles: PlatformRole[] = ["editor"];

export default async function PlatformQueuePage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
        <PlatformAccessState
          allowedRoles={[...allowedRoles]}
          description="The publication queue is managed by editors responsible for scheduling, asset readiness, and outbound delivery."
          title="Queue operations are not available from the current role."
        />
    );
  }

  const dashboard = await getPlatformDashboardData(session);
  const accepted = dashboard.workflows.filter((item) => item.dashboardStatus === "accepted");
  const published = dashboard.workflows.filter((item) => item.dashboardStatus === "published");

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Track what is ready to move toward publication and what is already live on the magazine."
          eyebrow="Publication Queue"
          title="Accepted and published articles in one release view."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Accepted", meta: String(accepted.length), active: true },
            { label: "Published", meta: String(published.length) },
            { label: "Total", meta: String(accepted.length + published.length) }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 2xl:grid-cols-[1.14fr_0.86fr]">
        <Reveal>
          <TableCard description="Accepted and published articles across the editorial release cycle." title="Queue board">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {[...accepted, ...published].map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.summary}</p>
                    </td>
                    <td>
                      <p>{item.category}</p>
                      <p className="text-sm text-muted">{item.currentStep}</p>
                    </td>
                    <td>
                      <StatusBadge
                        label={item.dashboardStatusLabel}
                        tone={item.tone}
                      />
                    </td>
                    <td>{item.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Release checkpoints</p>
              <div className="mt-5 space-y-3">
                {[
                  "Accepted articles should have a clear next publication step and a confirmed editorial owner.",
                  "Published articles should retain a clean workflow history for auditability and author communication.",
                  "Use the workflow detail page to move accepted work into published once release conditions are met."
                ].map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Recent queue highlights</p>
              <div className="mt-5 space-y-4">
                {[...accepted, ...published].slice(0, 3).map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35" key={item.slug}>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.dashboardStatusLabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
