import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2024_P2_Q05_MS = {
  "id": "N5_MATH_2024_P2_Q05_MS",
  "sourceQuestionId": "N5_MATH_2024_P2_Q05",
  "courseId": "N5_MATH",
  "year": 2024,
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
        "Recognise that 116% corresponds to £278.40.",
        "Find 1% = £278.40 ÷ 116.",
        "Scale to 100% to obtain £240."
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
        "Recognise multiplier 1.16.",
        "Divide £278.40 by 1.16.",
        "Obtain £240."
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
    "displayText": "£240",
    "numericValue": 240
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the current insurance cost represents 116% of last year's cost.",
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
      "evidenceSummary": "Complete the calculation to obtain £240.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "direct-percent-of-current",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 16%, 84% or 116% of £278.40 rather than reversing the relationship.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "The one mark requires evidence that 116%=£278.40; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses £278.40 ÷ 1.16 = £240.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-84-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £278.40 as 84% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 30,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 314,
        "bottomPx": 775,
        "heightPx": 461,
        "topPt": 75.36,
        "bottomPt": 186.0,
        "heightPt": 110.64,
        "heightMm": 39.03
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 30,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 314,
        "bottomPx": 2043,
        "heightPx": 1729,
        "topPt": 75.36,
        "bottomPt": 490.32,
        "heightPt": 414.96,
        "heightMm": 146.39
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
