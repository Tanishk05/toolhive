import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeInfo } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug, getToolRegistry, getIconName } from "@/features/tools/tool-registry";
import { ToolIcon } from "@/features/tools/components/tool-icon";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { BlogRecommendations } from "@/components/blog/blog-recommendations";
import { AdUnit } from "@/components/ads/ad-unit";
import { toolSeoContent } from "@/constants/tool-seo-content";
import {
  createBreadcrumbStructuredData,
  createFaqStructuredData,
  createMetadata,
  createSoftwareApplicationStructuredData,
} from "@/lib/seo";

export async function generateStaticParams() {
  const registry = await getToolRegistry();
  return registry.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  return createMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    path: tool.seo.canonical,
    keywords: tool.seo.keywords,
  });
}

export default async function ToolDetailsPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const iconName = getIconName(tool.icon);
  const breadcrumbs = buildToolBreadcrumbs(tool);
  const softwareApplication = createSoftwareApplicationStructuredData(tool);
  const seoContent = toolSeoContent[tool.slug];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <ToolAnalytics tool_slug={tool.slug} tool_name={tool.name} tool_category={tool.category} />
      <JsonLd data={createBreadcrumbStructuredData(breadcrumbs)} />
      <JsonLd data={softwareApplication} />
      {seoContent?.faqs && seoContent.faqs.length > 0 && (
        <JsonLd data={createFaqStructuredData(seoContent.faqs)} />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <Card className="overflow-hidden p-8">
          <div className={`mb-6 inline-flex rounded-3xl bg-linear-to-br ${tool.accent} p-4 ring-1 ring-white/10`}>
            <ToolIcon name={iconName} className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Free Online {tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300">{tool.seo.description || tool.description}</p>
            <p className="max-w-3xl text-sm leading-6 text-slate-400">{tool.summary}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
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

        <Card className="space-y-6 p-6">
          <div className="flex items-start gap-3">
            <BadgeInfo className="mt-1 h-5 w-5 text-emerald-300" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-white">Registry metadata</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Dynamic metadata is generated from the registry entry so the page stays in sync with the source of truth.
              </p>
            </div>
          </div>
          <dl className="grid gap-4 text-sm">
            <Detail label="Slug" value={tool.slug} />
            <Detail label="Category" value={tool.categoryLabel} />
            <Detail label="Featured" value={tool.featured ? "Yes" : "No"} />
            <Detail label="Premium" value={tool.premium ? "Yes" : "No"} />
          </dl>
        </Card>
      </section>

      {/* SEO Content Section */}
      {seoContent && (
        <section className="grid gap-8 lg:grid-cols-2">
          {seoContent.howToUse.length > 0 && (
            <Card className="p-8">
              <h2 className="mb-6 text-2xl font-semibold text-white">How to Use {tool.name}</h2>
              <ol className="space-y-6">
                {seoContent.howToUse.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-white">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <div className="space-y-8">
            {seoContent.benefits.length > 0 && (
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-semibold text-white">Why Use Our {tool.name}?</h2>
                <ul className="space-y-4">
                  {seoContent.benefits.map((benefit, index) => (
                    <li key={index} className="space-y-1">
                      <h3 className="font-medium text-white">{benefit.title}</h3>
                      <p className="text-sm text-slate-400">{benefit.description}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {seoContent.faqs.length > 0 && (
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-semibold text-white">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {seoContent.faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-white">{faq.question}</h3>
                      <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </section>
      )}

      <AdUnit format="horizontal" slotId="tool-page-bottom" />
      <BlogRecommendations tags={[...tool.tags, ...tool.searchTerms, tool.name]} />
      <ToolRecommendations currentToolSlug={tool.slug} />
    </main>
  );
}

function Detail({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <dt className="text-xs font-medium tracking-[0.28em] text-slate-400 uppercase">{label}</dt>
      <dd className="mt-2 text-base text-white">{value}</dd>
    </div>
  );
}
