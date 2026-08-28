import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";


export const N5_MATHS_2022_P1_Q01_MS = {
  id:
    "N5_MATH_2022_P1_Q01_MS",

  sourceQuestionId:
    "N5_MATH_2022_P1_Q01",

  courseId:
    "N5_MATH",

  year:
    2022,

  paper:
    "P1",

  questionNumber:
    "1",

  totalMarks:
    2,

  questionFamilyId:
    "NUM_FRACTIONS_BRACKETED_SUM_WITH_FRACTION_MULTIPLIER",

  sourceContext:
    "STANDARD_EXAM",

  methodEvidence: [
    {
      /**
       * Complete the addition inside the
       * bracket first, then multiply by
       * the outside fraction.
       */
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_BRACKET_THEN_MULTIPLY,

      evidenceRole:
        "ILLUSTRATIVE",

      supportsFullCredit:
        true,
    },

    {
      /**
       * Distribute the outside fraction
       * across both terms in the bracket,
       * then add the resulting fractions.
       */
      methodFamilyId:
        ANSWER_METHOD_FAMILY_IDS
          .FRACTION_DISTRIBUTE_THEN_ADD,

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
        "order-of-operations",
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