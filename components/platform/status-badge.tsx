import { cn } from "@/lib/utils";

const toneStyles = {
  slate: "border-border bg-white/70 text-muted dark:bg-slate-950/40",
  blue: "border-blue-500/25 bg-blue-500/10 text-blue-900 dark:text-sky-200",
  cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
  violet: "border-violet-500/25 bg-violet-500/10 text-violet-900 dark:text-violet-200",
  rose: "border-rose-500/25 bg-rose-500/10 text-rose-900 dark:text-rose-200"
} as const;

export function StatusBadge({
  label,
  tone = "slate",
  className
}: {
  label: string;
  tone?: keyof typeof toneStyles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
