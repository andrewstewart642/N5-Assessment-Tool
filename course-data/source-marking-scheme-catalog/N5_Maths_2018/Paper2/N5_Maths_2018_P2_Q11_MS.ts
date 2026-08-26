import type {
  SourceMarkingSchemeCatalogEntry,
} from "../../SourceMarkingSchemeTypes";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/src/Courses/National5Maths/AnswerMethods/AnswerMethodIds";

export const N5_MATHS_2018_P2_Q11_MS = {
  "id": "N5_MATH_2018_P2_Q11_MS",
  "sourceQuestionId": "N5_MATH_2018_P2_Q11",
  "courseId": "N5_MATH",
  "year": 2018,
  "paper": "P2",
  "questionNumber": "11",
  "totalMarks": 3,
  "questionFamilyId": "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
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
        "Recognise that 85% corresponds to 9.3 × 10^11 km³.",
        "Find 1% by dividing the known volume by 85.",
        "Scale to 100% and express the volume appropriately."
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
        "Recognise multiplier 0.85.",
        "Divide 9.3 × 10^11 by 0.85.",
        "Express the resulting Earth volume in valid form."
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
    "displayText": "1.094 × 10^12 km³",
    "numericValue": 1094117647058.8235,
    "alternativeDisplayTexts": [
      "1094117647000 km³",
      "1.1 × 10^12 km³"
    ]
  },
  "markEvidence": [
    {
      "markNumber": 1,
      "evidenceKind": "INTERPRETATION",
      "evidenceSummary": "Recognise that 85% of Earth's volume is 9.3 × 10^11 km³.",
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
      "evidenceSummary": "Complete the calculation and present the Earth volume in an accepted numerical form.",
      "followThroughAvailable": true
    }
  ],
  "correctAnswerWithoutWorking": {
    "treatment": "NO_CREDIT",
    "marksAwarded": 0,
    "notes": "The question notes explicitly state that an unsupported correct rounded answer receives 0/3."
  },
  "markingRules": [
    {
      "id": "correct-rounded-answer-needs-working",
      "category": "ANSWER_ONLY",
      "conditionSummary": "The candidate gives approximately 1.1 × 10^12 without valid working.",
      "outcome": {
        "marksAwarded": 0,
        "maximumMarks": 0
      }
    },
    {
      "id": "invalid-standard-form",
      "category": "PRESENTATION",
      "conditionSummary": "The numerical value is correct but written in a non-standard scientific-notation form such as 10.94 × 10^11.",
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
      "id": "direct-115-or-85-percent",
      "category": "METHOD_LIMIT",
      "conditionSummary": "The candidate calculates 115% or 85% of the given Venus volume rather than reversing the percentage.",
      "outcome": {
        "maximumMarks": 1
      },
      "notes": "One mark is available only where the 85% relationship is first evidenced; otherwise 0/3."
    }
  ],
  "commonResponses": [
    {
      "id": "inverse-multiplier",
      "category": "VALID_ALTERNATIVE",
      "responseSummary": "Uses 9.3 × 10^11 ÷ 0.85.",
      "marksAwarded": 3,
      "maximumMarks": 3
    },
    {
      "id": "treats-as-115-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats the known volume as 115% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
    },
    {
      "id": "treats-as-15-percent",
      "category": "PARTIAL_METHOD",
      "responseSummary": "Treats the known volume as 15% and reverses.",
      "marksAwarded": 2,
      "maximumMarks": 2
    }
  ],
  "sourceLayout": {
    "coreEvidenceBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 42,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 322,
        "bottomPx": 918,
        "heightPx": 596,
        "topPt": 77.28,
        "bottomPt": 220.32,
        "heightPt": 143.04,
        "heightMm": 50.46
      }
    },
    "fullQuestionBlock": {
      "measurementMethod": "PDF_RENDER",
      "sourceMeasurement": {
        "pdfPageNumber": 42,
        "renderDpi": 300,
        "pageWidthPx": 2481,
        "pageHeightPx": 3508,
        "topPx": 322,
        "bottomPx": 2552,
        "heightPx": 2230,
        "topPt": 77.28,
        "bottomPt": 612.48,
        "heightPt": 535.2,
        "heightMm": 188.81
      }
    },
    "notes": "The core block isolates the question-specific expected-answer/mark-evidence row. The full block also preserves all question-specific Notes and Commonly Observed Responses where present; it is source evidence, not a generated-answer height."
  },
  "reviewStatus": "CATALOGUED"
} satisfies SourceMarkingSchemeCatalogEntry;
