"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { blogPostSchema, type BlogPostFormValues } from "../schema";
import { createBlogPost, updateBlogPost } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type BlogFormProps = {
  initialData?: BlogPostFormValues & { id: string };
  categories: { id: string; label: string }[];
  authors: { id: string; name: string }[];
};

export function BlogForm({ initialData, categories, authors }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      featured: false,
      tags: "",
      seoTitle: "",
      seoDescription: "",
      categoryId: "",
      authorId: "",
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    setError(null);
    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateBlogPost(initialData.id, data);
      } else {
        result = await createBlogPost(data);
      }

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/blog");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Title</label>
          <Input {...register("title")} placeholder="My Awesome Post" error={errors.title?.message} />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Slug</label>
          <Input {...register("slug")} placeholder="my-awesome-post" error={errors.slug?.message} />
          {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Excerpt</label>
        <Textarea {...register("excerpt")} placeholder="A short description..." error={errors.excerpt?.message} />
        {errors.excerpt && <p className="text-xs text-red-400">{errors.excerpt.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Content (Markdown)</label>
        <Textarea 
          {...register("content")} 
          placeholder="Write your markdown here..." 
          className="min-h-[400px] font-mono text-sm"
          error={errors.content?.message} 
        />
        {errors.content && <p className="text-xs text-red-400">{errors.content.message}</p>}
      </div>

      <Card className="p-6 bg-slate-900/50 border-white/5 space-y-6">
        <h3 className="text-lg font-semibold text-white">Metadata & SEO</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Category</label>
            <Select {...register("categoryId")} error={errors.categoryId?.message}>
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
            {errors.categoryId && <p className="text-xs text-red-400">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Author</label>
            <Select {...register("authorId")} error={errors.authorId?.message}>
              <option value="">Select an author</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>
            {errors.authorId && <p className="text-xs text-red-400">{errors.authorId.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Cover Image URL</label>
          <Input {...register("coverImage")} placeholder="https://..." error={errors.coverImage?.message} />
          {errors.coverImage && <p className="text-xs text-red-400">{errors.coverImage.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tags (comma separated)</label>
          <Input {...register("tags")} placeholder="seo, tips, writing" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">SEO Title</label>
            <Input {...register("seoTitle")} placeholder="Leave blank to use post title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">SEO Description</label>
            <Input {...register("seoDescription")} placeholder="Leave blank to use excerpt" />
          </div>
        </div>

        <div className="flex gap-6 pt-4 border-t border-white/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("published")} className="rounded border-white/20 bg-slate-900" />
            <span className="text-sm font-medium text-slate-300">Published</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="rounded border-white/20 bg-slate-900" />
            <span className="text-sm font-medium text-slate-300">Featured</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
