import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getToolRegistry } from "@/features/tools/tool-registry";
import { DashboardClient } from "@/features/dashboard/components/dashboard-client";

export const metadata = {
  title: "Favorites - ToolHive",
  description: "Your favorite tools.",
};

export default async function FavoritesPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-foreground">Save Your Favorites</h1>
        <p className="mb-8 text-muted-foreground">
          Sign in to save your favorite tools and access them quickly from any device.
        </p>
        <div className="flex gap-4">
          <a href="/sign-in" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Sign In
          </a>
          <a href="/sign-up" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            Sign Up
          </a>
        </div>
      </div>
    );
  }

  // Redirect to dashboard where favorites are currently managed
  redirect("/dashboard");
}
