"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [, setIsFocused] = useState(false);
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