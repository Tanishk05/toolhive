import { autopilotConfig } from "./lib/config.mjs";
import { createIssue } from "./lib/github.mjs";
import { completeJson } from "./lib/llm.mjs";
import { getRepoSnapshot } from "./lib/repo-context.mjs";
import { renderRecommendationIssue, normalizeRecommendations } from "./lib/report.mjs";

const snapshot = getRepoSnapshot();

const fallback = {
  summary: "Generated five candidate ToolHive tools using local repo context. OPENAI_API_KEY was not available, so these are deterministic fallback ideas.",
  tools: [
    {
      title: "AI Prompt Diff Checker",
      expectedImpact: "Attracts AI builders comparing prompt versions and encourages repeat use.",
      implementationEffort: "Medium",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 1,
      details: "Client-side diff view for two prompts, variable extraction, token estimate, and exportable comparison notes.",
    },
    {
      title: "API Error Explainer",
      expectedImpact: "Targets developer search intent around confusing API errors.",
      implementationEffort: "Medium",
      technicalRisk: "Medium",
      businessValue: "High",
      priority: 2,
      details: "Paste HTTP status, stack trace, or JSON error; return likely causes, fixes, and docs links. Gate AI mode after free uses.",
    },
    {
      title: "SaaS Pricing Page Analyzer",
      expectedImpact: "Fits ToolHive's startup/CRO direction and creates shareable reports.",
      implementationEffort: "Medium",
      technicalRisk: "Medium",
      businessValue: "High",
      priority: 3,
      details: "Analyze headline, plans, CTA clarity, trust signals, and packaging gaps from URL or pasted copy.",
    },
    {
      title: "MongoDB Index Advisor",
      expectedImpact: "Strong fit for the existing stack and developer audience.",
      implementationEffort: "Medium",
      technicalRisk: "Low",
      businessValue: "Medium",
      priority: 4,
      details: "Paste query shape and collection stats; suggest indexes with tradeoffs and explain write/read cost.",
    },
    {
      title: "Next.js Metadata Auditor",
      expectedImpact: "High SEO relevance and direct tie-in to Next.js builders.",
      implementationEffort: "Low",
      technicalRisk: "Low",
      businessValue: "Medium",
      priority: 5,
      details: "Audit title, description, canonical, Open Graph, Twitter Card, robots, and JSON-LD for a URL.",
    },
  ],
};

const result = await completeJson({
  system: "You are ToolHive's autonomous CTO and product growth lead. Return strict JSON with summary and tools[]. Each tool must be practical, SEO-aware, and aligned with Next.js, TypeScript, AI products, SaaS growth, startup execution, developers, and utility workflows. Avoid trendy ideas without measurable value.",
  user: JSON.stringify({
    requirement: "Suggest exactly 5 high-quality tools to add today.",
    currentRoutes: snapshot.routes,
    schema: snapshot.schema,
    siteConfig: snapshot.siteConfig,
  }),
  fallback,
});

const recommendations = normalizeRecommendations(result.tools);
const body = renderRecommendationIssue({
  title: "Daily ToolHive tool candidates",
  summary: result.summary,
  cadence: "Daily",
  recommendations,
});

await createIssue({
  title: `Autopilot: add 5 tools for ${new Date().toISOString().slice(0, 10)}`,
  body,
  labels: autopilotConfig.labels.tools,
});
