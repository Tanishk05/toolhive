"use client";

import { useEffect } from "react";
import { analytics, type ToolAnalyticsProperties } from "@/lib/analytics";

export function ToolAnalytics({ tool_slug, tool_name, tool_category }: Readonly<ToolAnalyticsProperties>) {
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

  return null;
}
