"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  DollarSign, 
  LineChart, 
  FileText, 
  ToggleRight, 
  MessageSquare, 
  ShieldAlert,
  ArrowLeft
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Tools", href: "/admin/tools", icon: Wrench },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Feature Flags", href: "/admin/feature-flags", icon: ToggleRight },
  { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { name: "Audit Logs", href: "/admin/audit", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 border-r border-white/10">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-emerald-400 transition">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to App</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="mb-6 px-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Admin Portal
          </h2>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
