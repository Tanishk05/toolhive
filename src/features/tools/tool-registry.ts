import {
  QrCode,
  Calculator,
  CalendarHeart,
  ArrowRightLeft,
  Braces,
  Landmark,
  KeyRound,
  Fingerprint,
  Binary,
  ImageMinus,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export type ToolCategorySlug =
  | "productivity"
  | "developer"
  | "business"
  | "content"
  | "analytics"
  | "monetization";

export type ToolSeo = {
  title: string;
  description: string;
  keywords: readonly string[];
  canonical: string;
};

export type ToolRegistryEntry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategorySlug;
  categoryLabel: string;
  categoryDescription: string;
  icon: LucideIcon;
  featured: boolean;
  premium: boolean;
  popularity: number;
  addedAt: string;
  accent: string;
  tags: readonly string[];
  searchTerms: readonly string[];
  summary: string;
  seo: ToolSeo;
};

export type ToolCategoryRegistryEntry = {
  slug: ToolCategorySlug;
  label: string;
  description: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
  };
};

export const toolRegistry: readonly ToolRegistryEntry[] = [
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Generate static QR codes for URLs, WiFi, vCards, and more with live customization and SVG/PDF export.",
    summary: "A robust QR code generator for teams needing instant, print-ready codes.",
    category: "productivity",
    categoryLabel: "Productivity",
    categoryDescription: "Workflow accelerators, repeatable utilities, and personal ops helpers.",
    icon: QrCode,
    featured: true,
    premium: false,
    popularity: 99,
    addedAt: "2026-06-14",
    accent: "from-emerald-400/30 to-blue-400/10",
    tags: ["QR Code", "Generator", "Utility"],
    searchTerms: ["qr", "barcode", "generator", "wifi", "vcard", "url", "scan"],
    seo: {
      title: "QR Code Generator | ToolHive",
      description: "Generate customized QR codes instantly for URLs, WiFi, vCards, and text. Download as PNG, SVG, or PDF.",
      keywords: ["QR code generator", "QR code", "create QR code", "SVG QR code", "ToolHive"],
      canonical: "/tools/qr-code-generator",
    },
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    slug: "gst-calculator",
    description: "Calculate GST amount and total price with reverse GST calculation capabilities.",
    summary: "Instant tool to calculate standard and reverse GST components for billing and accounting.",
    category: "business",
    categoryLabel: "Business",
    categoryDescription: "Pricing, planning, finance, and conversion support tools.",
    icon: Calculator,
    featured: true,
    premium: false,
    popularity: 90,
    addedAt: "2026-06-15",
    accent: "from-blue-500/30 to-indigo-400/10",
    tags: ["GST", "Calculator", "Tax", "Finance"],
    searchTerms: ["tax", "invoice", "gst", "reverse gst", "bill", "accounting"],
    seo: {
      title: "GST Calculator | ToolHive",
      description: "Free online GST Calculator. Easily calculate GST amounts, total price, and perform reverse GST calculations for invoices and billing.",
      keywords: ["GST calculator", "reverse GST calculator", "tax calculator", "Indian GST", "ToolHive"],
      canonical: "/tools/gst-calculator",
    },
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate exact age in years, months, and days from your date of birth.",
    summary: "A simple chronological age calculator providing precise metrics like total days and next birthday countdown.",
    category: "productivity",
    categoryLabel: "Productivity",
    categoryDescription: "Workflow accelerators, repeatable utilities, and personal ops helpers.",
    icon: CalendarHeart,
    featured: false,
    premium: false,
    popularity: 85,
    addedAt: "2026-06-15",
    accent: "from-rose-500/30 to-orange-400/10",
    tags: ["Age", "Calculator", "Date", "Time"],
    searchTerms: ["date of birth", "dob", "how old am i", "age difference", "chronological"],
    seo: {
      title: "Age Calculator | Exact Chronological Age | ToolHive",
      description: "Free online Age Calculator. Calculate your exact age in years, months, and days, along with total days lived and your next birthday.",
      keywords: ["Age calculator", "calculate age", "date of birth calculator", "chronological age", "ToolHive"],
      canonical: "/tools/age-calculator",
    },
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Convert instantly between lengths, weights, temperatures, and more.",
    summary: "A comprehensive unit conversion tool for everyday measurements.",
    category: "productivity",
    categoryLabel: "Productivity",
    categoryDescription: "Workflow accelerators, repeatable utilities, and personal ops helpers.",
    icon: ArrowRightLeft,
    featured: true,
    premium: false,
    popularity: 88,
    addedAt: "2026-06-15",
    accent: "from-cyan-500/30 to-blue-400/10",
    tags: ["Unit", "Converter", "Measurement", "Length", "Weight", "Temperature"],
    searchTerms: ["convert", "measure", "metric", "imperial", "length", "weight", "temperature"],
    seo: {
      title: "Unit Converter | Length, Weight & Temperature | ToolHive",
      description: "Free online Unit Converter. Instantly convert between metric and imperial units for length, weight, temperature, and more.",
      keywords: ["Unit converter", "length converter", "weight converter", "temperature converter", "ToolHive"],
      canonical: "/tools/unit-converter",
    },
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, and minify JSON payloads instantly in your browser.",
    summary: "A robust developer tool to prettify or compress JSON data with instant error validation.",
    category: "developer",
    categoryLabel: "Developer",
    categoryDescription: "Builders, validators, formatters, and API-centric utilities.",
    icon: Braces,
    featured: true,
    premium: false,
    popularity: 92,
    addedAt: "2026-06-15",
    accent: "from-amber-500/30 to-orange-400/10",
    tags: ["JSON", "Formatter", "Validator", "Minifier", "Developer"],
    searchTerms: ["json", "format", "beautify", "minify", "validate", "lint"],
    seo: {
      title: "JSON Formatter & Validator | ToolHive",
      description: "Free online JSON Formatter and Validator. Prettify, minify, and validate your JSON data instantly in your browser. No data sent to servers.",
      keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "JSON minifier", "developer tools", "ToolHive"],
      canonical: "/tools/json-formatter",
    },
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    slug: "emi-calculator",
    description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
    summary: "Instant loan calculator with visual breakdowns of principal and interest.",
    category: "business",
    categoryLabel: "Business",
    categoryDescription: "Pricing, planning, finance, and conversion support tools.",
    icon: Landmark,
    featured: true,
    premium: false,
    popularity: 91,
    addedAt: "2026-06-15",
    accent: "from-blue-500/30 to-violet-400/10",
    tags: ["EMI", "Calculator", "Loan", "Finance", "Mortgage"],
    searchTerms: ["emi", "loan", "mortgage", "interest", "finance", "payment"],
    seo: {
      title: "EMI Calculator | Home & Car Loan Calculator | ToolHive",
      description: "Free online EMI Calculator. Calculate Equated Monthly Installments for home, car, and personal loans instantly with a visual chart breakdown.",
      keywords: ["EMI calculator", "loan calculator", "mortgage calculator", "home loan calculator", "ToolHive"],
      canonical: "/tools/emi-calculator",
    },
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    description: "Generate cryptographically secure passwords instantly in your browser.",
    summary: "Create strong, random passwords with customizable parameters to keep your accounts safe.",
    category: "developer",
    categoryLabel: "Security",
    categoryDescription: "Tools for encryption, generation, and data safety.",
    icon: KeyRound,
    featured: true,
    premium: false,
    popularity: 90,
    addedAt: "2026-06-15",
    accent: "from-emerald-500/30 to-teal-400/10",
    tags: ["Password", "Generator", "Security", "Crypto", "Random"],
    searchTerms: ["password", "generator", "secure", "random", "passcode", "key"],
    seo: {
      title: "Secure Password Generator | ToolHive",
      description: "Free online secure Password Generator. Create cryptographically strong passwords instantly in your browser. 100% private and offline capable.",
      keywords: ["Password generator", "secure password", "random password generator", "strong password", "ToolHive"],
      canonical: "/tools/password-generator",
    },
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate cryptographically secure Version 4 UUIDs instantly in your browser.",
    summary: "Create multiple universally unique identifiers (v4) with custom formatting.",
    category: "developer",
    categoryLabel: "Developer",
    categoryDescription: "Builders, validators, formatters, and API-centric utilities.",
    icon: Fingerprint,
    featured: true,
    premium: false,
    popularity: 87,
    addedAt: "2026-06-15",
    accent: "from-purple-500/30 to-pink-400/10",
    tags: ["UUID", "Generator", "Developer", "Crypto", "GUID"],
    searchTerms: ["uuid", "guid", "generator", "unique", "identifier", "v4"],
    seo: {
      title: "UUID/GUID Generator (v4) | ToolHive",
      description: "Free online UUID Generator. Generate up to 500 cryptographically secure Version 4 UUIDs (GUIDs) instantly in your browser.",
      keywords: ["UUID generator", "GUID generator", "v4 UUID", "random UUID", "ToolHive"],
      canonical: "/tools/uuid-generator",
    },
  },
  {
    id: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    slug: "base64-encoder-decoder",
    description: "Easily encode text to Base64 or decode Base64 back to text with full UTF-8 support.",
    summary: "Fast, privacy-friendly Base64 encoding and decoding tool with emoji support.",
    category: "developer",
    categoryLabel: "Developer",
    categoryDescription: "Builders, validators, formatters, and API-centric utilities.",
    icon: Binary,
    featured: false,
    premium: false,
    popularity: 88,
    addedAt: "2026-06-15",
    accent: "from-blue-500/30 to-indigo-400/10",
    tags: ["Base64", "Encode", "Decode", "Developer", "Converter"],
    searchTerms: ["base64", "encoder", "decoder", "btoa", "atob", "convert", "format"],
    seo: {
      title: "Base64 Encoder and Decoder | ToolHive",
      description: "Free online Base64 Encoder and Decoder. Safely convert text, emojis, and code to and from Base64 formats with full UTF-8 support.",
      keywords: ["Base64 encoder", "Base64 decoder", "decode Base64", "encode Base64", "ToolHive"],
      canonical: "/tools/base64-encoder-decoder",
    },
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    description: "Compress JPEG, PNG, and WebP images instantly in your browser without losing quality.",
    summary: "Fast, offline-capable image optimization tool for perfect web performance.",
    category: "content",
    categoryLabel: "Media",
    categoryDescription: "Video, audio, and image manipulation tools.",
    icon: ImageMinus,
    featured: true,
    premium: false,
    popularity: 94,
    addedAt: "2026-06-15",
    accent: "from-orange-500/30 to-amber-400/10",
    tags: ["Image", "Compressor", "Optimize", "WebP", "JPEG", "PNG", "Media"],
    searchTerms: ["image", "compress", "optimize", "reduce", "size", "picture", "photo"],
    seo: {
      title: "Free Online Image Compressor | ToolHive",
      description: "Compress and optimize images (JPEG, PNG, WebP) instantly within your browser. 100% private, no server uploads, offline capable.",
      keywords: ["Image compressor", "reduce image size", "optimize images", "photo compressor", "ToolHive"],
      canonical: "/tools/image-compressor",
    },
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode JSON Web Tokens (JWT) instantly to view header, payload, and signature data.",
    summary: "Fast, offline-capable JWT parsing and debugging tool for developers.",
    category: "developer",
    categoryLabel: "Developer",
    categoryDescription: "Builders, validators, formatters, and API-centric utilities.",
    icon: ShieldAlert,
    featured: false,
    premium: false,
    popularity: 91,
    addedAt: "2026-06-15",
    accent: "from-red-500/30 to-rose-400/10",
    tags: ["JWT", "Decoder", "Auth", "Token", "Developer", "JSON"],
    searchTerms: ["jwt", "decode", "token", "json web token", "auth", "parser", "viewer"],
    seo: {
      title: "JWT Decoder & Parser | ToolHive",
      description: "Free online JWT Decoder. Easily parse and decode JSON Web Tokens into readable header and payload components right in your browser.",
      keywords: ["JWT decoder", "parse JWT", "decode JSON web token", "JWT viewer", "ToolHive"],
      canonical: "/tools/jwt-decoder",
    },
  },
] as const;


export const toolCategories: readonly ToolCategoryRegistryEntry[] = [
  {
    slug: "productivity",
    label: "Productivity",
    description: "Workflow accelerators, repeatable utilities, and personal ops helpers.",
    seo: {
      title: "Productivity Tools | ToolHive",
      description: "Workflow accelerators and everyday productivity utilities.",
      canonical: "/categories/productivity",
    },
  },
  {
    slug: "developer",
    label: "Developer",
    description: "Builders, validators, formatters, and API-centric utilities.",
    seo: {
      title: "Developer Tools | ToolHive",
      description: "Developer utilities for formatting, validation, and API workflows.",
      canonical: "/categories/developer",
    },
  },
  {
    slug: "business",
    label: "Business",
    description: "Pricing, planning, finance, and conversion support tools.",
    seo: {
      title: "Business Tools | ToolHive",
      description: "Business utilities for planning, pricing, and operations.",
      canonical: "/categories/business",
    },
  },
  {
    slug: "content",
    label: "Content",
    description: "Publishing aids, editorial workflows, and distribution primitives.",
    seo: {
      title: "Content Tools | ToolHive",
      description: "Editorial and publishing utilities for content teams.",
      canonical: "/categories/content",
    },
  },
  {
    slug: "analytics",
    label: "Analytics",
    description: "Event capture, dashboards, and product intelligence surfaces.",
    seo: {
      title: "Analytics Tools | ToolHive",
      description: "Event, telemetry, and product intelligence utilities.",
      canonical: "/categories/analytics",
    },
  },
  {
    slug: "monetization",
    label: "Monetization",
    description: "Subscriptions, payments, and premium access management.",
    seo: {
      title: "Monetization Tools | ToolHive",
      description: "Tools for subscriptions, access control, and payments.",
      canonical: "/categories/monetization",
    },
  },
] as const;

export function getToolBySlug(slug: string) {
  return toolRegistry.find((tool) => tool.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return toolCategories.find((category) => category.slug === slug);
}

export function getFeaturedTools() {
  return toolRegistry.filter((tool) => tool.featured);
}

export function getRecentlyAddedTools(limit = 3) {
  return [...toolRegistry]
    .sort((left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime())
    .slice(0, limit);
}

export function sortTools<TTool extends Pick<ToolRegistryEntry, "name" | "popularity" | "addedAt">>(
  tools: readonly TTool[],
  sortBy: "popular" | "recent" | "alphabetical" = "popular"
) {
  const sorted = [...tools];

  if (sortBy === "popular") {
    return sorted.sort((left, right) => right.popularity - left.popularity || right.name.localeCompare(left.name));
  }

  if (sortBy === "recent") {
    return sorted.sort((left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime());
  }

  return sorted.sort((left, right) => left.name.localeCompare(right.name));
}

export function getToolsByCategory(categorySlug: ToolCategorySlug) {
  return toolRegistry.filter((tool) => tool.category === categorySlug);
}

export function searchTools(query: string, options?: { category?: ToolCategorySlug; featuredOnly?: boolean; premiumOnly?: boolean }) {
  const normalizedQuery = query.trim().toLowerCase();

  return toolRegistry.filter((tool) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [tool.name, tool.slug, tool.description, tool.summary, ...tool.tags, ...tool.searchTerms].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    const matchesCategory = !options?.category || tool.category === options.category;
    const matchesFeatured = !options?.featuredOnly || tool.featured;
    const matchesPremium = !options?.premiumOnly || tool.premium;

    return matchesQuery && matchesCategory && matchesFeatured && matchesPremium;
  });
}

export function searchCategories(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return toolCategories.filter((category) => {
    if (normalizedQuery.length === 0) {
      return true;
    }

    return [category.label, category.slug, category.description].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function buildToolBreadcrumbs(tool: ToolRegistryEntry) {
  return [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.categoryLabel, href: `/categories/${tool.category}` },
    { label: tool.name, href: `/tools/${tool.slug}` },
  ] as const;
}

export function buildCategoryBreadcrumbs(category: ToolCategoryRegistryEntry) {
  return [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: category.label, href: `/categories/${category.slug}` },
  ] as const;
}

export function getRecommendedTools(currentToolSlug: string, limit = 3) {
  const currentTool = getToolBySlug(currentToolSlug);
  if (!currentTool) return [];

  // 1. Get tools in the same category (excluding current)
  const sameCategory = toolRegistry.filter(
    (tool) => tool.category === currentTool.category && tool.slug !== currentToolSlug
  );

  // 2. Sort them by popularity
  const sortedCategory = sortTools(sameCategory, "popular");

  // 3. If we don't have enough, fill with other popular tools
  if (sortedCategory.length < limit) {
    const needed = limit - sortedCategory.length;
    const existingSlugs = new Set([currentToolSlug, ...sortedCategory.map((t) => t.slug)]);
    
    const otherPopular = sortTools(
      toolRegistry.filter((tool) => !existingSlugs.has(tool.slug)),
      "popular"
    ).slice(0, needed);
    
    return [...sortedCategory, ...otherPopular];
  }

  return sortedCategory.slice(0, limit);
}
