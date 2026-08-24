import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2016_P2_Q01 = {
  id:
    "N5_MATH_2016_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2016,

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
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

  surfaceStyleId:
    "CONTEXTUAL_SUGAR_CONTENT_REPEATED_PERCENTAGE_DECREASE",


  primaryTopic:
    "NUM",


  skillIds: [
    "percentages",
    "compound-percentages",
    "percentage-decrease",
  ],


  conceptIds: [
    "identify-percentage-decrease-multiplier",
    "apply-repeated-percentage-change",
    "calculate-compound-decrease",
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
    "INITIAL_VALUE_WITH_FIXED_REPEATED_PERCENTAGE_DECREASE",


  /**
   * Compound-percentage mathematical profile
   */
  compoundPercentageProfile: {
    direction:
      "DECREASE",

    rateStructure:
      "FIXED_RATE",

    stages: [
      {
        percentageValue:
          8,

        multiplier:
          0.92,

        periods:
          3,
      },
    ],

    initialValue:
      35,

    totalPeriods:
      3,

    /**
     * 35 × 0.92³
     */
    unroundedFinalValue:
      27.25408,

    requestedAnswer:
      27.25408,

    roundingMode:
      "NONE",

    roundingExplicitInPrompt:
      false,

    arithmeticComplexity:
      "MEDIUM",

    calculatorBurden:
      "CALCULATOR_NATURAL",

    initialValueFormat:
      "INTEGER",

    answerValueFormat:
      "DECIMAL",

    valueMagnitude:
      "SMALL",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that reducing a quantity by 8% each year leaves 92% of the previous year's value, corresponding to multiplier 0.92. This multiplier is applied for three years, giving 35 × 0.92^3 = 27.25408 grams. The source question gives no explicit rounding instruction.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "FOOD_MANUFACTURING",

    contextEntity:
      "sugar content of a fizzy drink",

    quantityType:
      "MEASUREMENT",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      38,

    introductionStyle:
      "MANUFACTURER_INTENTION_AND_REPEATED_REDUCTION_INTRODUCED_BEFORE_CURRENT_QUANTITY",

    relationshipStatementStyle:
      "OPENING_SENTENCE_STATES_PERCENTAGE_REDUCTION_AND_TIME_PERIOD_TOGETHER",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_MEASUREMENT_COMMAND",

    informationOrder: [
      "MANUFACTURING_CONTEXT",
      "ANNUAL_PERCENTAGE_REDUCTION",
      "NUMBER_OF_YEARS",
      "CURRENT_SUGAR_CONTENT",
      "DIRECT_CALCULATION_COMMAND",
      "FUTURE_SUGAR_CONTENT",
    ],

    contextualVocabulary: [
      "drinks manufacturer",
      "reducing",
      "sugar content",
      "fizzy drinks",
      "per year",
      "next 3 years",
      "standard can",
      "grams",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      false,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound decrease in a measurement context. Generated questions should vary the physical quantity, initial measurement, percentage decrease, number of periods and contextual domain. Suitable settings include emissions, concentration, mass, energy usage, waste, chemical content or other quantities that can realistically reduce year on year. Avoid repeatedly using sugar or drinks. Preserve the repeated-change structure so each reduction acts on the updated value rather than subtracting a fixed amount from the original.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A drinks manufacturer is reducing the sugar content of one of their fizzy drinks by 8% per year over the next 3 years. The sugar content of a standard can is currently 35 grams. Calculate the sugar content of a standard can after 3 years.",


  sourcePromptStructure: [
    "Introduce a real-world context and state the annual percentage decrease together with its duration.",
    "State the current measured quantity in a separate sentence.",
    "Ask directly for the measured quantity after the stated number of years.",
  ],


  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "TEMPORAL_COMPARISON",
    "MEASUREMENT_CONTEXT",
  ],


  promptSummary:
    "A fizzy drink contains 35 grams of sugar and its sugar content is reduced by 8% per year for three years; calculate the resulting sugar content.",


  styleNotes:
    "The question differs slightly from the earlier compound examples by introducing the percentage-change process before giving the current numerical value. The first sentence contains both the annual decrease and the complete three-year duration. The second sentence supplies the starting measurement, and the third gives a direct Calculate command.",


  privateNotes:
    "Strong fixed-rate compound-decrease evidence in a non-monetary measurement context. The mathematics is 35 × 0.92^3 = 27.25408. This source helps prevent a future generator from overfitting compound decrease to financial depreciation or population-count settings.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      6,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "The question appears at the start of Paper 2 before Q2. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;