import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Calculator, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { GstCalculatorLayout } from "@/features/gst-calculator/components/gst-calculator-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("gst-calculator");
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
    question: "How do I calculate GST?",
    answer: "To calculate GST, simply multiply the base amount by the GST rate percentage. For example, to calculate 18% GST on ₹1,000, the GST amount is ₹1,000 × 18% = ₹180. The total amount is ₹1,180.",
  },
  {
    question: "What is reverse GST calculation?",
    answer: "Reverse GST calculation (or removing GST) helps you find the original base price when you only have the final price that already includes GST. It's calculated as: Final Price / (1 + (GST Rate / 100)).",
  },
  {
    question: "What are CGST, SGST, and IGST?",
    answer: "CGST (Central GST) and SGST (State GST) are levied on intra-state supplies (within the same state), typically splitting the total GST rate equally. IGST (Integrated GST) is levied on inter-state supplies (between two states) and is equal to the total GST rate.",
  },
  {
    question: "What are the common GST slabs?",
    answer: "In India, the most common standard GST tax slabs are 0%, 5%, 12%, 18%, and 28%. Different products and services fall under different slabs as determined by the GST Council.",
  },
];

export default async function GstCalculatorPage() {
  const tool = await getToolBySlug("gst-calculator");
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
            <Calculator className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <GstCalculatorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to use the GST Calculator</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Our free GST Calculator is a robust tool designed to help small businesses, freelancers, and accountants quickly compute tax components.
                Whether you need to add GST to a base price or reverse-calculate the base price from a total amount, this tool provides instant, accurate results.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Select the Operation:</strong> Choose &quot;Add GST&quot; if you want to apply tax to a net price. Choose &quot;Remove GST&quot; to calculate the pre-tax amount from a final bill.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Enter the Amount:</strong> Input your numerical value into the currency field. The calculator processes amounts instantly as you type.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Select the Tax Slab:</strong> Choose from the standard predefined slabs (0%, 3%, 5%, 12%, 18%, 28%).</span>
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
              <h2 className="text-lg font-semibold text-foreground">Registry metadata</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This is a fully integrated module running client-side for zero-latency generation. Data is processed locally and is never sent to our servers.
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
