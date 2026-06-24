import { autopilotConfig } from "./lib/config.mjs";
import { createIssue } from "./lib/github.mjs";
import { completeJson } from "./lib/llm.mjs";
import { getRepoSnapshot } from "./lib/repo-context.mjs";
import { renderRecommendationIssue, normalizeRecommendations } from "./lib/report.mjs";

const snapshot = getRepoSnapshot();
const fallback = {
  summary: "SEO scan completed from local routes, sitemap, robots, and schema.",
  recommendations: [
    {
      title: "Add public collection pages to sitemap",
      expectedImpact: "More indexable UGC and long-tail workflow pages.",
      implementationEffort: "Low",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 1,
      details: "Collections already have public pages and structured data, but sitemap.ts only includes core pages, tools, categories, and blog.",
    },
    {
      title: "Create SEO pages for AI-native tools",
      expectedImpact: "Captures higher-intent traffic than commodity calculators.",
      implementationEffort: "Medium",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 2,
      details: "Prioritize /startup-generator and /reverse-engineer with examples, FAQ, JSON-LD, and shareable output pages.",
    },
  ],
};

const result = await completeJson({
  system: "You are ToolHive's SEO lead. Return strict JSON with summary and recommendations[]. Use only measurable SEO opportunities tied to the existing codebase. Include target path or page type in details.",
  user: JSON.stringify({
    seeds: autopilotConfig.sources.seoSeeds,
    routes: snapshot.routes,
    sitemap: snapshot.sitemap,
    robots: snapshot.robots,
    schema: snapshot.schema,
  }),
  fallback,
});

await createIssue({
  title: `Autopilot: daily SEO opportunities ${new Date().toISOString().slice(0, 10)}`,
  body: renderRecommendationIssue({
    title: "Daily SEO opportunity scan",
    summary: result.summary,
    cadence: "Daily",
    recommendations: normalizeRecommendations(result.recommendations),
  }),
  labels: autopilotConfig.labels.seo,
});
