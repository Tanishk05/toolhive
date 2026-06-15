"use client";

import { useState, useMemo, useEffect } from "react";
import { IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type Operation = "add" | "remove";

const GST_RATES = [0, 3, 5, 12, 18, 28];

export function GstCalculatorLayout() {
  const [amountStr, setAmountStr] = useState<string>("1000");
  const [rate, setRate] = useState<number>(18);
  const [operation, setOperation] = useState<Operation>("add");

  const amount = parseFloat(amountStr) || 0;

  const results = useMemo(() => {
    if (operation === "add") {
      const gstAmount = amount * (rate / 100);
      const totalAmount = amount + gstAmount;
      return {
        base: amount,
        gst: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total: totalAmount,
      };
    } else {
      const baseAmount = amount / (1 + rate / 100);
      const gstAmount = amount - baseAmount;
      return {
        base: baseAmount,
        gst: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total: amount,
      };
    }
  }, [amount, rate, operation]);

  useEffect(() => {
    if (amount > 0) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "gst_calculated",
          properties: {
            tool_slug: "gst-calculator",
            amount,
            rate,
            operation,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [amount, rate, operation]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Calculation Details</h2>
              <p className="text-sm text-muted-foreground">Enter base amount and select GST slab</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setOperation("add")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  operation === "add" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Add GST
              </button>
              <button
                type="button"
                onClick={() => setOperation("remove")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  operation === "remove" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Remove GST
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="amount" className="text-sm font-medium text-foreground">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="pl-12 text-lg h-12"
                  placeholder="e.g. 1000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                GST Rate
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {GST_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`flex items-center justify-center rounded-xl border py-3 text-sm font-semibold transition-colors ${
                      rate === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="gst-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(59,130,246,0.05))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(59,130,246,0.1))] p-6 sm:p-8">
            <div className="mb-4">
              <p className="text-sm font-medium tracking-wide text-primary uppercase">Total Amount</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {formatCurrency(results.total)}
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Net Amount</span>
                <span className="font-semibold text-foreground">{formatCurrency(results.base)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">GST Amount ({rate}%)</span>
                <span className="font-semibold text-foreground">{formatCurrency(results.gst)}</span>
              </div>
              
              <div className="border-t border-border/50 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-muted-foreground">CGST ({rate / 2}%)</span>
                    <span className="mt-1 block font-medium text-foreground">{formatCurrency(results.cgst)}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">SGST ({rate / 2}%)</span>
                    <span className="mt-1 block font-medium text-foreground">{formatCurrency(results.sgst)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground">Quick Tip</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {operation === "add" 
              ? "Adding GST is useful when pricing products for end-consumers. You take the base price and add the tax on top."
              : "Removing GST is useful when you have a final retail price and need to extract the base value for accounting."}
          </p>
        </Card>
      </div>
    </div>
  );
}
