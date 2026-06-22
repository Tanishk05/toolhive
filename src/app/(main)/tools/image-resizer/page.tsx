import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, ImagePlus, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/features/tools/components/favorite-button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { ImageResizerLayout } from "@/features/image-resizer/components/image-resizer-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("image-resizer");
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
    question: "How do I resize an image?",
    answer: "Simply drag and drop your image into the upload area or click to select a file. Choose whether you want to resize by specific dimensions (pixels) or by a percentage. Adjust the values or select a preset, then click 'Download Resized Image'.",
  },
  {
    question: "What is 'Maintain Aspect Ratio'?",
    answer: "Maintaining the aspect ratio ensures your image doesn't get stretched or squished. If you lock the aspect ratio and change the width, the height will automatically adjust proportionally, and vice versa.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Since all processing happens locally within your web browser, the size limit depends entirely on your device's memory. For optimal performance, we recommend images under 20MB.",
  },
  {
    question: "What image formats are supported?",
    answer: "Our image resizer supports all standard web image formats, including JPG, PNG, and WebP.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer: "No! Privacy is our priority. Your photos are processed securely using your browser's local resources. No images are ever uploaded to or stored on our servers.",
  },
  {
    question: "What are the presets for?",
    answer: "We provide presets for common social media image sizes like Instagram Posts, YouTube Thumbnails, and X (Twitter) Headers, so you don't have to look up the exact pixel dimensions.",
  },
];

export default async function ImageResizerPage() {
  const tool = await getToolBySlug("image-resizer");
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
            <ImagePlus className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <ImageResizerLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Professional Image Resizing</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Our Free Image Resizer makes it incredibly easy to scale your photos and graphics perfectly for any platform without losing quality. Avoid complicated software and resize photos right in your browser.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Social Media Ready:</strong> Instantly snap your images to the perfect dimensions for Instagram, Facebook, YouTube, LinkedIn, and X.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Percentage Scaling:</strong> Need a photo exactly half its size? Just switch to percentage mode and slide down to 50%.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">✓</span>
                  <span className="ml-3"><strong>Aspect Ratio Control:</strong> Lock your proportions to prevent image distortion, or unlock them to stretch images to exact target sizes.</span>
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
                This tool processes your images locally in your browser. We never transmit or store your files, ensuring complete confidentiality for your sensitive photos.
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
