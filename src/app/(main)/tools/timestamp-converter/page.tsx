import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Clock, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { TimestampConverterLayout } from "@/features/timestamp-converter/components/timestamp-converter-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("timestamp-converter");
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
    question: "What is a Unix Timestamp?",
    answer: "A Unix Timestamp (or Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, minus leap seconds. The Unix epoch is 00:00:00 UTC on 1 January 1970.",
  },
  {
    question: "How do I convert a date to a Unix Timestamp?",
    answer: "Using our tool, select the 'Date to Timestamp' tab. Choose your local date and time from the input calendar. The tool will instantly generate the corresponding Unix timestamp in both seconds and milliseconds.",
  },
  {
    question: "What is the Year 2038 Problem?",
    answer: "The Year 2038 problem is a computing issue where 32-bit signed integers will overflow when representing Unix time. This will happen on January 19, 2038, at 03:14:07 UTC. Modern 64-bit systems have resolved this issue, pushing the overflow billions of years into the future.",
  },
  {
    question: "Does this tool support both seconds and milliseconds?",
    answer: "Yes! Our timestamp converter automatically detects whether your input is in seconds or milliseconds based on its length and calculates the correct date. It also provides both formats when converting from a date.",
  },
  {
    question: "How does local timezone conversion work?",
    answer: "The tool uses your device's browser to determine your local timezone. When you convert a timestamp, it will display the time in both absolute UTC and your localized timezone.",
  },
];

export default async function TimestampConverterPage() {
  const tool = await getToolBySlug("timestamp-converter");
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

      <section className="mb-4">
        <Card className="overflow-hidden p-8 border-border bg-card">
          <div className={`mb-6 inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-border`}>
            <Clock className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <TimestampConverterLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Unix Epoch & Time Conversion</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Working with dates across different systems and timezones can be frustrating. Unix timestamps provide a single, unified number that represents an absolute point in time regardless of where you are on Earth.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Real-time Generation:</strong> Need the current timestamp right now? Our live clock updates every second. Copy it with one click.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Smart Detection:</strong> Enter 10 digits for seconds or 13 digits for milliseconds. The converter automatically understands the format and outputs the correct date.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Multiple Formats:</strong> When converting to a date, get the result in GMT/UTC, your local timezone, and strict ISO 8601 formatting instantly.</span>
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
              <h2 className="text-lg font-semibold text-foreground">Client-Side Processing</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                All time conversions happen locally in your web browser. No data is sent to our servers, ensuring lightning-fast conversions and complete privacy.
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
