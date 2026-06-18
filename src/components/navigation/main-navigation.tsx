import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function MainNavigation({
  links,
  ctaLabel = "Get started",
  ctaHref = "#cta",
  brand = "ToolHive",
}: Readonly<{
  links: readonly { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  brand?: string;
}>) {
  return (
    <header className="sticky top-4 z-40 rounded-[1.75rem] bg-background/70 px-5 py-4 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center gap-3 self-start rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">T</span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">{brand}</p>
          </div>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.href} className="transition-colors hover:text-foreground" href={link.href}>
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-1">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="sm" variant="outline">
              <Link href="/account" prefetch={false}>
                Account
              </Link>
            </Button>
            <UserButton />
          </Show>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
