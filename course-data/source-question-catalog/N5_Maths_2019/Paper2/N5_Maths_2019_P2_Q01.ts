import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2019_P2_Q01 = {
  id:
    "N5_MATH_2019_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2019,

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
    "CONTEXTUAL_CHARITY_DISTRIBUTION_REPEATED_PERCENTAGE_INCREASE",


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
          15,

        multiplier:
          1.15,

        periods:
          3,
      },
    ],

    initialValue:
      80000,

    totalPeriods:
      3,

    /**
     * 80000 × 1.15³
     */
    unroundedFinalValue:
      121670,

    requestedAnswer:
      121670,

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
      "The pupil must recognise that a 15% annual increase corresponds to multiplier 1.15. The interval from 2018 to 2021 represents three repeated increases, giving 80000 × 1.15^3 = 121670 emergency packages.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "CHARITY_AID_DISTRIBUTION",

    contextEntity:
      "emergency packages",

    quantityType:
      "COUNT",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      32,

    introductionStyle:
      "HISTORICAL_COUNT_INTRODUCED_WITH_ORGANISATION_AND_YEAR",

    relationshipStatementStyle:
      "SEPARATE_EXPECTATION_SENTENCE_STATING_ANNUAL_PERCENTAGE_INCREASE",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_COUNT_USING_TARGET_YEAR",

    informationOrder: [
      "CHARITY_CONTEXT",
      "INITIAL_PACKAGE_COUNT",
      "INITIAL_YEAR",
      "ANNUAL_PERCENTAGE_INCREASE",
      "TARGET_YEAR",
      "DIRECT_CALCULATION_COMMAND",
      "FUTURE_PACKAGE_COUNT",
    ],

    contextualVocabulary: [
      "charity",
      "distributed",
      "emergency packages",
      "2018",
      "expected",
      "increase",
      "each year",
      "2021",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for a fixed-rate compound increase where the number of periods is inferred from a starting year and target year. Generated questions should vary the organisation, count-based context, initial value, percentage increase and dates. Suitable settings include charity distributions, visitors, production totals, memberships, sales volumes or other counts that can grow year on year. Preserve the need to infer the correct number of compound periods from the stated years.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A charity distributed 80 000 emergency packages during 2018. This number is expected to increase by 15% each year. Calculate how many emergency packages the charity expects to distribute in 2021.",


  sourcePromptStructure: [
    "State an initial count together with its starting year and organisational context.",
    "State an expected annual percentage increase in a separate sentence.",
    "Ask directly for the corresponding count in a later specified year.",
  ],


  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "TEMPORAL_COMPARISON",
    "COUNT_CONTEXT",
  ],


  promptSummary:
    "A charity distributes 80,000 emergency packages in 2018 and expects the number to increase by 15% each year; calculate the number expected in 2021.",


  styleNotes:
    "The question closely mirrors the year-based compound structure seen in 2018, but with an increase rather than a decrease and a count rather than a measurement. The pupil must infer three annual changes from 2018 to 2021. No multiplier or power is supplied.",


  privateNotes:
    "Strong fixed-rate compound-increase evidence. The mathematics is 80000 × 1.15^3 = 121670. This source is useful because it pairs naturally with 2018: both use calendar-year inference, but one decreases and the other increases, reinforcing that the temporal structure is independent of the direction of percentage change.",


  answerSpace: {
      category: "MEDIUM",
      estimatedLines: 6,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 23,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 816,
        bottomPx: 1768,
        heightPx: 952,
  
        topPt: 195.84,
        bottomPt: 424.32,
        heightPt: 228.48,
  
        heightMm: 80.6,
      },
  
      notes:
        "Measured from the bottom of the final Q1 instruction line to the top of the Q2 question block on physical PDF page 23.",
    },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;