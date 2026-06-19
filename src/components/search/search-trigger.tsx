"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/use-search-store";

export function SearchTrigger() {
  const { onOpen } = useSearchStore();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="hidden w-64 justify-between sm:flex text-muted-foreground hover:text-foreground"
      onClick={onOpen}
    >
      <span className="inline-flex items-center">
        <Search className="mr-2 h-4 w-4" />
        Search...
      </span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
