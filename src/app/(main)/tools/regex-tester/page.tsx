import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Regex, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { RegexTesterLayout } from "@/features/regex-tester/components/regex-tester-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("regex-tester");
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
    question: "What is a Regular Expression (Regex)?",
    answer: "A regular expression is a sequence of characters that specifies a search pattern in text. It's used by developers for string searching, text replacement, and input validation.",
  },
  {
    question: "How does the Regex Tester work?",
    answer: "Enter your regex pattern at the top, select your flags (like 'g' for global or 'i' for case-insensitive), and type or paste text into the Test String area. The tool will instantly highlight matching text.",
  },
  {
    question: "What are Regex flags?",
    answer: "Flags change how the regex engine searches. Common flags include 'g' (global search to find all matches rather than stopping after the first), 'i' (case-insensitive search), and 'm' (multiline search where ^ and $ match start/end of lines).",
  },
  {
    question: "Is my text sent to a server?",
    answer: "No. The Regex Tester executes the JavaScript RegExp engine entirely within your browser. None of the text you paste or type is ever transmitted or logged, guaranteeing total privacy.",
  },
  {
    question: "What if my Regex causes an infinite loop?",
    answer: "Our engine uses standard safety limits and bounds checking on zero-width global matches to prevent your browser from crashing during bad pattern evaluations.",
  },
];

export default async function RegexTesterPage() {
  const tool = await getToolBySlug("regex-tester");
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
            <Regex className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <RegexTesterLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Professional Pattern Validation</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Regular expressions are notoriously difficult to debug. This utility simplifies the process by visually confirming exactly what your regex engine targets.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Live Highlighting:</strong> Stop guessing. See exactly which characters trigger matches immediately as you type your pattern.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Pre-built Templates:</strong> Instantly load robust, battle-tested regex patterns for common use cases like Email, URL, and IPv4 validation.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Integrated Cheat Sheet:</strong> Forget what `\w` or `[^abc]` means? Our integrated side panel keeps the syntax fresh in your mind.</span>
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
              <h2 className="text-lg font-semibold text-foreground">Client-Side Validation Engine</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your regular expressions and test strings are evaluated instantly via your local browser. 100% of the computation is client-side. No API calls are made and no data is tracked.
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
