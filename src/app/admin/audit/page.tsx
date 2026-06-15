/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Audit Logs</h1>
        <p className="text-slate-400 mt-2">Security and compliance ledger for administrative actions.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {log.user?.email || <span className="text-slate-500">System</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-amber-300 bg-amber-400/10 px-2 py-1 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{log.resource}</div>
                    {log.resourceId && <div className="text-xs text-slate-500 mt-1 font-mono">{log.resourceId}</div>}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No audit logs recorded.
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
