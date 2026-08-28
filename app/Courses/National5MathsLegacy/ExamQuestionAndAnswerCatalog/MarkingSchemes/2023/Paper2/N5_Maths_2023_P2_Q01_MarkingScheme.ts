import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2023_P2_Q01_MS = {
  "id": "N5_MATH_2023_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2023_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2023,
  "paper": "P2",
  "questionNumber": "1",
  "totalMarks": 3,
  "questionFamilyId": "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",
  "sourceContext": "STANDARD_EXAM",
  "methodEvidence": [
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.COMPOUND_PERCENT_MULTI_RATE_MULTIPLIER_POWER,
      "evidenceRole": "ILLUSTRATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Identify both decrease multipliers, 0.89 and 0.94.",
        "Apply 20000 × 0.89 × 0.94^2 with the correct stage durations.",
        "Evaluate correctly to £15728.08."
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
    "displayText": "£15728.08",
    "numericValue": 15728.08,
    "alternativeDisplayTexts": [
      "£15728",
      "£15728.10"
    ]
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify both decrease multipliers, 0.89 and 0.94.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 20000 × 0.89 × 0.94^2 with the correct stage durations.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate correctly to £15728.08.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "single-rate-treatment",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The two-stage problem is replaced by one repeated percentage-change rate.",
      "outcome": {
        "maximumMarks": 1,
        "unavailableMarkNumbers": [
          1,
          2
        ],
        "followThroughMarkNumbers": [
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
      "id": "incorrect-percentages-follow-through",
      "category": "FOLLOW_THROUGH",
      "conditionSummary": "One or both rates are incorrect but the staged compound process is then followed consistently.",
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
      "id": "division-correct-multipliers",
      "category": "WRONG_OPERATION",
      "conditionSummary": "Correct multipliers 0.89 and 0.94 are used as divisors.",
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
      "id": "division-wrong-percentages",
      "category": "ERROR_LIMIT",
      "conditionSummary": "Division is combined with incorrect percentage multipliers.",
      "outcome": {
        "maximumMarks": 1,
        "unavailableMarkNumbers": [
          1,
          2
        ],
        "followThroughMarkNumbers": [
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
      "id": "rounding-accepted",
      "category": "ROUNDING",
      "conditionSummary": "The final monetary answer is shown as 15728 or 15728.10.",
      "outcome": {
        "maximumMarks": 3
      },
      "appliesToMarkNumbers": [
        3
      ],
      "notes": "The source accepts these forms but not 15728.1."
    }
  ],
  "commonResponses": [
    {
      "id": "second-rate-once",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.89 × 0.94 only once.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "wrong-second-rate",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses the correct staged structure with an incorrect second percentage.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "percentage-amount-product",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses the percentage amounts 0.11 and 0.06^2 rather than retained multipliers.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "increases-instead-of-decreases",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 1.11 and 1.06^2.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "combined-rate-repeated",
      "category": "COMMON_ERROR",
      "responseSummary": "Combines the rates and repeats a single multiplier.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "simple-second-stage",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.89 then treats the second 6% changes as simple rather than compound.",
      "marksAwarded": 1,
      "maximumMarks": 1
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 23,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 425,
        "bottomPx": 844,
        "heightPx": 419,
        "topPt": 102.0,
        "bottomPt": 202.56,
        "heightPt": 100.56,
        "heightMm": 35.48
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 23,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 425,
        "bottomPx": 2752,
        "heightPx": 2327,
        "topPt": 102.0,
        "bottomPt": 660.48,
        "heightPt": 558.48,
        "heightMm": 197.02
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
