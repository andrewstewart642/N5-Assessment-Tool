import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2021_P1_Q12_MS = {
  "id": "N5_MATH_2021_P1_Q12_MS",
  "sourceQuestionId": "N5_MATH_2021_P1_Q12",
  "courseId": "N5_MATH",
  "year": 2021,
  "paper": "P1",
  "questionNumber": "12",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  "sourceContext": "COVID_RESOURCE",
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
        "Recognise that 75% corresponds to 2400.",
        "Use a valid unitary route, for example 25% = 2400 ÷ 3.",
        "Scale to 100% to obtain 3200."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_25_PERCENT
    },
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
        "Recognise that 75% corresponds to 2400.",
        "Alternatively find 1% = 2400 ÷ 75.",
        "Scale to 100% to obtain 3200."
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
    "displayText": "3200",
    "numericValue": 3200
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that 75% corresponds to 2400.",
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
      "evidenceSummary": "Complete the strategy to obtain 3200.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "NO_CREDIT",
    "marksAwarded": 0,
    "notes": "No question-specific exception is provided; the 2021 resource's general marking principle requires appropriate working and gives no mark for an unsupported correct answer."
  },
  "markingRules": [],
  "commonResponses": [],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 6,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 2551,
        "bottomPx": 2998,
        "heightPx": 447,
        "topPt": 612.24,
        "bottomPt": 719.52,
        "heightPt": 107.28,
        "heightMm": 37.85
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 6,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 2551,
        "bottomPx": 2998,
        "heightPx": 447,
        "topPt": 612.24,
        "bottomPt": 719.52,
        "heightPt": 107.28,
        "heightMm": 37.85
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
