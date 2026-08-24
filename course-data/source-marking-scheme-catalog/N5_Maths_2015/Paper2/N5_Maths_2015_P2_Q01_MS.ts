import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


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
   * Illustrative SQA route:
   *
   *   × 1.028
   *
   *   240000 × 1.028^2
   *
   *   253628.16
   *
   * The scheme therefore gives direct historical
   * evidence for the fixed-rate multiplier-power
   * solution family.
   *
   * Mark structure:
   *
   * 1. Recognise the correct multiplier for a
   *    2.8% increase.
   *
   * 2. Apply that multiplier for the required
   *    two compound periods.
   *
   * 3. Complete the calculation correctly within
   *    a valid compound-percentage strategy.
   *
   * The source also provides useful boundary
   * evidence:
   *
   * - an incorrect percentage may be followed
   *   through for a maximum of 2/3;
   *
   * - applying the multiplier for only one year
   *   earns 1/3;
   *
   * - multiplying the one-year result by 2 is
   *   not accepted as compounding;
   *
   * - simple-interest treatment of the annual
   *   increase is limited to 1/3.
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

  reviewStatus:
    "CATALOGUED",
} satisfies SourceMarkingSchemeCatalogEntry;