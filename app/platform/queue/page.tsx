import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getPublicationQueue } from "@/lib/platform";
import { PlatformRole } from "@/types/platform";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Publication Queue",
  description: "Production scheduling, asset readiness, and release coordination across editorial channels."
};

const allowedRoles: PlatformRole[] = ["productionEditor", "managingEditor", "chiefEditor"];

export default async function PlatformQueuePage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
      <PlatformAccessState
        allowedRoles={[...allowedRoles]}
        description="The publication queue is managed by production and senior editorial roles responsible for scheduling, asset readiness, and outbound delivery."
        title="Queue operations are not available from the current role."
      />
    );
  }

  const queue = getPublicationQueue();
  const scheduled = queue.filter((item) => item.status === "scheduled").length;
  const ready = queue.filter((item) => item.status === "ready").length;
  const blocked = queue.filter((item) => item.status === "blocked").length;

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Coordinate website releases, issue packaging, and newsletter drops with clear production readiness signals."
          eyebrow="Publication Queue"
          title="Scheduling surfaces for release discipline and delivery quality."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Scheduled", meta: String(scheduled), active: true },
            { label: "Ready", meta: String(ready) },
            { label: "Blocked", meta: String(blocked) }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 2xl:grid-cols-[1.14fr_0.86fr]">
        <Reveal>
          <TableCard description="Production handoffs and publishing states across channels." title="Queue board">
            <table>
              <thead>
                <tr>
                  <th>Release</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.destination}</p>
                    </td>
                    <td>
                      <p>{item.channel}</p>
                      <p className="text-sm text-muted">{item.publishAt}</p>
                    </td>
                    <td>
                      <StatusBadge
                        label={item.status.replaceAll("-", " ")}
                        tone={
                          item.status === "scheduled"
                            ? "emerald"
                            : item.status === "ready"
                              ? "blue"
                              : item.status === "awaiting-assets"
                                ? "amber"
                                : "violet"
                        }
                      />
                    </td>
                    <td>{item.owner}</td>
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
                  "Homepage package ordering reviewed by the managing editor.",
                  "Newsletter subject line proofed against editorial tone and click-through clarity.",
                  "Cover image, captioning, and social crop approved by production."
                ].map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Upcoming windows</p>
              <div className="mt-5 space-y-4">
                {queue.slice(0, 3).map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35" key={item.id}>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.publishAt}</p>
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
