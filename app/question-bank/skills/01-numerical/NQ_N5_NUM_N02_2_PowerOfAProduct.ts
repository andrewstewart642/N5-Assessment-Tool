// app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_2_PowerOfAProduct.ts

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
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function chooseOne<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  return 4;
}

function buildVariables(level: DifficultyLevel) {
  const letters = ["a", "b", "x", "y", "m", "n"];

  if (level <= 2) {
    const first = chooseOne(letters);
    let second = chooseOne(letters);
    while (second === first) {
      second = chooseOne(letters);
    }
    return { first, second };
  }

  const first = chooseOne(letters);
  let second = chooseOne(letters);
  while (second === first) {
    second = chooseOne(letters);
  }

  return { first, second };
}

function buildPower(level: DifficultyLevel): number {
  if (level === 1) return chooseOne([2, 3]);
  if (level === 2) return chooseOne([2, 3, 4]);
  if (level === 3) return chooseOne([2, 3, 4, 5]);
  return chooseOne([3, 4, 5]);
}

function buildCoefficient(level: DifficultyLevel): number {
  if (level <= 2) return 1;
  return chooseOne([1, 2, 3]);
}

function buildMarks(level: DifficultyLevel) {
  if (level === 1) {
    return {
      totalMarks: 1,
      cMarks: 1,
      aMarks: 0,
      reasoningMarks: 0,
    };
  }

  if (level === 2) {
    return {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    };
  }

  return {
    totalMarks: 2,
    cMarks: 1,
    aMarks: 1,
    reasoningMarks: 0,
  };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const { first, second } = buildVariables(level);
  const power = buildPower(level);
  const coefficient = buildCoefficient(level);

  const promptLatex =
    coefficient === 1
      ? `(${first}${second})^{${power}}`
      : `(${coefficient}${first}${second})^{${power}}`;

  const answerLatex =
    coefficient === 1
      ? `${first}^{${power}}${second}^{${power}}`
      : `${coefficient ** power}${first}^{${power}}${second}^{${power}}`;

  const promptPlain =
    coefficient === 1
      ? `(${first}${second})^${power}`
      : `(${coefficient}${first}${second})^${power}`;

  const answerPlain =
    coefficient === 1
      ? `${first}^${power}${second}^${power}`
      : `${coefficient ** power}${first}^${power}${second}^${power}`;

  const markBreakdown = buildMarks(level);

  return {
    prompt: `Expand ${promptPlain} using the laws of indices.`,
    answer: answerPlain,
    marks: markBreakdown.totalMarks,

    questionCode: "NQ_N5_NUM_N02_2_POWER_OF_A_PRODUCT",

    promptParts: [
      textPart("Expand "),
      mathPart(promptLatex),
      textPart(" using the laws of indices."),
    ],

    answerParts: [mathPart(answerLatex)],

    markBreakdown,
    classification: {
      standard: level <= 2 ? "C" : "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },

    sourceSkillCode: "NQ_N5_NUM_N02",
    sourceConceptCode: "N2.2",
    sourceConceptLabel: "Power of a product",
    templateId: `power-of-a-product-l${level}`,
  };
}

export const PowerOfAProductConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N02_2_POWER_OF_A_PRODUCT",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N02",
    conceptCode: "N2.2",
    conceptLabel: "Power of a product",

    difficultyProfile: {
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
      levelDescriptions: {
        1: "Simple expansion of a product raised to a power.",
        2: "Typical SQA-style power of a product question.",
        3: "Includes a coefficient inside the bracket.",
        4: "Less friendly but still in-course expressions.",
      },
    },

    capabilities: {
      standardCoverage: ["C", "Mixed"],
      canGenerateReasoning: false,
      calculatorStatus: "NonCalculatorOnly",
      paperSuitability: "P1",
      typicalStructureTypes: ["ExpressionSimplification"],
    },
  },

  canHandle(code: string) {
    return code === "N2.2";
  },

  generate: generateQuestion,
};

export default PowerOfAProductConceptModule;