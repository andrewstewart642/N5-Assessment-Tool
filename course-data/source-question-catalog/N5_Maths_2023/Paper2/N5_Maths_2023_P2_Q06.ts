import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2023_P2_Q06 = {
  id: "N5_MATH_2023_P2_Q06",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2023,
  paper: "P2",
  questionNumber: "6",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_APPRECIATED_VALUE_FIND_PURCHASE_PRICE",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "percentage-increase",
  ],

  conceptIds: [
    "identify-percentage-after-increase",
    "reverse-percentage-final-to-original",
    "calculate-previous-value",
  ],

  paperSuitability: "P2",
  calculatorStatus: "CALCULATOR_ALLOWED",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "CURRENT_VALUE_AFTER_PERCENTAGE_INCREASE_FROM_PURCHASE_VALUE",

  percentageProfile: {
    relationshipType: "INCREASE",
    expressionStyle: "INCREASED_BY",

    percentageValue: 8,
    retainedPercentage: 108,
    multiplier: 1.08,

    knownValue: 94500,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 87500,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 87500,

    workingStepCount: 1,

    arithmeticComplexity: "MEDIUM",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_NATURAL",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "LARGE",

    notes:
      "The current property value is known after an 8% increase, so £94,500 represents 108% of the purchase price. The inverse calculation is 94500 divided by 1.08 = 87500. The result is exact and realistic, while division by 1.08 makes calculator use natural for Paper 2.",
  },

  wordedProblemProfile: {
    contextDomain: "PROPERTY_VALUE",
    contextEntity: "flat",

    quantityType: "MONEY",

    temporalStructure: "CURRENT_PREVIOUS",

    sentenceCount: 3,
    promptWordCount: 29,

    introductionStyle:
      "NAMED_PERSON_AND_PREVIOUS_PURCHASE_EVENT_INTRODUCED_BEFORE_CURRENT_VALUE",

    relationshipStatementStyle:
      "PERCENTAGE_INCREASE_AND_CURRENT_VALUE_COMBINED_IN_ONE_SENTENCE",

    commandStyle:
      "DIRECT_CALCULATE_PREVIOUS_PURCHASE_AMOUNT_COMMAND",

    informationOrder: [
      "NAMED_PERSON",
      "PREVIOUS_PURCHASE_EVENT",
      "PERCENTAGE_INCREASE",
      "CURRENT_VALUE",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_PURCHASE_PRICE",
    ],

    contextualVocabulary: [
      "bought",
      "flat",
      "last year",
      "value",
      "increased",
      "now worth",
      "paid",
    ],

    hasNamedPerson: true,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "This provides evidence for appreciation-style reverse-percentage contexts where an asset was acquired previously and its current value is known after a percentage increase. Generated questions should vary the type of asset, time relationship, percentage, monetary scale and sentence construction. Possible independent contexts include equipment, collectibles, property, vehicles or other realistically appreciating assets. Avoid repeatedly using flats, the phrase 'now worth', or an 8% increase. Preserve the need to infer that the current amount represents more than 100% of the earlier amount.",
  },

  sourcePromptText:
    "Nadim bought a flat last year. The value of the flat has increased by 8% and it is now worth £94,500. Calculate how much Nadim paid for the flat.",

  sourcePromptStructure: [
    "Introduce a named person and an earlier purchase.",
    "State the percentage increase and current value together.",
    "Ask directly for the amount originally paid.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "TEMPORAL_COMPARISON",
    "MONEY_CONTEXT",
  ],

  promptSummary:
    "A flat has increased in value by 8% and is now worth £94,500; calculate the amount originally paid.",

  styleNotes:
    "The source first establishes a simple past event before giving any numerical information. The percentage increase and current value are then combined naturally in a single sentence. The final command asks how much the person 'paid' rather than using mathematical language such as original value. This hides the reverse-percentage structure inside an authentic temporal context.",

  privateNotes:
    "Useful P2 evidence for an appreciation-style increase question. Compare with 2017, where the relationship is expressed as '15% more than', and 2024, where it is described as 'an increase of 16% on last year's cost'. The generator should exploit these structural wording differences rather than relying on one fixed increase template.",

  answerSpace: {
      category: "LARGE",
      estimatedLines: 7,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 21,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 521,
        bottomPx: 1690,
        heightPx: 1169,
  
        topPt: 125.04,
        bottomPt: 405.6,
        heightPt: 280.56,
  
        heightMm: 98.98,
      },
  
      notes:
        "Measured from the bottom of the final Q6 instruction line to the top of the Q7 prompt block on physical PDF page 21.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;