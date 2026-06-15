export type AnalyticsConfig = {
  googleAnalyticsMeasurementId?: string;
  googleSearchConsoleVerification?: string;
  microsoftClarityProjectId?: string;
  firstPartyEndpoint: string;
};

function optionalEnv(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const analyticsConfig: AnalyticsConfig = {
  googleAnalyticsMeasurementId: optionalEnv(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  googleSearchConsoleVerification: optionalEnv(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
  microsoftClarityProjectId: optionalEnv(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
  firstPartyEndpoint: "/api/analytics",
};
