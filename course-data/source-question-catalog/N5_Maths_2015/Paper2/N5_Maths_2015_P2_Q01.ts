import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2015_P2_Q01 = {
  id:
    "N5_MATH_2015_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2015,

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
    "CONTEXTUAL_PROPERTY_VALUE_REPEATED_PERCENTAGE_INCREASE",


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
          2.8,

        multiplier:
          1.028,

        periods:
          2,
      },
    ],

    initialValue:
      240000,

    totalPeriods:
      2,

    /**
     * 240000 × 1.028²
     */
    unroundedFinalValue:
      253628.16,

    requestedAnswer:
      253628.16,

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
      "VERY_LARGE",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that a 2.8% annual increase corresponds to multiplier 1.028 and apply this multiplier for two years. The resulting predicted value is £253628.16. No explicit rounding instruction is given in the question.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "PROPERTY_VALUE",

    contextEntity:
      "house",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      24,

    introductionStyle:
      "CURRENT_MONETARY_VALUE_INTRODUCED_IN_PROPERTY_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_PREDICTION_SENTENCE_STATING_ANNUAL_PERCENTAGE_INCREASE",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_VALUE_COMMAND",

    informationOrder: [
      "CURRENT_PROPERTY_VALUE",
      "ANNUAL_PERCENTAGE_INCREASE",
      "NUMBER_OF_YEARS",
      "DIRECT_CALCULATION_COMMAND",
      "PREDICTED_FUTURE_VALUE",
    ],

    contextualVocabulary: [
      "house",
      "valued at",
      "value",
      "predicted",
      "rise",
      "per annum",
      "predicted value",
      "years",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound appreciation in a monetary-value context. Generated questions should vary the asset, initial value, annual percentage increase, number of years and wording. Suitable contexts include property, investments, collectibles, business assets or other values that naturally appreciate over time. Avoid repeatedly using houses or the phrase 'predicted to rise'. Preserve the requirement that each year's increase applies to the updated value rather than to the original value only.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A house is valued at £240 000. Its value is predicted to rise by 2·8% per annum. Calculate its predicted value after 2 years.",


  sourcePromptStructure: [
    "State the current monetary value of an asset.",
    "State an annual percentage increase in a separate sentence.",
    "Ask directly for the predicted value after a specified number of years.",
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
    "A house valued at £240,000 is predicted to increase in value by 2.8% per annum for two years; calculate its predicted future value.",


  styleNotes:
    "The question uses three concise sentences. The initial property value is given first, the annual percentage increase is isolated in the second sentence, and the final sentence asks directly for the predicted value after two years. No multiplier or compound formula is supplied, so the pupil must independently identify the repeated percentage-change structure.",


  privateNotes:
    "Early direct evidence for the fixed-rate compound-increase family. The mathematics is 240000 × 1.028^2 = 253628.16. Unlike the 2014 decrease example, there is no explicit rounding instruction and the context is monetary appreciation rather than a changing population.",


  /**
   * Exact source response-space measurement.
   *
   * Standard:
   *
   * - source PDF rendered at 300 dpi;
   * - A4 render = 2481 × 3508 px;
   * - top-left coordinate origin;
   * - physical PDF page 19;
   * - printed examination page 3.
   *
   * Measurement runs from the bottom of Q1's
   * final instruction line to the top of the Q2
   * question block.
   *
   * This is a genuinely large source response
   * area. It is slightly taller than the exact
   * 1306 px response area catalogued for 2015
   * P2 Q8 reverse percentage.
   */
  answerSpace: {
    category:
      "LARGE",

    estimatedLines:
      9,

    measurementMethod:
      "PDF_RENDER",

    sourceMeasurement: {
      pdfPageNumber:
        19,

      renderDpi:
        300,

      pageWidthPx:
        2481,

      pageHeightPx:
        3508,

      topPx:
        498,

      bottomPx:
        1914,

      heightPx:
        1416,

      topPt:
        119.52,

      bottomPt:
        459.36,

      heightPt:
        339.84,

      heightMm:
        119.89,
    },

    notes:
      "Measured from the bottom of the final Q1 instruction line ('Calculate its predicted value after 2 years.') to the top of the Q2 question block on physical PDF page 19. The previous MEDIUM / 6-line estimate has been replaced by the exact 300-dpi source measurement.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;