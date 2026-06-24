"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Trash2, Globe, Lock, ArrowRight, Check, Plus, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ToolIcon } from "@/features/tools/components/tool-icon";
import { getIconName } from "@/features/tools/tool-registry";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export function CollectionDetailClient({ collection, initialTools, isOwner, allTools }: any) {
  const [tools, setTools] = useState(initialTools);
  const [isPublic, setIsPublic] = useState(collection.isPublic);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublic = async () => {
    if (!isOwner) return;
    const newStatus = !isPublic;
    setIsPublic(newStatus);
    
    try {
      const res = await fetch(`/api/collections/${collection.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(newStatus ? "Collection is now public" : "Collection is now private");
    } catch {
      setIsPublic(!newStatus);
      toast.error("Failed to update status");
    }
  };

  const handleRemoveTool = async (slug: string) => {
    if (!isOwner) return;
    const newTools = tools.filter((t: any) => t.slug !== slug);
    setTools(newTools);
    
    try {
      await fetch(`/api/collections/${collection.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: newTools.map((t: any) => t.slug) }),
      });
    } catch {
      setTools(tools);
      toast.error("Failed to remove tool");
    }
  };

  const handleAddTool = async (slug: string) => {
    if (!isOwner) return;
    if (tools.some((t: any) => t.slug === slug)) return;
    
    const toolToAdd = allTools.find((t: any) => t.slug === slug);
    const newTools = [...tools, toolToAdd];
    setTools(newTools);
    
    try {
      await fetch(`/api/collections/${collection.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: newTools.map((t: any) => t.slug) }),
      });
      toast.success("Added to collection");
    } catch {
      setTools(tools);
      toast.error("Failed to add tool");
    }
  };

  const unaddedTools = allTools.filter((t: any) => !tools.some((ct: any) => ct.slug === t.slug));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {collection.user.avatarUrl ? (
              <img src={collection.user.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                {collection.user.name?.charAt(0)}
              </div>
            )}
            <span>{collection.user.name}</span>
            <span>•</span>
            <span>Created {formatDistanceToNow(new Date(collection.createdAt))} ago</span>
            <span>•</span>
            {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </div>
          <h1 className="text-4xl font-bold text-foreground">{collection.name}</h1>
          {collection.description && <p className="text-muted-foreground text-lg">{collection.description}</p>}
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Tool
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tools to Collection</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto space-y-2 py-4">
                    {unaddedTools.map((t: any) => (
                      <div key={t.slug} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                        <div className="flex items-center gap-3">
                          <ToolIcon name={getIconName(t.icon)} className="h-4 w-4" />
                          <span className="text-sm font-medium">{t.name}</span>
                        </div>
                        <Button size="sm" onClick={() => handleAddTool(t.slug)}>Add</Button>
                      </div>
                    ))}
                    {unaddedTools.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All tools are in this collection.</p>}
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleTogglePublic}>
                {isPublic ? <Lock className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
                {isPublic ? "Make Private" : "Make Public"}
              </Button>
            </>
          )}

          {(isPublic || isOwner) && (
            <>
              <Button variant={copied ? "default" : "outline"} onClick={handleShare}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Share"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const md = `# ${collection.name}\n\n${collection.description || ''}\n\n## Tools\n\n${tools.map((t: any) => `- **${t.name}**: ${t.summary} (https://toolhive.com/tools/${t.slug})`).join('\n')}`;
                    const blob = new Blob([md], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${collection.slug}.md`;
                    a.click();
                  }}>
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const csv = `Name,Summary,URL\n${tools.map((t: any) => `"${t.name}","${t.summary}","https://toolhive.com/tools/${t.slug}"`).join('\n')}`;
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${collection.slug}.csv`;
                    a.click();
                  }}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    window.print();
                  }}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {tools.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <h3 className="text-lg font-medium text-foreground">Empty Collection</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            {isOwner ? "You haven't added any tools to this collection yet. Click 'Add Tool' to get started." : "This collection doesn't have any tools yet."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool: any) => (
            <Card key={tool.slug} className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div className={`inline-flex rounded-xl bg-linear-to-br ${tool.accent || 'from-slate-700 to-slate-900'} p-3 ring-1 ring-border`}>
                    <ToolIcon name={getIconName(tool.icon)} className="h-5 w-5 text-white" />
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => handleRemoveTool(tool.slug)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 opacity-0 group-hover:opacity-100"
                      title="Remove from collection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-medium tracking-wider text-primary uppercase">{tool.categoryLabel}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{tool.summary}</p>
                </div>
              </div>
              <div className="border-t border-border bg-muted/20 px-5 py-3 flex justify-end">
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
    </div>
  );
}
