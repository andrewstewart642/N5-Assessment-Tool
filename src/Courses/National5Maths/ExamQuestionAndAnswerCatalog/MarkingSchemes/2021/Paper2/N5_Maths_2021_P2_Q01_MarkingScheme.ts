import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2021_P2_Q01_MS = {
  "id": "N5_MATH_2021_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2021_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2021,
  "paper": "P2",
  "questionNumber": "1",
  "totalMarks": 3,
  "questionFamilyId": "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  "sourceContext": "COVID_RESOURCE",
  "methodEvidence": [
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.COMPOUND_PERCENT_MULTIPLIER_POWER,
      "evidenceRole": "ILLUSTRATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Identify multiplier 1.04 for a 4% annual increase.",
        "Apply 250000 × 1.04^2 for two compound periods.",
        "Evaluate correctly to £270400."
      ]
    }
  ],
  "markSkillOwnership": [
    {
      "markNumber": 1,
      "skillId": "compound-percentages"
    },
    {
      "markNumber": 2,
      "skillId": "compound-percentages"
    },
    {
      "markNumber": 3,
      "skillId": "compound-percentages"
    }
  ],
  "expectedAnswer": {
    "displayText": "£270400",
    "numericValue": 270400
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 1.04 for a 4% annual increase.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 250000 × 1.04^2 for two compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate correctly to £270400.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "NO_CREDIT",
    "marksAwarded": 0,
    "notes": "No question-specific exception is given; the 2021 resource general principle requires appropriate working for full credit and gives no mark for an unsupported correct answer."
  },
  "markingRules": [],
  "commonResponses": [],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 13,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 429,
        "bottomPx": 820,
        "heightPx": 391,
        "topPt": 102.96,
        "bottomPt": 196.8,
        "heightPt": 93.84,
        "heightMm": 33.1
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 13,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 429,
        "bottomPx": 820,
        "heightPx": 391,
        "topPt": 102.96,
        "bottomPt": 196.8,
        "heightPt": 93.84,
        "heightMm": 33.1
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
