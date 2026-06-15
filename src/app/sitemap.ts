import type { MetadataRoute } from "next";
import { createSitemapEntry } from "@/lib/seo";
import { getBlogSitemapEntries } from "@/features/blog/blog-registry";
import { getToolCategories, getToolRegistry } from "@/features/tools/tool-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const tools = await getToolRegistry();
  const categories = await getToolCategories();

  return [
    // Core pages
    createSitemapEntry("/", now, "daily", 1),
    createSitemapEntry("/tools", now, "daily", 0.95),
    createSitemapEntry("/categories", now, "weekly", 0.9),
    createSitemapEntry("/blog", now, "daily", 0.9),
    createSitemapEntry("/about", now, "monthly", 0.6),
    createSitemapEntry("/contact", now, "monthly", 0.5),

    // Legal pages
    createSitemapEntry("/privacy-policy", now, "monthly", 0.3),
    createSitemapEntry("/terms-of-service", now, "monthly", 0.3),
    createSitemapEntry("/disclaimer", now, "monthly", 0.3),

    // Tool pages
    ...tools.map((tool) => createSitemapEntry(`/tools/${tool.slug}`, tool.addedAt, "weekly", tool.featured ? 0.9 : 0.7)),

    // Category pages
    ...categories.map((category) => createSitemapEntry(`/categories/${category.slug}`, now, "weekly", 0.8)),

    // Blog pages
    ...(await getBlogSitemapEntries()),
  ];
}
