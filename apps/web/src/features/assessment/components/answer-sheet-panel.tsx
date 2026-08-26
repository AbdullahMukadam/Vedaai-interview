"use client";

import { useMemo, useState, useCallback } from "react";
import { useAssessment } from "@/providers/assessment-provider";
import { PdfPageViewer } from "./pdf-page-viewer";

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.33 8H12.67" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3.33V12.67M3.33 8H12.67" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnswerSheetPanel() {
  const { result, expandedQuestionIds, answerSheetData } = useAssessment();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleTotalPages = useCallback((count: number) => {
    setTotalPages(count);
  }, []);

  const pageHighlights = useMemo(() => {
    if (!result) return [];

    return result.mapping
      .filter((m) => expandedQuestionIds.has(m.questionId))
      .flatMap((m) =>
        m.boundingBoxes
          .map((bb, i) => ({
            questionLabel: m.questionNumber,
            boundingBox: bb,
            page: m.pages[i] ?? m.pages[0] ?? 1,
          }))
          .filter((h) => h.page === page)
      );
  }, [result, expandedQuestionIds, page]);

  return (
    <div className="flex flex-1 flex-col rounded-[20px] border border-black/10 bg-white overflow-hidden">
      <div className="flex items-center justify-between bg-[#303030] px-4 md:px-6 py-3 shrink-0">
        <span className="hidden md:block text-[16px] font-bold text-white/80">
          Answer Sheet
        </span>
        <div className="w-full md:w-fit flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 p-1 py-1 md:px-3 md:py-2">
            <button type="button" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <MinusIcon />
            </button>
            <span className="text-[14px] font-bold text-white min-w-[40px] text-center">
              {zoom}%
            </span>
            <button type="button" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <PlusIcon />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/10 p-1 py-1 md:px-3 md:py-2">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))}>
              <ChevronLeft />
            </button>
            <span className="text-[14px] font-bold text-white">
              Page {page} of {totalPages}
            </span>
            <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto bg-gray-100 p-4 flex justify-center scrollbar-hide">
        {answerSheetData ? (
          <PdfPageViewer
            data={answerSheetData}
            pageNumber={page}
            scale={zoom / 100}
            highlights={pageHighlights}
            onTotalPages={handleTotalPages}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[16px] text-[rgba(94,94,94,0.8)]">No answer sheet loaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
