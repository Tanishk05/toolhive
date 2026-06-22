import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Percent, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { PercentageCalculatorLayout } from "@/features/percentage-calculator/components/percentage-calculator-layout";
import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("percentage-calculator");
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
    question: "How do I calculate what percentage one number is of another?",
    answer: "To calculate what percentage X is of Y, you divide X by Y, and then multiply the result by 100. For example, to find out what percentage 20 is of 50: (20 / 50) * 100 = 40%.",
  },
  {
    question: "What is the formula for percentage increase?",
    answer: "The formula for percentage increase is: ((New Value - Old Value) / Old Value) * 100. First, find the difference between the two numbers, divide that difference by the original number, and multiply by 100.",
  },
  {
    question: "What is the formula for percentage decrease?",
    answer: "The formula for percentage decrease is: ((Old Value - New Value) / Old Value) * 100. Calculate the difference, divide by the original value, and multiply by 100.",
  },
  {
    question: "How is percentage difference calculated?",
    answer: "Percentage difference is used when both values mean the same kind of thing (like two different heights). The formula is: absolute difference between the values divided by the average of the two values, multiplied by 100.",
  },
  {
    question: "How is percentage change different from percentage difference?",
    answer: "Percentage change calculates the change from an old value to a new value (direction matters). Percentage difference calculates the relative difference between two values where neither is obviously the 'old' or 'new' value (direction doesn't matter).",
  },
  {
    question: "How do I calculate X% of Y?",
    answer: "To calculate a specific percentage of a number, divide the percentage by 100 to get a decimal, then multiply by the number. For example, 15% of 80 is (15 / 100) * 80 = 12.",
  },
  {
    question: "Can I use this calculator for negative numbers?",
    answer: "Yes, our calculator supports negative numbers for finding percentage change and other advanced calculations.",
  },
  {
    question: "Is my data sent to any server?",
    answer: "No, all calculations are performed directly in your browser. No data is sent to our servers, ensuring complete privacy.",
  },
];

export default async function PercentageCalculatorPage() {
  const tool = await getToolBySlug("percentage-calculator");
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

      <section className="mb-2">
        <Card className="overflow-hidden p-4 md:p-6 border-border bg-card">
          <div className={`mb-3 inline-flex rounded-2xl bg-linear-to-br ${tool.accent} p-3 ring-1 ring-border`}>
            <Percent className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <PercentageCalculatorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to use the Percentage Calculator</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Our comprehensive Percentage Calculator helps you solve any percentage-related math problem instantly.
                Whether you&apos;re calculating a discount, determining profit margins, or checking growth rates, this tool has you covered.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Select the Calculation Type:</strong> Choose from &quot;What is X% of Y?&quot;, &quot;X is what % of Y?&quot;, Percentage Increase, Decrease, Change, or Difference.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Enter the Values:</strong> Input your numerical values into the X and Y fields. The calculator processes amounts instantly as you type.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Get Results & Formula:</strong> View the calculated result and the step-by-step formula used to arrive at the answer. Copy the result directly to your clipboard.</span>
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
              <h2 className="text-lg font-semibold text-foreground">Client-side Processing</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This tool runs completely in your browser. Your data is processed locally and is never sent to our servers.
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
