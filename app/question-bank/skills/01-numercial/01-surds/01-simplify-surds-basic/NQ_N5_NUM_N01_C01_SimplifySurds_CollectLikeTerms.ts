import { PROMPT_STYLES } from "@/app/question-bank/prompt-styles/prompt-styles";
import { PROMPT_STYLES_PARTS } from "@/app/question-bank/prompt-styles/prompt-styles-parts";
import { createNoRepeatPicker } from "@/app/question-bank/evidence-engine/pick-prompt-style-no-repeat";
import { N5_NUM_N01_PROMPT_WEIGHTS } from "@/app/question-bank/evidence/n5/num-weights";
import type { PaperPart } from "@/shared-types/paperParts";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
type Op = "+" | "-";

type N01PromptStyleId = (typeof N5_NUM_N01_PROMPT_WEIGHTS)[number]["id"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radicandFor(root: number, coefFinal: number) {
  return coefFinal * coefFinal * root;
}

/**
 * Return LaTeX for a surd term.
 * - alreadySimplified:  √root  OR  k√root
 * - otherwise:          √(k^2 * root)
 */
function termLatex(args: { root: number; coefFinal: number; alreadySimplified: boolean }) {
  const { root, coefFinal, alreadySimplified } = args;

  if (alreadySimplified) {
    if (coefFinal === 1) return `\\sqrt{${root}}`;
    return `${coefFinal}\\sqrt{${root}}`;
  }

  const n = radicandFor(root, coefFinal);
  return `\\sqrt{${n}}`;
}

function buildLikeTermsExpressionLatex(args: {
  root: number;
  aCoefFinal: number;
  bCoefFinal: number;
  aSimplified: boolean;
  bSimplified: boolean;
  op: Op;
}) {
  const { root, aCoefFinal, bCoefFinal, aSimplified, bSimplified, op } = args;

  const aLatex = termLatex({ root, coefFinal: aCoefFinal, alreadySimplified: aSimplified });
  const bLatex = termLatex({ root, coefFinal: bCoefFinal, alreadySimplified: bSimplified });

  const expressionLatex = `${aLatex} ${op} ${bLatex}`;

  const resultCoef = op === "+" ? aCoefFinal + bCoefFinal : aCoefFinal - bCoefFinal;

  const answerLatex =
    resultCoef === 0
      ? "0"
      : resultCoef === 1
        ? `\\sqrt{${root}}`
        : `${resultCoef}\\sqrt{${root}}`;

  return { expressionLatex, answerLatex };
}

// Keep surds sensible per level
const RADICAND_CAP_BY_LEVEL: Record<number, number> = {
  1: 60,
  2: 140,
  3: 220,
  4: 320,
  5: 420,
};

// More √a ± √b early
const STYLE_MIX_BY_LEVEL: Record<number, { bothUnsimplified: number; mixed: number }> = {
  1: { bothUnsimplified: 80, mixed: 20 },
  2: { bothUnsimplified: 70, mixed: 30 },
  3: { bothUnsimplified: 55, mixed: 45 },
  4: { bothUnsimplified: 45, mixed: 55 },
  5: { bothUnsimplified: 35, mixed: 65 },
};

function pickStyle(level: number): "bothUnsimplified" | "mixed" {
  const m = STYLE_MIX_BY_LEVEL[level];
  const roll = Math.random() * 100;
  return roll < m.bothUnsimplified ? "bothUnsimplified" : "mixed";
}

// Coefficients after simplifying
const COEF_RANGE_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 3 },
  2: { min: 1, max: 4 },
  3: { min: 1, max: 5 },
  4: { min: 2, max: 6 },
  5: { min: 3, max: 7 },
};

const ROOT_POOL_BY_LEVEL: Record<number, number[]> = {
  1: [2, 3, 5],
  2: [2, 3, 5, 6, 7, 8],
  3: [2, 3, 5, 6, 7, 10, 12],
  4: [2, 3, 5, 6, 7, 10, 12],
  5: [2, 3, 5, 6, 7, 10, 12],
};

function chooseOp(level: number): Op {
  if (level <= 2) return rand(["+", "+", "-"]);
  if (level === 3) return rand(["+", "-"]);
  return rand(["+", "-", "-"]);
}

function withinCap(level: number, root: number, coefFinal: number) {
  return radicandFor(root, coefFinal) <= RADICAND_CAP_BY_LEVEL[level];
}

/**
 * Prompt style selection (evidence-driven) + NO REPEATS
 */
const pickPromptStyleId_NoRepeat = createNoRepeatPicker<N01PromptStyleId>(N5_NUM_N01_PROMPT_WEIGHTS);

function generateOnce(level: DifficultyLevel) {
  const root = rand(ROOT_POOL_BY_LEVEL[level]);
  const { min, max } = COEF_RANGE_BY_LEVEL[level];

  let aCoef = randInt(min, max);
  let bCoef = randInt(min, max);

  // discourage identical visible terms
  if (aCoef === bCoef) {
    bCoef = Math.min(max, bCoef + 1);
    if (bCoef === aCoef) bCoef = Math.max(min, bCoef - 1);
  }

  let op = chooseOp(level);
  if (op === "-" && bCoef > aCoef) {
    const t = aCoef;
    aCoef = bCoef;
    bCoef = t;
  }

  const style = pickStyle(level);

  let aSimplified = false;
  let bSimplified = false;

  if (style === "mixed") {
    if (Math.random() < 0.5) aSimplified = true;
    else bSimplified = true;
  }

  // Cap radicands on unsimplified sides
  if (!aSimplified) while (!withinCap(level, root, aCoef) && aCoef > min) aCoef--;
  if (!bSimplified) while (!withinCap(level, root, bCoef) && bCoef > min) bCoef--;

  return buildLikeTermsExpressionLatex({
    root,
    aCoefFinal: aCoef,
    bCoefFinal: bCoef,
    aSimplified,
    bSimplified,
    op,
  });
}

export function generateNQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms(difficulty: DifficultyLevel) {
  for (let tries = 0; tries < 30; tries++) {
    const g = generateOnce(difficulty);
    if (!g) continue;

    const styleId = pickPromptStyleId_NoRepeat({
      adjustPicked: (id) => {
        // "C" wording is valid but mostly belongs to C03, keep it rare for C01
        if (id === ("C" as N01PromptStyleId) && Math.random() < 0.85) return "B" as N01PromptStyleId;
        return id;
      },
    });

    // Old string prompt (keeps everything working during migration)
    const promptStyle = PROMPT_STYLES[styleId] ?? PROMPT_STYLES["B"];

    // New parts prompt (KaTeX can render this)
    const partsStyle = PROMPT_STYLES_PARTS[styleId] ?? PROMPT_STYLES_PARTS["B"];

    const promptParts: PaperPart[] = partsStyle.templateParts(g.expressionLatex);
    const answerParts: PaperPart[] = [{ kind: "math", latex: g.answerLatex }];

    return {
      level: "N5",
      umbrella: "NUM",
      skillCode2: "N01",
      conceptCode2: "C01",
      promptStyleId: promptStyle.id,
      marks: 2,

      // ✅ new structured fields
      promptParts,
      answerParts,

      // ✅ keep legacy strings too
      prompt: promptStyle.template(g.expressionLatex),
      answer: g.answerLatex,

      // helpful for debugging / future
      expressionLatex: g.expressionLatex,
      answerLatex: g.answerLatex,
    };
  }

  // fallback (always safe)
  const fallbackExprLatex = "\\sqrt{8} + \\sqrt{2}";
  const fallbackAnsLatex = "3\\sqrt{2}";

  const promptStyle = PROMPT_STYLES["B"] ?? PROMPT_STYLES["A"];
  const partsStyle = PROMPT_STYLES_PARTS["B"] ?? PROMPT_STYLES_PARTS["A"];

  return {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C01",
    promptStyleId: promptStyle.id,
    marks: 2,

    promptParts: partsStyle.templateParts(fallbackExprLatex),
    answerParts: [{ kind: "math", latex: fallbackAnsLatex }],

    prompt: promptStyle.template(fallbackExprLatex),
    answer: fallbackAnsLatex,

    expressionLatex: fallbackExprLatex,
    answerLatex: fallbackAnsLatex,
  };
}