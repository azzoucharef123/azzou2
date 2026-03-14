import "server-only";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { getArticleContext, getArticles } from "@/lib/content";
import { AuthSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { ConfigurationError, NotFoundError } from "@/lib/errors";
import { requireCapability, requireRole } from "@/lib/permissions";
import { getAppSetting, upsertAppSetting } from "@/lib/repositories/app-setting-repository";
import {
  HomepagePublicationAction,
  HomepagePublicationCandidateItem,
  HomepagePublicationEntry,
  HomepagePublicationManagerData,
  HomepagePublicationManagerItem,
  HomepagePublicationView
} from "@/types/accepted-manuscript";
import { Article } from "@/types/content";

const HOMEPAGE_PUBLICATION_STATE_KEY = "homepage_publication_entries";
type HomepagePublicationState = {
  entries: HomepagePublicationEntry[];
};

function ensureDatabaseWritable() {
  if (!env.hasDatabaseUrl) {
    throw new ConfigurationError("DATABASE_URL is required to persist homepage publication controls.");
  }
}

function getArticleMap() {
  return new Map(getArticles().map((article) => [article.slug, article]));
}

function buildDefaultEntries() {
  const articles = getArticles();
  const heroArticle = articles.find((article) => article.hero) ?? articles[0];
  const featuredArticles = articles.filter((article) => article.featured).slice(0, 3);
  const latestArticles = articles.slice(0, 6);
  const editorsPicks = articles.filter((article) => article.editorsPick).slice(0, 3);
  const seen = new Set<string>();
  return [heroArticle, ...featuredArticles, ...latestArticles, ...editorsPicks]
    .filter((article): article is Article => Boolean(article))
    .filter((article) => {
      if (seen.has(article.slug)) {
        return false;
      }

      seen.add(article.slug);
      return true;
    })
    .map((article, index) => ({
      slug: article.slug,
      visibility: "visible" as const,
      order: index
    }));
}

function sortEntries(entries: HomepagePublicationEntry[]) {
  return [...entries]
    .sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug))
    .map((entry, index) => ({
      slug: entry.slug,
      visibility: entry.visibility,
      order: index,
      overrides: entry.overrides ? { ...entry.overrides } : undefined
    }));
}

function normalizeState(value: unknown): HomepagePublicationState {
  const input = value && typeof value === "object" ? (value as { entries?: HomepagePublicationEntry[] }) : {};
  const entries = Array.isArray(input.entries) ? input.entries : [];

  return {
    entries: sortEntries(
      entries.filter((entry): entry is HomepagePublicationEntry => typeof entry?.slug === "string" && typeof entry?.visibility === "string")
    )
  };
}

function serialiseState(state: HomepagePublicationState) {
  return {
    entries: sortEntries(state.entries).map((entry) => ({
      slug: entry.slug,
      visibility: entry.visibility,
      order: entry.order,
      ...(entry.overrides ? { overrides: entry.overrides } : {})
    }))
  } as Prisma.InputJsonValue;
}

async function persistState(state: HomepagePublicationState) {
  await upsertAppSetting(HOMEPAGE_PUBLICATION_STATE_KEY, serialiseState(state));
  revalidatePath("/");
  revalidatePath("/platform/accepted");
}

function mapPublicationItem(article: Article, entry: HomepagePublicationEntry): HomepagePublicationManagerItem {
  const { author, category } = getArticleContext(article);
  const overrides = entry.overrides ?? {};

  return {
    slug: article.slug,
    sourceTitle: article.title,
    title: overrides.title ?? article.title,
    subtitle: overrides.subtitle ?? article.subtitle,
    excerpt: overrides.excerpt ?? article.excerpt,
    authorName: overrides.authorName ?? author.name,
    publishedAt: overrides.publishedAt ?? article.publishedAt,
    categorySlug: article.categorySlug,
    categoryName: category.name,
    coverTone: overrides.coverTone ?? article.coverTone,
    coverMotif: overrides.coverMotif ?? article.coverMotif,
    visibility: entry.visibility,
    order: entry.order
  };
}

function mapPublicationView(article: Article, entry: HomepagePublicationEntry): HomepagePublicationView {
  const item = mapPublicationItem(article, entry);

  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle,
    excerpt: item.excerpt,
    authorName: item.authorName,
    publishedAt: item.publishedAt,
    categorySlug: item.categorySlug,
    categoryName: item.categoryName,
    coverTone: item.coverTone,
    coverMotif: item.coverMotif,
    order: item.order
  };
}

function mapCandidate(article: Article): HomepagePublicationCandidateItem {
  const { author, category } = getArticleContext(article);

  return {
    slug: article.slug,
    title: article.title,
    authorName: author.name,
    publishedAt: article.publishedAt,
    categorySlug: category.slug,
    categoryName: category.name
  };
}

export async function getHomepagePublicationState() {
  noStore();

  if (!env.hasDatabaseUrl) {
    return { entries: buildDefaultEntries() };
  }

  const setting = await getAppSetting(HOMEPAGE_PUBLICATION_STATE_KEY);

  if (!setting) {
    return { entries: buildDefaultEntries() };
  }

  return normalizeState(setting.valueJson);
}

function setVisibility(entries: HomepagePublicationEntry[], slug: string, visibility: HomepagePublicationEntry["visibility"]) {
  const next = entries.map((entry) => (entry.slug === slug ? { ...entry, visibility } : entry));

  if (visibility === "visible") {
    return sortEntries(
      next.map((entry) => ({
        ...entry,
        order: entry.slug === slug ? -1 : entry.order + 1
      }))
    );
  }

  return next;
}

export async function getHomepageEditorialContent() {
  const state = await getHomepagePublicationState();
  const articlesBySlug = getArticleMap();
  const visibleEntries = sortEntries(state.entries.filter((entry) => entry.visibility === "visible"));
  const visibleArticles = visibleEntries
    .map((entry) => {
      const article = articlesBySlug.get(entry.slug);
      return article ? mapPublicationView(article, entry) : null;
    })
    .filter((article): article is HomepagePublicationView => Boolean(article));

  return {
    heroArticle: visibleArticles[0] ?? null,
    featuredArticles: visibleArticles.slice(0, 3),
    latestArticles: visibleArticles.slice(0, 6),
    editorsPicks: visibleArticles.filter((article) => articlesBySlug.get(article.slug)?.editorsPick).slice(0, 3),
    newsroomNotes: visibleArticles.slice(0, 3)
  };
}

export async function getHomepagePublicationManagerData(): Promise<HomepagePublicationManagerData> {
  const state = await getHomepagePublicationState();
  const articles = getArticles();
  const articlesBySlug = getArticleMap();
  const existingSlugs = new Set(state.entries.map((entry) => entry.slug));
  const visible = sortEntries(state.entries.filter((entry) => entry.visibility === "visible"))
    .map((entry) => {
      const article = articlesBySlug.get(entry.slug);
      return article ? mapPublicationItem(article, entry) : null;
    })
    .filter((item): item is HomepagePublicationManagerItem => Boolean(item));

  const hidden = sortEntries(state.entries.filter((entry) => entry.visibility === "hidden"))
    .map((entry) => {
      const article = articlesBySlug.get(entry.slug);
      return article ? mapPublicationItem(article, entry) : null;
    })
    .filter((item): item is HomepagePublicationManagerItem => Boolean(item));

  const deleted = sortEntries(state.entries.filter((entry) => entry.visibility === "deleted"))
    .map((entry) => {
      const article = articlesBySlug.get(entry.slug);
      return article ? mapPublicationItem(article, entry) : null;
    })
    .filter((item): item is HomepagePublicationManagerItem => Boolean(item));

  const available = articles
    .filter((article) => !existingSlugs.has(article.slug))
    .map((article) => mapCandidate(article));

  return {
    visible,
    hidden,
    deleted,
    available,
    canPersist: env.hasDatabaseUrl
  };
}

export async function addHomepagePublication(session: AuthSession, payload: { slug: string }) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");

  const state = await getHomepagePublicationState();
  const article = getArticleMap().get(payload.slug);

  if (!article) {
    throw new NotFoundError("Article not found.");
  }

  const existing = state.entries.find((entry) => entry.slug === article.slug);
  const nextEntries = existing
    ? setVisibility(state.entries, article.slug, "visible")
    : setVisibility([...state.entries, { slug: article.slug, visibility: "visible", order: state.entries.length }], article.slug, "visible");

  const nextState = { entries: nextEntries };
  await persistState(nextState);

  return nextState;
}

export async function updateHomepagePublication(
  session: AuthSession,
  payload: {
    slug: string;
    title: string;
    subtitle: string;
    excerpt: string;
    authorName: string;
    publishedAt: string;
    coverTone: Article["coverTone"];
    coverMotif: Article["coverMotif"];
    order: number;
  }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");

  const state = await getHomepagePublicationState();
  const entry = state.entries.find((item) => item.slug === payload.slug);

  if (!entry) {
    throw new NotFoundError("Homepage publication not found.");
  }

  const nextState = {
    entries: sortEntries(
      state.entries.map((item) =>
        item.slug === payload.slug
          ? {
              ...item,
              order: payload.order,
              overrides: {
                title: payload.title,
                subtitle: payload.subtitle,
                excerpt: payload.excerpt,
                authorName: payload.authorName,
                publishedAt: payload.publishedAt,
                coverTone: payload.coverTone,
                coverMotif: payload.coverMotif
              }
            }
          : item
      )
    )
  };

  await persistState(nextState);
  return nextState;
}

export async function updateHomepagePublicationVisibility(
  session: AuthSession,
  payload: { slug: string; action: HomepagePublicationAction }
) {
  ensureDatabaseWritable();
  requireRole(session, ["editor"]);
  requireCapability(session, "MANAGE_WORKFLOWS");

  const state = await getHomepagePublicationState();

  if (!state.entries.some((entry) => entry.slug === payload.slug)) {
    throw new NotFoundError("Homepage publication not found.");
  }

  const visibility = payload.action === "hide" ? "hidden" : payload.action === "delete" ? "deleted" : "visible";
  const nextState = {
    entries: setVisibility(state.entries, payload.slug, visibility)
  };

  await persistState(nextState);
  return nextState;
}
