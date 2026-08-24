import type {
  SourceQuestionCatalogEntry,
} from "../../SourceQuestionTypes";


export const N5_MATHS_2017_P2_Q02 = {
  id:
    "N5_MATH_2017_P2_Q02",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2017,

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
    "CONTEXTUAL_ASSET_VALUE_REPEATED_PERCENTAGE_INCREASE",


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
          4.5,

        multiplier:
          1.045,

        periods:
          3,
      },
    ],

    initialValue:
      1200,

    totalPeriods:
      3,

    /**
     * 1200 × 1.045³
     */
    unroundedFinalValue:
      1369.39935,

    /**
     * Source explicitly requires nearest pound.
     */
    requestedAnswer:
      1369,

    roundingMode:
      "NEAREST_INTEGER",

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
      "MEDIUM",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that a 4.5% annual increase corresponds to multiplier 1.045 and apply it for three successive years. The calculation 1200 × 1.045^3 gives 1369.39935, which is rounded to the nearest pound to give £1369.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "PERSONAL_ASSET_VALUE",

    contextEntity:
      "necklace",

    quantityType:
      "MONEY",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      4,

    promptWordCount:
      37,

    introductionStyle:
      "CURRENT_ASSET_VALUE_INTRODUCED_BEFORE_EXPECTED_APPRECIATION",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_STATING_ANNUAL_PERCENTAGE_INCREASE_AND_DURATION",

    commandStyle:
      "DIRECT_CALCULATE_FUTURE_VALUE_COMMAND_WITH_SEPARATE_ROUNDING_INSTRUCTION",

    informationOrder: [
      "CURRENT_ASSET_VALUE",
      "ANNUAL_PERCENTAGE_INCREASE",
      "NUMBER_OF_YEARS",
      "DIRECT_CALCULATION_COMMAND",
      "EXPECTED_FUTURE_VALUE",
      "ROUNDING_INSTRUCTION",
    ],

    contextualVocabulary: [
      "necklace",
      "valued at",
      "value",
      "expected",
      "increase",
      "per year",
      "next 3 years",
      "nearest pound",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for fixed-rate compound appreciation of an asset over several years. Generated variants should vary the asset, starting value, percentage increase, number of periods and final rounding instruction. Suitable contexts include jewellery, collectibles, property, investments or other realistically appreciating assets. Avoid repeatedly using necklaces or the phrase 'expected to increase'. Preserve the repeated-percentage structure and ensure any required rounding is applied only after the full compound calculation.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "A necklace is valued at £1200. Its value is expected to increase by 4·5% per year over the next 3 years. Calculate the expected value of the necklace after this time. Give your answer to the nearest pound.",


  sourcePromptStructure: [
    "State the current monetary value of an asset.",
    "State an expected annual percentage increase and its duration.",
    "Ask directly for the expected value after that period.",
    "Give a separate rounding instruction for the final answer.",
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
    "A necklace valued at £1200 is expected to appreciate by 4.5% per year for three years; calculate its expected value to the nearest pound.",


  styleNotes:
    "The question uses a straightforward asset-appreciation context. The starting value is stated first, followed by a separate sentence containing both the annual rate and duration. The calculation command refers back to 'this time', and the final sentence independently specifies the required rounding accuracy.",


  privateNotes:
    "Strong fixed-rate compound-increase evidence with explicit final rounding. The mathematics is 1200 × 1.045^3 = 1369.39935, rounded to £1369. This complements the 2015 property example by showing the same family in a smaller-value personal-asset context and with an explicit nearest-pound requirement.",


  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      6,

    measurementMethod:
      "NOT_MEASURED",

    notes:
      "The source question appears early in Paper 2 alongside another short question. Exact rendered answer-space dimensions have not been recorded.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;