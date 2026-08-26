import type { BoundingBox } from "@repo/types";

interface PixelCoords {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function useHighlightRegion() {
  const convertToPixelCoords = (
    bbox: BoundingBox,
    pageWidth: number,
    pageHeight: number
  ): PixelCoords => ({
    top: (bbox.ymin / 1000) * pageHeight,
    left: (bbox.xmin / 1000) * pageWidth,
    width: ((bbox.xmax - bbox.xmin) / 1000) * pageWidth,
    height: ((bbox.ymax - bbox.ymin) / 1000) * pageHeight,
  });

  const getHighlightColor = (isCorrect: boolean, confidence: number) => {
    if (confidence < 0.5) return "rgba(234, 179, 8, 0.3)";
    if (isCorrect) return "rgba(34, 197, 94, 0.3)";
    return "rgba(239, 68, 68, 0.3)";
  };

  const getBorderColor = (isCorrect: boolean, confidence: number) => {
    if (confidence < 0.5) return "rgba(234, 179, 8, 0.8)";
    if (isCorrect) return "rgba(34, 197, 94, 0.8)";
    return "rgba(239, 68, 68, 0.8)";
  };

  return { convertToPixelCoords, getHighlightColor, getBorderColor };
}
