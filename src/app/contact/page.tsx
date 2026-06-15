import type { Metadata } from "next";
import { MessageSquare, Newspaper, LifeBuoy } from "lucide-react";
import { LandingShell } from "@/components/landing/landing-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { NewsletterForm } from "@/components/contact/newsletter-form";
import { SupportForm } from "@/components/contact/support-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | ToolHive",
  description:
    "Get in touch with the ToolHive team. Send us a message, subscribe to our newsletter, or submit a support request.",
  path: "/contact",
  keywords: ["contact", "support", "newsletter", "ToolHive"],
});

export default function ContactPage() {
  return (
    <LandingShell>
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Whether you have a question, feedback, or need support — we're here to help."
        />

        {/* Contact Form */}
        <section id="contact-form" className="scroll-mt-28">
          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.08),transparent_40%)]" aria-hidden="true" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 ring-1 ring-emerald-400/20">
                  <MessageSquare className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Send a message</h2>
                  <p className="text-sm text-muted-foreground">General inquiries, feedback, and partnerships</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </Card>
        </section>

        {/* Newsletter + Support info grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Newsletter */}
          <section id="newsletter" className="scroll-mt-28">
            <Card className="relative h-full overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_40%)]" aria-hidden="true" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-400/10 ring-1 ring-blue-400/20">
                    <Newspaper className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Newsletter</h2>
                    <p className="text-sm text-muted-foreground">Updates on tools, features, and content</p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  Stay in the loop with curated updates about new tools, platform features, and articles from the ToolHive team. No spam — just the good stuff.
                </p>
                <NewsletterForm />
              </div>
            </Card>
          </section>

          {/* Support quick info */}
          <section id="support-info" className="scroll-mt-28">
            <Card className="relative h-full overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.06),transparent_40%)]" aria-hidden="true" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-400/20">
                    <LifeBuoy className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Support</h2>
                    <p className="text-sm text-muted-foreground">Bug reports, features, and billing</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>Need help with something specific? Use the form below to submit a detailed support request.</p>
                  <div className="grid gap-3 text-xs">
                    {[
                      { label: "Response time", value: "Within 24 hours" },
                      { label: "Hours", value: "Mon–Fri, 9am–6pm IST" },
                      { label: "Priority support", value: "Available for Pro & Team" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* Support Form */}
        <section id="support-form" className="scroll-mt-28">
          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.06),transparent_40%)]" aria-hidden="true" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-400/20">
                  <LifeBuoy className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Submit a support request</h2>
                  <p className="text-sm text-muted-foreground">Report bugs, request features, or get billing help</p>
                </div>
              </div>
              <SupportForm />
            </div>
          </Card>
        </section>
      </div>
    </LandingShell>
  );
}
