import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { unstable_cache } from "next/cache";

/**
 * Compute the most saved tools (Favorites).
 * Cached for 1 hour (3600 seconds)
 */
export const getMostSavedTools = unstable_cache(
  async (limit = 6) => {
    const savedCounts = await prisma.savedTool.groupBy({
      by: ["toolSlug"],
      _count: { toolSlug: true },
      orderBy: { _count: { toolSlug: "desc" } },
      take: limit,
    });

    const allTools = await getToolRegistry();
    return savedCounts.map((s) => ({
      ...allTools.find((t) => t.slug === s.toolSlug)!,
      saveCount: s._count.toolSlug,
    })).filter((t) => t.id); // Filter out any mismatched slugs
  },
  ["most-saved-tools"],
  { revalidate: 3600 }
);

/**
 * Compute trending tools based on RecentActivity within a time window.
 * Cached for 30 minutes (1800 seconds)
 */
export const getTrendingTools = unstable_cache(
  async (days = 7, limit = 6) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const activityCounts = await prisma.recentActivity.groupBy({
      by: ["toolSlug"],
      _count: { toolSlug: true },
      where: { visitedAt: { gte: cutoffDate } },
      orderBy: { _count: { toolSlug: "desc" } },
      take: limit,
    });

    const allTools = await getToolRegistry();
    return activityCounts.map((a) => ({
      ...allTools.find((t) => t.slug === a.toolSlug)!,
      viewCount: a._count.toolSlug,
    })).filter((t) => t.id); // Filter out any mismatched slugs
  },
  ["trending-tools"],
  { revalidate: 1800 }
);
