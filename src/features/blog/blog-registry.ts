import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import type { Heading } from "mdast";
import { visit } from "unist-util-visit";
import { z } from "zod";
import { createSitemapEntry } from "@/lib/seo";
import type {
  BlogAuthor,
  BlogAuthorSlug,
  BlogCategory,
  BlogCategorySlug,
  BlogHeading,
  BlogPost,
  BlogPostFrontmatter,
  BlogTag,
} from "./blog-types";

const blogRoot = path.join(process.cwd(), "src/content/blog/posts");

const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().min(1),
  category: z.enum(["engineering", "seo", "strategy", "content"]),
  tags: z.array(z.string().min(1)).default([]),
  author: z.enum(["ava-patel", "marcus-chen", "sophia-rivera"]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const blogAuthors: readonly BlogAuthor[] = [
  {
    slug: "ava-patel",
    name: "Ava Patel",
    role: "Editorial Product Lead",
    bio: "Builds content systems that help utility products earn trust before the first click.",
    avatarLabel: "AP",
    location: "San Francisco, CA",
    website: "https://example.com/ava-patel",
    social: [{ label: "X", href: "https://x.com/ava-patel" }],
  },
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Principal Engineer",
    bio: "Focuses on static-first architectures, search performance, and maintainable content pipelines.",
    avatarLabel: "MC",
    location: "Toronto, CA",
    website: "https://example.com/marcus-chen",
    social: [{ label: "GitHub", href: "https://github.com/marcus-chen" }],
  },
  {
    slug: "sophia-rivera",
    name: "Sophia Rivera",
    role: "Content Strategist",
    bio: "Turns product capabilities into editorial systems that can scale without losing clarity.",
    avatarLabel: "SR",
    location: "Austin, TX",
    social: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/sophia-rivera" }],
  },
] as const;

export const blogCategories: readonly BlogCategory[] = [
  {
    slug: "engineering",
    label: "Engineering",
    description: "Static generation, architecture boundaries, and implementation patterns.",
    seo: {
      title: "Engineering Articles | ToolHive Blog",
      description: "Engineering essays about static generation, architecture, and scalable systems.",
      canonical: "/blog/categories/engineering",
    },
  },
  {
    slug: "seo",
    label: "SEO",
    description: "Metadata strategy, structured data, and search visibility tactics.",
    seo: {
      title: "SEO Articles | ToolHive Blog",
      description: "SEO playbooks for technical product and content teams.",
      canonical: "/blog/categories/seo",
    },
  },
  {
    slug: "strategy",
    label: "Strategy",
    description: "Product positioning, content systems, and GTM structure.",
    seo: {
      title: "Strategy Articles | ToolHive Blog",
      description: "Strategy posts on product growth, positioning, and scalable content systems.",
      canonical: "/blog/categories/strategy",
    },
  },
  {
    slug: "content",
    label: "Content",
    description: "Editorial structure, reusable templates, and content operations.",
    seo: {
      title: "Content Articles | ToolHive Blog",
      description: "Content operations and editorial structure for product-led teams.",
      canonical: "/blog/categories/content",
    },
  },
] as const;

function loadPostSlugs() {
  return fs
    .readdirSync(blogRoot)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

function getAuthorProfile(slug: BlogAuthorSlug) {
  const author = blogAuthors.find((item) => item.slug === slug);
  if (!author) {
    throw new Error(`Unknown blog author: ${slug}`);
  }

  return author;
}

function getCategoryProfile(slug: BlogCategorySlug) {
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Unknown blog category: ${slug}`);
  }

  return category;
}

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

function normalizeFrontmatter(frontmatter: unknown): BlogPostFrontmatter {
  return blogFrontmatterSchema.parse(frontmatter);
}

function readPost(slug: string): BlogPost {
  const filePath = path.join(blogRoot, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = normalizeFrontmatter(data);
  const publishedAt = new Date(frontmatter.date);
  const updatedAt = publishedAt;
  const categoryProfile = getCategoryProfile(frontmatter.category);
  const authorProfile = getAuthorProfile(frontmatter.author);
  const tagsProfile = frontmatter.tags.map((tag) => ({ slug: slugify(tag), label: tag }));
  const headings = extractHeadings(content);

  return {
    ...frontmatter,
    slug,
    body: content,
    content,
    readingTime: readingTime(content).text,
    headings,
    authorProfile,
    categoryProfile,
    tagsProfile,
    publishedAt,
    updatedAt,
    canonical: `/blog/${slug}`,
    relatedSlugs: [],
  };
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

export const getBlogPosts = cache(() => {
  return loadPostSlugs()
    .map((slug) => readPost(slug))
    .filter((post) => post.published)
    .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
});

export const getBlogPostBySlug = cache((slug: string) => getBlogPosts().find((post) => post.slug === slug));

export const getBlogFeaturedPosts = cache((limit = 3) => getBlogPosts().filter((post) => post.featured).slice(0, limit));

export const getBlogRecentPosts = cache((limit = 6) => getBlogPosts().slice(0, limit));

export const getBlogCategories = cache(() =>
  blogCategories.map((category) => ({
    ...category,
    count: getBlogPosts().filter((post) => post.category === category.slug).length,
  }))
);

export const getBlogTags = cache(() => {
  const tagMap = new Map<string, BlogTag>();

  for (const post of getBlogPosts()) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const existing = tagMap.get(slug);
      tagMap.set(slug, { slug, label: existing?.label ?? tag, count: (existing?.count ?? 0) + 1 });
    }
  }

  return [...tagMap.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
});

export const getBlogAuthors = cache(() =>
  blogAuthors.map((author) => ({
    ...author,
    count: getBlogPosts().filter((post) => post.author === author.slug).length,
  }))
);

export const getBlogPostsByCategory = cache((slug: BlogCategorySlug) => getBlogPosts().filter((post) => post.category === slug));

export const getBlogPostsByTag = cache((slug: string) => getBlogPosts().filter((post) => post.tags.some((tag) => slugify(tag) === slug)));

export const getBlogPostsByAuthor = cache((slug: BlogAuthorSlug) => getBlogPosts().filter((post) => post.author === slug));

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  return getBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({ candidate, score: scoreRelatedPost(post, candidate) }))
    .sort((left, right) => right.score - left.score || right.candidate.publishedAt.getTime() - left.candidate.publishedAt.getTime())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getBlogCategoryBySlug(slug: string) {
  return blogCategories.find((category) => category.slug === slug);
}

export function getBlogTagBySlug(slug: string) {
  return getBlogTags().find((tag) => tag.slug === slug);
}

export function getBlogAuthorBySlug(slug: string) {
  return blogAuthors.find((author) => author.slug === slug);
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

export function getBlogStaticPaths() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export function getBlogCategoryStaticPaths() {
  return blogCategories.map((category) => ({ slug: category.slug }));
}

export function getBlogTagStaticPaths() {
  return getBlogTags().map((tag) => ({ slug: tag.slug }));
}

export function getBlogAuthorStaticPaths() {
  return blogAuthors.map((author) => ({ slug: author.slug }));
}

export function getBlogSitemapEntries() {
  const posts = getBlogPosts();
  const categories = getBlogCategories();
  const tags = getBlogTags();
  const authors = getBlogAuthors();

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
