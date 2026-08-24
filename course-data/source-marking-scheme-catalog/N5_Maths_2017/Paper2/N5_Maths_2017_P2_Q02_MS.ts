import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2017_P2_Q02_MS = {
  id:
    "N5_MATH_2017_P2_Q02_MS",

  sourceQuestionId:
    "N5_MATH_2017_P2_Q02",

  courseId:
    "N5_MATH",

  year:
    2017,

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
   *   × 1.045
   *
   *   1200 × 1.045^3
   *
   *   1369.39935
   *
   *   £1369
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that a 4.5% increase corresponds
   *    to multiplier 1.045.
   *
   * 2. Apply that multiplier for the required
   *    three compound periods.
   *
   * 3. Evaluate correctly and present the answer
   *    to the nearest pound.
   *
   * The source also gives useful marking evidence:
   *
   * - £1369 without working earns full credit;
   *
   * - values such as 1369.4 or 1369.40 show the
   *   correct compound calculation but lose the
   *   final mark because the required nearest-
   *   pound rounding has not been completed;
   *
   * - an incorrect percentage can be followed
   *   through for a maximum of 2/3;
   *
   * - non-compound strategies such as treating
   *   the percentage increase as a fixed amount
   *   each year do not receive full credit.
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