import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2016_P2_Q01_MS = {
  id:
    "N5_MATH_2016_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2016_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2016,

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
   *   × 0.92
   *
   *   35 × 0.92^3
   *
   *   27.25408
   *
   * The scheme therefore gives direct historical
   * evidence for the standard fixed-rate
   * multiplier-power method.
   *
   * Mark structure:
   *
   * 1. Recognise that an 8% decrease leaves 92%
   *    of the previous value and therefore use
   *    multiplier 0.92.
   *
   * 2. Apply that multiplier for three compound
   *    periods.
   *
   * 3. Complete the calculation correctly within
   *    a valid strategy.
   *
   * The source also gives useful error evidence:
   *
   * - an incorrect percentage may be followed
   *   through for a maximum of 2/3;
   *
   * - using division rather than multiplication
   *   loses the multiplier-identification mark,
   *   while later processing marks may remain
   *   available;
   *
   * - treating the decrease as the same absolute
   *   reduction repeated three times is not a
   *   valid compound method and is limited to
   *   1/3;
   *
   * - the marking notes explicitly state that
   *   incorrect rounding should not be penalised
   *   for this source question.
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