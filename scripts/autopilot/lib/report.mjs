export function renderRecommendationIssue({ title, summary, recommendations, sources = [], cadence, owner = "ToolHive Autopilot" }) {
  const lines = [
    `# ${title}`,
    "",
    `Owner: ${owner}`,
    `Cadence: ${cadence}`,
    "",
    "## Summary",
    summary || "No summary generated.",
    "",
    "## Recommendations",
  ];

  for (const item of recommendations) {
    lines.push(
      "",
      `### ${item.title}`,
      "",
      `- Expected impact: ${item.expectedImpact}`,
      `- Implementation effort: ${item.implementationEffort}`,
      `- Technical risk: ${item.technicalRisk}`,
      `- Business value: ${item.businessValue}`,
      `- Priority: ${item.priority}`,
      "",
      item.details || ""
    );
  }

  if (sources.length > 0) {
    lines.push("", "## Sources", ...sources.map((source) => `- ${source}`));
  }

  lines.push(
    "",
    "## Safety",
    "- This issue was generated automatically.",
    "- Do not auto-merge changes from this issue.",
    "- PR generation is allowed only for allowlisted low-risk patches that pass lint/build checks."
  );

  return lines.join("\n");
}

export function normalizeRecommendations(items = []) {
  return items.map((item, index) => ({
    title: String(item.title || `Recommendation ${index + 1}`),
    expectedImpact: String(item.expectedImpact || "Unknown"),
    implementationEffort: String(item.implementationEffort || "Unknown"),
    technicalRisk: String(item.technicalRisk || "Unknown"),
    businessValue: String(item.businessValue || "Unknown"),
    priority: Number.isFinite(Number(item.priority)) ? Number(item.priority) : index + 1,
    details: String(item.details || ""),
  }));
}
