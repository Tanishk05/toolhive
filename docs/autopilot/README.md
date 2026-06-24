# ToolHive Autonomous Operating System

ToolHive Autopilot is a conservative autonomous operating system for growth, SEO, product, UX, and low-risk engineering work.

It is designed to create high-quality GitHub issues automatically and generate implementation PRs only when the change is allowlisted, bounded, and validated.

## Agent Architecture

| Agent | Cadence | Script | Output |
| --- | --- | --- | --- |
| Tool Discovery Agent | Daily | `npm run autopilot:daily-tools` | 5 tool candidates with impact, effort, risk, and business value |
| Ecosystem Monitor | Daily | `npm run autopilot:ecosystem` | AI/developer launch opportunities |
| SEO Opportunity Agent | Daily | `npm run autopilot:seo` | SEO issue backlog from routes, sitemap, robots, schema, and seed topics |
| UX Research Agent | Weekly | `npm run autopilot:weekly-ux` | UX and conversion recommendations |
| Competitor Gap Agent | Daily | `npm run autopilot:competitors` | Competitor gap analysis |
| Low-Risk PR Agent | Daily | `npm run autopilot:low-risk-prs` | Draft PRs from allowlisted patches |

## Folder Structure

```text
.github/workflows/
  autopilot-daily.yml
  autopilot-weekly-ux.yml
  autopilot-low-risk-prs.yml
docs/autopilot/
  README.md
scripts/autopilot/
  daily-tools.mjs
  ecosystem-monitor.mjs
  seo-opportunities.mjs
  weekly-ux.mjs
  competitor-gaps.mjs
  low-risk-prs.mjs
  lib/
    config.mjs
    github.mjs
    llm.mjs
    report.mjs
    repo-context.mjs
    safety.mjs
    sources.mjs
```

## Required Secrets

- `OPENAI_API_KEY`: optional but recommended. Without it, scripts use deterministic fallback recommendations.
- `GITHUB_TOKEN`: provided automatically by GitHub Actions.

## Runtime Controls

- `AUTOPILOT_DRY_RUN=false`: create GitHub issues or PRs. Defaults to dry-run locally.
- `AUTOPILOT_ALLOW_PR=true`: allows the low-risk PR agent to create draft PRs.
- `AUTOPILOT_OPENAI_MODEL`: defaults to `gpt-4o-mini`.
- `TOOLHIVE_SITE_URL`: defaults to `NEXT_PUBLIC_APP_URL` or `https://toolhive.in`.

## Database Schema

The Prisma schema adds:

- `AutopilotRun`: audit log for scheduled agent runs.
- `AutopilotRecommendation`: durable backlog item model for future admin UI, acceptance state, GitHub issue URL, PR URL, target paths, and priority.

These models are not required for GitHub Actions to run, but they make the system ready for an in-app Autopilot dashboard.

## GitHub Issue Automation

Daily and weekly agents create issues with:

- Expected impact
- Implementation effort
- Technical risk
- Business value
- Priority
- Source URLs where relevant
- Safety notes

The agents are intentionally opinionated toward high-ROI work and should avoid trend-chasing unless the launch can become traffic, retention, submissions, or revenue.

## Low-Risk PR Automation

The PR agent only acts on open issues labeled:

- `autopilot:low-risk`

The issue must contain a fenced `autopilot-patch` JSON block:

```autopilot-patch
[
  {
    "type": "replace",
    "path": "src/constants/site-config.ts",
    "find": "old exact text",
    "replace": "new exact text"
  }
]
```

Safety limits:

- Only exact string replacements are supported.
- Only allowlisted paths are writable: `docs/`, `src/constants/`, `src/app/robots.ts`, `src/app/sitemap.ts`, and `src/constants/site-config.ts`.
- Maximum 5 patches per PR.
- Maximum 30 changed lines per patch.
- Secret-looking content is blocked.
- The workflow runs `npm run lint` and `npm run build` before opening a draft PR.

## Cron Jobs

GitHub Actions schedules:

- Daily tool candidates: `15 2 * * *`
- Daily SEO scan: `45 5 * * *`
- Daily ecosystem and competitor scan: `15 8 * * *`
- Weekly UX scan: `30 4 * * 1`
- Daily low-risk PR check: `0 10 * * *`

Times are UTC.

## Operating Rules

1. Issues are suggestions, not truth.
2. PRs are draft by default and require human review.
3. Do not auto-merge Autopilot PRs.
4. Keep AI-generated code behind allowlists until ToolHive has stronger test coverage.
5. Prioritize changes that improve monthly active users, organic traffic, retention, tool submissions, or revenue.
