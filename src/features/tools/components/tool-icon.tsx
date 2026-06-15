"use client";

import { Wrench, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export function ToolIcon({
  name,
  className,
}: Readonly<{
  name: string;
  className?: string;
}>) {
  const Icon = ((Icons as Record<string, unknown>)[name] || Wrench) as LucideIcon;
  return <Icon className={className} aria-hidden="true" />;
}
