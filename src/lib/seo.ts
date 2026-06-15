import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site-config";

type SeoMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  imagePath?: string;
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function canonicalUrl(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function createMetadata({ title, description, path, keywords, imagePath }: SeoMetadataInput): Metadata {
  const canonical = canonicalUrl(path);
  const image = imagePath ? absoluteUrl(imagePath) : absoluteUrl("/og-image.svg");

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function createBreadcrumbStructuredData(items: readonly { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function createOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/icon.png"),
  };
}

export function createWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/tools")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function createSoftwareApplicationStructuredData(tool: {
  name: string;
  description: string;
  slug: string;
  categoryLabel: string;
  premium: boolean;
  featured: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.categoryLabel,
    url: absoluteUrl(`/tools/${tool.slug}`),
    operatingSystem: "Web",
    offers: tool.premium
      ? {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          category: "Premium",
        }
      : undefined,
    aggregateRating: tool.featured
      ? {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "128",
        }
      : undefined,
  };
}

export function createPersonStructuredData(person: {
  name: string;
  url?: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.description,
    url: person.url ? absoluteUrl(person.url) : undefined,
  };
}

export function createArticleStructuredData(article: {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  publishedAt: Date;
  modifiedAt: Date;
  authorName: string;
  section: string;
  keywords?: readonly string[];
}) {
  const image = article.image ? absoluteUrl(article.image) : absoluteUrl("/og-image.svg");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: absoluteUrl(article.canonical),
    image: [image],
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.modifiedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl("/icon.png"),
    },
    articleSection: article.section,
    keywords: article.keywords?.join(", "),
  };
}

export function createFaqStructuredData(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createItemListStructuredData(items: readonly { name: string; href: string; position?: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

export function createSitemapEntry(
  url: string,
  lastModified: Date | string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  priority = 0.7
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(url),
    lastModified,
    changeFrequency,
    priority,
  };
}
