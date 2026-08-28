import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2014_P1_Q09 = {
  id: "N5_MATH_2014_P1_Q09",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2014,
  paper: "P1",
  questionNumber: "9",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  surfaceStyleId: "CONTEXTUAL_PART_OF_WHOLE_PERCENTAGE",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "part-whole-percentages",
  ],

  conceptIds: [
    "identify-known-percentage-of-whole",
    "reverse-percentage-part-to-whole",
    "calculate-original-whole",
  ],

  paperSuitability: "P1",
  calculatorStatus: "NON_CALCULATOR",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "KNOWN_PART_AS_PERCENTAGE_OF_UNKNOWN_WHOLE",

  percentageProfile: {
    relationshipType: "PART_OF_WHOLE",
    expressionStyle: "REPRESENTS_PERCENT_OF",

    percentageValue: 80,
    retainedPercentage: 80,
    multiplier: 0.8,

    knownValue: 480000,
    knownValueRole: "PART_VALUE",

    originalOrWholeValue: 600000,

    requestedValueRole: "WHOLE_VALUE",
    requestedAnswer: 600000,

    workingStepCount: 1,

    arithmeticComplexity: "LOW",

    nonCalculatorFriendly: true,
    calculatorBurden: "WRITTEN_NON_CALCULATOR",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "INTEGER",
    answerValueFormat: "INTEGER",

    valueMagnitude: "VERY_LARGE",

    notes:
      "The large values create realistic scale without increasing arithmetic difficulty. The key inverse calculation is 480000 divided by 0.8, producing the exact whole-number result 600000. The percentage and values are deliberately compatible with non-calculator working.",
  },

  wordedProblemProfile: {
    contextDomain: "SPORTS_EVENT_TICKETING",
    contextEntity: "tennis tournament tickets",

    quantityType: "COUNT",

    temporalStructure: "PART_WHOLE_COMPARISON",

    sentenceCount: 3,
    promptWordCount: 31,

    introductionStyle:
      "KNOWN_PART_VALUE_INTRODUCED_INSIDE_REAL_WORLD_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_THIS_REPRESENTS_PERCENT_OF_WHOLE",

    commandStyle:
      "DIRECT_CALCULATE_TOTAL_NUMBER_COMMAND",

    informationOrder: [
      "KNOWN_PART_VALUE",
      "REAL_WORLD_CONTEXT",
      "PERCENTAGE_RELATIONSHIP",
      "UNKNOWN_WHOLE",
      "DIRECT_CALCULATION_COMMAND",
    ],

    contextualVocabulary: [
      "tickets",
      "sold",
      "tournament",
      "available",
      "total number",
    ],

    hasNamedPerson: false,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "Preserve the structural idea of a known quantity being stated first, followed by a short sentence identifying it as a percentage of an unknown total. Generated questions should vary the setting, nouns, percentage, quantities and sentence construction rather than reproducing the tennis-ticket wording. Suitable alternative contexts include attendance, stock, capacity, membership, production totals and other naturally countable quantities.",
  },

  sourcePromptText:
    "480 000 tickets were sold for a tennis tournament last year. This represents 80% of all the available tickets. Calculate the total number of tickets that were available for this tournament.",

  sourcePromptStructure: [
    "State a known part-value in context.",
    "State that the known value represents a given percentage of the total.",
    "Ask directly for the total or whole value.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "PART_WHOLE_RELATIONSHIP",
    "COUNT_CONTEXT",
  ],

  promptSummary:
    "A known number of tickets represents 80% of the available total; calculate the total number available.",

  styleNotes:
    "The question uses three short declarative sentences. The numerical value is embedded naturally in the opening context rather than presented as a bare calculation. The percentage relationship is isolated in its own sentence beginning with 'This represents', before a direct Calculate command. The language is concise and contains no mathematical scaffolding such as an explicit multiplier or method hint.",

  privateNotes:
    "Useful evidence for a non-calculator reverse-percentage family. Although the quantities are large, the 80% relationship gives straightforward arithmetic. Generator should model the mathematical and linguistic structure, not retain this exact surface context or wording.",

  answerSpace: {
      category: "LARGE",
      estimatedLines: 7,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 9,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 1758,
        bottomPx: 2937,
        heightPx: 1179,
  
        topPt: 421.92,
        bottomPt: 704.88,
        heightPt: 282.96,
  
        heightMm: 99.82,
      },
  
      notes:
        "Measured from the bottom of the final Q9 instruction line to the top of the '[Turn over]' marker on physical PDF page 9.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;