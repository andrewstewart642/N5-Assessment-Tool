import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2023_P2_Q06_MS = {
  "id": "N5_MATH_2023_P2_Q06_MS",
  "sourceQuestionId": "N5_MATH_2023_P2_Q06",
  "courseId": "N5_MATH",
  "year": 2023,
  "paper": "P2",
  "questionNumber": "6",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
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
        "Recognise that 108% corresponds to £94500.",
        "Find 1% = 94500 ÷ 108.",
        "Scale to 100% to obtain £87500."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_1_PERCENT
    },
    {
      "methodFamilyId": ANSWER_METHOD_FAMILY_IDS.REVERSE_PERCENT_INVERSE_MULTIPLIER,
      "evidenceRole": "FULL_CREDIT_ALTERNATIVE",
      "supportsFullCredit": true,
      "markNumbers": [
        1,
        2,
        3
      ],
      "evidenceSummary": [
        "Recognise multiplier 1.08.",
        "Divide £94500 by 1.08.",
        "Obtain £87500."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.DIVIDE_BY_MULTIPLIER
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
    "displayText": "£87500",
    "numericValue": 87500
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the current value represents 108% of the purchase price.",
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
      "evidenceSummary": "Complete the calculation to obtain £87500.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "FULL_CREDIT",
    "marksAwarded": 3
  },
  "markingRules": [
    {
      "id": "direct-percent-of-current",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 8%, 92% or 108% of £94500 rather than reversing the relationship.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "The one mark requires evidence that 108%=94500; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses 94500 ÷ 1.08 = 87500.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-92-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats 94500 as 92% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
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
        "topPx": 314,
        "bottomPx": 767,
        "heightPx": 453,
        "topPt": 75.36,
        "bottomPt": 184.08,
        "heightPt": 108.72,
        "heightMm": 38.35
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 28,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 314,
        "bottomPx": 1787,
        "heightPx": 1473,
        "topPt": 75.36,
        "bottomPt": 428.88,
        "heightPt": 353.52,
        "heightMm": 124.71
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
