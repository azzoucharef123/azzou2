"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    router.push(search ? `/articles?q=${encodeURIComponent(search)}` : "/articles");
  }

  return (
    <form className="hidden lg:block" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="nav-search">
        Search articles
      </label>
      <div className="flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-2 dark:bg-slate-950/45">
        <Search className="h-4 w-4 text-muted" />
        <input
          className="focus-ring w-40 bg-transparent text-sm outline-none placeholder:text-muted"
          id="nav-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles"
          value={query}
        />
      </div>
    </form>
  );
}
