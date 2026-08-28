import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type { DifficultyLevel } from "@/app/Assessments/AssessmentTypes";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  generateN5MathsReversePercentageWorkedAnswers,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerWriting/Numerical/N04_Percentages/N04_1_PercentagesReverse/N04_1_PercentagesReverseAnswerWriter";

import type {
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  generateN5MathsReversePercentageQuestion,
  type ReversePercentageDifficulty,
  type ReversePercentagePaper,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/Numerical/N04_Percentages/N04_1_PercentagesReverse/N04_1_PercentagesReverseQuestionWriter";

function textPart(value: string): PaperPart {
  return {
    kind: "text",
    value,
  };
}

function normaliseDifficulty(
  input: DifficultyLevel
): ReversePercentageDifficulty {
  if (input <= 1) return 1;
  if (input === 2) return 2;

  return 3;
}

function normalisePaper(
  context: GeneratorContext
): ReversePercentagePaper {
  const targetPaper =
    context.selectionFilters?.targetPaper ??
    context.paper;

  return targetPaper === "P2" ? "P2" : "P1";
}

function classificationCalculatorStatusForPaper(
  paper: ReversePercentagePaper
): "NonCalculatorOnly" | "CalculatorOnly" {
  return paper === "P1"
    ? "NonCalculatorOnly"
    : "CalculatorOnly";
}

function selectionCalculatorStatusForPaper(
  paper: ReversePercentagePaper
): "NonCalculatorOnly" | "CalculatorRequired" {
  return paper === "P1"
    ? "NonCalculatorOnly"
    : "CalculatorRequired";
}

function buildSelectionMeta(args: {
  level: DifficultyLevel;
  paper: ReversePercentagePaper;
  templateId: string;
}): QuestionVariantSelectionMeta {
  return {
    level: args.level,

    templateId: args.templateId,

    marks: {
      totalMarks: 3,
      cMarks: 3,
      aMarks: 0,
      reasoningMarks: 0,
    },

    standardProfile: "C",

    paperSuitability: args.paper,

    calculatorStatus:
      selectionCalculatorStatusForPaper(args.paper),
  };
}

function buildGeneratedReversePercentageQuestion(
  context: GeneratorContext
): GeneratedQuestionData {
  const difficulty =
    normaliseDifficulty(context.difficulty);

  const paper =
    normalisePaper(context);

  const generated =
    generateN5MathsReversePercentageQuestion({
      paper,
      difficulty,
    });

      const workedAnswers =
    generateN5MathsReversePercentageWorkedAnswers(
      generated
    );

  const templateId = [
    "source-catalogue-reverse-percentage",
    paper.toLowerCase(),
    `level-${difficulty}`,
    generated.familyId,
    generated.wordingProfile.patternId,
    generated.wordingProfile.contextId,
  ].join("-");

  return {
    prompt: generated.questionText,

    answer: generated.answerText,

    marks: 3,

    questionCode: generated.familyId,

    promptParts: [
      textPart(generated.questionText),
    ],

    answerParts: [
      textPart(generated.answerText),
    ],

    workedAnswers,

    markBreakdown: {
      totalMarks: 3,
      cMarks: 3,
      aMarks: 0,
      reasoningMarks: 0,
    },

    classification: {
      standard: "C",

      calculatorStatus:
        classificationCalculatorStatusForPaper(paper),

      structureType: "ContextualProblem",

      isReasoning: false,

      paperSuitability: paper,
    },

    sourceSkillCode: "NQ_N5_NUM_N04",

    sourceConceptCode: "N4.1",

    sourceConceptLabel: "Reverse percentage",

    templateId,

    topicMarkBreakdown: {
      NUM: 3,
      ALG: 0,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },

    selectionMeta: buildSelectionMeta({
      level: context.difficulty,
      paper,
      templateId,
    }),
  };
}

function levelSelectionEntries(
  level: DifficultyLevel
): QuestionVariantSelectionMeta[] {
  return [
    {
      level,

      templateId:
        `source-catalogue-reverse-percentage-p1-level-${level}`,

      marks: {
        totalMarks: 3,
        cMarks: 3,
        aMarks: 0,
        reasoningMarks: 0,
      },

      standardProfile: "C",

      paperSuitability: "P1",

      calculatorStatus: "NonCalculatorOnly",
    },

    {
      level,

      templateId:
        `source-catalogue-reverse-percentage-p2-level-${level}`,

      marks: {
        totalMarks: 3,
        cMarks: 3,
        aMarks: 0,
        reasoningMarks: 0,
      },

      standardProfile: "C",

      paperSuitability: "P2",

      calculatorStatus: "CalculatorRequired",
    },
  ];
}

export const ReversePercentagesConceptModule:
  ConceptGeneratorModule = {
    metadata: {
      moduleId:
        "NQ_N5_NUM_N04_1_REVERSE_PERCENTAGES",

      domain: "NUM",

      skillCode: "NQ_N5_NUM_N04",

      conceptCode: "N4.1",

      conceptLabel: "Reverse percentage",

      difficultyProfile: {
        availableLevels: [1, 2, 3],

        defaultLevel: 2,

        levelDescriptions: {
          1:
            "Straightforward reverse percentage with friendly values.",

          2:
            "Typical National 5 reverse-percentage problem.",

          3:
            "More demanding National 5 reverse-percentage problem.",
        },
      },

      capabilities: {
        standardCoverage: ["C"],

        canGenerateReasoning: false,

        calculatorStatus: "Either",

        paperSuitability: "BOTH",

        typicalStructureTypes: [
          "ContextualProblem",
        ],
      },

      levelSelectionProfile: {
        1: levelSelectionEntries(1),
        2: levelSelectionEntries(2),
        3: levelSelectionEntries(3),
      },
    },

    canHandle(code: string) {
      return code === "N4.1";
    },

    generate:
      buildGeneratedReversePercentageQuestion,
  };

export default ReversePercentagesConceptModule;