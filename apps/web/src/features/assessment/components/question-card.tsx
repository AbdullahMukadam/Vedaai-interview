"use client";

import { motion, AnimatePresence } from "motion/react";

interface QuestionCardProps {
  number: number;
  text: string;
  score?: { earned: number; total: number };
  isExpanded?: boolean;
  aiFeedback?: string;
  isSelected?: boolean;
  isSubQuestion?: boolean;
  subLabel?: string;
  onToggleExpand?: () => void;
}

function getScoreColor(earned: number, total: number): {
  bg: string;
  text: string;
} {
  const ratio = earned / total;
  if (ratio === 1) return { bg: "rgba(69,181,41,0.1)", text: "#34AC15" };
  if (ratio >= 0.5) return { bg: "rgba(255,153,0,0.1)", text: "#E3600F" };
  return { bg: "#FFE9E2", text: "#C0350A" };
}

function ChevronDown({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="transition-transform duration-200"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#303030"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function QuestionCard({
  number,
  text,
  score,
  isExpanded = false,
  aiFeedback,
  isSelected = false,
  isSubQuestion = false,
  subLabel,
  onToggleExpand,
}: QuestionCardProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-3 transition-colors ${
        isSelected
          ? "border-2 border-[#FF8D36] bg-white"
          : "bg-white"
      }`}
    >
      <div
        className="flex items-start justify-between gap-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4">
          {isSubQuestion ? (
            <div className="flex items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(43,43,43,0.8)] shadow-[0px_4px_16px_rgba(67,67,67,0.1),0px_8px_8.8px_rgba(134,134,134,0.1)] ring-2 ring-white/25">
                <span className="text-[20px] font-extrabold tracking-[-0.04em] text-white">
                  {number}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F6F6]">
                <span className="text-[16px] font-bold text-[#303030]">
                  {subLabel}.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(43,43,43,0.8)] shadow-[0px_4px_16px_rgba(67,67,67,0.1),0px_8px_8.8px_rgba(134,134,134,0.1)] ring-2 ring-white/25">
              <span className="text-[20px] font-extrabold tracking-[-0.04em] text-white">
                {number}
              </span>
            </div>
          )}
        </div>

        <p className="flex-1 text-[16px] leading-[1.4em] tracking-[-0.04em] text-[#303030]">
          {text}
        </p>

        <div className="flex items-center gap-3">
          {score && (
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1 shrink-0"
              style={{ backgroundColor: getScoreColor(score.earned, score.total).bg }}
            >
              <span
                className="text-[16px] font-bold"
                style={{ color: getScoreColor(score.earned, score.total).text }}
              >
                {score.earned} / {score.total}
              </span>
            </div>
          )}

          <div className="flex h-8 items-center gap-2 rounded-lg bg-[#F6F6F6] px-1 shrink-0">
            <ChevronDown expanded={isExpanded} />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && aiFeedback && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-[#F6F6F6] p-4">
              <div className="flex flex-col gap-2.5">
                <span className="text-[16px] font-bold text-[#303030]">
                  AI Feedback
                </span>
                <p className="text-[14px] leading-[1.4em] tracking-[-0.04em] text-[#303030]">
                  {aiFeedback}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
