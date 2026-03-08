"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Article, Category } from "@/types/content";
import { ArticleCard } from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const INITIAL_COUNT = 6;

export function ArticleListing({
  articles,
  categories,
  initialQuery = "",
  initialCategory = "all",
  featuredFirst = true
}: {
  articles: Article[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  featuredFirst?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [dateFilter, setDateFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const deferredQuery = useDeferredValue(query);

  const preparedArticles = useMemo(
    () =>
      articles.map((article) => ({
        article,
        publishedAtMs: +new Date(article.publishedAt),
        searchTarget: [article.title, article.subtitle, article.excerpt, ...article.tags].join(" ").toLowerCase()
      })),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const now = new Date("2026-03-07");
    const byQuery = deferredQuery.trim().toLowerCase();

    const matches = preparedArticles
      .filter(({ article, publishedAtMs, searchTarget }) => {
      const queryMatch = byQuery ? searchTarget.includes(byQuery) : true;
      const categoryMatch = selectedCategory === "all" ? true : article.categorySlug === selectedCategory;
      const ageInDays = Math.floor((+now - publishedAtMs) / (1000 * 60 * 60 * 24));
      const dateMatch =
        dateFilter === "30"
          ? ageInDays <= 30
          : dateFilter === "180"
            ? ageInDays <= 180
            : dateFilter === "365"
              ? ageInDays <= 365
              : true;

      return queryMatch && categoryMatch && dateMatch;
    })
      .map(({ article }) => article);

    if (!featuredFirst) {
      return matches;
    }

    return [...matches].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [dateFilter, deferredQuery, featuredFirst, preparedArticles, selectedCategory]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="space-y-10">
      <div className="editorial-card rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <label className="space-y-2 text-sm font-medium text-foreground">
            Search
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-white/80 px-4 dark:bg-slate-950/45">
              <Search className="h-4 w-4 text-muted" />
              <input
                className="focus-ring w-full bg-transparent text-sm outline-none placeholder:text-muted"
                onChange={(event) => {
                  const value = event.target.value;
                  startTransition(() => {
                    setVisibleCount(INITIAL_COUNT);
                    setQuery(value);
                  });
                }}
                placeholder="Search by title, topic, or tag"
                value={query}
              />
            </div>
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Category
            <select
              className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
              onChange={(event) => {
                const value = event.target.value;
                startTransition(() => {
                  setVisibleCount(INITIAL_COUNT);
                  setSelectedCategory(value);
                });
              }}
              value={selectedCategory}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Date
            <select
              className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
              onChange={(event) => {
                const value = event.target.value;
                startTransition(() => {
                  setVisibleCount(INITIAL_COUNT);
                  setDateFilter(value);
                });
              }}
              value={dateFilter}
            >
              <option value="all">All time</option>
              <option value="30">Last 30 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last 12 months</option>
            </select>
          </label>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <EmptyState
          description="Try broadening your search, choosing a different category, or removing the date filter."
          title="No editorial matches found"
        />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleArticles.map((article, index) => (
              <ArticleCard article={article} featured={index === 0 && article.featured} key={article.slug} />
            ))}
          </div>
          {visibleCount < filteredArticles.length ? (
            <div className="flex justify-center">
              <Button onClick={() => setVisibleCount((current) => current + INITIAL_COUNT)} type="button" variant="secondary">
                Load more articles
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
