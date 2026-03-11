// app/question-bank/skills/01-numerical/NQ_N5_NUM_N05_1_Fractions.ts

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

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function reduceFraction(n: number, d: number) {
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return {
    numerator: (sign * n) / g,
    denominator: (sign * d) / g,
  };
}

function formatFractionPlain(n: number, d: number): string {
  const r = reduceFraction(n, d);
  if (r.denominator === 1) return `${r.numerator}`;
  return `${r.numerator}/${r.denominator}`;
}

function formatFractionLatex(n: number, d: number): string {
  const r = reduceFraction(n, d);
  if (r.denominator === 1) return `${r.numerator}`;
  return `\\dfrac{${r.numerator}}{${r.denominator}}`;
}

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  return 4;
}

function buildMarks(level: DifficultyLevel) {
  if (level <= 2) {
    return { totalMarks: 2, cMarks: 2, aMarks: 0, reasoningMarks: 0 };
  }
  return { totalMarks: 2, cMarks: 1, aMarks: 1, reasoningMarks: 0 };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const denominatorCap = level <= 2 ? 12 : 20;

  const a = randomInt(1, denominatorCap - 1);
  const b = randomInt(2, denominatorCap);
  const c = randomInt(1, denominatorCap - 1);
  const d = randomInt(2, denominatorCap);

  const op = chooseOne(["+", "-", "×", "÷"] as const);
  const markBreakdown = buildMarks(level);

  if (op === "+") {
    const common = lcm(b, d);
    const resultNum = (a * common) / b + (c * common) / d;
    return {
      prompt: `Calculate ${a}/${b} + ${c}/${d}.`,
      answer: formatFractionPlain(resultNum, common),
      marks: markBreakdown.totalMarks,
      questionCode: "NQ_N5_NUM_N05_1_FRACTIONS",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(resultNum, common))],
      markBreakdown,
      classification: {
        standard: level <= 2 ? "C" : "Mixed",
        calculatorStatus: "NonCalculatorOnly",
        structureType: "SingleStep",
        isReasoning: false,
        paperSuitability: "P1",
      },
      sourceSkillCode: "NQ_N5_NUM_N05",
      sourceConceptCode: "N5.1",
      sourceConceptLabel: "Fraction operations",
      templateId: `fractions-add-l${level}`,
    };
  }

  if (op === "-") {
    const common = lcm(b, d);
    const resultNum = (a * common) / b - (c * common) / d;
    return {
      prompt: `Calculate ${a}/${b} - ${c}/${d}.`,
      answer: formatFractionPlain(resultNum, common),
      marks: markBreakdown.totalMarks,
      questionCode: "NQ_N5_NUM_N05_1_FRACTIONS",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} - \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(resultNum, common))],
      markBreakdown,
      classification: {
        standard: level <= 2 ? "C" : "Mixed",
        calculatorStatus: "NonCalculatorOnly",
        structureType: "SingleStep",
        isReasoning: false,
        paperSuitability: "P1",
      },
      sourceSkillCode: "NQ_N5_NUM_N05",
      sourceConceptCode: "N5.1",
      sourceConceptLabel: "Fraction operations",
      templateId: `fractions-subtract-l${level}`,
    };
  }

  if (op === "×") {
    return {
      prompt: `Calculate ${a}/${b} × ${c}/${d}.`,
      answer: formatFractionPlain(a * c, b * d),
      marks: markBreakdown.totalMarks,
      questionCode: "NQ_N5_NUM_N05_1_FRACTIONS",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(a * c, b * d))],
      markBreakdown,
      classification: {
        standard: level <= 2 ? "C" : "Mixed",
        calculatorStatus: "NonCalculatorOnly",
        structureType: "SingleStep",
        isReasoning: false,
        paperSuitability: "P1",
      },
      sourceSkillCode: "NQ_N5_NUM_N05",
      sourceConceptCode: "N5.1",
      sourceConceptLabel: "Fraction operations",
      templateId: `fractions-multiply-l${level}`,
    };
  }

  return {
    prompt: `Calculate ${a}/${b} ÷ ${c}/${d}.`,
    answer: formatFractionPlain(a * d, b * c),
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N05_1_FRACTIONS",
    promptParts: [
      textPart("Calculate "),
      mathPart(`\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}}`),
      textPart("."),
    ],
    answerParts: [mathPart(formatFractionLatex(a * d, b * c))],
    markBreakdown,
    classification: {
      standard: level <= 2 ? "C" : "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "SingleStep",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N05",
    sourceConceptCode: "N5.1",
    sourceConceptLabel: "Fraction operations",
    templateId: `fractions-divide-l${level}`,
  };
}

export const FractionsConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N05_1_FRACTIONS",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N05",
    conceptCode: "N5.1",
    conceptLabel: "Fraction operations",
    difficultyProfile: {
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
    capabilities: {
      standardCoverage: ["C", "Mixed"],
      canGenerateReasoning: false,
      calculatorStatus: "NonCalculatorOnly",
      paperSuitability: "P1",
      typicalStructureTypes: ["SingleStep"],
    },
  },

  canHandle(code: string) {
    return code === "N5.1";
  },

  generate: generateQuestion,
};

export default FractionsConceptModule;