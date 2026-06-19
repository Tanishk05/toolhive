import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, QrCode, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createMetadata, createSoftwareApplicationStructuredData, createFaqStructuredData } from "@/lib/seo";
import { QrGeneratorLayout } from "@/features/qr-code/components/qr-generator-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("qr-code-generator");
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
    question: "Is this QR Code Generator free to use?",
    answer: "Yes, our QR Code Generator is completely free to use. There are no limits on the number of QR codes you can generate.",
  },
  {
    question: "Do the QR codes expire?",
    answer: "No, the generated QR codes are static and will never expire. They will work as long as the URL or data they point to remains active.",
  },
  {
    question: "Can I customize the color of my QR code?",
    answer: "Yes, our tool allows you to customize both the foreground and background colors to match your brand's style.",
  },
  {
    question: "Are the QR codes private?",
    answer: "Absolutely. The QR codes are generated entirely within your browser. We do not store or track the data you encode.",
  },
];

export default async function QrCodeGeneratorPage() {
  const tool = await getToolBySlug("qr-code-generator");
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

      {/* Header section similar to the dynamic shell, but tailored */}
      <section className="mb-4">
        <Card className="overflow-hidden p-8">
          <div className={`mb-6 inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-white/10`}>
            <QrCode className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300">{tool.description}</p>
          </div>
        </Card>
      </section>

      {/* Interactive Tool Section */}
      <section>
        <QrGeneratorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">How to use the QR Code Generator</h2>
            <div className="mt-6 space-y-6 text-slate-300 leading-7">
              <p>
                Our Free Online QR Code Generator makes it easy to create high-quality, custom QR codes for your business, website, or personal use.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">1</span>
                  <span className="ml-3"><strong>Enter your Content:</strong> Type or paste the URL, text, or data you want to encode into the QR code.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">2</span>
                  <span className="ml-3"><strong>Customize the Design (Optional):</strong> Change the foreground and background colors to fit your brand identity. Adjust the size and error correction level if needed.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">3</span>
                  <span className="ml-3"><strong>Download:</strong> Click the download button to save your QR code as a high-resolution PNG or SVG file, ready for printing or sharing online.</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {faqs.map((faq, index) => (
                <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between py-6 text-base font-medium text-white">
                    {faq.question}
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </span>
                  </summary>
                  <div className="pb-6 pr-12 text-sm text-slate-300 leading-7">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer metadata similar to dynamic shell */}
      <section className="mt-8">
        <Card className="space-y-6 p-6">
          <div className="flex items-start gap-3">
            <BadgeInfo className="mt-1 h-5 w-5 text-emerald-300" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-white">Registry metadata</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                This is a fully integrated module running client-side for zero-latency generation.
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
