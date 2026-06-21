import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Fingerprint, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { UuidGeneratorLayout } from "@/features/uuid-generator/components/uuid-generator-layout";
import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("uuid-generator");
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
    question: "What is a UUID?",
    answer: "A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. When generated according to the standard methods, UUIDs are, for practical purposes, unique. Their uniqueness does not depend on a central registration authority.",
  },
  {
    question: "What is a Version 4 UUID?",
    answer: "A Version 4 UUID is generated using completely random numbers. The Web Crypto API used by this tool ensures that the random numbers are cryptographically secure, meaning the probability of a collision (generating the same UUID twice) is infinitesimally small.",
  },
  {
    question: "Are my UUIDs generated securely?",
    answer: "Yes! Your UUIDs are generated entirely within your browser utilizing the native `window.crypto.randomUUID()` method. No network requests are made, and your UUIDs are never tracked, logged, or sent to a server.",
  },
  {
    question: "What is the difference between UUID and GUID?",
    answer: "There is practically no difference. GUID (Globally Unique Identifier) is simply Microsoft's implementation and terminology for the UUID standard. Our generated identifiers are fully compatible with systems expecting either UUIDs or GUIDs.",
  },
];

export default async function UuidGeneratorPage() {
  const tool = await getToolBySlug("uuid-generator");
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

      <section className="mb-4">
        <Card className="overflow-hidden p-8 border-border bg-card">
          <div className={`mb-6 inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-border`}>
            <Fingerprint className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <UuidGeneratorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to use the UUID Generator</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Developers often need bulk UUIDs for seeding databases, testing APIs, or creating unique mock data. Our generator provides a fast, client-side solution that scales instantly up to 500 records at a time.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Set the Quantity:</strong> Use the slider or the number input to specify how many UUIDs you need generated (maximum of 500 per batch).</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Adjust Formatting:</strong> Toggle the formatting checkboxes if your system requires uppercase letters or no hyphens (e.g. standard 32-character hex strings).</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Copy the Batch:</strong> Click &quot;Copy All&quot; in the corner of the output window to instantly copy the entire list separated by line breaks.</span>
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
              <h2 className="text-lg font-semibold text-foreground">API transparency</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This tool utilizes your browser&apos;s native Web Crypto API (`window.crypto.randomUUID()`) to generate high-performance, collision-resistant UUIDs locally.
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
