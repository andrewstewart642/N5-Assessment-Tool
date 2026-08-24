// app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_5_ScientificNotation.ts

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

function chooseOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  return 4;
}

function buildMarks(level: DifficultyLevel) {
  if (level <= 2) {
    return { totalMarks: 3, cMarks: 3, aMarks: 0, reasoningMarks: 0 };
  }
  return { totalMarks: 3, cMarks: 2, aMarks: 1, reasoningMarks: 0 };
}

function scientificString(value: number) {
  const [mantissa, exponentRaw] = value.toExponential(2).split("e");
  return {
    mantissa,
    exponent: Number(exponentRaw),
  };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);

  const a = chooseOne([1.2, 1.5, 2.4, 3.6, 4.8, 6.2, 7.5, 8.4]);
  const b = chooseOne([1.1, 1.4, 2.5, 3.2, 4.6, 5.5]);
  const powerA = randomInt(2, 6);
  const powerB = randomInt(2, 6);

  const useDivision = level >= 3 ? Math.random() < 0.5 : false;

  const value = useDivision
    ? (a * Math.pow(10, powerA)) / (b * Math.pow(10, powerB))
    : a * Math.pow(10, powerA) * (b * Math.pow(10, powerB));

  const sci = scientificString(value);
  const markBreakdown = buildMarks(level);

  const promptLatex = useDivision
    ? `(${a} \\times 10^{${powerA}}) \\div (${b} \\times 10^{${powerB}})`
    : `(${a} \\times 10^{${powerA}}) \\times (${b} \\times 10^{${powerB}})`;

  const promptPlain = useDivision
    ? `(${a} × 10^${powerA}) ÷ (${b} × 10^${powerB})`
    : `(${a} × 10^${powerA}) × (${b} × 10^${powerB})`;

  return {
    prompt: `Calculate ${promptPlain}. Give your answer in scientific notation.`,
    answer: `${sci.mantissa} × 10^${sci.exponent}`,
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N02_5_SCIENTIFIC_NOTATION",
    promptParts: [
      textPart("Calculate "),
      mathPart(promptLatex),
      textPart(". Give your answer in scientific notation."),
    ],
    answerParts: [mathPart(`${sci.mantissa} \\times 10^{${sci.exponent}}`)],
    markBreakdown,
    classification: {
      standard: level <= 2 ? "C" : "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N02",
    sourceConceptCode: "N2.5",
    sourceConceptLabel: "Scientific notation",
    templateId: `scientific-notation-l${level}`,
  };
}

export const ScientificNotationConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N02_5_SCIENTIFIC_NOTATION",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N02",
    conceptCode: "N2.5",
    conceptLabel: "Scientific notation",
    difficultyProfile: {
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
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
    return code === "N2.5";
  },

  generate: generateQuestion,
};

export default ScientificNotationConceptModule;