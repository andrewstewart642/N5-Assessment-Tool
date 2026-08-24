import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2023_P2_Q01_MS = {
  id:
    "N5_MATH_2023_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2023_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2023,

  paper:
    "P2",

  questionNumber:
    "1",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

  sourceContext:
    "STANDARD_EXAM",

  /**
   * Illustrative SQA route:
   *
   *   × 0.89 and × 0.94
   *
   *   20000 × 0.89 × 0.94^2
   *
   *   £15728.08
   *
   * This is structurally different from the
   * fixed-rate compound-percentage sources because
   * two distinct annual percentage changes must be
   * represented.
   *
   * The scheme therefore provides direct evidence
   * for the multi-rate multiplier-power family.
   *
   * Mark structure:
   *
   * 1. Identify the correct multipliers for both
   *    the 11% and 6% decreases.
   *
   * 2. Apply 0.89 for the first year and 0.94 for
   *    the following two years.
   *
   * 3. Evaluate the resulting compound expression.
   *
   * The source gives particularly useful boundary
   * evidence:
   *
   * - the correct answer without working earns
   *   full credit;
   *
   * - incorrect percentages may be followed
   *   through for a maximum of 2/3;
   *
   * - using only one repeated percentage change
   *   for all three years loses both marks 1 and 2,
   *   leaving only the final processing mark
   *   available;
   *
   * - applying 0.94 for only one of the required
   *   two later years can earn 2/3;
   *
   * - division with the correct multipliers loses
   *   mark 1 while later processing marks may
   *   remain available;
   *
   * - combining the first correct multiplier with
   *   a simple-interest treatment of the later
   *   6% decreases is not accepted as the full
   *   compound method.
   */
  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .COMPOUND_PERCENT_MULTI_RATE_MULTIPLIER_POWER,

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