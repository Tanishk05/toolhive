/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  const [payments, subscriptions] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true },
    }),
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Management</h1>
        <p className="text-slate-400 mt-2">View recent transactions and active subscriptions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-lg font-semibold text-white">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      {payment.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No payments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-lg font-semibold text-white">Recent Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {subscriptions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      {sub.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      {sub.providerPlanId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No subscriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
