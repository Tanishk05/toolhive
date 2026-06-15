import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import type { Heading } from "mdast";
import { visit } from "unist-util-visit";
import { createSitemapEntry } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  BlogAuthor,
  BlogCategory,
  BlogHeading,
  BlogPost,
  BlogTag,
} from "./blog-types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(body: string): BlogHeading[] {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(body);
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }

    const text = toString(node).trim();
    if (!text) {
      return;
    }

    headings.push({
      id: slugger.slug(text),
      text,
      depth: node.depth,
    });
  });

  return headings;
}

type PrismaBlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    category: true;
    author: true;
  };
}>;

function mapPrismaPostToBlogPost(post: PrismaBlogPostWithRelations): BlogPost {
  const headings = extractHeadings(post.content);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.createdAt.toISOString(),
    category: post.category?.slug ?? "",
    tags: post.tags,
    author: post.author?.name ?? "Unknown Author",
    featured: post.featured,
    published: post.published,
    coverImage: post.coverImage ?? undefined,
    seoTitle: post.seoTitle ?? undefined,
    seoDescription: post.seoDescription ?? undefined,
    body: post.content,
    content: post.content,
    readingTime: readingTime(post.content).text,
    headings,
    authorProfile: {
      slug: post.author?.clerkId ?? "unknown",
      name: post.author?.name ?? "Unknown Author",
      role: post.author?.role ?? "Contributor",
      bio: post.author?.bio ?? "",
      avatarLabel: post.author?.name ? post.author.name.substring(0, 2).toUpperCase() : "U",
      location: "",
    },
    categoryProfile: {
      slug: post.category?.slug ?? "",
      label: post.category?.label ?? "Uncategorized",
      description: post.category?.description ?? "",
      seo: {
        title: post.category?.seoTitle ?? `${post.category?.label} | ToolHive Blog`,
        description: post.category?.seoDescription ?? "",
        canonical: post.category?.seoCanonical ?? `/blog/categories/${post.category?.slug}`,
      },
    },
    tagsProfile: post.tags.map((tag: string) => ({ slug: slugify(tag), label: tag })),
    relatedSlugs: [],
    publishedAt: post.createdAt,
    updatedAt: post.updatedAt,
    canonical: `/blog/${post.slug}`,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(mapPrismaPostToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await prisma.blogPost.findFirst({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });
  if (!post || !post.published) return undefined;
  return mapPrismaPostToBlogPost(post);
}

export async function getBlogFeaturedPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, featured: true } as Prisma.BlogPostWhereInput,
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return posts.map(mapPrismaPostToBlogPost);
}

export async function getBlogRecentPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return posts.map(mapPrismaPostToBlogPost);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const categories = await prisma.category.findMany({
    where: { blogPosts: { some: {} } },
    include: { _count: { select: { blogPosts: true } } },
  });
  
  type PrismaCategoryWithCount = Prisma.CategoryGetPayload<{
    include: { _count: { select: { blogPosts: true } } }
  }>;

  return categories.map((category: PrismaCategoryWithCount) => ({
    slug: category.slug,
    label: category.label,
    description: category.description,
    seo: {
      title: category.seoTitle ?? `${category.label} | ToolHive Blog`,
      description: category.seoDescription ?? "",
      canonical: category.seoCanonical ?? `/blog/categories/${category.slug}`,
    },
    count: category._count.blogPosts,
  }));
}

export async function getBlogTags(): Promise<BlogTag[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true },
  });
  
  const tagMap = new Map<string, BlogTag>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const existing = tagMap.get(slug);
      tagMap.set(slug, { slug, label: existing?.label ?? tag, count: (existing?.count ?? 0) + 1 });
    }
  }

  return [...tagMap.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const authors = await prisma.user.findMany({
    where: { blogPosts: { some: {} } },
    include: { _count: { select: { blogPosts: true } } },
  });

  type PrismaUserWithCount = Prisma.UserGetPayload<{
    include: { _count: { select: { blogPosts: true } } }
  }>;

  return authors.map((author: PrismaUserWithCount) => ({
    slug: author.clerkId ?? "unknown",
    name: author.name ?? "Unknown Author",
    role: author.role ?? "Contributor",
    bio: author.bio ?? "",
    avatarLabel: author.name ? author.name.substring(0, 2).toUpperCase() : "U",
    location: "",
    website: undefined,
    social: [] as readonly { label: string; href: string }[],
    count: author._count.blogPosts,
  }));
}

export async function getBlogPostsByCategory(slug: string): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, category: { slug } },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(mapPrismaPostToBlogPost);
}

export async function getBlogPostsByTag(slug: string): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });
  // Prisma doesn't support easy array-contains matching for non-exact strings, filter in memory
  const filtered = posts.filter((post: PrismaBlogPostWithRelations) => post.tags.some((tag: string) => slugify(tag) === slug));
  return filtered.map(mapPrismaPostToBlogPost);
}

export async function getBlogPostsByAuthor(slug: string): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, author: { clerkId: slug } },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(mapPrismaPostToBlogPost);
}

function scoreRelatedPost(post: BlogPost, candidate: BlogPost) {
  let score = 0;

  if (post.category === candidate.category) {
    score += 6;
  }

  const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag));
  score += sharedTags.length * 3;

  if (candidate.featured) {
    score += 1;
  }

  const recencyDays = Math.abs(candidate.publishedAt.getTime() - post.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 4 - Math.floor(recencyDays / 30));

  return score;
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  return allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: scoreRelatedPost(post, candidate) }))
    .sort((left, right) => right.score - left.score || right.candidate.publishedAt.getTime() - left.candidate.publishedAt.getTime())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export async function getBlogCategoryBySlug(slug: string) {
  const categories = await getBlogCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getBlogTagBySlug(slug: string) {
  const tags = await getBlogTags();
  return tags.find((tag) => tag.slug === slug);
}

export async function getBlogAuthorBySlug(slug: string) {
  const authors = await getBlogAuthors();
  return authors.find((author) => author.slug === slug);
}

export function buildBlogBreadcrumbs(items: readonly { label: string; href: string }[]) {
  return items;
}

export function buildBlogPostBreadcrumbs(post: BlogPost) {
  return [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: post.canonical },
  ] as const;
}

export function buildBlogCategoryBreadcrumbs(category: BlogCategory) {
  return [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Categories", href: "/blog/categories" },
    { label: category.label, href: category.seo.canonical },
  ] as const;
}

export function buildBlogTagBreadcrumbs(tag: BlogTag) {
  return [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tags", href: "/blog/tags" },
    { label: tag.label, href: `/blog/tags/${tag.slug}` },
  ] as const;
}

export function buildBlogAuthorBreadcrumbs(author: BlogAuthor) {
  return [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Authors", href: "/blog/authors" },
    { label: author.name, href: `/blog/authors/${author.slug}` },
  ] as const;
}

export async function getBlogStaticPaths() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function getBlogCategoryStaticPaths() {
  const categories = await getBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function getBlogTagStaticPaths() {
  const tags = await getBlogTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function getBlogAuthorStaticPaths() {
  const authors = await getBlogAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function getBlogSitemapEntries() {
  const posts = await getBlogPosts();
  const categories = await getBlogCategories();
  const tags = await getBlogTags();
  const authors = await getBlogAuthors();

  return [
    createSitemapEntry("/blog", posts[0]?.updatedAt ?? new Date(), "daily", 0.9),
    createSitemapEntry("/blog/categories", new Date(), "weekly", 0.7),
    createSitemapEntry("/blog/tags", new Date(), "weekly", 0.7),
    createSitemapEntry("/blog/authors", new Date(), "weekly", 0.6),
    ...posts.map((post) => createSitemapEntry(post.canonical, post.updatedAt, "weekly", post.featured ? 0.85 : 0.7)),
    ...categories.map((category) => createSitemapEntry(category.seo.canonical, new Date(), "weekly", 0.65)),
    ...tags.map((tag) => createSitemapEntry(`/blog/tags/${tag.slug}`, new Date(), "weekly", 0.55)),
    ...authors.map((author) => createSitemapEntry(`/blog/authors/${author.slug}`, new Date(), "weekly", 0.55)),
  ];
}

export async function getBlogPostsRelatedToTags(tags: string[], limit = 3) {
  const normalizedTags = tags.map((t) => t.toLowerCase());
  
  const allPosts = await getBlogPosts();
  const scoredPosts = allPosts.map((candidate) => {
    const candidateTags = candidate.tags.map((t) => t.toLowerCase());
    const sharedTags = candidateTags.filter((tag) => normalizedTags.some(t => t.includes(tag) || tag.includes(t)));
    let score = sharedTags.length * 3;
    if (candidate.featured) {
      score += 1;
    }
    return { candidate, score };
  });

  return scoredPosts
    .sort((left, right) => right.score - left.score || right.candidate.publishedAt.getTime() - left.candidate.publishedAt.getTime())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
