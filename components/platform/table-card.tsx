import { ReactNode } from "react";

export function TableCard({
  title,
  description,
  action,
  children
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="platform-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Operational table</p>
          <h2 className="display-title text-3xl font-semibold leading-[0.98]">{title}</h2>
          {description ? <p className="max-w-3xl text-sm leading-7 text-muted">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="data-table mt-6 overflow-x-auto rounded-[1.5rem] border border-border bg-white/60 dark:bg-slate-950/35">{children}</div>
    </section>
  );
}
