import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, BookOpenText, Microscope, Orbit, Waves } from "lucide-react";
import { ArticleCard } from "@/components/ui/article-card";
import { AcceptedManuscriptSpotlight } from "@/components/ui/accepted-manuscript-spotlight";
import { ButtonLink } from "@/components/ui/button";
import { IssueCard } from "@/components/ui/issue-card";
import { PersonCard } from "@/components/ui/person-card";
import { Reveal } from "@/components/ui/reveal";
import { ScienceCover } from "@/components/ui/science-cover";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getArticles,
  getArticleCountByCategory,
  getAuthors,
  getCategories,
  getCurrentIssue,
  getIssues,
  getTrendingTopics
} from "@/lib/content";
import { getHomepageAcceptedManuscript } from "@/lib/services/accepted-manuscript-service";
import { getHomepageEditorialContent } from "@/lib/services/homepage-publication-service";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/data/site";

const HomeContributionActions = dynamic(
  () => import("@/components/auth/home-contribution-actions").then((mod) => mod.HomeContributionActions),
  {
    loading: () => (
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div />
        <div className="min-w-[18rem] space-y-4">
          <span className="block h-12 rounded-full border border-border bg-white/50 dark:bg-slate-950/40" />
          <span className="block h-12 rounded-full border border-border bg-white/50 dark:bg-slate-950/40" />
        </div>
      </div>
    )
  }
);

export default async function HomePage() {
  const acceptedManuscript = await getHomepageAcceptedManuscript();
  const { heroArticle, featuredArticles, latestArticles, editorsPicks, newsroomNotes } = await getHomepageEditorialContent();
  const categories = getCategories();
  const currentIssue = getCurrentIssue();
  const authors = getAuthors().slice(0, 3);
  const allArticles = getArticles();
  const issueCount = getIssues().length;
  const trendingTopics = getTrendingTopics(6);
  const heroLead = heroArticle ?? {
    slug: "",
    title: "The homepage publication board is being refreshed.",
    subtitle: "",
    excerpt: "Editors can republish accepted work from the private platform at any time.",
    authorName: "Editorial desk",
    publishedAt: new Date().toISOString(),
    categorySlug: "physics",
    categoryName: "Editorial reset",
    coverTone: "silver" as const,
    coverMotif: "crystal" as const,
    order: 0
  };

  return (
    <div className="pb-10">
      <section className="shell-wide pt-5 sm:pt-8">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[2.8rem] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,78,207,.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,.22),transparent_45%)]" />
            <div className="relative grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-9">
                <div className="space-y-5">
                  <span className="eyebrow">World-Class Editorial Science</span>
                  <p className="max-w-xl text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-muted">
                    Physics, chemistry, and laboratory culture rendered with magazine-level craft.
                  </p>
                  <h1 className="display-title max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-[5.8rem]">
                    {siteConfig.name}
                  </h1>
                  <p className="max-w-3xl text-xl leading-8 text-muted sm:text-[1.65rem] sm:leading-9">{siteConfig.tagline}</p>
                  <p className="max-w-3xl body-copy text-xl leading-9 text-foreground/82">
                    A refined digital publication for readers who want physics and chemistry covered with intellectual seriousness, visual clarity, and the pacing of a world-class editorial review.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <ButtonLink href="/articles">Read the latest reporting</ButtonLink>
                  <ButtonLink href="/issues" variant="secondary">
                    Explore magazine issues
                  </ButtonLink>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="editorial-card rounded-[1.7rem] p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Published archive</p>
                    <p className="display-title mt-3 text-4xl font-semibold">{allArticles.length}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">Feature stories, essays, research summaries, and interviews.</p>
                  </div>
                  <div className="editorial-card rounded-[1.7rem] p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Editorial channels</p>
                    <p className="display-title mt-3 text-4xl font-semibold">{categories.length}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">Distinct sections shaped around method, discovery, and teaching.</p>
                  </div>
                  <div className="editorial-card rounded-[1.7rem] p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Curated issues</p>
                    <p className="display-title mt-3 text-4xl font-semibold">{issueCount}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">Print-inspired editions that group reporting into focused scientific dossiers.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Microscope,
                      title: "Research-led features",
                      description: "Long-form reporting anchored in methods, evidence, and laboratory context."
                    },
                    {
                      icon: Waves,
                      title: "Editorial science briefings",
                      description: "Fast, credible analysis of new findings without hype or dilution."
                    },
                    {
                      icon: BookOpenText,
                      title: "Teaching with depth",
                      description: "Educational essays built for students, lecturers, and curious experts."
                    }
                  ].map((item) => (
                    <div className="rounded-[1.7rem] border border-border bg-white/65 p-5 dark:bg-slate-950/35" key={item.title}>
                      <item.icon className="mb-3 h-5 w-5 text-blue-700 dark:text-sky-300" />
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-1">
                <ScienceCover
                  category={`Lead feature · ${formatDate(heroLead.publishedAt)}`}
                  className="aspect-[4/5] min-h-[28rem]"
                  motif={heroLead.coverMotif}
                  title={heroLead.title}
                  tone={heroLead.coverTone}
                />
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
                  <div className="editorial-card rounded-[1.9rem] p-6">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Current issue</p>
                    <h2 className="display-title mt-3 text-[2.2rem] font-semibold leading-[0.96]">{currentIssue.title}</h2>
                    <p className="mt-3 body-copy text-lg leading-8 text-muted">{currentIssue.description}</p>
                    <div className="mt-5 flex items-center justify-between text-sm text-muted">
                      <span>{currentIssue.issueNumber}</span>
                      <span>{formatDate(currentIssue.releasedAt)}</span>
                    </div>
                    <ButtonLink className="mt-5" href={`/issues/${currentIssue.slug}`} variant="secondary">
                      Read the issue
                    </ButtonLink>
                  </div>
                  <div className="editorial-card rounded-[1.9rem] p-6">
                    <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
                      <Orbit className="h-4 w-4 text-blue-700 dark:text-sky-300" />
                      Trending topics
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {trendingTopics.map((topic) => (
                        <span
                          className="rounded-full border border-border bg-white/72 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted dark:bg-slate-950/40"
                          key={topic}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Hero feature</p>
                      <h3 className="display-title mt-3 text-3xl font-semibold leading-[0.96]">{heroLead.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{heroLead.excerpt}</p>
                      <Link
                        className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-foreground/82"
                        href={`/articles/${heroLead.slug}`}
                      >
                        Read feature
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {acceptedManuscript ? <AcceptedManuscriptSpotlight manuscript={acceptedManuscript} /> : null}

      <section className="shell mt-28 space-y-10">
        <SectionHeading
          action={<ButtonLink href="/articles" variant="secondary">View archive</ButtonLink>}
          description="The week’s most substantial reporting on instruments, molecules, materials, and the editorial questions behind new evidence."
          eyebrow="Featured Articles"
          title="Front-page science with laboratory context."
        />
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <Reveal>
            {featuredArticles[0] ? <ArticleCard article={featuredArticles[0]} featured /> : <div className="glass-panel rounded-[2.2rem] p-6 text-sm leading-7 text-muted sm:p-7">Homepage publications are being refreshed by the editorial desk.</div>}
          </Reveal>
          <div className="grid gap-6">
            {featuredArticles.slice(1).map((article, index) => (
              <Reveal delay={index * 0.08} key={article.slug}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
            <Reveal delay={0.16}>
              <div className="glass-panel rounded-[2.2rem] p-6 sm:p-7">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Observed now</p>
                <h3 className="display-title mt-4 text-[2.2rem] font-semibold leading-[0.96]">
                  Coverage that follows instruments, interpretation, and scientific judgment rather than announcement cycles.
                </h3>
                <p className="mt-4 body-copy text-lg leading-8 text-muted">
                  Our editorial method rewards clarity about method, signal quality, uncertainty, and the practical environments in which evidence is produced.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell mt-28">
        <div className="glass-panel rounded-[2.6rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-10 xl:grid-cols-[0.34fr_0.66fr]">
            <Reveal>
              <div className="space-y-6">
                <SectionHeading
                  className="max-w-none"
                  eyebrow="Latest Coverage"
                  title="New reporting across physics, chemistry, and research culture."
                />
                <div className="editorial-card rounded-[1.9rem] p-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">From the newsroom</p>
                  <div className="mt-5 space-y-5">
                    {newsroomNotes.map((article) => (
                      <Link className="block border-b border-border pb-5 last:border-b-0 last:pb-0" href={`/articles/${article.slug}`} key={article.slug}>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-sky-300">
                          {formatDate(article.publishedAt)}
                        </p>
                        <h3 className="display-title mt-2 text-[1.9rem] font-semibold leading-[0.98]">{article.title}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-6 lg:grid-cols-2">
              {latestArticles.map((article, index) => (
                <Reveal delay={index * 0.05} key={article.slug}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-28 space-y-10">
        <SectionHeading
          description="Nine editorial channels organise the site like a serious magazine rather than a flat content feed."
          eyebrow="Categories"
          title="Editorial channels built for distinct scientific modes."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal delay={index * 0.04} key={category.slug}>
              <Link className="editorial-card block rounded-[2.05rem] p-6 hover:-translate-y-1" href={`/categories/${category.slug}`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">{category.accent}</p>
                  <p className="display-title text-2xl font-semibold text-foreground/20 dark:text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
                <h3 className="display-title mt-6 text-[2.2rem] font-semibold leading-[0.96]">{category.name}</h3>
                <p className="mt-3 body-copy text-lg leading-8 text-muted">{category.intro}</p>
                <div className="mt-6 border-t border-border pt-4 text-sm text-muted">
                  {getArticleCountByCategory(category.slug)} archived pieces
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell mt-28 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="space-y-8">
            <SectionHeading
              description="A tighter selection of stories the editors believe best expresses the publication’s voice."
              eyebrow="Editors' Picks"
              title="Essays and briefings the editorial desk recommends first."
            />
            <div className="grid gap-6">
              {editorsPicks.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="space-y-8">
            <SectionHeading
              description="Each issue is assembled as a coherent edition, with its own editorial argument and visual cadence."
              eyebrow="Current Issue"
              title={currentIssue.title}
            />
            <IssueCard issue={currentIssue} />
          </div>
        </Reveal>
      </section>

      <section className="shell mt-28 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <div className="editorial-card rounded-[2.3rem] p-7 sm:p-9">
            <span className="eyebrow">About The Magazine</span>
            <h2 className="display-title mt-5 text-4xl font-semibold leading-[0.96] sm:text-[3.35rem]">A publication designed for careful readers.</h2>
            <p className="mt-5 body-copy text-xl leading-9 text-foreground/84">
              We publish features, issue packages, interviews, and research summaries that respect the intelligence of specialists while remaining readable to wider science audiences. The aim is not simplification at any cost, but clarity with proportion and rigor.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">{siteConfig.mission}</p>
            <div className="mt-8 rounded-[1.8rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">Editorial principle</p>
              <p className="mt-3 display-title text-[2rem] font-semibold leading-[0.98]">
                Science deserves atmosphere, but never at the cost of precision.
              </p>
            </div>
            <ButtonLink className="mt-6" href="/about" variant="secondary">
              Learn about our vision
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-6 md:grid-cols-3">
            {authors.map((author) => (
              <PersonCard href={`/authors/${author.slug}`} key={author.slug} person={author} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="shell mt-28">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[2.6rem] p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,78,207,.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,.12),transparent_22%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <span className="eyebrow">Contribute</span>
                <h2 className="display-title text-4xl font-semibold leading-[0.96] sm:text-[3.3rem]">Pitch articles, interviews, research summaries, and educational essays.</h2>
                <p className="max-w-3xl body-copy text-lg leading-8 text-muted">
                  We commission writers, educators, and researchers who can combine accuracy with elegant prose. Strong submissions are evidence-led, conceptually clear, and attentive to the way science is actually practiced.
                </p>
              </div>
              <HomeContributionActions />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
