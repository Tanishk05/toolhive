import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostCard } from "@/components/blog/blog-ui";
import {
  buildBlogCategoryBreadcrumbs,
  getBlogCategoryBySlug,
  getBlogPostsByCategory,
  getBlogCategoryStaticPaths,
} from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getBlogCategoryStaticPaths();
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return createMetadata({
    title: category.seo.title,
    description: category.seo.description,
    path: category.seo.canonical,
    keywords: [category.label, "Blog", "ToolHive"],
  });
}

export default async function BlogCategoryPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getBlogPostsByCategory(category.slug);
  const breadcrumbs = buildBlogCategoryBreadcrumbs(category);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(posts.map((post, index) => ({ name: post.title, href: post.canonical, position: index + 1 })))} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Category</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{category.label}</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-400">{category.description}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </section>

      <Card className="p-6 text-sm text-slate-300">
        <p>
          Browse all <Link href="/blog/categories" className="text-emerald-300 transition hover:text-emerald-200">blog categories</Link> to jump to another topic.
        </p>
      </Card>
    </main>
  );
}
