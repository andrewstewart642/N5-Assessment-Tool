import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2017_P2_Q05_MS = {
  "id": "N5_MATH_2017_P2_Q05_MS",
  "sourceQuestionId": "N5_MATH_2017_P2_Q05",
  "courseId": "N5_MATH",
  "year": 2017,
  "paper": "P2",
  "questionNumber": "5",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  "sourceContext": "STANDARD_EXAM",
  "methodEvidence": [
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.REVERSE_PERCENT_UNITARY,
      "evidenceRole": "ILLUSTRATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Recognise that 115% corresponds to 4830.",
        "Find 1% by dividing 4830 by 115.",
        "Scale to 100% to obtain 4200."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_1_PERCENT
    },
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.REVERSE_PERCENT_INVERSE_MULTIPLIER,
      "evidenceRole": "FULL_CREDIT_ALTERNATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Recognise that the current value is 115% of the previous value.",
        "Divide 4830 by 1.15.",
        "Obtain 4200."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.DIVIDE_BY_MULTIPLIER
    }
  ],
  "markSkillOwnership": [
    {
      "markNumber": 1,
      "skillId": "reverse-percentages"
    },
    {
      "markNumber": 2,
      "skillId": "reverse-percentages"
    },
    {
      "markNumber": 3,
      "skillId": "reverse-percentages"
    }
  ],
  "expectedAnswer": {
    "displayText": "4200",
    "numericValue": 4200
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that 4830 represents 115% of the previous total.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Begin a valid reverse-percentage strategy.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Complete the calculation to obtain 4200.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "direct-85-or-115-percent",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 85% or 115% of 4830 instead of reversing the relationship.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "One mark is available only where the candidate has also established 115% = 4830; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses 4830 ÷ 1.15 = 4200.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-85-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats 4830 as 85% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "treats-as-15-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats 4830 as 15% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 26,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 381,
        "bottomPx": 951,
        "heightPx": 570,
        "topPt": 91.44,
        "bottomPt": 228.24,
        "heightPt": 136.8,
        "heightMm": 48.26
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 26,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 381,
        "bottomPx": 2123,
        "heightPx": 1742,
        "topPt": 91.44,
        "bottomPt": 509.52,
        "heightPt": 418.08,
        "heightMm": 147.49
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
