"use client";

import { useUser } from "@clerk/nextjs";
import { Search, Sparkles, Code, Calculator, Type, LineChart, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";
import { SearchTrigger } from "@/components/search/search-trigger";

const QUICK_CHIPS = [
  { label: "AI Tools", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10", query: "ai" },
  { label: "Developer", icon: Code, color: "text-emerald-500", bg: "bg-emerald-500/10", query: "developer" },
  { label: "Calculators", icon: Calculator, color: "text-amber-500", bg: "bg-amber-500/10", query: "calculator" },
  { label: "Text", icon: Type, color: "text-indigo-500", bg: "bg-indigo-500/10", query: "text" },
  { label: "SEO", icon: LineChart, color: "text-rose-500", bg: "bg-rose-500/10", query: "seo" },
  { label: "Converters", icon: RefreshCw, color: "text-cyan-500", bg: "bg-cyan-500/10", query: "converter" },
  { label: "Generators", icon: Layers, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", query: "generator" },
];

export function MobileHero() {
  const { user, isLoaded } = useUser();
  const greeting = isLoaded && user ? `Good Afternoon, ${user.firstName} \uD83D\uDC4B` : "Good Afternoon \uD83D\uDC4B";

  return (
    <section className="flex flex-col gap-6 pt-2 pb-6 md:hidden">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{greeting}</h1>
        <p className="text-sm text-muted-foreground mt-1">What tool do you need today?</p>
      </div>

      {/* Search Bar - This triggers the global search overlay */}
      <div className="relative">
        <SearchTrigger className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-2xl bg-surface border border-border/50 text-muted-foreground shadow-sm hover:bg-surface/80" />
      </div>

      {/* Quick Access Chips */}
      <div className="-mx-5 px-5 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 w-max">
          {QUICK_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <Link
                key={chip.label}
                href={`/tools?q=${chip.query}`}
                className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium transition-transform active:scale-95 border border-border/40 shadow-sm"
              >
                <div className={`p-1 rounded-lg ${chip.bg}`}>
                  <Icon className={`h-4 w-4 ${chip.color}`} />
                </div>
                {chip.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
