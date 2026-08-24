import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2018_P2_Q01 = {
  id:
    "N5_MATH_2018_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2018,

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
    "CONTEXTUAL_WASTE_TOTAL_REPEATED_PERCENTAGE_DECREASE",


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
          2,

        multiplier:
          0.98,

        periods:
          3,
      },
    ],

    initialValue:
      125000,

    totalPeriods:
      3,

    /**
     * 125000 × 0.98³
     */
    unroundedFinalValue:
      117649,

    requestedAnswer:
      117649,

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
      "INTEGER",

    valueMagnitude:
      "VERY_LARGE",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that a 2% annual decrease leaves 98% of the previous year's amount, corresponding to multiplier 0.98. The interval from 2017 to 2020 represents three repeated percentage changes, giving 125000 × 0.98^3 = 117649 tonnes.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "HOUSEHOLD_WASTE",

    contextEntity:
      "city household waste production",

    quantityType:
      "MEASUREMENT",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      43,

    introductionStyle:
      "HISTORICAL_TOTAL_INTRODUCED_WITH_LOCATION_AND_YEAR",

    relationshipStatementStyle:
      "SEPARATE_EXPECTATION_SENTENCE_STATING_ANNUAL_PERCENTAGE_DECREASE",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_TOTAL_USING_TARGET_YEAR",

    informationOrder: [
      "HOUSEHOLD_CONTEXT",
      "INITIAL_WASTE_TOTAL",
      "INITIAL_YEAR",
      "ANNUAL_PERCENTAGE_DECREASE",
      "TARGET_YEAR",
      "DIRECT_CALCULATION_COMMAND",
      "FUTURE_WASTE_TOTAL",
    ],

    contextualVocabulary: [
      "households",
      "city",
      "tonnes",
      "waste",
      "2017",
      "expected",
      "fall",
      "each year",
      "2020",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound decrease where the duration must be inferred from two stated years rather than being supplied directly as 'for 3 years'. Generated questions should vary the initial and target years, quantity, percentage decrease and real-world setting. Suitable contexts include waste, emissions, resource use, populations, production quantities or other year-on-year declining measures. Preserve the need to determine the correct number of compound periods from the dates.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "Households in a city produced a total of 125 000 tonnes of waste in 2017. The total amount of waste is expected to fall by 2% each year. Calculate the total amount of waste these households are expected to produce in 2020.",


  sourcePromptStructure: [
    "State an initial real-world quantity together with its starting year.",
    "State an expected annual percentage decrease in a separate sentence.",
    "Ask directly for the corresponding quantity in a later specified year.",
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
    "Households produce 125,000 tonnes of waste in 2017 and the total is expected to fall by 2% each year; calculate the amount expected in 2020.",


  styleNotes:
    "The question uses calendar years rather than explicitly stating the number of periods. The pupil must infer that moving from 2017 to 2020 requires three annual percentage decreases. The initial quantity is supplied in the first sentence, the annual trend in the second, and the target year in the final calculation command.",


  privateNotes:
    "Strong fixed-rate compound-decrease evidence. The mathematics is 125000 × 0.98^3 = 117649. This source is particularly useful for generator design because the number of periods is implicit in a pair of calendar years rather than directly stated, providing a genuine surface-style variation without changing the underlying mathematical family.",


  answerSpace: {
      category: "FULL_PAGE",
      estimatedLines: 15,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 23,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 816,
        bottomPx: 3228,
        heightPx: 2412,
  
        topPt: 195.84,
        bottomPt: 774.72,
        heightPt: 578.88,
  
        heightMm: 204.22,
      },
  
      notes:
        "Measured from the bottom of the final Q1 instruction line to the top of the barcode/footer region on physical PDF page 23. Q1 is the only question on the page, so this is a page-layout outlier rather than a minimum working-space requirement.",
    },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;