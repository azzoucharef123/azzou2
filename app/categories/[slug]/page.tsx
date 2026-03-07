import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArticlesByCategory, getCategories, getCategoryBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category ? category.name : "Category",
    description: category ? category.description : "Magazine category archive."
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);
  const featuredArticle = articles[0];
  const archiveArticles = articles.slice(1);

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name }
        ]}
      />
      <Reveal>
        <div className="glass-panel rounded-[2.25rem] px-6 py-10 sm:px-10">
          <SectionHeading
            action={<ButtonLink href="/articles" variant="secondary">Browse all articles</ButtonLink>}
            description={category.intro}
            eyebrow={category.accent}
            title={category.name}
          />
        </div>
      </Reveal>

      {featuredArticle ? (
        <section className="mt-12 space-y-8">
          <h2 className="display-title text-4xl font-semibold">Featured in {category.name}</h2>
          <ArticleCard article={featuredArticle} featured />
        </section>
      ) : null}

      <section className="mt-14 space-y-8">
        <h2 className="display-title text-4xl font-semibold">Filtered archive</h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {(archiveArticles.length ? archiveArticles : articles).map((article, index) => (
            <Reveal delay={index * 0.05} key={article.slug}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
