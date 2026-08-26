import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2021_P1_Q12 = {
  id: "N5_MATH_2021_P1_Q12",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2021,
  paper: "P1",
  questionNumber: "12",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  surfaceStyleId: "CONTEXTUAL_PERCENT_OF_COMPARATIVE_TOTAL",

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
  operandStructure: "KNOWN_QUANTITY_AS_PERCENTAGE_OF_COMPARATIVE_UNKNOWN_WHOLE",

  percentageProfile: {
    relationshipType: "PART_OF_WHOLE",
    expressionStyle: "PERCENT_OF",

    percentageValue: 75,
    retainedPercentage: 75,
    multiplier: 0.75,

    knownValue: 2400,
    knownValueRole: "PART_VALUE",

    originalOrWholeValue: 3200,

    requestedValueRole: "WHOLE_VALUE",
    requestedAnswer: 3200,

    workingStepCount: 1,

    arithmeticComplexity: "LOW",

    nonCalculatorFriendly: true,
    calculatorBurden: "WRITTEN_NON_CALCULATOR",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "INTEGER",
    answerValueFormat: "INTEGER",

    valueMagnitude: "LARGE",

    notes:
      "The Edinburgh ticket total represents 75% of the Glasgow ticket total. The required inverse calculation is 2400 divided by 0.75 = 3200. The familiar three-quarter percentage relationship and exact integer result make the arithmetic deliberately suitable for Paper 1.",
  },

  wordedProblemProfile: {
    contextDomain: "LIVE_EVENT_TICKETING",
    contextEntity: "gig ticket sales",

    quantityType: "COUNT",

    temporalStructure: "PART_WHOLE_COMPARISON",

    sentenceCount: 3,
    promptWordCount: 35,

    introductionStyle:
      "KNOWN_QUANTITY_INTRODUCED_WITH_EVENT_AND_LOCATION_CONTEXT",

    relationshipStatementStyle:
      "SEPARATE_THIS_WAS_PERCENT_OF_COMPARATIVE_QUANTITY_SENTENCE",

    commandStyle:
      "DIRECT_CALCULATE_COMPARATIVE_TOTAL_COMMAND",

    informationOrder: [
      "REAL_WORLD_CONTEXT",
      "KNOWN_QUANTITY",
      "FIRST_LOCATION",
      "PERCENTAGE_RELATIONSHIP",
      "SECOND_COMPARATIVE_LOCATION",
      "UNKNOWN_WHOLE",
      "DIRECT_CALCULATION_COMMAND",
    ],

    contextualVocabulary: [
      "band",
      "tickets",
      "gig",
      "sold",
      "Edinburgh",
      "Glasgow",
      "number of tickets",
    ],

    hasNamedPerson: false,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "This provides evidence for comparative part-whole questions where two related events, locations, groups or periods are compared rather than referring to an abstract total. Generated questions should vary the entities, settings, places, percentages and quantities substantially. Suitable independent contexts include attendance at two venues, sales at two branches, visitor numbers at two attractions or quantities produced at two sites. Avoid copying the band, gig or Edinburgh/Glasgow framing.",
  },

  sourcePromptText:
    "A band sold 2400 tickets for their gig in Edinburgh. This was 75% of the number of tickets sold for their gig in Glasgow. Calculate the number of tickets sold for their gig in Glasgow.",

  sourcePromptStructure: [
    "Introduce a known quantity for the first of two comparable contexts.",
    "State that the known quantity is a given percentage of the corresponding quantity in the second context.",
    "Ask directly for the unknown comparative quantity.",
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
    "A ticket total for one gig is 75% of the ticket total for another gig; calculate the second total.",

  styleNotes:
    "The question embeds the percentage relationship inside a natural comparison between two otherwise equivalent quantities. The opening sentence establishes the first quantity and its context. The second sentence begins with 'This was' and links that quantity to 75% of the second quantity. No method is signposted. The final sentence repeats enough contextual language to make the required unknown completely explicit.",

  privateNotes:
    "Important P1 evidence that a reverse-percentage part-whole question need not use language such as 'total available' or 'original'. The same mathematics can be presented as a comparison between two parallel real-world quantities. This should broaden generator context families substantially.",

  answerSpace: {
      category: "MEDIUM",
      estimatedLines: 5,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 10,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 510,
        bottomPx: 1386,
        heightPx: 876,
  
        topPt: 122.4,
        bottomPt: 332.64,
        heightPt: 210.24,
  
        heightMm: 74.17,
      },
  
      notes:
        "Remeasured from the bottom of the final Q12 instruction line to the top of the Q13 prompt block on physical PDF page 10.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;