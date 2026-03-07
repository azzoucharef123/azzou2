import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getArticles, getAuthors, getCategories, getIssues } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/articles", "/categories", "/issues", "/team", "/authors", "/contact", "/submit"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date()
    })),
    ...getArticles().map((article) => ({
      url: `${siteConfig.url}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt)
    })),
    ...getCategories().map((category) => ({
      url: `${siteConfig.url}/categories/${category.slug}`,
      lastModified: new Date()
    })),
    ...getIssues().map((issue) => ({
      url: `${siteConfig.url}/issues/${issue.slug}`,
      lastModified: new Date(issue.releasedAt)
    })),
    ...getAuthors().map((author) => ({
      url: `${siteConfig.url}/authors/${author.slug}`,
      lastModified: new Date()
    }))
  ];
}
