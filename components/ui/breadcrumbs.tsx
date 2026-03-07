import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => (
          <li className="inline-flex items-center gap-2" key={`${item.label}-${index}`}>
            {item.href ? (
              <Link className="focus-ring hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
