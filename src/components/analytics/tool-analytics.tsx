"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { analytics, type ToolAnalyticsProperties } from "@/lib/analytics";

export function ToolAnalytics({ tool_slug, tool_name, tool_category }: Readonly<ToolAnalyticsProperties>) {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    analytics.track({
      name: "tool_view",
      properties: {
        tool_slug,
        tool_name,
        tool_category,
      },
    });
  }, [tool_slug, tool_name, tool_category]);

  useEffect(() => {
    if (isLoaded && userId && tool_slug) {
      fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toolSlug: tool_slug }),
      }).catch(console.error);
    }
  }, [isLoaded, userId, tool_slug]);

  return null;
}
