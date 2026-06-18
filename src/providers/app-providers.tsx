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
              toast: "bg-surface text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.2)]",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
            },
          }}
        />
      </LenisProvider>
    </ThemeProvider>
  );
}
