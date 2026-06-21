"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores/use-favorites-store";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  toolSlug: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FavoriteButton({ toolSlug, className, variant = "outline", size = "default" }: FavoriteButtonProps) {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const { favorites, isLoaded: isStoreLoaded, fetchFavorites, addFavorite, removeFavorite } = useFavoritesStore();
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (userId && !isStoreLoaded) {
      fetchFavorites();
    }
  }, [userId, isStoreLoaded, fetchFavorites]);

  const isFavorited = favorites.includes(toolSlug);
  const isLoading = !isAuthLoaded || (userId && !isStoreLoaded) || isMutating;

  const handleToggle = async () => {
    if (!userId) {
      // Redirect to sign in while preserving current url
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsMutating(true);

    if (isFavorited) {
      // Optimistic update
      removeFavorite(toolSlug);
      try {
        const res = await fetch(`/api/favorites/${toolSlug}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove favorite");
        toast.success("Removed from favorites");
      } catch (error) {
        addFavorite(toolSlug); // Revert
        toast.error("Failed to remove favorite");
      }
    } else {
      // Optimistic update
      addFavorite(toolSlug);
      try {
        const res = await fetch(`/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolSlug }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
        toast.success("Added to favorites");
      } catch (error) {
        removeFavorite(toolSlug); // Revert
        toast.error("Failed to add favorite");
      }
    }

    setIsMutating(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("transition-all duration-200", className)}
      onClick={handleToggle}
      disabled={isLoading}
      title={isFavorited ? "Remove from favorites" : "Save Tool"}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && (
        <Bookmark
          className={cn(
            "mr-2 h-4 w-4 transition-transform duration-200",
            isFavorited ? "fill-emerald-400 text-emerald-400" : "text-muted-foreground group-hover:text-foreground",
            isMutating ? "scale-90" : "scale-100"
          )}
        />
      )}
      {isFavorited ? "Saved" : "Save Tool"}
    </Button>
  );
}
