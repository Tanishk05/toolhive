"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FeatureFlagToggle({ flagId, initialValue }: { flagId: string; initialValue: boolean }) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    const newValue = !value;
    setValue(newValue);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/feature-flags/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagId, enabled: newValue }),
      });

      if (!res.ok) throw new Error("Failed to update flag");
      
      toast.success("Feature flag updated");
      router.refresh();
    } catch {
      toast.error("Failed to update feature flag");
      setValue(!newValue); // revert
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 ease-in-out ${
        value ? "bg-emerald-500" : "bg-slate-700"
      }`}
      role="switch"
      aria-checked={value}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
