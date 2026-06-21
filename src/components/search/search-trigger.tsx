"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/use-search-store";
import { cn } from "@/lib/utils";

export function SearchTrigger({ className }: { className?: string }) {
  const { onOpen } = useSearchStore();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn("hidden w-64 justify-between sm:flex text-muted-foreground hover:text-foreground", className)}
      onClick={onOpen}
    >
      <span className="inline-flex items-center">
        <Search className="mr-2 h-4 w-4" />
        <span className={cn(className?.includes('flex') ? "" : "hidden sm:inline")}>Search...</span>
      </span>
      <kbd className={cn("pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100", className?.includes('flex') && 'hidden')}>
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
