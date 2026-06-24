export const autopilotConfig = {
  repo: process.env.GITHUB_REPOSITORY || "",
  token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "",
  dryRun: process.env.AUTOPILOT_DRY_RUN !== "false",
  allowPrs: process.env.AUTOPILOT_ALLOW_PR === "true",
  appUrl: process.env.TOOLHIVE_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://toolhive.in",
  maxFetchedChars: Number(process.env.AUTOPILOT_MAX_FETCHED_CHARS || 9000),
  maxIssueBodyChars: Number(process.env.AUTOPILOT_MAX_ISSUE_BODY_CHARS || 60000),
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.AUTOPILOT_OPENAI_MODEL || "gpt-4o-mini",
  labels: {
    tools: ["autopilot", "growth", "tools"],
    ecosystem: ["autopilot", "market-intel"],
    seo: ["autopilot", "seo"],
    ux: ["autopilot", "ux"],
    competitors: ["autopilot", "competitive-intel"],
    lowRisk: ["autopilot", "autopilot:low-risk"],
  },
  sources: {
    ecosystem: [
      "https://openai.com/news/",
      "https://vercel.com/blog",
      "https://nextjs.org/blog",
      "https://github.blog/changelog/",
      "https://www.anthropic.com/news",
      "https://ai.google.dev/gemini-api/docs/changelog",
      "https://mongodb.com/developer/products/mongodb/",
    ],
    competitors: [
      "https://tinywow.com",
      "https://www.ilovepdf.com",
      "https://smallpdf.com",
      "https://www.toolify.ai",
      "https://theresanaiforthat.com",
      "https://www.futuretools.io",
    ],
    seoSeeds: [
      "ai startup generator",
      "reverse engineer website design",
      "free developer tools",
      "online json formatter",
      "qr code generator",
      "startup kit generator",
      "website teardown ai",
    ],
  },
};

export function requireRepo() {
  if (!autopilotConfig.repo) {
    throw new Error("GITHUB_REPOSITORY is required for GitHub write operations.");
  }
  return autopilotConfig.repo;
}
