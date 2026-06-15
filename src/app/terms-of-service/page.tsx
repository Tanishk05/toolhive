import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/landing-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service | ToolHive",
  description: "Terms of Service for ToolHive.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <LandingShell>
      <div className="mx-auto w-full max-w-3xl py-12 md:py-20 text-muted-foreground">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <div className="space-y-6 leading-7">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-foreground mt-10">1. Acceptance of Terms</h2>
          <p>By accessing and using ToolHive, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using ToolHive&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          
          <h2 className="text-xl font-semibold text-foreground mt-10">2. Description of Service</h2>
          <p>ToolHive provides users with access to a rich collection of resources, including various web-based tools, calculators, and generators. You also understand and agree that the service may include certain communications from ToolHive, such as service announcements and administrative messages.</p>

          <h2 className="text-xl font-semibold text-foreground mt-10">3. User Conduct</h2>
          <p>You agree to not use the service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libellous, invasive of another&apos;s privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
            <li>impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
            <li>interfere with or disrupt the service or servers or networks connected to the service.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-10">4. Modifications to Service</h2>
          <p>ToolHive reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that ToolHive shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.</p>
          
          <h2 className="text-xl font-semibold text-foreground mt-10">5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </div>
      </div>
    </LandingShell>
  );
}
