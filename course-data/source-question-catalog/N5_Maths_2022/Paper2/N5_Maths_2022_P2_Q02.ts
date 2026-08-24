import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2022_P2_Q02 = {
  id:
    "N5_MATH_2022_P2_Q02",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2022,

  paper:
    "P2",

  questionNumber:
    "2",

  totalMarks:
    3,


  /**
   * Mathematical family
   */
  familyId:
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

  surfaceStyleId:
    "CONTEXTUAL_BUSINESS_PROFIT_REPEATED_PERCENTAGE_INCREASE",


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
    "round-final-value",
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
          3,

        multiplier:
          1.03,

        periods:
          4,
      },
    ],

    initialValue:
      215000,

    totalPeriods:
      4,

    /**
     * 215000 × 1.03⁴
     */
    unroundedFinalValue:
      241984.39415,

    /**
     * Source explicitly requires nearest
     * thousand pounds.
     */
    requestedAnswer:
      242000,

    roundingMode:
      "NEAREST_THOUSAND",

    roundingExplicitInPrompt:
      true,

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
      "The pupil must recognise that a 3% annual increase corresponds to multiplier 1.03. Moving from the end of 2021 to the end of 2025 gives four compound periods, so the calculation is 215000 × 1.03^4 = 241984.39415. This is rounded to the nearest thousand pounds to give £242000.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "BUSINESS_PROFIT",

    contextEntity:
      "company annual profit",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      4,

    promptWordCount:
      38,

    introductionStyle:
      "CURRENT_ANNUAL_PROFIT_INTRODUCED_WITH_REFERENCE_YEAR",

    relationshipStatementStyle:
      "SEPARATE_EXPECTATION_SENTENCE_STATING_ANNUAL_PERCENTAGE_INCREASE",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_PROFIT_COMMAND_WITH_SEPARATE_ROUNDING_INSTRUCTION",

    informationOrder: [
      "COMPANY_CONTEXT",
      "INITIAL_ANNUAL_PROFIT",
      "INITIAL_YEAR",
      "ANNUAL_PERCENTAGE_INCREASE",
      "TARGET_YEAR",
      "DIRECT_CALCULATION_COMMAND",
      "EXPECTED_FUTURE_PROFIT",
      "ROUNDING_INSTRUCTION",
    ],

    contextualVocabulary: [
      "company",
      "annual profit",
      "end of 2021",
      "expected",
      "increase",
      "each year",
      "end of 2025",
      "nearest thousand pounds",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound increase in a business or financial context where the number of periods must be inferred from two years. Generated variants should vary the business quantity, starting value, percentage increase, starting and target years, and rounding requirement. Suitable contexts include annual profit, revenue, turnover, investment value, sales or other monetary quantities that can increase year on year. Preserve the distinction between the number of calendar labels shown and the actual number of compound intervals.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A company's annual profit at the end of 2021 was £215 000. The annual profit is expected to increase by 3% each year. Calculate the expected annual profit at the end of 2025. Give your answer to the nearest thousand pounds.",


  sourcePromptStructure: [
    "State an initial monetary quantity together with its reference year.",
    "State an expected annual percentage increase in a separate sentence.",
    "Ask directly for the corresponding value at a later year.",
    "Give a separate final-answer rounding instruction.",
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
    "A company has an annual profit of £215,000 at the end of 2021 and expects it to increase by 3% each year; calculate the profit at the end of 2025 to the nearest thousand pounds.",


  styleNotes:
    "The source combines calendar-year inference with an explicit final rounding requirement. The pupil must recognise that the interval from the end of 2021 to the end of 2025 contains four annual percentage increases. No multiplier or power is provided, and the nearest-thousand instruction forms a distinct final presentation step.",


  privateNotes:
    "Strong fixed-rate compound-increase evidence with a four-period structure and explicit coarse rounding. The mathematics is 215000 × 1.03^4 = 241984.39415, rounded to £242000. This source is especially useful for distinguishing correct period counting and final-answer accuracy from the underlying multiplier calculation.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      6,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "Q2 appears early in Paper 2. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;