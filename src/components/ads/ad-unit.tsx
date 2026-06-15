"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type AdFormat = "auto" | "rectangle" | "vertical" | "horizontal";

interface AdUnitProps {
  slotId?: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export function AdUnit({ slotId = "placeholder-slot", format = "auto", responsive = true, className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pathname = usePathname();

  // Re-push ads when the route changes since client-side navigation unmounts/remounts
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && adRef.current) {
        // Prevent pushing multiple times to the same ad unit
        if (!adRef.current.hasAttribute("data-adsbygoogle-status")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error("AdSense error", error);
    }
  }, [pathname]);

  // If no client ID is configured, we can show a placeholder in dev, or simply return null.
  // For safety, we'll render the ins tag but it won't populate if the script isn't there.
  
  // Height protection for Core Web Vitals (CLS)
  // Auto generally assumes 90px on mobile and 250px on desktop
  const minHeightClass = format === "vertical" ? "min-h-[600px]" : "min-h-[90px] sm:min-h-[250px]";

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center my-6 ${minHeightClass} ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-0000000000000000"}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
