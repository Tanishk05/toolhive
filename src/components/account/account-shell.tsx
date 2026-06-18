import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { AccountNav } from "@/components/account/account-nav";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function AccountShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-[1.75rem] bg-surface/80 px-5 py-5 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_32px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.35em] text-primary/70 uppercase">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Your ToolHive workspace</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AccountNav />
          <UserButton />
          <ThemeSwitcher />
        </div>
      </header>
      {children}
    </main>
  );
}
