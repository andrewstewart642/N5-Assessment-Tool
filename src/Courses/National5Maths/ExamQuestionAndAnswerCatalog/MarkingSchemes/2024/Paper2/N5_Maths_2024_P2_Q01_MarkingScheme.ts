import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2024_P2_Q01_MS = {
  "id": "N5_MATH_2024_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2024_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2024,
  "paper": "P2",
  "questionNumber": "1",
  "totalMarks": 3,
  "questionFamilyId": "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
  "sourceContext": "STANDARD_EXAM",
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
        "Identify multiplier 0.74 for a 26% annual depreciation.",
        "Apply 460 × 0.74^3 for three compound periods.",
        "Evaluate and present the expected monetary value as £186.40 (with £186 also accepted)."
      ]
    },
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.COMPOUND_PERCENT_YEAR_BY_YEAR,
      "evidenceRole": "FULL_CREDIT_ALTERNATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Identify multiplier 0.74.",
        "Apply 0.74 successively to each year's updated value.",
        "Complete the repeated calculations and present the final monetary value correctly."
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
    "displayText": "£186.40",
    "numericValue": 186.4,
    "alternativeDisplayTexts": [
      "£186"
    ]
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 0.74 for a 26% annual depreciation.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 460 × 0.74^3 for three compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate and present the expected monetary value as £186.40 (with £186 also accepted).",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "year-by-year-full-credit",
      "category": "ALTERNATIVE_METHOD",
      "conditionSummary": "The multiplier 0.74 is applied successively year by year.",
      "outcome": {
        "maximumMarks": 3
      },
      "appliesToMarkNumbers": [
        1,
        2,
        3
      ]
    },
    {
      "id": "unrounded-final-value",
      "category": "ROUNDING",
      "conditionSummary": "The candidate gives 186.40304 or 186.403 without an accepted money presentation.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          3
        ]
      },
      "appliesToMarkNumbers": [
        3
      ]
    },
    {
      "id": "incorrect-percentage-follow-through",
      "category": "FOLLOW_THROUGH",
      "conditionSummary": "An incorrect percentage is used but compounded consistently.",
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
      "id": "incorrect-power-follow-through",
      "category": "FOLLOW_THROUGH",
      "conditionSummary": "An incorrect power of at least 2 is used.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          2
        ],
        "followThroughMarkNumbers": [
          3
        ]
      },
      "appliesToMarkNumbers": [
        2,
        3
      ]
    },
    {
      "id": "subsequent-incorrect-working",
      "category": "ERROR_LIMIT",
      "conditionSummary": "Correct answer is reached and then altered by further incorrect working.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          3
        ]
      },
      "appliesToMarkNumbers": [
        3
      ]
    },
    {
      "id": "division-correct-multiplier",
      "category": "WRONG_OPERATION",
      "conditionSummary": "The correct multiplier 0.74 is used as a divisor.",
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
    }
  ],
  "commonResponses": [
    {
      "id": "raw-calculator-value",
      "category": "ROUNDING_ERROR",
      "responseSummary": "Gives 186.40304 or 186.403.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies 0.74 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-three",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 460 × 0.74 × 3.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "simple-depreciation",
      "category": "COMMON_ERROR",
      "responseSummary": "Subtracts the same 26% of the original value three times.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates only the percentage loss amount.",
      "marksAwarded": 0,
      "maximumMarks": 0
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
        "topPx": 434,
        "bottomPx": 780,
        "heightPx": 346,
        "topPt": 104.16,
        "bottomPt": 187.2,
        "heightPt": 83.04,
        "heightMm": 29.29
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 26,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 434,
        "bottomPx": 3307,
        "heightPx": 2873,
        "topPt": 104.16,
        "bottomPt": 793.68,
        "heightPt": 689.52,
        "heightMm": 243.25
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
