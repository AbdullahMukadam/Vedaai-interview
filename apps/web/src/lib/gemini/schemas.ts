import { SchemaType, type Schema } from "@google/generative-ai";

export const questionExtractionSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          number: {
            type: SchemaType.STRING,
            description: "Question number as printed (e.g. '1', '11', '11(a)')",
          },
          text: {
            type: SchemaType.STRING,
            description: "Full question text",
          },
          subPart: {
            type: SchemaType.STRING,
            description: "Sub-part letter if applicable (e.g. 'a', 'b')",
          },
          pageNumber: {
            type: SchemaType.INTEGER,
            description: "Page number where the question appears (1-indexed)",
          },
        },
        required: ["number", "text", "pageNumber"],
      },
    },
  },
  required: ["questions"],
};

export const answerExtractionSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    answers: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          questionNumber: {
            type: SchemaType.STRING,
            description:
              "Question number this answer corresponds to (e.g. '1', '11(a)')",
          },
          text: {
            type: SchemaType.STRING,
            description:
              "Extracted handwritten text of the answer including any question number/heading the student wrote",
          },
          boundingBox: {
            type: SchemaType.OBJECT,
            properties: {
              ymin: {
                type: SchemaType.INTEGER,
                description:
                  "Top edge of the entire written response block (including question number/heading), normalized 0-1000",
              },
              xmin: {
                type: SchemaType.INTEGER,
                description:
                  "Left edge of the entire written response block, normalized 0-1000",
              },
              ymax: {
                type: SchemaType.INTEGER,
                description:
                  "Bottom edge of the entire written response block, normalized 0-1000",
              },
              xmax: {
                type: SchemaType.INTEGER,
                description:
                  "Right edge of the entire written response block, normalized 0-1000",
              },
            },
            required: ["ymin", "xmin", "ymax", "xmax"],
          },
          pageNumber: {
            type: SchemaType.INTEGER,
            description: "Page number where the answer appears (1-indexed)",
          },
          isComplete: {
            type: SchemaType.BOOLEAN,
            description: "Whether the answer appears complete",
          },
        },
        required: [
          "questionNumber",
          "text",
          "boundingBox",
          "pageNumber",
          "isComplete",
        ],
      },
    },
  },
  required: ["answers"],
};

export const mappingGradingSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    mapping: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          questionNumber: {
            type: SchemaType.STRING,
            description: "Question number being graded",
          },
          answerText: {
            type: SchemaType.STRING,
            description: "The student's answer text for this question",
          },
          score: {
            type: SchemaType.INTEGER,
            description: "Score awarded (0 to maxScore)",
          },
          maxScore: {
            type: SchemaType.INTEGER,
            description: "Maximum possible score for this question",
          },
          feedback: {
            type: SchemaType.STRING,
            description: "Brief feedback on the answer",
          },
          isCorrect: {
            type: SchemaType.BOOLEAN,
            description: "Whether the answer is substantially correct",
          },
          confidence: {
            type: SchemaType.NUMBER,
            description:
              "Confidence in the mapping (0.0 to 1.0). Lower if answer text is hard to read.",
          },
        },
        required: [
          "questionNumber",
          "answerText",
          "score",
          "maxScore",
          "feedback",
          "isCorrect",
          "confidence",
        ],
      },
    },
    overallFeedback: {
      type: SchemaType.STRING,
      description:
        "Overall feedback summary for the student's performance",
    },
  },
  required: ["mapping", "overallFeedback"],
};
