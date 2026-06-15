import { ToolCard } from "@/components/marketing/tool-card";
import { getRecommendedTools } from "../tool-registry";
import { JsonLd } from "@/components/seo/json-ld";
import { createItemListStructuredData } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ToolRecommendations({ currentToolSlug }: Readonly<{ currentToolSlug: string }>) {
  const recommendedTools = getRecommendedTools(currentToolSlug, 3);

  if (recommendedTools.length === 0) {
    return null;
  }

  const itemList = createItemListStructuredData(
    recommendedTools.map((tool, index) => ({ name: tool.name, href: `/tools/${tool.slug}`, position: index + 1 }))
  );

  return (
    <section className="mt-16 space-y-6 border-t border-white/10 pt-16">
      <JsonLd data={itemList} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Discover</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Explore More Free Tools</h2>
        </div>
        <Button variant="ghost" className="hidden text-slate-300 hover:text-white sm:flex" asChild>
          <Link href="/tools">
            View all tools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recommendedTools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            name={tool.name}
            description={tool.description}
            tags={tool.tags}
            accent={tool.accent}
            label={tool.categoryLabel}
          />
        ))}
      </div>
      
      <div className="mt-4 sm:hidden">
        <Button variant="outline" className="w-full text-slate-300" asChild>
          <Link href="/tools">
            View all tools <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
