"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative text-sm font-medium transition-colors hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
            {isActive && (
              <span className="absolute -bottom-5 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
            )}
          </Link>
        );
      })}
    </>
  );
}
