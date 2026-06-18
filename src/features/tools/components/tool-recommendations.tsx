import { ToolCard } from "@/components/marketing/tool-card";
import { getRecommendedTools, getToolsRelatedToTags, getCategoryBySlug } from "../tool-registry";
import { JsonLd } from "@/components/seo/json-ld";
import { createItemListStructuredData } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function ToolRecommendations({ currentToolSlug, relatedTags }: Readonly<{ currentToolSlug?: string; relatedTags?: readonly string[] }>) {
  const recommendedTools = relatedTags ? await getToolsRelatedToTags([...relatedTags], 3) : currentToolSlug ? await getRecommendedTools(currentToolSlug, 3) : [];

  if (recommendedTools.length === 0) {
    return null;
  }

  const primaryCategorySlug = recommendedTools[0]?.category;
  const categoryProfile = primaryCategorySlug ? await getCategoryBySlug(primaryCategorySlug) : null;
  const ctaHref = categoryProfile ? `/categories/${categoryProfile.slug}` : "/tools";
  const ctaText = categoryProfile ? `Explore ${categoryProfile.label} tools` : "View all tools";

  const itemList = createItemListStructuredData(
    recommendedTools.map((tool, index) => ({ name: tool.name, href: `/tools/${tool.slug}`, position: index + 1 }))
  );

  return (
    <section className="mt-20 space-y-6 pt-16">
      <JsonLd data={itemList} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Discover</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Explore More Free Tools</h2>
        </div>
        <Button variant="ghost" className="hidden text-primary hover:text-primary hover:bg-primary/10 sm:flex" asChild>
          <Link href={ctaHref}>
            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        <Button variant="outline" className="w-full text-muted-foreground" asChild>
          <Link href={ctaHref}>
            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
