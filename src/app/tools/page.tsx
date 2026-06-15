import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/marketing/tool-card";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
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
  searchParams?: Record<string, string | string[] | undefined>;
}>): Promise<Metadata> {
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  const category = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const sort = parseSort(typeof searchParams?.sort === "string" ? searchParams.sort : undefined);

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
  searchParams?: Record<string, string | string[] | undefined>;
}>) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  const category = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const featuredOnly = searchParams?.featured === "true";
  const premiumOnly = searchParams?.premium === "true";
  const sort = parseSort(typeof searchParams?.sort === "string" ? searchParams.sort : undefined);

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={itemList} />
      <header className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Tool Directory</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Search, sort, and discover tools at scale.</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            ToolHive renders the directory from a registry, so adding a new tool is a configuration change rather than a
            routing change.
          </p>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <SearchBar
            action="/tools"
            placeholder="Search tools by name, tag, or category"
            defaultValue={query}
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
        </Card>

        <Card className="p-6">
          <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Sort</p>
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
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Featured Tools</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">High-signal tools worth surfacing first</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} slug={tool.slug} name={tool.name} description={tool.description} tags={tool.tags} accent={tool.accent} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Recently Added Tools</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">The newest registry entries</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recentlyAddedTools.map((tool) => (
            <Card key={tool.slug} className="p-6">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{tool.categoryLabel}</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">{tool.name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{tool.summary}</p>
              <p className="mt-4 text-xs text-slate-500">Added {formatDate(tool.addedAt)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          <Card className="p-8 text-center text-muted-foreground">
            No tools matched your filters. Try a broader search or clear the filters.
          </Card>
        )}
      </section>
    </main>
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
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function SortChip({ label, href, active }: Readonly<{ label: string; href: string; active?: boolean }>) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-4 py-2 text-sm transition",
        active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-border bg-card text-muted-foreground hover:text-foreground",
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
        "rounded-full border px-4 py-2 text-sm transition",
        active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-border bg-card text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
