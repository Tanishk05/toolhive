"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");
      
      toast.success("User role updated successfully");
      router.refresh();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <select
      value={currentRole}
      onChange={handleRoleChange}
      disabled={isLoading}
      className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-md px-2 py-1 focus:ring-emerald-500 focus:border-emerald-500"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}
