import { ScienceCover } from "@/components/ui/science-cover";
import { AcceptedManuscriptRecord } from "@/types/accepted-manuscript";
import { formatDate } from "@/lib/utils";

export function AcceptedManuscriptSpotlight({ manuscript }: { manuscript: AcceptedManuscriptRecord }) {
  return (
    <section className="shell mt-24">
      <div className="glass-panel overflow-hidden rounded-[2.6rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <ScienceCover
            category="Accepted manuscript"
            className="aspect-[16/12] min-h-[20rem]"
            motif="microscope"
            tone="emerald"
            title={manuscript.title}
          />
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="eyebrow">Homepage Accepted Manuscript</span>
              <h2 className="display-title text-4xl font-semibold leading-[0.96] sm:text-[3.3rem]">{manuscript.title}</h2>
              <p className="body-copy text-lg leading-8 text-muted">{manuscript.abstract}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Authors", manuscript.authors],
                ["Submission date", formatDate(manuscript.submissionDate)],
                ["Review date", formatDate(manuscript.reviewDate)],
                ["Acceptance date", formatDate(manuscript.acceptanceDate)],
                ["Publication date", formatDate(manuscript.publicationDate)],
                ["Purchase price", manuscript.purchasePrice]
              ].map(([label, value]) => (
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35" key={label}>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/84">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
