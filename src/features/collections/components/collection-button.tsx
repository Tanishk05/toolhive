"use client";

import { useState, useEffect } from "react";
import { FolderPlus, Loader2, Plus, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CollectionButton({ toolSlug, iconOnly }: { toolSlug: string; iconOnly?: boolean }) {
  const { isLoaded, userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
   
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCollections();
    }
  }, [isOpen, userId]);

   
  const toggleToolInCollection = async (collection: any) => {
    const hasTool = collection.tools.includes(toolSlug);
    const newTools = hasTool 
      ? collection.tools.filter((t: string) => t !== toolSlug)
      : [...collection.tools, toolSlug];

    // Optimistic UI update
    setCollections(collections.map(c => 
      c.id === collection.id ? { ...c, tools: newTools } : c
    ));

    try {
      const res = await fetch(`/api/collections/${collection.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: newTools }),
      });
      if (!res.ok) throw new Error();
      toast.success(hasTool ? "Removed from collection" : "Added to collection");
    } catch {
      // Revert optimistic update
      setCollections(collections.map(c => 
        c.id === collection.id ? { ...c, tools: collection.tools } : c
      ));
      toast.error("Failed to update collection");
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName.trim(), tools: [toolSlug] }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setCollections([data.collection, ...collections]);
        setNewCollectionName("");
        toast.success("Collection created and tool added");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create collection");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded || !userId) {
    return null; // Hidden for logged out users (Option A)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" aria-label="Add to collection">
            <FolderPlus className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="outline" className="transition-all duration-200">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add to Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <form onSubmit={handleCreateCollection} className="flex items-center gap-2">
            <Input 
              placeholder="New collection name..." 
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              disabled={isCreating}
            />
            <Button type="submit" disabled={isCreating || !newCollectionName.trim()}>
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </form>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : collections.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">No collections yet.</p>
            ) : (
              collections.map((collection) => {
                const hasTool = collection.tools.includes(toolSlug);
                return (
                  <button
                    key={collection.id}
                    onClick={() => toggleToolInCollection(collection)}
                    className="flex w-full items-center justify-between rounded-md border border-border p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-sm">{collection.name}</p>
                      <p className="text-xs text-muted-foreground">{collection.tools.length} tools</p>
                    </div>
                    {hasTool && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
