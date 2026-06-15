export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { FeatureFlagToggle } from "@/components/admin/feature-flag-toggle";

export const dynamic = "force-dynamic";

export default async function AdminFeatureFlagsPage() {
  const flags = await prisma.featureFlag.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Feature Flags</h1>
        <p className="text-slate-400 mt-2">Manage global application states and rollouts.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Flag Name</th>
                <th className="px-6 py-4 font-medium">Key</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {flags.map((flag) => (
                <tr key={flag.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{flag.name}</div>
                    <div className="text-xs text-slate-500 mt-1 max-w-sm truncate">{flag.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-white/10 px-2 py-1 rounded text-xs text-emerald-300 font-mono">
                      {flag.key}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(flag.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <FeatureFlagToggle flagId={flag.id} initialValue={flag.enabled} />
                  </td>
                </tr>
              ))}
              {flags.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No feature flags found.
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
