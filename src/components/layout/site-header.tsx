import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Bookmark, Folder, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { SearchTrigger } from "@/components/search/search-trigger";

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-40 mb-8 rounded-[1.75rem] bg-background/70 px-5 py-4 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-3 self-start rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">T</span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">ToolHive</p>
            </div>
          </Link>
          <SearchTrigger />
        </div>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <Link className="transition-colors hover:text-foreground" href="/tools">Tools</Link>
          <Link className="transition-colors hover:text-foreground" href="/categories">Categories</Link>
          <Link className="transition-colors hover:text-foreground" href="/blog">Blog</Link>
          <Link className="transition-colors hover:text-foreground" href="/contact">Contact</Link>
          <Button asChild size="sm">
            <Link href="/#featured-tools">Get started</Link>
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
              <Link href="/dashboard" prefetch={false}>
                Dashboard
              </Link>
            </Button>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link label="Dashboard" href="/dashboard" labelIcon={<Bookmark className="h-4 w-4" />} />
                <UserButton.Link label="My Collections" href="/collections" labelIcon={<Folder className="h-4 w-4" />} />
                <UserButton.Link label="Personal Analytics" href="/analytics" labelIcon={<BarChart3 className="h-4 w-4" />} />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </Show>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
