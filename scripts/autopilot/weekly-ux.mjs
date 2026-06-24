import { autopilotConfig } from "./lib/config.mjs";
import { createIssue } from "./lib/github.mjs";
import { completeJson } from "./lib/llm.mjs";
import { getRepoSnapshot, readIfExists } from "./lib/repo-context.mjs";
import { renderRecommendationIssue, normalizeRecommendations } from "./lib/report.mjs";

const snapshot = getRepoSnapshot();
const uxContext = {
  routes: snapshot.routes,
  landingPage: readIfExists("src/components/landing/landing-page.tsx"),
  toolPage: readIfExists("src/app/(main)/tools/[slug]/page.tsx"),
  collectionsPage: readIfExists("src/app/(main)/collections/page.tsx"),
  mobileNav: readIfExists("src/components/navigation/mobile-bottom-nav.tsx"),
};

const fallback = {
  summary: "Weekly UX scan completed from local UI files.",
  recommendations: [
    {
      title: "Replace internal registry metadata on tool pages with user value",
      expectedImpact: "Improves tool page conversion and perceived polish.",
      implementationEffort: "Low",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 1,
      details: "Tool pages expose registry fields to users. Replace with use cases, example inputs, related workflows, and save/share actions.",
    },
    {
      title: "Make AI tools visible in primary navigation",
      expectedImpact: "Improves discovery of differentiated product surfaces.",
      implementationEffort: "Low",
      technicalRisk: "Low",
      businessValue: "High",
      priority: 2,
      details: "Current nav emphasizes tools/categories/blog/contact. AI-native pages should be promoted if they are the growth wedge.",
    },
  ],
};

const result = await completeJson({
  system: "You are ToolHive's UX researcher and product manager. Return strict JSON with summary and recommendations[]. Focus on activation, retention, clarity, mobile usability, and conversion. Avoid visual redesigns unless they improve measurable behavior.",
  user: JSON.stringify(uxContext),
  fallback,
});

await createIssue({
  title: `Autopilot: weekly UX improvements ${new Date().toISOString().slice(0, 10)}`,
  body: renderRecommendationIssue({
    title: "Weekly UI/UX improvement scan",
    summary: result.summary,
    cadence: "Weekly",
    recommendations: normalizeRecommendations(result.recommendations),
  }),
  labels: autopilotConfig.labels.ux,
});
