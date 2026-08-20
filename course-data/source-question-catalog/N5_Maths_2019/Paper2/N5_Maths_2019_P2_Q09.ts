import type { SourceQuestionCatalogEntry } from "../../SourceQuestionTypes";

export const N5_MATHS_2019_P2_Q09 = {
  id: "N5_MATH_2019_P2_Q09",

  courseId: "N5_MATH",
  sourceKind: "SQA_PAST_PAPER",

  year: 2019,
  paper: "P2",
  questionNumber: "9",

  totalMarks: 3,

  familyId: "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE",
  surfaceStyleId: "CONTEXTUAL_SURCHARGE_FIND_CHANGE_AMOUNT",

  primaryTopic: "NUM",

  skillIds: [
    "percentages",
    "reverse-percentages",
    "percentage-increase",
  ],

  conceptIds: [
    "identify-percentage-after-increase",
    "reverse-percentage-final-to-original",
    "calculate-percentage-change-amount",
  ],

  paperSuitability: "P2",
  calculatorStatus: "CALCULATOR_ALLOWED",

  standardProfile: "C+A",
  thinkingProfile: "MIXED",

  operationType: "DIVIDE",
  operandStructure:
    "FINAL_VALUE_AFTER_PERCENTAGE_SURCHARGE_FIND_CHANGE_AMOUNT",

  percentageProfile: {
    relationshipType: "INCREASE",
    expressionStyle: "SURCHARGE",

    percentageValue: 2.5,
    retainedPercentage: 102.5,
    multiplier: 1.025,

    knownValue: 977.85,
    knownValueRole: "FINAL_VALUE",

    originalOrWholeValue: 954,

    requestedValueRole: "CHANGE_AMOUNT",
    requestedAnswer: 23.85,

    changeAmount: 23.85,

    workingStepCount: 2,

    arithmeticComplexity: "HIGH",

    nonCalculatorFriendly: false,
    calculatorBurden: "CALCULATOR_STRONGLY_EXPECTED",

    inverseCalculationProducesExactResult: true,

    knownValueFormat: "CURRENCY",
    answerValueFormat: "CURRENCY",

    valueMagnitude: "MEDIUM",

    notes:
      "The final amount includes a 2.5% surcharge, so it represents 102.5% of the original amount. The pupil must first calculate 977.85 divided by 1.025 = 954, then calculate the difference between 977.85 and 954 to obtain £23.85. Unlike most reverse-percentage questions, recovering the original value is an intermediate step rather than the requested final answer.",
  },

  wordedProblemProfile: {
    contextDomain: "SERVICE_PAYMENT",
    contextEntity: "roof repair charge",

    quantityType: "MONEY",

    temporalStructure: "BEFORE_AFTER",

    sentenceCount: 4,
    promptWordCount: 34,

    introductionStyle:
      "NAMED_PERSON_AND_SERVICE_CONTEXT_INTRODUCED_BEFORE_NUMERICAL_INFORMATION",

    relationshipStatementStyle:
      "SEPARATE_SENTENCE_STATING_EXTRA_PERCENTAGE_CHARGE",

    commandStyle:
      "DIRECT_CALCULATE_SAVING_IF_SURCHARGE_AVOIDED",

    informationOrder: [
      "NAMED_PERSON",
      "SERVICE_CONTEXT",
      "SURCHARGE_PERCENTAGE",
      "FINAL_AMOUNT_PAID",
      "HYPOTHETICAL_ON_TIME_PAYMENT",
      "DIRECT_CALCULATION_COMMAND",
      "UNKNOWN_CHANGE_AMOUNT",
    ],

    contextualVocabulary: [
      "repaired",
      "charged",
      "extra",
      "late payment",
      "total",
      "saved",
      "paid on time",
    ],

    hasNamedPerson: true,
    usesPronounReference: true,
    visualContext: false,

    interleavedSkillIds: [],

    generatorVariationNotes:
      "This source provides evidence for a less direct reverse-percentage question where the original value must be recovered before answering a second related question. Generated variants should use independently created contexts such as fees, penalties, service charges, booking supplements or other realistic percentage additions. Vary the final command so the requested answer may be the surcharge, saving or difference rather than repeatedly asking for the original amount. Avoid reproducing the roof-repair and late-payment scenario.",
  },

  sourcePromptText:
    "Georgie had her roof repaired. She was charged an extra 2.5% for late payment. She had to pay a total of £977.85. Calculate how much she would have saved if she had paid on time.",

  sourcePromptStructure: [
    "Introduce a named person and a real-world service context.",
    "State that an additional percentage charge has been applied.",
    "State the final amount after the percentage increase.",
    "Ask for the amount that would have been saved if the increase had not applied.",
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
    "A final payment includes a 2.5% late-payment surcharge; determine how much would have been saved without the surcharge.",

  styleNotes:
    "This is more interpretive than the standard final-to-original reverse-percentage form. The first three sentences establish context, percentage increase and final value. The final command does not explicitly ask for the original amount, so the pupil must recognise that reverse percentage is required as an intermediate process before subtracting to find the saving.",

  privateNotes:
    "Important higher-complexity P2 family. The extra difficulty comes from both awkward calculator arithmetic and the indirect requested quantity. The generator should preserve this two-stage reasoning occasionally, rather than treating all reverse-percentage questions as simple final-to-original calculations.",

  answerSpace: {
    category: "LARGE",
    estimatedLines: 8,
    measurementMethod: "PDF_RENDER",

    sourceMeasurement: {
      renderDpi: 300,
      pageWidthPx: 2481,
      pageHeightPx: 3508,

      topPx: 713,
      bottomPx: 2076,
      heightPx: 1363,

      topPt: 171.12,
      bottomPt: 498.24,
      heightPt: 327.12,

      heightMm: 115.4,
    },

    notes:
      "Measured from the bottom of the final Q9 instruction line to the top of the Q10 prompt block on the original PDF page.",
  },

  linkedGeneratorFamilyIds: [
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE",
  ],

  reviewStatus: "CATALOGUED",
} satisfies SourceQuestionCatalogEntry;