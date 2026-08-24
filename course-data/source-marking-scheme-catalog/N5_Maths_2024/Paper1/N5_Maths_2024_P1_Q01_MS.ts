import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


export const N5_MATHS_2024_P1_Q01_MS = {
  id:
    "N5_MATH_2024_P1_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2024_P1_Q01",

  courseId:
    "N5_MATH",

  year:
    2024,

  paper:
    "P1",

  questionNumber:
    "1",

  totalMarks:
    2,

  questionFamilyId:
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_MIXED_NUMBER",

  sourceContext:
    "STANDARD_EXAM",

  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_SUBTRACT_MIXED_COMPONENTS,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_SUBTRACT_IMPROPER,

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
        "fraction-subtraction",
    },

    {
      markNumber:
        2,

      skillId:
        "fractions",
    },
  ],

  reviewStatus:
    "CATALOGUED",
} satisfies SourceMarkingSchemeCatalogEntry;