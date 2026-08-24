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
   * Illustrative SQA route:
   *
   *   × 0.85
   *
   *   964 × 0.85^3
   *
   *   592.0165...
   *
   *   590
   *
   * The historical scheme therefore gives direct
   * evidence for the fixed-rate multiplier-power
   * method.
   *
   * Mark structure:
   *
   * 1. Identify the correct percentage multiplier.
   * 2. Apply the multiplier for the correct number
   *    of compound periods.
   * 3. Evaluate and present the answer to the
   *    required accuracy.
   *
   * The source also distinguishes the compound
   * calculation from the final presentation mark:
   * an unrounded value such as 592.0165 can retain
   * the first two marks but does not earn the final
   * nearest-ten mark.
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