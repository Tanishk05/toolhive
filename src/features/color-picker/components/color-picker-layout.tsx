"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, Palette, Shuffle, Droplet, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

// Helper Functions
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (lum1: number, lum2: number) => {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export function ColorPickerLayout() {
  const [color, setColor] = useState("#6366f1"); // Primary indigo
  const [copied, setCopied] = useState<string | null>(null);

  // Gradient State
  const [gradColor1, setGradColor1] = useState("#6366f1");
  const [gradColor2, setGradColor2] = useState("#ec4899");
  
  // Random Palette State
  const [palette, setPalette] = useState<string[]>([]);

  const generateRandomPalette = () => {
    const newPalette = Array.from({ length: 5 }, () => 
      `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
    );
    setPalette(newPalette);
    
    analytics.track({
      name: "color_palette_generated",
      properties: {
        tool_slug: "color-picker",
      }
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateRandomPalette();
  }, []);

  const colorData = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const lum = getLuminance(rgb.r, rgb.g, rgb.b);
    const contrastWhite = getContrastRatio(lum, 1);
    const contrastBlack = getContrastRatio(lum, 0);

    // Harmonies
    const harmonies = {
      complementary: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      analogous1: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      analogous2: hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
      triadic1: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      triadic2: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    };

    return {
      hex: color.toUpperCase(),
      rgbStr: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hslStr: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      contrastWhite: contrastWhite.toFixed(2),
      contrastBlack: contrastBlack.toFixed(2),
      harmonies
    };
  }, [color]);



  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const cssGradient = `linear-gradient(135deg, ${gradColor1}, ${gradColor2})`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        {/* Main Color Picker Card */}
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Color Inspector
            </h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div 
                className="w-full h-32 rounded-xl shadow-inner border border-border" 
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="h-12 w-16 cursor-pointer rounded bg-transparent p-0 border-0" 
                />
                <Input 
                  value={color.toUpperCase()} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setColor(val);
                  }}
                  className="font-mono text-lg uppercase h-12"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="space-y-3">
              {colorData && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 border border-border">
                    <span className="text-sm font-semibold text-muted-foreground w-12">HEX</span>
                    <span className="font-mono text-sm">{colorData.hex}</span>
                    <button onClick={() => handleCopy(colorData.hex, "hex")} className="text-primary hover:text-primary/80">
                      {copied === "hex" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 border border-border">
                    <span className="text-sm font-semibold text-muted-foreground w-12">RGB</span>
                    <span className="font-mono text-sm">{colorData.rgbStr}</span>
                    <button onClick={() => handleCopy(colorData.rgbStr, "rgb")} className="text-primary hover:text-primary/80">
                      {copied === "rgb" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 border border-border">
                    <span className="text-sm font-semibold text-muted-foreground w-12">HSL</span>
                    <span className="font-mono text-sm">{colorData.hslStr}</span>
                    <button onClick={() => handleCopy(colorData.hslStr, "hsl")} className="text-primary hover:text-primary/80">
                      {copied === "hsl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {colorData && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium uppercase text-muted-foreground mb-4">WCAG Contrast</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border" style={{ backgroundColor: color }}>
                  <span className="text-white text-xl font-bold tracking-wider mb-2">Text on Color</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-black/20 text-white px-2 py-1 rounded text-xs font-mono">{colorData.contrastWhite}:1</span>
                    {Number(colorData.contrastWhite) >= 4.5 ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">PASS</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">FAIL</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border" style={{ backgroundColor: color }}>
                  <span className="text-black text-xl font-bold tracking-wider mb-2">Text on Color</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-black px-2 py-1 rounded text-xs font-mono">{colorData.contrastBlack}:1</span>
                    {Number(colorData.contrastBlack) >= 4.5 ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">PASS</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">FAIL</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Harmony & Palette Section */}
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Harmonies & Generator
            </h2>
          </div>
          
          {colorData && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Color Harmonies</p>
                <div className="flex gap-2 h-16">
                  <div 
                    className="flex-1 rounded-l-lg cursor-pointer hover:opacity-90 transition-opacity flex items-end justify-center pb-2" 
                    style={{ backgroundColor: color }}
                    onClick={() => setColor(color)}
                    title="Base Color"
                  />
                  <div 
                    className="flex-1 cursor-pointer hover:opacity-90 transition-opacity flex items-end justify-center pb-2" 
                    style={{ backgroundColor: colorData.harmonies.complementary }}
                    onClick={() => setColor(colorData.harmonies.complementary)}
                    title="Complementary"
                  />
                  <div 
                    className="flex-1 cursor-pointer hover:opacity-90 transition-opacity flex items-end justify-center pb-2" 
                    style={{ backgroundColor: colorData.harmonies.analogous1 }}
                    onClick={() => setColor(colorData.harmonies.analogous1)}
                    title="Analogous 1"
                  />
                  <div 
                    className="flex-1 cursor-pointer hover:opacity-90 transition-opacity flex items-end justify-center pb-2" 
                    style={{ backgroundColor: colorData.harmonies.triadic1 }}
                    onClick={() => setColor(colorData.harmonies.triadic1)}
                    title="Triadic 1"
                  />
                  <div 
                    className="flex-1 rounded-r-lg cursor-pointer hover:opacity-90 transition-opacity flex items-end justify-center pb-2" 
                    style={{ backgroundColor: colorData.harmonies.triadic2 }}
                    onClick={() => setColor(colorData.harmonies.triadic2)}
                    title="Triadic 2"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Random Palette</p>
                  <Button variant="ghost" size="sm" onClick={generateRandomPalette} className="h-8">
                    <Shuffle className="h-4 w-4 mr-2" /> Generate
                  </Button>
                </div>
                <div className="flex h-24 rounded-lg overflow-hidden border border-border">
                  {palette.map((p, i) => (
                    <div 
                      key={i} 
                      className="flex-1 cursor-pointer hover:scale-105 transition-transform origin-bottom" 
                      style={{ backgroundColor: p }}
                      onClick={() => {
                        handleCopy(p.toUpperCase(), `pal-${i}`);
                        setColor(p);
                      }}
                      title={`Click to copy: ${p.toUpperCase()}`}
                    >
                      <div className="h-full w-full flex items-end justify-center pb-2 opacity-0 hover:opacity-100 bg-black/20 text-white font-mono text-xs">
                        {copied === `pal-${i}` ? "Copied!" : p.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <AdUnit format="rectangle" slotId="color-picker-sidebar-ad" />
        
        {/* Gradient Generator */}
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="p-6 sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
              CSS Gradient Generator
            </h3>
            
            <div 
              className="w-full h-40 rounded-xl mb-6 shadow-inner border border-border" 
              style={{ background: cssGradient }}
            />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col flex-1 gap-2">
                <label className="text-xs text-muted-foreground">Color 1</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="h-8 w-8 cursor-pointer rounded p-0 border-0" />
                  <Input value={gradColor1.toUpperCase()} onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setGradColor1(e.target.value)} className="h-8 font-mono text-xs" />
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-6" />
              <div className="flex flex-col flex-1 gap-2">
                <label className="text-xs text-muted-foreground">Color 2</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="h-8 w-8 cursor-pointer rounded p-0 border-0" />
                  <Input value={gradColor2.toUpperCase()} onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setGradColor2(e.target.value)} className="h-8 font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground uppercase">CSS Code</label>
                <button onClick={() => handleCopy(`background: ${cssGradient};`, "css")} className="text-xs text-primary hover:underline">Copy</button>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border text-foreground font-mono text-xs break-all">
                background: {cssGradient};
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
