import { ArrowUpRight } from "lucide-react";
import { PlatformMetric } from "@/types/platform";
import { cn } from "@/lib/utils";

const accentStyles = {
  blue: "from-blue-600/18 to-cyan-400/8",
  cyan: "from-cyan-500/18 to-sky-400/8",
  amber: "from-amber-500/18 to-orange-300/8",
  emerald: "from-emerald-500/18 to-teal-300/8",
  violet: "from-violet-500/18 to-fuchsia-300/8"
} as const;

export function MetricCard({ metric, className }: { metric: PlatformMetric; className?: string }) {
  return (
    <div className={cn("platform-panel relative overflow-hidden rounded-[1.8rem] p-5", className)}>
      <div className={cn("absolute inset-x-0 top-0 h-20 bg-gradient-to-r opacity-80", accentStyles[metric.tone])} />
      <div className="relative">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{metric.label}</p>
        <div className="mt-6 flex items-end justify-between gap-3">
          <p className="display-title text-5xl font-semibold leading-none tracking-[-0.05em]">{metric.value}</p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 dark:bg-slate-950/45">
            <ArrowUpRight className="h-4 w-4 text-foreground/70" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{metric.delta}</p>
      </div>
    </div>
  );
}
