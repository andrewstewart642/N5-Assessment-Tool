// app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_3_PowerToAPower.ts

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

function buildVariable(): string {
  return chooseOne(["a", "b", "x", "y", "m", "n"]);
}

function buildPowers(level: DifficultyLevel): { inner: number; outer: number } {
  if (level === 1) {
    return {
      inner: chooseOne([2, 3, 4]),
      outer: chooseOne([2, 3]),
    };
  }

  if (level === 2) {
    return {
      inner: chooseOne([2, 3, 4, 5]),
      outer: chooseOne([2, 3, 4]),
    };
  }

  if (level === 3) {
    return {
      inner: chooseOne([-3, -2, 2, 3, 4, 5]),
      outer: chooseOne([2, 3, 4]),
    };
  }

  return {
    inner: chooseOne([-4, -3, -2, 2, 3, 4, 5, 6]),
    outer: chooseOne([2, 3, 4, 5]),
  };
}

function formatPowerPlain(variable: string, exponent: number): string {
  if (exponent === 0) return "1";
  if (exponent === 1) return variable;
  return `${variable}^${exponent}`;
}

function formatPowerLatex(variable: string, exponent: number): string {
  if (exponent === 0) return "1";
  if (exponent === 1) return variable;
  return `${variable}^{${exponent}}`;
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
  const variable = buildVariable();
  const { inner, outer } = buildPowers(level);
  const resultExponent = inner * outer;
  const markBreakdown = buildMarks(level);

  const promptPlain = `(${variable}^${inner})^${outer}`;
  const promptLatex = `(${variable}^{${inner}})^{${outer}}`;

  return {
    prompt: `Simplify ${promptPlain}.`,
    answer: formatPowerPlain(variable, resultExponent),
    marks: markBreakdown.totalMarks,

    questionCode: "NQ_N5_NUM_N02_3_POWER_TO_A_POWER",

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
    sourceConceptCode: "N2.3",
    sourceConceptLabel: "Power to a power",
    templateId: `power-to-a-power-l${level}`,
  };
}

export const PowerToAPowerConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N02_3_POWER_TO_A_POWER",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N02",
    conceptCode: "N2.3",
    conceptLabel: "Power to a power",

    difficultyProfile: {
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
      levelDescriptions: {
        1: "Straightforward positive powers.",
        2: "Typical SQA-style power to a power question.",
        3: "Includes less friendly inner powers such as negatives.",
        4: "Most demanding in-course variants for this concept.",
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
    return code === "N2.3";
  },

  generate: generateQuestion,
};

export default PowerToAPowerConceptModule;