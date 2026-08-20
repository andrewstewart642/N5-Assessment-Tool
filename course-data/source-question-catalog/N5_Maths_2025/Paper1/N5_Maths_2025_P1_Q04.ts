import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2025_P1_Q04 = {
  id: "N5_MATH_2025_P1_Q04",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2025,
  paper: "P1",
  questionNumber: "4",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_SALE_REDUCTION_FIND_PRE_SALE_PRICE",

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
  operandStructure: "FINAL_VALUE_AFTER_PERCENTAGE_REDUCTION",

  percentageProfile: {
    relationshipType: "DECREASE",
    expressionStyle: "REDUCED_BY",

    percentageValue: 20,
    retainedPercentage: 80,
    multiplier: 0.8,

    knownValue: 720,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 900,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 900,

    workingStepCount: 1,

    arithmeticComplexity: "LOW",

    nonCalculatorFriendly: true,
    calculatorBurden: "WRITTEN_NON_CALCULATOR",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "MEDIUM",

    notes:
      "A 20% reduction means the sale price represents 80% of the original price. The required inverse calculation is 720 divided by 0.8 = 900. The percentage and value are deliberately selected so that the calculation can be completed cleanly without a calculator, for example by recognising that 80% is £720, finding 10% as £90, then scaling to 100%.",
  },

  wordedProblemProfile: {
    contextDomain: "RETAIL_SALE",
    contextEntity: "wedding dress",

    quantityType: "MONEY",

    temporalStructure: "BEFORE_AFTER",

    sentenceCount: 3,
    promptWordCount: 30,

    introductionStyle:
      "SALE_CONTEXT_AND_PERCENTAGE_REDUCTION_INTRODUCED_TOGETHER",

    relationshipStatementStyle:
      "OPENING_SENTENCE_STATES_ITEM_PRICE_IS_REDUCED_BY_PERCENTAGE",

    commandStyle:
      "DIRECT_CALCULATE_PRE_SALE_PRICE_COMMAND",

    informationOrder: [
      "SALE_CONTEXT",
      "ITEM",
      "PERCENTAGE_REDUCTION",
      "FINAL_SALE_PRICE",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_PRE_SALE_PRICE",
    ],

    contextualVocabulary: [
      "sale",
      "price",
      "wedding dress",
      "reduced by",
      "sale price",
      "before the sale",
    ],

    hasNamedPerson: false,
    usesPronounReference: false,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for a concise P1 reduction family where the percentage change is stated before the final value. Generated variants should vary the item, commercial or non-commercial context, percentage, monetary value and sentence construction. Alternative wording can refer to a reduction, markdown, price cut or other natural decrease where appropriate. Avoid repeatedly using dresses, sales or the exact phrase 'before the sale'. P1 values should be constructed so the retained percentage can be reversed using manageable non-calculator arithmetic and produces a clean realistic result.",
  },

  sourcePromptText:
    "In a sale, the price of a wedding dress is reduced by 20%. The sale price of the dress is £720. Calculate the price of the dress before the sale.",

  sourcePromptStructure: [
    "Introduce the context, item and percentage reduction together.",
    "State the resulting final value in a separate sentence.",
    "Ask directly for the value before the reduction.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "MONEY_CONTEXT",
  ],

  promptSummary:
    "A wedding dress is reduced by 20% to a sale price of £720; calculate its price before the sale.",

  styleNotes:
    "The question is highly concise and uses three short sentences. Unlike the 2022 discount example, no named person or purchase event is required. The opening sentence combines context and percentage change, the second supplies the final value, and the third gives a direct Calculate command. The pupil must independently convert a 20% reduction into a retained percentage of 80%.",

  privateNotes:
    "Strong recent evidence for a Paper 1 decrease family. Compare with 2022 P1, where a 30% discount leaves £16.10, and 2015 P2, where a 15% discount leaves £297.50. These demonstrate that the underlying family can appear on either paper, with numerical construction controlling calculator suitability. Generated questions should vary context and language substantially while preserving the appropriate paper-specific arithmetic burden.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 8,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 1910,
      bottomPx: 3228,
      heightPx: 1318,

      topPt: 458.4,
      bottomPt: 774.72,
      heightPt: 316.32,

      heightMm: 111.59,
    },

    notes:
      "Measured from the bottom of the final Q4 instruction line to the top of the barcode/footer region on the original PDF page. As Q4 is the final question on the page, some of this space reflects page layout rather than the minimum working space required.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;