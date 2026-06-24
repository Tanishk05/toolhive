"use client";

import { useState, useEffect, useMemo } from "react";
import { Copy, Clock, CalendarDays, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type ConversionMode = "ts-to-date" | "date-to-ts";

export function TimestampConverterLayout() {
  const [mode, setMode] = useState<ConversionMode>("ts-to-date");
  
  // Current Time State
  const [nowTs, setNowTs] = useState<number>(0);
  
  // TS to Date State
  const [timestampInput, setTimestampInput] = useState<string>("");
  
  // Date to TS State
  const [dateString, setDateString] = useState<string>(new Date().toISOString().slice(0, 16));

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowTs(Math.floor(Date.now() / 1000));
    const timer = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tsToDateResult = useMemo(() => {
    if (!timestampInput.trim()) return null;
    let ts = Number(timestampInput);
    if (isNaN(ts)) return null;
    
    // Auto-detect seconds vs milliseconds (if length > 10 it's likely ms)
    if (timestampInput.length > 11 || ts > 253402300799) {
      // it's already in ms, or it's a huge timestamp
    } else {
      ts = ts * 1000;
    }

    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return null;
      
      return {
        utc: d.toUTCString(),
        local: d.toString(),
        iso: d.toISOString(),
      };
    } catch {
      return null;
    }
  }, [timestampInput]);

  const dateToTsResult = useMemo(() => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      return {
        seconds: Math.floor(d.getTime() / 1000),
        milliseconds: d.getTime()
      };
    } catch {
      return null;
    }
  }, [dateString]);

  const handleCopy = async (text: string | number, id: string) => {
    await navigator.clipboard.writeText(text.toString());
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    
    analytics.track({
      name: "timestamp_converted",
      properties: {
        tool_slug: "timestamp-converter",
        action: "copied",
        type: id
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        {/* Current Timestamp Card */}
        <Card className="p-6 sm:p-8 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Current Epoch Time</h2>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-4xl font-bold tracking-tight text-foreground bg-background rounded-lg p-4 border border-border flex-1 text-center shadow-inner">
              {nowTs}
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleCopy(nowTs, "current-sec")} className="w-full sm:w-auto font-medium">
                {copied === "current-sec" ? <Check className="mr-2 h-4 w-4 text-green-400" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Seconds
              </Button>
              <Button variant="outline" onClick={() => handleCopy(nowTs * 1000, "current-ms")} className="w-full sm:w-auto font-medium bg-background">
                {copied === "current-ms" ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Millis
              </Button>
            </div>
          </div>
        </Card>

        {/* Converter Card */}
        <Card className="p-6 sm:p-8">
          <div className="flex rounded-lg bg-muted/50 p-1 mb-6">
            <button
              onClick={() => setMode("ts-to-date")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${mode === "ts-to-date" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Clock className="h-4 w-4" />
              Timestamp to Date
            </button>
            <button
              onClick={() => setMode("date-to-ts")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${mode === "date-to-ts" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <CalendarDays className="h-4 w-4" />
              Date to Timestamp
            </button>
          </div>

          {mode === "ts-to-date" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Enter Unix Timestamp</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="e.g. 1718873400"
                    className="h-12 bg-muted/50 font-mono text-lg placeholder:text-muted-foreground/50"
                  />
                  <Button variant="outline" onClick={() => setTimestampInput(nowTs.toString())} className="h-12 px-6">
                    Now
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Supports both seconds and milliseconds format natively.</p>
              </div>

              {tsToDateResult ? (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">GMT / UTC</label>
                      <button onClick={() => handleCopy(tsToDateResult.utc, "utc")} className="text-xs font-medium text-primary hover:underline">Copy</button>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border text-foreground font-medium">
                      {tsToDateResult.utc}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Your Local Time</label>
                      <button onClick={() => handleCopy(tsToDateResult.local, "local")} className="text-xs font-medium text-primary hover:underline">Copy</button>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border text-foreground font-medium">
                      {tsToDateResult.local}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">ISO 8601</label>
                      <button onClick={() => handleCopy(tsToDateResult.iso, "iso")} className="text-xs font-medium text-primary hover:underline">Copy</button>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border text-foreground font-mono text-sm">
                      {tsToDateResult.iso}
                    </div>
                  </div>
                </div>
              ) : timestampInput ? (
                <div className="pt-4 text-center text-destructive text-sm font-medium">Invalid timestamp format</div>
              ) : null}
            </div>
          )}

          {mode === "date-to-ts" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Local Date & Time</label>
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    step="1"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="h-12 bg-muted/50 font-medium"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const d = new Date();
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      setDateString(d.toISOString().slice(0, 16));
                    }} 
                    className="h-12 px-6"
                  >
                    Now
                  </Button>
                </div>
              </div>

              {dateToTsResult ? (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Seconds</label>
                        <button onClick={() => handleCopy(dateToTsResult.seconds, "ds-sec")} className="text-xs font-medium text-primary hover:underline">Copy</button>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border border-border text-foreground font-mono text-xl text-center font-bold">
                        {dateToTsResult.seconds}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Milliseconds</label>
                        <button onClick={() => handleCopy(dateToTsResult.milliseconds, "ds-ms")} className="text-xs font-medium text-primary hover:underline">Copy</button>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border border-border text-foreground font-mono text-xl text-center font-bold">
                        {dateToTsResult.milliseconds}
                      </div>
                    </div>
                  </div>
                </div>
              ) : dateString ? (
                <div className="pt-4 text-center text-destructive text-sm font-medium">Invalid date selected</div>
              ) : null}
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <AdUnit format="rectangle" slotId="timestamp-converter-sidebar-ad" />
        
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(14,165,233,0.05),rgba(6,182,212,0.05))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.1),rgba(15,23,42,0.8),rgba(6,182,212,0.1))] p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">Quick Reference</h3>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-foreground border-b border-border pb-1">What is Epoch Time?</p>
                <p className="text-muted-foreground leading-relaxed">
                  The Unix epoch (or Unix time/POSIX time) is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds.
                </p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="font-semibold text-foreground border-b border-border pb-1">Useful Ranges</p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-4 marker:text-primary/50">
                  <li><strong>0</strong> = Jan 01 1970</li>
                  <li><strong>1 Billion</strong> = Sep 09 2001</li>
                  <li><strong>2 Billion</strong> = May 18 2033 (Year 2038 Problem!)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
