"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, Folder, Trash2, Globe, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CollectionClient({ initialCollections }: { initialCollections: any[] }) {
  const [collections, setCollections] = useState(initialCollections);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { collection } = await res.json();
      setCollections([collection, ...collections]);
      setNewName("");
      toast.success("Collection created");
    } catch (err) {
      toast.error("Failed to create collection");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    
    // Optimistic delete
    setCollections(collections.filter(c => c.slug !== slug));
    
    try {
      const res = await fetch(`/api/collections/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Collection deleted");
    } catch (err) {
      toast.error("Failed to delete collection");
      // Could revert here in a production app
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">New Collection Name</label>
            <Input 
              id="name"
              placeholder="e.g., SEO Toolkit, Daily Essentials" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <Button type="submit" disabled={isCreating || !newName.trim()}>
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Create
          </Button>
        </form>
      </Card>

      {collections.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No collections yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Create a collection above to group your favorite tools together and share them with the world.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Card key={collection.slug} className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div className={`inline-flex rounded-xl bg-primary/10 p-3 ring-1 ring-border`}>
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <button 
                    onClick={() => handleDelete(collection.slug)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    title="Delete collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{collection.name}</h3>
                    {collection.isPublic ? (
                      <span title="Public"><Globe className="h-3 w-3 text-muted-foreground" /></span>
                    ) : (
                      <span title="Private"><Lock className="h-3 w-3 text-muted-foreground" /></span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {collection.tools.length} tool{collection.tools.length !== 1 && 's'}
                  </p>
                </div>
              </div>
              <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Created {formatDistanceToNow(new Date(collection.createdAt))} ago</span>
                <Button asChild size="sm" variant="ghost" className="h-8 px-2 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Link href={`/collections/${collection.slug}`}>
                    View <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
