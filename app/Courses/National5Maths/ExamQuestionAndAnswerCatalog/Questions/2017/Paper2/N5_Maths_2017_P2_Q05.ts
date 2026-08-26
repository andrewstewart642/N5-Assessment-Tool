import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2017_P2_Q05 = {
  id: "N5_MATH_2017_P2_Q05",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2017,
  paper: "P2",
  questionNumber: "5",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  surfaceStyleId: "CONTEXTUAL_MORE_THAN_PREVIOUS_VALUE",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "percentage-increase",
  ],

  conceptIds: [
    "identify-percentage-after-increase",
    "reverse-percentage-final-to-original",
    "calculate-previous-value",
  ],

  paperSuitability: "P2",
  calculatorStatus: "CALCULATOR_ALLOWED",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "FINAL_VALUE_PERCENT_MORE_THAN_PREVIOUS_VALUE",

  percentageProfile: {
    relationshipType: "INCREASE",
    expressionStyle: "MORE_THAN",

    percentageValue: 15,
    retainedPercentage: 115,
    multiplier: 1.15,

    knownValue: 4830,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 4200,

    requestedValueRole: "ORIGINAL_VALUE",
    requestedAnswer: 4200,

    workingStepCount: 1,

    arithmeticComplexity: "MEDIUM",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_NATURAL",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "INTEGER",
    answerValueFormat: "INTEGER",

    valueMagnitude: "LARGE",

    notes:
      "The current ticket total is 15% greater than the previous year's total, so it represents 115% of the unknown original value. The inverse calculation is 4830 divided by 1.15 = 4200. The values produce an exact integer answer but the decimal multiplier makes calculator use natural.",
  },

  wordedProblemProfile: {
    contextDomain: "EVENT_TICKETING",
    contextEntity: "theatre show tickets",

    quantityType: "COUNT",

    temporalStructure: "YEAR_ON_YEAR",

    sentenceCount: 3,
    promptWordCount: 24,

    introductionStyle:
      "CURRENT_TOTAL_INTRODUCED_IN_REAL_WORLD_EVENT_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_THIS_WAS_PERCENT_MORE_THAN_PREVIOUS_YEAR",

    commandStyle:
      "DIRECT_QUESTION_FOR_PREVIOUS_YEAR_QUANTITY",

    informationOrder: [
      "CURRENT_TOTAL",
      "REAL_WORLD_CONTEXT",
      "PERCENTAGE_INCREASE_RELATIVE_TO_PREVIOUS_YEAR",
      "UNKNOWN_PREVIOUS_VALUE",
      "DIRECT_QUESTION",
    ],

    contextualVocabulary: [
      "theatre group",
      "tickets",
      "show",
      "more than",
      "last year",
    ],

    hasNamedPerson: false,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Use this as evidence for temporal comparison wording such as a current quantity being stated first and then described as a percentage more than an earlier quantity. Vary the context widely across attendance, sales, production, membership, visitors and other count-based scenarios. Generated questions should vary sentence order and command wording while preserving the requirement to recognise the current value as greater than 100% of the previous value.",
  },

  sourcePromptText:
    "A theatre group sold 4830 tickets for their show. This was 15% more than they sold last year. How many tickets did they sell last year?",

  sourcePromptStructure: [
    "State the current quantity in context.",
    "State that this is a given percentage more than the previous quantity.",
    "Ask directly for the previous quantity.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "PERCENTAGE_RELATIONSHIP",
    "TEMPORAL_COMPARISON",
    "COUNT_CONTEXT",
  ],

  promptSummary:
    "A current ticket total is 15% greater than the previous year's total; calculate the previous total.",

  styleNotes:
    "The question uses concise natural language and avoids mathematical terminology such as multiplier or original value. The key relationship appears in the phrase '15% more than', requiring the pupil to interpret the current value as 115% of the previous value. The final sentence is phrased as a direct question rather than a Calculate command.",

  privateNotes:
    "Useful evidence that SQA varies command style even within the same mathematical family. This should inform wording variation in the generator so questions do not repeatedly end with 'Calculate...'.",

  answerSpace: {
      category: "LARGE",
      estimatedLines: 6,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 21,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 2129,
        bottomPx: 3120,
        heightPx: 991,
  
        topPt: 510.96,
        bottomPt: 748.8,
        heightPt: 237.84,
  
        heightMm: 83.9,
      },
  
      notes:
        "Remeasured at 300 dpi from the bottom of the final Q5 question line to the top of the '[Turn over]' marker on physical PDF page 21. This replaces the previous shifted coordinate pair.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;