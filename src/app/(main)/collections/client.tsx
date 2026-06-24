"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Folder, Globe, Lock, ArrowRight, Heart, Eye, 
  Sparkles, Loader2, Plus, Trash2, Settings 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

const aiCollectionSchema = z.object({
  name: z.string(),
  description: z.string(),
  tools: z.array(z.string()).describe("List of existing Tool slugs to include"),
});

export function CollectionsClient({ 
  publicCollections, 
  myCollections: initialMyCollections,
  isAuthenticated 
}: { 
  publicCollections: any[]; 
  myCollections: any[];
  isAuthenticated: boolean;
}) {
  const [myCollections, setMyCollections] = useState(initialMyCollections);
  const [activeTab, setActiveTab] = useState("discover");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const { submit: submitAi, object: aiObject, isLoading: isAiLoading } = useObject({
    api: "/api/collections/generate",
    schema: aiCollectionSchema,
    onFinish({ object }) {
      if (object) {
        handleCreateFromAi(object);
      }
    }
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, isPublic: false }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { collection } = await res.json();
      setMyCollections([collection, ...myCollections]);
      setNewName("");
      toast.success("Collection created");
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromAi = async (data: any) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: data.name, 
          description: data.description,
          tools: data.tools || [],
          isPublic: false
        }),
      });
      if (!res.ok) throw new Error("Failed to create from AI");
      const { collection } = await res.json();
      setMyCollections([collection, ...myCollections]);
      toast.success("AI Collection created successfully!");
      setIsAiDialogOpen(false);
      setAiPrompt("");
    } catch {
      toast.error("Failed to save AI collection");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setMyCollections(myCollections.filter(c => c.slug !== slug));
    try {
      const res = await fetch(`/api/collections/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete collection");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <div className="flex justify-center">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-14 items-center">
          <TabsTrigger value="discover" className="h-10 text-base">Discover</TabsTrigger>
          <TabsTrigger value="my-collections" className="h-10 text-base">My Collections</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="discover" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {publicCollections.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No public collections available yet. Be the first to publish one!
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {publicCollections.map((col) => (
              <Card key={col.id} className="break-inside-avoid mb-6 overflow-hidden hover:shadow-lg transition-all group border-border hover:border-primary/50">
                {col.coverImage ? (
                   
                  <img src={col.coverImage} alt={col.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Folder className="w-12 h-12 text-primary/40" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/collections/${col.slug}`} className="before:absolute before:inset-0">
                        {col.name}
                      </Link>
                    </h3>
                  </div>
                  {col.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{col.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    {col.user?.avatarUrl ? (
                       
                      <img src={col.user.avatarUrl} alt={col.user.name || "User"} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-full" />
                    )}
                    <span className="text-xs font-medium text-foreground">{col.user?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border pt-4">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {col.likesCount || 0}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {col.views || 0}</span>
                    </div>
                    <span>{col.tools?.length || 0} Tools</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="my-collections" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!isAuthenticated ? (
          <Card className="p-12 text-center max-w-2xl mx-auto border-dashed">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-6">You need to sign in to create and manage your own collections.</p>
            <Button asChild><Link href="/sign-in">Sign In</Link></Button>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold text-foreground">New Manual Collection</label>
                    <p className="text-xs text-muted-foreground mb-2">Create a collection from scratch.</p>
                    <Input 
                      id="name"
                      placeholder="e.g., Daily Essentials" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  <Button type="submit" disabled={isCreating || !newName.trim()} className="w-full">
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Manually
                  </Button>
                </form>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Collection Generator</h3>
                    <p className="text-xs text-muted-foreground mb-2">Let AI build a perfect stack for your use-case.</p>
                  </div>
                  <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full font-semibold border border-primary/20 hover:bg-primary hover:text-primary-foreground">
                        <Sparkles className="w-4 h-4 mr-2" /> Generate with AI
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Collection</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <label className="text-sm font-medium">Describe your needs</label>
                        <Input 
                          placeholder="e.g. 'I am a freelance React developer'" 
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value)}
                        />
                        <Button 
                          onClick={() => submitAi({ prompt: aiPrompt })} 
                          disabled={!aiPrompt.trim() || isAiLoading}
                          className="w-full"
                        >
                          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                          {isAiLoading ? "Generating..." : "Generate Stack"}
                        </Button>

                        {(aiObject || isAiLoading) && (
                          <Card className="p-4 bg-muted text-sm space-y-2">
                            <p className="font-bold">{aiObject?.name || "Generating name..."}</p>
                            <p className="text-muted-foreground">{aiObject?.description || "Generating description..."}</p>
                            <p className="text-xs font-mono text-primary mt-2">Tools: {aiObject?.tools?.join(", ")}</p>
                          </Card>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </div>

            {myCollections.length === 0 ? (
              <div className="text-center py-16">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No collections yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                  Create a collection to bundle your favorite tools and share them with the world.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myCollections.map((collection) => (
                  <Card key={collection.slug} className="group flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="p-5 flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                          <Folder className="h-5 w-5" />
                        </div>
                        <div className="flex gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Link href={`/collections/${collection.slug}/edit`}><Settings className="w-4 h-4" /></Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(collection.slug)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-lg">{collection.name}</h3>
                          {collection.isPublic ? (
                            <span title="Public"><Globe className="h-3.5 w-3.5 text-muted-foreground" /></span>
                          ) : (
                            <span title="Private"><Lock className="h-3.5 w-3.5 text-muted-foreground" /></span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {collection.tools?.length || 0} tool{(collection.tools?.length || 0) !== 1 && 's'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted/30 px-5 py-3 flex items-center justify-between border-t border-border">
                      <span className="text-xs text-muted-foreground">Updated {formatDistanceToNow(new Date(collection.updatedAt))} ago</span>
                      <Button asChild size="sm" variant="secondary" className="h-8">
                        <Link href={`/collections/${collection.slug}`}>
                          View <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
