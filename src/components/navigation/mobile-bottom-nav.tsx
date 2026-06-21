"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, LayoutDashboard, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/more", label: "More", icon: Menu },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background/80 px-4 pb-safe backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative flex items-center justify-center">
              <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              {isActive && (
                <span className="absolute -bottom-4 h-1 w-1 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
