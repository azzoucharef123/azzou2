import type { Metadata } from "next";
import { ArticleCard } from "@/components/ui/article-card";
import { ArticleListing } from "@/components/ui/article-listing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArticles, getCategories, getFeaturedArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Articles",
  description: "Browse all articles, research summaries, interviews, and science features from Physics & Chemistry Under the Microscope."
};

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const articles = getArticles();
  const categories = getCategories();
  const featuredArticles = getFeaturedArticles().slice(0, 2);

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />
      <Reveal>
        <SectionHeading
          description="A complete editorial archive spanning physics, chemistry, laboratory culture, interviews, education, and scientific discovery."
          eyebrow="Articles"
          title="Reporting, essays, and briefings for exacting readers."
        />
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {featuredArticles.map((article, index) => (
          <Reveal delay={index * 0.08} key={article.slug}>
            <ArticleCard article={article} featured />
          </Reveal>
        ))}
      </div>
      <div className="mt-12">
        <ArticleListing articles={articles} categories={categories} initialCategory={category} initialQuery={q} />
      </div>
    </div>
  );
}
