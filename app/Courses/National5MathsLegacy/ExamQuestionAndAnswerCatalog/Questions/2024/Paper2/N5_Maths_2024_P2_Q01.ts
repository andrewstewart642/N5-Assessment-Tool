import type {
  ExamQuestionCatalogEntry,
} from "../../ExamQuestionTypes";


export const N5_MATHS_2024_P2_Q01 = {
  id:
    "N5_MATH_2024_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2024,

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
    "CONTEXTUAL_ELECTRONIC_ASSET_REPEATED_PERCENTAGE_DEPRECIATION",


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
          26,

        multiplier:
          0.74,

        periods:
          3,
      },
    ],

    initialValue:
      460,

    totalPeriods:
      3,

    /**
     * 460 × 0.74³
     */
    unroundedFinalValue:
      186.40304,

    /**
     * Monetary answer expressed to two
     * decimal places.
     */
    requestedAnswer:
      186.4,

    roundingMode:
      "NONE",

    roundingExplicitInPrompt:
      false,

    currencyDisplayDecimals:
      2,

    arithmeticComplexity:
      "MEDIUM",

    calculatorBurden:
      "CALCULATOR_NATURAL",

    initialValueFormat:
      "CURRENCY",

    answerValueFormat:
      "CURRENCY",

    valueMagnitude:
      "SMALL",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that depreciation by 26% leaves 74% of the previous year's value, corresponding to multiplier 0.74. Applying this for three years gives 460 × 0.74^3 = 186.40304. In monetary form the expected value is £186.40. The source prompt does not explicitly state a rounding requirement.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "CONSUMER_ELECTRONICS",

    contextEntity:
      "laptop",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      32,

    introductionStyle:
      "NAMED_PERSON_PURCHASES_ASSET_AT_STATED_PRICE",

    relationshipStatementStyle:
      "SEPARATE_EXPECTATION_SENTENCE_STATING_ANNUAL_DEPRECIATION_RATE",

    commandStyle:
      "DIRECT_CALCULATE_EXPECTED_ASSET_VALUE_AFTER_STATED_DURATION",

    informationOrder: [
      "NAMED_PERSON",
      "ASSET_PURCHASE",
      "INITIAL_PRICE",
      "ANNUAL_PERCENTAGE_DEPRECIATION",
      "NUMBER_OF_YEARS",
      "DIRECT_CALCULATION_COMMAND",
      "EXPECTED_FUTURE_VALUE",
    ],

    contextualVocabulary: [
      "pays",
      "new laptop",
      "value",
      "expected",
      "depreciate",
      "each year",
      "after 3 years",
    ],

    hasNamedPerson:
      true,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound depreciation of a purchased asset. Generated variants should vary the asset, starting price, annual depreciation rate and number of years. Suitable contexts include laptops, phones, vehicles, machinery, equipment or other assets that naturally lose value over time. Avoid repeatedly using laptops or the same named-person wording. Preserve the requirement that depreciation acts on the updated value each year rather than subtracting the same amount from the original price.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "Dougie pays £460 for a new laptop. It is expected that the value of the laptop will depreciate by 26% each year. Calculate the expected value of Dougie’s laptop after 3 years.",


  sourcePromptStructure: [
    "Introduce a named person purchasing an asset for a stated price.",
    "State the expected annual percentage depreciation in a separate sentence.",
    "Ask directly for the expected asset value after a specified number of years.",
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
    "Dougie pays £460 for a laptop whose value is expected to depreciate by 26% each year; calculate its expected value after three years.",


  styleNotes:
    "The question uses explicit depreciation vocabulary rather than the more general 'decrease' or 'fall' language seen in other sources. The starting value and asset are introduced through a named-person purchase. The number of compound periods is stated directly as three years rather than inferred from calendar dates.",


  privateNotes:
    "Strong fixed-rate compound-decrease evidence in a conventional depreciation context. The mathematics is 460 × 0.74^3 = 186.40304, presented as £186.40. This source is also important for the answer catalogue because the 2024 marking scheme explicitly documents year-by-year repeated multiplication as a full-credit alternative method.",


  answerSpace: {
      category: "LARGE",
      estimatedLines: 6,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 17,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 773,
        bottomPx: 1834,
        heightPx: 1061,
  
        topPt: 185.52,
        bottomPt: 440.16,
        heightPt: 254.64,
  
        heightMm: 89.83,
      },
  
      notes:
        "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 17.",
    },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;