import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ToolCard({
  name,
  description,
  tags,
  accent,
  slug,
  label = "Featured tool",
}: Readonly<{
  name: string;
  description: string;
  tags: readonly string[];
  accent: string;
  slug: string;
  label?: string;
}>) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)]">
      
      {/* Top Header Section with smooth gradient fade */}
      <div className="relative p-6 sm:p-8 pb-4">
        <div className={`absolute inset-0 bg-linear-to-br ${accent} opacity-[0.15] mix-blend-plus-lighter dark:opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-card" />
        
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase opacity-90">
              {label}
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/50 text-muted-foreground shadow-xs ring-1 ring-border backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8 pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {description}
        </p>

        <div className="mt-auto pt-6 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center rounded-md bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/50 transition-colors group-hover:bg-muted group-hover:text-foreground"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground/60">
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <Link href={`/tools/${slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {name}</span>
      </Link>
    </Card>
  );
}