import type { AnalyticsEventPayload, PageViewProperties } from "@/lib/analytics/events";
import type { AnalyticsConfig } from "@/lib/analytics/config";
import type { AnalyticsProvider, AnalyticsProviderName } from "@/lib/analytics/types";

type GoogleAnalyticsCommand =
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["js", Date]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    gtag?: (...args: GoogleAnalyticsCommand) => void;
    clarity?: (command: string, name?: string, value?: unknown) => void;
  }
}

function cleanProperties(properties: Record<string, unknown> | undefined) {
  if (!properties) {
    return undefined;
  }

  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

abstract class BaseAnalyticsProvider implements AnalyticsProvider {
  abstract readonly name: AnalyticsProviderName;
  abstract readonly enabled: boolean;

  page(properties: PageViewProperties): void {
    this.track({ name: "page_view", properties });
  }

  abstract track(event: AnalyticsEventPayload): void;

  identify(userId: string, traits?: Record<string, unknown>): void {
    void userId;
    void traits;
    return;
  }
}

export class GoogleAnalyticsProvider extends BaseAnalyticsProvider {
  readonly name = "google-analytics";
  readonly enabled: boolean;

  constructor(private readonly measurementId?: string) {
    super();
    this.enabled = Boolean(measurementId);
  }

  override page(properties: PageViewProperties): void {
    if (!this.enabled || !this.measurementId || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", this.measurementId, {
      page_path: properties.path,
      page_title: properties.title,
      page_referrer: properties.referrer,
      send_page_view: false,
    });
  }

  track(event: AnalyticsEventPayload): void {
    if (!this.enabled || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", event.name, cleanProperties(event.properties));
  }
}

export class MicrosoftClarityProvider extends BaseAnalyticsProvider {
  readonly name = "microsoft-clarity";
  readonly enabled: boolean;

  constructor(projectId?: string) {
    super();
    this.enabled = Boolean(projectId);
  }

  track(event: AnalyticsEventPayload): void {
    if (!this.enabled || typeof window.clarity !== "function") {
      return;
    }

    window.clarity("event", event.name);

    for (const [key, value] of Object.entries(event.properties ?? {})) {
      if (value !== undefined) {
        window.clarity("set", key, value);
      }
    }
  }

  override identify(userId: string): void {
    if (this.enabled && typeof window.clarity === "function") {
      window.clarity("identify", userId);
    }
  }
}


export class FirstPartyAnalyticsProvider extends BaseAnalyticsProvider {
  readonly name = "first-party";
  readonly enabled = true;

  constructor(private readonly endpoint: string) {
    super();
  }

  track(event: AnalyticsEventPayload): void {
    const body = JSON.stringify({
      ...event,
      timestamp: event.timestamp ?? new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  }
}

export function createAnalyticsProviders(config: AnalyticsConfig): AnalyticsProvider[] {
  return [
    new FirstPartyAnalyticsProvider(config.firstPartyEndpoint),
    new GoogleAnalyticsProvider(config.googleAnalyticsMeasurementId),
    new MicrosoftClarityProvider(config.microsoftClarityProjectId),
  ];
}
