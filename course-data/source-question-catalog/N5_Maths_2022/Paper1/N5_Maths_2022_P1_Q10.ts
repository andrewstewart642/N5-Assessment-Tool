import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2022_P1_Q10 = {
  id: "N5_MATH_2022_P1_Q10",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2022,
  paper: "P1",
  questionNumber: "10",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_DISCOUNT_AMOUNT_PAID_FIND_FULL_PRICE",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "percentage-decrease",
  ],

  conceptIds: [
    "identify-percentage-retained-after-decrease",
    "reverse-percentage-final-to-original",
    "calculate-original-value",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "FINAL_VALUE_AFTER_PERCENTAGE_DISCOUNT",

  percentageProfile: {
    relationshipType: "DECREASE",
    expressionStyle: "DISCOUNT",

    percentageValue: 30,
    retainedPercentage: 70,
    multiplier: 0.7,

    knownValue: 16.1,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 23,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 23,

    workingStepCount: 1,

    arithmeticComplexity: "LOW",

    nonCalculatorFriendly: true,
    calculatorBurden: "WRITTEN_NON_CALCULATOR",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "SMALL",

    notes:
      "A 30% discount means the amount paid represents 70% of the original cost. The inverse relationship gives £16.10 divided by 0.70 = £23. The values are specifically friendly to non-calculator percentage methods: 70% = £16.10 implies 10% = £2.30 and therefore 100% = £23.",
  },

  wordedProblemProfile: {
    contextDomain: "ONLINE_RETAIL",
    contextEntity: "flower seeds",

    quantityType: "MONEY",

    temporalStructure: "BEFORE_AFTER",

    sentenceCount: 4,
    promptWordCount: 29,

    introductionStyle:
      "NAMED_PERSON_AND_PURCHASE_CONTEXT_ESTABLISHED_BEFORE_PERCENTAGE_INFORMATION",

    relationshipStatementStyle:
      "DISCOUNT_STATED_FIRST_THEN_AMOUNT_PAID_STATED_AS_SEPARATE_SENTENCE",

    commandStyle:
      "DIRECT_CALCULATE_COST_WITHOUT_DISCOUNT_COMMAND",

    informationOrder: [
      "NAMED_PERSON",
      "PURCHASE_CONTEXT",
      "DISCOUNT_PERCENTAGE",
      "FINAL_AMOUNT_PAID",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_FULL_PRICE",
    ],

    contextualVocabulary: [
      "buys",
      "website",
      "discount",
      "pays",
      "cost",
      "without the discount",
    ],

    hasNamedPerson: true,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for a compact non-calculator retail-discount family. Generated questions should vary the purchase, setting, percentage, price and sentence construction. The source phrase 'without the discount' demonstrates that SQA does not always use 'original price'. Suitable independent variants could ask for the normal cost, full price, price before a reduction or amount before a discount. Values for P1 variants should support clean unit-percentage or simple fractional reasoning without a calculator.",
  },

  sourcePromptText:
    "Tommy buys flower seeds from a website. Tommy is given a 30% discount. He pays £16.10 for the seeds. Calculate the cost of the flower seeds without the discount.",

  sourcePromptStructure: [
    "Introduce a named person making a purchase.",
    "State the percentage discount.",
    "State the final amount paid after the discount.",
    "Ask directly for the price before the discount using natural contextual language.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "MONEY_CONTEXT",
  ],

  promptSummary:
    "A purchase costs £16.10 after a 30% discount; calculate its cost without the discount.",

  styleNotes:
    "The question uses four short sentences. Context is established before any numerical information is supplied. The discount and final payment are then stated separately, leaving the pupil to infer that the amount paid represents 70% of the original price. The final command avoids the technical phrase 'original price' and instead asks for the cost 'without the discount'.",

  privateNotes:
    "Strong P1 counterpart to the 2015 calculator-paper discount example. Both assess the same reverse-percentage structure, but this source uses a percentage and monetary value deliberately engineered for straightforward non-calculator working. Generator paper selection should therefore affect numerical construction, not simply question metadata.",

  answerSpace: {
      category: "LARGE",
      estimatedLines: 8,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 9,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 521,
        bottomPx: 1805,
        heightPx: 1284,
  
        topPt: 125.04,
        bottomPt: 433.2,
        heightPt: 308.16,
  
        heightMm: 108.71,
      },
  
      notes:
        "Measured from the bottom of the final Q10 instruction line to the top of the Q11 prompt block on physical PDF page 9.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;