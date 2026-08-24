// app/question-bank/skills/01-numerical/NQ_N5_NUM_N05_1_Fractions.ts

import type { PaperPart } from "@/shared-types/PaperParts";
import type { DifficultyLevel } from "@/shared-types/AssessmentTypes_TEMP";
import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";
import type { QuestionVariantSelectionMeta } from "@/shared-types/QuestionSelectionTypes";

import {
  generateN5MathsFractionSamples,
  type GeneratedFractionQuestion,
} from "@/course-data/question-generators/fractions/N5MathsFractionGenerator";

type FractionOperationMode =
  | "AUTO"
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "BRACKETED";

const SIMPLEST_FORM_INSTRUCTION = "Give your answer in its simplest form.";

function textPart(value: string): PaperPart {
  return { kind: "text", value };
}

function mathPart(latex: string): PaperPart {
  return { kind: "math", latex };
}

function normaliseDifficulty(input: DifficultyLevel): DifficultyLevel {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  if (input === 4) return 4;
  return 5;
}

function modeFromConceptCode(conceptCode: string): FractionOperationMode {
  if (conceptCode === "N5.1.1") return "ADD";
  if (conceptCode === "N5.1.2") return "SUBTRACT";
  if (conceptCode === "N5.1.3") return "MULTIPLY";
  if (conceptCode === "N5.1.4") return "DIVIDE";
  if (conceptCode === "N5.1.5") return "BRACKETED";

  return "AUTO";
}

function conceptLabelFromMode(mode: FractionOperationMode): string {
  if (mode === "ADD") return "Fractions add";
  if (mode === "SUBTRACT") return "Fractions subtract";
  if (mode === "MULTIPLY") return "Fractions multiply";
  if (mode === "DIVIDE") return "Fractions divide";
  if (mode === "BRACKETED") return "Bracketed fraction operations";

  return "Fraction operations";
}

function expressionToLatex(expression: string): string {
  const cleaned = expression
    .replace(/\.$/, "")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = cleaned
    .split(/(\d+\s+\d+\/\d+|\d+\/\d+|[()+−+\-×÷])/g)
    .map((token) => token.trim())
    .filter(Boolean);

  return tokens
    .map((token) => {
      const mixedMatch = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);

      if (mixedMatch) {
        const [, whole, numerator, denominator] = mixedMatch;
        return `${whole}\\,\\dfrac{${numerator}}{${denominator}}`;
      }

      const fractionMatch = token.match(/^(\d+)\/(\d+)$/);

      if (fractionMatch) {
        const [, numerator, denominator] = fractionMatch;
        return `\\dfrac{${numerator}}{${denominator}}`;
      }

      if (token === "×") return "\\times";
      if (token === "÷") return "\\div";
      if (token === "−") return "-";
      if (token === "-") return "-";
      if (token === "+") return "+";
      if (token === "(") return "\\left(";
      if (token === ")") return "\\right)";

      return token;
    })
    .join(" ");
}

function buildPromptParts(generated: GeneratedFractionQuestion): PaperPart[] {
  const hasSimplestFormInstruction =
    generated.questionText.includes(SIMPLEST_FORM_INSTRUCTION);

  const withoutInstruction = hasSimplestFormInstruction
    ? generated.questionText.replace(SIMPLEST_FORM_INSTRUCTION, "").trim()
    : generated.questionText.trim();

  const expressionText = withoutInstruction
    .replace(/^Evaluate\s+/i, "")
    .replace(/\.$/, "")
    .trim();

  const parts: PaperPart[] = [
    textPart("Evaluate "),
    mathPart(expressionToLatex(expressionText)),
    textPart("."),
  ];

  if (hasSimplestFormInstruction) {
    parts.push(textPart(`\n${SIMPLEST_FORM_INSTRUCTION}`));
  }

  return parts;
}

function buildAnswerParts(generated: GeneratedFractionQuestion): PaperPart[] {
  return [mathPart(expressionToLatex(generated.answerText))];
}

function operationMatchesMode(
  generated: GeneratedFractionQuestion,
  mode: FractionOperationMode
): boolean {
  if (mode === "AUTO") return true;

  if (mode === "BRACKETED") {
    return generated.operationType === "BRACKETED_SUM_AND_MULTIPLY";
  }

  return generated.operationType === mode;
}

function generateMatchingFractionQuestion(
  mode: FractionOperationMode
): GeneratedFractionQuestion {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const generated = generateN5MathsFractionSamples(1)[0];

    if (operationMatchesMode(generated, mode)) {
      return generated;
    }
  }

  return generateN5MathsFractionSamples(1)[0];
}

function buildSelectionMeta(args: {
  level: DifficultyLevel;
  templateId: string;
}): QuestionVariantSelectionMeta {
  return {
    level: args.level,
    templateId: args.templateId,
    marks: {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    },
    standardProfile: "C",
    paperSuitability: "P1",
    calculatorStatus: "NonCalculatorOnly",
  };
}

function buildGeneratedFractionQuestion(
  context: GeneratorContext
): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const conceptCode = context.concept?.code ?? "N5.1";
  const mode = modeFromConceptCode(conceptCode);
  const generated = generateMatchingFractionQuestion(mode);
  const label = conceptLabelFromMode(mode);

  const templateId = [
    "source-catalogue-fractions",
    mode.toLowerCase(),
    `level-${level}`,
    generated.familyId,
    generated.operationType,
  ].join("-");

  return {
    prompt: generated.questionText,
    answer: generated.answerText,
    marks: 2,
    questionCode: generated.familyId,

    promptParts: buildPromptParts(generated),
    answerParts: buildAnswerParts(generated),

    markBreakdown: {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    },

    classification: {
      standard: "C",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "SingleStep",
      isReasoning: false,
      paperSuitability: "P1",
    },

    sourceSkillCode: "NQ_N5_NUM_N05",
    sourceConceptCode: conceptCode,
    sourceConceptLabel: label,
    templateId,

    topicMarkBreakdown: {
      NUM: 2,
      ALG: 0,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },

    selectionMeta: buildSelectionMeta({
      level,
      templateId,
    }),
  };
}

function levelSelectionEntry(level: DifficultyLevel): QuestionVariantSelectionMeta {
  return {
    level,
    templateId: `source-catalogue-fractions-level-${level}`,
    marks: {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    },
    standardProfile: "C",
    paperSuitability: "P1",
    calculatorStatus: "NonCalculatorOnly",
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
      availableLevels: [1, 2, 3, 4, 5],
      defaultLevel: 3,
    },
    capabilities: {
      standardCoverage: ["C"],
      canGenerateReasoning: false,
      calculatorStatus: "NonCalculatorOnly",
      paperSuitability: "P1",
      typicalStructureTypes: ["SingleStep"],
    },
    levelSelectionProfile: {
      1: [levelSelectionEntry(1)],
      2: [levelSelectionEntry(2)],
      3: [levelSelectionEntry(3)],
      4: [levelSelectionEntry(4)],
      5: [levelSelectionEntry(5)],
    },
  },

  canHandle(code: string) {
    return (
      code === "N5.1" ||
      code === "N5.1.1" ||
      code === "N5.1.2" ||
      code === "N5.1.3" ||
      code === "N5.1.4" ||
      code === "N5.1.5"
    );
  },

  generate: buildGeneratedFractionQuestion,
};

export default FractionsConceptModule;