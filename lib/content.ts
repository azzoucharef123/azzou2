import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { issues } from "@/data/issues";
import { teamMembers } from "@/data/team";
import { calculateReadingTime } from "@/lib/utils";
import { Article, Author, Category } from "@/types/content";

const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));
const issuesBySlug = new Map(issues.map((issue) => [issue.slug, issue]));
const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));
const sortedIssues = [...issues].sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
const sortedArticles = [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
const featuredArticles = sortedArticles.filter((article) => article.featured);
const editorsPicks = sortedArticles.filter((article) => article.editorsPick);
const heroArticle = sortedArticles.find((article) => article.hero) ?? sortedArticles[0];
const articlesByCategorySlug = new Map<string, Article[]>();
const articlesByAuthorSlug = new Map<string, Article[]>();
const articlesByIssueSlug = new Map<string, Article[]>();
const articleContextMap = new Map<string, { author: Author; category: Category; issue: typeof issues[number] | undefined }>();
const readingTimeMap = new Map<string, number>();
const relatedArticlesMap = new Map<string, Article[]>();
const adjacentArticlesMap = new Map<string, { previous: Article | undefined; next: Article | undefined }>();
const trendingTopics = Array.from(new Set(sortedArticles.flatMap((article) => article.tags)));

for (const article of sortedArticles) {
  const categoryList = articlesByCategorySlug.get(article.categorySlug) ?? [];
  categoryList.push(article);
  articlesByCategorySlug.set(article.categorySlug, categoryList);

  const authorList = articlesByAuthorSlug.get(article.authorSlug) ?? [];
  authorList.push(article);
  articlesByAuthorSlug.set(article.authorSlug, authorList);

  if (article.issueSlug) {
    const issueList = articlesByIssueSlug.get(article.issueSlug) ?? [];
    issueList.push(article);
    articlesByIssueSlug.set(article.issueSlug, issueList);
  }

  const author = authorsBySlug.get(article.authorSlug) as Author;
  const category = categoriesBySlug.get(article.categorySlug) as Category;
  const issue = article.issueSlug ? issuesBySlug.get(article.issueSlug) : undefined;

  articleContextMap.set(article.slug, { author, category, issue });

  const text = [
    article.title,
    article.subtitle,
    article.excerpt,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.list ?? []),
      section.pullQuote ?? ""
    ])
  ].join(" ");

  readingTimeMap.set(article.slug, calculateReadingTime(text));
}

for (const article of sortedArticles) {
  relatedArticlesMap.set(
    article.slug,
    sortedArticles
      .filter(
        (candidate) =>
          candidate.slug !== article.slug &&
          (candidate.categorySlug === article.categorySlug || candidate.tags.some((tag) => article.tags.includes(tag)))
      )
      .slice(0, 3)
  );
}

for (const [index, article] of sortedArticles.entries()) {
  adjacentArticlesMap.set(article.slug, {
    previous: index >= 0 ? sortedArticles[index + 1] : undefined,
    next: index > 0 ? sortedArticles[index - 1] : undefined
  });
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categoriesBySlug.get(slug);
}

export function getAuthors() {
  return authors;
}

export function getAuthorBySlug(slug: string) {
  return authorsBySlug.get(slug);
}

export function getTeamMembers() {
  return teamMembers;
}

export function getIssues() {
  return sortedIssues;
}

export function getIssueBySlug(slug: string) {
  return issuesBySlug.get(slug);
}

export function getArticles() {
  return sortedArticles;
}

export function getArticleBySlug(slug: string) {
  return articlesBySlug.get(slug);
}

export function getFeaturedArticles() {
  return featuredArticles;
}

export function getEditorsPicks() {
  return editorsPicks;
}

export function getHeroArticle() {
  return heroArticle;
}

export function getCurrentIssue() {
  return sortedIssues[0];
}

export function getArticlesByCategory(slug: string) {
  return articlesByCategorySlug.get(slug) ?? [];
}

export function getArticlesByAuthor(slug: string) {
  return articlesByAuthorSlug.get(slug) ?? [];
}

export function getArticlesByIssue(slug: string) {
  return articlesByIssueSlug.get(slug) ?? [];
}

export function getRelatedArticles(article: Article, limit = 3) {
  return (relatedArticlesMap.get(article.slug) ?? []).slice(0, limit);
}

export function getAdjacentArticles(slug: string) {
  return adjacentArticlesMap.get(slug) ?? { previous: undefined, next: undefined };
}

export function getReadingTime(article: Article) {
  return readingTimeMap.get(article.slug) ?? 1;
}

export function getArticleContext(article: Article) {
  return articleContextMap.get(article.slug) as { author: Author; category: Category; issue: typeof issues[number] | undefined };
}

export function getIssueArticles(slug: string) {
  return getArticlesByIssue(slug);
}

export function getArticleCountByCategory(slug: string) {
  return (articlesByCategorySlug.get(slug) ?? []).length;
}

export function getTrendingTopics(limit = 6) {
  return trendingTopics.slice(0, limit);
}
