"use client";

import { useState, useRef, useEffect } from "react";
import { Download, UploadCloud, Image as ImageIcon, Unlock, Lock, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

type Preset = {
  label: string;
  width: number;
  height: number;
};

const PRESETS: Preset[] = [
  { label: "Instagram Post", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "LinkedIn Banner", width: 1584, height: 396 },
  { label: "Facebook Cover", width: 820, height: 312 },
  { label: "YouTube Thumbnail", width: 1280, height: 720 },
  { label: "X Header", width: 1500, height: 500 },
];

export function ImageResizerLayout() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  const [mode, setMode] = useState<"dimensions" | "percentage">("dimensions");
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [percentage, setPercentage] = useState<number>(100);
  const [maintainRatio, setMaintainRatio] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read the selected file into an image
  useEffect(() => {
    if (!imageFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageSrc(null);
       
      setOriginalWidth(0);
       
      setOriginalHeight(0);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageSrc(objectUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = objectUrl;

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Handle Dimension constraints
  const handleWidthChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setWidth("");
      return;
    }
    setWidth(num);
    if (maintainRatio && originalWidth > 0 && originalHeight > 0) {
      setHeight(Math.round((num * originalHeight) / originalWidth));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setHeight("");
      return;
    }
    setHeight(num);
    if (maintainRatio && originalWidth > 0 && originalHeight > 0) {
      setWidth(Math.round((num * originalWidth) / originalHeight));
    }
  };

  // Handle Preset
  const handlePresetClick = (preset: Preset) => {
    setMode("dimensions");
    setMaintainRatio(false);
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
      }
    }
  };

  const handleDownload = () => {
    if (!imageSrc || !imageFile) return;

    let targetWidth = 0;
    let targetHeight = 0;

    if (mode === "dimensions") {
      targetWidth = Number(width) || originalWidth;
      targetHeight = Number(height) || originalHeight;
    } else {
      targetWidth = Math.round((originalWidth * percentage) / 100);
      targetHeight = Math.round((originalHeight * percentage) / 100);
    }

    if (targetWidth <= 0 || targetHeight <= 0) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Try to preserve transparency if PNG/WebP, otherwise standard draw
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      const link = document.createElement("a");
      link.download = `resized-${targetWidth}x${targetHeight}-${imageFile.name}`;
      link.href = canvas.toDataURL(imageFile.type);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      analytics.track({
        name: "image_resized",
        properties: {
          tool_slug: "image-resizer",
          width: targetWidth,
          height: targetHeight,
        }
      });
    };
    img.src = imageSrc;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div className="flex flex-col gap-6">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Upload Image</h2>
            {imageFile && (
              <Button variant="ghost" size="sm" onClick={() => setImageFile(null)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <RefreshCw className="mr-2 h-4 w-4" /> Start Over
              </Button>
            )}
          </div>
          
          {!imageSrc ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-6 transition-colors hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 font-medium text-foreground">Click or drag image to upload</p>
              <p className="mt-1 text-sm text-muted-foreground">Supports JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-muted/20">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
                <ImageIcon className="h-4 w-4 text-primary" />
                Original: {originalWidth} × {originalHeight} px
              </div>
              {/* Image Preview Container */}
              <div className="flex w-full items-center justify-center p-4 min-h-[300px]">
                { }
                <img 
                  src={imageSrc} 
                  alt="Preview" 
                  className="max-h-[500px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                />
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </Card>
        
        <AdUnit format="horizontal" slotId="image-resizer-infeed-ad" />
      </div>

      <div className="flex flex-col gap-6 order-first lg:order-last">
        <Card className="overflow-hidden border-primary/20 bg-card p-0 shadow-lg">
          <div className="bg-[linear-gradient(135deg,rgba(236,72,153,0.05),rgba(244,63,94,0.05))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.1),rgba(15,23,42,0.8),rgba(244,63,94,0.1))] p-6 sm:p-8">
            <h3 className="mb-6 text-sm font-medium tracking-wide text-primary uppercase">Resize Options</h3>

            <div className="space-y-6">
              <div className="flex rounded-lg bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("dimensions")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "dimensions" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  disabled={!imageSrc}
                >
                  Dimensions
                </button>
                <button
                  type="button"
                  onClick={() => setMode("percentage")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "percentage" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  disabled={!imageSrc}
                >
                  Percentage
                </button>
              </div>

              {mode === "dimensions" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Width (px)</label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        placeholder="Width"
                        disabled={!imageSrc}
                        className="bg-background"
                      />
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => setMaintainRatio(!maintainRatio)} 
                        disabled={!imageSrc}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
                        title={maintainRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                      >
                        {maintainRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Height (px)</label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        placeholder="Height"
                        disabled={!imageSrc}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">Presets</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          disabled={!imageSrc}
                          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Scale Percentage (%)</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="range"
                        min="10"
                        max="200"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                        disabled={!imageSrc}
                        className="flex-1"
                      />
                      <div className="w-16 rounded-md bg-background px-2 py-1 text-center text-sm font-medium border border-input">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background/50 p-4 text-center backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground mb-1">Estimated Output Size</p>
                    <p className="text-lg font-bold text-foreground">
                      {Math.round((originalWidth * percentage) / 100)} × {Math.round((originalHeight * percentage) / 100)} px
                    </p>
                  </div>
                </div>
              )}

              <Button
                size="lg"
                className="w-full mt-4"
                disabled={!imageSrc}
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Resized Image
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
