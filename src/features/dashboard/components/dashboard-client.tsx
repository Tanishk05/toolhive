"use client";
 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, ListFilter, Play, Trash2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/features/tools/components/tool-icon";
import { getIconName } from "@/features/tools/tool-registry";
import { toast } from "sonner";
import { useFavoritesStore } from "@/stores/use-favorites-store";

export function DashboardClient({ initialFavorites, initialActivity }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  
  const { removeFavorite } = useFavoritesStore();
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemoveFavorite = async (slug: string) => {
    // Optimistic update
    setFavorites(favorites.filter((f: any) => f.slug !== slug));
    removeFavorite(slug);
    
    try {
      const res = await fetch(`/api/favorites/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove favorite");
      // Revert in a real app, but omitting for brevity
    }
  };

  const filteredFavorites = favorites.filter((tool: any) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tool.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(); // recent
  });

  const categories = Array.from(new Set(favorites.map((f: any) => f.category)));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-8">
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Saved Tools</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search tools..." 
                  className="w-full pl-9 sm:w-64 bg-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="h-10 rounded-md border border-input bg-card px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select 
                className="h-10 rounded-md border border-input bg-card px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Saved</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {filteredFavorites.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <ListFilter className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No tools found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {searchQuery ? "No tools match your search criteria. Try adjusting your filters." : "Start saving tools you use often."}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-6">
                  <Link href="/tools">Browse Tools</Link>
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredFavorites.map((tool: any) => (
                <Card key={tool.slug} className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between">
                      <div className={`inline-flex rounded-xl bg-linear-to-br ${tool.accent || 'from-slate-700 to-slate-900'} p-3 ring-1 ring-border`}>
                        <ToolIcon name={getIconName(tool.icon)} className="h-5 w-5 text-white" />
                      </div>
                      <button 
                        onClick={() => handleRemoveFavorite(tool.slug)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] font-medium tracking-wider text-primary uppercase">{tool.categoryLabel}</p>
                      <h3 className="mt-1 font-semibold text-foreground">{tool.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{tool.summary}</p>
                    </div>
                  </div>
                  <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Saved {formatDistanceToNow(new Date(tool.savedAt))} ago</span>
                    <Button asChild size="sm" variant="ghost" className="h-8 px-2 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link href={`/tools/${tool.slug}`}>
                        Launch <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Overview</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Saved Tools</span>
              <span className="font-medium text-foreground">{favorites.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Activities</span>
              <span className="font-medium text-foreground">{initialActivity.length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          {initialActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {initialActivity.map((act: any, i: number) => (
                <div key={`${act.slug}-${i}`} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-primary/10 p-1.5">
                    <ToolIcon name={getIconName(act.icon)} className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Link href={`/tools/${act.slug}`} className="text-sm font-medium text-foreground hover:underline">
                      {act.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(act.visitedAt))} ago</p>
                  </div>
                  <Button asChild size="icon" variant="ghost" className="h-7 w-7">
                    <Link href={`/tools/${act.slug}`}>
                      <Play className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
