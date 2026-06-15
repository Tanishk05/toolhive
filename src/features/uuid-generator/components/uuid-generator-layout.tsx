"use client";

import { useState, useEffect, useCallback } from "react";
import { Fingerprint, Copy, Check, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

export function UuidGeneratorLayout() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generateUuids = useCallback(() => {
    // Limit to max 500 for performance and UI sanity
    const validCount = Math.min(Math.max(1, count || 1), 500);
    
    const newUuids: string[] = [];
    for (let i = 0; i < validCount; i++) {
      let uuid = window.crypto.randomUUID();
      
      if (removeHyphens) {
        uuid = uuid.replace(/-/g, "");
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      
      newUuids.push(uuid);
    }
    
    setUuids(newUuids);

    analytics.track({
      name: "uuid_generated",
      properties: {
        tool_slug: "uuid-generator",
        count: validCount,
        remove_hyphens: removeHyphens,
        uppercase: uppercase,
      }
    });
  }, [count, removeHyphens, uppercase]);

  useEffect(() => {
    // eslint-disable-next-line
    generateUuids();
  }, [generateUuids]);

  const handleCopy = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy UUIDs", err);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
            <p className="text-sm text-muted-foreground">Adjust formatting and quantity options.</p>
          </div>

          <div className="space-y-8">
            {/* Quantity Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Quantity to Generate</label>
                <div className="flex w-20 items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setCount(val);
                    }}
                    className="h-8 px-2 text-center text-sm font-semibold"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
              <p className="text-xs text-muted-foreground text-right">Max 500 at a time</p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Remove Hyphens</span>
                <input
                  type="checkbox"
                  checked={removeHyphens}
                  onChange={(e) => setRemoveHyphens(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Uppercase Format</span>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
            </div>
            
            <button
              onClick={generateUuids}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Generate UUIDs
            </button>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="uuid-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="flex flex-col overflow-hidden border-primary/20 bg-card p-0 shadow-lg" style={{ height: "600px" }}>
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,rgba(168,85,247,0.05),rgba(236,72,153,0.05))] dark:bg-[linear-gradient(135deg,rgba(168,85,247,0.1),rgba(15,23,42,0.8),rgba(236,72,153,0.1))] px-6 py-4 border-b border-border">
            <p className="text-sm font-medium tracking-wide text-primary uppercase flex items-center gap-2">
              <Fingerprint className="h-4 w-4" />
              v4 UUIDs ({uuids.length})
            </p>
            <button
              onClick={handleCopy}
              disabled={uuids.length === 0}
              className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy All
                </>
              )}
            </button>
          </div>

          <div className="relative flex-1 bg-[#0d1117] dark:bg-black/40 p-0 overflow-hidden">
            <pre className="h-full w-full overflow-auto p-6 font-mono text-sm leading-relaxed text-[#c9d1d9] dark:text-slate-300 select-all selection:bg-primary/30">
              <code>{uuids.join("\n")}</code>
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
