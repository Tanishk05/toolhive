"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, RefreshCw, Calculator, TrendingUp, TrendingDown, ArrowRightLeft, Percent, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type CalcType = 
  | "percent_of" 
  | "is_what_percent" 
  | "percent_increase" 
  | "percent_decrease" 
  | "percent_change" 
  | "percent_difference";

const CALC_TYPES: Record<CalcType, { label: string; icon: React.ReactNode; desc: string }> = {
  percent_of: { label: "What is X% of Y?", icon: <Percent className="h-4 w-4" />, desc: "Calculate a specific percentage of a value." },
  is_what_percent: { label: "X is what % of Y?", icon: <Calculator className="h-4 w-4" />, desc: "Find out what percentage one number is of another." },
  percent_increase: { label: "Percentage Increase", icon: <TrendingUp className="h-4 w-4" />, desc: "Calculate the percentage increase from one value to another." },
  percent_decrease: { label: "Percentage Decrease", icon: <TrendingDown className="h-4 w-4" />, desc: "Calculate the percentage decrease from one value to another." },
  percent_change: { label: "Percentage Change", icon: <ArrowRightLeft className="h-4 w-4" />, desc: "Calculate the percentage change between two numbers." },
  percent_difference: { label: "Percentage Difference", icon: <ArrowRightLeft className="h-4 w-4" />, desc: "Calculate the percentage difference between two numbers." },
};

// Formatting helpers
function formatNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(num);
}

export function PercentageCalculatorLayout() {
  const [calcType, setCalcType] = useState<CalcType>("percent_of");
  const [valX, setValX] = useState<string>("");
  const [valY, setValY] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const numX = parseFloat(valX);
  const numY = parseFloat(valY);
  const isComplete = !isNaN(numX) && !isNaN(numY) && valX !== "" && valY !== "";

  const resultData = useMemo(() => {
    if (!isComplete) return { result: null, formula: "", steps: "" };

    let res = 0;
    let form = "";
    let stps = "";

    switch (calcType) {
      case "percent_of":
        res = (numX / 100) * numY;
        form = "Result = (X / 100) × Y";
        stps = `(${numX} / 100) × ${numY} = ${formatNumber(res)}`;
        break;
      case "is_what_percent":
        res = (numX / numY) * 100;
        form = "Result = (X / Y) × 100";
        stps = `(${numX} / ${numY}) × 100 = ${formatNumber(res)}%`;
        break;
      case "percent_increase":
        res = ((numY - numX) / numX) * 100;
        form = "Result = ((Y - X) / X) × 100";
        stps = `((${numY} - ${numX}) / ${numX}) × 100 = ${formatNumber(res)}%`;
        break;
      case "percent_decrease":
        res = ((numX - numY) / numX) * 100;
        form = "Result = ((X - Y) / X) × 100";
        stps = `((${numX} - ${numY}) / ${numX}) × 100 = ${formatNumber(res)}%`;
        break;
      case "percent_change":
        res = ((numY - numX) / Math.abs(numX)) * 100;
        form = "Result = ((Y - X) / |X|) × 100";
        stps = `((${numY} - ${numX}) / ${Math.abs(numX)}) × 100 = ${formatNumber(res)}%`;
        break;
      case "percent_difference": {
        const diff = Math.abs(numX - numY);
        const avg = (numX + numY) / 2;
        res = (diff / avg) * 100;
        form = "Result = (|X - Y| / ((X + Y) / 2)) × 100";
        stps = `(|${numX} - ${numY}| / ((${numX} + ${numY}) / 2)) × 100 = ${formatNumber(res)}%`;
        break;
      }
    }

    return { result: res, formula: form, steps: stps };
  }, [calcType, numX, numY, isComplete]);

  // Analytics
  useEffect(() => {
    if (isComplete && resultData.result !== null) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "percentage_calculated",
          properties: {
            tool_slug: "percentage-calculator",
            calc_type: calcType,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [calcType, isComplete, resultData.result]);

  const handleCopy = async () => {
    if (resultData.result !== null) {
      const textToCopy = `${formatNumber(resultData.result)}${calcType !== "percent_of" ? "%" : ""}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setValX("");
    setValY("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Select Calculation Type</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.entries(CALC_TYPES) as [CalcType, typeof CALC_TYPES[CalcType]][]).map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCalcType(key);
                    handleReset();
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    calcType === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {def.icon}
                  {def.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Value X</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={valX}
                    onChange={(e) => setValX(e.target.value)}
                    placeholder="Enter X"
                    className="h-12 bg-muted/50 font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Value Y</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={valY}
                    onChange={(e) => setValY(e.target.value)}
                    placeholder="Enter Y"
                    className="h-12 bg-muted/50 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleReset} className="h-10 px-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="percentage-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(20,184,166,0.05))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(20,184,166,0.1))] p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium tracking-wide text-primary uppercase">Result</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!isComplete}
                className="h-8 text-primary hover:bg-primary/10 hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy result</span>
              </Button>
            </div>

            <div className="mt-2 space-y-6">
              {isComplete && resultData.result !== null ? (
                <>
                  <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-primary/20 bg-background/50 p-6 text-center backdrop-blur-sm">
                    <span className="text-4xl font-bold text-foreground">
                      {formatNumber(resultData.result)}
                      {calcType !== "percent_of" && <span className="text-2xl text-muted-foreground">%</span>}
                    </span>
                    <span className="text-sm text-muted-foreground mt-2">{CALC_TYPES[calcType].desc}</span>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
                    <h4 className="text-sm font-medium text-foreground">How it&apos;s calculated</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="font-mono bg-muted/50 p-2 rounded-md">{resultData.formula}</p>
                      <p className="font-mono bg-muted/50 p-2 rounded-md text-foreground">{resultData.steps}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-border bg-background/50 p-6 text-center">
                  <Calculator className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Enter both values to see the result and formula</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {isComplete && resultData.result !== null && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-border/50 bg-background/90 p-2 shadow-lg backdrop-blur-xl md:hidden">
          <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-10 px-4 rounded-full" onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Percentage Result", text: `${formatNumber(resultData.result!)}` });
            }
          }}>
            Share
          </Button>
          <Button variant="default" size="sm" className="h-10 px-4 rounded-full">
            Save Result
          </Button>
        </div>
      )}
    </div>
  );
}
