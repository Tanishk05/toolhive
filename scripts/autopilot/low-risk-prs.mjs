import { execFileSync } from "node:child_process";
import { createPullRequest, listIssuesByLabel } from "./lib/github.mjs";
import { autopilotConfig } from "./lib/config.mjs";
import { applyPatchSet, validatePatchSet } from "./lib/safety.mjs";

if (!autopilotConfig.allowPrs) {
  console.log("AUTOPILOT_ALLOW_PR is not true; skipping autonomous PR generation.");
  process.exit(0);
}

const issues = await listIssuesByLabel("autopilot:low-risk");
const issue = issues.find((item) => item.pull_request === undefined && item.body?.includes("```autopilot-patch"));

if (!issue) {
  console.log("No open low-risk autopilot issue with an autopilot-patch block.");
  process.exit(0);
}

const patches = extractPatchSet(issue.body);
validatePatchSet(patches);

const branch = `autopilot/low-risk-${issue.number}-${Date.now()}`;
run("git", ["checkout", "-b", branch]);

try {
  applyPatchSet(patches);
  run("npm", ["run", "lint"]);
  run("npm", ["run", "build"]);
  run("git", ["add", "."]);
  run("git", ["commit", "-m", `chore(autopilot): apply low-risk issue #${issue.number}`]);
  run("git", ["push", "--set-upstream", "origin", branch]);

  await createPullRequest({
    title: `Autopilot: low-risk implementation for #${issue.number}`,
    body: [
      `Implements the allowlisted low-risk patch from #${issue.number}.`,
      "",
      "Safety checks run:",
      "- npm run lint",
      "- npm run build",
      "",
      "This PR was generated automatically and should be reviewed before merge.",
    ].join("\n"),
    head: branch,
    base: "main",
    draft: true,
  });
} catch (error) {
  console.error(error);
  run("git", ["checkout", "-"]);
  throw error;
}

function extractPatchSet(body) {
  const match = body.match(/```autopilot-patch\s*([\s\S]*?)```/);
  if (!match) throw new Error("No autopilot-patch block found.");
  return JSON.parse(match[1]);
}

function run(command, args) {
  console.log(`$ ${command} ${args.join(" ")}`);
  execFileSync(command, args, { stdio: "inherit" });
}
