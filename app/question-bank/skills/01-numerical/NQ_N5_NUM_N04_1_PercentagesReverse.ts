// app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_1_PercentagesReverse.ts

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

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  return 3;
}

function buildMarks(level: DifficultyLevel) {
  if (level === 1) return { totalMarks: 2, cMarks: 2, aMarks: 0, reasoningMarks: 0 };
  return { totalMarks: 3, cMarks: 2, aMarks: 1, reasoningMarks: 0 };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const original = randomInt(80, 400);
  const percent = chooseOne(level === 1 ? [10, 20] : [5, 10, 15, 20, 25]);
  const increase = Math.random() < 0.5;

  const finalAmount = increase
    ? original * (1 + percent / 100)
    : original * (1 - percent / 100);

  const finalText = Number.isInteger(finalAmount) ? `${finalAmount}` : finalAmount.toFixed(2);
  const markBreakdown = buildMarks(level);

  return {
    prompt: increase
      ? `After an increase of ${percent}%, a price is £${finalText}. Find the original price.`
      : `After a decrease of ${percent}%, a price is £${finalText}. Find the original price.`,
    answer: `£${original}`,
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N04_1_REVERSE_PERCENTAGES",
    promptParts: [
      textPart(
        increase
          ? `After an increase of ${percent}%, a price is £${finalText}. Find the original price.`
          : `After a decrease of ${percent}%, a price is £${finalText}. Find the original price.`
      ),
    ],
    answerParts: [textPart(`£${original}`)],
    markBreakdown,
    classification: {
      standard: level === 1 ? "C" : "Mixed",
      calculatorStatus: "Either",
      structureType: "ContextualProblem",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N04",
    sourceConceptCode: "N4.1",
    sourceConceptLabel: "Reverse percentage",
    templateId: `reverse-percentages-l${level}`,
  };
}

export const ReversePercentagesConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N04_1_REVERSE_PERCENTAGES",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N04",
    conceptCode: "N4.1",
    conceptLabel: "Reverse percentage",
    difficultyProfile: {
      availableLevels: [1, 2, 3],
      defaultLevel: 2,
    },
    capabilities: {
      standardCoverage: ["C", "Mixed"],
      canGenerateReasoning: false,
      calculatorStatus: "Either",
      paperSuitability: "P1",
      typicalStructureTypes: ["ContextualProblem"],
    },
  },

  canHandle(code: string) {
    return code === "N4.1";
  },

  generate: generateQuestion,
};

export default ReversePercentagesConceptModule;