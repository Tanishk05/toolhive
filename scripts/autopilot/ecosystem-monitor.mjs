import { autopilotConfig } from "./lib/config.mjs";
import { createIssue } from "./lib/github.mjs";
import { completeJson } from "./lib/llm.mjs";
import { fetchSources } from "./lib/sources.mjs";
import { renderRecommendationIssue, normalizeRecommendations } from "./lib/report.mjs";

const sources = await fetchSources(autopilotConfig.sources.ecosystem);
const fallback = {
  summary: "Ecosystem monitoring completed with fallback heuristics. Review fetched source snippets and decide whether any launches create ToolHive opportunities.",
  recommendations: sources.filter((source) => source.ok).slice(0, 5).map((source, index) => ({
    title: `Review launch signal from ${source.title}`,
    expectedImpact: "Potential new tool, content, or integration opportunity.",
    implementationEffort: "Low",
    technicalRisk: "Low",
    businessValue: "Medium",
    priority: index + 1,
    details: `Source: ${source.url}\n\nSnippet: ${source.text.slice(0, 700)}`,
  })),
};

const result = await completeJson({
  system: "You monitor AI and developer ecosystem launches for ToolHive. Return strict JSON with summary and recommendations[]. Prioritize launches that can become tools, SEO pages, integrations, or growth experiments. Ignore hype unless it creates measurable user value.",
  user: JSON.stringify({ sources }),
  fallback,
});

await createIssue({
  title: `Autopilot: ecosystem launch scan ${new Date().toISOString().slice(0, 10)}`,
  body: renderRecommendationIssue({
    title: "AI and developer ecosystem launch scan",
    summary: result.summary,
    cadence: "Daily",
    recommendations: normalizeRecommendations(result.recommendations),
    sources: sources.map((source) => source.url),
  }),
  labels: autopilotConfig.labels.ecosystem,
});
