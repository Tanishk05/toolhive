"use client";

import { useState, useEffect, useCallback } from "react";
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

type Strength = "weak" | "fair" | "good" | "strong";

export function PasswordGeneratorLayout() {
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [strength, setStrength] = useState<Strength>("good");

  const generatePassword = useCallback(() => {
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      setPassword("");
      return;
    }

    let charset = "";
    if (useUppercase) charset += CHAR_SETS.uppercase;
    if (useLowercase) charset += CHAR_SETS.lowercase;
    if (useNumbers) charset += CHAR_SETS.numbers;
    if (useSymbols) charset += CHAR_SETS.symbols;

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }

    setPassword(generated);
    
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    
    const variety = [useUppercase, useLowercase, useNumbers, useSymbols].filter(Boolean).length;
    score += variety - 1; // 0 to 3 extra points

    if (score < 2) setStrength("weak");
    else if (score < 4) setStrength("fair");
    else if (score < 6) setStrength("good");
    else setStrength("strong");

    // Track generation (never track the password itself)
    analytics.track({
      name: "password_generated",
      properties: {
        tool_slug: "password-generator",
        length,
        options: [
          useUppercase && "uppercase",
          useLowercase && "lowercase",
          useNumbers && "numbers",
          useSymbols && "symbols",
        ].filter(Boolean).join(","),
      }
    });
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  useEffect(() => {
    // eslint-disable-next-line
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password", err);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case "weak": return "bg-red-500";
      case "fair": return "bg-yellow-500";
      case "good": return "bg-blue-500";
      case "strong": return "bg-emerald-500";
      default: return "bg-muted";
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case "weak": return "Weak";
      case "fair": return "Fair";
      case "good": return "Good";
      case "strong": return "Strong";
      default: return "";
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
            <p className="text-sm text-muted-foreground">Adjust the parameters to generate a new password.</p>
          </div>

          <div className="space-y-8">
            {/* Length Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password Length</label>
                <div className="flex w-20 items-center gap-2">
                  <Input
                    type="number"
                    min="8"
                    max="128"
                    value={length}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 8 && val <= 128) setLength(val);
                    }}
                    className="h-8 px-2 text-center text-sm font-semibold"
                  />
                </div>
              </div>
              <input
                type="range"
                min="8"
                max="128"
                step="1"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Uppercase Letters (A-Z)</span>
                <input
                  type="checkbox"
                  checked={useUppercase}
                  onChange={(e) => setUseUppercase(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Lowercase Letters (a-z)</span>
                <input
                  type="checkbox"
                  checked={useLowercase}
                  onChange={(e) => setUseLowercase(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Numbers (0-9)</span>
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">Symbols (!@#$...)</span>
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-primary"
                />
              </label>
            </div>
            
            {!useUppercase && !useLowercase && !useNumbers && !useSymbols && (
              <p className="text-xs font-medium text-destructive">Please select at least one character set.</p>
            )}
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="password-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(20,184,166,0.05))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(15,23,42,0.8),rgba(20,184,166,0.1))] p-6 sm:p-8">
            
            <div className="mb-4">
              <p className="text-sm font-medium tracking-wide text-primary uppercase flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Generated Password
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center space-y-6">
              <div className="w-full break-all rounded-2xl border border-border bg-background/80 p-6 text-center text-2xl font-bold tracking-wider text-foreground shadow-inner backdrop-blur-sm sm:text-3xl font-mono">
                {password || "---"}
              </div>
              
              {/* Strength Meter */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>Strength</span>
                  <span className={`${
                    strength === "weak" ? "text-red-500" :
                    strength === "fair" ? "text-yellow-500" :
                    strength === "good" ? "text-blue-500" : "text-emerald-500"
                  }`}>{getStrengthLabel()}</span>
                </div>
                <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full flex-1 transition-all duration-500 ${strength === "weak" || strength === "fair" || strength === "good" || strength === "strong" ? getStrengthColor() : "bg-transparent"}`} />
                  <div className={`h-full flex-1 transition-all duration-500 ${strength === "fair" || strength === "good" || strength === "strong" ? getStrengthColor() : "bg-transparent"}`} />
                  <div className={`h-full flex-1 transition-all duration-500 ${strength === "good" || strength === "strong" ? getStrengthColor() : "bg-transparent"}`} />
                  <div className={`h-full flex-1 transition-all duration-500 ${strength === "strong" ? getStrengthColor() : "bg-transparent"}`} />
                </div>
              </div>

              <div className="flex w-full gap-4 pt-4">
                <button
                  onClick={generatePassword}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!password}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </Card>
      </div>
    </div>
  );
}
