import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2024_P1_Q01 = {
  id: "N5_MATH_2024_P1_Q01",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2024,
  paper: "P1",
  questionNumber: "1",

  totalMarks: 2,

  familyId: "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
  surfaceStyleId: "INLINE_EVALUATE_ONLY",

  primaryTopic: "NUM",

  skillIds: [
    "fractions",
    "mixed-numbers",
    "fraction-subtraction",
  ],

  conceptIds: [
    "convert-mixed-number-to-improper-fraction",
    "subtract-fractions",
    "simplify-fraction-answer",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C",
  thinkingProfile: "OPERATIONAL",

  operationType: "SUBTRACT",
  operandStructure: "MIXED_NUMBER_WITH_MIXED_NUMBER",

  numberProfile: {
    arithmeticComplexity: "LOW",

    requiresSimplification: true,
    simplificationVisibility: "IMPLIED_BY_STANDARD_FORM",

    cancellationStyle: "COMMON_DENOMINATOR_REQUIRED",

    finalAnswerType: "MIXED_NUMBER",

    intermediateValueSize: "SMALL",
    finalValueSize: "SMALL",

    nonCalculatorFriendly: true,

    notes:
      "Values are selected so the common-denominator subtraction is manageable and the final answer is a tidy mixed number. The absence of an explicit simplest-form instruction should not lead the generator to allow awkward or unreduced answers.",
  },

  surfaceStyleTags: [
    "INLINE_EXPRESSION",
    "SHORT_EVALUATE_STEM",
    "NO_EXPLICIT_SIMPLEST_FORM_INSTRUCTION",
    "NO_CONTEXT",
    "NUMERICAL_FLUENCY",
    "EARLY_PAPER_FLUENCY",
  ],

  promptSummary:
    "Evaluate a mixed number subtraction involving fractional parts with unlike denominators.",

  styleNotes:
    "Presented as a compact inline calculation after a short Evaluate command. Unlike the 2025 fraction opener, this version does not include a separate simplest-form instruction in the visible question stem.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 7,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 707,
      bottomPx: 1978,
      heightPx: 1271,

      topPt: 169.78,
      bottomPt: 474.81,
      heightPt: 305.03,

      heightMm: 107.61,
    },

    notes:
      "Measured from the bottom of the Q1 prompt/expression block to the top of the Q2 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;
