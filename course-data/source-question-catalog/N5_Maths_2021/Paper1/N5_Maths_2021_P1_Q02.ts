import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2021_P1_Q02 = {
  id: "N5_MATH_2021_P1_Q02",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2021,
  paper: "P1",
  questionNumber: "2",

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
      "Values are selected so the mixed-number subtraction can be completed with manageable common-denominator arithmetic and a tidy final mixed-number answer.",
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
    "Presented as a compact inline calculation after a short Evaluate command. No separate simplest-form instruction is shown in the visible question stem. This matches the broad surface style used by the 2024 mixed-number subtraction opener.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 7,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 2203,
      bottomPx: 3390,
      heightPx: 1187,

      topPt: 528.778,
      bottomPt: 813.569,
      heightPt: 284.791,

      heightMm: 100.47,
    },

    notes:
      "Measured from the bottom of the Q2 prompt/expression block to the top of the [Turn over] marker on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;
