import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, Landmark, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { EmiCalculatorLayout } from "@/features/emi-calculator/components/emi-calculator-layout";
import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("emi-calculator");
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
    question: "What is an EMI?",
    answer: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.",
  },
  {
    question: "How is the EMI calculated?",
    answer: "The mathematical formula for calculating EMI is: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P stands for the loan amount or principal, R is the interest rate per month, and N is the number of monthly installments.",
  },
  {
    question: "Can I use this for Home Loans and Car Loans?",
    answer: "Yes! Because the standard EMI formula applies to almost all amortizing loans, you can use this calculator for Home Loans, Car Loans, Personal Loans, or Education Loans.",
  },
  {
    question: "Is this calculator private?",
    answer: "Absolutely. The calculator runs entirely within your web browser (client-side). The loan amounts and rates you enter are never transmitted to our servers or saved anywhere.",
  },
];

export default async function EmiCalculatorPage() {
  const tool = await getToolBySlug("emi-calculator");
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
            <Landmark className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <EmiCalculatorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to use the EMI Calculator</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Whether you are planning to buy a new house, a car, or taking a personal loan, calculating your monthly financial commitment is crucial. Our EMI calculator helps you understand exactly how much you will pay each month, and how much interest you will pay over the lifetime of the loan.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Set the Loan Amount:</strong> Use the slider or type directly into the input field to set your total principal amount.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Adjust Interest Rate:</strong> Enter the Annual Percentage Rate (APR) offered by your bank.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Select Tenure:</strong> Input the duration of the loan. You can toggle between &quot;Years&quot; and &quot;Months&quot; depending on how your loan is structured.</span>
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
                This is a fully integrated module running client-side for zero-latency execution. Your financial data is processed locally in JavaScript and is never transmitted over the network.
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
