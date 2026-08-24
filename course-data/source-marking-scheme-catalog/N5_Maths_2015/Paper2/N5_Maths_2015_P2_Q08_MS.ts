import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2015_P2_Q08_MS = {
  id: "N5_MATH_2015_P2_Q08_MS",

  sourceQuestionId:
    "N5_MATH_2015_P2_Q08",

  courseId: "N5_MATH",

  year: 2015,
  paper: "P2",
  questionNumber: "8",

  totalMarks: 3,

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