import { autopilotConfig } from "./lib/config.mjs";
import { createIssue } from "./lib/github.mjs";
import { completeJson } from "./lib/llm.mjs";
import { fetchSources } from "./lib/sources.mjs";
import { getRepoSnapshot } from "./lib/repo-context.mjs";
import { renderRecommendationIssue, normalizeRecommendations } from "./lib/report.mjs";

const [sources, snapshot] = await Promise.all([
  fetchSources(autopilotConfig.sources.competitors),
  Promise.resolve(getRepoSnapshot()),
]);

const fallback = {
  summary: "Competitor scan completed with fallback heuristics.",
  recommendations: [
    {
      title: "Differentiate around AI workflows, not generic free utilities",
      expectedImpact: "Improves positioning and avoids direct commodity SEO fights.",
      implementationEffort: "Medium",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 1,
      details: "Competitors dominate broad utility pages. ToolHive should use AI teardown, startup kit, collections, and builder workflows as the wedge.",
    },
  ],
};

const result = await completeJson({
  system: "You are ToolHive's competitor intelligence lead. Return strict JSON with summary and recommendations[]. Identify gaps where ToolHive can win with product, SEO, retention, submissions, or revenue. Do not recommend copying features without a strategic reason.",
  user: JSON.stringify({
    competitors: sources,
    toolhiveRoutes: snapshot.routes,
    schema: snapshot.schema,
  }),
  fallback,
});

await createIssue({
  title: `Autopilot: competitor gap scan ${new Date().toISOString().slice(0, 10)}`,
  body: renderRecommendationIssue({
    title: "Competitor gap scan",
    summary: result.summary,
    cadence: "Daily",
    recommendations: normalizeRecommendations(result.recommendations),
    sources: sources.map((source) => source.url),
  }),
  labels: autopilotConfig.labels.competitors,
});
