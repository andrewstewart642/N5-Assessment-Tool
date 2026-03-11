// app/question-bank/skills/01-numerical/NQ_N5_NUM_N01_2_Rationalise.ts

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
  return 3;
}

function buildNumerator(level: DifficultyLevel): number {
  if (level === 1) return chooseOne([1, 2, 3]);
  if (level === 2) return chooseOne([1, 2, 3, 4, 5]);
  return chooseOne([2, 3, 4, 5, 6, 7]);
}

function buildRadicand(level: DifficultyLevel): number {
  if (level === 1) return chooseOne([2, 3, 5]);
  if (level === 2) return chooseOne([2, 3, 5, 6, 7, 10]);
  return chooseOne([2, 3, 5, 6, 7, 10, 11, 13]);
}

function buildMarks(): {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  reasoningMarks: number;
} {
  return {
    totalMarks: 3,
    cMarks: 2,
    aMarks: 1,
    reasoningMarks: 0,
  };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const numerator = buildNumerator(level);
  const radicand = buildRadicand(level);

  const answerLatex =
    numerator === 1
      ? `\\dfrac{\\sqrt{${radicand}}}{${radicand}}`
      : `\\dfrac{${numerator}\\sqrt{${radicand}}}{${radicand}}`;

  const answerPlain =
    numerator === 1
      ? `√${radicand}/${radicand}`
      : `${numerator}√${radicand}/${radicand}`;

  const markBreakdown = buildMarks();

  return {
    prompt: `Write ${numerator}/√${radicand} with a rational denominator.`,
    answer: answerPlain,
    marks: markBreakdown.totalMarks,

    questionCode: "NQ_N5_NUM_N01_2_RATIONALISE",

    promptParts: [
      textPart("Write "),
      mathPart(`\\dfrac{${numerator}}{\\sqrt{${radicand}}}`),
      textPart(" with a rational denominator."),
    ],

    answerParts: [mathPart(answerLatex)],

    markBreakdown,
    classification: {
      standard: "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },

    sourceSkillCode: "NQ_N5_NUM_N01",
    sourceConceptCode: "N1.2",
    sourceConceptLabel: "Rationalise the denominator of a surd",
    templateId: `rationalise-l${level}`,
  };
}

export const RationaliseConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N01_2_RATIONALISE",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N01",
    conceptCode: "N1.2",
    conceptLabel: "Rationalise the denominator of a surd",

    difficultyProfile: {
      availableLevels: [1, 2, 3],
      defaultLevel: 2,
      levelDescriptions: {
        1: "Simple rationalising with a small numerator and straightforward surd denominator.",
        2: "Typical SQA-style rationalising question.",
        3: "Less friendly numerator/radicand combinations while staying within course expectations.",
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
    return code === "N1.2";
  },

  generate: generateQuestion,
};

export default RationaliseConceptModule;