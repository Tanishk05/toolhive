import { ReactNode } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-surface/80 px-5 py-4 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.08)]">
        <div>
          <p className="text-sm font-semibold tracking-tight text-foreground">ToolHive</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Utility platform</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary mr-2" />
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
        </div>
      </header>
      {children}
    </main>
  );
}