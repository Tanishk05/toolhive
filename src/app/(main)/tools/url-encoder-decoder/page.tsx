import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Link2, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { UrlEncoderDecoderLayout } from "@/features/url-encoder-decoder/components/url-encoder-decoder-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("url-encoder-decoder");
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
    question: "What is URL Encoding?",
    answer: "URL Encoding (or Percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). It replaces unsafe characters with a '%' followed by two hexadecimal digits that represent the character's ASCII value.",
  },
  {
    question: "Why do URLs need to be encoded?",
    answer: "URLs must be transmitted over the Internet using the standard ASCII character set. Any characters outside this set (like spaces, emojis, or special symbols like & and ?) must be encoded so servers and browsers can process them correctly without misinterpreting the URL structure.",
  },
  {
    question: "What does this tool do?",
    answer: "Our tool allows you to instantly convert plain text into a URL-safe format (Encoding), or convert a messy, percent-encoded string back into readable human text (Decoding).",
  },
  {
    question: "Is this tool secure for sensitive tokens?",
    answer: "Yes, absolutely. The encoding and decoding processes happen entirely in your local browser using Javascript. Your text is never transmitted, stored, or seen by our servers.",
  },
  {
    question: "Does it support UTF-8 characters?",
    answer: "Yes. Our tool properly handles modern UTF-8 characters, meaning you can safely encode and decode emojis and non-Latin alphabets.",
  },
];

export default async function UrlEncoderDecoderPage() {
  const tool = await getToolBySlug("url-encoder-decoder");
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
      <Breadcrumbs items={breadcrumbs} />

      <section className="mb-2">
        <Card className="overflow-hidden p-4 md:p-6 border-border bg-card">
          <div className={`mb-3 inline-flex rounded-2xl bg-linear-to-br ${tool.accent} p-3 ring-1 ring-border`}>
            <Link2 className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <UrlEncoderDecoderLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Professional URI Conversion</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Developers often need to safely embed data into URLs, such as query parameters or path variables. Our URL Encoder & Decoder makes this process instant and secure.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Real-time Engine:</strong> No need to click 'submit'. Your text is converted instantly as you type.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Auto-Detection:</strong> Paste a string, and the tool intelligently attempts to detect if it needs encoding or decoding.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Syntax Highlighting:</strong> Decoded URLs are automatically parsed and color-coded, making it easy to identify domains, paths, and query parameters at a glance.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Frequently Asked Questions</h2>
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

      <section className="mt-8">
        <Card className="space-y-6 p-6">
          <div className="flex items-start gap-3">
            <BadgeInfo className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">100% Client-Side Privacy</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                We understand that URLs often contain sensitive tokens, API keys, or personal data. This tool processes all conversions locally in your browser. Nothing is ever tracked or uploaded to our servers.
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
