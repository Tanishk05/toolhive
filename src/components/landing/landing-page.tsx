"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, ArrowUpRight, ChevronDown, Zap, Smartphone, ShieldCheck, Download, Search, Globe } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Search,
  Smartphone,
  ShieldCheck,
  Download,
  Globe,
};
import Link from "next/link";
import { LandingShell } from "@/components/landing/landing-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search";
import { ToolCard } from "@/components/marketing/tool-card";
import { AdUnit } from "@/components/ads/ad-unit";
import { type getLandingContent } from "@/constants/landing-content";

export function LandingPage({ content }: { content: Awaited<ReturnType<typeof getLandingContent>> }) {
  return (
    <LandingShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-card shadow-[0_24px_90px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" aria-hidden="true" />
        
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <Reveal>
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {content.hero.title}
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  {content.hero.description}
                </p>
              </div>

              {/* Main Search Bar */}
              <div className="mx-auto max-w-2xl">
                <SearchBar action="/tools" placeholder="Search for tools, calculators, and generators..." />
              </div>

              {/* Quick Searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-sm">
                <span className="text-muted-foreground">Popular:</span>
                {content.hero.quickSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/tools?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Tools */}
      <SectionBlock
        eyebrow="Featured Tools"
        title="Tools everyone is using right now"
        id="featured-tools"
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {content.featuredTools.map((tool, index) => (
            <Reveal key={tool.name} delay={0.06 * index}>
              <FeaturedToolCard {...tool} />
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* Categories */}
      <SectionBlock
        eyebrow="Browse by Category"
        title="Find exactly what you need"
        id="categories"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {content.categories.map((category, index) => (
            <Reveal key={category.label} delay={0.05 * index}>
              <Link href={`/categories/${category.slug}`} className="block h-full">
                <Card className="group h-full p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">{category.label}</h3>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{category.description}</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* Why Choose Us */}
      <SectionBlock
        eyebrow="Why Choose ToolHive"
        title="Everything you need, nothing you don't"
        id="benefits"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.whyChooseUs.map((benefit, index) => {
            const Icon = ICON_MAP[benefit.icon] || Zap;
            return (
              <Reveal key={benefit.title} delay={0.05 * index}>
                <Card className="h-full p-6 lg:p-8">
                  <div className="inline-flex rounded-xl bg-emerald-400/10 p-3 ring-1 ring-emerald-400/20">
                    <Icon className="h-6 w-6 text-emerald-400" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{benefit.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </SectionBlock>

      {/* Popular Tools Grid */}
      <SectionBlock
        eyebrow="Trending"
        title="Most popular free tools"
        id="popular-tools"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.popularTools.map((tool, index) => (
            <Reveal key={tool.slug} delay={0.04 * index}>
              <ToolCard
                slug={tool.slug}
                name={tool.name}
                description={tool.description}
                tags={tool.tags}
                accent={tool.accent}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/tools">View all {content.popularTools.length}+ tools</Link>
          </Button>
        </div>
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock
        eyebrow="FAQ"
        title="Frequently asked questions"
        id="faq"
      >
        <div className="mx-auto max-w-3xl divide-y divide-border">
          {content.faqs.map((faq, index) => (
            <Reveal key={index} delay={0.05 * index}>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between py-6 text-lg font-medium text-foreground">
                  {faq.question}
                  <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-muted transition group-open:rotate-180">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </span>
                </summary>
                <div className="pb-6 pr-12 text-muted-foreground leading-7">
                  {faq.answer}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* Blog Preview */}
      <SectionBlock
        eyebrow="Resources"
        title="Guides, tips, and tutorials"
        id="blog"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {content.blogPosts.map((post, index) => (
            <Reveal key={post.title} delay={0.05 * index}>
              <BlogCard {...post} />
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* Final CTA */}
      <section className="rounded-[2.5rem] border border-border bg-card p-8 py-16 text-center shadow-sm dark:border-primary/20 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(59,130,246,0.1))] dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-16">
        <Reveal>
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find the Right Tool in Seconds
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Stop bookmarking dozens of random websites. Access all the free utilities you need in one fast, ad-free platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="/tools">Explore All Tools</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
      <AdUnit format="horizontal" slotId="landing-page-footer" />
      <Footer content={content} />
    </LandingShell>
  );
}

function Reveal({ children, delay = 0 }: Readonly<{ children: React.ReactNode; delay?: number }>) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
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
    <section id={id} className="space-y-8 py-16 scroll-mt-28 lg:py-24">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      {children}
    </section>
  );
}

function FeaturedToolCard({
  name,
  description,
  tags,
  accent,
  slug,
}: Readonly<{
  name: string;
  description: string;
  tags: readonly string[];
  accent: string;
  slug: string;
}>) {
  return (
    <Card className="group h-full overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className={`h-24 rounded-3xl bg-linear-to-br ${accent} p-4 ring-1 ring-border`}>
        <div className="flex h-full items-start justify-between">
          <div>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{name}</h3>
          </div>
          <div className="rounded-full bg-background/20 p-2 text-foreground">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/tools/${slug}`}>Explore tool</Link>
        </Button>
      </div>
    </Card>
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
    <Card className="group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-primary">
        <span>{category}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
          <CalendarDays className="h-3.5 w-3.5" />
          {readTime}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{excerpt}</p>
      <div className="mt-6">
        <Link href={`/blog/${slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:text-primary">
          Read article
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

function Footer({ content }: { content: Awaited<ReturnType<typeof getLandingContent>> }) {
  return (
    <footer className="border-t border-border pt-16 mt-24">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xl font-bold tracking-tight text-foreground">ToolHive</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Free, fast, and secure online tools to help you get work done. No downloads or installations required.
            </p>
          </div>
        </div>
        {Object.entries(content.footerLinks).map(([group, items]) => (
          <div key={group}>
            <p className="text-sm font-semibold text-foreground capitalize">{group}</p>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item.label}>
                  <Link className="transition hover:text-primary" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col gap-4 border-t border-border py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ToolHive. All rights reserved.</p>
        <p>Built for the web.</p>
      </div>
    </footer>
  );
}
