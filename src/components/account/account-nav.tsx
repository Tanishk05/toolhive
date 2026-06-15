import Link from "next/link";
import { Bookmark, CreditCard, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const accountLinks = [
  { label: "Profile", href: "/account", icon: UserRound },
  { label: "Saved", href: "/account/saved-tools", icon: Bookmark },
  { label: "Subscription", href: "/account/subscription", icon: CreditCard },
  { label: "Settings", href: "/account/settings", icon: Settings },
] as const;

export function AccountNav() {
  return (
    <nav aria-label="Account" className="flex flex-wrap gap-2">
      {accountLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Button key={link.href} asChild variant="outline" size="sm">
            <Link href={link.href} prefetch={false}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
