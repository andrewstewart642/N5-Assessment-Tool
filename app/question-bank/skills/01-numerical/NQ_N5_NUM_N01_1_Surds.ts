// question-bank/skills/01-numerical/NQ_N5_NUM_N01.1_Surds.ts

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

function nonSquarePartFromRoot(radicand: number) {
  let outside = 1;
  let inside = radicand;

  for (let i = 2; i * i <= inside; i++) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= i * i;
    }
  }

  return { outside, inside };
}

function simplifySurd(radicand: number) {
  const { outside, inside } = nonSquarePartFromRoot(radicand);

  if (inside === 1) return `${outside}`;
  if (outside === 1) return `√${inside}`;

  return `${outside}√${inside}`;
}

function simplifySurdLatex(radicand: number) {
  const { outside, inside } = nonSquarePartFromRoot(radicand);

  if (inside === 1) return `${outside}`;
  if (outside === 1) return `\\sqrt{${inside}}`;

  return `${outside}\\sqrt{${inside}}`;
}

function generate(context: GeneratorContext): GeneratedQuestionData {
  const difficulty = context.difficulty <= 3 ? context.difficulty : 3;

  const squares = [4, 9, 16, 25];
  const inside = [2, 3, 5, 6, 7, 10];

  const square = chooseOne(squares);
  const nonSquare = chooseOne(inside);

  const radicand = square * nonSquare;

  return {
    prompt: `Simplify √${radicand}.`,
    answer: simplifySurd(radicand),
    marks: difficulty >= 2 ? 2 : 1,

    questionCode: "NQ_N5_NUM_N01.1_SURDS",

    promptParts: [
      textPart("Simplify "),
      mathPart(`\\sqrt{${radicand}}`),
      textPart("."),
    ],

    answerParts: [mathPart(simplifySurdLatex(radicand))],
  };
}

export const SurdsConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N01.1_SURDS",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N01",
    conceptCode: "N1.1",
    conceptLabel: "Simplify surds",

    difficultyProfile: {
      availableLevels: [1, 2, 3],
      defaultLevel: 2,
    },

    capabilities: {
      standardCoverage: ["C"],
      canGenerateReasoning: false,
      calculatorStatus: "NonCalculatorOnly",
      paperSuitability: "P1",
      typicalStructureTypes: ["ExpressionSimplification"],
    },
  },

  canHandle(code: string) {
    return code === "N1.1";
  },

  generate,
};

export default SurdsConceptModule;