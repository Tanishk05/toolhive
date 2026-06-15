import { jsPDF } from "jspdf";

export function downloadPng(canvasId: string, filename: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const url = canvas.toDataURL("image/png");
  triggerDownload(url, `${filename}.png`);
}

export function downloadSvg(svgId: string, filename: string) {
  const svg = document.getElementById(svgId) as unknown as SVGSVGElement;
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  triggerDownload(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

export function downloadPdf(canvasId: string, filename: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const imgData = canvas.toDataURL("image/png");
  // A4 size: 210 x 297 mm
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calculate size to center the QR code (e.g., 100x100 mm)
  const size = 100;
  const x = (210 - size) / 2;
  const y = (297 - size) / 2;

  pdf.addImage(imgData, "PNG", x, y, size, size);
  pdf.save(`${filename}.pdf`);
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
