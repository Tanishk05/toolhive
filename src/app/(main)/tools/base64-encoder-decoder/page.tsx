import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Binary, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { Base64Layout } from "@/features/base64/components/base64-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("base64-encoder-decoder");
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
    question: "What is Base64 encoding?",
    answer: "Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. It is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.",
  },
  {
    question: "Is this tool safe for sensitive data?",
    answer: "Yes! Your data is never sent to our servers. The encoding and decoding happens entirely inside your browser using JavaScript. This tool is completely offline-capable and highly secure for sensitive strings.",
  },
  {
    question: "Does this support emojis and special characters?",
    answer: "Absolutely. Standard Base64 functions often break when dealing with UTF-8 characters like emojis or international alphabets. Our tool uses modern `TextEncoder` and `TextDecoder` APIs to ensure 100% accurate, lossless conversions for any character.",
  },
  {
    question: "Is Base64 an encryption method?",
    answer: "No. Base64 is an encoding method, not an encryption method. It provides absolutely no cryptographic security and is easily reversible. Do not use Base64 to hide or secure passwords or sensitive information.",
  },
];

export default async function Base64EncoderDecoderPage() {
  const tool = await getToolBySlug("base64-encoder-decoder");
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
            <Binary className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <Base64Layout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to use the Base64 Converter</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Developers often need to encode strings into Base64 for data URIs, basic authentication headers, or safe JSON transmission. Our real-time converter makes this effortless.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Select your Mode:</strong> Click the toggle switch above the input box to choose between Encoding (Text to Base64) or Decoding (Base64 to Text).</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Enter your Data:</strong> Paste your source text or Base64 string into the input box. The conversion happens instantly as you type.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Copy the Result:</strong> If you are decoding an invalid string, an error banner will let you know. Otherwise, click &quot;Copy&quot; to grab the output.</span>
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
                This tool utilizes your browser&apos;s native `btoa` and `atob` APIs wrapped in modern `TextEncoder` and `TextDecoder` streams to guarantee accurate UTF-8 parsing completely offline.
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
