import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, KeyRound, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { PasswordGeneratorLayout } from "@/features/password-generator/components/password-generator-layout";
import { ToolHeaderMobile } from "@/features/tools/components/tool-header-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("password-generator");
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
    question: "Is this password generator completely secure?",
    answer: "Yes. This tool uses the Web Crypto API (`window.crypto.getRandomValues`) which provides cryptographically strong pseudo-random numbers, ensuring your passwords are mathematically secure and unpredictable.",
  },
  {
    question: "Are my generated passwords stored anywhere?",
    answer: "No. Your passwords are generated entirely on your own device within your web browser. They are never sent to our servers, logged in a database, or saved anywhere.",
  },
  {
    question: "How long should my password be?",
    answer: "Security experts generally recommend a minimum of 12 to 16 characters for a strong password. For high-security accounts, like banking or email, a longer password (20+ characters) is highly recommended. Our tool allows you to generate passwords up to 128 characters long.",
  },
  {
    question: "Why should I include symbols and numbers?",
    answer: "Including uppercase letters, lowercase letters, numbers, and symbols vastly increases the &apos;entropy&apos; or complexity of your password. This makes it exponentially harder for automated hacking tools to guess your password through brute-force attacks.",
  },
];

export default async function PasswordGeneratorPage() {
  const tool = await getToolBySlug("password-generator");
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
            <KeyRound className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <PasswordGeneratorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to generate a strong password</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Using weak, easily guessable passwords is the number one cause of compromised online accounts. Our free tool helps you create randomized, high-entropy passwords that are impossible to guess.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Choose Password Length:</strong> Use the slider to select a length. We recommend at least 16 characters for strong security.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Select Character Types:</strong> Leave all checkboxes enabled to include uppercase, lowercase, numbers, and symbols. More variety equals a stronger password.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Copy and Save:</strong> Click the copy button to save the password to your clipboard. Make sure to immediately paste it into your secure password manager!</span>
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
              <h2 className="text-lg font-semibold text-foreground">Security metadata</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This is a fully integrated module running client-side for zero-latency generation. Passwords are created using the Web Crypto API directly in your browser. No passwords are ever tracked or sent over the network.
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
