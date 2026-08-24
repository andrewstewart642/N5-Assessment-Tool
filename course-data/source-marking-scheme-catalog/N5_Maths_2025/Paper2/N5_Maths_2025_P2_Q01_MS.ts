import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2025_P2_Q01_MS = {
  id:
    "N5_MATH_2025_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2025_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2025,

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
   *   × 1.04
   *
   *   118750 × 1.04^2
   *
   *   128440
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that a 4% annual increase
   *    corresponds to multiplier 1.04.
   *
   * 2. Apply that multiplier for the required
   *    two compound periods.
   *
   * 3. Complete the calculation consistently to
   *    obtain the expected number of visitors.
   *
   * The source also provides useful boundary
   * evidence:
   *
   * - the correct answer without working earns
   *   full credit;
   *
   * - an incorrect percentage may be followed
   *   through for a maximum of 2/3;
   *
   * - using an incorrect power greater than 2
   *   may also be followed through for a maximum
   *   of 2/3;
   *
   * - dividing by the correct multiplier loses
   *   mark 1 while later processing marks may
   *   remain available;
   *
   * - division combined with an incorrect
   *   percentage removes the first two marks;
   *
   * - applying the multiplier for only one year
   *   earns 1/3;
   *
   * - multiplying a one-year increase by 2 is
   *   not accepted as compounding;
   *
   * - simple-interest style treatment of the 4%
   *   increase does not demonstrate the required
   *   repeated percentage process.
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