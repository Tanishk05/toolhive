"use client";

import { Activity, Bookmark, Folder, Zap, BarChart3, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AnalyticsDashboard({ stats, chartData }: { stats: any, chartData: any[] }) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tools Used</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{stats.toolsUsed}</h3>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Favorites</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{stats.savedCount}</h3>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collections</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{stats.collectionsCount}</h3>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Folder className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all hover:shadow-md hover:border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">30-Day Usage</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{stats.usageThisMonth}</h3>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Activity Last 7 Days
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Insights */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg flex items-center mb-6">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Top Insights
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Most Used Tool</p>
              <p className="text-xl font-medium text-foreground">{stats.mostUsedTool}</p>
              <p className="text-sm text-muted-foreground mt-1">Used {stats.mostUsedToolCount} times</p>
            </div>
            
            <div className="h-px bg-border/50" />
            
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Favorite Category</p>
              <p className="text-xl font-medium text-foreground">{stats.mostUsedCategory}</p>
              <p className="text-sm text-muted-foreground mt-1">You clearly love {stats.mostUsedCategory.toLowerCase()} tools.</p>
            </div>

            <div className="h-px bg-border/50" />

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-sm text-foreground/90 leading-relaxed">
                <span className="font-semibold text-primary">Insight: </span>
                You opened {stats.usageThisMonth} tools in the last 30 days. Keep up the momentum!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
