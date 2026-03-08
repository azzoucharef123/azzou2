import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getReviewTemplates, getWorkflowItems } from "@/lib/platform";
import { PlatformRole } from "@/types/platform";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { ReviewScoreCard } from "@/components/platform/review-score-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const ReviewFormDemo = dynamic(() => import("@/components/platform/review-form-demo").then((mod) => mod.ReviewFormDemo), {
  loading: () => <div className="platform-panel rounded-[2rem] p-6 sm:p-7"><div className="h-72 rounded-[1.4rem] bg-white/45 dark:bg-slate-950/35" /></div>
});

export const metadata: Metadata = {
  title: "Review Forms",
  description: "Structured scientific review interfaces for manuscripts moving through editorial evaluation."
};

const allowedRoles: PlatformRole[] = ["reviewer", "managingEditor", "chiefEditor"];

export default async function PlatformReviewsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
      <PlatformAccessState
        allowedRoles={[...allowedRoles]}
        description="The review desk is reserved for reviewers and senior editors who need scoring forms, confidential notes, and recommendation tracking."
        title="Review forms are not available from the current desk."
      />
    );
  }

  const templates = getReviewTemplates();
  const items = getWorkflowItems();

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Evaluate manuscripts with calibrated scoring, concise methodological notes, and editorial-ready recommendations."
          eyebrow="Review Forms"
          title="Scientific review surfaces built for clarity and proportion."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Assigned", meta: `${items.length}` },
            { label: "Minor revision", meta: "Current", active: true },
            { label: "Confidential", meta: "Protected" }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 xl:grid-cols-2">
        {templates.map((template, index) => (
          <Reveal delay={index * 0.05} key={template.id}>
            <ReviewScoreCard template={template} />
          </Reveal>
        ))}
      </div>
      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <ReviewFormDemo />
        </Reveal>
        <Reveal delay={0.08}>
          <TableCard
            description="Assigned manuscripts that still need reviewer scoring or editorial synthesis."
            title="Assigned manuscripts"
          >
            <table>
              <thead>
                <tr>
                  <th>Manuscript</th>
                  <th>Current stage</th>
                  <th>Reviewers</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
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
                        tone={item.status === "accepted" || item.status === "published" ? "emerald" : item.status === "under_review" ? "blue" : "amber"}
                      />
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {item.reviewers.map((reviewer) => (
                          <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={reviewer}>
                            {reviewer}
                          </span>
                        ))}
                      </div>
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
