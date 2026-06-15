"use client";

import Image from "next/image";

import { useState, useRef, useEffect, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/ads/ad-unit";
import { analytics } from "@/lib/analytics";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ImageCompressorLayout() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  
  const [quality, setQuality] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        loadOriginalFile(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        loadOriginalFile(file);
      }
    }
  };

  const loadOriginalFile = (file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
  };

  const clearAll = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedBlob(null);
    setCompressedPreview(null);
    setQuality(80);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const compressImage = useCallback(async () => {
    if (!originalFile || !originalPreview) return;
    setIsCompressing(true);

    try {
      const img = new window.Image();
      img.src = originalPreview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get 2d context");
      ctx.drawImage(img, 0, 0);

      // If original is PNG, convert to WebP to actually allow lossy compression.
      // Otherwise, keep original format (JPEG/WebP)
      let outputType = originalFile.type;
      if (outputType === "image/png" || outputType === "image/gif") {
        outputType = "image/webp"; // WebP provides excellent compression
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedPreview(URL.createObjectURL(blob));
            
            // Analytics
            analytics.track({
              name: "image_compressed",
              properties: {
                tool_slug: "image-compressor",
                original_size: originalFile.size,
                compressed_size: blob.size,
                quality_setting: quality,
                output_type: outputType,
              }
            });
          }
          setIsCompressing(false);
        },
        outputType,
        quality / 100
      );
    } catch (err) {
      console.error("Compression failed", err);
      setIsCompressing(false);
    }
  }, [originalFile, originalPreview, quality]);

  // Re-compress when quality changes (debounced)
  useEffect(() => {
    if (originalFile) {
      const timer = setTimeout(() => {
        compressImage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [originalFile, quality, compressImage]);

  const handleDownload = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    
    // Create new filename based on original
    let extension = compressedBlob.type.split("/")[1] || "jpeg";
    if (extension === "jpeg") extension = "jpg";
    const baseName = originalFile?.name.split(".").slice(0, -1).join(".") || "compressed_image";
    
    a.download = `${baseName}_min.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      {!originalFile ? (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 border-border bg-card/50 p-12 text-center transition-colors hover:bg-muted/50">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex h-full w-full flex-col items-center justify-center rounded-xl p-8 ${isDragging ? "bg-primary/5 border-primary" : ""}`}
          >
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Drag & Drop Image</h3>
            <p className="mb-6 text-sm text-muted-foreground">Supports JPEG, PNG, WebP up to 50MB</p>
            
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              Browse Files
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          
          {/* Controls sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Settings</h3>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Compression Quality</label>
                    <div className="flex w-16 items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1 && val <= 100) setQuality(val);
                        }}
                        className="h-8 px-2 text-center text-sm font-semibold"
                      />
                      <span className="text-sm font-medium text-muted-foreground">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                  <p className="text-xs text-muted-foreground">Lower quality = smaller file size</p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Original Size</span>
                    <span className="font-mono text-sm font-semibold">{formatBytes(originalFile.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Size</span>
                    <span className="font-mono text-sm font-bold text-primary">
                      {compressedBlob ? formatBytes(compressedBlob.size) : "Compressing..."}
                    </span>
                  </div>
                  
                  {compressedBlob && (
                    <div className="pt-2 border-t border-border mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Saved Space</span>
                        <span className="font-bold text-emerald-500">
                          {Math.max(0, 100 - (compressedBlob.size / originalFile.size) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download Compressed Image
                </button>
              </div>
            </Card>

            <AdUnit format="horizontal" slotId="compressor-sidebar-ad" />
          </div>

          {/* Previews */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                
                {/* Original Preview */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Original
                  </div>
                  <div className="relative flex aspect-square sm:aspect-[4/3] items-center justify-center bg-[#0d1117] dark:bg-black/40 p-4">
                    {originalPreview && (
                      <>
                        <Image src={originalPreview} alt="Original" fill className="object-contain drop-shadow-md" unoptimized />
                      </>
                    )}
                  </div>
                </div>

                {/* Compressed Preview */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Compressed
                  </div>
                  <div className="relative flex aspect-square sm:aspect-[4/3] items-center justify-center bg-[#0d1117] dark:bg-black/40 p-4">
                    {compressedPreview ? (
                      <>
                        <Image src={compressedPreview} alt="Compressed" fill className="object-contain drop-shadow-md" unoptimized />
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-sm text-muted-foreground/50">
                        Compressing...
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
