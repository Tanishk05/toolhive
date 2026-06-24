"use client";

import { ChevronLeft, Share, Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/features/tools/components/tool-icon";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { toast } from "sonner";

import { useUser } from "@clerk/nextjs";
import { CollectionButton } from "@/features/collections/components/collection-button";

export function ToolHeaderMobile({
  toolName,
  toolSlug,
  iconName,
}: {
  toolName: string;
  toolSlug: string;
  iconName: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFav = favorites.includes(toolSlug);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${toolName} - ToolHive`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in to save tools");
      return;
    }
    
    if (isFav) {
      removeFavorite(toolSlug);
      toast.success("Tool removed from favorites");
      try {
        await fetch(`/api/favorites/${toolSlug}`, { method: "DELETE" });
      } catch {}
    } else {
      addFavorite(toolSlug);
      toast.success("Tool saved to favorites");
      try {
        await fetch(`/api/favorites`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolSlug })
        });
      } catch {}
    }
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full -ml-3" onClick={() => router.back()} aria-label="Go back">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          { }
          <ToolIcon name={iconName as any} className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm truncate max-w-[150px]">{toolName}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={handleShare} aria-label="Share tool">
          <Share className="h-5 w-5" />
        </Button>
        {user && (
          <>
            <CollectionButton toolSlug={toolSlug} iconOnly />
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={handleFavorite} aria-label={isFav ? "Remove from favorites" : "Add to favorites"}>
              {isFav ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
