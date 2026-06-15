import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { CategoryCard } from "@/components/marketing/category-card";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search";
import { JsonLd } from "@/components/seo/json-ld";
import { searchCategories, getToolCategories } from "@/features/tools/tool-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Categories | ToolHive",
  description: "Search categories for ToolHive tools.",
  path: "/categories",
  keywords: ["categories", "tools", "ToolHive"],
});

export default async function CategoriesPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const categories = await searchCategories(query);
  const toolCategoriesList = await getToolCategories();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData([{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }])} />
      <JsonLd
        data={createItemListStructuredData(
          categories.map((category, index) => ({ name: category.label, href: `/categories/${category.slug}`, position: index + 1 }))
        )}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }]} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Categories</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Find the Right Tool by Category</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-400">
          Browse our curated categories to quickly discover the free online tools you need.
        </p>
      </header>

      <Card className="p-6">
        <SearchBar action="/categories" placeholder="Search categories" />
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <CategoryCard key={category.slug} label={category.label} description={category.description} index={index + 1} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {toolCategoriesList.map((category) => (
          <Card key={category.slug} className="p-6">
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Registry</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{category.label}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{category.description}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
