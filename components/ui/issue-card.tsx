import { Download, MoveRight } from "lucide-react";
import { getIssueArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Issue } from "@/types/content";
import { ButtonLink } from "@/components/ui/button";
import { ScienceCover } from "@/components/ui/science-cover";

export function IssueCard({ issue }: { issue: Issue }) {
  const articleCount = getIssueArticles(issue.slug).length;

  return (
    <article className="editorial-card flex h-full flex-col overflow-hidden rounded-[2.15rem] p-4 sm:p-5">
      <ScienceCover
        category={issue.issueNumber}
        className="aspect-[4/5] min-h-[20rem]"
        compact
        motif={issue.coverMotif}
        title={issue.title}
        tone={issue.coverTone}
      />
      <div className="flex h-full flex-col gap-5 px-2 pb-2 pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
            <span>{issue.issueNumber}</span>
            <span>{formatDate(issue.releasedAt)}</span>
          </div>
          <h3 className="display-title text-[2.3rem] font-semibold leading-[0.95]">{issue.title}</h3>
          <p className="body-copy text-[1.02rem] leading-8 text-muted">{issue.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted">
          <span>{articleCount} curated articles</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              Read issue
              <MoveRight className="h-4 w-4" />
            </span>
            <Download className="h-4 w-4" />
          </div>
        </div>
        <ButtonLink className="w-full" href={`/issues/${issue.slug}`} variant="secondary">
          Explore issue
        </ButtonLink>
      </div>
    </article>
  );
}
