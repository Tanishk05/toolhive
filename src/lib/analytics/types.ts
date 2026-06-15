import type { AnalyticsEventPayload, PageViewProperties } from "@/lib/analytics/events";

export type AnalyticsProviderName = "first-party" | "google-analytics" | "microsoft-clarity";

export interface AnalyticsProvider {
  readonly name: AnalyticsProviderName;
  readonly enabled: boolean;
  page(properties: PageViewProperties): void;
  track(event: AnalyticsEventPayload): void;
  identify?(userId: string, traits?: Record<string, unknown>): void;
}

export interface AnalyticsService {
  page(properties: PageViewProperties): void;
  track(event: AnalyticsEventPayload): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
}
