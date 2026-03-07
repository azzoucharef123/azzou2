import Link from "next/link";
import { getCategoryBySlug } from "@/lib/content";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  categorySlug,
  className
}: {
  categorySlug: string;
  className?: string;
}) {
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return null;
  }

  return (
    <Link
      className={cn(
        "focus-ring inline-flex items-center rounded-full border border-border bg-white/72 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/75 hover:bg-white dark:bg-slate-950/45 dark:hover:bg-slate-900",
        className
      )}
      href={`/categories/${category.slug}`}
    >
      {category.shortLabel}
    </Link>
  );
}
