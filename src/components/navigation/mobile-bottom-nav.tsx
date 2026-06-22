"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, LayoutDashboard, Menu, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, SignInButton } from "@clerk/nextjs";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  type NavItem = {
    href: string;
    label: string;
    icon: any;
    isAuthAction?: boolean;
  };

  const LOGGED_IN_NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tools", label: "Tools", icon: Search },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/more", label: "More", icon: Menu },
  ];

  const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tools", label: "Tools", icon: Search },
    { href: "#login", label: "Login", icon: LogIn, isAuthAction: true },
    { href: "/more", label: "More", icon: Menu },
  ];

  const navItems = isLoaded && isSignedIn ? LOGGED_IN_NAV_ITEMS : LOGGED_OUT_NAV_ITEMS;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background/80 px-4 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && !item.isAuthAction);
        const Icon = item.icon;

        const content = (
          <>
            <div className="relative flex items-center justify-center">
              <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              {isActive && (
                <span className="absolute -bottom-4 h-1 w-1 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </>
        );

        if (item.isAuthAction) {
          return (
            <SignInButton key={item.label} mode="modal">
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                {content}
              </button>
            </SignInButton>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
