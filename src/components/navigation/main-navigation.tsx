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
    <header className="sticky top-4 z-40 rounded-[1.75rem] border border-white/10 bg-slate-950/72 px-4 py-4 backdrop-blur-xl sm:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center gap-3 self-start rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">T</span>
          <div>
            <p className="text-sm font-medium tracking-[0.24em] text-emerald-300 uppercase">{brand}</p>
            <p className="text-sm text-muted-foreground">Utility tools at platform scale</p>
          </div>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          {links.map((link) => (
            <Link key={link.href} className="transition hover:text-white" href={link.href}>
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
