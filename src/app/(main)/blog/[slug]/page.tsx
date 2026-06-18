import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, Tag, User } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostCard, BlogToc } from "@/components/blog/blog-ui";
import { renderBlogMdx } from "@/features/blog/blog-mdx";
import {
  buildBlogPostBreadcrumbs,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getBlogStaticPaths,
} from "@/features/blog/blog-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { AdUnit } from "@/components/ads/ad-unit";
import { createBlogPostingStructuredData, createBreadcrumbStructuredData, createMetadata, createPersonStructuredData } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getBlogStaticPaths();
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: post.canonical,
    keywords: [...post.tags, post.categoryProfile.label, post.authorProfile.name, "ToolHive Blog"],
    imagePath: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post, 3);
  const breadcrumbs = buildBlogPostBreadcrumbs(post);
  const mdxContent = await renderBlogMdx({ source: post.body });

  return (
    <div className="flex flex-col gap-8 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd
        data={createBlogPostingStructuredData({
          title: post.seoTitle ?? post.title,
          description: post.seoDescription ?? post.excerpt,
          canonical: post.canonical,
          image: post.coverImage,
          publishedAt: post.publishedAt,
          modifiedAt: post.updatedAt,
          authorName: post.authorProfile.name,
          section: post.categoryProfile.label,
          keywords: post.tags,
        })}
      />
      <JsonLd data={createPersonStructuredData({ name: post.authorProfile.name, url: `/blog/authors/${post.authorProfile.slug}`, description: post.authorProfile.bio })} />

      <Breadcrumbs items={breadcrumbs} />

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.65fr] lg:items-start">
        <article className="space-y-8">
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.26em] text-emerald-300">
              <Link href={`/blog/categories/${post.categoryProfile.slug}`} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 transition hover:text-emerald-200">
                {post.categoryProfile.label}
              </Link>
              {post.featured ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">Featured</span> : null}
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-400">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                <Link href={`/blog/authors/${post.authorProfile.slug}`} className="transition hover:text-white">
                  {post.authorProfile.name}
                </Link>
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {post.publishedAt.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tagsProfile.map((tag) => (
                <Link key={tag.slug} href={`/blog/tags/${tag.slug}`} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 transition hover:text-white">
                  <Tag className="h-3.5 w-3.5" />
                  {tag.label}
                </Link>
              ))}
            </div>
          </header>

          <Card className="overflow-hidden p-0">
            <div className="h-64 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(15,23,42,0.88),rgba(56,189,248,0.14))]" />
          </Card>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/50 p-6 md:p-8">
            {mdxContent}
          </div>

          <ToolRecommendations relatedTags={post.tags} />

          <section className="space-y-4">
            <div>
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Related Posts</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Continue reading</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <BlogToc items={post.headings} />
          <Card className="p-6">
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Author</p>
            <Link href={`/blog/authors/${post.authorProfile.slug}`} className="mt-4 block text-2xl font-semibold text-white transition hover:text-emerald-200">
              {post.authorProfile.name}
            </Link>
            <p className="mt-2 text-sm text-slate-400">{post.authorProfile.role}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{post.authorProfile.bio}</p>
            <Link href={`/blog/authors/${post.authorProfile.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200">
              View profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
          <AdUnit format="vertical" slotId="blog-sidebar" />
        </aside>
      </section>
    </div>
  );
}
