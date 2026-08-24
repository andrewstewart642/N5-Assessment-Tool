import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2021_P2_Q01_MS = {
  id:
    "N5_MATH_2021_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2021_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2021,

  paper:
    "P2",

  questionNumber:
    "1",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

  sourceContext:
    "COVID_RESOURCE",

  /**
   * Illustrative SQA route:
   *
   *   × 1.04
   *
   *   250000 × 1.04^2
   *
   *   270400
   *
   * The assessment resource therefore gives
   * direct evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise the correct method for increasing
   *    the value by 4%.
   *
   * 2. Calculate the expected price by applying
   *    the percentage change for two years.
   *
   * 3. Carry out the calculation correctly within
   *    a valid compound-percentage strategy.
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