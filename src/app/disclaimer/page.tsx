import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/landing-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Disclaimer | ToolHive",
  description: "Legal disclaimer for the use of ToolHive.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LandingShell>
      <div className="mx-auto w-full max-w-3xl py-12 md:py-20 text-muted-foreground">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground">Disclaimer</h1>
        <div className="space-y-6 leading-7">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold text-foreground mt-10">1. Website Information</h2>
          <p>
            The information provided by ToolHive ("we," "us," or "our") on this website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-10">2. External Links Disclaimer</h2>
          <p>
            The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-10">3. Tools and Utilities</h2>
          <p>
            The tools, calculators, and generators provided on this website are designed to be helpful, but they should not be considered a substitute for professional advice. Any reliance you place on such information or tools is therefore strictly at your own risk.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-10">4. Financial / Legal Advice Disclaimer</h2>
          <p>
            Calculators relating to financial, legal, or health topics are provided for illustrative purposes only. They are not intended to provide specific financial, tax, or legal advice. Please consult with a qualified professional before making any decisions based on the output of our tools.
          </p>
        </div>
      </div>
    </LandingShell>
  );
}
