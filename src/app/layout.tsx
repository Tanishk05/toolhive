import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/constants/site-config";
import { AppProviders } from "@/providers/app-providers";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { JsonLd } from "@/components/seo/json-ld";
import { createOrganizationStructuredData, createWebSiteStructuredData } from "@/lib/seo";
import { analyticsConfig } from "@/lib/analytics/config";
import Script from "next/script";
import { BackToTop } from "@/components/ui/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  verification: analyticsConfig.googleSearchConsoleVerification
    ? {
        google: analyticsConfig.googleSearchConsoleVerification,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ClerkProvider>
          <JsonLd data={createOrganizationStructuredData()} />
          <JsonLd data={createWebSiteStructuredData()} />
          <AppProviders>{children}</AppProviders>
          <AnalyticsScripts />
          <BackToTop />
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ? (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          ) : null}
        </ClerkProvider>
      </body>
    </html>
  );
}
