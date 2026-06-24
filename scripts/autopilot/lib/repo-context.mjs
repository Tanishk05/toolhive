import fs from "node:fs";
import path from "node:path";

export function readIfExists(relativePath) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "";
}

export function listRoutes() {
  const appDir = path.resolve(process.cwd(), "src/app");
  if (!fs.existsSync(appDir)) return [];

  const routes = [];
  walk(appDir, (file) => {
    if (!file.endsWith("page.tsx") && !file.endsWith("route.ts")) return;
    routes.push(path.relative(appDir, file).replace(/\\/g, "/"));
  });
  return routes.sort();
}

export function getRepoSnapshot() {
  return {
    packageJson: readIfExists("package.json"),
    schema: readIfExists("prisma/schema.prisma"),
    siteConfig: readIfExists("src/constants/site-config.ts"),
    sitemap: readIfExists("src/app/sitemap.ts"),
    robots: readIfExists("src/app/robots.ts"),
    routes: listRoutes(),
  };
}

function walk(dir, visitor) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visitor);
    else visitor(full);
  }
}
