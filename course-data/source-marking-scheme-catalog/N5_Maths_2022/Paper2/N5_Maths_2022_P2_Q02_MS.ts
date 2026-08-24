import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2022_P2_Q02_MS = {
  id:
    "N5_MATH_2022_P2_Q02_MS",

  sourceQuestionId:
    "N5_MATH_2022_P2_Q02",

  courseId:
    "N5_MATH",

  year:
    2022,

  paper:
    "P2",

  questionNumber:
    "2",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

  sourceContext:
    "STANDARD_EXAM",

  /**
   * Illustrative SQA route:
   *
   *   × 1.03
   *
   *   215000 × 1.03^4
   *
   *   241984.394...
   *
   *   £242000
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that a 3% increase corresponds
   *    to multiplier 1.03.
   *
   * 2. Apply the multiplier for the required
   *    four compound periods.
   *
   * 3. Evaluate and present the final answer to
   *    the nearest thousand pounds.
   *
   * The source also provides detailed
   * follow-through evidence:
   *
   * - the correct answer without working earns
   *   full credit;
   *
   * - an incorrect percentage can be followed
   *   through for a maximum of 2/3;
   *
   * - an incorrect power of at least 2 can also
   *   be followed through for a maximum of 2/3;
   *
   * - dividing by the correct multiplier removes
   *   the first mark, but the later processing
   *   marks can remain available;
   *
   * - division combined with an incorrect
   *   percentage removes both of the first two
   *   marks, leaving only the final processing
   *   mark available;
   *
   * - £242000.00 is explicitly accepted for the
   *   final mark;
   *
   * - where intermediate calculations are shown,
   *   premature rounding must retain at least
   *   four significant figures.
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