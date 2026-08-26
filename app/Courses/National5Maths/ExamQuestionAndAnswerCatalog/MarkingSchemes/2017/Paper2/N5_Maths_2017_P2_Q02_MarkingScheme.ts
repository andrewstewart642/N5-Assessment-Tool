import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2017_P2_Q02_MS = {
  "id": "N5_MATH_2017_P2_Q02_MS",
  "sourceQuestionId": "N5_MATH_2017_P2_Q02",
  "courseId": "N5_MATH",
  "year": 2017,
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
        "Identify multiplier 1.045 for a 4.5% annual increase.",
        "Apply 1200 × 1.045^3 for the three compound periods.",
        "Evaluate and round the final value to the nearest pound, £1369."
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
    "displayText": "£1369",
    "numericValue": 1369
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 1.045 for a 4.5% annual increase.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 1200 × 1.045^3 for the three compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ROUNDING",
      "evidenceSummary": "Evaluate and round the final value to the nearest pound, £1369.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "unrounded-final-value",
      "category": "ROUNDING",
      "conditionSummary": "The candidate gives 1369.4 or 1369.40 rather than rounding to the nearest pound.",
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
      "conditionSummary": "An incorrect percentage is used and then compounded consistently.",
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
      "id": "1369-point-4",
      "category": "ROUNDING_ERROR",
      "responseSummary": "Gives £1369.40 or £1369.4 rather than nearest pound.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "decrease-instead-of-increase",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 0.955 and compounds for three years.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "simple-interest",
      "category": "COMMON_ERROR",
      "responseSummary": "Adds the same 4.5% of the original value three times.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies multiplier 1.045 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-three",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 1200 × 1.045 × 3.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates only the three-year simple percentage amount.",
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
        "topPx": 381,
        "bottomPx": 863,
        "heightPx": 482,
        "topPt": 91.44,
        "bottomPt": 207.12,
        "heightPt": 115.68,
        "heightMm": 40.81
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 23,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 381,
        "bottomPx": 2540,
        "heightPx": 2159,
        "topPt": 91.44,
        "bottomPt": 609.6,
        "heightPt": 518.16,
        "heightMm": 182.8
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
