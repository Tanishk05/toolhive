"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Trash2, Code2, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

interface DecodedToken {
   
  header: any;
   
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

export function JwtDecoderLayout() {
  const [input, setInput] = useState<string>("");
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  const decodeBase64Url = (base64Url: string) => {
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binString = window.atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
    return new TextDecoder().decode(bytes);
  };

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setDecoded(null);
      return;
    }

    try {
      const parts = input.trim().split(".");
      
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
      }

      const [headerB64, payloadB64, signature] = parts;

      const headerStr = decodeBase64Url(headerB64);
      const payloadStr = decodeBase64Url(payloadB64);

      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);

      setDecoded({
        header,
        payload,
        signature,
        isValid: true,
      });

    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Failed to decode JWT.";
      setDecoded({
        header: null,
        payload: null,
        signature: "",
        isValid: false,
        error: errorMsg,
      });
    }
  }, [input]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleDecode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // Track valid decodes (debounced)
  useEffect(() => {
    if (decoded?.isValid) {
      const timer = setTimeout(() => {
        analytics.track({
          name: "jwt_decoded",
          properties: {
            tool_slug: "jwt-decoder",
            has_payload: !!decoded.payload,
          }
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [decoded?.isValid, decoded?.payload]);

  const handleClear = () => {
    setInput("");
    setDecoded(null);
  };

  const copyPayload = async () => {
    if (!decoded?.payload) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch {
      console.error("Failed to copy payload");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm h-[600px]">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Code2 className="h-4 w-4 text-primary" />
                Encoded JWT
              </div>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT here... (e.g. eyJhbGci...)"
              className="w-full flex-1 resize-none bg-transparent p-6 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-0 break-all"
              spellCheck={false}
            />
          </Card>
          <AdUnit format="horizontal" slotId="jwt-sidebar-ad" />
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-6 h-[600px]">
          {decoded?.isValid === false && input.trim() !== "" ? (
             <Card className="flex flex-col items-center justify-center border-dashed border-2 border-destructive/50 bg-destructive/5 p-12 text-center h-full">
               <ShieldAlert className="mb-4 h-8 w-8 text-destructive opacity-80" />
               <h3 className="mb-2 text-lg font-semibold text-destructive">Invalid Token</h3>
               <p className="text-sm text-muted-foreground">{decoded.error}</p>
             </Card>
          ) : !decoded || !input.trim() ? (
             <Card className="flex flex-col items-center justify-center border-dashed border-2 border-border bg-muted/20 p-12 text-center h-full">
               <Code2 className="mb-4 h-8 w-8 text-muted-foreground opacity-50" />
               <p className="text-sm text-muted-foreground">Paste a JWT on the left to see the decoded components.</p>
             </Card>
          ) : (
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-6 h-full">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-rose-500 uppercase">Header</h3>
                  <span className="text-xs text-muted-foreground">Algorithm & Token Type</span>
                </div>
                <Card className="overflow-hidden border-rose-500/20 bg-[#0d1117] dark:bg-black/40">
                  <pre className="p-4 font-mono text-sm text-[#e5c07b] overflow-x-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </Card>
              </div>

              {/* Payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-purple-500 uppercase">Payload</h3>
                  <button
                    onClick={copyPayload}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copiedPayload ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedPayload ? "Copied" : "Copy Payload"}
                  </button>
                </div>
                <Card className="overflow-hidden border-purple-500/20 bg-[#0d1117] dark:bg-black/40">
                  <pre className="p-4 font-mono text-sm text-[#98c379] overflow-x-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </Card>
              </div>

              {/* Signature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-blue-500 uppercase">Signature</h3>
                  <span className="text-xs text-muted-foreground">HMAC / RSA Verification</span>
                </div>
                <Card className="overflow-hidden border-blue-500/20 bg-[#0d1117] dark:bg-black/40 p-4">
                  <p className="font-mono text-sm text-[#61afef] break-all leading-relaxed">
                    {decoded.signature}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
