import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { getLandingContent } from "@/constants/landing-content";
import { JsonLd } from "@/components/seo/json-ld";
import { seoFaqItems } from "@/constants/seo-content";
import {
  createFaqStructuredData,
  createItemListStructuredData,
  createMetadata,
} from "@/lib/seo";
import { getFeaturedTools } from "@/features/tools/tool-registry";

export const metadata: Metadata = createMetadata({
  title: "ToolHive | Free Online Tools That Actually Save Time",
  description:
    "Generate QR codes, compress images, calculate GST, format JSON, and access dozens of free tools built for developers, creators, students, and businesses.",
  path: "/",
  keywords: ["ToolHive", "free online tools", "utilities", "developer tools", "generators"],
});

export default async function Home() {
  const featuredTools = (await getFeaturedTools()).slice(0, 6);

  return (
    <>
      <JsonLd data={createFaqStructuredData(seoFaqItems)} />
      <JsonLd
        data={createItemListStructuredData(
          featuredTools.map((tool, index) => ({ name: tool.name, href: `/tools/${tool.slug}`, position: index + 1 }))
        )}
      />
      <LandingPage content={await getLandingContent()} />
    </>
  );
}
