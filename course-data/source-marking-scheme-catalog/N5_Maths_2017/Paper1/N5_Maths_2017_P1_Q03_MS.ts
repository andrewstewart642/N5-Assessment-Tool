import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/AnswerMethods/AnswerMethodIds";


export const N5_MATHS_2017_P1_Q03_MS = {
  id:
    "N5_MATH_2017_P1_Q03_MS",

  sourceQuestionId:
    "N5_MATH_2017_P1_Q03",

  courseId:
    "N5_MATH",

  year:
    2017,

  paper:
    "P1",

  questionNumber:
    "3",

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
          .FRACTION_DIVIDE_RECIPROCAL,

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
        "fraction-division",
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