export type BlogAuthorSlug = "ava-patel" | "marcus-chen" | "sophia-rivera";

export type BlogCategorySlug = "engineering" | "seo" | "strategy" | "content";

export type BlogAuthor = {
  slug: BlogAuthorSlug;
  name: string;
  role: string;
  bio: string;
  avatarLabel: string;
  location: string;
  website?: string;
  social?: readonly { label: string; href: string }[];
};

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
};

export type BlogHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type BlogPostFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  category: BlogCategorySlug;
  tags: string[];
  author: BlogAuthorSlug;
  featured?: boolean;
  published?: boolean;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPost = BlogPostFrontmatter & {
  slug: string;
  body: string;
  content: string;
  readingTime: string;
  headings: BlogHeading[];
  authorProfile: BlogAuthor;
  categoryProfile: BlogCategory;
  tagsProfile: readonly { slug: string; label: string }[];
  relatedSlugs: readonly string[];
  publishedAt: Date;
  updatedAt: Date;
  canonical: string;
};

export type BlogTag = {
  slug: string;
  label: string;
  count: number;
};
