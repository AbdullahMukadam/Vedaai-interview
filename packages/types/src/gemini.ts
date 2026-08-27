export interface GeminiQuestionExtraction {
  questions: Array<{
    number: string;
    text: string;
    subPart?: string;
    pageNumber: number;
  }>;
}

export interface GeminiAnswerExtraction {
  answers: Array<{
    questionNumber: string;
    text: string;
    boundingBox: {
      ymin: number;
      xmin: number;
      ymax: number;
      xmax: number;
    };
    questionBoundingBox?: {
      ymin: number;
      xmin: number;
      ymax: number;
      xmax: number;
    };
    pageNumber: number;
    isComplete: boolean;
  }>;
}

export interface GeminiMappingResult {
  mapping: Array<{
    questionNumber: string;
    answerText: string;
    score: number;
    maxScore: number;
    feedback: string;
    isCorrect: boolean;
    confidence: number;
  }>;
  overallFeedback: string;
}
