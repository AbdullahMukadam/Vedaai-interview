import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_CONFIG } from "@repo/constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export const geminiModel = genAI.getGenerativeModel({
  model: GEMINI_CONFIG.MODEL,
});
