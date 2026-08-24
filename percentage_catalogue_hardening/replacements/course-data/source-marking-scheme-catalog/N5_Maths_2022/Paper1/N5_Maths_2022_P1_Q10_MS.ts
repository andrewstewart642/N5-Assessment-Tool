import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";

export const N5_MATHS_2022_P1_Q10_MS = {
  "id": "N5_MATH_2022_P1_Q10_MS",
  "sourceQuestionId": "N5_MATH_2022_P1_Q10",
  "courseId": "N5_MATH",
  "year": 2022,
  "paper": "P1",
  "questionNumber": "10",
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
        "Recognise that 70% corresponds to £16.10.",
        "Find 10% = £16.10 ÷ 7 or 1% = £16.10 ÷ 70.",
        "Scale to 100% to obtain £23."
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
        "Recognise that 70% corresponds to £16.10.",
        "Find 1% = £16.10 ÷ 70.",
        "Scale to 100% to obtain £23."
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
        "Recognise multiplier 0.7.",
        "Divide £16.10 by 0.7.",
        "Obtain £23."
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
    "displayText": "£23",
    "numericValue": 23
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that the amount paid represents 70% of the original price.",
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
      "evidenceSummary": "Complete the calculation to obtain £23.",
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
      "id": "direct-percent-of-known",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 30%, 70% or 130% of £16.10 rather than reversing the percentage.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "One mark is available only when the correct 70%=£16.10 relationship is also evidenced; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses £16.10 ÷ 0.7 = £23.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-30-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £16.10 as 30% and reverses.",
      "maximumMarks": 2
    },
    {
      "id": "treats-as-130-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats £16.10 as 130% and reverses.",
      "maximumMarks": 2
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 12,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 298,
        "bottomPx": 860,
        "heightPx": 562,
        "topPt": 71.52,
        "bottomPt": 206.4,
        "heightPt": 134.88,
        "heightMm": 47.58
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 12,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 298,
        "bottomPx": 2416,
        "heightPx": 2118,
        "topPt": 71.52,
        "bottomPt": 579.84,
        "heightPt": 508.32,
        "heightMm": 179.32
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
