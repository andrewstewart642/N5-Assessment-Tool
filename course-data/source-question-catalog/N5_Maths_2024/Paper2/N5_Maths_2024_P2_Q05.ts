import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2024_P2_Q05 = {
  id: "N5_MATH_2024_P2_Q05",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2024,
  paper: "P2",
  questionNumber: "5",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_CURRENT_COST_INCREASE_ON_PREVIOUS_COST",

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
  operandStructure: "CURRENT_COST_AFTER_PERCENTAGE_INCREASE_ON_PREVIOUS_COST",

  percentageProfile: {
    relationshipType: "INCREASE",
    expressionStyle: "INCREASED_BY",

    percentageValue: 16,
    retainedPercentage: 116,
    multiplier: 1.16,

    knownValue: 278.4,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 240,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 240,

    workingStepCount: 1,

    arithmeticComplexity: "MEDIUM",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_NATURAL",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "MEDIUM",

    notes:
      "The current insurance cost is £278.40 after a 16% increase, so it represents 116% of the previous year's cost. The inverse calculation is 278.40 divided by 1.16 = 240. The decimal currency amount and 1.16 divisor make calculator use natural while retaining an exact, realistic whole-pound answer.",
  },

  wordedProblemProfile: {
    contextDomain: "INSURANCE_COST",
    contextEntity: "car insurance",

    quantityType: "MONEY",

    temporalStructure: "YEAR_ON_YEAR",

    sentenceCount: 3,
    promptWordCount: 28,

    introductionStyle:
      "CURRENT_MONETARY_VALUE_INTRODUCED_IMMEDIATELY_WITH_NAMED_PERSON_AND_TIME_REFERENCE",

    relationshipStatementStyle:
      "SEPARATE_THIS_IS_AN_INCREASE_OF_PERCENT_ON_PREVIOUS_YEAR_SENTENCE",

    commandStyle:
      "DIRECT_CALCULATE_PREVIOUS_YEAR_COST_COMMAND",

    informationOrder: [
      "CURRENT_TIME_REFERENCE",
      "NAMED_PERSON",
      "CURRENT_COST",
      "PERCENTAGE_INCREASE",
      "PREVIOUS_YEAR_REFERENCE",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_PREVIOUS_COST",
    ],

    contextualVocabulary: [
      "this year",
      "cost",
      "car insurance",
      "increase",
      "last year's cost",
      "insurance last year",
    ],

    hasNamedPerson: true,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for recurring-cost contexts where a present-day amount is compared with an earlier amount after a percentage increase. Generated variants can involve insurance, subscriptions, fees, bills, memberships, travel costs or other realistic recurring expenses. Vary the percentage, current amount, time wording and sentence construction. Do not repeatedly use car insurance or the exact phrase 'This is an increase of ... on last year's cost'. Preserve the underlying temporal comparison and calculator-appropriate inverse calculation.",
  },

  sourcePromptText:
    "This year the cost of Charley’s car insurance is £278.40. This is an increase of 16% on last year’s cost. Calculate the cost of Charley’s insurance last year.",

  sourcePromptStructure: [
    "State the current monetary value in a named-person context.",
    "State in a separate sentence that the current value is a given percentage increase on the previous value.",
    "Ask directly for the previous value.",
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
    "A current car-insurance cost is 16% greater than the previous year's cost; calculate the previous cost.",

  styleNotes:
    "The question establishes the current value immediately in the opening sentence. A second sentence beginning with 'This is' states the percentage relationship explicitly but does not translate it into 116%. The final sentence repeats the named context and asks directly for the previous year's cost. The language is compact and realistic, with no unnecessary mathematical guidance.",

  privateNotes:
    "Useful comparison with the 2017 and 2023 increase examples. All use the same inverse-percentage mathematics but express the relationship differently: '15% more than', 'has increased by 8%', and 'an increase of 16% on'. The generator should treat these as evidence for multiple independent linguistic constructions rather than a single fixed template.",

  answerSpace: {
    category: "MEDIUM",
    estimatedLines: 5,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 1764,
      bottomPx: 2530,
      heightPx: 766,

      topPt: 423.36,
      bottomPt: 607.2,
      heightPt: 183.84,

      heightMm: 64.85,
    },

    notes:
      "Measured from the bottom of the final Q5 instruction line to the '[Turn over]' marker on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;