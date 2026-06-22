import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, LetterText, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { TextCaseConverterLayout } from "@/features/text-case-converter/components/text-case-converter-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("text-case-converter");
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
    question: "What text cases are supported?",
    answer: "Our text case converter supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and InVeRsE cAsE.",
  },
  {
    question: "What is camelCase?",
    answer: "camelCase is a naming convention where the first letter of each word is capitalized except for the first word, and there are no spaces. Example: 'thisIsCamelCase'. It is widely used in programming.",
  },
  {
    question: "What is snake_case?",
    answer: "snake_case replaces all spaces with underscores and converts all letters to lowercase. Example: 'this_is_snake_case'. It is commonly used in file naming and Python programming.",
  },
  {
    question: "What is kebab-case?",
    answer: "kebab-case replaces spaces with hyphens (dashes) and converts letters to lowercase. Example: 'this-is-kebab-case'. It is the standard format for URLs and CSS class names.",
  },
  {
    question: "What is PascalCase?",
    answer: "PascalCase is similar to camelCase, but the first letter of the first word is also capitalized. Example: 'ThisIsPascalCase'. It is often used for naming classes in object-oriented programming.",
  },
  {
    question: "Are there any limits on the text length?",
    answer: "Since the conversion happens entirely within your browser, there is practically no limit to the length of text you can convert, other than what your device's memory can handle.",
  },
  {
    question: "Is my text data secure?",
    answer: "Yes, 100%. The text formatting is executed locally on your device via JavaScript. Your text is never transmitted to any external servers.",
  },
];

export default async function TextCaseConverterPage() {
  const tool = await getToolBySlug("text-case-converter");
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
            <LetterText className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <TextCaseConverterLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Effortless Text Formatting</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Our Text Case Converter is the easiest way to reformat text instantly. Whether you accidentally left caps lock on, or you are a developer converting strings into variables, this tool saves you time.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Developers:</strong> Instantly convert plain text into camelCase, PascalCase, snake_case, or kebab-case for seamless coding.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Writers & Editors:</strong> Use Title Case for perfect headlines and book titles, or Sentence case to clean up messy drafts.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Social Media:</strong> Use UPPERCASE to emphasize statements or InVeRsE cAsE for meme text.</span>
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
