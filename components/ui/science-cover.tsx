import { cn } from "@/lib/utils";
import { Article } from "@/types/content";

const toneClasses: Record<Article["coverTone"], string> = {
  blue: "from-blue-950 via-blue-700 to-cyan-400",
  silver: "from-slate-900 via-slate-600 to-slate-200",
  cyan: "from-sky-950 via-cyan-700 to-sky-200",
  amber: "from-slate-950 via-amber-600 to-amber-200",
  violet: "from-indigo-950 via-violet-700 to-fuchsia-200",
  emerald: "from-emerald-950 via-emerald-600 to-teal-200"
};

const motifClasses: Record<Article["coverMotif"], string> = {
  atoms: "before:size-36 before:rounded-full before:border before:border-white/25 before:top-6 before:left-6 after:size-52 after:rounded-full after:border after:border-white/15 after:-bottom-10 after:-right-10",
  waves: "before:h-px before:w-44 before:rotate-12 before:bg-white/55 before:top-10 before:left-8 after:h-px after:w-56 after:-rotate-12 after:bg-white/35 after:bottom-16 after:right-5",
  lattice: "before:inset-x-8 before:top-8 before:bottom-8 before:bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] before:bg-[size:28px_28px] after:hidden",
  spectrum: "before:inset-y-6 before:left-8 before:w-20 before:bg-[linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,0))] after:inset-y-8 after:right-8 after:w-28 after:bg-[radial-gradient(circle,rgba(255,255,255,.5),transparent_70%)]",
  microscope: "before:right-8 before:top-8 before:h-28 before:w-28 before:rounded-[2rem] before:border before:border-white/20 after:left-8 after:bottom-8 after:h-14 after:w-36 after:rounded-full after:bg-white/12",
  crystal: "before:left-10 before:top-10 before:h-28 before:w-28 before:rotate-45 before:border before:border-white/20 after:right-14 after:bottom-10 after:h-36 after:w-36 after:rotate-12 after:border after:border-white/15"
};

export function ScienceCover({
  title,
  category,
  tone,
  motif,
  className,
  compact = false
}: {
  title: string;
  category?: string;
  tone: Article["coverTone"];
  motif: Article["coverMotif"];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grain relative overflow-hidden rounded-[1.95rem] border border-white/15 bg-gradient-to-br text-white shadow-[0_26px_80px_rgba(3,8,20,0.26)]",
        toneClasses[tone],
        motifClasses[motif],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.34),transparent_26%),linear-gradient(135deg,rgba(255,255,255,.12),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.12),transparent_35%)]" />
      <div className="absolute inset-0 before:absolute before:content-[''] after:absolute after:content-['']" />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        {category ? (
          <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
            {category}
          </span>
        ) : (
          <span />
        )}
        <div className={cn("max-w-sm space-y-3", compact ? "text-sm" : "text-base")}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">
            Physics & Chemistry Under the Microscope
          </p>
          <h3 className={cn("display-title font-semibold leading-[0.95]", compact ? "text-[2rem]" : "text-[2.45rem]")}>
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
