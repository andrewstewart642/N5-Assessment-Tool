import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2019_P2_Q09_MS = {
  "id": "N5_MATH_2019_P2_Q09_MS",
  "sourceQuestionId": "N5_MATH_2019_P2_Q09",
  "courseId": "N5_MATH",
  "year": 2019,
  "paper": "P2",
  "questionNumber": "9",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE",
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
        "Recognise that 102.5% corresponds to £977.85.",
        "Reverse the percentage to recover the original £954.",
        "Use the recovered original value to obtain the surcharge/saving, £23.85."
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
    "displayText": "£23.85",
    "numericValue": 23.85
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the final payment represents 102.5% of the original charge.",
      "followThroughAvailable": false
    },
    {
      "markNumber": 2,
      "evidenceKind": "PROCESS",
      "evidenceSummary": "Begin a valid reverse-percentage strategy to recover the original amount.",
      "followThroughAvailable": true
    },
    {
      "markNumber": 3,
      "evidenceKind": "ACCURACY",
      "evidenceSummary": "Complete the second step and obtain the difference, £23.85.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "percentage-of-final",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 2.5% or 97.5% of the final £977.85 rather than reversing first.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "The one mark requires evidence of the correct 102.5% relationship; otherwise 0/3."
    },
    {
      "id": "original-value-only",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate correctly finds the original charge £954 but does not calculate the requested saving.",
      "outcome": {
        "maximumMarks": 2,
        "unavailableMarkNumbers": [
          3
        ]
      },
      "appliesToMarkNumbers": [
        3
      ]
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier-original-only",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Uses £977.85 ÷ 1.025 = £954 but stops before finding the saving.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "treats-as-97-point-5",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £977.85 as 97.5% and reverses.",
      "maximumMarks": 1
    },
    {
      "id": "treats-as-2-point-5",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £977.85 as 2.5% and reverses.",
      "maximumMarks": 1
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 33,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 314,
        "bottomPx": 714,
        "heightPx": 400,
        "topPt": 75.36,
        "bottomPt": 171.36,
        "heightPt": 96.0,
        "heightMm": 33.87
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 33,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 314,
        "bottomPx": 2217,
        "heightPx": 1903,
        "topPt": 75.36,
        "bottomPt": 532.08,
        "heightPt": 456.72,
        "heightMm": 161.12
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
