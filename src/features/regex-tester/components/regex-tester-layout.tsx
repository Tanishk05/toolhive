"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Copy, FileCode2, BookOpen, Check, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

const COMMON_REGEX = [
  { name: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", flags: "g" },
  { name: "IP Address (v4)", pattern: "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", flags: "g" },
  { name: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", flags: "g" },
  { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", flags: "g" },
  { name: "Phone Number (US)", pattern: "^\\+?1?\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$", flags: "gm" },
];

const CHEAT_SHEET = [
  { char: ".", desc: "Any character except newline" },
  { char: "\\w", desc: "Word character [a-zA-Z0-9_]" },
  { char: "\\d", desc: "Digit [0-9]" },
  { char: "\\s", desc: "Whitespace (space, tab, newline)" },
  { char: "^", desc: "Start of string" },
  { char: "$", desc: "End of string" },
  { char: "[abc]", desc: "A single character of: a, b, or c" },
  { char: "[^abc]", desc: "Any single character except: a, b, or c" },
  { char: "a|b", desc: "Matches either a or b" },
  { char: "*", desc: "0 or more times" },
  { char: "+", desc: "1 or more times" },
  { char: "?", desc: "0 or 1 time" },
  { char: "{n,m}", desc: "Between n and m times" },
];

export function RegexTesterLayout() {
  const [pattern, setPattern] = useState<string>("[A-Z]\\w+");
  const [flags, setFlags] = useState<string>("g");
  const [testString, setTestString] = useState<string>("Hello World. This is a Regex Tester created by ToolHive. It is Great!");
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { matchCount, highlighted, errorMsg } = useMemo(() => {
    if (!pattern) return { matchCount: 0, highlighted: testString, errorMsg: null };

    let extractedParts: { type: 'text' | 'match', value: string, index: number }[] = [];
    let currentMatchCount = 0;
    let localErrorMsg: string | null = null;

    try {
      const re = new RegExp(pattern, flags);

      if (!re.global) {
        const match = re.exec(testString);
        if (!match) return { matchCount: 0, highlighted: testString, errorMsg: null };
        
        currentMatchCount = 1;
        extractedParts.push({ type: 'text', value: testString.substring(0, match.index), index: 0 });
        extractedParts.push({ type: 'match', value: match[0], index: 1 });
        extractedParts.push({ type: 'text', value: testString.substring(match.index + match[0].length), index: 2 });
      } else {
        let lastIndex = 0;
        let match;
        let i = 0;
        while ((match = re.exec(testString)) !== null && i < 2000) {
          if (match.index === re.lastIndex) {
            re.lastIndex++; 
          }
          if (match[0].length > 0) {
            currentMatchCount++;
            extractedParts.push({ type: 'text', value: testString.substring(lastIndex, match.index), index: i * 2 });
            extractedParts.push({ type: 'match', value: match[0], index: i * 2 + 1 });
            lastIndex = match.index + match[0].length;
          }
          i++;
        }
        extractedParts.push({ type: 'text', value: testString.substring(lastIndex), index: i * 2 + 2 });
      }
    } catch (e) {
      if (e instanceof Error) localErrorMsg = e.message;
      return { matchCount: 0, highlighted: testString, errorMsg: localErrorMsg };
    }

    const parts = extractedParts.map(part => {
      if (part.type === 'match') {
        return <mark key={part.index} className="bg-primary/30 text-primary rounded-sm px-0.5 border-b-2 border-primary/50 shadow-sm">{part.value}</mark>;
      }
      return part.value;
    });

    return { matchCount: currentMatchCount, highlighted: parts.length > 0 ? parts : testString, errorMsg: null };
  }, [pattern, flags, testString]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const timer = setTimeout(() => {
      if (pattern.length > 0) {
        analytics.track({
          name: "regex_tested",
          properties: {
            tool_slug: "regex-tester",
          }
        });
      }
    }, 2000);
    timerRef.current = timer;
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags]);

  const handleCopy = async () => {
    const fullRegex = `/${pattern}/${flags}`;
    await navigator.clipboard.writeText(fullRegex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (ex: typeof COMMON_REGEX[0]) => {
    setPattern(ex.pattern);
    setFlags(ex.flags);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        {/* Editor Card */}
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              Expression Editor
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Regular Expression</label>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!pattern} className="h-8">
                  {copied ? <Check className="mr-2 h-3 w-3 text-green-500" /> : <Copy className="mr-2 h-3 w-3" />}
                  Copy RegEx
                </Button>
              </div>
              
              <div className="flex rounded-xl border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                <div className="flex items-center justify-center bg-muted/50 px-4 border-r border-input text-muted-foreground font-mono text-lg font-semibold">
                  /
                </div>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="flex-1 border-0 rounded-none h-12 font-mono text-base focus-visible:ring-0 px-4"
                  spellCheck={false}
                />
                <div className="flex items-center justify-center bg-muted/50 px-2 border-l border-input text-muted-foreground font-mono text-lg font-semibold">
                  /
                </div>
                <Input
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g, i, m..."
                  className="w-16 border-0 rounded-none h-12 font-mono text-base focus-visible:ring-0 px-2 text-primary text-center"
                  spellCheck={false}
                />
              </div>
              {errorMsg && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Test String</label>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{matchCount} match{matchCount !== 1 ? 'es' : ''} found</span>
                  <Button variant="ghost" size="sm" onClick={() => setTestString("")} className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="relative rounded-xl border border-input shadow-sm overflow-hidden">
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Enter text to test your regex against..."
                  className="absolute inset-0 w-full h-full resize-y bg-transparent p-4 font-mono text-sm text-transparent caret-foreground focus:outline-none z-10"
                  spellCheck={false}
                  rows={8}
                />
                <div 
                  className="min-h-[192px] w-full p-4 font-mono text-sm text-foreground whitespace-pre-wrap break-words z-0 bg-muted/10"
                  aria-hidden="true"
                >
                  {highlighted}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="regex-tester-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        {/* Common Examples */}
        <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
          <div className="p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-foreground uppercase">
              Common Patterns
            </h3>
            <div className="flex flex-col gap-2">
              {COMMON_REGEX.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => loadExample(ex)}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-foreground">{ex.name}</span>
                  <span className="text-xs font-mono text-primary truncate w-full">/{ex.pattern}/{ex.flags}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Cheat Sheet */}
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(249,115,22,0.05),rgba(245,158,11,0.05))] dark:bg-[linear-gradient(135deg,rgba(249,115,22,0.1),rgba(15,23,42,0.8),rgba(245,158,11,0.1))] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
              <BookOpen className="h-4 w-4" /> Cheat Sheet
            </h3>
            
            <div className="space-y-2 mt-4">
              <ul className="space-y-2 text-sm">
                {CHEAT_SHEET.map((item, i) => (
                  <li key={i} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <span className="bg-background border border-border rounded px-1.5 py-0.5 font-mono text-xs text-primary font-semibold shrink-0">
                      {item.char}
                    </span>
                    <span className="text-muted-foreground text-xs text-right pl-4">
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
