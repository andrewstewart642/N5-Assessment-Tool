import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2021_P2_Q01 = {
  id:
    "N5_MATH_2021_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2021,

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
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

  surfaceStyleId:
    "CONTEXTUAL_HOUSE_PRICE_REPEATED_PERCENTAGE_INCREASE",


  primaryTopic:
    "NUM",


  skillIds: [
    "percentages",
    "compound-percentages",
    "percentage-increase",
  ],


  conceptIds: [
    "identify-percentage-increase-multiplier",
    "apply-repeated-percentage-change",
    "calculate-compound-increase",
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
    "INITIAL_VALUE_WITH_FIXED_REPEATED_PERCENTAGE_INCREASE",


  /**
   * Compound-percentage mathematical profile
   */
  compoundPercentageProfile: {
    direction:
      "INCREASE",

    rateStructure:
      "FIXED_RATE",

    stages: [
      {
        percentageValue:
          4,

        multiplier:
          1.04,

        periods:
          2,
      },
    ],

    initialValue:
      250000,

    totalPeriods:
      2,

    /**
     * 250000 × 1.04²
     */
    unroundedFinalValue:
      270400,

    requestedAnswer:
      270400,

    roundingMode:
      "NONE",

    roundingExplicitInPrompt:
      false,

    currencyDisplayDecimals:
      0,

    arithmeticComplexity:
      "MEDIUM",

    calculatorBurden:
      "CALCULATOR_NATURAL",

    initialValueFormat:
      "CURRENCY",

    answerValueFormat:
      "CURRENCY",

    valueMagnitude:
      "VERY_LARGE",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that a 4% annual increase corresponds to multiplier 1.04. The interval from 2020 to 2022 represents two repeated increases, giving 250000 × 1.04^2 = 270400.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "PROPERTY_DEVELOPMENT",

    contextEntity:
      "house price",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      4,

    promptWordCount:
      31,

    introductionStyle:
      "HOUSING_DEVELOPMENT_CONTEXT_INTRODUCED_BEFORE_INITIAL_PRICE",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_STATING_EXPECTED_ANNUAL_PERCENTAGE_INCREASE",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_PRICE_USING_TARGET_YEAR",

    informationOrder: [
      "HOUSING_DEVELOPMENT_CONTEXT",
      "INITIAL_HOUSE_PRICE",
      "INITIAL_YEAR",
      "ANNUAL_PERCENTAGE_INCREASE",
      "TARGET_YEAR",
      "DIRECT_CALCULATION_COMMAND",
      "EXPECTED_FUTURE_PRICE",
    ],

    contextualVocabulary: [
      "housing development",
      "house",
      "price",
      "built in 2020",
      "expected",
      "increase",
      "each year",
      "built in 2022",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound appreciation where the duration is inferred from a starting year and target year. Generated questions should vary the property or asset context, starting value, percentage increase and dates. Suitable contexts include housing, land, commercial property, investments or other values that can increase annually. Avoid repeatedly using housing developments. Preserve the need to determine the correct number of compound periods from the stated years.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A housing development is being built. The price of a house built in 2020 is £250 000. This price is expected to increase by 4% each year. Calculate the expected price of a house built in 2022.",


  sourcePromptStructure: [
    "Introduce a real-world property context.",
    "State the initial monetary value together with the starting year.",
    "State the expected annual percentage increase in a separate sentence.",
    "Ask directly for the corresponding value in a later specified year.",
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
    "A house costs £250,000 in 2020 and its price is expected to increase by 4% each year; calculate the expected price in 2022.",


  styleNotes:
    "The question begins with a short contextual sentence before giving the initial price. The annual percentage increase is then stated independently, and the final command uses a target year rather than explicitly saying 'after 2 years'. The pupil must infer two annual compound changes from 2020 to 2022.",


  privateNotes:
    "Strong fixed-rate compound-increase evidence. The mathematics is 250000 × 1.04^2 = 270400. This reinforces the recurring SQA use of calendar-year inference for compound percentage questions and provides another monetary appreciation context without any explicit rounding requirement.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      6,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "Q1 appears at the top of Paper 2 page 3 before Q2. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;