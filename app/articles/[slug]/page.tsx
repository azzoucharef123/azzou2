import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Reveal } from "@/components/ui/reveal";
import { ScienceCover } from "@/components/ui/science-cover";
import { ShareButtons } from "@/components/ui/share-buttons";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { siteConfig } from "@/data/site";
import {
  getAdjacentArticles,
  getArticleBySlug,
  getArticleContext,
  getArticles,
  getReadingTime,
  getRelatedArticles
} from "@/lib/content";
import { formatDate } from "@/lib/utils";

const ArticleInteractions = dynamic(
  () => import("@/components/ui/article-interactions").then((mod) => mod.ArticleInteractions),
  {}
);

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found"
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      url: `${siteConfig.url}/articles/${article.slug}`
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { author, category, issue } = getArticleContext(article);
  const relatedArticles = getRelatedArticles(article, 3);
  const { previous, next } = getAdjacentArticles(article.slug);
  const readingTime = getReadingTime(article);
  const articleUrl = `${siteConfig.url}/articles/${article.slug}`;
  const tocItems = article.sections.map((section) => ({ id: section.id, title: section.title }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: author.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    datePublished: article.publishedAt,
    mainEntityOfPage: articleUrl
  };

  return (
    <>
      <Script id={`article-${article.slug}-jsonld`} strategy="beforeInteractive" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/articles" },
            { label: article.title }
          ]}
        />

        <Reveal>
          <header className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-3">
                <CategoryBadge categorySlug={article.categorySlug} />
                {issue ? (
                  <Link
                    className="focus-ring inline-flex rounded-full border border-border bg-white/65 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 dark:bg-slate-950/45"
                    href={`/issues/${issue.slug}`}
                  >
                    {issue.issueNumber}
                  </Link>
                ) : null}
              </div>
              <div className="space-y-4">
                <h1 className="display-title text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                  {article.title}
                </h1>
                <p className="max-w-3xl text-xl leading-8 text-muted">{article.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
                <Link className="focus-ring font-semibold text-foreground" href={`/authors/${author.slug}`}>
                  {author.name}
                </Link>
                <span>{formatDate(article.publishedAt)}</span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>
              <ShareButtons title={article.title} url={articleUrl} />
            </div>
            <ScienceCover
              category={category.name}
              className="aspect-[16/12] min-h-[22rem]"
              motif={article.coverMotif}
              title={article.title}
              tone={article.coverTone}
            />
          </header>
        </Reveal>

        <div className="mt-12 grid gap-10 xl:grid-cols-[0.78fr_2fr]">
          <div className="space-y-6">
            <Reveal>
              <TableOfContents items={tocItems} />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="editorial-card rounded-[2rem] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <article className="editorial-card rounded-[2.2rem] px-6 py-8 sm:px-10 sm:py-10">
              <div className="article-body">
                {article.sections.map((section) => (
                  <section id={section.id} key={section.id}>
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.pullQuote ? <blockquote>{section.pullQuote}</blockquote> : null}
                    {section.list ? (
                      <ul>
                        {section.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>

              <section className="mt-14 border-t border-border pt-10">
                <h2 className="display-title text-3xl font-semibold">References & citations</h2>
                <ol className="mt-5 space-y-3 text-sm leading-7 text-muted">
                  {article.references.map((reference) => (
                    <li className="rounded-[1.4rem] border border-border bg-white/70 px-4 py-3 dark:bg-slate-950/40" key={reference}>
                      {reference}
                    </li>
                  ))}
                </ol>
              </section>
            </article>
          </Reveal>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {previous ? (
            <Link className="editorial-card rounded-[2rem] p-6 hover:-translate-y-1" href={`/articles/${previous.slug}`}>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                <ArrowLeft className="h-4 w-4" />
                Previous article
              </p>
              <h2 className="display-title mt-4 text-3xl font-semibold">{previous.title}</h2>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link className="editorial-card rounded-[2rem] p-6 text-left hover:-translate-y-1" href={`/articles/${next.slug}`}>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Next article
                <ArrowRight className="h-4 w-4" />
              </p>
              <h2 className="display-title mt-4 text-3xl font-semibold">{next.title}</h2>
            </Link>
          ) : (
            <div />
          )}
        </section>

        <section className="mt-16 space-y-8">
          <h2 className="display-title text-4xl font-semibold">Related articles</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <ArticleCard article={related} key={related.slug} />
            ))}
          </div>
        </section>
      </div>
      <ArticleInteractions />
    </>
  );
}
