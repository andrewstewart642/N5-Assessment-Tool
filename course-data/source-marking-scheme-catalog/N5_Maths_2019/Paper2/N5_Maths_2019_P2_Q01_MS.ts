import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2019_P2_Q01_MS = {
  id:
    "N5_MATH_2019_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2019_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2019,

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
   *   × 1.15
   *
   *   80000 × 1.15^3
   *
   *   121670
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that a 15% annual increase
   *    corresponds to multiplier 1.15.
   *
   * 2. Apply that multiplier for the required
   *    three compound periods.
   *
   * 3. Complete the calculation correctly to give
   *    the expected number of packages.
   *
   * The source also provides useful error and
   * follow-through evidence:
   *
   * - the correct answer without working earns
   *   full credit;
   *
   * - an incorrect percentage may be followed
   *   through for a maximum of 2/3;
   *
   * - an incorrect power of at least 2 may still
   *   allow the later processing marks to be
   *   awarded, giving a maximum of 2/3;
   *
   * - dividing by the correct multiplier rather
   *   than multiplying loses the first mark while
   *   subsequent processing marks may remain
   *   available;
   *
   * - treating the annual increase as a fixed
   *   simple-interest amount does not demonstrate
   *   compounding and is limited to 1/3.
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