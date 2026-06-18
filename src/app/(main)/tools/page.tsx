/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/marketing/tool-card";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { SearchBar } from "@/components/ui/search";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getCategoryBySlug,
  getFeaturedTools,
  getRecentlyAddedTools,
  searchTools,
  sortTools,
  getToolCategories,
  getToolRegistry,
} from "@/features/tools/tool-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

type ToolSortOption = "popular" | "recent" | "alphabetical";

export async function generateMetadata({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const category = typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : undefined;
  const sort = parseSort(typeof resolvedSearchParams?.sort === "string" ? resolvedSearchParams.sort : undefined);

  const categoryLabel = category ? (await getCategoryBySlug(category))?.label : undefined;
  const titleParts = [categoryLabel ?? "Tools", sort === "recent" ? "Recently Added" : sort === "alphabetical" ? "Alphabetical" : "Popular"];
  const title = query ? `Search results for "${query}" | ToolHive` : `${titleParts.join(" - ")} | ToolHive`;

  return createMetadata({
    title,
    description:
      query
      ? `Search ToolHive tools for ${query}.`
      : categoryLabel
        ? `Browse ToolHive ${categoryLabel.toLowerCase()} tools sorted by ${sort}.`
        : "Search, filter, and discover ToolHive tools.",
    path: "/tools",
    keywords: ["tools", "directory", "search", "filter", "ToolHive"],
  });
}

export default async function ToolsPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const category = typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : undefined;
  const featuredOnly = resolvedSearchParams?.featured === "true";
  const premiumOnly = resolvedSearchParams?.premium === "true";
  const sort = parseSort(typeof resolvedSearchParams?.sort === "string" ? resolvedSearchParams.sort : undefined);

  const filteredTools = sortTools(
    await searchTools(query, {
      category: category as any,
      featuredOnly,
      premiumOnly,
    }),
    sort
  );
  const featuredTools = sortTools(await getFeaturedTools(), "popular").slice(0, 4);
  const recentlyAddedTools = await getRecentlyAddedTools(4);
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }] as const;
  const itemList = createItemListStructuredData(
    filteredTools.map((tool, index) => ({ name: tool.name, href: `/tools/${tool.slug}`, position: index + 1 }))
  );

  const activeCategoryLabel = category ? (await getCategoryBySlug(category))?.label : undefined;
  const categoriesList = await getToolCategories();
  const allTools = await getToolRegistry();
  const searchSuggestions = allTools.map((t) => ({ label: t.name, href: `/tools/${t.slug}` }));

  return (
    <div className="flex flex-col gap-10 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={itemList} />
      <header className="space-y-5">
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-4">
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Tool Directory</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Discover tools</h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground/70">
            Search, filter, and find the right utility for any task.
          </p>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[var(--radius)] bg-surface p-6">
          <SearchBar
            action="/tools"
            placeholder="Search tools by name, tag, or category"
            defaultValue={query}
            suggestions={searchSuggestions}
            params={{
              category,
              sort,
              featured: featuredOnly ? "true" : undefined,
              premium: premiumOnly ? "true" : undefined,
            }}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterChip label="All" href={buildDirectoryHref({ query, sort })} active={!category && !featuredOnly && !premiumOnly} />
            <FilterChip label="Featured" href={buildDirectoryHref({ query, sort, featured: true })} active={Boolean(featuredOnly)} />
            <FilterChip label="Premium" href={buildDirectoryHref({ query, sort, premium: true })} active={Boolean(premiumOnly)} />
            {categoriesList.map((item) => (
              <FilterChip
                key={item.slug}
                label={item.label}
                href={buildDirectoryHref({ query, sort, category: item.slug })}
                active={category === item.slug}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius)] bg-surface p-6">
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Sort</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SortChip label="Popular" href={buildDirectoryHref({ query, category, sort: "popular", featured: featuredOnly, premium: premiumOnly })} active={sort === "popular"} />
            <SortChip label="Recently Added" href={buildDirectoryHref({ query, category, sort: "recent", featured: featuredOnly, premium: premiumOnly })} active={sort === "recent"} />
            <SortChip label="Alphabetical" href={buildDirectoryHref({ query, category, sort: "alphabetical", featured: featuredOnly, premium: premiumOnly })} active={sort === "alphabetical"} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <Metric label="Total tools" value={String(allTools.length)} />
            <Metric label="Featured" value={String(featuredTools.length)} />
            <Metric label="Recently added" value={String(recentlyAddedTools.length)} />
            <Metric label="Category" value={activeCategoryLabel ?? "All"} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Featured Tools</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">High-signal tools worth surfacing first</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} slug={tool.slug} name={tool.name} description={tool.description} tags={tool.tags} accent={tool.accent} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Recently Added</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">The newest entries</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recentlyAddedTools.map((tool) => (
            <div key={tool.slug} className="rounded-[var(--radius)] bg-surface p-6 transition-all duration-300 hover:bg-surface-hover">
              <p className="text-xs font-medium tracking-[0.3em] text-primary/60 uppercase">{tool.categoryLabel}</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground/60">{tool.summary}</p>
              <p className="mt-4 text-xs text-muted-foreground/40">Added {formatDate(tool.addedAt)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              name={tool.name}
              description={tool.description}
              tags={tool.tags}
              accent={tool.accent}
            />
          ))
        ) : (
          <div className="rounded-[var(--radius)] bg-surface p-8 text-center text-muted-foreground/60 sm:col-span-2 xl:col-span-3">
            No tools matched your filters. Try a broader search or clear the filters.
          </div>
        )}
      </section>
    </div>
  );
}

function parseSort(value?: string): ToolSortOption {
  if (value === "recent" || value === "alphabetical") {
    return value;
  }

  return "popular";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function buildDirectoryHref({
  query,
  category,
  sort,
  featured,
  premium,
}: Readonly<{
  query?: string;
  category?: string;
  sort?: ToolSortOption;
  featured?: boolean;
  premium?: boolean;
}>) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (category) {
    params.set("category", category);
  }

  if (sort && sort !== "popular") {
    params.set("sort", sort);
  }

  if (featured) {
    params.set("featured", "true");
  }

  if (premium) {
    params.set("premium", "true");
  }

  const queryString = params.toString();
  return queryString ? `/tools?${queryString}` : "/tools";
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SortChip({ label, href, active }: Readonly<{ label: string; href: string; active?: boolean }>) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm transition-all duration-200",
        active ? "bg-primary/10 text-primary font-medium" : "bg-white/[0.03] text-muted-foreground/60 hover:bg-white/[0.06] hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function FilterChip({ label, href, active }: Readonly<{ label: string; href: string; active?: boolean }>) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm transition-all duration-200",
        active ? "bg-primary/10 text-primary font-medium" : "bg-white/[0.03] text-muted-foreground/60 hover:bg-white/[0.06] hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
