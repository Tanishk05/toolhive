import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostCard } from "@/components/blog/blog-ui";
import {
  buildBlogAuthorBreadcrumbs,
  getBlogAuthorBySlug,
  getBlogPostsByAuthor,
  getBlogAuthorStaticPaths,
} from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata, createPersonStructuredData } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getBlogAuthorStaticPaths();
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);

  if (!author) {
    return {};
  }

  return createMetadata({
    title: `${author.name} | ToolHive Blog`,
    description: author.bio,
    path: `/blog/authors/${author.slug}`,
    keywords: [author.name, author.role, "ToolHive", "Blog"],
  });
}

export default async function BlogAuthorPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const author = await getBlogAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const posts = await getBlogPostsByAuthor(author.slug);
  const breadcrumbs = buildBlogAuthorBreadcrumbs(author);

  return (
    <div className="flex flex-col gap-8 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createPersonStructuredData({ name: author.name, url: `/blog/authors/${author.slug}`, description: author.bio })} />
      <JsonLd data={createItemListStructuredData(posts.map((post, index) => ({ name: post.title, href: post.canonical, position: index + 1 })))} />

      <Breadcrumbs items={breadcrumbs} />

      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <Card className="p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-400/10 text-2xl font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
            {author.avatarLabel}
          </div>
          <p className="mt-5 text-3xl font-semibold text-white">{author.name}</p>
          <p className="mt-2 text-sm text-slate-400">{author.role}</p>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-emerald-300">{author.location}</p>
          <p className="mt-5 text-sm leading-7 text-slate-300">{author.bio}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {author.website ? <Link href={author.website} className="text-emerald-300 transition hover:text-emerald-200">Website</Link> : null}
            {author.social?.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Published Posts</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Articles by {author.name}</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
