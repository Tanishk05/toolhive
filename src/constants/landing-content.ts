import { getFeaturedTools, sortTools, toolCategories, toolRegistry } from "@/features/tools/tool-registry";
import { Zap, Smartphone, ShieldCheck, Download, Search, Globe } from "lucide-react";

export const landingContent = {
  hero: {
    title: "Free Online Tools That Actually Save Time",
    description:
      "Generate QR codes, compress images, calculate GST, format JSON, and access dozens of free tools built for developers, creators, students, and businesses.",
    quickSearches: ["QR Code Generator", "JSON Formatter", "SEO Snapshot", "Image Compressor", "Age Calculator"],
  },
  featuredTools: getFeaturedTools().map((tool) => ({
    name: tool.name,
    description: tool.description,
    tags: tool.tags,
    accent: tool.accent,
    slug: tool.slug,
  })),
  popularTools: sortTools(toolRegistry, "popular").slice(0, 8),
  categories: toolCategories.map((category) => ({
    label: category.label,
    description: category.description,
    slug: category.slug,
  })),
  whyChooseUs: [
    {
      title: "Free to Use",
      description: "Access premium-grade utilities without paywalls, restrictive limits, or hidden fees.",
      icon: Zap,
    },
    {
      title: "Fast and Lightweight",
      description: "Our tools load instantly in your browser. No bloated pages or unnecessary scripts.",
      icon: Search,
    },
    {
      title: "Mobile Friendly",
      description: "Designed to work perfectly on any device, whether you're at your desk or on the go.",
      icon: Smartphone,
    },
    {
      title: "Privacy Focused",
      description: "We process most data entirely in your browser. Your files and data remain yours.",
      icon: ShieldCheck,
    },
    {
      title: "No Installation Required",
      description: "No apps to download or extensions to install. Everything runs seamlessly on the web.",
      icon: Download,
    },
    {
      title: "SEO Friendly Resources",
      description: "Access a library of metadata and structured data tools to boost your own rankings.",
      icon: Globe,
    },
  ],
  blogPosts: [
    {
      title: "How to design a utility marketplace that users return to",
      excerpt: "Principles for pairing discovery, trust, and content around tools people actually need.",
      category: "Strategy",
      readTime: "6 min read",
      slug: "designing-utility-marketplace",
    },
    {
      title: "The case for feature-based architecture in fast-moving products",
      excerpt: "Why boundaries matter once you start shipping tools, billing, and analytics in parallel.",
      category: "Engineering",
      readTime: "8 min read",
      slug: "feature-based-architecture",
    },
    {
      title: "What makes a tool page convert without feeling noisy",
      excerpt: "A simple checklist for better structure, lighter motion, and clearer calls to action.",
      category: "Design",
      readTime: "5 min read",
      slug: "tool-page-conversion",
    },
  ],
  faqs: [
    {
      question: "Are the tools completely free to use?",
      answer: "Yes! The core utilities on ToolHive are completely free to use without requiring an account or subscription.",
    },
    {
      question: "Do I need to download or install anything?",
      answer: "No. All ToolHive utilities run directly in your web browser. There are no extensions to install or software to download.",
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. The vast majority of our tools process data locally in your browser (client-side), meaning your sensitive text, images, and files never even touch our servers.",
    },
    {
      question: "Can I use these tools on my phone?",
      answer: "Yes, every tool on our platform is designed mobile-first, ensuring you get the same powerful experience on your phone as you do on a desktop.",
    },
  ],
  footerLinks: {
    product: [
      { label: "Tools", href: "/tools" },
      { label: "Categories", href: "/#categories" },
      { label: "Blog", href: "/blog" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
} as const;
