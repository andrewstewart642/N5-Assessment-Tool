import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2022_P2_Q02_MS = {
  "id": "N5_MATH_2022_P2_Q02_MS",
  "sourceQuestionId": "N5_MATH_2022_P2_Q02",
  "courseId": "N5_MATH",
  "year": 2022,
  "paper": "P2",
  "questionNumber": "2",
  "totalMarks": 3,
  "questionFamilyId": "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
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
        "Identify multiplier 1.03 for a 3% annual increase.",
        "Apply 215000 × 1.03^4 for four compound periods.",
        "Evaluate and round to the nearest thousand pounds, £242000."
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
    "displayText": "£242000",
    "numericValue": 242000,
    "alternativeDisplayTexts": [
      "£242000.00"
    ]
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 1.03 for a 3% annual increase.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 215000 × 1.03^4 for four compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ROUNDING",
      "evidenceSummary": "Evaluate and round to the nearest thousand pounds, £242000.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
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
      "id": "intermediate-rounding",
      "category": "ROUNDING",
      "conditionSummary": "Intermediate values are rounded during working.",
      "outcome": {
        "maximumMarks": 3
      },
      "notes": "The source requires intermediate values to be retained to at least four significant figures."
    },
    {
      "id": "division-correct-multiplier",
      "category": "WRONG_OPERATION",
      "conditionSummary": "The correct multiplier is used as a divisor.",
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
      "id": "unrounded-answer",
      "category": "ROUNDING_ERROR",
      "responseSummary": "Gives approximately 241984.39 rather than nearest thousand.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "decrease-instead-of-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.97^4.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies 1.03 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-four",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses the one-year multiplier and then multiplies by 4.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "simple-interest",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses a fixed 3% increase from the original value for four years.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Reports only the accumulated simple percentage increase.",
      "marksAwarded": 0,
      "maximumMarks": 0
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
        "topPx": 327,
        "bottomPx": 761,
        "heightPx": 434,
        "topPt": 78.48,
        "bottomPt": 182.64,
        "heightPt": 104.16,
        "heightMm": 36.75
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 23,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 327,
        "bottomPx": 2830,
        "heightPx": 2503,
        "topPt": 78.48,
        "bottomPt": 679.2,
        "heightPt": 600.72,
        "heightMm": 211.92
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
