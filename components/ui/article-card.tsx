import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { getArticleContext, getReadingTime } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Article } from "@/types/content";
import { CategoryBadge } from "@/components/ui/category-badge";
import { ScienceCover } from "@/components/ui/science-cover";

export function ArticleCard({
  article,
  featured = false
}: {
  article: Article;
  featured?: boolean;
}) {
  const { author, category } = getArticleContext(article);
  const readingTime = getReadingTime(article);

  return (
    <article className="editorial-card group overflow-hidden rounded-[2.15rem] transition duration-300 hover:-translate-y-1">
      <Link className="block" href={`/articles/${article.slug}`}>
        <div className={featured ? "p-4 sm:p-5" : "p-4"}>
          <ScienceCover
            category={category.name}
            className={featured ? "aspect-[16/10] min-h-[18rem]" : "aspect-[16/11]"}
            motif={article.coverMotif}
            tone={article.coverTone}
            title={article.title}
          />
        </div>
      </Link>
      <div className="space-y-5 p-5 pt-0 sm:p-7 sm:pt-1">
        <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          <CategoryBadge categorySlug={article.categorySlug} />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <div className="space-y-3">
          <h3 className={featured ? "display-title text-[2.35rem] font-semibold leading-[0.95]" : "display-title text-[2rem] font-semibold leading-[0.98]"}>
            <Link className="focus-ring block" href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="body-copy text-[1.02rem] leading-8 text-muted">{article.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted">
          <div className="flex items-center gap-3">
            <span>{author.name}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              {readingTime} min read
            </span>
          </div>
          <Link className="focus-ring inline-flex items-center gap-2 font-semibold text-foreground/80 group-hover:translate-x-1" href={`/articles/${article.slug}`}>
            Read article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
