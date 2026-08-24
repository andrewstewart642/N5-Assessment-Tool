import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2025_P1_Q04_MS = {
  id:
    "N5_MATH_2025_P1_Q04_MS",

  sourceQuestionId:
    "N5_MATH_2025_P1_Q04",

  courseId:
    "N5_MATH",

  year:
    2025,

  paper:
    "P1",

  questionNumber:
    "4",

  totalMarks:
    3,

  questionFamilyId:
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",

  sourceContext:
    "STANDARD_EXAM",

  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_UNITARY,

      variantId:
        ANSWER_METHOD_VARIANT_IDS
          .VIA_1_PERCENT,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_UNITARY,

      variantId:
        ANSWER_METHOD_VARIANT_IDS
          .VIA_10_PERCENT,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_UNITARY,

      variantId:
        ANSWER_METHOD_VARIANT_IDS
          .VIA_20_PERCENT,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_INVERSE_MULTIPLIER,

      variantId:
        ANSWER_METHOD_VARIANT_IDS
          .DIVIDE_BY_MULTIPLIER,

      evidenceRole:
        "FULL_CREDIT_ALTERNATIVE",

      supportsFullCredit:
        true,
    },
  ],

  markSkillOwnership: [
    {
      markNumber: 1,
      skillId:
        "reverse-percentages",
    },

    {
      markNumber: 2,
      skillId:
        "reverse-percentages",
    },

    {
      markNumber: 3,
      skillId:
        "reverse-percentages",
    },
  ],

  reviewStatus:
    "CATALOGUED",
} satisfies SourceMarkingSchemeCatalogEntry;