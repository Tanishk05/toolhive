"use client";

import { useState, useMemo, useEffect } from "react";
import { IndianRupee, Percent } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

export function EmiCalculatorLayout() {
  const [principalStr, setPrincipalStr] = useState<string>("5000000");
  const [rateStr, setRateStr] = useState<string>("8.5");
  const [tenureStr, setTenureStr] = useState<string>("20");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const principal = parseFloat(principalStr) || 0;
  const annualRate = parseFloat(rateStr) || 0;
  const tenure = parseFloat(tenureStr) || 0;

  const results = useMemo(() => {
    if (principal <= 0 || annualRate <= 0 || tenure <= 0) return null;

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureType === "years" ? tenure * 12 : tenure;

    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = 
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;

    return {
      emi,
      totalInterest,
      totalPayment,
      principal,
    };
  }, [principal, annualRate, tenure, tenureType]);

  useEffect(() => {
    if (results && principal > 0) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "emi_calculated",
          properties: {
            tool_slug: "emi-calculator",
            principal,
            rate: annualRate,
            tenure_months: tenureType === "years" ? tenure * 12 : tenure,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [results, principal, annualRate, tenure, tenureType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const chartData = results
    ? [
        { name: "Principal Amount", value: results.principal, color: "hsl(var(--primary))" },
        { name: "Total Interest", value: results.totalInterest, color: "hsl(var(--destructive))" },
      ]
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground">Loan Details</h2>
            <p className="text-sm text-muted-foreground">Adjust the values below to calculate your EMI.</p>
          </div>

          <div className="space-y-8">
            {/* Principal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="principal" className="text-sm font-medium text-foreground">
                  Loan Amount
                </label>
                <div className="relative w-40">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <Input
                    id="principal"
                    type="number"
                    min="0"
                    value={principalStr}
                    onChange={(e) => setPrincipalStr(e.target.value)}
                    className="pl-9 font-semibold"
                  />
                </div>
              </div>
              <input
                type="range"
                min="100000"
                max="20000000"
                step="50000"
                value={principal}
                onChange={(e) => setPrincipalStr(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="rate" className="text-sm font-medium text-foreground">
                  Interest Rate (p.a)
                </label>
                <div className="relative w-40">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    <Percent className="h-4 w-4" />
                  </div>
                  <Input
                    id="rate"
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    value={rateStr}
                    onChange={(e) => setRateStr(e.target.value)}
                    className="pr-9 font-semibold"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={annualRate}
                onChange={(e) => setRateStr(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="tenure" className="text-sm font-medium text-foreground">
                  Loan Tenure
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tenure"
                    type="number"
                    min="1"
                    max={tenureType === "years" ? 30 : 360}
                    value={tenureStr}
                    onChange={(e) => setTenureStr(e.target.value)}
                    className="w-20 font-semibold"
                  />
                  <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTenureType("years");
                        if (tenureType === "months") setTenureStr((tenure / 12).toFixed(1));
                      }}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        tenureType === "years" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Yr
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTenureType("months");
                        if (tenureType === "years") setTenureStr((tenure * 12).toString());
                      }}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        tenureType === "months" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max={tenureType === "years" ? 30 : 360}
                step="1"
                value={tenure}
                onChange={(e) => setTenureStr(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="emi-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(59,130,246,0.05),rgba(139,92,246,0.05))] dark:bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(15,23,42,0.8),rgba(139,92,246,0.1))] p-6 sm:p-8">
            
            {!results ? (
              <div className="flex h-48 items-center justify-center text-center">
                <p className="text-muted-foreground">Please enter valid loan details to calculate EMI.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-sm font-medium tracking-wide text-primary uppercase">Monthly EMI</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {formatCurrency(results.emi)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background/50 p-4 backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground">Total Interest</p>
                    <p className="mt-1 font-semibold text-foreground">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4 backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground">Total Payment</p>
                    <p className="mt-1 font-semibold text-foreground">{formatCurrency(results.totalPayment)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-foreground mb-4 text-center">Breakdown</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: unknown) => formatCurrency(Number(value) || 0)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Interest</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
