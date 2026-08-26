export const APP_CONSTANTS = {
  MAX_FILE_SIZE_MB: 50,
  SUPPORTED_MIME_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
  MAX_PDF_PAGES: 20,
  PROJECT_NAME: "Assessment Extraction",
} as const;

export const PROCESSING_STAGES = {
  CONVERTING: "Converting documents",
  EXTRACTING_QUESTIONS: "Extracting questions",
  EXTRACTING_ANSWERS: "Extracting answers",
  MAPPING_GRADING: "Mapping & grading",
  COMPLETE: "Complete",
} as const;

export type ProcessingStage =
  (typeof PROCESSING_STAGES)[keyof typeof PROCESSING_STAGES];
