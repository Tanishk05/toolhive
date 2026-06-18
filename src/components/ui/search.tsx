"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SearchSuggestion = {
  label: string;
  href?: string;
};

export function SearchBar({
  action = "/search",
  placeholder = "Search tools, categories, or articles",
  name = "q",
  defaultValue = "",
  params,
  suggestions = [],
}: Readonly<{
  action?: string;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  params?: Readonly<Record<string, string | undefined>>;
  suggestions?: SearchSuggestion[];
}>) {
  const [query, setQuery] = useState(defaultValue);
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  const [prevQuery, setPrevQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setQuery(defaultValue);
  }

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(-1);
  }

  const filteredSuggestions = suggestions
    .filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  const showSuggestions = isFocused && query.length > 0 && filteredSuggestions.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent, suggestion?: SearchSuggestion) => {
    if (e) e.preventDefault();
    setIsFocused(false);

    if (suggestion?.href) {
      router.push(suggestion.href);
      return;
    }

    const finalQuery = suggestion ? suggestion.label : query;
    const urlParams = new URLSearchParams();
    if (finalQuery.trim().length > 0) {
      urlParams.set(name, finalQuery);
    }
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) urlParams.set(k, v);
      });
    }
    const queryString = urlParams.toString();
    router.push(`${action}${queryString ? `?${queryString}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      setQuery(filteredSuggestions[selectedIndex].label);
      handleSubmit(undefined, filteredSuggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <form 
      ref={formRef}
      role="search" 
      action={action} 
      method="get" 
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <label htmlFor="toolhive-search" className="sr-only">
          Search
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground/50" />
        </div>
        <Input 
          id="toolhive-search" 
          name={name} 
          placeholder={placeholder} 
          value={query}
          size="lg"
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="pl-11"
        />

        {showSuggestions && (
          <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-[var(--radius)] border border-border/50 bg-popover/95 p-1 text-popover-foreground shadow-xl backdrop-blur-md">
            <ul role="listbox">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.label}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2.5 text-sm outline-none transition-colors ${
                    index === selectedIndex ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  }`}
                  onClick={() => {
                    setQuery(suggestion.label);
                    handleSubmit(undefined, suggestion);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Search className="h-4 w-4 shrink-0 opacity-50" />
                  <span className="truncate">{suggestion.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {params
        ? Object.entries(params).map(([paramName, value]) =>
            value ? <input key={paramName} type="hidden" name={paramName} value={value} /> : null
          )
        : null}
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}