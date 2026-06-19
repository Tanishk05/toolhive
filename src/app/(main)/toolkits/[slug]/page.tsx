import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Layers, Lightbulb, CheckCircle2, Share2 } from "lucide-react";
import { curatedToolkits } from "@/constants/toolkits";
import { getToolRegistry, getIconName } from "@/features/tools/tool-registry";
import { ToolCard } from "@/components/marketing/tool-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return curatedToolkits.map((tk) => ({ slug: tk.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const toolkit = curatedToolkits.find((tk) => tk.slug === params.slug);
  if (!toolkit) return {};
  return {
    title: `${toolkit.title} - ToolHive Toolkits`,
    description: toolkit.description,
  };
}

export default async function ToolkitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const toolkit = curatedToolkits.find((tk) => tk.slug === slug);
  
  if (!toolkit) {
    notFound();
  }

  const allTools = await getToolRegistry();
  const toolkitTools = toolkit.tools.map(tslug => allTools.find(t => t.slug === tslug)).filter(Boolean);

  return (
    <div className="container mx-auto max-w-5xl py-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
          <Layers className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{toolkit.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{toolkit.description}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <Button>
            <Share2 className="mr-2 h-4 w-4" /> Share Toolkit
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tools">Browse All Tools</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {/* Tools Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {toolkitTools.map((tool: any) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                description={tool.summary}
                tags={tool.tags}
                accent={tool.accent}
              />
            ))}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg flex items-center mb-4">
              <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-400" />
              Recommended Workflow
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground whitespace-pre-wrap">
              {toolkit.workflow}
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-lg flex items-center mb-4 text-primary">
              <Lightbulb className="mr-2 h-5 w-5" />
              Pro Tips
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {toolkit.tips}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
