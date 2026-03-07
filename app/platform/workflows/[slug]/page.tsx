import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getApprovalItems, getReviewTemplates, getWorkflowBySlug, getWorkflowItems } from "@/lib/platform";
import { PlatformRole } from "@/types/platform";
import { formatDate } from "@/lib/utils";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { ReviewScoreCard } from "@/components/platform/review-score-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { WorkflowTimeline } from "@/components/platform/workflow-timeline";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function generateStaticParams() {
  return getWorkflowItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkflowBySlug(slug);

  return {
    title: item ? `${item.title} Workflow` : "Workflow detail",
    description: item ? item.summary : "Protected workflow detail page."
  };
}

const allowedRoles: PlatformRole[] = ["author", "reviewer", "managingEditor", "chiefEditor"];

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
      <PlatformAccessState
        allowedRoles={[...allowedRoles]}
        description="Workflow detail pages are reserved for the roles directly involved in manuscript development, review, and senior editorial decision-making."
        title="Workflow detail is not exposed to the current desk."
      />
    );
  }

  const { slug } = await params;
  const item = getWorkflowBySlug(slug);

  if (!item) {
    notFound();
  }

  const reviewTemplate = getReviewTemplates()[0];
  const approval = getApprovalItems().find((entry) => entry.articleTitle === item.title);

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              {session.activeRole === "author" ? <ButtonLink href="/submit">Submit revision</ButtonLink> : null}
              <ButtonLink href="/platform/notifications" variant="secondary">
                View alerts
              </ButtonLink>
            </div>
          }
          description={item.summary}
          eyebrow="Workflow Detail"
          title={item.title}
        />
      </Reveal>

      <Reveal delay={0.04}>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={item.category} tone="blue" />
          <StatusBadge label={item.status.replaceAll("_", " ")} tone={item.status === "accepted" || item.status === "published" ? "emerald" : item.status === "under_review" ? "blue" : "amber"} />
          <StatusBadge label={`${item.priority} priority`} tone={item.priority === "High" ? "violet" : "slate"} />
          <StatusBadge label={item.currentStep} tone="cyan" />
        </div>
      </Reveal>

      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="space-y-6">
            <div className="platform-panel rounded-[2rem] p-6 sm:p-7">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Manuscript overview</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Author</p>
                  <p className="mt-2 font-semibold text-foreground">{item.author}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Assigned editor</p>
                  <p className="mt-2 text-sm text-foreground/82">{item.assignedTo}</p>
                </div>
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Submitted</p>
                  <p className="mt-2 text-sm text-foreground/82">{formatDate(item.submittedAt)}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Last updated</p>
                  <p className="mt-2 text-sm text-foreground/82">{formatDate(item.updatedAt)}</p>
                </div>
              </div>
              <div className="soft-divider mt-6 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Reviewers</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.reviewers.map((reviewer) => (
                    <span className="rounded-full border border-border bg-white/72 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={reviewer}>
                      {reviewer}
                    </span>
                  ))}
                </div>
              </div>
              <div className="soft-divider mt-6 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Article tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span className="rounded-full border border-border bg-white/72 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <WorkflowTimeline items={item.timeline} />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <ReviewScoreCard template={reviewTemplate} />
            {approval ? (
              <div className="platform-panel rounded-[2rem] p-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Approval readiness</p>
                <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Chief editor status</h2>
                <div className="mt-5 rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge
                      label={approval.status.replaceAll("-", " ")}
                      tone={approval.status === "approved-for-production" ? "emerald" : approval.status === "hold" ? "amber" : "violet"}
                    />
                    <StatusBadge
                      label={approval.riskLevel}
                      tone={approval.riskLevel === "Routine" ? "emerald" : approval.riskLevel === "Elevated" ? "violet" : "amber"}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">{approval.summary}</p>
                </div>
                <Link className="focus-ring mt-5 inline-flex items-center text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80 hover:text-foreground" href="/platform/approvals">
                  Open approval screen
                </Link>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
