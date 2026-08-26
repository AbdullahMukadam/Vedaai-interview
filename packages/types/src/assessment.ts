export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface ExtractedQuestion {
  id: string;
  number: string;
  text: string;
  subPart?: string;
  pageNumber: number;
  parentQuestionNumber?: string;
}

export interface ExtractedAnswer {
  id: string;
  questionNumber: string;
  text: string;
  boundingBox: BoundingBox;
  pageNumber: number;
  isComplete: boolean;
  pageWidth: number;
  pageHeight: number;
}

export interface MappedAnswer {
  questionId: string;
  questionNumber: string;
  answerText: string;
  score: number;
  maxScore: number;
  feedback: string;
  isCorrect: boolean;
  confidence: number;
  boundingBoxes: BoundingBox[];
  pages: number[];
}

export interface AssessmentResult {
  questions: ExtractedQuestion[];
  answers: ExtractedAnswer[];
  mapping: MappedAnswer[];
  overallFeedback: string;
  totalScore: number;
  totalMaxScore: number;
}

export interface ProcessedImage {
  pageIndex: number;
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}
