import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="editorial-card flex flex-col items-center rounded-[2rem] px-6 py-12 text-center">
      <div className="mb-5 rounded-full border border-border bg-white/75 p-4 dark:bg-slate-950/45">
        <SearchX className="h-6 w-6 text-muted" />
      </div>
      <h3 className="display-title text-3xl font-semibold">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
