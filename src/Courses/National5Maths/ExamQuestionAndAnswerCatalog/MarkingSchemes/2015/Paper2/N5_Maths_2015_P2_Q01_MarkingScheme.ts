import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";


export const N5_MATHS_2015_P2_Q01_MS = {
  id:
    "N5_MATH_2015_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2015_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2015,

  paper:
    "P2",

  questionNumber:
    "1",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

  sourceContext:
    "STANDARD_EXAM",


  /**
   * Historical illustrative route:
   *
   *   × 1.028
   *
   *   240000 × 1.028^2
   *
   *   253628.16
   *
   * This gives direct source evidence for the
   * fixed-rate multiplier-power method.
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
        "Recognise that a 2.8% annual increase corresponds to multiplier 1.028.",
        "Apply the multiplier to the initial value for two compound periods using 240000 × 1.028^2.",
        "Complete the calculation correctly to obtain the expected future value.",
      ],

      notes:
        "The historical generic description for mark 2 refers to calculating 'expected turnover', although the source question concerns the value of a house. This catalogue interprets that wording as calculating the expected future value while preserving the mathematical evidence.",
    },
  ],


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
   * The source presents the expected answer as
   * £253628(.16).
   *
   * Its question-specific notes explicitly award
   * 3/3 for 253628 without working, so the whole-
   * pound presentation is retained as a historical
   * accepted alternative rather than treated as a
   * rounding error.
   */
  expectedAnswer: {
    displayText:
      "£253628.16",

    numericValue:
      253628.16,

    alternativeDisplayTexts: [
      "£253628",
    ],

    notes:
      "The marking scheme displays £253628(.16) and explicitly awards 3/3 for an answer of 253628 without working.",
  },


  markEvidence: [
    {
      markNumber:
        1,

      evidenceKind:
        "INTERPRETATION",

      evidenceSummary:
        "Identify the correct multiplicative change for an annual increase of 2.8%, equivalent to multiplier 1.028.",

      followThroughAvailable:
        false,
    },

    {
      markNumber:
        2,

      evidenceKind:
        "PROCESS",

      evidenceSummary:
        "Apply the annual percentage increase for both required compound periods.",

      followThroughAvailable:
        true,

      notes:
        "Where an incorrect percentage is selected, the scheme explicitly permits consistent subsequent compound working to be followed through.",
    },

    {
      markNumber:
        3,

      evidenceKind:
        "ACCURACY",

      evidenceSummary:
        "Carry out the compound-percentage calculation correctly within a valid strategy and obtain the expected future value.",

      followThroughAvailable:
        true,
    },
  ],


  correctAnswerWithoutWorking: {
    treatment:
      "FULL_CREDIT",

    marksAwarded:
      3,

    notes:
      "The source explicitly awards 3/3 for the answer 253628 without working.",
  },


  markingRules: [
    {
      id:
        "incorrect-percentage-follow-through",

      category:
        "FOLLOW_THROUGH",

      conditionSummary:
        "The candidate chooses an incorrect percentage or resulting multiplier but then applies a valid repeated-percentage process consistently.",

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
        "The source gives 240000 × 1.28^2 = 393216 as an example receiving 2/3 when supported by working.",
    },

    {
      id:
        "one-compound-period-only",

      category:
        "METHOD_LIMIT",

      conditionSummary:
        "The candidate applies the correct multiplier only once, calculating the value after one year rather than after two years.",

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

      notes:
        "The source explicitly awards 1/3 for 246720 from 240000 × 1.028, with no working required.",
    },

    {
      id:
        "multiply-one-year-expression-by-two",

      category:
        "METHOD_LIMIT",

      conditionSummary:
        "The candidate identifies multiplier 1.028 but multiplies by the number of years as an ordinary factor rather than applying compound growth.",

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

      notes:
        "The source explicitly awards 1/3 for 240000 × 1.028 × 2 = 493440.",
    },

    {
      id:
        "simple-interest-style-increase",

      category:
        "METHOD_LIMIT",

      conditionSummary:
        "The candidate calculates the annual percentage increase from the original value and adds the same absolute increase for each year instead of compounding.",

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

      notes:
        "The source explicitly awards 1/3 for 240000 + 240000 × 0.028 × 2 = 253440.",
    },

    {
      id:
        "percentage-increase-amount-only",

      category:
        "WRONG_OPERATION",

      conditionSummary:
        "The candidate calculates only the total simple percentage increase over two years and does not add it to the original value or construct a compound calculation.",

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

      notes:
        "The source explicitly awards 0/3 for 240000 × 0.028 × 2 = 13440.",
    },
  ],


  commonResponses: [
    {
      id:
        "incorrect-rate-compounded",

      category:
        "PARTIAL_METHOD",

      responseSummary:
        "Uses an incorrect percentage multiplier but then compounds it correctly over two periods.",

      maximumMarks:
        2,

      linkedRuleIds: [
        "incorrect-percentage-follow-through",
      ],

      notes:
        "The source example uses multiplier 1.28 and reaches 393216, receiving 2/3 with working.",
    },

    {
      id:
        "correct-first-year-only",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Applies multiplier 1.028 once and stops after one year's increase.",

      marksAwarded:
        1,

      maximumMarks:
        1,

      linkedRuleIds: [
        "one-compound-period-only",
      ],
    },

    {
      id:
        "multiplier-times-two",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Uses the correct annual multiplier but multiplies the one-year expression by 2 rather than compounding for two years.",

      marksAwarded:
        1,

      maximumMarks:
        1,

      linkedRuleIds: [
        "multiply-one-year-expression-by-two",
      ],
    },

    {
      id:
        "simple-interest-two-years",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Adds two identical 2.8% increases calculated from the original value, producing a simple-interest-style result.",

      marksAwarded:
        1,

      maximumMarks:
        1,

      linkedRuleIds: [
        "simple-interest-style-increase",
      ],
    },

    {
      id:
        "increase-amount-without-original",

      category:
        "COMMON_ERROR",

      responseSummary:
        "Calculates only 2.8% of the original value for two years and reports the increase amount rather than the future value.",

      marksAwarded:
        0,

      maximumMarks:
        0,

      linkedRuleIds: [
        "percentage-increase-amount-only",
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
   * - top-left coordinate origin;
   * - physical PDF page 13;
   * - printed marking-instructions page 3.
   *
   * CORE EVIDENCE BLOCK
   * -------------------
   * Begins immediately below the generic table
   * heading and contains the Q1 expected answer,
   * three generic mark descriptions and the
   * illustrative multiplier-power working.
   *
   * FULL QUESTION BLOCK
   * -------------------
   * Extends through all six Q1 Notes and stops at
   * the lower boundary immediately before the Q2
   * marking table.
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
          515,

        bottomPx:
          1112,

        heightPx:
          597,

        topPt:
          123.6,

        bottomPt:
          266.88,

        heightPt:
          143.28,

        heightMm:
          50.55,
      },

      notes:
        "Measured from the upper boundary of the Q1 question-specific row, immediately below the generic table headings, to the boundary immediately above the Q1 Notes section.",
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
          515,

        bottomPx:
          1893,

        heightPx:
          1378,

        topPt:
          123.6,

        bottomPt:
          454.32,

        heightPt:
          330.72,

        heightMm:
          116.67,
      },

      notes:
        "Measured from the upper boundary of the Q1 question-specific row through all six Q1 Notes, ending at the lower boundary immediately before the Q2 marking table.",
    },

    notes:
      "The compact core block is the relevant historical worked-answer evidence for answer-layout modelling. The much taller full block additionally contains extensive diagnostic marking notes and should not be used directly as generated worked-solution height.",
  },


  reviewStatus:
    "CATALOGUED",
} satisfies ExamMarkingSchemeCatalogEntry;