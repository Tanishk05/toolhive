"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowRightLeft, Ruler, Scale, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type Category = "length" | "weight" | "temperature";

type UnitDef = {
  id: string;
  name: string;
  symbol: string;
  multiplier?: number; // Relative to base unit (e.g. meter, kg). Undefined for temp.
};

const CATEGORIES: Record<Category, { icon: React.ReactNode; label: string; base: string; units: UnitDef[] }> = {
  length: {
    icon: <Ruler className="h-4 w-4" />,
    label: "Length",
    base: "meter",
    units: [
      { id: "meter", name: "Meter", symbol: "m", multiplier: 1 },
      { id: "kilometer", name: "Kilometer", symbol: "km", multiplier: 1000 },
      { id: "centimeter", name: "Centimeter", symbol: "cm", multiplier: 0.01 },
      { id: "millimeter", name: "Millimeter", symbol: "mm", multiplier: 0.001 },
      { id: "mile", name: "Mile", symbol: "mi", multiplier: 1609.344 },
      { id: "yard", name: "Yard", symbol: "yd", multiplier: 0.9144 },
      { id: "foot", name: "Foot", symbol: "ft", multiplier: 0.3048 },
      { id: "inch", name: "Inch", symbol: "in", multiplier: 0.0254 },
    ],
  },
  weight: {
    icon: <Scale className="h-4 w-4" />,
    label: "Weight",
    base: "kilogram",
    units: [
      { id: "kilogram", name: "Kilogram", symbol: "kg", multiplier: 1 },
      { id: "gram", name: "Gram", symbol: "g", multiplier: 0.001 },
      { id: "milligram", name: "Milligram", symbol: "mg", multiplier: 0.000001 },
      { id: "metric_ton", name: "Metric Ton", symbol: "t", multiplier: 1000 },
      { id: "pound", name: "Pound", symbol: "lb", multiplier: 0.45359237 },
      { id: "ounce", name: "Ounce", symbol: "oz", multiplier: 0.02834952 },
    ],
  },
  temperature: {
    icon: <Thermometer className="h-4 w-4" />,
    label: "Temperature",
    base: "celsius",
    units: [
      { id: "celsius", name: "Celsius", symbol: "°C" },
      { id: "fahrenheit", name: "Fahrenheit", symbol: "°F" },
      { id: "kelvin", name: "Kelvin", symbol: "K" },
    ],
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  // Convert to Celsius first
  let celsius = value;
  if (from === "fahrenheit") celsius = (value - 32) * 5 / 9;
  if (from === "kelvin") celsius = value - 273.15;

  // Convert from Celsius to Target
  if (to === "fahrenheit") return (celsius * 9 / 5) + 32;
  if (to === "kelvin") return celsius + 273.15;
  
  return celsius;
}

export function UnitConverterLayout() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [inputValue, setInputValue] = useState<string>("1");

  // Handle category changes gracefully
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(CATEGORIES[cat].units[0].id);
    setToUnit(CATEGORIES[cat].units[1]?.id || CATEGORIES[cat].units[0].id);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const parsedInput = parseFloat(inputValue);

  const result = useMemo(() => {
    if (isNaN(parsedInput)) return null;

    if (category === "temperature") {
      return convertTemperature(parsedInput, fromUnit, toUnit);
    }

    const catDef = CATEGORIES[category];
    const fromDef = catDef.units.find(u => u.id === fromUnit);
    const toDef = catDef.units.find(u => u.id === toUnit);

    if (!fromDef || !toDef || !fromDef.multiplier || !toDef.multiplier) return null;

    // Convert to base, then to target
    const baseValue = parsedInput * fromDef.multiplier;
    const targetValue = baseValue / toDef.multiplier;

    return targetValue;
  }, [category, fromUnit, toUnit, parsedInput]);

  useEffect(() => {
    if (result !== null && !isNaN(parsedInput)) {
      const timeoutId = setTimeout(() => {
        analytics.track({
          name: "unit_converted",
          properties: {
            tool_slug: "unit-converter",
            category,
            from_unit: fromUnit,
            to_unit: toUnit,
          }
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [category, fromUnit, toUnit, result, parsedInput]);

  const formatResult = (val: number | null) => {
    if (val === null) return "--";
    // Avoid scientific notation for reasonably small numbers, max 6 decimals
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 6,
      useGrouping: false,
    }).format(val);
  };

  const fromDef = CATEGORIES[category].units.find(u => u.id === fromUnit);
  const toDef = CATEGORIES[category].units.find(u => u.id === toUnit);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Select Category</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, def]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {def.icon}
                  {def.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative space-y-6">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors focus-within:border-primary/50">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-14 border-0 bg-transparent px-0 text-3xl font-bold shadow-none focus-visible:ring-0"
                  placeholder="0"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="h-14 w-1/3 cursor-pointer appearance-none rounded-xl bg-muted/50 px-4 font-medium text-foreground outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES[category].units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={handleSwap}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:scale-110 hover:border-primary/50 hover:text-primary"
                title="Swap units"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 shadow-sm">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">To</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex h-14 flex-1 items-center overflow-x-auto text-3xl font-bold text-foreground">
                  {formatResult(result)}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="h-14 w-1/3 cursor-pointer appearance-none rounded-xl bg-muted/50 px-4 font-medium text-foreground outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES[category].units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
        
        <AdUnit format="horizontal" slotId="unit-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(6,182,212,0.05),rgba(59,130,246,0.05))] dark:bg-[linear-gradient(135deg,rgba(6,182,212,0.1),rgba(15,23,42,0.8),rgba(59,130,246,0.1))] p-6 sm:p-8">
            <div className="mb-2">
              <p className="text-sm font-medium tracking-wide text-primary uppercase">Quick View</p>
            </div>

            <div className="mt-6 space-y-4">
               {fromDef && toDef && !isNaN(parsedInput) && result !== null && (
                 <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-border bg-background/50 p-6 text-center backdrop-blur-sm">
                   <span className="text-2xl font-bold text-foreground">
                     {formatResult(parsedInput)} <span className="text-base font-medium text-muted-foreground">{fromDef.symbol}</span>
                   </span>
                   <span className="text-muted-foreground">=</span>
                   <span className="text-3xl font-bold text-primary">
                     {formatResult(result)} <span className="text-xl font-medium text-primary/70">{toDef.symbol}</span>
                   </span>
                 </div>
               )}

               <div className="mt-4 rounded-xl border border-border bg-background/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Formula (approx): 1 {fromDef?.name} ≈ {formatResult(
                      category === "temperature" 
                        ? null // temp formulas aren't simple multipliers
                        : (fromDef?.multiplier && toDef?.multiplier) 
                          ? (fromDef.multiplier / toDef.multiplier) 
                          : null
                    )} {toDef?.name}
                  </p>
               </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
