import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { DashboardClient } from "@/features/dashboard/components/dashboard-client";

export const metadata = {
  title: "Dashboard - ToolHive",
  description: "Manage your favorite tools and recent activity.",
};

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true, createdAt: true, name: true, email: true, avatarUrl: true },
  });

  if (!dbUser) {
    // Sync user if not exists
    redirect("/account");
  }

  const [favorites, activity] = await Promise.all([
    prisma.savedTool.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.recentActivity.findMany({
      where: { userId: dbUser.id },
      orderBy: { visitedAt: "desc" },
      take: 20,
    }),
  ]);

  const tools = await getToolRegistry();

  const favoriteTools = favorites.map((fav) => ({
    ...tools.find((t) => t.slug === fav.toolSlug)!,
    savedAt: fav.createdAt,
  })).filter(t => t.slug);

  const recentActivity = activity.map((act) => ({
    ...tools.find((t) => t.slug === act.toolSlug)!,
    visitedAt: act.visitedAt,
  })).filter(t => t.slug);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex items-center gap-4">
        {dbUser.avatarUrl ? (
          <img src={dbUser.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full border-2 border-border" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {dbUser.name?.charAt(0) || dbUser.email.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {dbUser.name || "User"}</h1>
          <p className="text-muted-foreground">Joined {dbUser.createdAt.toLocaleDateString()}</p>
        </div>
      </div>
      <DashboardClient
        initialFavorites={favoriteTools}
        initialActivity={recentActivity}
      />
    </div>
  );
}
