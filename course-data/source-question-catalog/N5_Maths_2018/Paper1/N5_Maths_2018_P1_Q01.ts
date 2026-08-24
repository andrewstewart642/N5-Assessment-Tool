import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2018_P1_Q01 = {
  id:
    "N5_MATH_2018_P1_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2018,

  paper:
    "P1",

  questionNumber:
    "1",

  totalMarks:
    2,


  familyId:
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",

  surfaceStyleId:
    "INLINE_EVALUATE_ONLY",


  primaryTopic:
    "NUM",


  skillIds: [
    "fractions",
    "mixed-numbers",
    "fraction-addition",
  ],


  conceptIds: [
    "convert-mixed-number-to-improper-fraction",
    "add-fractions-with-unlike-denominators",
  ],


  paperSuitability:
    "P1",

  calculatorStatus:
    "NON_CALCULATOR",


  standardProfile:
    "C",

  thinkingProfile:
    "OPERATIONAL",


  operationType:
    "ADD",

  operandStructure:
    "MIXED_NUMBER_WITH_PROPER_FRACTION",


  numberProfile: {
    arithmeticComplexity:
      "LOW",

    requiresSimplification:
      false,

    simplificationVisibility:
      "NOT_EXPLICITLY_STATED",

    cancellationStyle:
      "COMMON_DENOMINATOR_REQUIRED",

    finalAnswerType:
      "IMPROPER_FRACTION",

    intermediateValueSize:
      "SMALL",

    finalValueSize:
      "SMALL",

    nonCalculatorFriendly:
      true,

    notes:
      "The source requires addition of a mixed number and a proper fraction with unlike denominators. A common denominator is required. The marking instructions award full credit for 47/15 and also accept the equivalent mixed number 3 2/15; conversion to a mixed number is therefore not required.",
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
    "Evaluate the sum of a mixed number and a proper fraction with unlike denominators.",


  styleNotes:
    "Presented as a compact inline calculation after a short Evaluate command. No separate simplest-form instruction is shown. The expression consists of a mixed number added to a proper fraction and is positioned as the opening two-mark numerical-fluency question on Paper 1.",


  answerSpace: {
    category:
      "LARGE",

    estimatedLines:
      7,

    measurementMethod:
      "PDF_RENDER",

    sourceMeasurement: {
      renderDpi:
        300,

      pageWidthPx:
        2481,

      pageHeightPx:
        3508,

      topPx:
        702,

      bottomPx:
        1800,

      heightPx:
        1098,

      topPt:
        168.474,

      bottomPt:
        431.985,

      heightPt:
        263.511,

      heightMm:
        92.96,
    },

    notes:
      "Measured from the bottom of the Q1 prompt/expression block to the top of the Q2 prompt block on the original 2018 Paper 1 PDF page.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;