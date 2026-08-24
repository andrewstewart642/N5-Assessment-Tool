import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2021_P1_Q12_MS = {
  id: "N5_MATH_2021_P1_Q12_MS",

  sourceQuestionId:
    "N5_MATH_2021_P1_Q12",

  courseId: "N5_MATH",

  year: 2021,
  paper: "P1",
  questionNumber: "12",

  totalMarks: 3,

  questionFamilyId:
    "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",

  sourceContext:
    "COVID_RESOURCE",

  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_UNITARY,

      variantId:
        ANSWER_METHOD_VARIANT_IDS
          .VIA_25_PERCENT,

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
          .VIA_1_PERCENT,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },
  ],

  markSkillOwnership: [
    {
      markNumber: 1,
      skillId: "reverse-percentages",
    },
    {
      markNumber: 2,
      skillId: "reverse-percentages",
    },
    {
      markNumber: 3,
      skillId: "reverse-percentages",
    },
  ],

  reviewStatus:
    "CATALOGUED",
} satisfies SourceMarkingSchemeCatalogEntry;