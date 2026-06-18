import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, QrCode } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
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

export default async function QrCodeGeneratorPage() {
  const tool = await getToolBySlug("qr-code-generator");
  if (!tool) return null;

  const breadcrumbs = buildToolBreadcrumbs(tool);
  const softwareApplication = createSoftwareApplicationStructuredData(tool);

  return (
    <div className="flex flex-col gap-8 py-6">
      <ToolAnalytics tool_slug={tool.slug} tool_name={tool.name} tool_category={tool.category} />
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={softwareApplication} />
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
          </div>
        </Card>
      </section>

      <ToolRecommendations currentToolSlug={tool.slug} />
    </div>
  );
}
