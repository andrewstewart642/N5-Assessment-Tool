// app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation.ts

import type {
  DifficultyLevel,
} from "@/shared-types/AssessmentTypes";

import type {
  PaperPart,
} from "@/shared-types/PaperParts";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";

import type {
  QuestionVariantSelectionMeta,
} from "@/shared-types/QuestionSelectionTypes";

import {
  generateN5MathsCompoundPercentageQuestion,
  type CompoundPercentageDifficulty,
  type CompoundPercentageDirection,
  type GeneratedCompoundPercentageQuestion,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/Numerical/N04_Percentages/N04_2_PercentagesAppreciation/N04_2_PercentagesAppreciationQuestionWriter";

import {
  generateN5MathsCompoundPercentageWorkedAnswers,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerWriting/Numerical/N04_Percentages/N04_2_PercentagesAppreciation/N04_2_PercentagesAppreciationAnswerWriter";


const DEFAULT_COMPOUND_PERCENTAGE_DIFFICULTY:
  CompoundPercentageDifficulty = 2;


const MIXED_CONCEPT_CODE =
  "N4.2";

const APPRECIATION_CONCEPT_CODE =
  "N4.2.1";

const DEPRECIATION_CONCEPT_CODE =
  "N4.2.2";


function textPart(
  value: string
): PaperPart {
  return {
    kind:
      "text",

    value,
  };
}


function normaliseDifficulty(
  input:
    DifficultyLevel
): CompoundPercentageDifficulty {
  if (
    input <= 1
  ) {
    return 1;
  }

  if (
    input === 2
  ) {
    return 2;
  }

  return 3;
}


function buildPromptParts(
  generated:
    GeneratedCompoundPercentageQuestion
): PaperPart[] {
  return [
    textPart(
      generated.questionText
    ),
  ];
}


function buildAnswerParts(
  generated:
    GeneratedCompoundPercentageQuestion
): PaperPart[] {
  return [
    textPart(
      generated.answerText
    ),
  ];
}


function getSelectedConceptCode(
  context:
    GeneratorContext
): string {
  return (
    context.concept?.code ??
    MIXED_CONCEPT_CODE
  );
}


function getSelectedConceptLabel(
  context:
    GeneratorContext
): string {
  return (
    context.concept?.label ??
    context.selectedConceptText ??
    "Mixed appreciation/depreciation"
  );
}


function getDirectionForConceptCode(
  conceptCode:
    string
): CompoundPercentageDirection | undefined {
  switch (
    conceptCode
  ) {
    case APPRECIATION_CONCEPT_CODE:
      return "INCREASE";

    case DEPRECIATION_CONCEPT_CODE:
      return "DECREASE";

    case MIXED_CONCEPT_CODE:
    default:
      return undefined;
  }
}


function buildSelectionMeta(args: {
  level:
    DifficultyLevel;

  templateId:
    string;
}): QuestionVariantSelectionMeta {
  return {
    level:
      args.level,

    templateId:
      args.templateId,

    marks: {
      totalMarks:
        3,

      cMarks:
        3,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    standardProfile:
      "C",

    paperSuitability:
      "P2",

    calculatorStatus:
      "CalculatorRequired",
  };
}


function buildGeneratedCompoundPercentageQuestion(
  context:
    GeneratorContext
): GeneratedQuestionData {
  const difficulty =
    normaliseDifficulty(
      context.difficulty
    );

  const selectedConceptCode =
    getSelectedConceptCode(
      context
    );

  const selectedConceptLabel =
    getSelectedConceptLabel(
      context
    );

  const direction =
    getDirectionForConceptCode(
      selectedConceptCode
    );

  const generated =
    generateN5MathsCompoundPercentageQuestion({
      difficulty,

      ...(direction
        ? {
            direction,
          }
        : {}),
    });

  const workedAnswers =
    generateN5MathsCompoundPercentageWorkedAnswers(
      generated
    );

  const templateId = [
    "source-catalogue-compound-percentages",
    selectedConceptCode,
    `level-${difficulty}`,
    generated.familyId,
    generated.numericProfile.kind,
    generated.numericProfile.direction,
    generated.numericProfile.contextTemplateId,
  ].join(
    "-"
  );

  return {
    prompt:
      generated.questionText,

    answer:
      generated.answerText,

    marks:
      3,

    questionCode:
      generated.familyId,

    promptParts:
      buildPromptParts(
        generated
      ),

    answerParts:
      buildAnswerParts(
        generated
      ),

    workedAnswers,

    markBreakdown: {
      totalMarks:
        3,

      cMarks:
        3,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    classification: {
      standard:
        "C",

      calculatorStatus:
        "CalculatorOnly",

      structureType:
        "ContextualProblem",

      isReasoning:
        false,

      paperSuitability:
        "P2",
    },

    sourceSkillCode:
      "NQ_N5_NUM_N04",

    sourceConceptCode:
      selectedConceptCode,

    sourceConceptLabel:
      selectedConceptLabel,

    templateId,

    topicMarkBreakdown: {
      NUM:
        3,

      ALG:
        0,

      GEO:
        0,

      TRIG:
        0,

      STAT:
        0,
    },

    selectionMeta:
      buildSelectionMeta({
        level:
          difficulty,

        templateId,
      }),
  };
}


function levelSelectionEntry(
  level:
    CompoundPercentageDifficulty
): QuestionVariantSelectionMeta {
  return {
    level,

    templateId:
      `source-catalogue-compound-percentages-level-${level}`,

    marks: {
      totalMarks:
        3,

      cMarks:
        3,

      aMarks:
        0,

      reasoningMarks:
        0,
    },

    standardProfile:
      "C",

    paperSuitability:
      "P2",

    calculatorStatus:
      "CalculatorRequired",
  };
}


export const AppreciationConceptModule:
  ConceptGeneratorModule = {
    metadata: {
      moduleId:
        "NQ_N5_NUM_N04_2_COMPOUND_PERCENTAGES",

      domain:
        "NUM",

      skillCode:
        "NQ_N5_NUM_N04",

      conceptCode:
        MIXED_CONCEPT_CODE,

      conceptLabel:
        "Mixed appreciation/depreciation",

      difficultyProfile: {
        availableLevels: [
          1,
          2,
          3,
        ],

        defaultLevel:
          DEFAULT_COMPOUND_PERCENTAGE_DIFFICULTY,

        levelDescriptions: {
          1:
            "Accessible compound percentage questions using friendly whole-number rates and values suited to repeated percentage calculations.",

          2:
            "Typical National 5 compound percentage questions based on the historical exam distribution.",

          3:
            "More demanding compound percentage questions with a heavier chance of longer periods, decimal rates and multi-rate depreciation.",
        },
      },

      capabilities: {
        standardCoverage: [
          "C",
        ],

        canGenerateReasoning:
          false,

        calculatorStatus:
          "CalculatorOnly",

        paperSuitability:
          "P2",

        typicalStructureTypes: [
          "ContextualProblem",
        ],
      },

      levelSelectionProfile: {
        1: [
          levelSelectionEntry(
            1
          ),
        ],

        2: [
          levelSelectionEntry(
            2
          ),
        ],

        3: [
          levelSelectionEntry(
            3
          ),
        ],
      },
    },

    canHandle(
      code:
        string
    ) {
      return (
        code ===
          MIXED_CONCEPT_CODE ||
        code ===
          APPRECIATION_CONCEPT_CODE ||
        code ===
          DEPRECIATION_CONCEPT_CODE
      );
    },

    generate:
      buildGeneratedCompoundPercentageQuestion,
  };


export default
  AppreciationConceptModule;