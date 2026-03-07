import { cn } from "@/lib/utils";

type FilterChip = {
  label: string;
  meta?: string;
  active?: boolean;
};

export function FilterChipBar({ items, className }: { items: FilterChip[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <button
          className={cn(
            "focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
            item.active
              ? "border-blue-500/30 bg-blue-500/10 text-foreground dark:text-sky-100"
              : "border-border bg-white/70 text-muted hover:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-950/55"
          )}
          key={item.label}
          type="button"
        >
          <span>{item.label}</span>
          {item.meta ? <span className="text-xs uppercase tracking-[0.14em] opacity-70">{item.meta}</span> : null}
        </button>
      ))}
    </div>
  );
}
