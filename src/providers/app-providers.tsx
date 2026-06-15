"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <LenisProvider>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "border border-white/10 bg-slate-950 text-slate-100",
              description: "text-slate-300",
              actionButton: "bg-emerald-400 text-slate-950",
            },
          }}
        />
      </LenisProvider>
    </ThemeProvider>
  );
}
