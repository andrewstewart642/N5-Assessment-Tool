import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2025_P2_Q01 = {
  id:
    "N5_MATH_2025_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2025,

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
    "CONTEXTUAL_VISITOR_COUNT_REPEATED_PERCENTAGE_INCREASE",


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
      118750,

    totalPeriods:
      2,

    /**
     * 118750 × 1.04²
     */
    unroundedFinalValue:
      128440,

    requestedAnswer:
      128440,

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
      "The pupil must recognise that a 4% annual increase corresponds to multiplier 1.04. The question explicitly states that the increase applies over the next two years, giving 118750 × 1.04^2 = 128440 visitors.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "VISITOR_NUMBERS",

    contextEntity:
      "zoo visitors",

    quantityType:
      "COUNT",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      3,

    promptWordCount:
      34,

    introductionStyle:
      "HISTORICAL_VISITOR_COUNT_INTRODUCED_WITH_REFERENCE_YEAR",

    relationshipStatementStyle:
      "SEPARATE_EXPECTATION_SENTENCE_STATING_ANNUAL_PERCENTAGE_INCREASE_AND_DURATION",

    commandStyle:
      "DIRECT_CALCULATE_EXPECTED_COUNT_USING_TARGET_YEAR",

    informationOrder: [
      "VISITOR_CONTEXT",
      "INITIAL_VISITOR_COUNT",
      "INITIAL_YEAR",
      "ANNUAL_PERCENTAGE_INCREASE",
      "NUMBER_OF_YEARS",
      "TARGET_YEAR",
      "DIRECT_CALCULATION_COMMAND",
      "EXPECTED_FUTURE_VISITOR_COUNT",
    ],

    contextualVocabulary: [
      "visitors",
      "zoo",
      "2024",
      "expected",
      "increase",
      "each year",
      "next two years",
      "2026",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      false,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound increase in a count-based visitor or attendance context. Generated variants should vary the venue or organisation, starting count, annual percentage increase, number of years and calendar dates. Suitable contexts include visitor numbers, attendance, memberships, passenger numbers, customer totals or other counts that can grow year on year. Avoid repeatedly using zoos. The duration and target year may both be supplied, provided they are internally consistent.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "The number of visitors to a zoo in 2024 was 118 750. The number of visitors is expected to increase by 4% each year over the next two years. Calculate the expected number of visitors in 2026.",


  sourcePromptStructure: [
    "State an initial count together with its reference year and real-world context.",
    "State an expected annual percentage increase together with the duration.",
    "Ask directly for the expected count in the corresponding target year.",
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
    "A zoo had 118,750 visitors in 2024 and expects visitor numbers to increase by 4% each year for two years; calculate the expected number in 2026.",


  styleNotes:
    "The question supplies both forms of temporal information: it explicitly states 'over the next two years' and also gives the target year 2026. Unlike the 2018, 2019, 2021 and 2022 examples, the pupil does not need to infer the number of periods solely from the calendar years. The underlying calculation remains a standard fixed-rate compound increase.",


  privateNotes:
    "Strong recent evidence for the fixed-rate compound-increase family. The mathematics is 118750 × 1.04^2 = 128440. The exact integer result requires no rounding. This source adds a count-based visitor context and shows that SQA may provide both the duration and target year within the same compound percentage question.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      6,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "Q1 appears at the start of Paper 2. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;