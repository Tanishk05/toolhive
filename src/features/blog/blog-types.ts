export type BlogAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatarLabel: string;
  location: string;
  website?: string;
  social?: readonly { label: string; href: string }[];
  count?: number;
};

export type BlogCategory = {
  slug: string;
  label: string;
  description: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
  count?: number;
};

export type BlogHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  featured: boolean;
  published: boolean;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
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
