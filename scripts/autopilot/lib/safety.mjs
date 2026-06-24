import fs from "node:fs";
import path from "node:path";

const allowedPathPrefixes = [
  "docs/",
  "src/constants/",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/constants/site-config.ts",
];

const blockedPatterns = [
  "DATABASE_URL",
  "CLERK_SECRET",
  "OPENAI_API_KEY",
  "RESEND_API_KEY",
  "private_key",
  "BEGIN RSA",
  "BEGIN OPENSSH",
];

export function validatePatchSet(patches) {
  if (!Array.isArray(patches) || patches.length === 0) {
    throw new Error("Patch set must be a non-empty array.");
  }

  if (patches.length > 5) {
    throw new Error("Refusing to apply more than 5 low-risk patches at once.");
  }

  for (const patch of patches) {
    validatePatch(patch);
  }
}

function validatePatch(patch) {
  if (!patch || typeof patch !== "object") throw new Error("Invalid patch object.");
  if (patch.type !== "replace") throw new Error("Only exact string replacement patches are supported.");
  if (!patch.path || !patch.find || typeof patch.replace !== "string") {
    throw new Error("Patch requires path, find, and replace.");
  }

  const normalized = patch.path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.includes("..")) throw new Error(`Unsafe path: ${patch.path}`);
  if (!allowedPathPrefixes.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error(`Path is not allowlisted for autonomous PRs: ${normalized}`);
  }
  if (blockedPatterns.some((pattern) => patch.replace.includes(pattern))) {
    throw new Error(`Patch appears to contain sensitive content: ${normalized}`);
  }

  const absolutePath = path.resolve(process.cwd(), normalized);
  if (!fs.existsSync(absolutePath)) throw new Error(`Patch target does not exist: ${normalized}`);

  const current = fs.readFileSync(absolutePath, "utf8");
  if (!current.includes(patch.find)) throw new Error(`Find text not present in ${normalized}`);

  const changedLines = Math.max(patch.find.split("\n").length, patch.replace.split("\n").length);
  if (changedLines > 30) throw new Error(`Patch changes too many lines for low-risk automation: ${normalized}`);
}

export function applyPatchSet(patches) {
  validatePatchSet(patches);

  for (const patch of patches) {
    const normalized = patch.path.replace(/\\/g, "/").replace(/^\/+/, "");
    const absolutePath = path.resolve(process.cwd(), normalized);
    const current = fs.readFileSync(absolutePath, "utf8");
    fs.writeFileSync(absolutePath, current.replace(patch.find, patch.replace));
  }
}
