"use client";

import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { FileImage, FileType, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrSettings } from "./qr-customization";
import { downloadPng, downloadSvg, downloadPdf } from "../lib/qr-export";

type Props = {
  value: string;
  settings: QrSettings;
};

const QR_CANVAS_ID = "qr-canvas-export";
const QR_SVG_ID = "qr-svg-export";

export function QrPreview({ value, settings }: Props) {
  return (
    <div className="sticky top-28 flex flex-col gap-6">
      {/* Visual Preview */}
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-inner">
        <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10" style={{ backgroundColor: settings.bgColor }}>
          <QRCodeSVG
            value={value}
            size={Math.min(settings.size, 300)} // Visual preview is capped to fit layout
            fgColor={settings.fgColor}
            bgColor={settings.bgColor}
            level={settings.level}
            includeMargin={true}
          />
        </div>
      </div>

      {/* Hidden high-res elements for export */}
      <div className="hidden">
        <QRCodeCanvas
          id={QR_CANVAS_ID}
          value={value}
          size={settings.size}
          fgColor={settings.fgColor}
          bgColor={settings.bgColor}
          level={settings.level}
          includeMargin={true}
        />
        <QRCodeSVG
          id={QR_SVG_ID}
          value={value}
          size={settings.size}
          fgColor={settings.fgColor}
          bgColor={settings.bgColor}
          level={settings.level}
          includeMargin={true}
        />
      </div>

      {/* Downloads */}
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">Download</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col gap-2 py-6 text-slate-300 hover:text-white"
            onClick={() => downloadPng(QR_CANVAS_ID, "toolhive-qr")}
          >
            <FileImage className="h-5 w-5" />
            <span className="text-xs">PNG</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-2 py-6 text-slate-300 hover:text-white"
            onClick={() => downloadSvg(QR_SVG_ID, "toolhive-qr")}
          >
            <FileType className="h-5 w-5" />
            <span className="text-xs">SVG</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-2 py-6 text-slate-300 hover:text-white"
            onClick={() => downloadPdf(QR_CANVAS_ID, "toolhive-qr")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
