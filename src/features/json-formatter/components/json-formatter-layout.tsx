"use client";

import { useState, useEffect } from "react";
import { Braces, Copy, Check, Wand2, Minimize2, Trash2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

export function JsonFormatterLayout() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
      trackAction("format");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON payload");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      trackAction("minify");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON payload");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackAction("copy");
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const trackAction = (action: string) => {
    analytics.track({
      name: "json_formatted",
      properties: {
        tool_slug: "json-formatter",
        action,
      }
    });
  };

  // Auto-format on paste if input is empty
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only auto-format if the textarea is focused and currently empty
      const target = e.target as HTMLElement;
      if (target.id === "json-input" && !input) {
        const pasteText = e.clipboardData?.getData("text");
        if (pasteText) {
          try {
            const parsed = JSON.parse(pasteText);
            setOutput(JSON.stringify(parsed, null, 2));
            setError(null);
          } catch {
            // Silently fail auto-format if it's not valid JSON
          }
        }
      }
    };
    
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [input]);

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Input Section */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Braces className="h-4 w-4 text-primary" />
              Raw Input
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your JSON here..."
            className="min-h-[400px] w-full flex-1 resize-y bg-transparent p-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-0"
            spellCheck={false}
          />
        </Card>

        {/* Output Section */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormat}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Format
              </button>
              <button
                onClick={handleMinify}
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                Minify
              </button>
            </div>
            
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="relative flex-1 bg-[#0d1117] dark:bg-black/40">
            {!output ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/50">
                Formatted output will appear here
              </div>
            ) : (
              <pre className="h-full min-h-[400px] w-full overflow-auto p-4 font-mono text-sm leading-relaxed text-[#c9d1d9] dark:text-slate-300">
                <code>{output}</code>
              </pre>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <AdUnit format="horizontal" slotId="json-bottom-ad" />
      </div>
    </div>
  );
}
