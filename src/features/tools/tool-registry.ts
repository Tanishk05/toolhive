import { type LucideIcon } from "lucide-react";

export type ToolCategorySlug =
  | "productivity"
  | "developer"
  | "business"
  | "content"
  | "analytics"
  | "monetization";

export type ToolSeo = {
  title: string;
  description: string;
  keywords: readonly string[];
  canonical: string;
};

export type ToolRegistryEntry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategorySlug;
  categoryLabel: string;
  categoryDescription: string;
  icon: string | null;
  featured: boolean;
  premium: boolean;
  popularity: number;
  addedAt: string;
  accent: string;
  tags: readonly string[];
  searchTerms: readonly string[];
  summary: string;
  seo: ToolSeo;
};

export type ToolCategoryRegistryEntry = {
  id: string;
  slug: string;
  label: string;
  description: string;
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
  };
};

import { prisma } from "@/lib/prisma";
import type { Prisma, Category } from "@prisma/client";
import * as Icons from "lucide-react";

export function getIconComponent(iconName: string | null): LucideIcon {
  if (!iconName) return Icons.Wrench as LucideIcon;
  const icon = (Icons as Record<string, unknown>)[iconName];
  return (icon || Icons.Wrench) as LucideIcon;
}

export async function getToolCategories(): Promise<ToolCategoryRegistryEntry[]> {
  const categories = await prisma.category.findMany();
  return categories.map((cat: Category) => ({
    id: cat.id,
    slug: cat.slug,
    label: cat.label,
    description: cat.description,
    seo: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      canonical: cat.seoCanonical,
    }
  }));
}

export async function getToolRegistry(): Promise<ToolRegistryEntry[]> {
  const tools = await prisma.tool.findMany({
    where: { published: true },
    include: { category: true }
  });

  type PrismaToolWithCategory = Prisma.ToolGetPayload<{
    include: { category: true }
  }>;

  return tools.map((tool: PrismaToolWithCategory) => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    category: tool.category.slug as ToolCategorySlug,
    categoryLabel: tool.category.label,
    categoryDescription: tool.category.description,
    icon: tool.icon,
    featured: tool.featured,
    premium: tool.premium,
    popularity: tool.popularity,
    addedAt: tool.createdAt.toISOString(),
    accent: tool.accent || "from-blue-500/30 to-indigo-400/10",
    tags: tool.tags,
    searchTerms: tool.searchTerms,
    summary: tool.summary,
    seo: {
      title: tool.seoTitle || "",
      description: tool.seoDescription || "",
      keywords: tool.seoKeywords,
      canonical: tool.seoCanonical || "",
    }
  }));
}

export async function getToolBySlug(slug: string) {
  const tools = await getToolRegistry();
  return tools.find((tool) => tool.slug === slug);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getToolCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getFeaturedTools() {
  const tools = await getToolRegistry();
  return tools.filter((tool) => tool.featured);
}

export async function getRecentlyAddedTools(limit = 3) {
  const tools = await getToolRegistry();
  return [...tools]
    .sort((left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime())
    .slice(0, limit);
}

export function sortTools<TTool extends Pick<ToolRegistryEntry, "name" | "popularity" | "addedAt">>(
  tools: readonly TTool[],
  sortBy: "popular" | "recent" | "alphabetical" = "popular"
) {
  const sorted = [...tools];

  if (sortBy === "popular") {
    return sorted.sort((left, right) => right.popularity - left.popularity || right.name.localeCompare(left.name));
  }

  if (sortBy === "recent") {
    return sorted.sort((left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime());
  }

  return sorted.sort((left, right) => left.name.localeCompare(right.name));
}

export async function getToolsByCategory(categorySlug: string) {
  const tools = await getToolRegistry();
  return tools.filter((tool) => tool.category === categorySlug);
}

export async function searchTools(query: string, options?: { category?: ToolCategorySlug; featuredOnly?: boolean; premiumOnly?: boolean }) {
  const normalizedQuery = query.trim().toLowerCase();
  const tools = await getToolRegistry();

  return tools.filter((tool) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [tool.name, tool.slug, tool.description, tool.summary, ...tool.tags, ...tool.searchTerms].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    const matchesCategory = !options?.category || tool.category === options.category;
    const matchesFeatured = !options?.featuredOnly || tool.featured;
    const matchesPremium = !options?.premiumOnly || tool.premium;

    return matchesQuery && matchesCategory && matchesFeatured && matchesPremium;
  });
}

export async function searchCategories(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const categories = await getToolCategories();

  return categories.filter((category) => {
    if (normalizedQuery.length === 0) {
      return true;
    }

    return [category.label, category.slug, category.description].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function buildToolBreadcrumbs(tool: ToolRegistryEntry) {
  return [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.categoryLabel, href: `/categories/${tool.category}` },
    { label: tool.name, href: `/tools/${tool.slug}` },
  ] as const;
}

export function buildCategoryBreadcrumbs(category: ToolCategoryRegistryEntry) {
  return [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: category.label, href: `/categories/${category.slug}` },
  ] as const;
}

export async function getRecommendedTools(currentToolSlug: string, limit = 3) {
  const tools = await getToolRegistry();
  const currentTool = tools.find((t) => t.slug === currentToolSlug);
  if (!currentTool) return [];

  // 1. Get tools in the same category (excluding current)
  const sameCategory = tools.filter(
    (tool) => tool.category === currentTool.category && tool.slug !== currentToolSlug
  );

  // 2. Sort them by popularity
  const sortedCategory = sortTools(sameCategory, "popular");

  // 3. If we don't have enough, fill with other popular tools
  if (sortedCategory.length < limit) {
    const needed = limit - sortedCategory.length;
    const existingSlugs = new Set([currentToolSlug, ...sortedCategory.map((t) => t.slug)]);
    
    const otherPopular = sortTools(
      tools.filter((tool) => !existingSlugs.has(tool.slug)),
      "popular"
    ).slice(0, needed);
    
    return [...sortedCategory, ...otherPopular];
  }

  return sortedCategory.slice(0, limit);
}

export async function getToolsRelatedToTags(tags: string[], limit = 3) {
  const normalizedTags = tags.map((t) => t.toLowerCase());
  const tools = await getToolRegistry();

  const scoredTools = tools.map((tool) => {
    const toolKeywords = [...tool.tags, ...tool.searchTerms, tool.name, tool.categoryLabel].map((t) => t.toLowerCase());
    const sharedTags = toolKeywords.filter((keyword) => normalizedTags.some(t => t.includes(keyword) || keyword.includes(t)));
    let score = sharedTags.length * 3;
    if (tool.featured) score += 2;
    return { tool, score };
  });

  const related = scoredTools
    .filter((t) => t.score > 0)
    .sort((left, right) => right.score - left.score || right.tool.popularity - left.tool.popularity)
    .slice(0, limit)
    .map(({ tool }) => tool);

  // Fallback to popular tools if we don't have enough highly related ones
  if (related.length < limit) {
    const existingSlugs = new Set(related.map((t) => t.slug));
    const fallback = sortTools(
      tools.filter((tool) => !existingSlugs.has(tool.slug)),
      "popular"
    ).slice(0, limit - related.length);
    return [...related, ...fallback];
  }

  return related;
}
