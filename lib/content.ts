import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { issues } from "@/data/issues";
import { teamMembers } from "@/data/team";
import { calculateReadingTime } from "@/lib/utils";
import { Article, Author, Category } from "@/types/content";

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getAuthors() {
  return authors;
}

export function getAuthorBySlug(slug: string) {
  return authors.find((author) => author.slug === slug);
}

export function getTeamMembers() {
  return teamMembers;
}

export function getIssues() {
  return [...issues].sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt));
}

export function getIssueBySlug(slug: string) {
  return issues.find((issue) => issue.slug === slug);
}

export function getArticles() {
  return [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles() {
  return getArticles().filter((article) => article.featured);
}

export function getEditorsPicks() {
  return getArticles().filter((article) => article.editorsPick);
}

export function getHeroArticle() {
  return getArticles().find((article) => article.hero) ?? getArticles()[0];
}

export function getCurrentIssue() {
  return getIssues()[0];
}

export function getArticlesByCategory(slug: string) {
  return getArticles().filter((article) => article.categorySlug === slug);
}

export function getArticlesByAuthor(slug: string) {
  return getArticles().filter((article) => article.authorSlug === slug);
}

export function getArticlesByIssue(slug: string) {
  return getArticles().filter((article) => article.issueSlug === slug);
}

export function getRelatedArticles(article: Article, limit = 3) {
  return getArticles()
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        (candidate.categorySlug === article.categorySlug ||
          candidate.tags.some((tag) => article.tags.includes(tag)))
    )
    .slice(0, limit);
}

export function getAdjacentArticles(slug: string) {
  const all = getArticles();
  const index = all.findIndex((article) => article.slug === slug);

  return {
    previous: index >= 0 ? all[index + 1] : undefined,
    next: index > 0 ? all[index - 1] : undefined
  };
}

export function getReadingTime(article: Article) {
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

  return calculateReadingTime(text);
}

export function getArticleContext(article: Article) {
  const author = getAuthorBySlug(article.authorSlug) as Author;
  const category = getCategoryBySlug(article.categorySlug) as Category;
  const issue = article.issueSlug ? getIssueBySlug(article.issueSlug) : undefined;

  return { author, category, issue };
}

export function getIssueArticles(slug: string) {
  return getArticlesByIssue(slug);
}
