"use client";

import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type QrSettings = {
  fgColor: string;
  bgColor: string;
  size: number;
  level: "L" | "M" | "Q" | "H";
};

type Props = {
  settings: QrSettings;
  onChange: (settings: Partial<QrSettings>) => void;
};

export function QrCustomization({ settings, onChange }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Colors */}
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Colors</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Foreground</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">{settings.fgColor}</span>
              <input
                type="color"
                value={settings.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-border"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Background</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase">{settings.bgColor}</span>
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Options</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Size (px)</label>
              <span className="text-xs text-muted-foreground">{settings.size}</span>
            </div>
            <Input
              type="range"
              min="100"
              max="1000"
              step="10"
              value={settings.size}
              onChange={(e) => onChange({ size: parseInt(e.target.value, 10) })}
              className="h-2 w-full appearance-none rounded-full bg-border accent-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Error Correction</label>
            <Select
              value={settings.level}
              onChange={(e) => onChange({ level: e.target.value as "L" | "M" | "Q" | "H" })}
              size="sm"
            >
              <option value="L">Low (~7%)</option>
              <option value="M">Medium (~15%)</option>
              <option value="Q">Quartile (~25%)</option>
              <option value="H">High (~30%)</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
