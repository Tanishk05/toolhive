"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Copy, Download, RefreshCw, Type, AlignLeft, Code, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", 
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", 
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", 
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", 
  "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", 
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "pellentesque", "habitant", 
  "morbi", "tristique", "senectus", "netus", "malesuada", "fames", "ac", "turpis", "egestas", 
  "vestibulum", "tortor", "quam", "feugiat", "vitae", "ultricies", "eget", "tempor", "sit", "amet", 
  "ante", "donec", "eu", "libero", "sit", "amet", "quam", "egestas", "semper", "aenean", "ultricies", 
  "mi", "vitae", "est", "mauris", "placerat", "eleifend", "leo"
];

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(wordCount?: number) {
  const length = wordCount || Math.floor(Math.random() * 8) + 6;
  let sentence = "";
  for (let i = 0; i < length; i++) {
    sentence += getRandomWord() + " ";
  }
  return capitalizeFirstLetter(sentence.trim()) + ".";
}

function generateParagraph(sentenceCount?: number) {
  const length = sentenceCount || Math.floor(Math.random() * 4) + 4;
  let paragraph = "";
  for (let i = 0; i < length; i++) {
    paragraph += generateSentence() + " ";
  }
  return paragraph.trim();
}

type GeneratorMode = "words" | "sentences" | "paragraphs";

export function LoremGeneratorLayout() {
  const [mode, setMode] = useState<GeneratorMode>("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [asHtml, setAsHtml] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  
  // To trigger re-generation
  const [trigger, setTrigger] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generatedText = useMemo(() => {
    const result: string[] = [];
    const actualCount = Math.max(1, Math.min(1000, count));

    if (mode === "paragraphs") {
      for (let i = 0; i < actualCount; i++) {
        let p = generateParagraph();
        if (i === 0 && startWithLorem) {
          // Replace first 5 words with "Lorem ipsum dolor sit amet"
          const words = p.split(" ");
          words.splice(0, 5, "Lorem", "ipsum", "dolor", "sit", "amet,");
          p = words.join(" ");
        }
        result.push(asHtml ? `<p>${p}</p>` : p);
      }
    } else if (mode === "sentences") {
      for (let i = 0; i < actualCount; i++) {
        let s = generateSentence();
        if (i === 0 && startWithLorem) {
          const words = s.split(" ");
          words.splice(0, 5, "Lorem", "ipsum", "dolor", "sit", "amet,");
          s = words.join(" ");
        }
        result.push(s);
      }
    } else if (mode === "words") {
      const words = [];
      for (let i = 0; i < actualCount; i++) {
        words.push(getRandomWord());
      }
      if (startWithLorem && actualCount >= 5) {
        words.splice(0, 5, "lorem", "ipsum", "dolor", "sit", "amet");
      }
      words[0] = capitalizeFirstLetter(words[0] || "");
      result.push(words.join(" "));
    }

    const joinedText = mode === "paragraphs" && !asHtml ? result.join("\n\n") : result.join(asHtml ? "\n" : " ");
    return joinedText;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, startWithLorem, asHtml, trigger]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const timer = setTimeout(() => {
      analytics.track({
        name: "lorem_generated",
        properties: {
          tool_slug: "lorem-generator",
          mode: mode,
          count: count
        }
      });
    }, 2000);
    timerRef.current = timer;
    return () => clearTimeout(timer);
  }, [mode, count, startWithLorem, asHtml, trigger]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorem-ipsum-${Date.now()}.${asHtml ? 'html' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8 border-border bg-card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Lorem Ipsum Editor
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setTrigger(t => t + 1)} className="h-8">
                <RefreshCw className="mr-2 h-3 w-3" />
                Regenerate
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Amount</label>
              <div className="flex rounded-lg overflow-hidden border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="flex-1 border-0 rounded-none h-10 font-medium focus-visible:ring-0 px-3 border-r"
                />
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as GeneratorMode)}
                  className="h-10 border-0 bg-muted/50 px-3 text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between h-10">
                <Label htmlFor="start-lorem" className="text-sm font-medium leading-none cursor-pointer">
                  Start with &quot;Lorem ipsum...&quot;
                </Label>
                <Switch
                  id="start-lorem"
                  checked={startWithLorem}
                  onCheckedChange={setStartWithLorem}
                />
              </div>
              <div className="flex items-center justify-between h-10">
                <Label htmlFor="html-tags" className="text-sm font-medium leading-none cursor-pointer">
                  Include HTML Tags
                </Label>
                <Switch
                  id="html-tags"
                  checked={asHtml}
                  onCheckedChange={setAsHtml}
                  disabled={mode === "words" || mode === "sentences"}
                />
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-input bg-muted/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-input">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                {asHtml ? <Code className="h-3 w-3" /> : <AlignLeft className="h-3 w-3" />}
                Output Text
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs px-2 hover:bg-background">
                  {copied ? <Check className="mr-1 h-3 w-3 text-green-500" /> : <Copy className="mr-1 h-3 w-3" />}
                  Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload} className="h-7 text-xs px-2 hover:bg-background">
                  <Download className="mr-1 h-3 w-3" />
                  Save
                </Button>
              </div>
            </div>
            <textarea
              readOnly
              value={generatedText}
              className="w-full min-h-[300px] resize-y bg-transparent p-4 text-sm text-foreground focus:outline-none"
              spellCheck={false}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <AdUnit format="rectangle" slotId="lorem-generator-sidebar-ad" />
        
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(161,161,170,0.05),rgba(148,163,184,0.05))] dark:bg-[linear-gradient(135deg,rgba(161,161,170,0.1),rgba(15,23,42,0.8),rgba(148,163,184,0.1))] p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-medium tracking-wide text-primary uppercase border-b border-border pb-2">
              The History of Lorem Ipsum
            </h3>
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                &quot;Lorem ipsum dolor sit amet&quot; is not just random gibberish. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
              </p>
              <p>
                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, <em>consectetur</em>, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
              </p>
              <p>
                Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of <strong>&quot;de Finibus Bonorum et Malorum&quot;</strong> (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
              </p>
              <p className="pt-2 italic border-t border-border/50">
                The standard chunk of Lorem Ipsum used since the 1500s is reproduced here for those interested.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
