"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ToolToggleProps {
  toolId: string;
  field: "featured" | "published";
  initialValue: boolean;
}

export function ToolToggle({ toolId, field, initialValue }: ToolToggleProps) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    const newValue = !value;
    setValue(newValue);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/tools/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, field, value: newValue }),
      });

      if (!res.ok) {
        throw new Error("Failed to update tool");
      }
      
      toast.success(`Tool ${field} updated`);
      router.refresh();
    } catch {
      toast.error(`Failed to update ${field}`);
      setValue(!newValue); // revert
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 ease-in-out ${
        value ? "bg-emerald-500" : "bg-slate-700"
      }`}
      role="switch"
      aria-checked={value}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
