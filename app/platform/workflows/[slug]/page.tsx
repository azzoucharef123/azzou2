import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getWorkflowItems } from "@/lib/platform";
import { formatAuthorSubmissionStatus, getAuthorSubmissionStatus, getWorkflowStatusTone } from "@/lib/platform-status";
import { getWorkflowDetail } from "@/lib/services/article-service";
import { PlatformRole } from "@/types/platform";
import { formatDate } from "@/lib/utils";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { EditorStatusPanel } from "@/components/platform/editor-status-panel";
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

  return {
    title: `${slug.replaceAll("-", " ")} Workflow`,
    description: "Protected workflow detail page."
  };
}

const allowedRoles: PlatformRole[] = ["author", "editor"];

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
        <PlatformAccessState
          allowedRoles={[...allowedRoles]}
          description="Workflow detail pages are reserved for authors and editors directly involved in manuscript development and editorial decision-making."
          title="Workflow detail is not exposed to the current desk."
        />
    );
  }

  const { slug } = await params;
  const item = await getWorkflowDetail(slug).catch(() => null);

  if (!item) {
    notFound();
  }

  if (session.activeRole === "author" && item.authorId !== session.profile.id && item.author !== session.name) {
    return (
      <PlatformAccessState
        allowedRoles={["author", "editor"]}
        description="Author accounts can only open workflow records for manuscripts they own."
        title="This workflow is not available to the current author account."
      />
    );
  }

  const authorStatus = formatAuthorSubmissionStatus(getAuthorSubmissionStatus(item.status));
  const statusTone = getWorkflowStatusTone(item.status);

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              {session.activeRole === "author" ? <ButtonLink href="/submit">Submit revision</ButtonLink> : null}
              {session.activeRole === "editor" ? <ButtonLink href="/submit">Add Manuscript</ButtonLink> : null}
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
          <StatusBadge label={item.status.replaceAll("_", " ")} tone={statusTone} />
          {session.activeRole === "author" ? <StatusBadge label={authorStatus} tone={authorStatus === "Accepted" ? "emerald" : authorStatus === "Rejected" ? "rose" : "amber"} /> : null}
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
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Lead editor</p>
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
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Assigned editors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.assignedEditors.length ? item.assignedEditors.map((editor) => (
                    <span className="rounded-full border border-border bg-white/72 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={editor}>
                      {editor}
                    </span>
                  )) : (
                    <span className="rounded-full border border-border bg-white/72 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40">
                      Editorial desk
                    </span>
                  )}
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
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Submission status</p>
              <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">
                {session.activeRole === "editor" ? "Editorial control summary" : "Author-facing submission summary"}
              </h2>
              <div className="mt-5 rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge label={item.status.replaceAll("_", " ")} tone={statusTone} />
                  <StatusBadge label={authorStatus} tone={authorStatus === "Accepted" ? "emerald" : authorStatus === "Rejected" ? "rose" : "amber"} />
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {session.activeRole === "editor"
                    ? "Editors can move the manuscript between pending, under review, accepted, rejected, and published states from this workflow page."
                    : "Authors see a simplified decision state: pending, accepted, or rejected. Detailed editorial notes appear in the timeline and notifications."}
                </p>
              </div>
            </div>
            {session.activeRole === "editor" ? (
              <EditorStatusPanel articleId={item.id} currentStatus={item.status} />
            ) : (
              <div className="platform-panel rounded-[2rem] p-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Author guidance</p>
                <div className="mt-5 space-y-3">
                  {[
                    "Pending means the manuscript is still moving through editorial review or revision checks.",
                    "Accepted confirms the article has cleared editorial decision-making and can move into publication work.",
                    "Rejected means the current submission will not be published in its present form."
                  ].map((entry) => (
                    <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={entry}>
                      {entry}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
