import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/landing-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us | ToolHive",
  description: "Learn more about ToolHive and our mission.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <LandingShell>
      <div className="mx-auto w-full max-w-3xl py-12 md:py-20 text-muted-foreground">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground">About ToolHive</h1>
        <div className="space-y-6 leading-7">
          <p className="text-lg">
            ToolHive is a platform dedicated to providing free, high-quality utilities for developers, creators, students, and everyday users.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground mt-10">Our Mission</h2>
          <p>
            We believe that basic web utilities shouldn&apos;t be hidden behind paywalls or intrusive advertisements. Our mission is to build the fastest, most reliable, and easiest-to-use collection of web tools on the internet.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-10">Privacy First</h2>
          <p>
            We take your privacy seriously. The vast majority of our tools are designed to work entirely client-side, meaning that your data, images, text, and files are processed right in your browser and never touch our servers.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-10">Get in Touch</h2>
          <p>
            Have a suggestion for a new tool? Found a bug? Just want to say hi? We&apos;d love to hear from you. Head over to our Contact page to send us a message.
          </p>
        </div>
      </div>
    </LandingShell>
  );
}
