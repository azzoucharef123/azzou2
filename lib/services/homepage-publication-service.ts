import "server-only";
import type { Prisma } from "@prisma/client";
import { articles as staticArticles } from "@/data/articles";
import { getArticleContext, getArticles } from "@/lib/content";
import { AuthSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { ConfigurationError } from "@/lib/errors";
import { requireCapability, requireRole } from "@/lib/permissions";
import { getAppSetting, upsertAppSetting } from "@/lib/repositories/app-setting-repository";
import { HomepagePublicationAction, HomepagePublicationManagerItem } from "@/types/accepted-manuscript";
import { Article } from "@/types/content";

const HOMEPAGE_PUBLICATION_PREFERENCES_KEY = "homepage_publication_preferences";

type HomepagePublicationPreferences = {
  hiddenSlugs: string[];
  deletedSlugs: string[];
};

function ensureDatabaseWritable() {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("DATABASE_URL is required to persist homepage publication controls.");
  }
}

function dedupeArticles(items: Article[]) {
  const seen = new Set<string>();
  return items.filter((article) => {
    if (seen.has(article.slug)) {
      return false;
    }

    seen.add(article.slug);
    return true;
  });
}

function normalizePreferences(value: unknown): HomepagePublicationPreferences {
  const input = (value ?? {}) as Partial<HomepagePublicationPreferences>;

  return {
    hiddenSlugs: Array.isArray(input.hiddenSlugs) ? input.hiddenSlugs.filter((item): item is string => typeof item === "string") : [],
    deletedSlugs: Array.isArray(input.deletedSlugs) ? input.deletedSlugs.filter((item): item is string => typeof item === "string") : []
  };
}

export async function getHomepagePublicationPreferences(): Promise<HomepagePublicationPreferences> {
  if (!env.hasDatabaseUrl) {
    return { hiddenSlugs: [], deletedSlugs: [] };
  }

  const setting = await getAppSetting(HOMEPAGE_PUBLICATION_PREFERENCES_KEY);
  return normalizePreferences(setting?.valueJson);
}

function buildHomepageCandidateArticles() {
  const sortedArticles = getArticles();
  const heroArticle = sortedArticles.find((article) => article.hero) ?? sortedArticles[0];
  const featuredArticles = sortedArticles.filter((article) => article.featured).slice(0, 3);
  const latestArticles = sortedArticles.slice(0, 6);
  const editorsPicks = sortedArticles.filter((article) => article.editorsPick).slice(0, 3);

  return dedupeArticles([heroArticle, ...featuredArticles, ...latestArticles, ...editorsPicks].filter(Boolean) as Article[]);
}

function filterHomepageArticlesByPreferences(articles: Article[], preferences: HomepagePublicationPreferences) {
  const hidden = new Set(preferences.hiddenSlugs);
  const deleted = new Set(preferences.deletedSlugs);

  return articles.filter((article) => !hidden.has(article.slug) && !deleted.has(article.slug));
}

function mapManagerItem(article: Article, visibility: HomepagePublicationManagerItem["visibility"]): HomepagePublicationManagerItem {
  const { author, category } = getArticleContext(article);

  return {
    slug: article.slug,
    title: article.title,
    authorName: author.name,
    publishedAt: article.publishedAt,
    categorySlug: category.slug,
    visibility
  };
}

export async function getHomepageEditorialContent() {
  const preferences = await getHomepagePublicationPreferences();
  const allVisibleArticles = filterHomepageArticlesByPreferences(getArticles(), preferences);
  const pool = allVisibleArticles.length ? allVisibleArticles : getArticles();

  const heroArticle = pool.find((article) => article.hero) ?? pool[0];
  const featuredArticles = pool.filter((article) => article.featured).slice(0, 3);
  const latestArticles = pool.slice(0, 6);
  const editorsPicks = pool.filter((article) => article.editorsPick).slice(0, 3);

  return {
    heroArticle,
    featuredArticles,
    latestArticles,
    editorsPicks,
    newsroomNotes: latestArticles.slice(0, 3)
  };
}

export async function getHomepagePublicationManagerData() {
  const preferences = await getHomepagePublicationPreferences();
  const candidateArticles = buildHomepageCandidateArticles();
  const articlesBySlug = new Map(staticArticles.map((article) => [article.slug, article]));
  const hiddenSet = new Set(preferences.hiddenSlugs);
  const deletedSet = new Set(preferences.deletedSlugs);

  const visible = candidateArticles
    .filter((article) => !hiddenSet.has(article.slug) && !deletedSet.has(article.slug))
    .map((article) => mapManagerItem(article, "visible"));

  const hidden = preferences.hiddenSlugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((article): article is Article => Boolean(article))
    .map((article) => mapManagerItem(article, "hidden"));

  const deleted = preferences.deletedSlugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((article): article is Article => Boolean(article))
    .map((article) => mapManagerItem(article, "deleted"));

  return {
    visible,
    hidden,
    deleted,
    canPersist: env.hasDatabaseUrl
  };
}

export async function updateHomepagePublicationVisibility(
  session: AuthSession,
  payload: { slug: string; action: HomepagePublicationAction }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");

  const preferences = await getHomepagePublicationPreferences();
  const hidden = new Set(preferences.hiddenSlugs);
  const deleted = new Set(preferences.deletedSlugs);

  if (payload.action === "hide") {
    hidden.add(payload.slug);
    deleted.delete(payload.slug);
  }

  if (payload.action === "delete") {
    deleted.add(payload.slug);
    hidden.delete(payload.slug);
  }

  if (payload.action === "restore") {
    hidden.delete(payload.slug);
    deleted.delete(payload.slug);
  }

  const nextPreferences = {
    hiddenSlugs: Array.from(hidden),
    deletedSlugs: Array.from(deleted)
  };

  await upsertAppSetting(HOMEPAGE_PUBLICATION_PREFERENCES_KEY, nextPreferences as Prisma.InputJsonValue);

  return nextPreferences;
}
