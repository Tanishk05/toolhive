import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  featured: z.boolean(),
  tags: z.string().optional(), // We'll process this comma-separated string into an array
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"), // Assuming it's an ObjectId string
  authorId: z.string().min(1, "Author is required"),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
