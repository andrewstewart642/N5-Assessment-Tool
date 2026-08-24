import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2018_P2_Q01_MS = {
  id:
    "N5_MATH_2018_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2018_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2018,

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
   * Illustrative SQA route:
   *
   *   × 0.98
   *
   *   125000 × 0.98^3
   *
   *   117649
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that a 2% annual decrease leaves
   *    98% of the previous value and therefore
   *    use multiplier 0.98.
   *
   * 2. Apply the multiplier for the required
   *    three compound periods.
   *
   * 3. Complete the calculation correctly to give
   *    the expected waste total.
   *
   * The source also provides useful boundary
   * evidence:
   *
   * - the correct final answer without working
   *   earns full credit;
   *
   * - an incorrect percentage can be followed
   *   through for a maximum of 2/3;
   *
   * - dividing by the correct multiplier instead
   *   of multiplying loses the first mark, while
   *   subsequent processing marks can remain
   *   available;
   *
   * - calculating only one year's decrease does
   *   not establish the full compound process;
   *
   * - subtracting the same percentage amount
   *   repeatedly from the original value is a
   *   simple-change approach rather than compound
   *   percentage decrease and is limited to 1/3.
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