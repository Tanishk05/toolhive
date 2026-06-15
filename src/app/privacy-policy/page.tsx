import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/landing-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | ToolHive",
  description: "Privacy policy for ToolHive.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LandingShell>
      <div className="mx-auto w-full max-w-3xl py-12 md:py-20 text-slate-300">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
        <div className="space-y-6 leading-7">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold text-white mt-10">1. Introduction</h2>
          <p>Welcome to ToolHive. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          
          <h2 className="text-xl font-semibold text-white mt-10">2. The Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-10">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-10">4. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
          
          <h2 className="text-xl font-semibold text-white mt-10">5. Contact Us</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.</p>
        </div>
      </div>
    </LandingShell>
  );
}
