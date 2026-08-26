import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/AnswerMethods/AnswerMethodIds";


export const N5_MATHS_2018_P1_Q01_MS = {
  id:
    "N5_MATH_2018_P1_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2018_P1_Q01",

  courseId:
    "N5_MATH",

  year:
    2018,

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
      /**
       * Preserve the whole-number component
       * and place the fractional parts over
       * a common denominator.
       */
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_ADD_MIXED_COMPONENTS,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      /**
       * Convert the mixed number to an
       * improper fraction and perform the
       * addition using a common denominator.
       */
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_ADD_IMPROPER,

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
        "fraction-addition",
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