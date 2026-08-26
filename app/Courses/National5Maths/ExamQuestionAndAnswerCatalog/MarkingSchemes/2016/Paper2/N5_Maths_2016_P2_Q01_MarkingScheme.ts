import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2016_P2_Q01_MS = {
  "id": "N5_MATH_2016_P2_Q01_MS",
  "sourceQuestionId": "N5_MATH_2016_P2_Q01",
  "courseId": "N5_MATH",
  "year": 2016,
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
        "Identify multiplier 0.92 for an 8% annual decrease.",
        "Apply 35 × 0.92^3 for the three compound periods.",
        "Evaluate the calculation correctly to 27.25408 g."
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
    "displayText": "27.25408 g",
    "numericValue": 27.25408
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Identify multiplier 0.92 for an 8% annual decrease.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Apply 35 × 0.92^3 for the three compound periods.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Evaluate the calculation correctly to 27.25408 g.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3,
    "notes": "The question-specific notes explicitly award 3/3 for the correct answer without working."
  },
  "markingRules": [
    {
      "id": "incorrect-percentage-follow-through",
      "category": "FOLLOW_THROUGH",
      "conditionSummary": "An incorrect percentage is chosen but a valid compound process is then followed consistently.",
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
      "conditionSummary": "The correct multiplier 0.92 is used as a divisor rather than a multiplier.",
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
      "conditionSummary": "A division strategy is combined with an incorrect percentage.",
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
      "id": "rounding-not-penalised",
      "category": "ROUNDING",
      "conditionSummary": "The final numerical value is rounded after a correct calculation.",
      "outcome": {
        "maximumMarks": 3
      },
      "appliesToMarkNumbers": [
        3
      ],
      "notes": "The source explicitly says not to penalise incorrect rounding for this question."
    }
  ],
  "commonResponses": [
    {
      "id": "increase-instead-of-decrease",
      "category": "COMMON_ERROR",
      "responseSummary": "Uses 1.08 instead of 0.92 but otherwise compounds for three years.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "fixed-absolute-decrease",
      "category": "COMMON_ERROR",
      "responseSummary": "Subtracts the same 8% of the original amount three times.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "one-period-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Applies multiplier 0.92 once only.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "multiplier-times-three",
      "category": "COMMON_ERROR",
      "responseSummary": "Multiplies the one-year value by 3 rather than compounding.",
      "marksAwarded": 1,
      "maximumMarks": 1
    },
    {
      "id": "percentage-amount-only",
      "category": "COMMON_ERROR",
      "responseSummary": "Calculates only the total percentage amount over three years.",
      "marksAwarded": 0,
      "maximumMarks": 0
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 21,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 480,
        "bottomPx": 954,
        "heightPx": 474,
        "topPt": 115.2,
        "bottomPt": 228.96,
        "heightPt": 113.76,
        "heightMm": 40.13
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 21,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 480,
        "bottomPx": 2285,
        "heightPx": 1805,
        "topPt": 115.2,
        "bottomPt": 548.4,
        "heightPt": 433.2,
        "heightMm": 152.82
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
