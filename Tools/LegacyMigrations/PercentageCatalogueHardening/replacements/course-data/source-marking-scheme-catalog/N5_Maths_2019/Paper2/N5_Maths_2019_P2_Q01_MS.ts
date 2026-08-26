import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2019_P2_Q01_MS = {
  "id": "N5_MATH_2019_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2019_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2019,
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
        "Identify multiplier 1.15 for a 15% annual increase.",
        "Apply 80000 × 1.15^3 for the three compound periods.",
        "Evaluate correctly to 121670."
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
    "displayText": "121670",
    "numericValue": 121670
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 1.15 for a 15% annual increase.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 80000 × 1.15^3 for the three compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate correctly to 121670.",
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
      "conditionSummary": "An incorrect percentage is used but a valid compound process is followed consistently.",
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
      "conditionSummary": "A power of at least 2 is used incorrectly but the remaining calculation is valid.",
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
      "conditionSummary": "The correct 1.15 multiplier is used as a divisor.",
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
      "id": "wrong-rate-1-point-015",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 1.015 instead of 1.15 but compounds correctly.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "decrease-instead-of-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.85 and compounds for three years.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies 1.15 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-three",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 80000 × 1.15 × 3.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "simple-interest",
      "category": "COMMON_ERROR",
      "responseSummary": "Adds the same 15% of the original value three times.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates only the percentage increase amount.",
      "marksAwarded": 0,
      "maximumMarks": 0
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 25,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 444,
        "bottomPx": 846,
        "heightPx": 402,
        "topPt": 106.56,
        "bottomPt": 203.04,
        "heightPt": 96.48,
        "heightMm": 34.04
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 25,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 444,
        "bottomPx": 2734,
        "heightPx": 2290,
        "topPt": 106.56,
        "bottomPt": 656.16,
        "heightPt": 549.6,
        "heightMm": 193.89
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
