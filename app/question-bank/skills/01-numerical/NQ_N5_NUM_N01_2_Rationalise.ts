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
// STANDARD CLASSIFICATION
// • C-standard when the task is purely rationalising
// • A-standard (operational) when surd simplification is required after rationalising
// • Rare integrated / embedded versions are also treated as A-standard operational
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
// Examples to avoid:
//     √3 / √27  ->  1/3
//     4 / √16   ->  1
//     3 / √3    ->  √3
//
// ======================================================================================
// DIFFICULTY STRUCTURE
//
// Level 1 (C-standard operational)
// • Direct rationalising
// • No further surd simplification beyond the rationalising step
// • Final answer still contains a surd fraction
//
// Level 2 (A-standard operational)
// • Rationalise then simplify
// • Includes surd simplification and often whole-number cancellation
//
// Level 3 (A-standard operational)
// • More structurally demanding
// • Often includes a surd in the numerator
// • Must still require surd simplification
// • Final answer still remains a fraction containing a surd
//
// Level 4 (Integrated skill – rare)
// • Rationalising embedded in another process
// • Current embedded wrapper: functional notation
//
// ======================================================================================
// GENERATOR DESIGN NOTES
//
// • Each level uses a hand-curated bank of valid variants
// • This avoids the generator collapsing to one fallback question
// • The numbers are deliberately kept within the tighter scope we discussed
// • Variety is increased without changing the behavioural difficulty
//
// NOTE FOR LATER UI / BUILDER WORK
// • The difficulty picker should eventually only allow levels that exist in the generator
// • Example: this concept supports levels 1–4 only, so level 5 should not be selectable
//
// ======================================================================================

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
  expectedStandard: "C" | "A";
  templateId: string;
};

type FunctionalVariant = {
  mode: "functional";
  functionCoeff: number;
  inputValue: number;
  expectedStandard: "A";
  templateId: string;
};

type RationaliseVariant = StandaloneVariant | FunctionalVariant;

const LEVEL_1_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 1, denominatorRoot: 2, expectedStandard: "C", templateId: "rationalise-l1-a" },
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 3, expectedStandard: "C", templateId: "rationalise-l1-b" },
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 5, expectedStandard: "C", templateId: "rationalise-l1-c" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 5, expectedStandard: "C", templateId: "rationalise-l1-d" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 7, expectedStandard: "C", templateId: "rationalise-l1-e" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 3, expectedStandard: "C", templateId: "rationalise-l1-f" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 7, expectedStandard: "C", templateId: "rationalise-l1-g" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 2, expectedStandard: "C", templateId: "rationalise-l1-h" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 6, expectedStandard: "C", templateId: "rationalise-l1-i" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 10, expectedStandard: "C", templateId: "rationalise-l1-j" },
];

const LEVEL_2_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 8, expectedStandard: "A", templateId: "rationalise-l2-a" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 12, expectedStandard: "A", templateId: "rationalise-l2-b" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 18, expectedStandard: "A", templateId: "rationalise-l2-c" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 20, expectedStandard: "A", templateId: "rationalise-l2-d" },
  { mode: "standalone", numeratorCoeff: 2, denominatorRoot: 18, expectedStandard: "A", templateId: "rationalise-l2-e" },
  { mode: "standalone", numeratorCoeff: 3, denominatorRoot: 27, expectedStandard: "A", templateId: "rationalise-l2-f" },
  { mode: "standalone", numeratorCoeff: 4, denominatorRoot: 28, expectedStandard: "A", templateId: "rationalise-l2-g" },
  { mode: "standalone", numeratorCoeff: 7, denominatorRoot: 28, expectedStandard: "A", templateId: "rationalise-l2-h" },
  { mode: "standalone", numeratorCoeff: 5, denominatorRoot: 45, expectedStandard: "A", templateId: "rationalise-l2-i" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 2, denominatorRoot: 40, expectedStandard: "A", templateId: "rationalise-l2-j" },
];

const LEVEL_3_VARIANTS: StandaloneVariant[] = [
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 2, denominatorRoot: 12, expectedStandard: "A", templateId: "rationalise-l3-a" },
  { mode: "standalone", numeratorCoeff: 2, numeratorSurd: 5, denominatorRoot: 12, expectedStandard: "A", templateId: "rationalise-l3-b" },
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 5, denominatorRoot: 18, expectedStandard: "A", templateId: "rationalise-l3-c" },
  { mode: "standalone", numeratorCoeff: 2, numeratorSurd: 6, denominatorRoot: 27, expectedStandard: "A", templateId: "rationalise-l3-d" },
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 6, denominatorRoot: 12, expectedStandard: "A", templateId: "rationalise-l3-e" },
  { mode: "standalone", numeratorCoeff: 2, numeratorSurd: 3, denominatorRoot: 24, expectedStandard: "A", templateId: "rationalise-l3-f" },
  { mode: "standalone", numeratorCoeff: 3, numeratorSurd: 2, denominatorRoot: 24, expectedStandard: "A", templateId: "rationalise-l3-g" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 6, denominatorRoot: 27, expectedStandard: "A", templateId: "rationalise-l3-h" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 2, denominatorRoot: 24, expectedStandard: "A", templateId: "rationalise-l3-i" },
  { mode: "standalone", numeratorCoeff: 1, numeratorSurd: 5, denominatorRoot: 12, expectedStandard: "A", templateId: "rationalise-l3-j" },
];

const LEVEL_4_VARIANTS: FunctionalVariant[] = [
  { mode: "functional", functionCoeff: 2, inputValue: 8, expectedStandard: "A", templateId: "rationalise-l4-a" },
  { mode: "functional", functionCoeff: 3, inputValue: 12, expectedStandard: "A", templateId: "rationalise-l4-b" },
  { mode: "functional", functionCoeff: 4, inputValue: 18, expectedStandard: "A", templateId: "rationalise-l4-c" },
  { mode: "functional", functionCoeff: 5, inputValue: 20, expectedStandard: "A", templateId: "rationalise-l4-d" },
  { mode: "functional", functionCoeff: 2, inputValue: 18, expectedStandard: "A", templateId: "rationalise-l4-e" },
  { mode: "functional", functionCoeff: 3, inputValue: 27, expectedStandard: "A", templateId: "rationalise-l4-f" },
  { mode: "functional", functionCoeff: 4, inputValue: 28, expectedStandard: "A", templateId: "rationalise-l4-g" },
  { mode: "functional", functionCoeff: 5, inputValue: 45, expectedStandard: "A", templateId: "rationalise-l4-h" },
  { mode: "functional", functionCoeff: 6, inputValue: 27, expectedStandard: "A", templateId: "rationalise-l4-i" },
  { mode: "functional", functionCoeff: 7, inputValue: 28, expectedStandard: "A", templateId: "rationalise-l4-j" },
];

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

function buildMarks(level: 1 | 2 | 3 | 4): {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  reasoningMarks: number;
} {
  if (level === 1) {
    return {
      totalMarks: 2,
      cMarks: 2,
      aMarks: 0,
      reasoningMarks: 0,
    };
  }

  if (level === 4) {
    return {
      totalMarks: 3,
      cMarks: 1,
      aMarks: 2,
      reasoningMarks: 0,
    };
  }

  return {
    totalMarks: 3,
    cMarks: 2,
    aMarks: 1,
    reasoningMarks: 0,
  };
}

function generateQuestion(context: GeneratorContext): GeneratedQuestionData {
  const level = normaliseDifficulty(context.difficulty);
  const variant = chooseValidVariant(level);
  const markBreakdown = buildMarks(level);

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
        standard: variant.expectedStandard,
        calculatorStatus: "NonCalculatorOnly",
        structureType: "ExpressionSimplification",
        isReasoning: false,
        paperSuitability: "P1",
      },

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
      standard: variant.expectedStandard,
      calculatorStatus: "NonCalculatorOnly",
      structureType: "ExpressionSimplification",
      isReasoning: false,
      paperSuitability: "P1",
    },

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
        1: "Direct rationalising only, with a clean exact surd fraction and no further surd simplification requirement.",
        2: "Rationalising followed by surd simplification, typically with some whole-number cancellation.",
        3: "More structurally demanding rationalising with surd simplification, often including a surd in the numerator.",
        4: "Rare integrated version where rationalising is embedded inside another process such as functional notation.",
      },
    },

    capabilities: {
      standardCoverage: ["C", "A"],
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