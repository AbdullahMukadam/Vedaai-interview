"use client";

import { useEffect, useRef, useState } from "react";
import type { BoundingBox } from "@repo/types";

interface Highlight {
  questionLabel: string;
  boundingBox: BoundingBox;
}

interface PdfPageViewerProps {
  data: ArrayBuffer;
  pageNumber: number;
  scale: number;
  highlights: Highlight[];
  onTotalPages?: (count: number) => void;
}

export function PdfPageViewer({ data, pageNumber, scale, highlights, onTotalPages }: PdfPageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        setError(null);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const bufferCopy = data.slice(0);

        const pdf = await pdfjsLib.getDocument({ data: bufferCopy }).promise;
        if (!cancelled) onTotalPages?.(pdf.numPages);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.0 });

        if (cancelled) return;
        setDims({ w: viewport.width, h: viewport.height });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render PDF");
          console.error("PDF render error:", err);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [data, pageNumber]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative inline-block max-w-full">
      <canvas
        ref={canvasRef}
        className="block max-w-none"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      />

      {dims && highlights.map((h, i) => {
        const bb = h.boundingBox;
        const top = (bb.ymin / 1000) * dims.h * scale;
        const left = (bb.xmin / 1000) * dims.w * scale;
        const w = ((bb.xmax - bb.xmin) / 1000) * dims.w * scale;
        const ht = ((bb.ymax - bb.ymin) / 1000) * dims.h * scale;

        return (
          <div
            key={`${h.questionLabel}-${i}`}
            className="absolute border-2 border-[#3DD218] bg-[rgba(61,210,24,0.08)]"
            style={{
              top: top - 6,
              left: left - 6,
              width: w + 12,
              height: ht + 12,
              borderRadius: 12,
            }}
          >
            <div className="absolute -top-7 left-2 rounded-t-lg bg-[#34AC15] px-2 py-0.5">
              <span className="text-[12px] font-bold text-white">
                Q{h.questionLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
