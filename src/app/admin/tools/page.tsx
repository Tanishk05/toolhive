export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ToolToggle } from "@/components/admin/tool-toggle";

export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tools Management</h1>
        <p className="text-slate-400 mt-2">Manage tool visibility, featured status, and premium gating.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Tool Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{tool.name}</div>
                    <div className="text-xs text-slate-500">{tool.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      {tool.category?.label || tool.categoryId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ToolToggle toolId={tool.id} field="featured" initialValue={tool.featured} />
                  </td>
                  <td className="px-6 py-4">
                    <ToolToggle toolId={tool.id} field="published" initialValue={tool.published} />
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No tools found in the database. Ensure you have run the migration script to copy static tools to the DB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
