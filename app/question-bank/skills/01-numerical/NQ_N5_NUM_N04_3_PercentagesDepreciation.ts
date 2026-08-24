// app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_3_PercentagesDepreciation.ts

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
  const principal = randomInt(500, 5000);
  const rate = chooseOne([5, 8, 10, 12, 15, 20]);
  const years = randomInt(2, 5);
  const value = principal * Math.pow(1 - rate / 100, years);
  const markBreakdown = buildMarks();

  return {
    prompt: `A machine worth £${principal} depreciates by ${rate}% each year for ${years} years. Calculate its value after ${years} years.`,
    answer: `£${value.toFixed(2)}`,
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N04_3_PERCENTAGES_DEPRECIATION",
    promptParts: [
      textPart(
        `A machine worth £${principal} depreciates by ${rate}% each year for ${years} years. Calculate its value after ${years} years.`
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
    sourceConceptCode: "N4.3",
    sourceConceptLabel: "Depreciation",
    templateId: `percentages-depreciation`,
  };
}

export const DepreciationConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N04_3_PERCENTAGES_DEPRECIATION",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N04",
    conceptCode: "N4.3",
    conceptLabel: "Depreciation",
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
    return code === "N4.3";
  },

  generate: generateQuestion,
};

export default DepreciationConceptModule;