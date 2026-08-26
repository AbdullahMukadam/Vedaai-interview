import type {
  GeminiQuestionExtraction,
  GeminiAnswerExtraction,
  GeminiMappingResult,
} from "@repo/types";
import type { Schema } from "@google/generative-ai";
import { GEMINI_CONFIG } from "@repo/constants";
import { geminiModel } from "./client";
import {
  QUESTION_EXTRACTION_PROMPT,
  ANSWER_EXTRACTION_PROMPT,
  MAPPING_GRADING_PROMPT,
} from "./prompts";
import {
  questionExtractionSchema,
  answerExtractionSchema,
  mappingGradingSchema,
} from "./schemas";

interface PdfData {
  base64: string;
  mimeType: string;
}

class GeminiService {
  private async generateWithPdf<T>(
    prompt: string,
    pdf: PdfData,
    schema: Schema
  ): Promise<T> {
    const result = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: pdf.mimeType, data: pdf.base64 } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: GEMINI_CONFIG.TEMPERATURE,
        maxOutputTokens: GEMINI_CONFIG.MAX_OUTPUT_TOKENS,
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText) as T;
  }

  private async generateTextWithSchema<T>(
    prompt: string,
    schema: Schema
  ): Promise<T> {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: GEMINI_CONFIG.TEMPERATURE,
        maxOutputTokens: GEMINI_CONFIG.MAX_OUTPUT_TOKENS,
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText) as T;
  }

  async extractQuestions(questionPaperPdf: PdfData): Promise<GeminiQuestionExtraction> {
    return this.generateWithPdf<GeminiQuestionExtraction>(
      QUESTION_EXTRACTION_PROMPT,
      questionPaperPdf,
      questionExtractionSchema
    );
  }

  async extractAnswers(answerSheetPdf: PdfData): Promise<GeminiAnswerExtraction> {
    return this.generateWithPdf<GeminiAnswerExtraction>(
      ANSWER_EXTRACTION_PROMPT,
      answerSheetPdf,
      answerExtractionSchema
    );
  }

  async mapAndGrade(
    questions: GeminiQuestionExtraction,
    answers: GeminiAnswerExtraction
  ): Promise<GeminiMappingResult> {
    const prompt = `
${MAPPING_GRADING_PROMPT}

QUESTIONS:
${JSON.stringify(questions, null, 2)}

ANSWERS:
${JSON.stringify(answers, null, 2)}
`;

    return this.generateTextWithSchema<GeminiMappingResult>(
      prompt,
      mappingGradingSchema
    );
  }
}

export const geminiService = new GeminiService();
