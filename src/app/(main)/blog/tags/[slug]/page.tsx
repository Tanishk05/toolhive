import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostCard } from "@/components/blog/blog-ui";
import {
  buildBlogTagBreadcrumbs,
  getBlogPostsByTag,
  getBlogTagBySlug,
  getBlogTagStaticPaths,
} from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getBlogTagStaticPaths();
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getBlogTagBySlug(slug);

  if (!tag) {
    return {};
  }

  return createMetadata({
    title: `${tag.label} Posts | ToolHive Blog`,
    description: `Browse ToolHive blog posts tagged with ${tag.label}.`,
    path: `/blog/tags/${tag.slug}`,
    keywords: [tag.label, "ToolHive", "Blog"],
  });
}

export default async function BlogTagPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const tag = await getBlogTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getBlogPostsByTag(tag.slug);
  const breadcrumbs = buildBlogTagBreadcrumbs(tag);

  return (
    <div className="flex flex-col gap-8 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(posts.map((post, index) => ({ name: post.title, href: post.canonical, position: index + 1 })))} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Tag</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{tag.label}</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-400">Browse all posts tagged with {tag.label}.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </section>

      <Card className="p-6 text-sm text-slate-300">
        <p>
          Try the <Link href="/blog/tags" className="text-emerald-300 transition hover:text-emerald-200">tags index</Link> to jump elsewhere.
        </p>
      </Card>
    </div>
  );
}
