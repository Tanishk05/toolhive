"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QrContentForm } from "./qr-content-form";
import { QrCustomization, type QrSettings } from "./qr-customization";
import { QrPreview } from "./qr-preview";
import { defaultQrData, generateQrValue, type QrData } from "../lib/qr-formats";
import { AdUnit } from "@/components/ads/ad-unit";

export function QrGeneratorLayout() {
  const [data, setData] = useState<QrData>(defaultQrData);
  const [settings, setSettings] = useState<QrSettings>({
    fgColor: "#000000",
    bgColor: "#ffffff",
    size: 500,
    level: "H",
  });

  const handleDataChange = (updates: Partial<QrData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleSettingsChange = (updates: Partial<QrSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const qrValue = generateQrValue(data);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Content</h2>
            <p className="text-sm text-slate-400">Select format and enter details</p>
          </div>
          <QrContentForm data={data} onChange={handleDataChange} />
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Customization</h2>
            <p className="text-sm text-slate-400">Tweak colors, size, and error correction</p>
          </div>
          <QrCustomization settings={settings} onChange={handleSettingsChange} />
        </Card>
      </div>

      <div className="order-first lg:order-last">
        <QrPreview value={qrValue} settings={settings} />
        <AdUnit format="rectangle" slotId="qr-sidebar-ad" className="mt-6 hidden lg:flex" />
      </div>
    </div>
  );
}
