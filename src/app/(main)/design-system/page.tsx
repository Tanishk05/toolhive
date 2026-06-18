import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/marketing/category-card";
import { PricingCard } from "@/components/marketing/pricing-card";
import { ToolCard } from "@/components/marketing/tool-card";
import { SiteFooter } from "@/components/navigation/site-footer";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { Modal } from "@/components/ui/modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { designTokens } from "@/constants/design-tokens";

export const metadata: Metadata = {
  title: "Design System",
  description: "Reusable ToolHive UI components, design tokens, and usage examples.",
};

const sampleLinks = [
  { label: "Tools", href: "#featured-tools" },
  { label: "Categories", href: "#popular-categories" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
] as const;

const codeSamples = {
  button: `<Button>Primary action</Button>\n<Button variant="outline">Secondary action</Button>`,
  input: `<Input id="email" type="email" placeholder="name@company.com" />`,
  pricing: `<PricingCard plan="Pro" price="$29" description="For growing teams" features={["Unlimited tools", "Analytics", "Priority support"]} featured />`,
  dialog: `<Modal trigger={<Button>Open modal</Button>} title="Create tool" description="Configure a new utility">
  <p>Modal content</p>
</Modal>`,
  dropdown: `<Dropdown>
  <DropdownTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownTrigger>
</Dropdown>`,
  pagination: `<Pagination currentPage={3} totalPages={8} getHref={(page) => \`?page=\${page}\`} />`,
};

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <MainNavigation
        brand="ToolHive Design System"
        links={sampleLinks}
        ctaLabel="View docs"
        ctaHref="#docs"
      />

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Design System</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">A scalable, token-driven component library for ToolHive.</h1>
          <p className="text-base leading-7 text-slate-300">
            This system keeps the app consistent across tools, marketing, content, billing, and admin surfaces while
            staying accessible and type-safe.
          </p>
        </div>
      </section>

      <section id="docs" className="space-y-6">
        <SectionTitle eyebrow="Principles" title="Design tokens and conventions" description="Dark mode, CVA variants, accessible focus states, and CSS variables form the foundation." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {designTokens.principles.map((principle) => (
            <Card key={principle} className="p-6">
              <p className="text-sm font-medium text-white">{principle}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {designTokens.colors.map((token) => (
            <Card key={token.name} className="p-6">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{token.name}</p>
              <p className="mt-2 text-sm text-slate-300">{token.cssVar}</p>
              <p className="mt-3 text-sm text-slate-400">{token.usage}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {designTokens.radii.map((token) => (
            <Card key={token.name} className="p-6">
              <p className="text-xs font-medium tracking-[0.28em] text-emerald-300 uppercase">{token.name}</p>
              <p className="mt-2 text-sm text-slate-300">{token.cssVar}</p>
              <p className="mt-3 text-sm text-slate-400">{token.usage}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6" id="components">
        <SectionTitle eyebrow="Buttons and Inputs" title="Core controls" description="Small APIs with accessible defaults and CVA variants." />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="space-y-4 p-6">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <CodeBlock code={codeSamples.button} />
          </Card>
          <Card className="space-y-4 p-6">
            <label className="text-sm font-medium text-white" htmlFor="email">
              Email address
            </label>
            <Input id="email" type="email" placeholder="name@company.com" />
            <CodeBlock code={codeSamples.input} />
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Content cards" title="Tool, category, and pricing cards" description="Composable cards for discovery, comparison, and monetization flows." />
        <div className="grid gap-4 xl:grid-cols-3">
          <ToolCard
            slug="seo-snapshot"
            name="SEO Snapshot"
            description="Instant audits for metadata, headings, and page signals."
            tags={["SEO", "Audit", "Traffic"]}
            accent="from-emerald-400/30 to-cyan-400/10"
          />
          <CategoryCard label="Productivity" description="Workflow accelerators and utility helpers." index={1} />
          <PricingCard
            plan="Pro"
            price="$29"
            description="For growing teams that need scale and support."
            features={["Unlimited tools", "Analytics", "Priority support"]}
            featured
          />
        </div>
        <CodeBlock code={codeSamples.pricing} />
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Overlays" title="Modal, dialog, and dropdown components" description="Built on Radix primitives for accessibility and predictable keyboard behavior." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 p-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a tool</DialogTitle>
                  <DialogDescription>Collect a name, description, and category before publishing.</DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-6 text-slate-300">Dialog bodies can contain forms, previews, or confirmation states.</p>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Modal
              trigger={<Button variant="outline">Open modal</Button>}
              title="Create a new tool"
              description="A convenience wrapper around the dialog primitives."
              footer={
                <>
                  <Button variant="outline">Dismiss</Button>
                  <Button>Continue</Button>
                </>
              }
            >
              <p className="text-sm leading-6 text-slate-300">Use modal for guided actions with a single clear outcome.</p>
            </Modal>
            <CodeBlock code={codeSamples.dialog} />
          </Card>
          <Card className="space-y-4 p-6">
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline">Open dropdown</Button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownItem>Duplicate</DropdownItem>
                <DropdownItem>Rename</DropdownItem>
                <DropdownSeparator />
                <DropdownItem className="text-destructive focus:text-destructive">Delete</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <CodeBlock code={codeSamples.dropdown} />
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Navigation and search" title="Layout utilities" description="Shared building blocks for top-level navigation, search, and footers." />
        <Card className="space-y-4 p-6">
          <SearchBar />
          <div className="rounded-[1.35rem] border border-border bg-background p-4">
            <MainNavigation brand="ToolHive" links={sampleLinks} />
          </div>
          <SiteFooter
            description="A modern platform for utility tools, editorial content, and monetization."
            sections={[
              {
                title: "Product",
                links: [
                  { label: "Tools", href: "#" },
                  { label: "Pricing", href: "#" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "Docs", href: "#" },
                  { label: "Blog", href: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Contact", href: "#" },
                ],
              },
            ]}
          />
        </Card>
      </section>

      <section className="space-y-6">
        <SectionTitle eyebrow="Pagination" title="Accessible page navigation" description="Server-friendly links with a compact page range." />
        <Card className="p-6">
          <Pagination currentPage={3} totalPages={8} getHref={(page) => `?page=${page}`} />
          <div className="mt-4">
            <CodeBlock code={codeSamples.pagination} />
          </div>
        </Card>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">Next step</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Apply this system to product surfaces.</h2>
          </div>
          <Button asChild>
            <Link href="/">
              Back to home <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-[0.32em] text-emerald-300 uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="max-w-3xl text-base leading-7 text-slate-400">{description}</p>
    </div>
  );
}

function CodeBlock({ code }: Readonly<{ code: string }>) {
  return (
    <pre className="overflow-x-auto rounded-[1.35rem] border border-border bg-slate-950/80 p-4 text-sm leading-6 text-slate-300">
      <code>{code}</code>
    </pre>
  );
}