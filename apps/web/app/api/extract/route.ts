import { NextRequest, NextResponse } from "next/server";
import type { APIResponse, AssessmentResult } from "@repo/types";
import { geminiService } from "@/lib/gemini/geminiService";

async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

function unionBox(
  a: { ymin: number; xmin: number; ymax: number; xmax: number },
  b?: { ymin: number; xmin: number; ymax: number; xmax: number }
): { ymin: number; xmin: number; ymax: number; xmax: number } {
  if (!b) return a;
  return {
    ymin: Math.min(a.ymin, b.ymin),
    xmin: Math.min(a.xmin, b.xmin),
    ymax: Math.max(a.ymax, b.ymax),
    xmax: Math.max(a.xmax, b.xmax),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const questionPaper = formData.get("questionPaper") as File | null;
    const answerSheet = formData.get("answerSheet") as File | null;

    if (!questionPaper || !answerSheet) {
      return NextResponse.json(
        {
          success: false,
          message: "Both question paper and answer sheet are required",
        } satisfies APIResponse,
        { status: 400 }
      );
    }

    const [questionBase64, answerBase64] = await Promise.all([
      fileToBase64(questionPaper),
      fileToBase64(answerSheet),
    ]);

    const questionPdf = { base64: questionBase64, mimeType: questionPaper.type };
    const answerPdf = { base64: answerBase64, mimeType: answerSheet.type };

    //Extract questions from question paper
    const extractedQuestions = await geminiService.extractQuestions(questionPdf);

    //Extract answers from answer sheet with bounding boxes
    const extractedAnswers = await geminiService.extractAnswers(answerPdf);

    //Map answers to questions and grade
    const mappingResult = await geminiService.mapAndGrade(
      extractedQuestions,
      extractedAnswers
    );

    //Build unified result
    const result: AssessmentResult = {
      questions: extractedQuestions.questions.map((q, idx) => ({
        id: `q-${idx}`,
        number: q.number,
        text: q.text,
        subPart: q.subPart,
        pageNumber: q.pageNumber,
        parentQuestionNumber: q.subPart ? q.number.split("(")[0] : undefined,
      })),
      answers: extractedAnswers.answers.map((a, idx) => ({
        id: `a-${idx}`,
        questionNumber: a.questionNumber,
        text: a.text,
        boundingBox: unionBox(a.boundingBox, a.questionBoundingBox),
        pageNumber: a.pageNumber,
        isComplete: a.isComplete,
        pageWidth: 800,
        pageHeight: 1100,
      })),
      mapping: mappingResult.mapping.map((m, idx) => {
        const question = extractedQuestions.questions.find(
          (q) => q.number === m.questionNumber
        );
        const matchingAnswers = extractedAnswers.answers.filter(
          (a) => a.questionNumber === m.questionNumber
        );

        return {
          questionId: question ? `q-${extractedQuestions.questions.indexOf(question)}` : `unmatched-${idx}`,
          questionNumber: m.questionNumber,
          answerText: m.answerText,
          score: m.score,
          maxScore: m.maxScore,
          feedback: m.feedback,
          isCorrect: m.isCorrect,
          confidence: m.confidence,
          boundingBoxes: matchingAnswers.map((a) => unionBox(a.boundingBox, a.questionBoundingBox)),
          pages: [...new Set(matchingAnswers.map((a) => a.pageNumber))],
        };
      }),
      overallFeedback: mappingResult.overallFeedback,
      totalScore: mappingResult.mapping.reduce((sum, m) => sum + m.score, 0),
      totalMaxScore: mappingResult.mapping.reduce(
        (sum, m) => sum + m.maxScore,
        0
      ),
    };

    return NextResponse.json({
      success: true,
      message: "Assessment extracted successfully",
      data: result,
    } satisfies APIResponse<AssessmentResult>);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Extraction failed",
      } satisfies APIResponse,
      { status: 500 }
    );
  }
}
