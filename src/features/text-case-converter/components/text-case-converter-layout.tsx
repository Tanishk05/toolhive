"use client";

import { useState, useCallback } from "react";
import { Copy, RefreshCw, Type, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type CaseType = 
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "inversecase";

const CASE_TYPES: { id: CaseType; label: string }[] = [
  { id: "uppercase", label: "UPPERCASE" },
  { id: "lowercase", label: "lowercase" },
  { id: "titlecase", label: "Title Case" },
  { id: "sentencecase", label: "Sentence case" },
  { id: "camelcase", label: "camelCase" },
  { id: "pascalcase", label: "PascalCase" },
  { id: "snakecase", label: "snake_case" },
  { id: "kebabcase", label: "kebab-case" },
  { id: "inversecase", label: "InVeRsE cAsE" },
];

export function TextCaseConverterLayout() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const applyCase = useCallback((caseType: CaseType) => {
    if (!text) return;

    let newText = "";
    
    switch (caseType) {
      case "uppercase":
        newText = text.toUpperCase();
        break;
      case "lowercase":
        newText = text.toLowerCase();
        break;
      case "titlecase":
        newText = text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
        break;
      case "sentencecase":
        newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "camelcase":
        newText = text
          .split(/[\s_-]+/)
          .filter((w) => w.length > 0)
          .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");
        break;
      case "pascalcase":
        newText = text
          .split(/[\s_-]+/)
          .filter((w) => w.length > 0)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");
        break;
      case "snakecase":
        newText = text
          .split(/[\s_-]+/)
          .filter((w) => w.length > 0)
          .map((w) => w.toLowerCase())
          .join("_");
        break;
      case "kebabcase":
        newText = text
          .split(/[\s_-]+/)
          .filter((w) => w.length > 0)
          .map((w) => w.toLowerCase())
          .join("-");
        break;
      case "inversecase":
        newText = text
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
          .join("");
        break;
    }

    setText(newText);
    
    analytics.track({
      name: "text_case_converted",
      properties: {
        tool_slug: "text-case-converter",
        case_type: caseType,
      }
    });
  }, [text]);

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Your Text</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text}>
                {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Output
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear} disabled={!text} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to convert its case..."
            className="min-h-[300px] w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            spellCheck={false}
          />
        </Card>
        
        <AdUnit format="horizontal" slotId="text-case-converter-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(245,158,11,0.05),rgba(249,115,22,0.05))] dark:bg-[linear-gradient(135deg,rgba(245,158,11,0.1),rgba(15,23,42,0.8),rgba(249,115,22,0.1))] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium tracking-wide text-primary uppercase">Format Options</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {CASE_TYPES.map((ct) => (
                <Button
                  key={ct.id}
                  variant="outline"
                  className="w-full justify-start text-left font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => applyCase(ct.id)}
                  disabled={!text}
                >
                  <span className="truncate">{ct.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
