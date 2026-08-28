import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";


export const N5_MATHS_2025_P1_Q01_MS = {
  id:
    "N5_MATH_2025_P1_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2025_P1_Q01",

  courseId:
    "N5_MATH",

  year:
    2025,

  paper:
    "P1",

  questionNumber:
    "1",

  totalMarks:
    2,

  questionFamilyId:
    "NUM_FRACTIONS_MIXED_NUMBER_WITH_PROPER_FRACTION",

  sourceContext:
    "STANDARD_EXAM",

  methodEvidence: [
    {
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_MULTIPLY_IMPROPER,

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
        "fraction-multiplication",
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
} satisfies ExamMarkingSchemeCatalogEntry;