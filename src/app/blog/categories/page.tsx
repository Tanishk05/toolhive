import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBlogBreadcrumbs, getBlogCategories } from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog Categories | ToolHive",
  description: "Browse ToolHive blog categories.",
  path: "/blog/categories",
  keywords: ["blog categories", "ToolHive", "MDX"],
});

export default async function BlogCategoriesPage() {
  const categories = await getBlogCategories();
  const breadcrumbs = buildBlogBreadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Categories", href: "/blog/categories" }]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(categories.map((category, index) => ({ name: category.label, href: category.seo.canonical, position: index + 1 })))} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Categories</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Organize the blog around topics people can actually browse.</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.slug} href={category.seo.canonical}>
            <Card className="h-full p-6 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{category.count} posts</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{category.label}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{category.description}</p>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
