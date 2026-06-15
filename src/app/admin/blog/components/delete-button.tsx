"use client";

import { useTransition } from "react";
import { deleteBlogPost } from "../actions";
import { Loader2 } from "lucide-react";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteBlogPost(id);
        if (result.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 flex items-center"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
      Delete
    </button>
  );
}
