import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { AccountNav } from "@/components/account/account-nav";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export function AccountShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-[1.75rem] border border-white/10 bg-slate-950/72 px-5 py-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your ToolHive workspace</h1>
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
