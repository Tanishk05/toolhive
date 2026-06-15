import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, User } from "lucide-react";
import type { BlogAuthor, BlogHeading, BlogPost } from "@/features/blog/blog-types";
import { Card } from "@/components/ui/card";

export function FeaturedBlogPostCard({ post }: Readonly<{ post: Pick<BlogPost, "slug" | "title" | "excerpt" | "readingTime" | "categoryProfile" | "tagsProfile" | "publishedAt" | "coverImage" | "canonical"> }>) {
  return (
    <Card className="group relative overflow-hidden rounded-[2rem] p-0 transition-transform duration-300 hover:-translate-y-1 border-white/10 bg-slate-950/50">
      <div className="grid lg:grid-cols-2 min-h-[400px]">
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-emerald-300">
            <span>{post.categoryProfile.label}</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
          <h3 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl transition-colors group-hover:text-emerald-300">{post.title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-300 line-clamp-3">{post.excerpt}</p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-400">{post.publishedAt.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</span>
            <Link className="inline-flex items-center gap-2 font-medium text-emerald-300 transition group-hover:text-emerald-200" href={post.canonical}>
              Read guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative hidden lg:block bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(15,23,42,0.88),rgba(56,189,248,0.14))]">
          {post.coverImage ? (
            <>
              <Image src={post.coverImage} alt={post.title} fill className="absolute inset-0 object-cover opacity-80 mix-blend-overlay" unoptimized />
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-900/50" />
          )}
        </div>
      </div>
    </Card>
  );
}

export function BlogPostCard({ post }: Readonly<{ post: Pick<BlogPost, "slug" | "title" | "excerpt" | "readingTime" | "categoryProfile" | "tagsProfile" | "publishedAt" | "coverImage" | "canonical"> }>) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative min-h-48 overflow-hidden bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(56,189,248,0.1))]">
        {post.coverImage && (
           <>
             <Image src={post.coverImage} alt={post.title} fill className="absolute inset-0 object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" unoptimized />
           </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-emerald-300">
          <span>{post.categoryProfile.label}</span>
          <span className="inline-flex items-center gap-1 normal-case tracking-normal text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-emerald-300">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-2">{post.excerpt}</p>
        
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-white/5 text-sm text-slate-400">
          <span>{post.publishedAt.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
          <Link className="inline-flex items-center gap-2 font-medium text-white transition group-hover:text-emerald-300" href={post.canonical}>
            Read article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function BlogAuthorCard({ author }: Readonly<{ author: BlogAuthor }>) {
  return (
    <Card className="h-full p-6">
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
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {author.website ? (
          <Link className="inline-flex items-center gap-2 text-emerald-300 transition hover:text-emerald-200" href={author.website}>
            <User className="h-4 w-4" />
            Website
          </Link>
        ) : null}
        {author.social?.map((link) => (
          <Link key={link.href} className="text-slate-400 transition hover:text-white" href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function BlogToc({ items }: Readonly<{ items: readonly BlogHeading[] }>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">Table of Contents</p>
      <nav className="mt-4 space-y-3 text-sm">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={["block transition hover:text-white", item.depth === 3 ? "pl-4 text-slate-400" : "text-slate-300"].join(" ")}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
