import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { BlogPostCard, FeaturedBlogPostCard } from "@/components/blog/blog-ui";
import { SearchBar } from "@/components/ui/search";
import { ToolCard } from "@/components/marketing/tool-card";
import { NewsletterForm } from "@/components/contact/newsletter-form";
import { getFeaturedTools } from "@/features/tools/tool-registry";
import {
  buildBlogBreadcrumbs,
  getBlogCategories,
  getBlogFeaturedPosts,
  getBlogRecentPosts,
  getBlogPosts,
} from "@/features/blog/blog-registry";
import type { BlogPost } from "@/features/blog/blog-types";
import { createBreadcrumbStructuredData, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog & Resources | ToolHive",
  description: "Learn how to use online tools more effectively with practical guides, tutorials, productivity tips, and technical resources.",
  path: "/blog",
  keywords: ["tutorials", "guides", "productivity", "developer tools", "ToolHive blog", "SEO tools"],
});

function createBlogStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ToolHive Blog & Resources",
    description: "Guides, tutorials, and productivity resources for using online utilities.",
    url: "https://toolhive.in/blog",
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const featuredPosts = await getBlogFeaturedPosts(1);
  const mainFeaturedPost = featuredPosts[0];
  const latestPosts = (await getBlogRecentPosts(6)).filter((p) => p.slug !== mainFeaturedPost?.slug);
  const allPosts = await getBlogPosts();
  const popularPosts = allPosts.slice(0, 4);
  const searchSuggestions = allPosts.map(p => ({ label: p.title, href: p.canonical }));
  const categories = await getBlogCategories();
  const breadcrumbs = buildBlogBreadcrumbs([{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]);
  const tools = (await getFeaturedTools()).slice(0, 4);

  const popularTopics = ["QR Codes", "SEO", "Image Optimization", "Productivity", "Finance", "Developer Tools"];

  let filteredPosts: BlogPost[] = [];
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredPosts = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.excerpt.toLowerCase().includes(lowerQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
        p.categoryProfile.label.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <div className="flex flex-col gap-16 py-6">
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={createBlogStructuredData()} />

      {/* 1. Blog Hero */}
      <section className="mt-4 flex flex-col items-center space-y-8 text-center">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-400">ToolHive Resources</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Guides, Tutorials, and Resources</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Learn how to use online tools more effectively with practical guides, tutorials, productivity tips, and technical resources.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <SearchBar action="/blog" placeholder="Search for tutorials, guides, and tips..." defaultValue={query} suggestions={searchSuggestions} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm">
          <span className="text-slate-500">Popular Topics:</span>
          {popularTopics.map((topic) => (
            <Link
              key={topic}
              href={`/blog/categories`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground transition hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {query ? (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Search Results for &quot;{query}&quot;
            </h2>
          </div>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius)] bg-surface p-8 text-center text-muted-foreground/60">
              No articles matched your search. Try a broader term.
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 2. Featured Article */}
          {mainFeaturedPost && (
            <section className="scroll-mt-28" id="featured">
              <FeaturedBlogPostCard post={mainFeaturedPost} />
            </section>
          )}

          {/* 3. Browse By Category */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Browse By Category</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/categories/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900"
                >
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition group-hover:bg-emerald-500/10" />
                  <FileText className="mb-4 h-6 w-6 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-emerald-300">{category.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.count} Articles</p>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. Latest Articles */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Latest Articles</h2>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                href="/blog/categories"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          {/* 5. Popular Articles */}
          <section className="space-y-8 rounded-[2.5rem] border border-white/5 bg-slate-900/50 p-8 sm:p-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Most Viewed Tutorials</h2>
              <p className="text-sm text-muted-foreground">Discover what other ToolHive users are reading right now.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularPosts.map((post) => (
                <Link key={post.slug} href={post.canonical} className="group block space-y-3">
                  <div className="text-xs font-medium text-emerald-400">{post.categoryProfile.label}</div>
                  <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-emerald-300">{post.title}</h3>
                  <div className="text-xs text-slate-500">{post.readingTime}</div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 6. Tool Related Content */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Learn More About Our Tools</h2>
            <p className="text-sm text-muted-foreground">Put your knowledge into practice with our free utilities.</p>
          </div>
          <Link
            className="hidden items-center gap-2 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 sm:inline-flex"
            href="/tools"
          >
            Explore all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} slug={tool.slug} name={tool.name} description={tool.description} tags={tool.tags} accent={tool.accent} />
          ))}
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-card p-8 py-16 text-center shadow-sm dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(59,130,246,0.1))] sm:p-16">
        <div className="relative mx-auto max-w-2xl space-y-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <FileText className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get New Tool Guides</h2>
            <p className="text-lg text-muted-foreground">
              Subscribe to our newsletter for the latest tutorials, productivity tips, and feature updates. No spam, just value.
            </p>
          </div>
          <div className="mx-auto max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
