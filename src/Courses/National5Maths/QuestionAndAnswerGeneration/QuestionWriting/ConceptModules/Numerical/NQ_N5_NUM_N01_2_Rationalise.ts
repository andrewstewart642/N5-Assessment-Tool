// ======================================================================================
// NQ_N5_NUM_N01_2_RATIONALISE
//
// Concept: Rationalise the denominator of a surd
//
// ======================================================================================
// BEHAVIOURAL SPECIFICATION (Derived from SQA paper study + spreadsheet evidence)
//
// PAPER PLACEMENT
// • Paper 1 only
// • Non-calculator
//
// THINKING TYPE
// • Always operational
// • Never reasoning
//
// STANDARD / MARK PROFILE BY LEVEL
// • Level 1 = 2 total marks, 2C, 0A
// • Level 2 = 3 total marks, 3C, 0A
// • Level 3 = 3 total marks, 0C, 3A
// • Level 4 = 2 total marks, 0C, 2A
//
// STRUCTURE TYPE
// • Expression simplification
// • Rare embedded / integrated form via another skill (currently functional notation)
//
// TYPICAL QUESTION WORDING
// • "Write … with a rational denominator."
// • Often also includes "in its simplest form"
//
// CORE SKILL BEHAVIOUR
// • Remove surd from denominator
// • Simplify the resulting surd expression
// • Present the final answer neatly
//
// IMPORTANT OUTPUT RULES
// • The final answer must still contain a surd
// • The final answer must remain a fraction
// • Do NOT allow cases which simplify to a fully rational value
// • Do NOT allow cases which simplify to a surd over 1 or an integer multiple of a surd
//
// LEVEL DESIGN
// • Level 1 = direct rationalising only
// • Level 2 = rationalise + simplify whole-number coefficient only (still C-standard)
// • Level 3 = rationalise + genuine surd simplification (fully A-standard)
// • Level 4 = integrated / embedded A-standard version (functional notation)
//
// ======================================================================================

import type { PaperPart } from "@/shared-types/PaperParts";
import type { DifficultyLevel } from "@/shared-types/AssessmentTypes";
import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";
import type {
  QuestionVariantSelectionMeta,
  QuestionMarkProfile,
} from "@/shared-types/QuestionSelectionTypes";
import { deriveStandardProfile } from "@/shared-types/QuestionSelectionTypes";

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

function normaliseDifficulty(input: DifficultyLevel): 1 | 2 | 3 | 4 {
  if (input <= 1) return 1;
  if (input === 2) return 2;
  if (input === 3) return 3;
  return 4;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x === 0 ? 1 : x;
}

function extractSquareFactor(n: number): { outside: number; inside: number } {
  let bestOutside = 1;
  let bestInside = n;

  for (let i = 2; i * i <= n; i++) {
    const square = i * i;
    if (n % square === 0) {
      const inside = n / square;
      if (i > bestOutside) {
        bestOutside = i;
        bestInside = inside;
      }
    }
  }

  return { outside: bestOutside, inside: bestInside };
}

function simplifyStandaloneRationalisedForm(
  numeratorCoeff: number,
  numeratorSurd: number | undefined,
  denominatorRoot: number,
): {
  latex: string;
  plain: string;
  containsSurd: boolean;
  isFraction: boolean;
} {
  const combinedInside = numeratorSurd
    ? numeratorSurd * denominatorRoot
    : denominatorRoot;

  const { outside, inside } = extractSquareFactor(combinedInside);
  const rawNumeratorCoeff = numeratorCoeff * outside;
  const commonFactor = gcd(rawNumeratorCoeff, denominatorRoot);

  const finalNumeratorCoeff = rawNumeratorCoeff / commonFactor;
  const finalDenominator = denominatorRoot / commonFactor;
  const containsSurd = inside !== 1;
  const isFraction = finalDenominator > 1;

  if (inside === 1) {
    if (finalDenominator === 1) {
      return {
        latex: `${finalNumeratorCoeff}`,
        plain: `${finalNumeratorCoeff}`,
        containsSurd: false,
        isFraction: false,
      };
    }

    return {
      latex: `\\dfrac{${finalNumeratorCoeff}}{${finalDenominator}}`,
      plain: `${finalNumeratorCoeff}/${finalDenominator}`,
      containsSurd: false,
      isFraction: true,
    };
  }

  const numeratorLatex =
    finalNumeratorCoeff === 1
      ? `\\sqrt{${inside}}`
      : `${finalNumeratorCoeff}\\sqrt{${inside}}`;

  const numeratorPlain =
    finalNumeratorCoeff === 1
      ? `√${inside}`
      : `${finalNumeratorCoeff}√${inside}`;

  if (finalDenominator === 1) {
    return {
      latex: numeratorLatex,
      plain: numeratorPlain,
      containsSurd: true,
      isFraction: false,
    };
  }

  return {
    latex: `\\dfrac{${numeratorLatex}}{${finalDenominator}}`,
    plain: `${numeratorPlain}/${finalDenominator}`,
    containsSurd: true,
    isFraction: true,
  };
}

type StandaloneVariant = {
  mode: "standalone";
  numeratorCoeff: number;
  numeratorSurd?: number;
  denominatorRoot: number;
  templateId: string;
};

type FunctionalVariant = {
  mode: "functional";
  functionCoeff: number;
  inputValue: number;
  templateId: string;
};

type RationaliseVariant = StandaloneVariant | FunctionalVariant;

/**
 * Level 1
 * Direct rationalising only.
 * Output remains a surd fraction.
 */
const LEVEL_1_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 1, denominatorRoot: 2, templateId: "rationalise-l1-a" },
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 3, templateId: "rationalise-l1-b" },
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 5, templateId: "rationalise-l1-c" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 5, templateId: "rationalise-l1-d" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 7, templateId: "rationalise-l1-e" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 3, templateId: "rationalise-l1-f" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 7, templateId: "rationalise-l1-g" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 2, templateId: "rationalise-l1-h" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 6, templateId: "rationalise-l1-i" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 10, templateId: "rationalise-l1-j" },
];

/**
 * Level 2
 * Still C-standard.
 * Rationalise and simplify whole-number coefficient only.
 * Avoid genuine surd simplification in the final radical.
 */
const LEVEL_2_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 8, templateId: "rationalise-l2-a" },   // √2/2
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 12, templateId: "rationalise-l2-b" },  // √3/2
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 20, templateId: "rationalise-l2-c" },  // 2√5/5
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 20, templateId: "rationalise-l2-d" },  // √5/2
  { mode: "standalone", numeratorCoeff: 6, denominatorRoot: 12, templateId: "rationalise-l2-e" },  // √3
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 28, templateId: "rationalise-l2-f" },  // 2√7/7
  { mode: "standalone", numeratorCoeff: 7, denominatorRoot: 28, templateId: "rationalise-l2-g" },  // √7/2
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 45, templateId: "rationalise-l2-h" },  // √5/3
];

/**
 * Level 3
 * Fully A-standard.
 * Must involve genuine surd simplification.
 */
const LEVEL_3_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 2, denominatorRoot: 40, templateId: "rationalise-l3-a" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 5, denominatorRoot: 12, templateId: "rationalise-l3-b" },
  { mode: "standalone", numeratorCoeff: 2, numeratorSurd: 5, denominatorRoot: 12, templateId: "rationalise-l3-c" },
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 2, denominatorRoot: 12, templateId: "rationalise-l3-d" },
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 5, denominatorRoot: 18, templateId: "rationalise-l3-e" },
  { mode: "standalone", numeratorCoeff: 2, numeratorSurd: 3, denominatorRoot: 24, templateId: "rationalise-l3-f" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 2, denominatorRoot: 24, templateId: "rationalise-l3-g" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 6, denominatorRoot: 27, templateId: "rationalise-l3-h" },
];

/**
 * Level 4
 * Integrated A-standard via functional notation.
 */
const LEVEL_4_VARIANTS: FunctionalVariant[] = [
  { mode: "functional", functionCoeff: 2, inputValue: 8, templateId: "rationalise-l4-a" },
  { mode: "functional", functionCoeff: 3, inputValue: 12, templateId: "rationalise-l4-b" },
  { mode: "functional", functionCoeff: 4, inputValue: 18, templateId: "rationalise-l4-c" },
  { mode: "functional", functionCoeff: 5, inputValue: 20, templateId: "rationalise-l4-d" },
  { mode: "functional", functionCoeff: 3, inputValue: 27, templateId: "rationalise-l4-e" },
  { mode: "functional", functionCoeff: 4, inputValue: 28, templateId: "rationalise-l4-f" },
];

function buildSelectionMeta(
  level: 1 | 2 | 3 | 4,
  templateId: string,
): QuestionVariantSelectionMeta {
  let marks: QuestionMarkProfile;

  if (level === 1) {
    marks = {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    };
  } else if (level === 2) {
    marks = {
      totalMarks: 3,
      cMarks: 3,
      aMarks: 0,
      reasoningMarks: 0,
    };
  } else if (level === 3) {
    marks = {
      totalMarks: 3,
      cMarks: 0,
      aMarks: 3,
      reasoningMarks: 0,
    };
  } else {
    marks = {
      totalMarks: 2,
      cMarks: 0,
      aMarks: 2,
      reasoningMarks: 0,
    };
  }

  return {
    level,
    templateId,
    marks,
    standardProfile: deriveStandardProfile(marks),
    paperSuitability: "P1",
    calculatorStatus: "NonCalculatorOnly",
  };
}

function getLevelSelectionProfileEntries(
  level: 1 | 2 | 3 | 4,
): QuestionVariantSelectionMeta[] {
  const variantsByLevel: Record<1 | 2 | 3 | 4, RationaliseVariant[]> = {
    1: LEVEL_1_VARIANTS,
    2: LEVEL_2_VARIANTS,
    3: LEVEL_3_VARIANTS,
    4: LEVEL_4_VARIANTS,
  };

  return variantsByLevel[level].map((variant) =>
    buildSelectionMeta(level, variant.templateId),
  );
}

function chooseVariant(level: 1 | 2 | 3 | 4): RationaliseVariant {
  if (level === 1) return chooseOne(LEVEL_1_VARIANTS);
  if (level === 2) return chooseOne(LEVEL_2_VARIANTS);
  if (level === 3) return chooseOne(LEVEL_3_VARIANTS);
  return chooseOne(LEVEL_4_VARIANTS);
}

function chooseValidVariant(level: 1 | 2 | 3 | 4): RationaliseVariant {
  for (let attempts = 0; attempts < 50; attempts++) {
    const candidate = chooseVariant(level);

    if (candidate.mode === "functional") {
      const answer = simplifyStandaloneRationalisedForm(
        candidate.functionCoeff,
        undefined,
        candidate.inputValue,
      );

      if (answer.containsSurd && answer.isFraction) {
        return candidate;
      }

      continue;
    }

    const answer = simplifyStandaloneRationalisedForm(
      candidate.numeratorCoeff,
      candidate.numeratorSurd,
      candidate.denominatorRoot,
    );

    if (answer.containsSurd && answer.isFraction) {
      return candidate;
    }
  }

  if (level === 1) return LEVEL_1_VARIANTS[0];
  if (level === 2) return LEVEL_2_VARIANTS[0];
  if (level === 3) return LEVEL_3_VARIANTS[0];
  return LEVEL_4_VARIANTS[0];
}

function buildStandalonePromptLatex(variant: StandaloneVariant): string {
  if (variant.numeratorSurd) {
    if (variant.numeratorCoeff === 1) {
      return `\\dfrac{\\sqrt{${variant.numeratorSurd}}}{\\sqrt{${variant.denominatorRoot}}}`;
    }

    return `\\dfrac{${variant.numeratorCoeff}\\sqrt{${variant.numeratorSurd}}}{\\sqrt{${variant.denominatorRoot}}}`;
  }

  return `\\dfrac{${variant.numeratorCoeff}}{\\sqrt{${variant.denominatorRoot}}}`;
}

function buildStandalonePromptText(variant: StandaloneVariant): string {
  if (variant.numeratorSurd) {
    if (variant.numeratorCoeff === 1) {
      return `√${variant.numeratorSurd}/√${variant.denominatorRoot}`;
    }

    return `${variant.numeratorCoeff}√${variant.numeratorSurd}/√${variant.denominatorRoot}`;
  }

  return `${variant.numeratorCoeff}/√${variant.denominatorRoot}`;
}

function buildMarks(level: 1 | 2 | 3 | 4): QuestionMarkProfile {
  if (level === 1) {
    return { totalMarks: 2, cMarks: 2, aMarks: 0, reasoningMarks: 0 };
  }
  if (level === 2) {
    return { totalMarks: 3, cMarks: 3, aMarks: 0, reasoningMarks: 0 };
  }
  if (level === 3) {
    return { totalMarks: 3, cMarks: 0, aMarks: 3, reasoningMarks: 0 };
  }
  return { totalMarks: 2, cMarks: 0, aMarks: 2, reasoningMarks: 0 };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const variant = chooseValidVariant(level);
  const markBreakdown = buildMarks(level);
  const selectionMeta = buildSelectionMeta(level, variant.templateId);

  if (variant.mode === "functional") {
    const answer = simplifyStandaloneRationalisedForm(
      variant.functionCoeff,
      undefined,
      variant.inputValue,
    );

    return {
      prompt: `Given f(x) = ${variant.functionCoeff}/√x, write f(${variant.inputValue}) with a rational denominator in its simplest form.`,
      answer: answer.plain,
      marks: markBreakdown.totalMarks,

      questionCode: "NQ_N5_NUM_N01_2_RATIONALISE",

      promptParts: [
        textPart("Given "),
        mathPart(`f(x)=\\dfrac{${variant.functionCoeff}}{\\sqrt{x}}`),
        textPart(", write "),
        mathPart(`f(${variant.inputValue})`),
        textPart(" with a rational denominator in its simplest form."),
      ],

      answerParts: [mathPart(answer.latex)],

      markBreakdown,
      classification: {
        standard: "A",
        calculatorStatus: "NonCalculatorOnly",
        structureType: "ExpressionSimplification",
        isReasoning: false,
        paperSuitability: "P1",
      },

      selectionMeta,

      sourceSkillCode: "NQ_N5_NUM_N01",
      sourceConceptCode: "N1.2",
      sourceConceptLabel: "Rationalise the denominator of a surd",
      templateId: variant.templateId,
    };
  }

  const simplifiedAnswer = simplifyStandaloneRationalisedForm(
    variant.numeratorCoeff,
    variant.numeratorSurd,
    variant.denominatorRoot,
  );

  const promptLatex = buildStandalonePromptLatex(variant);
  const promptPlain = buildStandalonePromptText(variant);

  return {
    prompt: `Write ${promptPlain} with a rational denominator in its simplest form.`,
    answer: simplifiedAnswer.plain,
    marks: markBreakdown.totalMarks,

    questionCode: "NQ_N5_NUM_N01_2_RATIONALISE",

    promptParts: [
      textPart("Write "),
      mathPart(promptLatex),
      textPart(" with a rational denominator in its simplest form."),
    ],

    answerParts: [mathPart(simplifiedAnswer.latex)],

    markBreakdown,
    classification: {
      standard: level <= 2 ? "C" : "A",
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },

    selectionMeta,

    sourceSkillCode: "NQ_N5_NUM_N01",
    sourceConceptCode: "N1.2",
    sourceConceptLabel: "Rationalise the denominator of a surd",
    templateId: variant.templateId,
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
      availableLevels: [1, 2, 3, 4],
      defaultLevel: 2,
      levelDescriptions: {
        1: "Direct rationalising only, worth 2 C-standard marks.",
        2: "Rationalising with whole-number simplification only, worth 3 C-standard marks.",
        3: "Rationalising with genuine surd simplification, worth 3 A-standard marks.",
        4: "Rare integrated functional-notation version, worth 2 A-standard marks.",
      },
    },

    capabilities: {
      standardCoverage: ["C", "A"],
      canGenerateReasoning: false,
      calculatorStatus: "NonCalculatorOnly",
      paperSuitability: "P1",
      typicalStructureTypes: ["ExpressionSimplification"],
    },

    levelSelectionProfile: {
      1: getLevelSelectionProfileEntries(1),
      2: getLevelSelectionProfileEntries(2),
      3: getLevelSelectionProfileEntries(3),
      4: getLevelSelectionProfileEntries(4),
    },
  },

  canHandle(code: string) {
    return code === "N1.2";
  },

  generate: generateQuestion,
};

export default RationaliseConceptModule;