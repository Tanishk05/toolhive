"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRightLeft, Copy, Check, Trash2, AlertCircle, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type Mode = "encode" | "decode";

export function Base64Layout() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Modern, UTF-8 safe base64 encoding using TextEncoder
  const encodeBase64 = (str: string) => {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
  };

  // Modern, UTF-8 safe base64 decoding using TextDecoder
  const decodeBase64 = (str: string) => {
    const binString = atob(str);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
    return new TextDecoder().decode(bytes);
  };

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        const result = encodeBase64(input);
        setOutput(result);
      } else {
        // Strip whitespace which is often accidentally included in Base64 strings
        const cleanedInput = input.replace(/\s/g, "");
        const result = decodeBase64(cleanedInput);
        setOutput(result);
      }
      setError(null);
      
      // Debounce analytics tracking slightly if we were to add a timeout, 
      // but simpler to just track here if output actually changed and is valid.
    } catch (e: unknown) {
      setOutput("");
      setError(mode === "encode" ? "Failed to encode input." : "Invalid Base64 string.");
    }
  }, [input, mode]);

  useEffect(() => {
    // eslint-disable-next-line
    handleConvert();
  }, [handleConvert]);

  // Track analytics when mode changes or valid conversion happens (debounced)
  useEffect(() => {
    if (output && !error) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "base64_converted",
          properties: {
            tool_slug: "base64-encoder-decoder",
            mode,
            input_length: input.length,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [output, mode, error, input.length]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSwap = () => {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    if (output && !error) {
      setInput(output); // Output becomes the new input
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
          <button
            onClick={() => setMode("encode")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === "encode" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === "decode" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Input Section */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileCode className="h-4 w-4 text-primary" />
              {mode === "encode" ? "Text Input" : "Base64 Input"}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Swap Encode/Decode"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Swap
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text, emojis, or code here..." : "Paste Base64 string here..."}
            className="min-h-[300px] w-full flex-1 resize-y bg-transparent p-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-0"
            spellCheck={false}
          />
        </Card>

        {/* Output Section */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {mode === "encode" ? "Base64 Output" : "Text Output"}
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
                Converted output will appear here
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="h-full min-h-[300px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-[#c9d1d9] dark:text-slate-300 outline-none focus:ring-0"
                spellCheck={false}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <AdUnit format="horizontal" slotId="base64-bottom-ad" />
      </div>
    </div>
  );
}
