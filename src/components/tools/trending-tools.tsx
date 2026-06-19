import { getMostSavedTools, getTrendingTools } from "@/features/tools/trending-service";
import { ToolCard } from "@/components/marketing/tool-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal-animation";

export async function TrendingSection() {
  const [trendingThisWeek, mostSaved] = await Promise.all([
    getTrendingTools(7, 4),
    getMostSavedTools(4),
  ]);

  if (trendingThisWeek.length === 0 && mostSaved.length === 0) {
    return null;
  }

  return (
    <div className="space-y-24">
      {trendingThisWeek.length > 0 && (
        <section id="trending-this-week" className="space-y-10 scroll-mt-28">
          <SectionHeading eyebrow="Trending" title="Trending This Week" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trendingThisWeek.map((tool, index) => (
              <Reveal key={tool.slug} delay={0.04 * index} className="flex flex-col h-full">
                <ToolCard
                  slug={tool.slug}
                  name={tool.name}
                  description={tool.description}
                  tags={tool.tags}
                  accent={tool.accent}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {mostSaved.length > 0 && (
        <section id="most-saved" className="space-y-10 scroll-mt-28">
          <SectionHeading eyebrow="Favorites" title="Most Saved Tools" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {mostSaved.map((tool, index) => (
              <Reveal key={tool.slug} delay={0.04 * index} className="flex flex-col h-full">
                <ToolCard
                  slug={tool.slug}
                  name={tool.name}
                  description={tool.description}
                  tags={tool.tags}
                  accent={tool.accent}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
