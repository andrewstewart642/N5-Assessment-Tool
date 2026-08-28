import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2023_P1_Q01 = {
  id: "N5_MATH_2023_P1_Q01",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2023,
  paper: "P1",
  questionNumber: "1",

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
      "Values are selected so reciprocal multiplication remains tidy after mixed-number conversion. The generator should prefer visible cancellation and avoid large unsimplified products.",
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
    "Presented as an inline calculation after a short Evaluate command, followed by a separate simplest-form instruction. This is a compact early-paper numerical fluency style.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 6,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 736,
      bottomPx: 1721,
      heightPx: 985,

      topPt: 176.652,
      bottomPt: 412.987,
      heightPt: 236.335,

      heightMm: 83.37,
    },

    notes:
      "Measured from the bottom of the Q1 instruction line to the top of the Q2 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;
