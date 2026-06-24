"use client";

import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { FileImage, FileType, FileText, Copy, Share2 } from "lucide-react";
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
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm p-4 bg-white">
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
      <div className="space-y-4 sticky bottom-16 z-40 bg-background/95 backdrop-blur border-t md:border-t-0 border-border p-4 md:p-0 -mx-4 md:mx-0 md:static">
        <p className="hidden md:block text-xs font-semibold tracking-wider text-muted-foreground uppercase">Export Options</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col gap-1 md:gap-2 py-4 md:py-6 text-muted-foreground hover:text-foreground border-border hover:bg-muted"
            onClick={() => downloadPng(QR_CANVAS_ID, "toolhive-qr")}
          >
            <FileImage className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-[10px] md:text-xs font-medium">PNG</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-1 md:gap-2 py-4 md:py-6 text-muted-foreground hover:text-foreground border-border hover:bg-muted"
            onClick={() => downloadSvg(QR_SVG_ID, "toolhive-qr")}
          >
            <FileType className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-[10px] md:text-xs font-medium">SVG</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col gap-1 md:gap-2 py-4 md:py-6 text-muted-foreground hover:text-foreground border-border hover:bg-muted"
            onClick={() => downloadPdf(QR_CANVAS_ID, "toolhive-qr")}
          >
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-[10px] md:text-xs font-medium">PDF</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button variant="secondary" className="w-full text-foreground hover:bg-muted/80">
            <Copy className="h-4 w-4 mr-2" />
            Copy Image
          </Button>
          <Button variant="secondary" className="w-full text-foreground hover:bg-muted/80">
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
        </div>
      </div>
    </div>
  );
}
