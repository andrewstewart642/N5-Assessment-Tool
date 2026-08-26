import type {
  ExamQuestionCatalogEntry,
} from "../../ExamQuestionTypes";


export const N5_MATHS_2014_P2_Q01 = {
  id:
    "N5_MATH_2014_P2_Q01",

  courseId:
    "N5_MATH",

  sourceKind:
    "SQA_PAST_PAPER",

  year:
    2014,

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
    "CONTEXTUAL_SCHOOL_ROLL_REPEATED_PERCENTAGE_DECREASE",


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
          15,

        multiplier:
          0.85,

        periods:
          3,
      },
    ],

    initialValue:
      964,

    totalPeriods:
      3,

    /**
     * 964 × 0.85³
     */
    unroundedFinalValue:
      592.0165,

    /**
     * Source explicitly requires nearest ten.
     */
    requestedAnswer:
      590,

    roundingMode:
      "NEAREST_TEN",

    roundingExplicitInPrompt:
      true,

    arithmeticComplexity:
      "MEDIUM",

    calculatorBurden:
      "CALCULATOR_NATURAL",

    initialValueFormat:
      "INTEGER",

    answerValueFormat:
      "INTEGER",

    valueMagnitude:
      "MEDIUM",

    yearByYearMethodNatural:
      true,

    notes:
      "The pupil must recognise that a 15% annual decrease leaves 85% of the previous year's roll, giving multiplier 0.85. This multiplier is applied for three successive years. The resulting value 592.0165 is then rounded to the nearest ten to give 590.",
  },


  /**
   * Context / wording profile
   */
  wordedProblemProfile: {
    contextDomain:
      "SCHOOL_POPULATION",

    contextEntity:
      "secondary school pupil roll",

    quantityType:
      "COUNT",

    temporalStructure:
      "YEAR_ON_YEAR",

    sentenceCount:
      4,

    promptWordCount:
      39,

    introductionStyle:
      "CURRENT_COUNT_INTRODUCED_IN_NAMED_INSTITUTION_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_FORECAST_SENTENCE_STATING_ANNUAL_PERCENTAGE_DECREASE",

    commandStyle:
      "QUESTION_FORM_REQUESTING_EXPECTED_FUTURE_VALUE_WITH_SEPARATE_ROUNDING_INSTRUCTION",

    informationOrder: [
      "CURRENT_PUPIL_ROLL",
      "SCHOOL_CONTEXT",
      "ANNUAL_PERCENTAGE_DECREASE",
      "NUMBER_OF_YEARS",
      "EXPECTED_FUTURE_ROLL",
      "ROUNDING_INSTRUCTION",
    ],

    contextualVocabulary: [
      "pupils",
      "roll",
      "High School",
      "forecast",
      "decrease",
      "per year",
      "expected roll",
      "years",
      "nearest ten",
    ],

    hasNamedPerson:
      false,

    usesPronounReference:
      true,

    visualContext:
      false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for a fixed-rate compound decrease applied to a count over several years. Generated questions should vary the population or quantity context, initial value, percentage decrease, number of periods and rounding requirement. Suitable contexts include school rolls, memberships, populations, production totals, waste quantities or other naturally declining measures. Avoid repeatedly using a school-roll context or copying the source wording. Preserve the requirement that the new value each year is based on the previous year's value rather than subtracting the same absolute amount repeatedly.",
  },


  /**
   * Source wording
   */
  sourcePromptText:
    "There are 964 pupils on the roll of Aberleven High School. It is forecast that the roll will decrease by 15% per year. What will be the expected roll after 3 years? Give your answer to the nearest ten.",


  sourcePromptStructure: [
    "State the current quantity in a real-world institutional context.",
    "State a forecast annual percentage decrease.",
    "Ask for the expected quantity after a specified number of years.",
    "Give a separate final-answer rounding instruction.",
  ],


  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "PERCENTAGE_RELATIONSHIP",
    "TEMPORAL_COMPARISON",
    "COUNT_CONTEXT",
  ],


  promptSummary:
    "A school roll of 964 pupils is forecast to decrease by 15% per year for three years; calculate the expected roll and round to the nearest ten.",


  styleNotes:
    "The question is a concise four-sentence contextual problem. The current value is introduced first, followed by a separate forecast statement containing the annual percentage decrease. The future time period is supplied only in the question sentence, and the rounding requirement is isolated in a final instruction. No multiplier, formula or method is signposted.",


  privateNotes:
    "Early evidence for the fixed-rate compound-decrease family. The mathematics is 964 × 0.85^3, followed by explicit rounding to the nearest ten. The context demonstrates that compound percentage questions need not involve money or depreciation vocabulary; repeated percentage decrease can be framed as a changing population or count.",


  /**
   * Exact source response-space measurement.
   *
   * Standard:
   * - source PDF rendered at 300 dpi;
   * - A4 render = 2481 × 3508 px;
   * - top-left coordinate origin;
   * - measured from the bottom of the final
   *   instruction line to the top of the
   *   [Turn over] marker.
   *
   * Although Q1 is the only question on this
   * printed page, the area below the Turn-over
   * marker is not pupil response space and must
   * not be counted.
   */
  answerSpace: {
    category:
      "MEDIUM",

    estimatedLines:
      5,

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
        577,

      bottomPx:
        1355,

      heightPx:
        778,

      topPt:
        138.48,

      bottomPt:
        325.2,

      heightPt:
        186.72,

      heightMm:
        65.87,
    },

    notes:
      "Measured from the bottom of the final Q1 instruction line ('Give your answer to the nearest ten.') to the top of the '[Turn over]' marker on physical PDF page 19. The previous FULL_PAGE/manual-estimate classification incorrectly treated space below the Turn-over marker as available pupil working space.",
  },


  linkedGeneratorFamilyIds: [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
  ],


  reviewStatus:
    "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;