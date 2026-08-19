import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2017_P1_Q03 = {
  id: "N5_MATH_2017_P1_Q03",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2017,
  paper: "P1",
  questionNumber: "3",

  totalMarks: 2,

  familyId: "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  surfaceStyleId: "INLINE_EVALUATE_WITH_SIMPLEST_FORM_INSTRUCTION",

  primaryTopic: "NUM",

  skillIds: [
    "fractions",
    "mixed-numbers",
    "fraction-division",
  ],

  conceptIds: [
    "convert-mixed-number-to-improper-fraction",
    "divide-fractions",
    "simplify-fraction-answer",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C",
  thinkingProfile: "OPERATIONAL",

  operationType: "DIVIDE",
  operandStructure: "MIXED_NUMBER_WITH_PROPER_FRACTION",

  numberProfile: {
    arithmeticComplexity: "LOW",

    requiresSimplification: true,
    simplificationVisibility: "EXPLICIT_INSTRUCTION",

    cancellationStyle: "CROSS_CANCELLATION_AVAILABLE",

    finalAnswerType: "MIXED_NUMBER",

    intermediateValueSize: "SMALL",
    finalValueSize: "SMALL",

    nonCalculatorFriendly: true,

    notes:
      "Division requires reciprocal multiplication after mixed-number conversion. Values are selected to keep cancellation visible and avoid large intermediate numerator or denominator products.",
  },

  surfaceStyleTags: [
    "INLINE_EXPRESSION",
    "EXPLICIT_SIMPLEST_FORM_INSTRUCTION",
    "NO_CONTEXT",
    "NUMERICAL_FLUENCY",
    "EARLY_PAPER_FLUENCY",
  ],

  promptSummary:
    "Evaluate a mixed number divided by a proper fraction and give the answer in simplest form.",

  styleNotes:
    "Presented as an inline calculation after a short Evaluate command, followed by a separate simplest-form instruction. This matches the broad surface style used by the 2023 fraction division entry.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 8,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 497,
      bottomPx: 1770,
      heightPx: 1273,

      topPt: 119.314,
      bottomPt: 424.845,
      heightPt: 305.53,

      heightMm: 107.78,
    },

    notes:
      "Measured from the bottom of the Q3 simplest-form instruction line to the top of the Q4 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;