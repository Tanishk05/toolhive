"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Folder, FileText, Bookmark, X } from "lucide-react";
import { useSearchStore } from "@/stores/use-search-store";
import { ToolIcon } from "@/features/tools/components/tool-icon";
import { getIconName } from "@/features/tools/tool-registry";
import { useFavoritesStore } from "@/stores/use-favorites-store";


interface SearchData {
  tools: any[];
  categories: any[];
  blogs: any[];
}

export function CommandPalette({ data }: { data: SearchData }) {
  const { isOpen, setIsOpen, toggle } = useSearchStore();
  const { favorites } = useFavoritesStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  if (!isOpen) return null;

  const favoriteTools = data.tools.filter((t) => favorites.includes(t.slug));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)} 
      />
      
      <Command 
        className="relative z-50 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl mx-4"
        label="Global Command Menu"
        shouldFilter={true}
        filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          return 0;
        }}
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="mr-3 h-5 w-5 text-muted-foreground" />
          <Command.Input 
            autoFocus
            placeholder="Search tools, categories, and more..." 
            className="flex h-6 w-full bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            value={query}
            onValueChange={setQuery}
          />
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found for "{query}"
          </Command.Empty>

          {favoriteTools.length > 0 && (
            <Command.Group heading="Favorites" className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {favoriteTools.map((tool) => (
                <Command.Item
                  key={`fav-${tool.slug}`}
                  value={`favorite ${tool.name} ${tool.slug}`}
                  onSelect={() => runCommand(() => router.push(`/tools/${tool.slug}`))}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Bookmark className="mr-3 h-4 w-4 text-emerald-400" />
                  <span>{tool.name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Tools" className="px-2 py-1 text-xs font-medium text-muted-foreground">
            {data.tools.map((tool) => (
              <Command.Item
                key={tool.slug}
                value={`${tool.name} ${tool.categoryLabel} ${tool.summary}`}
                onSelect={() => runCommand(() => router.push(`/tools/${tool.slug}`))}
                className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                  <ToolIcon name={getIconName(tool.icon)} className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span>{tool.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{tool.summary}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Categories" className="px-2 py-1 text-xs font-medium text-muted-foreground">
            {data.categories.map((category) => (
              <Command.Item
                key={category.slug}
                value={`category ${category.label}`}
                onSelect={() => runCommand(() => router.push(`/categories/${category.slug}`))}
                className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Folder className="mr-3 h-4 w-4 text-primary" />
                <span>{category.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {data.blogs && data.blogs.length > 0 && (
            <Command.Group heading="Blog" className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {data.blogs.map((post) => (
                <Command.Item
                  key={post.slug}
                  value={`blog ${post.title}`}
                  onSelect={() => runCommand(() => router.push(`/blog/${post.slug}`))}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <FileText className="mr-3 h-4 w-4 text-primary" />
                  <span>{post.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

        </Command.List>
      </Command>
    </div>
  );
}
