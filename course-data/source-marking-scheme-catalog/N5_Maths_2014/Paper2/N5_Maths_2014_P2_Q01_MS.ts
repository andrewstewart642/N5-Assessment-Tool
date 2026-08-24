import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2014_P2_Q01_MS = {
  id:
    "N5_MATH_2014_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2014_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2014,

  paper:
    "P2",

  questionNumber:
    "1",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

  sourceContext:
    "STANDARD_EXAM",


  /**
   * Historical illustrative route:
   *
   *   × 0.85
   *
   *   964 × 0.85^3
   *
   *   590
   *
   * This directly supports the normalised
   * multiplier-power method used by the
   * compound-percentage answer generator.
   */
  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .COMPOUND_PERCENT_MULTIPLIER_POWER,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,

      markNumbers: [
        1,
        2,
        3,
      ],

      evidenceSummary: [
        "Recognise that a 15% annual decrease corresponds to multiplying by 0.85.",
        "Apply the multiplier to the initial roll for three compound periods using 964 × 0.85^3.",
        "Complete the calculation and give the final result as 590 to the nearest ten.",
      ],
    },
  ],


  /**
   * All three marks belong to the
   * compound-percentage skill.
   */
  markSkillOwnership: [
    {
      markNumber:
        1,

      skillId:
        "compound-percentages",
    },

    {
      markNumber:
        2,

      skillId:
        "compound-percentages",
    },

    {
      markNumber:
        3,

      skillId:
        "compound-percentages",
    },
  ],


  /**
   * Expected historical answer.
   */
  expectedAnswer: {
    displayText:
      "590",

    numericValue:
      590,

    notes:
      "The source requires the calculated school roll to be rounded to the nearest ten.",
  },


  /**
   * What the individual SQA marks actually
   * represent.
   */
  markEvidence: [
    {
      markNumber:
        1,

      evidenceKind:
        "INTERPRETATION",

      evidenceSummary:
        "Identify the correct multiplicative change for a 15% decrease, equivalent to multiplier 0.85.",

      followThroughAvailable:
        false,
    },

    {
      markNumber:
        2,

      evidenceKind:
        "PROCESS",

      evidenceSummary:
        "Apply the annual percentage-change multiplier for all three required compound periods.",

      followThroughAvailable:
        true,

      notes:
        "The historical notes explicitly allow subsequent working to be followed through when an incorrect percentage has been chosen.",
    },

    {
      markNumber:
        3,

      evidenceKind:
        "ROUNDING",

      evidenceSummary:
        "Carry out the calculation correctly within a valid strategy and present the final result rounded to the nearest ten.",

      followThroughAvailable:
        true,

      notes:
        "The unrounded values 592 or 592.0165 receive only the first two marks, showing that the required nearest-ten presentation is part of the third mark.",
    },
  ],


  /**
   * This source explicitly overrides any general
   * requirement for visible working:
   *
   * correct final answer 590 alone receives 3/3.
   */
  correctAnswerWithoutWorking: {
    treatment:
      "FULL_CREDIT",

    marksAwarded:
      3,

    notes:
      "The question-specific notes explicitly award all three marks for the answer 590 with no working shown.",
  },


  /**
   * Structured question-specific marking rules.
   */
  markingRules: [
    {
      id:
        "unrounded-final-value",

      category:
        "ROUNDING",

      conditionSummary:
        "The candidate gives the correct calculated value before the required nearest-ten rounding, such as 592 or 592.0165, with no further rounding.",

      outcome: {
        marksAwarded:
          2,

        maximumMarks:
          2,

        unavailableMarkNumbers: [
          3,
        ],
      },

      appliesToMarkNumbers: [
        3,
      ],
    },

    {
      id:
        "incorrect-percentage-follow-through",

      category:
        "FOLLOW_THROUGH",

      conditionSummary:
        "An incorrect percentage or resulting multiplier is chosen, but the candidate then carries out a valid compound-percentage process consistently.",

      outcome: {
        maximumMarks:
          2,

        unavailableMarkNumbers: [
          1,
        ],

        followThroughMarkNumbers: [
          2,
          3,
        ],
      },

      appliesToMarkNumbers: [
        1,
        2,
        3,
      ],

      notes:
        "The source explicitly states that incorrect-percentage working should be followed through, leaving the possibility of 2/3.",
    },

    {
      id:
        "multiply-one-year-result-by-period-count",

      category:
        "METHOD_LIMIT",

      conditionSummary:
        "The candidate calculates one 15% decrease correctly but then multiplies that one-year result by 3 instead of compounding it for three years.",

      outcome: {
        marksAwarded:
          1,

        maximumMarks:
          1,

        unavailableMarkNumbers: [
          2,
          3,
        ],
      },

      appliesToMarkNumbers: [
        1,
        2,
        3,
      ],
    },

    {
      id:
        "simple-repeated-absolute-decrease",

      category:
        "METHOD_LIMIT",

      conditionSummary:
        "The candidate calculates 15% of the original value and subtracts that same absolute amount three times instead of applying a compound decrease.",

      outcome: {
        marksAwarded:
          1,

        maximumMarks:
          1,

        unavailableMarkNumbers: [
          2,
          3,
        ],
      },

      appliesToMarkNumbers: [
        1,
        2,
        3,
      ],
    },

    {
      id:
        "percentage-amount-times-period-count",

      category:
        "WRONG_OPERATION",

      conditionSummary:
        "The candidate calculates 15% of the original value and multiplies that percentage amount by the number of years without constructing the remaining value.",

      outcome: {
        marksAwarded:
          0,

        maximumMarks:
          0,

        unavailableMarkNumbers: [
          1,
          2,
          3,
        ],
      },

      appliesToMarkNumbers: [
        1,
        2,
        3,
      ],
    },
  ],


  /**
   * Explicitly documented candidate responses
   * retained as reusable evidence for future
   * marking logic and generator validation.
   */
  commonResponses: [
    {
      id:
        "unrounded-592",

      category:
        "ROUNDING_ERROR",

      responseSummary:
        "Gives 592 or 592.0165 but does not apply the required nearest-ten rounding.",

      marksAwarded:
        2,

      maximumMarks:
        2,

      linkedRuleIds: [
        "unrounded-final-value",
      ],
    },

    {
      id:
        "one-year-result-times-three",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Uses 964 × 0.85 × 3, treating the number of years as an ordinary multiplier rather than an exponent or repeated compound process.",

      marksAwarded:
        1,

      maximumMarks:
        1,

      linkedRuleIds: [
        "multiply-one-year-result-by-period-count",
      ],
    },

    {
      id:
        "subtract-same-decrease-three-times",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Uses the original-value percentage decrease as a fixed amount and subtracts it three times, equivalent to simple rather than compound percentage change.",

      marksAwarded:
        1,

      maximumMarks:
        1,

      linkedRuleIds: [
        "simple-repeated-absolute-decrease",
      ],
    },

    {
      id:
        "percentage-amount-only",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Calculates the 15% amount from the original roll and multiplies it by three without determining the remaining school roll.",

      marksAwarded:
        0,

      maximumMarks:
        0,

      linkedRuleIds: [
        "percentage-amount-times-period-count",
      ],
    },
  ],


  /**
   * Exact source-layout measurements.
   *
   * Measurement standard:
   *
   * - source PDF rendered at 300 dpi;
   * - A4 render = 2481 × 3508 px;
   * - top-left image origin;
   * - physical PDF page 13.
   *
   * CORE EVIDENCE BLOCK
   * -------------------
   * Starts at the upper boundary of the Q1
   * question-specific marking row, immediately
   * below the generic table headings.
   *
   * Ends at the lower boundary of that row,
   * immediately above the Q1 Notes section.
   *
   * FULL QUESTION BLOCK
   * -------------------
   * Uses the same top boundary and extends through
   * all six Q1 Notes, ending at the lower boundary
   * immediately before the Q2 marking table.
   *
   * Generic page/table headings are deliberately
   * excluded from both measurements because they
   * are not question-specific answer evidence.
   */
  sourceLayout: {
    coreEvidenceBlock: {
      measurementMethod:
        "PDF_RENDER",

      sourceMeasurement: {
        pdfPageNumber:
          13,

        renderDpi:
          300,

        pageWidthPx:
          2481,

        pageHeightPx:
          3508,

        topPx:
          471,

        bottomPx:
          1112,

        heightPx:
          641,

        topPt:
          113.04,

        bottomPt:
          266.88,

        heightPt:
          153.84,

        heightMm:
          54.27,
      },

      notes:
        "Measured from the top boundary of the Q1 question-specific row to the boundary immediately above the Notes section.",
    },

    fullQuestionBlock: {
      measurementMethod:
        "PDF_RENDER",

      sourceMeasurement: {
        pdfPageNumber:
          13,

        renderDpi:
          300,

        pageWidthPx:
          2481,

        pageHeightPx:
          3508,

        topPx:
          471,

        bottomPx:
          1950,

        heightPx:
          1479,

        topPt:
          113.04,

        bottomPt:
          468,

        heightPt:
          354.96,

        heightMm:
          125.22,
      },

      notes:
        "Measured from the top boundary of the Q1 question-specific row through the complete Q1 Notes section, ending immediately before the Q2 marking table.",
    },

    notes:
      "The core block represents the historical worked/mark-award presentation itself. The much taller full block additionally preserves the six question-specific notes and error cases and should not be interpreted directly as generated worked-answer height.",
  },


  reviewStatus:
    "CATALOGUED",
} satisfies SourceMarkingSchemeCatalogEntry;