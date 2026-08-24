// app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_4_FractionalIndices.ts

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

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  return 4;
}

function buildMarks(level: DifficultyLevel) {
  if (level === 1) {
    return { totalMarks: 2, cMarks: 2, aMarks: 0, reasoningMarks: 0 };
  }
  if (level === 2) {
    return { totalMarks: 3, cMarks: 3, aMarks: 0, reasoningMarks: 0 };
  }
  return { totalMarks: 3, cMarks: 2, aMarks: 1, reasoningMarks: 0 };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);

  if (level <= 2) {
    const denominator = chooseOne([2, 3]);
    const numerator = denominator === 2 ? chooseOne([1, 3]) : chooseOne([1, 2, 4]);
    const base =
      denominator === 2
        ? chooseOne([4, 9, 16, 25, 36, 49])
        : chooseOne([8, 27, 64, 125]);
    const answer = Math.pow(base, numerator / denominator);
    const markBreakdown = buildMarks(level);

    return {
      prompt: `Evaluate ${base}^(${numerator}/${denominator}).`,
      answer: `${answer}`,
      marks: markBreakdown.totalMarks,
      questionCode: "NQ_N5_NUM_N02_4_FRACTIONAL_INDICES",
      promptParts: [
        textPart("Evaluate "),
        mathPart(`${base}^{\\frac{${numerator}}{${denominator}}}`),
        textPart("."),
      ],
      answerParts: [mathPart(`${answer}`)],
      markBreakdown,
      classification: {
        standard: "C",
        calculatorStatus: "NonCalculatorOnly",
        structureType: "ExpressionSimplification",
        isReasoning: false,
        paperSuitability: "P1",
      },
      sourceSkillCode: "NQ_N5_NUM_N02",
      sourceConceptCode: "N2.4",
      sourceConceptLabel: "Fractional indices",
      templateId: `fractional-indices-evaluate-l${level}`,
    };
  }

  const variable = chooseOne(["a", "x", "m"]);
  const denominator = chooseOne([2, 3]);
  const numerator = denominator === 2 ? chooseOne([1, 3]) : chooseOne([1, 2, 4]);
  const radicalLatex =
    numerator === 1
      ? `\\sqrt[${denominator}]{${variable}}`
      : `\\sqrt[${denominator}]{${variable}^{${numerator}}}`;
  const markBreakdown = buildMarks(level);

  return {
    prompt: `Write ${variable}^(${numerator}/${denominator}) in radical form.`,
    answer: radicalLatex,
    marks: markBreakdown.totalMarks,
    questionCode: "NQ_N5_NUM_N02_4_FRACTIONAL_INDICES",
    promptParts: [
      textPart("Write "),
      mathPart(`${variable}^{\\frac{${numerator}}{${denominator}}}`),
      textPart(" in radical form."),
    ],
    answerParts: [mathPart(radicalLatex)],
    markBreakdown,
    classification: {
      standard: "Mixed",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },
    sourceSkillCode: "NQ_N5_NUM_N02",
    sourceConceptCode: "N2.4",
    sourceConceptLabel: "Fractional indices",
    templateId: `fractional-indices-radical-l${level}`,
  };
}

export const FractionalIndicesConceptModule: ConceptGeneratorModule = {
  metadata: {
    moduleId: "NQ_N5_NUM_N02_4_FRACTIONAL_INDICES",
    domain: "NUM",
    skillCode: "NQ_N5_NUM_N02",
    conceptCode: "N2.4",
    conceptLabel: "Fractional indices",
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
    return code === "N2.4";
  },

  generate: generateQuestion,
};

export default FractionalIndicesConceptModule;