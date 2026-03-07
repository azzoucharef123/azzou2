import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PersonCard } from "@/components/ui/person-card";
import { Reveal } from "@/components/ui/reveal";
import { getAuthorBySlug, getAuthors, getArticlesByAuthor } from "@/lib/content";

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  return {
    title: author ? author.name : "Author",
    description: author ? author.biography : "Magazine author profile."
  };
}

export default async function AuthorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authoredArticles = getArticlesByAuthor(author.slug);

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Authors", href: "/authors" }, { label: author.name }]} />
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <PersonCard person={author} />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="editorial-card rounded-[2rem] p-7">
            <h1 className="display-title text-5xl font-semibold leading-[0.96] tracking-[-0.05em]">{author.name}</h1>
            <p className="mt-3 text-xl leading-8 text-muted">{author.role}</p>
            <p className="mt-6 body-copy text-lg leading-8 text-foreground/84">{author.biography}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 dark:bg-slate-950/40">
                <MapPin className="h-4 w-4" />
                {author.location}
              </span>
              {author.social.email ? (
                <Link
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 dark:bg-slate-950/40"
                  href={`mailto:${author.social.email}`}
                >
                  <Mail className="h-4 w-4" />
                  {author.social.email}
                </Link>
              ) : null}
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Expertise</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {author.expertise.map((topic) => (
                  <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={topic}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="mt-16 space-y-8">
        <h2 className="display-title text-4xl font-semibold">Published articles</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {authoredArticles.map((article, index) => (
            <Reveal delay={index * 0.05} key={article.slug}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
