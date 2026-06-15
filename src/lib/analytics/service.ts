import type { AnalyticsEventPayload, PageViewProperties } from "@/lib/analytics/events";
import { analyticsConfig } from "@/lib/analytics/config";
import { createAnalyticsProviders } from "@/lib/analytics/providers";
import type { AnalyticsProvider, AnalyticsService } from "@/lib/analytics/types";

class BrowserAnalyticsService implements AnalyticsService {
  constructor(private readonly providers: AnalyticsProvider[]) {}

  page(properties: PageViewProperties): void {
    this.deliver((provider) => provider.page(properties));
  }

  track(event: AnalyticsEventPayload): void {
    this.deliver((provider) => provider.track(event));
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    this.deliver((provider) => provider.identify?.(userId, traits));
  }

  private deliver(callback: (provider: AnalyticsProvider) => void) {
    for (const provider of this.providers) {
      if (!provider.enabled) {
        continue;
      }

      try {
        callback(provider);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Analytics provider failed: ${provider.name}`, error);
        }
      }
    }
  }
}

export const analytics = new BrowserAnalyticsService(createAnalyticsProviders(analyticsConfig));

export function trackToolUse(properties: { tool_slug: string; tool_name?: string; tool_category?: string }) {
  analytics.track({ name: "tool_use", properties });
}

export function trackQrGenerated(properties: { tool_slug?: string; format?: string }) {
  analytics.track({ name: "qr_generated", properties });
}

export function trackDownload(properties: { file_name?: string; file_type?: string; tool_slug?: string }) {
  analytics.track({ name: "download", properties });
}

export function trackSignup(properties?: { method?: string; plan?: string }) {
  analytics.track({ name: "signup", properties });
}

export function trackPayment(properties: { provider?: string; plan?: string; amount?: number; currency?: string; status?: string }) {
  analytics.track({ name: "payment", properties });
}
