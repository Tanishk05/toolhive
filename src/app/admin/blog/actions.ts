"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { blogPostSchema, type BlogPostFormValues } from "./schema";

export async function createBlogPost(data: BlogPostFormValues) {
  const result = blogPostSchema.safeParse(data);
  if (!result.success) {
    return { error: "Validation failed", details: result.error.flatten() };
  }

  const validData = result.data;
  const tagsArray = validData.tags ? validData.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: validData.title,
        slug: validData.slug,
        excerpt: validData.excerpt,
        content: validData.content,
        coverImage: validData.coverImage || null,
        published: validData.published,
        featured: validData.featured,
        tags: tagsArray,
        seoTitle: validData.seoTitle || null,
        seoDescription: validData.seoDescription || null,
        categoryId: validData.categoryId,
        authorId: validData.authorId,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
    
    return { success: true, postId: post.id };
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    if (error.code === "P2002") {
      return { error: "A post with this slug already exists." };
    }
    return { error: "Failed to save blog post to database." };
  }
}

export async function updateBlogPost(id: string, data: BlogPostFormValues) {
  const result = blogPostSchema.safeParse(data);
  if (!result.success) {
    return { error: "Validation failed", details: result.error.flatten() };
  }

  const validData = result.data;
  const tagsArray = validData.tags ? validData.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: validData.title,
        slug: validData.slug,
        excerpt: validData.excerpt,
        content: validData.content,
        coverImage: validData.coverImage || null,
        published: validData.published,
        featured: validData.featured,
        tags: tagsArray,
        seoTitle: validData.seoTitle || null,
        seoDescription: validData.seoDescription || null,
        categoryId: validData.categoryId,
        authorId: validData.authorId,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true, postId: post.id };
  } catch (error: any) {
    console.error("Failed to update blog post:", error);
    if (error.code === "P2002") {
      return { error: "A post with this slug already exists." };
    }
    return { error: "Failed to update blog post in database." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { error: "Failed to delete blog post." };
  }
}
