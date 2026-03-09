import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { formatEditorDashboardStatus } from "@/lib/platform-status";
import { getPlatformDashboardData } from "@/lib/services/dashboard-service";
import { PlatformRole } from "@/types/platform";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Submission Board",
  description: "Editor workspace for triaging pending and in-progress submissions."
};

const allowedRoles: PlatformRole[] = ["editor"];

export default async function PlatformReviewsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
        <PlatformAccessState
          allowedRoles={[...allowedRoles]}
          description="The submission board is reserved for editors handling article triage, status updates, and editorial oversight."
          title="Submission management is not available from the current desk."
        />
    );
  }

  const dashboard = await getPlatformDashboardData(session);
  const items = dashboard.workflows;
  const pending = items.filter((item) => item.dashboardStatus === "pending_submissions");
  const reviewing = items.filter((item) => item.dashboardStatus === "under_review");

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Use this board to triage new submissions, track active editorial review, and open article detail pages for direct status management."
          eyebrow="Submission Board"
          title="A clear editorial lane for pending and active manuscripts."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Pending", meta: `${pending.length}`, active: true },
            { label: "Under review", meta: `${reviewing.length}` },
            { label: "All submissions", meta: `${items.length}` }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <TableCard
            description="New or unresolved articles waiting for an editor decision or next action."
            title="Pending submissions"
          >
            <table>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link className="focus-ring block font-semibold text-foreground hover:text-blue-700 dark:hover:text-sky-300" href={`/platform/workflows/${item.slug}`}>
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{item.summary}</p>
                    </td>
                    <td>
                      <p>{item.author}</p>
                      <p className="text-sm text-muted">{item.category}</p>
                    </td>
                    <td>
                      <StatusBadge label={item.dashboardStatusLabel ?? formatEditorDashboardStatus(item.dashboardStatus)} tone={item.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>
        <Reveal delay={0.08}>
          <TableCard description="Articles currently in the editor-managed assessment lane." title="Under review">
            <table>
              <thead>
                <tr>
                  <th>Manuscript</th>
                  <th>Current stage</th>
                  <th>Lead editor</th>
                </tr>
              </thead>
              <tbody>
                {reviewing.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link className="focus-ring block font-semibold text-foreground hover:text-blue-700 dark:hover:text-sky-300" href={`/platform/workflows/${item.slug}`}>
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{item.category}</p>
                    </td>
                    <td>
                      <StatusBadge
                        label={item.currentStep}
                        tone={item.tone}
                      />
                    </td>
                    <td>
                      <p>{item.assignedTo}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </Reveal>
      </div>
    </div>
  );
}
