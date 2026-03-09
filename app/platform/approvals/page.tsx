import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { formatEditorDashboardStatus } from "@/lib/platform-status";
import { getPlatformDashboardData } from "@/lib/services/dashboard-service";
import { PlatformRole } from "@/types/platform";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { MetricCard } from "@/components/platform/metric-card";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Editorial Decisions",
  description: "Accepted and rejected article decisions for the editor dashboard."
};

const allowedRoles: PlatformRole[] = ["editor"];

export default async function PlatformApprovalsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
        <PlatformAccessState
          allowedRoles={[...allowedRoles]}
          description="Editorial decisions are reserved for editors handling article outcomes and publication readiness."
          title="Decision controls require an editor account."
        />
    );
  }

  const dashboard = await getPlatformDashboardData(session);
  const items = dashboard.workflows;
  const accepted = items.filter((item) => item.dashboardStatus === "accepted");
  const rejected = items.filter((item) => item.authorStatus === "rejected");
  const pending = items.filter((item) => item.dashboardStatus === "pending_submissions" || item.dashboardStatus === "under_review");

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Review live editorial outcomes, keep accepted articles moving toward publication, and monitor rejected manuscripts with full context."
          eyebrow="Editorial Decisions"
          title="Accepted and rejected manuscripts in one decision view."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Pending", meta: String(pending.length), active: true },
            { label: "Accepted", meta: String(accepted.length) },
            { label: "Rejected", meta: String(rejected.length) }
          ]}
        />
      </Reveal>
      <div className="metric-grid">
        <Reveal>
          <MetricCard metric={{ label: "Pending decisions", value: String(pending.length).padStart(2, "0"), delta: "Still awaiting an editor outcome", tone: "amber" }} />
        </Reveal>
        <Reveal delay={0.05}>
          <MetricCard metric={{ label: "Accepted", value: String(accepted.length).padStart(2, "0"), delta: "Ready for queue handoff", tone: "emerald" }} />
        </Reveal>
        <Reveal delay={0.1}>
          <MetricCard metric={{ label: "Rejected", value: String(rejected.length).padStart(2, "0"), delta: "Closed in the current cycle", tone: "violet" }} />
        </Reveal>
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
        <Reveal>
          <TableCard description="Articles that have reached a clear editor decision." title="Decision ledger">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Outcome</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {[...accepted, ...rejected].map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link className="focus-ring block font-semibold text-foreground hover:text-blue-700 dark:hover:text-sky-300" href={`/platform/workflows/${item.slug}`}>
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{item.summary}</p>
                    </td>
                    <td>
                      <StatusBadge
                        label={item.authorStatusLabel}
                        tone={item.authorStatus === "accepted" ? "emerald" : "rose"}
                      />
                    </td>
                    <td>
                      <StatusBadge label={item.dashboardStatusLabel ?? formatEditorDashboardStatus(item.dashboardStatus)} tone={item.tone} />
                    </td>
                    <td>
                      <p>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "N/A"}</p>
                      <p className="text-sm text-muted">{item.assignedTo}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Decision checklist</p>
              <div className="mt-5 space-y-3">
                {[
                  "Accepted articles should have clear publication next steps and author communication already drafted.",
                  "Rejected submissions should record enough editorial rationale for the author to understand the outcome.",
                  "Every decision should remain proportional to the evidence, framing, and scope promised by the submission."
                ].map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">How to act</p>
              <p className="mt-5 text-sm leading-7 text-muted">
                Open any article from the decision ledger to change its status directly from the workflow detail page. The editor controls there keep the author-facing status and editorial history in sync.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
