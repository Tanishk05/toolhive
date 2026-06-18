import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ToolCard({
  name,
  description,
  tags,
  slug,
}: Readonly<{
  name: string;
  description: string;
  tags: readonly string[];
  accent: string;
  slug: string;
  label?: string;
}>) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:bg-surface-hover hover:shadow-[0_8px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(143,175,147,0.05)]">
      
      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {name}
            </h3>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-muted-foreground/30 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </div>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground/60 line-clamp-2">
          {description}
        </p>

        <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="rounded-full bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground/45 transition-colors group-hover:text-muted-foreground/60"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-1 text-[11px] text-muted-foreground/30">
              +{tags.length - 2}
            </span>
          )}
        </div>
      </div>

      <Link href={`/tools/${slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">View {name}</span>
      </Link>
    </div>
  );
}