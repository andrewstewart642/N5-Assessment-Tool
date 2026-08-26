import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2025_P2_Q01_MS = {
  "id": "N5_MATH_2025_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2025_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2025,
  "paper": "P2",
  "questionNumber": "1",
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
        "Identify multiplier 1.04 for a 4% annual increase.",
        "Apply 118750 × 1.04^2 for the two compound periods.",
        "Evaluate correctly to 128440."
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
    "displayText": "128440",
    "numericValue": 128440
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
      "evidenceSummary": "Apply 118750 × 1.04^2 for the two compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate correctly to 128440.",
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
      "conditionSummary": "An incorrect power greater than 2 is used but processing is otherwise valid.",
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
      "id": "division-correct-multiplier",
      "category": "WRONG_OPERATION",
      "conditionSummary": "The correct multiplier 1.04 is used as a divisor.",
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
      "id": "division-wrong-percentage",
      "category": "ERROR_LIMIT",
      "conditionSummary": "Division is combined with an incorrect percentage.",
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
    }
  ],
  "commonResponses": [
    {
      "id": "decrease-instead-of-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.96^2.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies 1.04 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-two",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 118750 × 1.04 × 2.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "one-simple-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates one 4% increase and adds it once.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "fixed-two-year-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Adds the same 4% of the original value twice.",
      "marksAwarded": 0,
      "maximumMarks": 0
    },
    {
      "id": "eight-percent-compounded",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 8% as the annual rate over two years.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "one-eight-percent-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses one 8% increase only.",
      "marksAwarded": 0,
      "maximumMarks": 0
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Reports only the percentage increase amount.",
      "marksAwarded": 0,
      "maximumMarks": 0
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 28,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 449,
        "bottomPx": 840,
        "heightPx": 391,
        "topPt": 107.76,
        "bottomPt": 201.6,
        "heightPt": 93.84,
        "heightMm": 33.1
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 28,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 449,
        "bottomPx": 2397,
        "heightPx": 1948,
        "topPt": 107.76,
        "bottomPt": 575.28,
        "heightPt": 467.52,
        "heightMm": 164.93
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
