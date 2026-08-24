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
  type GeneratedCompoundPercentageQuestion,
} from "@/course-data/question-generators/compound-percentages/N5MathsCompoundPercentageGenerator";

import {
  generateN5MathsCompoundPercentageWorkedAnswers,
} from "@/course-data/answer-generators/compound-percentages/N5MathsCompoundPercentageAnswerGenerator";


const DEFAULT_COMPOUND_PERCENTAGE_DIFFICULTY:
  CompoundPercentageDifficulty = 2;


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

  const generated =
    generateN5MathsCompoundPercentageQuestion({
      difficulty,
    });

  const workedAnswers =
    generateN5MathsCompoundPercentageWorkedAnswers(
      generated
    );

  const templateId = [
    "source-catalogue-compound-percentages",
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
      "N4.2",

    sourceConceptLabel:
      "Compound percentages",

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
        "N4.2",

      conceptLabel:
        "Compound percentages",

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
        "N4.2"
      );
    },

    generate:
      buildGeneratedCompoundPercentageQuestion,
  };


export default
  AppreciationConceptModule;