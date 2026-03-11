// app/question-bank/skills/01-numerical/NQ_N5_NUM_N03_1_SignificantFigures.ts

import type { PaperPart } from "@/shared-types/PaperParts";
import type { DifficultyLevel } from "@/shared-types/AssessmentTypes";
import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";

function textPart(value: string): PaperPart {
  return { kind: "text", value };
}

function mathPart(latex: string): PaperPart {
  return { kind: "math", latex };
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  return 3;
}

function buildMarks() {
  return { totalMarks: 1, cMarks: 1, aMarks: 0, reasoningMarks: 0 };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const sf = chooseOne([2, 3]);

  const value =
    level === 1
      ? randomInt(100, 9999)
      : level === 2
      ? Number(`${randomInt(10, 999)}.${randomInt(1, 999)}`)
      : Number(`${randomInt(100, 9999)}.${randomInt(10, 9999)}`);

  const rounded = Number(value.toPrecision(sf)).toString();
  const markBreakdown = buildMarks();

  return {
    prompt: `Round ${value} to ${sf} significant figures.`,
    answer: rounded,
    marks: 1,
    questionCode: "NQ_N5_NUM_N03_1_SIGNIFICANT_FIGURES",
    promptParts: [
      textPart("Round "),
      mathPart(`${value}`),
      textPart(` to ${sf} significant figures.`),
    ],
    answerParts: [mathPart(rounded)],
    markBreakdown,
    classification: {
      standard: "C",
      calculatorStatus: "Either",
      structureType: "SingleStep",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N03",
    sourceConceptCode: "N3.1",
    sourceConceptLabel: "Significant figures",
    templateId: `significant-figures-l${level}`,
  };
}

export const SignificantFiguresConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N03_1_SIGNIFICANT_FIGURES",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N03",
    conceptCode: "N3.1",
    conceptLabel: "Significant figures",
    difficultyProfile: {
      availableLevels: [1, 2, 3],
      defaultLevel: 2,
    },
    capabilities: {
      standardCoverage: ["C"],
      canGenerateReasoning: false,
      calculatorStatus: "Either",
      paperSuitability: "P1",
      typicalStructureTypes: ["SingleStep"],
    },
  },

  canHandle(code: string) {
    return code === "N3.1";
  },

  generate: generateQuestion,
};

export default SignificantFiguresConceptModule;