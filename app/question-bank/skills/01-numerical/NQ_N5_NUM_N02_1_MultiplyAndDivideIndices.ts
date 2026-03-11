// app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_1_MultiplyAndDivideIndices.ts

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

function formatPower(variable: string, exponent: number): string {
  if (exponent === 1) return variable;
  if (exponent === 0) return "1";
  return `${variable}^${exponent}`;
}

function formatPowerLatex(variable: string, exponent: number): string {
  if (exponent === 1) return variable;
  if (exponent === 0) return "1";
  return `${variable}^{${exponent}}`;
}

function buildExponents(level: DifficultyLevel, isDivision: boolean) {
  if (level === 1) {
    const m = randomInt(2, 6);
    const n = randomInt(2, 6);
    return { m, n };
  }

  if (level === 2) {
    if (isDivision) {
      const n = randomInt(2, 6);
      const result = randomInt(1, 5);
      const m = n + result;
      return { m, n };
    }

    return {
      m: randomInt(2, 7),
      n: randomInt(2, 7),
    };
  }

  if (level === 3) {
    return {
      m: randomInt(-3, 8),
      n: randomInt(-3, 8),
    };
  }

  return {
    m: randomInt(-5, 10),
    n: randomInt(-5, 10),
  };
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
  const variable = chooseOne(["a", "b", "x", "y", "m"]);
  const isDivision = Math.random() < 0.5;

  let { m, n } = buildExponents(level, isDivision);

  if (isDivision && m === n) {
    m += 1;
  }

  const resultExponent = isDivision ? m - n : m + n;
  const markBreakdown = buildMarks(level);

  const promptLatex = isDivision
    ? `${variable}^{${m}} \\div ${variable}^{${n}}`
    : `${variable}^{${m}} \\times ${variable}^{${n}}`;

  const promptPlain = isDivision
    ? `${variable}^${m} ÷ ${variable}^${n}`
    : `${variable}^${m} × ${variable}^${n}`;

  return {
    prompt: `Simplify ${promptPlain}.`,
    answer: formatPower(variable, resultExponent),
    marks: markBreakdown.totalMarks,

    questionCode: "NQ_N5_NUM_N02_1_MULTIPLY_AND_DIVIDE_INDICES",

    promptParts: [textPart("Simplify "), mathPart(promptLatex), textPart(".")],
    answerParts: [mathPart(formatPowerLatex(variable, resultExponent))],

    markBreakdown,
    classification: {
      standard: level <= 2 ? "C" : "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },

    sourceSkillCode: "NQ_N5_NUM_N02",
    sourceConceptCode: "N2.1",
    sourceConceptLabel: "Multiply and divide indices",
    templateId: `multiply-divide-indices-l${level}`,
  };
}

export const MultiplyDivideIndicesConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N02_1_MULTIPLY_AND_DIVIDE_INDICES",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N02",
    conceptCode: "N2.1",
    conceptLabel: "Multiply and divide indices",

    difficultyProfile: {
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
      levelDescriptions: {
        1: "Straightforward positive-index multiplication or division.",
        2: "Typical SQA-style multiply/divide indices questions.",
        3: "Includes less friendly exponents such as negatives.",
        4: "Most demanding within this concept while staying in-course.",
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
    return code === "N2.1";
  },

  generate: generateQuestion,
};

export default MultiplyDivideIndicesConceptModule;