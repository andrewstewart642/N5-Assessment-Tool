import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2015_P2_Q08 = {
  id: "N5_MATH_2015_P2_Q08",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2015,
  paper: "P2",
  questionNumber: "8",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_SALE_DISCOUNT_FIND_ORIGINAL",

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

  paperSuitability: "P2",
  calculatorStatus: "CALCULATOR_ALLOWED",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "FINAL_VALUE_AFTER_PERCENTAGE_DECREASE",

  percentageProfile: {
    relationshipType: "DECREASE",
    expressionStyle: "DISCOUNT",

    percentageValue: 15,
    retainedPercentage: 85,
    multiplier: 0.85,

    knownValue: 297.5,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 350,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 350,

    workingStepCount: 1,

    arithmeticComplexity: "MEDIUM",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_NATURAL",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "MEDIUM",

    notes:
      "The final sale price is known and the original price is required. A 15% discount means the sale price represents 85% of the original price, giving the inverse calculation 297.50 divided by 0.85 = 350. The decimal currency value and 0.85 divisor make calculator use natural, while the exact whole-pound result keeps the question mathematically tidy.",
  },

  wordedProblemProfile: {
    contextDomain: "RETAIL_SALE",
    contextEntity: "laptop",

    quantityType: "MONEY",

    temporalStructure: "BEFORE_AFTER",

    sentenceCount: 3,
    promptWordCount: 23,

    introductionStyle:
      "NAMED_PERSON_AND_FINAL_PURCHASE_PRICE_INTRODUCED_IN_SALE_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_STATING_DISCOUNT_PERCENTAGE",

    commandStyle:
      "DIRECT_CALCULATE_ORIGINAL_PRICE_COMMAND",

    informationOrder: [
      "NAMED_PERSON",
      "FINAL_PRICE",
      "SALE_CONTEXT",
      "DISCOUNT_PERCENTAGE",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_ORIGINAL_PRICE",
    ],

    contextualVocabulary: [
      "paid",
      "laptop",
      "sale",
      "discount",
      "original price",
    ],

    hasNamedPerson: true,
    usesPronounReference: false,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Model the concise retail-discount structure rather than this specific laptop scenario. Generated questions can use varied goods, services, purchases and sale situations, with different suitable percentages and monetary values. Vary whether the final price, discount and context are introduced together or across separate short sentences. Avoid repeatedly using 'original price' or reproducing the three source sentences verbatim. Preserve the underlying requirement that the pupil recognises the paid amount as the retained percentage and reverses the percentage change.",
  },

  sourcePromptText:
    "James paid £297.50 for a laptop in a sale. The discount in the sale was 15%. Calculate the original price of the laptop.",

  sourcePromptStructure: [
    "Introduce a named person and the final amount paid in a sale context.",
    "State the percentage discount in a separate sentence.",
    "Ask directly for the original pre-discount price.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "MONEY_CONTEXT",
  ],

  promptSummary:
    "A laptop is bought for a known sale price after a 15% discount; calculate its original price.",

  styleNotes:
    "The question uses three short sentences and provides no explicit mathematical scaffolding. The first sentence establishes the person, item, final price and sale context. The second isolates the discount percentage. The final sentence is a concise Calculate command asking for the original value. The pupil must infer independently that 85% of the original price remains after the discount.",

  privateNotes:
    "Strong evidence for a calculator-paper decrease family. Unlike a P1 example, the source uses a decimal currency amount and a divisor of 0.85, making calculator use appropriate. The generator should reproduce the level of interpretation and arithmetic demand while drawing from a broad independent pool of contexts and wording structures.",

  answerSpace: {
      category: "LARGE",
      estimatedLines: 8,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 24,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 1927,
        bottomPx: 3228,
        heightPx: 1301,
  
        topPt: 462.48,
        bottomPt: 774.72,
        heightPt: 312.24,
  
        heightMm: 110.15,
      },
  
      notes:
        "Measured from the bottom of the final Q8 instruction line to the top of the barcode/footer region on physical PDF page 24.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;