"use client";

import { useCallback } from "react";
import { QuestionCard } from "./question-card";
import { useAssessment } from "@/providers/assessment-provider";

export function QuestionsPanel() {
  const { result, expandedQuestionIds, toggleQuestionExpanded } = useAssessment();

  const allExpanded =
    result && result.mapping.length > 0 && result.mapping.every((m) => expandedQuestionIds.has(m.questionId));

  const expandAll = useCallback(() => {
    if (!result) return;
    if (allExpanded) {
      result.mapping.forEach((m) => {
        if (expandedQuestionIds.has(m.questionId)) {
          toggleQuestionExpanded(m.questionId);
        }
      });
    } else {
      result.mapping.forEach((m) => {
        if (!expandedQuestionIds.has(m.questionId)) {
          toggleQuestionExpanded(m.questionId);
        }
      });
    }
  }, [allExpanded, result, expandedQuestionIds, toggleQuestionExpanded]);

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[20px] bg-white/50 p-4">
        <p className="text-[16px] text-[rgba(94,94,94,0.8)]">No questions extracted yet.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[20px] bg-white/50 p-4">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[16px] font-bold text-[#303030]">
          Extracted Questions ({result.questions.length})
        </span>
        <button
          type="button"
          onClick={expandAll}
          className="rounded-full cursor-pointer bg-white px-5 py-3 text-[14px] font-medium text-[#181818]"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-auto scrollbar-hide">
        {result.mapping.map((m) => {
          const question = result.questions.find((q) => q.id === m.questionId);
          if (!question) return null;

          const isExpanded = expandedQuestionIds.has(m.questionId);

          return (
            <div key={m.questionId}>
              <QuestionCard
                number={parseInt(question.number) || 0}
                text={question.text}
                score={{ earned: m.score, total: m.maxScore }}
                isExpanded={isExpanded}
                aiFeedback={m.feedback}
                isSelected={isExpanded}
                isSubQuestion={!!question.parentQuestionNumber}
                subLabel={question.subPart}
                onToggleExpand={() => toggleQuestionExpanded(m.questionId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
