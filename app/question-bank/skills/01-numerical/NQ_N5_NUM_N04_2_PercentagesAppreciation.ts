// app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation.ts

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

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildMarks() {
  return { totalMarks: 3, cMarks: 3, aMarks: 0, reasoningMarks: 0 };
}

function generateQuestion(_: GeneratorContext): GeneratedQuestionData {
  const principal = randomInt(200, 3000);
  const rate = chooseOne([2, 3, 4, 5, 6, 8, 10]);
  const years = randomInt(2, 5);
  const value = principal * Math.pow(1 + rate / 100, years);
  const markBreakdown = buildMarks();

  return {
    prompt: `A value of £${principal} appreciates by ${rate}% each year for ${years} years. Calculate the final value.`,
    answer: `£${value.toFixed(2)}`,
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N04_2_PERCENTAGES_APPRECIATION",
    promptParts: [
      textPart(
        `A value of £${principal} appreciates by ${rate}% each year for ${years} years. Calculate the final value.`
      ),
    ],
    answerParts: [textPart(`£${value.toFixed(2)}`)],
    markBreakdown,
    classification: {
      standard: "C",
      calculatorStatus: "Either",
      structureType: "ContextualProblem",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N04",
    sourceConceptCode: "N4.2",
    sourceConceptLabel: "Appreciation",
    templateId: `percentages-appreciation`,
  };
}

export const AppreciationConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N04_2_PERCENTAGES_APPRECIATION",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N04",
    conceptCode: "N4.2",
    conceptLabel: "Appreciation",
    difficultyProfile: {
      availableLevels: [1, 2, 3],
      defaultLevel: 2,
    },
    capabilities: {
      standardCoverage: ["C"],
      canGenerateReasoning: false,
      calculatorStatus: "Either",
      paperSuitability: "P1",
      typicalStructureTypes: ["ContextualProblem"],
    },
  },

  canHandle(code: string) {
    return code === "N4.2";
  },

  generate: generateQuestion,
};

export default AppreciationConceptModule;