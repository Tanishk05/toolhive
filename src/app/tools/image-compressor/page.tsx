import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeInfo, ImageMinus, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ToolAnalytics } from "@/components/analytics/tool-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildToolBreadcrumbs, getToolBySlug } from "@/features/tools/tool-registry";
import { ToolRecommendations } from "@/features/tools/components/tool-recommendations";
import { createBreadcrumbStructuredData, createFaqStructuredData, createMetadata, createSoftwareApplicationStructuredData } from "@/lib/seo";
import { ImageCompressorLayout } from "@/features/image-compressor/components/image-compressor-layout";

export async function generateMetadata(): Promise<Metadata> {
  const tool = await getToolBySlug("image-compressor");
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
    question: "Does this tool upload my images to a server?",
    answer: "No. All image compression happens entirely within your web browser using HTML5 Canvas APIs. Your original images never leave your device, ensuring complete privacy and security.",
  },
  {
    question: "Why did my PNG image change format?",
    answer: "PNG is a 'lossless' format, which means standard compression does not reduce its file size effectively. To achieve significant file size reduction for the web, our tool automatically converts heavy PNG files into modern, highly compressed WebP formats.",
  },
  {
    question: "Does compression reduce image quality?",
    answer: "Yes, this is 'lossy' compression, meaning it works by permanently removing some data from the image. However, by adjusting the quality slider (e.g., 70-80%), you can drastically reduce file size while keeping the visual difference virtually undetectable to the human eye.",
  },
  {
    question: "What is the maximum file size supported?",
    answer: "Because this tool runs in your browser, the maximum size is technically limited only by your computer's available memory. However, for the best performance without freezing your browser, we recommend keeping individual images under 50MB.",
  },
];

export default async function ImageCompressorPage() {
  const tool = await getToolBySlug("image-compressor");
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
            <ImageMinus className="h-8 w-8 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-[0.32em] text-primary uppercase">{tool.categoryLabel}</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{tool.description}</p>
          </div>
        </Card>
      </section>

      <section>
        <ImageCompressorLayout />
      </section>

      <section className="mt-8">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How to compress images for the web</h2>
            <div className="mt-6 space-y-6 text-muted-foreground leading-7">
              <p>
                Large images are the number one cause of slow loading websites. By compressing your images before uploading them to your blog or application, you drastically improve page speed and SEO rankings.
              </p>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">1</span>
                  <span className="ml-3"><strong>Upload an Image:</strong> Drag and drop a JPEG, PNG, or WebP image into the drop zone, or click to browse your files.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">2</span>
                  <span className="ml-3"><strong>Adjust Quality:</strong> Use the quality slider (default is 80%) to balance file size with visual fidelity. Look at the "Saved Space" metric to see exactly how much bandwidth you are saving.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">3</span>
                  <span className="ml-3"><strong>Download:</strong> Once you are happy with the size and visual result, click the download button to instantly save the optimized image to your device.</span>
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
              <h2 className="text-lg font-semibold text-foreground">Privacy Metadata</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Our image compression technology is 100% offline-first. Your images are parsed and compressed locally on your computer. Unlike traditional compressor services, we never see, upload, or store your personal files.
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
