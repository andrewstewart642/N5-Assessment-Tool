import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2014_P1_Q09_MS = {
  "id": "N5_MATH_2014_P1_Q09_MS",
  "sourceQuestionId": "N5_MATH_2014_P1_Q09",
  "courseId": "N5_MATH",
  "year": 2014,
  "paper": "P1",
  "questionNumber": "9",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
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
        "Recognise that 80% corresponds to 480000.",
        "Use a valid unitary route, illustrated by finding 10% = 60000.",
        "Scale to 100% to obtain 600000."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_10_PERCENT
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
    "displayText": "600000",
    "numericValue": 600000
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that 80% of the whole is 480000.",
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
      "evidenceSummary": "Complete the strategy to obtain the whole, 600000.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "direct-percent-of-known-value",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 80% or 120% of the known 480000 instead of reversing to the whole.",
      "outcome": {
        "maximumMarks": 1,
        "unavailableMarkNumbers": [
          2,
          3
        ]
      },
      "appliesToMarkNumbers": [
        1,
        2,
        3
      ],
      "notes": "One mark is available only where the candidate has also evidenced that 80% = 480000; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "80-percent-of-known",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates 80% of 480000, giving 384000.",
      "maximumMarks": 1
    },
    {
      "id": "120-percent-of-known",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates 120% of 480000, giving 576000.",
      "maximumMarks": 1
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 6,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 2134,
        "bottomPx": 2570,
        "heightPx": 436,
        "topPt": 512.16,
        "bottomPt": 616.8,
        "heightPt": 104.64,
        "heightMm": 36.91
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 6,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 2134,
        "bottomPx": 2945,
        "heightPx": 811,
        "topPt": 512.16,
        "bottomPt": 706.8,
        "heightPt": 194.64,
        "heightMm": 68.66
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
