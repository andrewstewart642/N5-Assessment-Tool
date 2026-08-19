import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2022_P1_Q01 = {
  id: "N5_MATH_2022_P1_Q01",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2022,
  paper: "P1",
  questionNumber: "1",

  totalMarks: 2,

  familyId: "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
  surfaceStyleId: "DISPLAYED_EXPRESSION_UNDER_EVALUATE_WITH_SIMPLEST_FORM_INSTRUCTION",

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
      "Values are selected so the bracketed addition produces a manageable intermediate fraction before multiplication. The generator should prefer cases where final simplification is visible but not arithmetically excessive.",
  },

  surfaceStyleTags: [
    "DISPLAYED_EXPRESSION",
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
    "Presented with a short Evaluate command, with the fractional expression displayed separately beneath the stem. The question includes a separate simplest-form instruction. This differs from the compact inline expression style used in some other early Paper 1 fraction questions.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 7,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 834,
      bottomPx: 1997,
      heightPx: 1163,

      topPt: 200.078,
      bottomPt: 479.234,
      heightPt: 279.156,

      heightMm: 98.48,
    },

    notes:
      "Measured from the bottom of the Q1 simplest-form instruction line to the top of the Q2 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;
