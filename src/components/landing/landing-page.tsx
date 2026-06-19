import { ArrowRight, ArrowUpRight, ChevronDown, Zap, Smartphone, ShieldCheck, Download, Search, Globe } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Search,
  Smartphone,
  ShieldCheck,
  Download,
  Globe,
};
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search";
import { ToolCard } from "@/components/marketing/tool-card";
import { AdUnit } from "@/components/ads/ad-unit";
import { Reveal } from "@/components/ui/reveal-animation";
import { type getLandingContent } from "@/constants/landing-content";
import { TrendingSection } from "@/components/tools/trending-tools";

export function LandingPage({ content }: { content: Awaited<ReturnType<typeof getLandingContent>> }) {
  return (
    <>
      <div className="flex flex-col gap-24 lg:gap-32">
        {/* ═══ Hero Section ═══ */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-32 left-1/2 h-[480px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(143,175,147,0.12),transparent_70%)] blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-[320px] w-[480px] rounded-full bg-[radial-gradient(ellipse,rgba(115,134,168,0.10),transparent_70%)] blur-3xl" />
            <div className="absolute top-1/2 left-8 h-[200px] w-[200px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,175,147,0.06),transparent_70%)] blur-2xl" style={{ animation: "float 12s ease-in-out infinite" }} />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              {/* Eyebrow */}
              <p className="text-xs font-medium tracking-[0.4em] text-primary/70 uppercase">
                Free · Fast · Private
              </p>

              {/* Headline */}
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                <span className="block">Tools that</span>
                <span className="bg-[linear-gradient(135deg,var(--primary),var(--secondary-accent))] bg-clip-text text-transparent">
                  respect your time
                </span>
              </h1>

              {/* Subheading */}
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                {content.hero.description}
              </p>

              {/* Search Bar */}
              <div className="mx-auto max-w-2xl pt-2">
                <SearchBar 
                  action="/tools" 
                  placeholder="Search tools, calculators, and generators..." 
                  suggestions={content.searchSuggestions}
                />
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-sm">
                  <span className="text-muted-foreground/50">Popular:</span>
                  {content.hero.quickSearches.slice(0, 4).map((term) => (
                    <Link
                      key={term}
                      href={`/tools?q=${encodeURIComponent(term)}`}
                      className="rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground/60">
                <TrustStat value={`${content.popularTools.length}+`} label="Free tools" />
                <span className="h-4 w-px bg-border" aria-hidden="true" />
                <TrustStat value="100%" label="Client-side" />
                <span className="h-4 w-px bg-border" aria-hidden="true" />
                <TrustStat value="0" label="Data collected" />
              </div>
            </div>
          </div>
        </section>



        {/* ═══ Featured Tools — Bento Grid ═══ */}
        <SectionBlock
          eyebrow="Featured"
          title="Curated tools worth trying first"
          id="featured-tools"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.featuredTools.map((tool, index) => {
              // First 2 cards are large (span 2 cols), rest are standard
              const isLarge = index < 2;
              return (
                <Reveal key={tool.name} delay={0.06 * index} className={`flex flex-col h-full ${isLarge ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                  <FeaturedToolCard {...tool} isLarge={isLarge} />
                </Reveal>
              );
            })}
          </div>
        </SectionBlock>

        {/* ═══ Categories ═══ */}
        <SectionBlock
          eyebrow="Browse"
          title="Find exactly what you need"
          id="categories"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.categories.map((category, index) => (
              <Reveal key={category.label} delay={0.05 * index} className="flex flex-col h-full">
                <Link href={`/categories/${category.slug}`} className="block h-full">
                  <div className="group h-full rounded-[var(--radius)] bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-foreground">{category.label}</h3>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-muted-foreground/50 transition-all group-hover:bg-primary/10 group-hover:text-primary">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground/70">{category.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </SectionBlock>

        {/* ═══ Why Choose Us ═══ */}
        <SectionBlock
          eyebrow="Why ToolHive"
          title="Everything you need, nothing you don't"
          id="benefits"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.whyChooseUs.map((benefit, index) => {
              const Icon = ICON_MAP[benefit.icon] || Zap;
              return (
                <Reveal key={benefit.title} delay={0.05 * index} className="flex flex-col h-full">
                  <div className="h-full rounded-[var(--radius)] bg-surface p-7 lg:p-8 transition-all duration-300 hover:bg-surface-hover">
                    <div className="inline-flex rounded-2xl bg-primary/[0.08] p-3">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">{benefit.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </SectionBlock>

        {/* ═══ Dynamic Trending & Most Saved Tools ═══ */}
        <TrendingSection />

        {/* ═══ FAQ ═══ */}
        <SectionBlock
          eyebrow="FAQ"
          title="Frequently asked questions"
          id="faq"
        >
          <div className="mx-auto max-w-3xl space-y-2">
            {content.faqs.map((faq, index) => (
              <Reveal key={index} delay={0.05 * index}>
                <details className="group rounded-2xl bg-surface transition-colors open:bg-surface-hover [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-base font-medium text-foreground">
                    {faq.question}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] transition-transform group-open:rotate-180">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground/80">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </SectionBlock>

        {/* ═══ Blog Preview ═══ */}
        <SectionBlock
          eyebrow="Resources"
          title="Guides, tips, and tutorials"
          id="blog"
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {content.blogPosts.map((post, index) => (
              <Reveal key={post.title} delay={0.05 * index} className="flex flex-col h-full">
                <BlogCard {...post} />
              </Reveal>
            ))}
          </div>
        </SectionBlock>

        {/* ═══ Final CTA ═══ */}
        <section className="relative overflow-hidden rounded-[2rem] bg-surface p-10 py-20 text-center sm:p-20">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-16 left-1/4 h-[300px] w-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(143,175,147,0.08),transparent_70%)] blur-3xl" />
            <div className="absolute -bottom-16 right-1/4 h-[250px] w-[350px] rounded-full bg-[radial-gradient(ellipse,rgba(115,134,168,0.07),transparent_70%)] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl space-y-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the right tool
              <span className="block bg-[linear-gradient(135deg,var(--primary),var(--secondary-accent))] bg-clip-text text-transparent">
                in seconds
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground/70">
              Stop bookmarking dozens of random websites. Access all the free utilities you need in one platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="/tools">Explore All Tools</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-24 lg:mt-32">
        <AdUnit format="horizontal" slotId="landing-page-footer" />
      </div>
    </>
  );
}

function SectionBlock({
  eyebrow,
  title,
  description,
  id,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  id: string;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className="space-y-10 scroll-mt-28">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      {children}
    </section>
  );
}

function TrustStat({ value, label }: Readonly<{ value: string; label: string }>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground/50">{label}</span>
    </div>
  );
}

function FeaturedToolCard({
  name,
  description,
  tags,
  slug,
  isLarge = false,
}: Readonly<{
  name: string;
  description: string;
  tags: readonly string[];
  accent: string;
  slug: string;
  isLarge?: boolean;
}>) {
  return (
    <Link href={`/tools/${slug}`} className="flex flex-col h-full">
      <div className={`group relative flex flex-col flex-1 overflow-hidden rounded-[var(--radius)] bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:bg-surface-hover hover:shadow-[0_8px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(143,175,147,0.06)] ${isLarge ? "p-8 sm:p-10" : "p-7"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className={`font-bold tracking-tight text-foreground ${isLarge ? "text-2xl sm:text-3xl" : "text-xl"}`}>
              {name}
            </h3>
            <p className={`mt-3 leading-relaxed text-muted-foreground/70 ${isLarge ? "text-base" : "text-sm"}`}>
              {description}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-muted-foreground/40 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-auto pt-6 flex flex-wrap gap-2">
          {tags.slice(0, isLarge ? 3 : 2).map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground/60">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function BlogCard({
  title,
  excerpt,
  category,
  readTime,
  slug,
}: Readonly<{
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  slug: string;
}>) {
  return (
    <div className="group h-full rounded-[var(--radius)] bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between gap-4 text-xs text-primary/70">
        <span className="font-medium tracking-[0.2em] uppercase">{category}</span>
        <span className="text-muted-foreground/50">{readTime}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">{excerpt}</p>
      <div className="mt-6">
        <Link href={`/blog/${slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition group-hover:text-primary">
          Read article
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
