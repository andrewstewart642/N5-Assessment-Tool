import type {
  ExamMarkingSchemeCatalogEntry,
} from "../../ExamMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2025_P1_Q04_MS = {
  "id": "N5_MATH_2025_P1_Q04_MS",
  "sourceQuestionId": "N5_MATH_2025_P1_Q04",
  "courseId": "N5_MATH",
  "year": 2025,
  "paper": "P1",
  "questionNumber": "4",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
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
        "Recognise that 80% corresponds to £720.",
        "Use an accepted unitary step such as 1%, 10% or 20%.",
        "Scale to 100% to obtain £900."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_1_PERCENT
    },
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
        "Recognise that 80% corresponds to £720.",
        "Find 10% = £720 ÷ 8.",
        "Scale to 100% to obtain £900."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_10_PERCENT
    },
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
        "Recognise that 80% corresponds to £720.",
        "Find 20% = £720 ÷ 4.",
        "Scale to 100% to obtain £900."
      ],
      "variantId": ANSWER_METHOD_VARIANT_IDS.VIA_20_PERCENT
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
        "Recognise multiplier 0.8.",
        "Divide £720 by 0.8.",
        "Obtain £900."
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
    "displayText": "£900",
    "numericValue": 900
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the sale price represents 80% of the pre-sale price.",
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
      "evidenceSummary": "Complete the calculation to obtain £900.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "NO_CREDIT",
    "marksAwarded": 0,
    "notes": "The question-specific notes explicitly award 0/3 for the correct answer without working."
  },
  "markingRules": [
    {
      "id": "direct-percent-of-sale-price",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 80%, 120% or 20% of £720 rather than reversing the relationship.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "The one mark requires evidence that 80%=£720; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses £720 ÷ 0.8 = £900.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-120-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £720 as 120% and reverses.",
      "maximumMarks": 2
    },
    {
      "id": "treats-as-20-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £720 as 20% and reverses.",
      "marksAwarded": 1,
      "maximumMarks": 1
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 9,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 269,
        "bottomPx": 1306,
        "heightPx": 1037,
        "topPt": 64.56,
        "bottomPt": 313.44,
        "heightPt": 248.88,
        "heightMm": 87.8
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 9,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 269,
        "bottomPx": 2400,
        "heightPx": 2131,
        "topPt": 64.56,
        "bottomPt": 576.0,
        "heightPt": 511.44,
        "heightMm": 180.42
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies ExamMarkingSchemeCatalogEntry;
