import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Type, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { WordCounterLayout } from "@/features/word-counter/components/word-counter-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("word-counter");
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
    question: "How does the word counter work?",
    answer: "Our word counter analyzes your text in real-time right in your browser. As you type or paste your text, it automatically calculates word count, characters, sentences, paragraphs, reading time, and keyword density without sending data to any server.",
  },
  {
    question: "How is reading time calculated?",
    answer: "Reading time is calculated based on the average adult reading speed of 225 words per minute. We divide your total word count by 225 to get an accurate estimate of how long it will take someone to read your text.",
  },
  {
    question: "How is speaking time calculated?",
    answer: "Speaking time assumes an average presentation or speaking speed of 130 words per minute. This is slightly slower than reading speed to account for pauses, emphasis, and clear articulation.",
  },
  {
    question: "What is keyword density analysis?",
    answer: "Keyword density analysis scans your text to find the most frequently used words, excluding common stop words like 'the', 'and', 'is'. It shows you how many times each word appears and what percentage of the total text it represents, which is highly useful for SEO optimization.",
  },
  {
    question: "How do you calculate reading level?",
    answer: "We use a variation of the Flesch-Kincaid Grade Level formula, which looks at the total number of words, sentences, and syllables. It estimates the US school grade level required to understand the text.",
  },
  {
    question: "Does the character count include spaces?",
    answer: "We provide two character counts: one that includes all characters and spaces, and another that counts characters without spaces. Both are useful depending on the platform limits you are targeting.",
  },
  {
    question: "Is my text saved or sent to a server?",
    answer: "No. The ToolHive Word Counter is a privacy-first tool. All calculations and text analysis happen locally in your web browser. Your text is never sent to our servers or stored anywhere.",
  },
];

export default async function WordCounterPage() {
  const tool = await getToolBySlug("word-counter");
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
            <Type className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <WordCounterLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Advanced Text Analysis Features</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Whether you&apos;re a student writing an essay, an SEO professional optimizing content, or a speaker preparing for a presentation, our tool provides all the metrics you need:
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Real-time Word & Character Limits:</strong> Instantly check your counts against limits for Twitter, SMS, essays, or meta descriptions.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Speaking & Reading Times:</strong> Perfect for scriptwriters and content creators wanting to know exactly how long their content takes to consume.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Keyword Density:</strong> Optimize your blog posts by identifying your most used words and avoiding keyword stuffing.</span>
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
              <h2 className="text-lg font-semibold text-foreground">100% Privacy Preserved</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This tool processes your text locally in your browser. We never transmit or store your writing, ensuring complete confidentiality for your drafts and documents.
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
