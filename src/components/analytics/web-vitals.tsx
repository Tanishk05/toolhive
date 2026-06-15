"use client";

import { useReportWebVitals } from "next/web-vitals";
import { analyticsConfig } from "@/lib/analytics/config";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Report to Google Analytics if available
    if (analyticsConfig.googleAnalyticsMeasurementId && typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag("event", metric.name, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}
