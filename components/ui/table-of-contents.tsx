import Link from "next/link";

export function TableOfContents({
  items
}: {
  items: { id: string; title: string }[];
}) {
  return (
    <aside className="editorial-card sticky top-28 rounded-[2rem] p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>
      <nav className="mt-4">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                className="focus-ring text-sm leading-6 text-muted hover:text-foreground"
                href={`#${item.id}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
