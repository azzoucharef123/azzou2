import { ReviewFormTemplate } from "@/types/platform";
import { StatusBadge } from "@/components/platform/status-badge";

const recommendationTone = {
  accept: "emerald",
  minor_revision: "amber",
  major_revision: "violet"
} as const;

const recommendationLabel = {
  accept: "Accept",
  minor_revision: "Minor revision",
  major_revision: "Major revision"
} as const;

export function ReviewScoreCard({ template }: { template: ReviewFormTemplate }) {
  return (
    <div className="platform-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Review template</p>
          <h3 className="display-title mt-3 text-[2rem] font-semibold leading-[0.98]">{template.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{template.description}</p>
        </div>
        <StatusBadge label={recommendationLabel[template.recommendation]} tone={recommendationTone[template.recommendation]} />
      </div>
      <div className="mt-6 space-y-4">
        {template.criteria.map((criterion) => (
          <div className="rounded-[1.4rem] border border-border bg-white/70 p-4 dark:bg-slate-950/35" key={criterion.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-foreground">{criterion.label}</p>
              <p className="text-sm font-semibold text-foreground">{criterion.score.toFixed(1)} / 5.0</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-blue-500/8">
              <div className="h-2 rounded-full bg-[linear-gradient(90deg,#174ecf,#3db6e8)]" style={{ width: `${(criterion.score / 5) * 100}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{criterion.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
