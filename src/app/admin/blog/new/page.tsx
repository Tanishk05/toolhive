import { prisma } from "@/lib/prisma";
import type { Category, User } from "@prisma/client";
import { BlogForm } from "../components/blog-form";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const categories = await prisma.category.findMany();
  const authors = await prisma.user.findMany();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create New Blog Post</h1>
        <p className="text-slate-400 mt-2">Write and publish a new article to the ToolHive blog.</p>
      </div>

      <BlogForm 
        categories={categories.map((c: Category) => ({ id: c.id, label: c.label }))}
        authors={authors.map((a: User) => ({ id: a.id, name: a.name || a.email || "Unknown" }))}
      />
    </div>
  );
}
