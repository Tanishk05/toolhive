import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard";

export const metadata = {
  title: "Personal Analytics - ToolHive",
  description: "View your tool usage and personal analytics.",
};

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    redirect("/account");
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  const [recentActivities, savedCount, collectionsCount] = await Promise.all([
    prisma.recentActivity.findMany({
      where: { userId: dbUser.id },
      orderBy: { visitedAt: "desc" },
    }),
    prisma.savedTool.count({ where: { userId: dbUser.id } }),
    prisma.collection.count({ where: { userId: dbUser.id } }),
  ]);

  const allTools = await getToolRegistry();

  // Aggregate Data
  const toolsUsedSet = new Set(recentActivities.map((a) => a.toolSlug));
  
  const usageMap: Record<string, number> = {};
  const categoryMap: Record<string, number> = {};
  
  let usageThisMonth = 0;

  recentActivities.forEach((activity) => {
    usageMap[activity.toolSlug] = (usageMap[activity.toolSlug] || 0) + 1;
    
    if (new Date(activity.visitedAt) >= thirtyDaysAgo) {
      usageThisMonth++;
    }

    const toolInfo = allTools.find((t) => t.slug === activity.toolSlug);
    if (toolInfo) {
      categoryMap[toolInfo.categoryLabel] = (categoryMap[toolInfo.categoryLabel] || 0) + 1;
    }
  });

  let mostUsedToolSlug = "";
  let mostUsedToolCount = 0;
  for (const [slug, count] of Object.entries(usageMap)) {
    if (count > mostUsedToolCount) {
      mostUsedToolCount = count;
      mostUsedToolSlug = slug;
    }
  }

  let mostUsedCategory = "";
  let mostUsedCategoryCount = 0;
  for (const [cat, count] of Object.entries(categoryMap)) {
    if (count > mostUsedCategoryCount) {
      mostUsedCategoryCount = count;
      mostUsedCategory = cat;
    }
  }

  // Chart Data: Last 7 days usage
  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    chartDataMap[d.toISOString().split("T")[0]] = 0;
  }
  
  recentActivities.forEach((a) => {
    const dateStr = new Date(a.visitedAt).toISOString().split("T")[0];
    if (chartDataMap[dateStr] !== undefined) {
      chartDataMap[dateStr]++;
    }
  });

  const chartData = Object.entries(chartDataMap).map(([date, count]) => ({
    name: new Date(date).toLocaleDateString("en-US", { weekday: 'short' }),
    views: count
  }));

  const mostUsedTool = allTools.find((t) => t.slug === mostUsedToolSlug);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Personal Analytics</h1>
          <p className="mt-1 text-muted-foreground">Insights into your productivity and tool usage.</p>
        </div>
      </div>
      
      <AnalyticsDashboard 
        stats={{
          toolsUsed: toolsUsedSet.size,
          savedCount,
          collectionsCount,
          mostUsedTool: mostUsedTool ? mostUsedTool.name : "None",
          mostUsedToolCount,
          mostUsedCategory: mostUsedCategory || "None",
          usageThisMonth,
        }}
        chartData={chartData}
      />
    </div>
  );
}
