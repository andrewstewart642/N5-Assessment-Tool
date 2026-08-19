import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2019_P1_Q02 = {
  id: "N5_MATH_2019_P1_Q02",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2019,
  paper: "P1",
  questionNumber: "2",

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
  operandStructure: "PROPER_FRACTION_WITH_MIXED_NUMBER",

  surfaceStyleTags: [
    "INLINE_EXPRESSION",
    "EXPLICIT_SIMPLEST_FORM_INSTRUCTION",
    "NO_CONTEXT",
    "NUMERICAL_FLUENCY",
    "EARLY_PAPER_FLUENCY",
  ],

  promptSummary:
    "Evaluate a proper fraction multiplied by a mixed number and give the answer in simplest form.",

  styleNotes:
    "Presented as a compact inline calculation after a short Evaluate command, followed by a separate simplest-form instruction. This matches the broad surface style used by the 2025 and 2023 fraction entries, but with the proper fraction appearing before the mixed number.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 9,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 1963,
      bottomPx: 3390,
      heightPx: 1427,

      topPt: 471.046,
      bottomPt: 813.564,
      heightPt: 342.518,

      heightMm: 120.83,
    },

    notes:
      "Measured from the bottom of the Q2 simplest-form instruction line to the top of the [Turn over] marker on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;
