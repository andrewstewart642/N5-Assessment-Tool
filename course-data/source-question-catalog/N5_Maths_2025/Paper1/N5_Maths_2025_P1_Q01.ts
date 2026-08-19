import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2025_P1_Q01 = {
  id: "N5_MATH_2025_P1_Q01",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2025,
  paper: "P1",
  questionNumber: "1",

  totalMarks: 2,

  familyId: "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  surfaceStyleId: "INLINE_EVALUATE_WITH_SIMPLEST_FORM_INSTRUCTION",

  primaryTopic: "NUM",

  skillIds: [
    "fractions",
    "mixed-numbers",
    "fraction-multiplication",
  ],

  conceptIds: [
    "convert-mixed-number-to-improper-fraction",
    "multiply-fractions",
    "simplify-fraction-answer",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C",
  thinkingProfile: "OPERATIONAL",

  operationType: "MULTIPLY",
  operandStructure: "MIXED_NUMBER_WITH_PROPER_FRACTION",

  numberProfile: {
    arithmeticComplexity: "LOW",

    requiresSimplification: true,
    simplificationVisibility: "EXPLICIT_INSTRUCTION",

    cancellationStyle: "CROSS_CANCELLATION_AVAILABLE",

    finalAnswerType: "PROPER_FRACTION",

    intermediateValueSize: "SMALL",
    finalValueSize: "SMALL",

    nonCalculatorFriendly: true,

    notes:
      "Values are selected to produce a clearly simplifiable fraction multiplication question while keeping mixed-number conversion and cancellation manageable for a 2-mark non-calculator opener.",
  },

  surfaceStyleTags: [
    "INLINE_EXPRESSION",
    "EXPLICIT_SIMPLEST_FORM_INSTRUCTION",
    "NO_CONTEXT",
    "NUMERICAL_FLUENCY",
    "EARLY_PAPER_FLUENCY",
  ],

  promptSummary:
    "Evaluate a mixed number multiplied by a proper fraction and give the answer in simplest form.",

  styleNotes:
    "Presented as an inline calculation after a short Evaluate command, followed by a separate simplest-form instruction. This is a compact early-paper numerical fluency style.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 6,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 738,
      bottomPx: 1783,
      heightPx: 1045,

      topPt: 177.095,
      bottomPt: 427.902,
      heightPt: 250.807,

      heightMm: 88.48,
    },

    notes:
      "Measured from the bottom of the Q1 instruction line to the top of the Q2 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;
