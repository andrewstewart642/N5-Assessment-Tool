import type { Paper, Question } from "@/shared-types/AssessmentTypes_TEMP";
import type { PaperPart } from "@/shared-types/PaperParts";

import {
  generateN5MathsFractionSamples,
  type GeneratedFractionQuestion,
} from "@/course-data/question-generators/fractions/N5MathsFractionGenerator";

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
        return `${whole}\\,\\frac{${numerator}}{${denominator}}`;
      }

      const fractionMatch = token.match(/^(\d+)\/(\d+)$/);

      if (fractionMatch) {
        const [, numerator, denominator] = fractionMatch;
        return `\\frac{${numerator}}{${denominator}}`;
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
  const simplestFormInstruction = "Give your answer in its simplest form.";

  const hasSimplestFormInstruction =
    generated.questionText.includes(simplestFormInstruction);

  const withoutInstruction = hasSimplestFormInstruction
    ? generated.questionText.replace(simplestFormInstruction, "").trim()
    : generated.questionText.trim();

  const expressionText = withoutInstruction
    .replace(/^Evaluate\s+/i, "")
    .replace(/\.$/, "")
    .trim();

  const parts: PaperPart[] = [
    { kind: "text", value: "Evaluate " },
    { kind: "math", latex: expressionToLatex(expressionText) },
    { kind: "text", value: "." },
  ];

  if (hasSimplestFormInstruction) {
    parts.push({
      kind: "text",
      value: `\n${simplestFormInstruction}`,
    });
  }

  return parts;
}

function buildAnswerParts(generated: GeneratedFractionQuestion): PaperPart[] {
  return [
    {
      kind: "math",
      latex: expressionToLatex(generated.answerText),
    },
  ];
}

export function buildN5MathsFractionBuilderQuestion(args?: {
  paper?: Paper;
}): Question {
  const generated = generateN5MathsFractionSamples(1)[0];
  const now = Date.now();

  return {
    id: `generated-n5-fraction-${now}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    category: "Numerical Skills",

    courseId: "N5_MATH",

    skillId: "num-n5-fractions",
    skillCode: "N5",
    skillText: "Work with fractions",
    skillDomain: "NUM",

    primarySkillId: "num-n5-fractions",
    primaryConceptId: "num-n5-1",
    skillLinks: [
      {
        skillId: "num-n5-fractions",
        conceptId: "num-n5-1",
        role: "primary",
      },
    ],

    standardFilter: "C",
    concept: "Fraction operations",
    conceptId: "num-n5-1",
    difficulty: 3,
    targetMarks: 2,
    paper: args?.paper ?? "P1",
    createdAt: now,

    prompt: generated.questionText,
    answer: generated.answerText,

    promptParts: buildPromptParts(generated),
    answerParts: buildAnswerParts(generated),

    marks: 2,

    questionCode: generated.familyId,

    cMarks: 2,
    aMarks: 0,
    reasoningMarks: 0,
    isReasoning: false,

    calculatorStatus: "NonCalculatorOnly",

    structureType: "SingleStep",

    spacingBasePx: 72,

    topicMarkBreakdown: {
      NUM: 2,
      ALG: 0,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },

    selectionMeta: {
      source: "generated",
      familyId: generated.familyId,
      variantId: generated.id,
      notes: [
        generated.operationType,
        generated.sourceEvidenceSummary,
        generated.workingSummary,
      ],
    } as any,
  };
}