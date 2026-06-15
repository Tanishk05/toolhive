import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildCategoryBreadcrumbs, getCategoryBySlug, getToolsByCategory, getToolCategories, getIconName } from "@/features/tools/tool-registry";
import { ToolIcon } from "@/features/tools/components/tool-icon";
import { createBreadcrumbStructuredData, createCollectionPageStructuredData, createMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getToolCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return createMetadata({
    title: category.seo.title ?? category.label,
    description: category.seo.description ?? category.description,
    path: category.seo.canonical ?? `/categories/${category.slug}`,
    keywords: [category.label, "ToolHive", "category"],
  });
}

export default async function CategoryPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = await getToolsByCategory(category.slug);
  const allCategories = await getToolCategories();
  const relatedCategories = allCategories.filter((c) => c.slug !== category.slug);
  const breadcrumbs = buildCategoryBreadcrumbs(category);
  const collectionPage = createCollectionPageStructuredData({
    name: `${category.label} Tools`,
    description: category.description,
    url: `/categories/${category.slug}`,
    items: tools.map((tool, index) => ({ name: tool.name, href: `/tools/${tool.slug}`, position: index + 1 })),
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={collectionPage} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Category</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{category.label}</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-400">{category.description}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
            <Card key={tool.slug} className="p-6">
              <div className={`inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-white/10`}>
                <ToolIcon name={getIconName(tool.icon)} className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{tool.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{tool.summary}</p>
              <Button asChild variant="outline" size="sm" className="mt-5">
                <Link href={`/tools/${tool.slug}`}>
                  View tool <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
      </section>

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Browse Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {relatedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-emerald-500/30 hover:text-foreground"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
