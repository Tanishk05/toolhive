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
import { WebVitals } from "@/components/analytics/web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: "ToolHive",
  creator: "ToolHive",
  publisher: "ToolHive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
  },
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
      <head>
        {/* DNS Prefetch & Preconnect for critical third-party origins */}
        <link rel="dns-prefetch" href="https://img.clerk.com" />
        <link rel="preconnect" href="https://img.clerk.com" crossOrigin="anonymous" />
        {analyticsConfig.googleAnalyticsMeasurementId ? (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
          </>
        ) : null}
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ClerkProvider>
          <JsonLd data={createOrganizationStructuredData()} />
          <JsonLd data={createWebSiteStructuredData()} />
          <AppProviders>{children}</AppProviders>
          <AnalyticsScripts />
          <WebVitals />
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
