import { WorkflowStage } from "@/types/platform";

export function WorkflowTimeline({ items }: { items: WorkflowStage[] }) {
  return (
    <div className="platform-panel rounded-[2rem] p-6 sm:p-7">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Workflow timeline</p>
      <ol className="mt-6 space-y-6">
        {items.map((item, index) => (
          <li className="relative pl-8" key={`${item.label}-${item.date}`}>
            {index < items.length - 1 ? <span className="absolute left-[0.68rem] top-5 h-[calc(100%+1.5rem)] w-px bg-border" /> : null}
            <span
              className={`absolute left-0 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                item.complete
                  ? "border-blue-500/30 bg-blue-500/14 text-blue-900 dark:text-sky-100"
                  : "border-border bg-white/80 text-muted dark:bg-slate-950/40"
              }`}
            />
            <div className="rounded-[1.35rem] border border-border bg-white/68 p-4 dark:bg-slate-950/35">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{item.date}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
