export const GEMINI_CONFIG = {
  MODEL: "gemini-3.6-flash",
  MAX_RETRIES: 3,
  TEMPERATURE: 0.1,
  MAX_OUTPUT_TOKENS: 8192,
} as const;

export const GEMINI_SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
] as const;
