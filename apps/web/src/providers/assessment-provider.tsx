"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AssessmentResult, MappedAnswer, ExtractedAnswer } from "@repo/types";

interface AssessmentContextValue {
  result: AssessmentResult | null;
  setResult: (result: AssessmentResult) => void;
  clearResult: () => void;
  expandedQuestionIds: Set<string>;
  toggleQuestionExpanded: (id: string) => void;
  setAllExpanded: (expand: boolean) => void;
  getQuestionMapping: (questionId: string) => MappedAnswer | undefined;
  getQuestionAnswers: (questionNumber: string) => ExtractedAnswer[];
  answerSheetData: ArrayBuffer | null;
  setAnswerSheetData: (data: ArrayBuffer) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<AssessmentResult | null>(null);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(new Set());
  const [answerSheetData, setAnswerSheetDataState] = useState<ArrayBuffer | null>(null);

  const setResult = useCallback((r: AssessmentResult) => {
    setResultState(r);
    setExpandedQuestionIds(new Set());
  }, []);

  const clearResult = useCallback(() => {
    setResultState(null);
    setExpandedQuestionIds(new Set());
    setAnswerSheetDataState(null);
  }, []);

  const toggleQuestionExpanded = useCallback((id: string) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setAllExpanded = useCallback((expand: boolean) => {
    if (expand) {
      setExpandedQuestionIds((prev) => {
        return new Set();
      });
    } else {
      setExpandedQuestionIds(new Set());
    }
  }, []);

  const setAnswerSheetData = useCallback((data: ArrayBuffer) => {
    setAnswerSheetDataState(data.slice(0));
  }, []);

  const getQuestionMapping = useCallback(
    (questionId: string) => result?.mapping.find((m) => m.questionId === questionId),
    [result]
  );

  const getQuestionAnswers = useCallback(
    (questionNumber: string) =>
      result?.answers.filter((a) => a.questionNumber === questionNumber) ?? [],
    [result]
  );

  return (
    <AssessmentContext.Provider
      value={{
        result,
        setResult,
        clearResult,
        expandedQuestionIds,
        toggleQuestionExpanded,
        setAllExpanded,
        getQuestionMapping,
        getQuestionAnswers,
        answerSheetData,
        setAnswerSheetData,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
