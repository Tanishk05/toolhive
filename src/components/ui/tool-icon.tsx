"use client";

import {
  QrCode,
  FileJson,
  Calculator,
  ImageDown,
  KeyRound,
  Shuffle,
  Binary,
  Clock,
  Scale,
  Globe,
  Fingerprint,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  QrCode,
  FileJson,
  Calculator,
  ImageDown,
  KeyRound,
  Shuffle,
  Binary,
  Clock,
  Scale,
  Globe,
  Fingerprint,
  Wrench,
};

export function ToolIcon({
  name,
  className,
  size = 24,
}: Readonly<{
  name: string | null;
  className?: string;
  size?: number;
}>) {
  const Icon = ICON_MAP[name ?? ""] ?? Wrench;
  return <Icon className={cn("shrink-0", className)} size={size} />;
}
