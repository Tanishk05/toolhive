import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, ShieldAlert, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { JwtDecoderLayout } from "@/features/jwt-decoder/components/jwt-decoder-layout";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug("jwt-decoder");
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
    question: "What is a JSON Web Token (JWT)?",
    answer: "A JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.",
  },
  {
    question: "Are my JWTs logged or sent to a server?",
    answer: "No. This tool operates entirely within your browser. The Base64Url parsing and JSON decoding happens locally on your machine. Your tokens are completely safe, private, and never leave your device.",
  },
  {
    question: "Does this tool verify the signature?",
    answer: "No. Verifying the signature requires the private secret key that the server used to sign the token. This tool only decodes the Base64Url payloads so you can read the public JSON claims inside.",
  },
  {
    question: "Why is a JWT split into three parts?",
    answer: "A JWT is composed of three parts separated by dots (.): the Header, the Payload, and the Signature. The Header contains the algorithm used, the Payload contains the actual data claims (like user ID), and the Signature ensures the token hasn't been altered.",
  },
];

export default function JwtDecoderPage() {
  const tool = getToolBySlug("jwt-decoder");
  if (!tool) return null;

  const breadcrumbs = buildToolBreadcrumbs(tool);
  const softwareApplication = createSoftwareApplicationStructuredData(tool);
  const faqSchema = createFaqStructuredData(faqs);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <ToolAnalytics tool_slug={tool.slug} tool_name={tool.name} tool_category={tool.category} />
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={softwareApplication} />
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="mb-4">
        <Card className="overflow-hidden p-8 border-border bg-card">
          <div className={`mb-6 inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-border`}>
            <ShieldAlert className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <JwtDecoderLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to decode a JWT</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Developers frequently need to inspect the contents of an authentication token during API development and debugging. Our client-side decoder makes this instant and secure.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Paste the Token:</strong> Simply copy your Base64Url encoded JWT (which typically looks like three long strings separated by dots) and paste it into the left input box.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>View the Claims:</strong> The token is instantly parsed and split into its three components. The Header and Payload are pretty-printed as syntax-highlighted JSON on the right side.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Copy the Payload:</strong> If you need the raw JSON data, just click the "Copy Payload" button next to the Payload section.</span>
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
              <h2 className="text-lg font-semibold text-foreground">Security Note</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Anyone with access to your JWT can read the payload data just like this tool does. You should never put sensitive data (like passwords or social security numbers) inside the payload of a JWT.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button asChild>
              <a href={`/categories/${tool.category}`}>
                Browse category <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tools">Back to tools</Link>
            </Button>
          </div>
        </Card>
      </section>

      <ToolRecommendations currentToolSlug={tool.slug} />
    </main>
  );
}
