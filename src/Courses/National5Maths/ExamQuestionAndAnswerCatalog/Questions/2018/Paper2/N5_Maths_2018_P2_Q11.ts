import type { ExamQuestionCatalogEntry } from "../../ExamQuestionTypes";

export const N5_MATHS_2018_P2_Q11 = {
  id: "N5_MATH_2018_P2_Q11",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2018,
  paper: "P2",
  questionNumber: "11",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  surfaceStyleId: "CONTEXTUAL_PART_OF_WHOLE_WITH_SCIENTIFIC_NOTATION",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "part-whole-percentages",
    "scientific-notation",
  ],

  conceptIds: [
    "identify-known-percentage-of-whole",
    "reverse-percentage-part-to-whole",
    "calculate-original-whole",
    "interpret-scientific-notation",
  ],

  paperSuitability: "P2",
  calculatorStatus: "CALCULATOR_ALLOWED",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure: "SCIENTIFIC_NOTATION_PART_AS_PERCENTAGE_OF_UNKNOWN_WHOLE",

  percentageProfile: {
    relationshipType: "PART_OF_WHOLE",
    expressionStyle: "PERCENT_OF",

    percentageValue: 85,
    retainedPercentage: 85,
    multiplier: 0.85,

    knownValue: 930000000000,
    knownValueRole: "PART_VALUE",

    originalOrWholeValue: 1094117647058.8235,

    requestedValueRole: "WHOLE_VALUE",
    requestedAnswer: 1094117647058.8235,

    workingStepCount: 1,

    arithmeticComplexity: "HIGH",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_STRONGLY_EXPECTED",

    inverseCalculationProducesExactResult: false,

    knownValueFormat: "SCIENTIFIC_NOTATION",
    answerValueFormat: "SCIENTIFIC_NOTATION",

    valueMagnitude: "VERY_LARGE",

    notes:
      "The known value is expressed as 9.3 × 10^11 and represents 85% of the unknown whole. The inverse calculation requires division by 0.85 and does not produce a tidy integer result. This makes calculator use strongly expected. The question also requires the pupil to remain comfortable interpreting and manipulating a quantity written in scientific notation.",
  },

  wordedProblemProfile: {
    contextDomain: "ASTRONOMY",
    contextEntity: "planetary volume",

    quantityType: "MEASUREMENT",

    temporalStructure: "PART_WHOLE_COMPARISON",

    sentenceCount: 4,
    promptWordCount: 33,

    introductionStyle:
      "SHORT_CONTEXT_SENTENCE_ESTABLISHING_TWO_REAL_WORLD_ENTITIES",

    relationshipStatementStyle:
      "KNOWN_MEASUREMENT_FOLLOWED_BY_SEPARATE_THIS_IS_PERCENT_OF_STATEMENT",

    commandStyle:
      "DIRECT_CALCULATE_UNKNOWN_MEASUREMENT_COMMAND",

    informationOrder: [
      "REAL_WORLD_CONTEXT",
      "KNOWN_MEASUREMENT",
      "SCIENTIFIC_NOTATION_VALUE",
      "PERCENTAGE_RELATIONSHIP",
      "UNKNOWN_WHOLE",
      "DIRECT_CALCULATION_COMMAND",
    ],

    contextualVocabulary: [
      "planets",
      "solar system",
      "volume",
      "cubic kilometres",
      "approximately",
    ],

    hasNamedPerson: false,
    usesPronounReference: true,
    visualContext: true,

    interleavedSkillIds: [
      "scientific-notation",
    ],

    generatorVariationNotes:
      "This source is important evidence that reverse-percentage questions can be interleaved naturally with another numerical skill. Generated questions should not repeatedly use planets or scientific notation, but may occasionally combine reverse percentages with suitable large-scale measurements or scientific-notation quantities. Where an interleaved skill is used, the percentage reasoning must remain the primary assessed process. Contexts and numerical values should be independently generated and markedly different from the source.",
  },

  sourcePromptText:
    "Venus and Earth are two planets within our solar system. The volume of Venus is approximately 9.3 × 10^11 cubic kilometres. This is 85% of the volume of Earth. Calculate the volume of Earth.",

  sourcePromptStructure: [
    "Introduce two related real-world entities.",
    "State a known measurement for one entity using scientific notation.",
    "State that this measurement is a given percentage of the unknown measurement for the second entity.",
    "Ask directly for the unknown whole measurement.",
  ],

  surfaceStyleTags: [
    "CONTEXTUALISED",
    "WORD_PROBLEM",
    "DIRECT_CALCULATION_COMMAND",
    "PERCENTAGE_RELATIONSHIP",
    "PART_WHOLE_RELATIONSHIP",
    "MEASUREMENT_CONTEXT",
    "INTERLEAVED_SKILL",
    "DIAGRAM_INCLUDED",
  ],

  promptSummary:
    "The volume of Venus is given in scientific notation and stated to be 85% of Earth's volume; calculate Earth's volume.",

  styleNotes:
    "The question begins with a short contextual sentence before supplying the numerical information. The known value and percentage relationship are separated into individual sentences. The mathematical demand is hidden within natural contextual language rather than presented as a percentage calculation. Two labelled planet images reinforce the context but are not mathematically necessary. The final command is short and direct.",

  privateNotes:
    "Strong evidence for allowing controlled interleaving within generated reverse-percentage questions. This should not cause scientific notation to become mandatory for the family; instead it provides evidence for an occasional higher-complexity P2 variant. It also demonstrates that P2 numerical difficulty can come from value representation and arithmetic burden rather than from more complicated percentage reasoning alone.",

  answerSpace: {
      category: "FULL_PAGE",
      estimatedLines: 12,
      measurementMethod: "PDF_RENDER",
  
      sourceMeasurement: {
        pdfPageNumber: 32,
        renderDpi: 300,
        pageWidthPx: 2481,
        pageHeightPx: 3508,
  
        topPx: 1180,
        bottomPx: 3228,
        heightPx: 2048,
  
        topPt: 283.2,
        bottomPt: 774.72,
        heightPt: 491.52,
  
        heightMm: 173.4,
      },
  
      notes:
        "Remeasured from the bottom of the final Q11 instruction line to the top of the barcode/footer region on physical PDF page 32. Q11 is the only question on this page, so the large region is a page-layout outlier.",
    },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies ExamQuestionCatalogEntry;