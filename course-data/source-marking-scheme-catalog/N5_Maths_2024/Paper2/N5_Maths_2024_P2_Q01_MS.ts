import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2024_P2_Q01_MS = {
  id:
    "N5_MATH_2024_P2_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2024_P2_Q01",

  courseId:
    "N5_MATH",

  year:
    2024,

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
   * Primary illustrative SQA route:
   *
   *   × 0.74
   *
   *   460 × 0.74^3
   *
   *   £186.40
   *
   * The marking instructions also explicitly
   * accept a year-by-year repeated-multiplication
   * approach for full credit.
   *
   * Example accepted year-by-year structure:
   *
   *   460 × 0.74 = 340.40
   *
   *   340.40 × 0.74 = 251.90...
   *
   *   251.90... × 0.74 = 186.40...
   *
   * This source therefore provides direct evidence
   * for both:
   *
   * - the compact multiplier-power method; and
   * - year-by-year repeated multiplication as a
   *   genuine full-credit alternative.
   *
   * Mark structure:
   *
   * 1. Recognise that a 26% decrease corresponds
   *    to multiplier 0.74.
   *
   * 2. Apply the percentage decrease correctly
   *    across all three years.
   *
   * 3. Evaluate and present an acceptable final
   *    monetary value.
   *
   * The source also gives detailed boundary
   * evidence:
   *
   * - the correct answer without working earns
   *   3/3;
   *
   * - £186.40 is the illustrative answer and
   *   £186 is also accepted for the final mark;
   *
   * - £186.4 and £190 are explicitly not accepted
   *   for that final mark;
   *
   * - an incorrect percentage may be followed
   *   through for a maximum of 2/3;
   *
   * - an incorrect power of at least 2 may be
   *   followed through for a maximum of 2/3;
   *
   * - division using the correct multiplier loses
   *   mark 1 while later processing marks may
   *   remain available;
   *
   * - incorrect working after reaching the correct
   *   value makes the final mark unavailable.
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

    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .COMPOUND_PERCENT_YEAR_BY_YEAR,

      evidenceRole:
        "FULL_CREDIT_ALTERNATIVE",

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