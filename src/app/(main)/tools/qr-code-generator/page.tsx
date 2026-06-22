import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, QrCode, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createMetadata, createSoftwareApplicationStructuredData, createFaqStructuredData } from "@/lib/seo";
import { QrGeneratorLayout } from "@/features/qr-code/components/qr-generator-layout";
import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("qr-code-generator");
  if (!tool) return {};

  return createMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    path: tool.seo.canonical,
    keywords: tool.seo.keywords,
  });
}

const faqs = [
  {
    question: "Is this QR Code Generator free to use?",
    answer: "Yes, our QR Code Generator is completely free to use. There are no limits on the number of QR codes you can generate.",
  },
  {
    question: "Do the QR codes expire?",
    answer: "No, the generated QR codes are static and will never expire. They will work as long as the URL or data they point to remains active.",
  },
  {
    question: "Can I customize the color of my QR code?",
    answer: "Yes, our tool allows you to customize both the foreground and background colors to match your brand's style.",
  },
  {
    question: "Are the QR codes private?",
    answer: "Absolutely. The QR codes are generated entirely within your browser. We do not store or track the data you encode.",
  },
];

export default async function QrCodeGeneratorPage() {
  const tool = await getToolBySlug("qr-code-generator");
  if (!tool) return null;

  const breadcrumbs = buildToolBreadcrumbs(tool);
  const softwareApplication = createSoftwareApplicationStructuredData(tool);
  const faqSchema = createFaqStructuredData(faqs);

  return (
    <div className="flex flex-col gap-8 py-6">
      <ToolAnalytics tool_slug={tool.slug} tool_name={tool.name} tool_category={tool.category} />
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={softwareApplication} />
      <JsonLd data={faqSchema} />
      <ToolHeaderMobile toolName={tool.name} toolSlug={tool.slug} iconName={tool.icon || "tool"} />
      <div className="hidden md:block">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Redesigned Compact Hero Section */}
      <section className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} shadow-sm ring-1 ring-border`}>
            <QrCode className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary mb-1">{tool.categoryLabel}</p>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">{tool.name}</h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-[1.7]">{tool.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">Share</Button>
          <FavoriteButton toolSlug={tool.slug} />
        </div>
      </section>

      {/* Interactive Tool Section */}
      <section>
        <QrGeneratorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">How to use the QR Code Generator</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-[1.7]">
              <p>
                Our Free Online QR Code Generator makes it easy to create high-quality, custom QR codes for your business, website, or personal use.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong className="text-foreground">Enter your Content:</strong> Type or paste the URL, text, or data you want to encode into the QR code.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong className="text-foreground">Customize the Design (Optional):</strong> Change the foreground and background colors to fit your brand identity. Adjust the size and error correction level if needed.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong className="text-foreground">Download:</strong> Click the download button to save your QR code as a high-resolution PNG or SVG file, ready for printing or sharing online.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Frequently Asked Questions</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {faqs.map((faq, index) => (
                <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between py-6 text-base font-medium text-foreground">
                    {faq.question}
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-muted transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </summary>
                  <div className="pb-6 pr-12 text-sm text-muted-foreground leading-7">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer metadata similar to dynamic shell */}
      <section className="mt-8">
        <Card className="space-y-6 p-6">
          <div className="flex items-start gap-3">
            <BadgeInfo className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Registry metadata</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This is a fully integrated module running client-side for zero-latency generation.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button asChild>
              <Link href={`/categories/${tool.category}`}>
                Browse category <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tools">Back to tools</Link>
            </Button>
            <FavoriteButton toolSlug={tool.slug} />
          </div>
        </Card>
      </section>

      <ToolRecommendations currentToolSlug={tool.slug} />
    </div>
  );
}
