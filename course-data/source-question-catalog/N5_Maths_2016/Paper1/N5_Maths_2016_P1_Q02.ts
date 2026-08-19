import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2016_P1_Q02 = {
  id: "N5_MATH_2016_P1_Q02",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2016,
  paper: "P1",
  questionNumber: "2",

  totalMarks: 2,

  familyId: "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
  surfaceStyleId:
    "INLINE_EVALUATE_BRACKETED_EXPRESSION_WITH_SIMPLEST_FORM_INSTRUCTION",

  primaryTopic: "NUM",

  skillIds: [
    "fractions",
    "fraction-addition",
    "fraction-multiplication",
    "order-of-operations",
  ],

  conceptIds: [
    "add-fractions-with-unlike-denominators",
    "multiply-fractions",
    "evaluate-bracketed-fraction-expression",
    "simplify-fraction-answer",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C",
  thinkingProfile: "OPERATIONAL",

  operationType: "BRACKETED_SUM_AND_MULTIPLY",
  operandStructure: "PROPER_FRACTION_MULTIPLIED_BY_BRACKETED_FRACTION_SUM",

  numberProfile: {
    arithmeticComplexity: "MEDIUM",

    requiresSimplification: true,
    simplificationVisibility: "EXPLICIT_INSTRUCTION",

    cancellationStyle: "BRACKETED_SIMPLIFICATION_THEN_MULTIPLY",

    finalAnswerType: "PROPER_FRACTION",

    intermediateValueSize: "MEDIUM",
    finalValueSize: "SMALL",

    nonCalculatorFriendly: true,

    notes:
      "Values are selected so the bracketed fraction addition, multiplication and final simplification are all manageable by hand. The generator should avoid awkward common denominators and large intermediate products.",
  },

  surfaceStyleTags: [
    "INLINE_EXPRESSION",
    "SHORT_EVALUATE_STEM",
    "EXPLICIT_SIMPLEST_FORM_INSTRUCTION",
    "BRACKETED_EXPRESSION",
    "NO_CONTEXT",
    "NUMERICAL_FLUENCY",
    "EARLY_PAPER_FLUENCY",
  ],

  promptSummary:
    "Evaluate a proper fraction multiplied by a bracketed sum of two proper fractions, then give the answer in simplest form.",

  styleNotes:
    "Presented as a compact inline calculation after a short Evaluate command, with a bracketed fraction expression embedded in the line. This is the same broad mathematical family as the 2022 bracketed fraction entry, but with a more compact inline presentation.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 6,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 2128,
      bottomPx: 3055,
      heightPx: 927,

      topPt: 510.712,
      bottomPt: 733.162,
      heightPt: 222.45,

      heightMm: 78.47,
    },

    notes:
      "Measured from the bottom of the Q2 simplest-form instruction line to the top of the [Turn over] marker on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;