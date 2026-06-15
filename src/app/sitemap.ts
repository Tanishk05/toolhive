import type { MetadataRoute } from "next";
import { createSitemapEntry } from "@/lib/seo";
import { getBlogSitemapEntries } from "@/features/blog/blog-registry";
import { getCategoryBySlug, toolCategories, toolRegistry } from "@/features/tools/tool-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    createSitemapEntry("/", now, "daily", 1),
    createSitemapEntry("/tools", now, "daily", 0.95),
    createSitemapEntry("/categories", now, "weekly", 0.9),
    createSitemapEntry("/design-system", now, "monthly", 0.3),
    ...toolRegistry.map((tool) => createSitemapEntry(`/tools/${tool.slug}`, tool.addedAt, "weekly", tool.featured ? 0.9 : 0.7)),
    ...toolCategories
      .filter((category) => Boolean(getCategoryBySlug(category.slug)))
      .map((category) => createSitemapEntry(`/categories/${category.slug}`, now, "weekly", 0.8)),
    ...getBlogSitemapEntries(),
  ];
}
