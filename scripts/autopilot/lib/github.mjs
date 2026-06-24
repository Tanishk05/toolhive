import { autopilotConfig, requireRepo } from "./config.mjs";

const apiBase = "https://api.github.com";

async function githubRequest(path, init = {}) {
  if (!autopilotConfig.token) {
    throw new Error("GITHUB_TOKEN is required for GitHub API calls.");
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${autopilotConfig.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function createIssue({ title, body, labels = [] }) {
  const trimmedBody = body.slice(0, autopilotConfig.maxIssueBodyChars);

  if (autopilotConfig.dryRun || !autopilotConfig.token) {
    console.log(JSON.stringify({ dryRun: true, type: "issue", title, labels, body: trimmedBody }, null, 2));
    return { html_url: null, number: null };
  }

  const repo = requireRepo();
  return githubRequest(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body: trimmedBody, labels }),
  });
}

export async function listIssuesByLabel(label, state = "open") {
  const repo = requireRepo();
  return githubRequest(`/repos/${repo}/issues?state=${state}&labels=${encodeURIComponent(label)}&per_page=30`);
}

export async function createPullRequest({ title, body, head, base = "main", draft = false }) {
  if (autopilotConfig.dryRun || !autopilotConfig.token) {
    console.log(JSON.stringify({ dryRun: true, type: "pull_request", title, head, base, draft, body }, null, 2));
    return { html_url: null, number: null };
  }

  const repo = requireRepo();
  return githubRequest(`/repos/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, body, head, base, draft }),
  });
}
