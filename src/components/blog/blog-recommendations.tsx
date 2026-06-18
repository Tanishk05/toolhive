import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-ui";
import { getBlogPostsRelatedToTags } from "@/features/blog/blog-registry";
import { JsonLd } from "@/components/seo/json-ld";
import { createItemListStructuredData } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export async function BlogRecommendations({ tags }: Readonly<{ tags: readonly string[] }>) {
  const relatedPosts = await getBlogPostsRelatedToTags([...tags], 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  const itemList = createItemListStructuredData(
    relatedPosts.map((post, index) => ({ name: post.title, href: post.canonical, position: index + 1 }))
  );

  return (
    <section className="mt-20 space-y-6 pt-16">
      <JsonLd data={itemList} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Learn & Build</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Related Guides & Tutorials</h2>
        </div>
        <Button variant="ghost" className="hidden text-primary hover:text-primary hover:bg-primary/10 sm:flex" asChild>
          <Link href="/blog">
            View all guides <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
      
      <div className="mt-4 sm:hidden">
        <Button variant="outline" className="w-full text-muted-foreground" asChild>
          <Link href="/blog">
            View all guides <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
