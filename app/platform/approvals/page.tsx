import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getApprovalItems } from "@/lib/platform";
import { PlatformRole } from "@/types/platform";
import { ApprovalDecisionPanel } from "@/components/platform/approval-decision-panel";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { MetricCard } from "@/components/platform/metric-card";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Chief Editor Approvals",
  description: "Final editorial approvals, risk review, and production sign-off for the scientific publishing platform."
};

const allowedRoles: PlatformRole[] = ["chiefEditor", "managingEditor"];

export default async function PlatformApprovalsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
      <PlatformAccessState
        allowedRoles={[...allowedRoles]}
        description="Chief editor approvals are reserved for final-decision desks handling sensitive framing, elevated claims, and production release authority."
        title="Approval controls require a senior editorial role."
      />
    );
  }

  const items = getApprovalItems();
  const pending = items.filter((item) => item.status === "pending-chief-editor").length;
  const approved = items.filter((item) => item.status === "approved-for-production").length;
  const hold = items.filter((item) => item.status === "hold").length;

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Resolve elevated-risk features, confirm methodological framing, and release approved packets into production with full editorial confidence."
          eyebrow="Chief Editor"
          title="Final sign-off and publication authority."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Pending sign-off", meta: String(pending), active: true },
            { label: "Approved", meta: String(approved) },
            { label: "On hold", meta: String(hold) }
          ]}
        />
      </Reveal>
      <div className="metric-grid">
        <Reveal>
          <MetricCard metric={{ label: "Pending approvals", value: String(pending).padStart(2, "0"), delta: "Requires senior review", tone: "violet" }} />
        </Reveal>
        <Reveal delay={0.05}>
          <MetricCard metric={{ label: "Approved for production", value: String(approved).padStart(2, "0"), delta: "Ready for queue handoff", tone: "emerald" }} />
        </Reveal>
        <Reveal delay={0.1}>
          <MetricCard metric={{ label: "Editorial holds", value: String(hold).padStart(2, "0"), delta: "Awaiting clarification", tone: "amber" }} />
        </Reveal>
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.12fr_0.88fr]">
        <Reveal>
          <TableCard description="Sensitive or elevated manuscripts awaiting final decision." title="Approval queue">
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-semibold text-foreground">{item.articleTitle}</p>
                      <p className="mt-1 text-sm text-muted">{item.summary}</p>
                    </td>
                    <td>
                      <StatusBadge
                        label={item.riskLevel}
                        tone={item.riskLevel === "Routine" ? "emerald" : item.riskLevel === "Elevated" ? "violet" : "amber"}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        label={item.status.replaceAll("-", " ")}
                        tone={item.status === "approved-for-production" ? "emerald" : item.status === "hold" ? "amber" : "violet"}
                      />
                    </td>
                    <td>
                      <p>{item.deadline}</p>
                      <p className="text-sm text-muted">{item.leadEditor}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <ApprovalDecisionPanel />
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Approval checklist</p>
              <div className="mt-5 space-y-3">
                {[
                  "Claims remain proportional to cited evidence and operational context.",
                  "Source sensitivity and commercial implications have been reviewed.",
                  "Headline, deck, and social teaser language are aligned with editorial caution."
                ].map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    {item}
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
