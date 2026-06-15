import { prisma } from "@/lib/prisma";
import type { Category, User } from "@prisma/client";
import { BlogForm } from "../../components/blog-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id }
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.category.findMany();
  const authors = await prisma.user.findMany();

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || "",
    published: post.published,
    featured: post.featured,
    tags: post.tags.join(", "),
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
    categoryId: post.categoryId || "",
    authorId: post.authorId || "",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Blog Post</h1>
        <p className="text-slate-400 mt-2">Update the article.</p>
      </div>

      <BlogForm 
        initialData={initialData}
        categories={categories.map((c: Category) => ({ id: c.id, label: c.label }))}
        authors={authors.map((a: User) => ({ id: a.id, name: a.name || a.email || "Unknown" }))}
      />
    </div>
  );
}
