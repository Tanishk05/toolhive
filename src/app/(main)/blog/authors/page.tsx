import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBlogBreadcrumbs, getBlogAuthors } from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog Authors | ToolHive",
  description: "Meet the authors behind the ToolHive blog.",
  path: "/blog/authors",
  keywords: ["blog authors", "ToolHive", "editorial"],
});

export default async function BlogAuthorsPage() {
  const authors = await getBlogAuthors();
  const breadcrumbs = buildBlogBreadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Authors", href: "/blog/authors" }]);

  return (
    <div className="flex flex-col gap-8 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(authors.map((author, index) => ({ name: author.name, href: `/blog/authors/${author.slug}`, position: index + 1 })))} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Authors</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">A small editorial team with distinct expertise.</h1>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        {authors.map((author) => (
          <Card key={author.slug} className="h-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-lg font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
                {author.avatarLabel}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{author.name}</p>
                <p className="text-sm text-slate-400">{author.role}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-emerald-300">{author.location}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{author.bio}</p>
            <Link href={`/blog/authors/${author.slug}`} className="mt-5 inline-flex text-sm font-medium text-emerald-300 transition hover:text-emerald-200">
              View profile
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
