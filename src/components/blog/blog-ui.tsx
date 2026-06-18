import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, User } from "lucide-react";
import type { BlogAuthor, BlogHeading, BlogPost } from "@/features/blog/blog-types";

export function FeaturedBlogPostCard({ post }: Readonly<{ post: Pick<BlogPost, "slug" | "title" | "excerpt" | "readingTime" | "categoryProfile" | "tagsProfile" | "publishedAt" | "coverImage" | "canonical"> }>) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
      <div className="grid lg:grid-cols-2 min-h-[400px]">
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-primary/70">
            <span>{post.categoryProfile.label}</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted-foreground/50">
              <Clock3 className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <h3 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl transition-colors group-hover:text-primary">{post.title}</h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground line-clamp-3">{post.excerpt}</p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground/50">{post.publishedAt.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</span>
            <Link className="inline-flex items-center gap-2 font-medium text-primary/80 transition group-hover:text-primary" href={post.canonical}>
              Read guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative hidden lg:block bg-[linear-gradient(135deg,rgba(143,175,147,0.12),rgba(17,21,29,0.88),rgba(115,134,168,0.10))]">
          {post.coverImage ? (
            <>
              <Image src={post.coverImage} alt={post.title} fill className="absolute inset-0 object-cover opacity-80 mix-blend-overlay" unoptimized />
            </>
          ) : (
            <div className="absolute inset-0 bg-surface-hover/50" />
          )}
        </div>
      </div>
    </div>
  );
}

export function BlogPostCard({ post }: Readonly<{ post: Pick<BlogPost, "slug" | "title" | "excerpt" | "readingTime" | "categoryProfile" | "tagsProfile" | "publishedAt" | "coverImage" | "canonical"> }>) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[var(--radius)] bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      <div className="relative min-h-48 overflow-hidden bg-[linear-gradient(135deg,rgba(143,175,147,0.08),rgba(17,21,29,0.8),rgba(115,134,168,0.08))]">
        {post.coverImage && (
           <>
             <Image src={post.coverImage} alt={post.title} fill className="absolute inset-0 object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" unoptimized />
           </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-primary/70">
          <span>{post.categoryProfile.label}</span>
          <span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted-foreground/50">
            <Clock3 className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70 line-clamp-2">{post.excerpt}</p>
        
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 text-sm text-muted-foreground/50">
          <span>{post.publishedAt.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
          <Link className="inline-flex items-center gap-2 font-medium text-foreground/80 transition group-hover:text-primary" href={post.canonical}>
            Read article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BlogAuthorCard({ author }: Readonly<{ author: BlogAuthor }>) {
  return (
    <div className="h-full rounded-[var(--radius)] bg-surface p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.08] text-lg font-semibold text-primary">
          {author.avatarLabel}
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{author.name}</p>
          <p className="text-sm text-muted-foreground/60">{author.role}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-primary/60">{author.location}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground/70">{author.bio}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {author.website ? (
          <Link className="inline-flex items-center gap-2 text-primary/70 transition hover:text-primary" href={author.website}>
            <User className="h-4 w-4" />
            Website
          </Link>
        ) : null}
        {author.social?.map((link) => (
          <Link key={link.href} className="text-muted-foreground/60 transition hover:text-foreground" href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogToc({ items }: Readonly<{ items: readonly BlogHeading[] }>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[var(--radius)] bg-surface p-6">
      <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Table of Contents</p>
      <nav className="mt-4 space-y-3 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={["block transition hover:text-foreground", item.depth === 3 ? "pl-4 text-muted-foreground/50" : "text-muted-foreground/70"].join(" ")}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
