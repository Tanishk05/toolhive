"use client";

import { useState, useMemo } from "react";
import { Copy, RefreshCw, Code, Unlock, Lock, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type Mode = "encode" | "decode";

export function UrlEncoderDecoderLayout() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [copied, setCopied] = useState(false);

  // Auto-detect mode on paste/type (optional heuristic)
  const handleInputChange = (val: string) => {
    setInput(val);
    if (val.length > 0 && mode === "encode" && /%[0-9A-Fa-f]{2}/.test(val)) {
      setMode("decode");
    } else if (val.length > 0 && mode === "decode" && !/%[0-9A-Fa-f]{2}/.test(val) && val.includes("://")) {
      setMode("encode");
    }
  };

  const output = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input.replace(/\+/g, " "));
      }
    } catch {
      return "Error: Invalid input for decoding.";
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (output && !output.startsWith("Error:")) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      analytics.track({
        name: "url_encoded_decoded",
        properties: {
          tool_slug: "url-encoder-decoder",
          mode: mode
        }
      });
    }
  };

  const handleClear = () => {
    setInput("");
  };

  // Syntax Highlighting for URL
  const renderHighlightedUrl = (urlStr: string) => {
    if (mode === "encode") return <span className="text-foreground">{urlStr}</span>;
    if (urlStr.startsWith("Error:")) return <span className="text-destructive font-sans">{urlStr}</span>;

    try {
      const url = new URL(urlStr);
      return (
        <span className="break-all font-mono leading-relaxed">
          <span className="text-emerald-500 dark:text-emerald-400">{url.protocol}{"//"}</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{url.host}</span>
          <span className="text-purple-600 dark:text-purple-400">{url.pathname}</span>
          {url.search && (
            <span className="text-amber-600 dark:text-amber-400">{url.search}</span>
          )}
          {url.hash && (
            <span className="text-rose-500 dark:text-rose-400">{url.hash}</span>
          )}
        </span>
      );
    } catch {
      // Not a full URL, just return text
      return <span className="break-all font-mono text-foreground leading-relaxed">{urlStr}</span>;
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex rounded-lg bg-muted/50 p-1">
            <button
              onClick={() => setMode("encode")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${mode === "encode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Lock className="h-4 w-4" />
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${mode === "decode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Unlock className="h-4 w-4" />
              Decode
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Input</label>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input} className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <RefreshCw className="mr-2 h-3 w-3" />
                Clear
              </Button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === "encode" ? "Enter text or URL to encode..." : "Enter encoded URL to decode..."}
              className="min-h-[150px] w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 font-mono text-sm shadow-sm placeholder:text-muted-foreground placeholder:font-sans focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Output</label>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || output.startsWith("Error:")} className="h-8">
                {copied ? <Check className="mr-2 h-3 w-3 text-green-500" /> : <Copy className="mr-2 h-3 w-3" />}
                Copy Result
              </Button>
            </div>
            <div className="min-h-[150px] w-full rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm shadow-inner overflow-auto">
              {output ? renderHighlightedUrl(output) : <span className="text-muted-foreground italic font-sans">Result will appear here...</span>}
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="url-encoder-decoder-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(52,211,153,0.05))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(52,211,153,0.1))] p-6 sm:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
              <Code className="h-4 w-4" /> Why Encode URLs?
            </h3>
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                URLs can only be sent over the Internet using the <strong>ASCII character-set</strong>. If a URL contains characters outside the ASCII set, the URL has to be converted.
              </p>
              <p>
                URL encoding converts characters into a format that can be transmitted over the Internet safely. It replaces unsafe ASCII characters with a <code>%</code> followed by two hexadecimal digits.
              </p>
              
              <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
                <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Common Replacements</p>
                <ul className="space-y-2 font-mono text-xs">
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>Space</span> <span>%20</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>!</span> <span>%21</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>#</span> <span>%23</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>$</span> <span>%24</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>&</span> <span>%26</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-1">
                    <span>&apos;</span> <span>%27</span>
                  </li>
                  <li className="flex justify-between">
                    <span>@</span> <span>%40</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
