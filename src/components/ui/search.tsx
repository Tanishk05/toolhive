"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchTools } from "@/features/tools/tool-registry";

export function SearchBar({
  action = "/search",
  placeholder = "Search tools, categories, or articles",
  name = "q",
  defaultValue = "",
  params,
}: Readonly<{
  action?: string;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  params?: Readonly<Record<string, string | undefined>>;
}>) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Use a custom hook or just an inline effect for click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = query.trim().length > 0 ? searchTools(query).slice(0, 5) : [];
  const showDropdown = isFocused && query.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setIsFocused(false);
      const urlParams = new URLSearchParams();
      urlParams.set(name, query);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v) urlParams.set(k, v);
        });
      }
      router.push(`${action}?${urlParams.toString()}`);
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
        <Input 
          id="toolhive-search" 
          name={name} 
          placeholder={placeholder} 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
        />

        {/* Autocomplete Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl">
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((tool) => (
                  <li key={tool.slug}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFocused(false);
                        router.push(`/tools/${tool.slug}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setIsFocused(false);
                          router.push(`/tools/${tool.slug}`);
                        }
                      }}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${tool.accent}`}>
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{tool.name}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">{tool.description}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                No tools found matching &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>
      {params
        ? Object.entries(params).map(([paramName, value]) =>
            value ? <input key={paramName} type="hidden" name={paramName} value={value} /> : null
          )
        : null}
      <Button type="submit" size="lg">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}