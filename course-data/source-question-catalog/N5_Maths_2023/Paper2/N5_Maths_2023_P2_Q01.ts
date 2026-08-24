import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2023_P2_Q01 = {
  id:
    "N5_MATH_2023_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2023,

  paper:
    "P2",

  questionNumber:
    "1",

  totalMarks:
    3,


  /**
   * Mathematical family
   */
  familyId:
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

  surfaceStyleId:
    "CONTEXTUAL_ASSET_VALUE_MULTI_RATE_PERCENTAGE_DECREASE",


  primaryTopic:
    "NUM",


  skillIds: [
    "percentages",
    "compound-percentages",
    "percentage-decrease",
  ],


  conceptIds: [
    "identify-percentage-decrease-multiplier",
    "apply-multiple-percentage-rates",
    "apply-repeated-percentage-change",
    "calculate-multi-rate-compound-decrease",
  ],


  paperSuitability:
    "P2",

  calculatorStatus:
    "CALCULATOR_ALLOWED",


  standardProfile:
    "C",

  thinkingProfile:
    "OPERATIONAL",


  operationType:
    "MULTIPLY",

  operandStructure:
    "INITIAL_VALUE_WITH_SEQUENTIAL_PERCENTAGE_DECREASE_RATES",


  /**
   * Compound-percentage mathematical profile
   */
  compoundPercentageProfile: {
    direction:
      "DECREASE",

    rateStructure:
      "MULTI_RATE",

    stages: [
      {
        percentageValue:
          11,

        multiplier:
          0.89,

        periods:
          1,
      },

      {
        percentageValue:
          6,

        multiplier:
          0.94,

        periods:
          2,
      },
    ],

    initialValue:
      20000,

    totalPeriods:
      3,

    /**
     * 20000 × 0.89 × 0.94²
     */
    unroundedFinalValue:
      15728.08,

    requestedAnswer:
      15728.08,

    roundingMode:
      "NONE",

    roundingExplicitInPrompt:
      false,

    currencyDisplayDecimals:
      2,

    arithmeticComplexity:
      "HIGH",

    calculatorBurden:
      "CALCULATOR_NATURAL",

    initialValueFormat:
      "CURRENCY",

    answerValueFormat:
      "CURRENCY",

    valueMagnitude:
      "LARGE",

    yearByYearMethodNatural:
      true,

    notes:
      "This source differs from the standard fixed-rate compound family. The value decreases by 11% during the first year, giving multiplier 0.89, then decreases by 6% in each of the following two years, giving multiplier 0.94 applied twice. The complete calculation is 20000 × 0.89 × 0.94^2 = 15728.08.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "VEHICLE_DEPRECIATION",

    contextEntity:
      "caravan",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      4,

    promptWordCount:
      42,

    introductionStyle:
      "INITIAL_PURCHASE_VALUE_INTRODUCED_BEFORE_STAGED_DEPRECIATION_INFORMATION",

    relationshipStatementStyle:
      "FIRST_YEAR_PERCENTAGE_DECREASE_FOLLOWED_BY_DIFFERENT_REPEATED_RATE_FOR_LATER_YEARS",

    commandStyle:
      "DIRECT_CALCULATE_VALUE_AFTER_COMPLETE_MULTI_STAGE_PERIOD",

    informationOrder: [
      "ASSET_CONTEXT",
      "INITIAL_PURCHASE_VALUE",
      "FIRST_YEAR_PERCENTAGE_DECREASE",
      "SECOND_PERCENTAGE_DECREASE",
      "SECOND_RATE_DURATION",
      "DIRECT_CALCULATION_COMMAND",
      "FINAL_ASSET_VALUE",
    ],

    contextualVocabulary: [
      "caravan",
      "bought",
      "£20 000",
      "depreciated",
      "first year",
      "11%",
      "further 6%",
      "each year",
      "next 2 years",
      "value after 3 years",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for a higher-complexity multi-rate compound-decrease family. Generated variants should use two clearly distinguished percentage stages, with one rate applying for one or more periods and a different rate applying afterwards. Suitable contexts include vehicles, machinery, electronics, equipment or other assets whose depreciation rate changes over time. Avoid repeatedly using caravans or the exact 11%-then-6% structure. The wording must make the duration of each rate unambiguous, and the generated mathematics must preserve sequential compounding rather than combining the percentages into a single repeated rate.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A caravan was bought for £20 000. It depreciated in value by 11% in the first year. It then depreciated by a further 6% each year over the next 2 years. Calculate the value of the caravan after 3 years.",


  sourcePromptStructure: [
    "State the initial purchase value of an asset.",
    "State the percentage decrease applying during the first year.",
    "State a different annual percentage decrease applying during the following period.",
    "Ask directly for the asset value after the complete multi-stage time period.",
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
    "A caravan bought for £20,000 loses 11% of its value in the first year and then 6% per year for the next two years; calculate its value after three years.",


  styleNotes:
    "The question deliberately changes the percentage rate after the first year. The first depreciation stage is isolated in one sentence, while the second sentence introduces both a different rate and its two-year duration. The pupil must preserve the order and duration of both percentage changes rather than treating the question as one fixed-rate calculation.",


  privateNotes:
    "This is the sole multi-rate compound-percentage example in the confirmed 2014–2025 corpus and should remain separate from the ordinary fixed-rate decrease family. Its mathematical structure is 20000 × 0.89 × 0.94^2. It provides historical support for higher-difficulty generated variants involving sequential percentage rates, but should not cause ordinary fixed-rate questions to inherit unnecessary complexity.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      7,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "Q1 appears at the beginning of Paper 2. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;