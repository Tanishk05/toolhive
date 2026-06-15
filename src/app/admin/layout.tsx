export const runtime = "nodejs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { prisma } = await import("@/lib/prisma");
  const { userId } = await auth.protect();

  // RBAC Check
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "admin") {
    // Audit Log for unauthorized access attempt
    if (user) {
      await prisma.auditLog.create({
        data: {
          action: "UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT",
          resource: "AdminPortal",
          userId: user.id,
        },
      });
    }
    
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar />
      <div className="pl-72">
        <main className="mx-auto max-w-7xl px-8 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
