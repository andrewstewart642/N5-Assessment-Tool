import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2015_P1_Q01 = {
  id: "N5_MATH_2015_P1_Q01",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2015,
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
      "Values are selected so the common-denominator work is manageable without a calculator and the final mixed-number answer remains tidy.",
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
    "Evaluate a subtraction involving two mixed numbers with fractional parts of unlike denominators.",

  styleNotes:
    "Presented as a compact inline calculation after a short Evaluate command. No separate simplest-form instruction is shown in the visible question stem. This strengthens the recurring early Paper 1 mixed-number subtraction pattern also seen in 2024 and 2021.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 6,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 471,
      bottomPx: 1392,
      heightPx: 921,

      topPt: 113.126,
      bottomPt: 334.107,
      heightPt: 220.981,

      heightMm: 77.96,
    },

    notes:
      "Measured from the bottom of the Q1 prompt/expression block to the top of the Q2 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;