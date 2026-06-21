export const analyticsEventNames = [
  "page_view",
  "tool_view",
  "tool_use",
  "qr_generated",
  "gst_calculated",
  "age_calculated",
  "unit_converted",
  "json_formatted",
  "emi_calculated",
  "password_generated",
  "uuid_generated",
  "base64_converted",
  "image_compressed",
  "jwt_decoded",
  "percentage_calculated",
  "word_counted",
  "text_case_converted",
  "image_resized",
  "timestamp_converted",
  "url_encoded_decoded",
  "color_palette_generated",
  "regex_tested",
  "lorem_generated",
  "download",
  "signup",
  "payment",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export type AnalyticsPrimitive = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive | AnalyticsPrimitive[] | undefined>;

export type AnalyticsEventPayload<TName extends AnalyticsEventName = AnalyticsEventName> = {
  name: TName;
  properties?: AnalyticsProperties;
  userId?: string;
  timestamp?: string;
};

export type PageViewProperties = AnalyticsProperties & {
  path: string;
  title?: string;
  referrer?: string;
};

export type ToolAnalyticsProperties = AnalyticsProperties & {
  tool_slug: string;
  tool_name?: string;
  tool_category?: string;
};

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === "string" && analyticsEventNames.includes(value as AnalyticsEventName);
}
