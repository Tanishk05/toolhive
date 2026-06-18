import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBlogBreadcrumbs, getBlogTags } from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog Tags | ToolHive",
  description: "Browse ToolHive blog tags.",
  path: "/blog/tags",
  keywords: ["blog tags", "ToolHive", "MDX"],
});

export default async function BlogTagsPage() {
  const tags = await getBlogTags();
  const breadcrumbs = buildBlogBreadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Tags", href: "/blog/tags" }]);

  return (
    <div className="flex flex-col gap-8 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(tags.map((tag, index) => ({ name: tag.label, href: `/blog/tags/${tag.slug}`, position: index + 1 })))} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Tags</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse posts by the ideas they reinforce.</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => (
          <Link key={tag.slug} href={`/blog/tags/${tag.slug}`}>
            <Card className="h-full p-6 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{tag.count} posts</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{tag.label}</h2>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
