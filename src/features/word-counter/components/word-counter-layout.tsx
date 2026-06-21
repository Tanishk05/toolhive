"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, RefreshCw, Type, AlignLeft, Hash, Clock, BookOpen, Volume2, Search, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

function countSyllables(word: string) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const match = word.match(/[aeiouy]{1,2}/g);
  return match !== null ? match.length : 1;
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);

export function WordCounterLayout() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 min",
        speakingTime: "0 min",
        readingLevel: "N/A",
        keywords: [] as { word: string; count: number; percentage: number }[],
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, "").length;
    
    // Split by words
    const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
    const words = wordsArray.length;

    // Sentences
    const sentencesArray = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentences = sentencesArray.length || 1;

    // Paragraphs
    const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphs = paragraphsArray.length;

    // Times
    const readTimeMinutes = Math.max(1, Math.ceil(words / 225));
    const speakTimeMinutes = Math.max(1, Math.ceil(words / 130));

    // Syllables and Reading Level
    let totalSyllables = 0;
    const wordCounts: Record<string, number> = {};

    wordsArray.forEach(w => {
      totalSyllables += countSyllables(w);
      const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanWord.length > 1) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    // Flesch-Kincaid Grade Level
    let grade = 0;
    if (words > 0 && sentences > 0) {
      grade = 0.39 * (words / sentences) + 11.8 * (totalSyllables / words) - 15.59;
    }
    
    let readingLevel = "College Level";
    if (grade < 6) readingLevel = "5th Grade (Easy)";
    else if (grade < 8) readingLevel = "7th Grade (Fairly Easy)";
    else if (grade < 10) readingLevel = "9th Grade (Standard)";
    else if (grade < 12) readingLevel = "11th Grade (Fairly Difficult)";
    else if (grade < 16) readingLevel = "College (Difficult)";
    else readingLevel = "Graduate (Very Difficult)";

    // Keyword Density
    const validKeywords = Object.entries(wordCounts)
      .filter(([w]) => !STOP_WORDS.has(w) && w.length > 2)
      .map(([w, c]) => ({
        word: w,
        count: c,
        percentage: (c / words) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: `${readTimeMinutes} min`,
      speakingTime: `${speakTimeMinutes} min`,
      readingLevel,
      keywords: validKeywords,
    };
  }, [text]);

  // Analytics
  useEffect(() => {
    if (stats.words > 0) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "word_counted",
          properties: {
            tool_slug: "word-counter",
            word_count: stats.words,
            char_count: stats.characters,
          }
        });
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [stats.words, stats.characters]);

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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Text</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!text}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!text} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to begin analysis..."
            className="min-h-[400px] w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            spellCheck={false}
          />
        </Card>
        
        <AdUnit format="horizontal" slotId="word-counter-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(168,85,247,0.05),rgba(217,70,239,0.05))] dark:bg-[linear-gradient(135deg,rgba(168,85,247,0.1),rgba(15,23,42,0.8),rgba(217,70,239,0.1))] p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium tracking-wide text-primary uppercase">Text Statistics</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1"><Type className="w-3 h-3"/> Words</p>
                <p className="text-2xl font-bold text-foreground">{stats.words.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1"><Hash className="w-3 h-3"/> Characters</p>
                <p className="text-2xl font-bold text-foreground">{stats.characters.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-background/30 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">No Spaces</p>
                <p className="text-lg font-semibold text-foreground">{stats.charactersNoSpaces.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/30 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex justify-center items-center gap-1"><AlignLeft className="w-3 h-3"/> Sentences</p>
                <p className="text-lg font-semibold text-foreground">{stats.sentences.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/30 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Paragraphs</p>
                <p className="text-lg font-semibold text-foreground">{stats.paragraphs.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" /> Reading Time
                </span>
                <span className="font-semibold text-foreground">{stats.readingTime}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Volume2 className="h-4 w-4" /> Speaking Time
                </span>
                <span className="font-semibold text-foreground">{stats.speakingTime}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> Reading Level
                </span>
                <span className="text-xs font-semibold text-foreground bg-primary/10 text-primary px-2 py-1 rounded-md">{stats.readingLevel}</span>
              </div>
            </div>
            
            {stats.keywords.length > 0 && (
              <div className="mt-8">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Search className="h-4 w-4 text-primary" /> Keyword Density
                </h4>
                <div className="space-y-2">
                  {stats.keywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="truncate pr-4 text-muted-foreground">{kw.word}</span>
                      <div className="flex items-center gap-3">
                        <span className="w-8 text-right font-medium text-foreground">{kw.count}</span>
                        <span className="w-12 text-right text-xs text-muted-foreground">{kw.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </Card>
      </div>
    </div>
  );
}
