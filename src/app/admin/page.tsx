/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { Card } from "@/components/ui/card";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Users, Wrench, DollarSign, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { prisma } = await import("@/lib/prisma");
  const [
    totalUsers,
    totalTools,
    revenueAgg,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tool.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "succeeded" },
    }),
    prisma.analyticsEvent.count({
      where: {
        createdAt: {
          // eslint-disable-next-line react-hooks/purity
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  const totalRevenue = (revenueAgg._sum.amount || 0) / 100; // Assuming amount is in cents

  const kpis = [
    { title: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Active Tools", value: totalTools.toLocaleString(), icon: Wrench, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "30d Events", value: recentEvents.toLocaleString(), icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  // Generate some dummy chart data since we don't have historical aggregates ready yet
  // In a real app, you'd group analyticsEvents by date
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      name: d.toLocaleDateString("en-US", { weekday: 'short' }),
      // eslint-disable-next-line react-hooks/purity
      users: Math.floor(Math.random() * 50) + 10,
      // eslint-disable-next-line react-hooks/purity
      events: Math.floor(Math.random() * 500) + 100,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome to the ToolHive administrative portal.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi: any) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Traffic & Engagement</h2>
          <DashboardCharts data={chartData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {/* We will add real links later */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
              User role management
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
              Review new blog posts
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
              Toggle global features
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
