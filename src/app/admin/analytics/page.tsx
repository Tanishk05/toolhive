export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const events = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Log</h1>
        <p className="text-slate-400 mt-2">Raw telemetry and user event stream.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {events.map((evt: any) => (
                <tr key={evt.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                    {new Date(evt.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-purple-400">
                    {evt.name}
                  </td>
                  <td className="px-6 py-4">
                    {evt.user?.email || <span className="text-slate-500">Anonymous</span>}
                  </td>
                  <td className="px-6 py-4">
                    <pre className="text-[10px] bg-slate-950 p-2 rounded max-w-xs overflow-x-auto border border-white/5 text-slate-300">
                      {JSON.stringify(evt.payload || {}, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No events tracked yet.
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
