export const designTokens = {
  colors: [
    { name: "background", cssVar: "--background", usage: "App shell background" },
    { name: "foreground", cssVar: "--foreground", usage: "Primary text color" },
    { name: "card", cssVar: "--card", usage: "Primary elevated surface" },
    { name: "muted", cssVar: "--muted", usage: "Subtle surface" },
    { name: "primary", cssVar: "--primary", usage: "Primary action color" },
    { name: "ring", cssVar: "--ring", usage: "Focus ring and outlines" },
  ],
  radii: [{ name: "radius", cssVar: "--radius", usage: "Base radius for cards and panels" }],
  principles: ["Dark mode first", "CVA variants", "Accessible focus states", "Type-safe props"],
} as const;