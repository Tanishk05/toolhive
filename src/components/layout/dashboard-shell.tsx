import { ReactNode } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur-xl">
        <div>
          <p className="text-sm font-medium tracking-[0.24em] text-emerald-300 uppercase">ToolHive</p>
          <p className="mt-1 text-sm text-slate-400">Utility platform foundation</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 mr-2" />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
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