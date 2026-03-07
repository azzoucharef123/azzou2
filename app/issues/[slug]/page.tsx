import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ui/article-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { ScienceCover } from "@/components/ui/science-cover";
import { getIssueArticles, getIssues, getIssueBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getIssues().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  return {
    title: issue ? issue.title : "Issue",
    description: issue ? issue.description : "Magazine issue."
  };
}

export default async function IssueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const articles = getIssueArticles(issue.slug);

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Issues", href: "/issues" }, { label: issue.title }]} />
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <Reveal>
          <ScienceCover
            category={issue.issueNumber}
            className="aspect-[4/5] min-h-[28rem]"
            motif={issue.coverMotif}
            title={issue.title}
            tone={issue.coverTone}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="eyebrow">{issue.issueNumber}</span>
              <h1 className="display-title text-5xl font-semibold leading-[0.96] tracking-[-0.05em]">{issue.title}</h1>
              <p className="max-w-3xl text-xl leading-8 text-muted">{issue.description}</p>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{formatDate(issue.releasedAt)}</p>
            </div>

            <div className="editorial-card rounded-[2rem] p-7">
              <h2 className="display-title text-3xl font-semibold">Editor’s note</h2>
              <p className="mt-4 body-copy text-lg leading-8 text-foreground/84">{issue.editorNote}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="editorial-card rounded-[2rem] p-6">
                <h2 className="display-title text-3xl font-semibold">Highlights</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
                  {issue.highlights.map((highlight) => (
                    <li className="rounded-[1.4rem] border border-border bg-white/70 px-4 py-3 dark:bg-slate-950/40" key={highlight}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="editorial-card rounded-[2rem] p-6">
                <h2 className="display-title text-3xl font-semibold">Edition access</h2>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.5rem] border border-border bg-white/70 p-4 dark:bg-slate-950/40">
                    <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                      <FileText className="h-4 w-4" />
                      Read online placeholder
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      The demo edition presents issue metadata and article highlights. A live CMS version would open the issue reader here.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border bg-white/70 p-4 dark:bg-slate-950/40">
                    <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                      <Download className="h-4 w-4" />
                      Download placeholder
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      PDF download is intentionally represented as a premium publishing capability ready for later integration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="mt-16 space-y-8">
        <h2 className="display-title text-4xl font-semibold">Included articles</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal delay={index * 0.05} key={article.slug}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
