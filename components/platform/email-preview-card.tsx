import { Mail } from "lucide-react";
import { EmailPreview } from "@/types/platform";

export function EmailPreviewCard({ preview }: { preview: EmailPreview }) {
  return (
    <article className="platform-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{preview.audience}</p>
          <h2 className="display-title mt-3 text-[2.1rem] font-semibold leading-[0.98]">{preview.name}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{preview.summary}</p>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/70 dark:bg-slate-950/40">
          <Mail className="h-4 w-4 text-foreground/70" />
        </span>
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-border bg-[#fdfefe] p-5 shadow-[0_18px_40px_rgba(15,23,39,0.06)] dark:bg-slate-950/45 dark:shadow-none">
        <div className="rounded-[1.2rem] border border-border bg-white/90 p-4 dark:bg-slate-950/55">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Subject</p>
          <p className="mt-2 font-semibold text-foreground">{preview.subject}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Preheader</p>
          <p className="mt-2 text-sm leading-6 text-muted">{preview.preheader}</p>
        </div>
        <div className="mt-4 space-y-3">
          {preview.bodySections.map((section, index) => (
            <div className="rounded-[1.2rem] border border-border bg-white/90 p-4 dark:bg-slate-950/55" key={section}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">
                Module {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm leading-7 text-foreground/82">{section}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
