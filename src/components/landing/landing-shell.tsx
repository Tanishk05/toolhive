import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function LandingShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <header className="sticky top-4 z-40 mb-6 rounded-[1.75rem] border border-border bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="inline-flex items-center gap-3 self-start rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">T</span>
            <div>
              <p className="text-sm font-medium tracking-[0.24em] text-primary uppercase">ToolHive</p>
              <p className="text-sm text-muted-foreground">Utility tools at platform scale</p>
            </div>
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <a className="transition hover:text-foreground" href="#featured-tools">Tools</a>
            <a className="transition hover:text-foreground" href="#popular-categories">Categories</a>
            <a className="transition hover:text-foreground" href="#blog-preview">Blog</a>
            <a className="transition hover:text-foreground" href="#cta">Contact</a>
            <Button asChild size="sm" className="ml-1">
              <a href="#featured-tools">Get started</a>
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
      {children}
    </main>
  );
}
