"use client";

import { useState, useMemo, useEffect } from "react";
import { CalendarHeart, CalendarDays, Clock, Hourglass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

export function AgeCalculatorLayout() {
  const [dobStr, setDobStr] = useState<string>("1995-06-15");
  const [targetStr, setTargetStr] = useState<string>(() => new Date().toISOString().split("T")[0]);

  const { results } = useMemo(() => {
    const dobDate = new Date(dobStr);
    const targetDate = new Date(targetStr);

    if (isNaN(dobDate.getTime()) || isNaN(targetDate.getTime()) || dobDate > targetDate) {
      return { results: null };
    }

    let years = targetDate.getFullYear() - dobDate.getFullYear();
    let months = targetDate.getMonth() - dobDate.getMonth();
    let days = targetDate.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      const previousMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = targetDate.getTime() - dobDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBday = new Date(targetDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());
    if (nextBday < targetDate) {
      nextBday.setFullYear(targetDate.getFullYear() + 1);
    }
    
    // Normalize times to midnight to avoid timezone offsets causing -1 day diffs
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const bdayMidnight = new Date(nextBday.getFullYear(), nextBday.getMonth(), nextBday.getDate());
    
    const nextBdayDays = Math.floor((bdayMidnight.getTime() - targetMidnight.getTime()) / (1000 * 60 * 60 * 24));

    return {
      results: {
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        nextBdayDays,
      },
    };
  }, [dobStr, targetStr]);

  useEffect(() => {
    if (results) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "age_calculated",
          properties: {
            tool_slug: "age-calculator",
            years: results.years,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [results]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground">Date Details</h2>
            <p className="text-sm text-muted-foreground">Enter your birth date and the target date.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="dob" className="text-sm font-medium text-foreground">
                Date of Birth
              </label>
              <Input
                id="dob"
                type="date"
                value={dobStr}
                onChange={(e) => setDobStr(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="target" className="text-sm font-medium text-foreground">
                Target Date
              </label>
              <Input
                id="target"
                type="date"
                value={targetStr}
                onChange={(e) => setTargetStr(e.target.value)}
                className="h-12 text-lg"
              />
              <p className="text-xs text-muted-foreground">Leave as today to calculate current age.</p>
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="age-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(59,130,246,0.05))] dark:bg-[linear-gradient(135deg,rgba(225,29,72,0.1),rgba(15,23,42,0.8),rgba(249,115,22,0.1))] p-6 sm:p-8">
            
            {!results ? (
              <div className="flex h-48 items-center justify-center text-center">
                <p className="text-muted-foreground">Please enter a valid date of birth earlier than the target date.</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm font-medium tracking-wide text-primary uppercase">Exact Age</p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                      <span className="block text-3xl font-bold text-foreground sm:text-4xl">{results.years}</span>
                      <span className="mt-1 block text-xs font-medium text-muted-foreground uppercase">Years</span>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                      <span className="block text-3xl font-bold text-foreground sm:text-4xl">{results.months}</span>
                      <span className="mt-1 block text-xs font-medium text-muted-foreground uppercase">Months</span>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                      <span className="block text-3xl font-bold text-foreground sm:text-4xl">{results.days}</span>
                      <span className="mt-1 block text-xs font-medium text-muted-foreground uppercase">Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4 rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-medium text-foreground mb-4">Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Months:</span>
                      <span className="ml-auto font-semibold text-foreground">{results.totalMonths.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Weeks:</span>
                      <span className="ml-auto font-semibold text-foreground">{results.totalWeeks.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Days:</span>
                      <span className="ml-auto font-semibold text-foreground">{results.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hourglass className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Hours:</span>
                      <span className="ml-auto font-semibold text-foreground">{(results.totalDays * 24).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarHeart className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">Next Birthday</span>
                      </div>
                      <span className="font-bold text-primary">
                        {results.nextBdayDays === 0 ? "Today! 🎉" : `In ${results.nextBdayDays} days`}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
