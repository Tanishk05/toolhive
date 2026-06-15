"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DashboardChartsProps {
  data: Array<{
    name: string;
    users: number;
    events: number;
  }>;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              borderColor: '#1e293b',
              borderRadius: '0.5rem',
              color: '#f8fafc'
            }}
            itemStyle={{ color: '#34d399' }}
          />
          <Area 
            type="monotone" 
            dataKey="events" 
            stroke="#34d399" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorEvents)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
