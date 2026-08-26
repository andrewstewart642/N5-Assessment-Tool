import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2015_P2_Q08_MS = {
  "id": "N5_MATH_2015_P2_Q08_MS",
  "sourceQuestionId": "N5_MATH_2015_P2_Q08",
  "courseId": "N5_MATH",
  "year": 2015,
  "paper": "P2",
  "questionNumber": "8",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
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
        "Recognise that 85% corresponds to £297.50.",
        "Find 1% by dividing £297.50 by 85.",
        "Scale to 100% to obtain £350."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_1_PERCENT
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
    "displayText": "£350",
    "numericValue": 350
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the paid amount is 85% of the original price.",
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
      "evidenceSummary": "Complete the strategy to obtain the original price, £350.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "direct-percentage-of-known",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 85% or 115% of £297.50 rather than reversing the percentage.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "The mark is available only where the relationship 85% = £297.50 is also evidenced; otherwise 0/3."
    },
    {
      "id": "uses-115-as-known-percent",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate treats £297.50 as 115% and reverses from that incorrect interpretation.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          1
        ],
        "followThroughMarkNumbers": [
          2,
          3
        ]
      },
      "appliesToMarkNumbers": [
        1,
        2,
        3
      ]
    },
    {
      "id": "subsequent-incorrect-working",
      "category": "ERROR_LIMIT",
      "conditionSummary": "A correct original value is reached and then altered by further incorrect working.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          3
        ]
      },
      "appliesToMarkNumbers": [
        3
      ]
    }
  ],
  "commonResponses": [
    {
      "id": "85-percent-of-paid",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates 85% of £297.50.",
      "maximumMarks": 1
    },
    {
      "id": "115-percent-of-paid",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates 115% of £297.50.",
      "maximumMarks": 1
    },
    {
      "id": "reverse-from-115",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £297.50 as 115% and reverses to approximately £258.70.",
      "marksAwarded": 2,
      "maximumMarks": 2
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 17,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 1518,
        "bottomPx": 2082,
        "heightPx": 564,
        "topPt": 364.32,
        "bottomPt": 499.68,
        "heightPt": 135.36,
        "heightMm": 47.75
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 17,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 1518,
        "bottomPx": 2786,
        "heightPx": 1268,
        "topPt": 364.32,
        "bottomPt": 668.64,
        "heightPt": 304.32,
        "heightMm": 107.36
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
