import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FolderTree, Tag, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogAuthorCard, BlogPostCard } from "@/components/blog/blog-ui";
import {
  buildBlogBreadcrumbs,
  getBlogAuthors,
  getBlogCategories,
  getBlogFeaturedPosts,
  getBlogPosts,
  getBlogTags,
} from "@/features/blog/blog-registry";
import { createBreadcrumbStructuredData, createItemListStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog | ToolHive",
  description: "Static MDX-powered articles about architecture, SEO, strategy, and content systems.",
  path: "/blog",
  keywords: ["blog", "MDX", "SEO", "architecture", "ToolHive"],
});

export default function BlogPage() {
  const featuredPosts = getBlogFeaturedPosts(3);
  const latestPosts = getBlogPosts();
  const categories = getBlogCategories();
  const tags = getBlogTags();
  const authors = getBlogAuthors();
  const breadcrumbs = buildBlogBreadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createItemListStructuredData(featuredPosts.map((post, index) => ({ name: post.title, href: post.canonical, position: index + 1 })))} />

      <Breadcrumbs items={breadcrumbs} />

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">ToolHive Blog</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">An MDX blog system built for static generation and long-term scale.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-400">
            Posts, authors, tags, and category archives all come from the same filesystem-backed registry, so content stays easy to extend without making the app harder to reason about.
          </p>
        </div>

        <Card className="grid grid-cols-2 gap-4 p-6 text-sm text-slate-300">
          <Metric icon={BookOpen} label="Posts" value={String(latestPosts.length)} />
          <Metric icon={FolderTree} label="Categories" value={String(categories.length)} />
          <Metric icon={Tag} label="Tags" value={String(tags.length)} />
          <Metric icon={Users} label="Authors" value={String(authors.length)} />
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Featured</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Posts worth surfacing first</h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm text-emerald-300 transition hover:text-emerald-200" href="/blog/categories">
            Browse categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Latest Posts</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Everything published in the registry</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {latestPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Authors</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Editorial profiles</h2>
              </div>
              <Link className="text-sm text-emerald-300 transition hover:text-emerald-200" href="/blog/authors">
                View all
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {authors.slice(0, 2).map((author) => (
                <BlogAuthorCard key={author.slug} author={author} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link key={tag.slug} href={`/blog/tags/${tag.slug}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 transition hover:text-white">
                  {tag.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Categories</p>
            <div className="mt-4 space-y-3">
              {categories.map((category) => (
                <Link key={category.slug} href={`/blog/categories/${category.slug}`} className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-emerald-400/30 hover:bg-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{category.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{category.description}</p>
                    </div>
                    <span className="text-sm text-emerald-300">{category.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: Readonly<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <Icon className="h-4 w-4 text-emerald-300" />
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
    </div>
  );
}
