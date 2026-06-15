export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Contact Requests</h1>
        <p className="text-slate-400 mt-2">Manage inbound support and enterprise inquiries.</p>
      </div>

      <div className="grid gap-6">
        {messages.map((msg) => (
          <Card key={msg.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{msg.subject}</h3>
                <p className="text-sm text-slate-400">From: {msg.email} {msg.name ? `(${msg.name})` : ''}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                msg.resolved ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
              }`}>
                {msg.resolved ? 'Resolved' : 'Pending'}
              </span>
            </div>
            <div className="p-4 rounded bg-slate-900 border border-white/5 text-slate-300 text-sm whitespace-pre-wrap">
              {msg.message}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                Reply via Email
              </button>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                Mark Resolved
              </button>
            </div>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No contact messages found.
          </div>
        )}
      </div>
    </div>
  );
}
