import type { MetadataRoute } from "next";
import { createSitemapEntry } from "@/lib/seo";
import { getBlogSitemapEntries } from "@/features/blog/blog-registry";
import { getCategoryBySlug, getToolCategories, getToolRegistry } from "@/features/tools/tool-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const tools = await getToolRegistry();
  const categories = await getToolCategories();

  return [
    createSitemapEntry("/", now, "daily", 1),
    createSitemapEntry("/tools", now, "daily", 0.95),
    createSitemapEntry("/categories", now, "weekly", 0.9),
    createSitemapEntry("/design-system", now, "monthly", 0.3),
    ...tools.map((tool) => createSitemapEntry(`/tools/${tool.slug}`, tool.addedAt, "weekly", tool.featured ? 0.9 : 0.7)),
    ...categories.map((category) => createSitemapEntry(`/categories/${category.slug}`, now, "weekly", 0.8)),
    ...(await getBlogSitemapEntries()),
  ];
}
