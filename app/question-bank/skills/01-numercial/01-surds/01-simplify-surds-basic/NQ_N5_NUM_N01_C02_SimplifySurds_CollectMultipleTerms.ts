import { PROMPT_STYLES } from "@/app/question-bank/prompt-styles/prompt-styles";
import { createNoRepeatPicker } from "@/app/question-bank/evidence-engine/pick-prompt-style-no-repeat";
import { N5_NUM_N01_PROMPT_WEIGHTS } from "@/app/question-bank/evidence/n5/num-weights";
import type { DifficultyLevel } from "./NQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms";

type N01PromptStyleId = (typeof N5_NUM_N01_PROMPT_WEIGHTS)[number]["id"];
type Op = "+" | "-";

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radicandFor(root: number, coefFinal: number) {
  return coefFinal * coefFinal * root;
}

function latexSqrt(n: number) {
  return `\\sqrt{${n}}`;
}

function latexTerm(args: { root: number; coefFinal: number; alreadySimplified: boolean }) {
  const { root, coefFinal, alreadySimplified } = args;

  if (alreadySimplified) {
    return coefFinal === 1 ? latexSqrt(root) : `${coefFinal}${latexSqrt(root)}`;
  }

  const n = radicandFor(root, coefFinal);
  return latexSqrt(n);
}

function withinCap(level: number, root: number, coefFinal: number, capByLevel: Record<number, number>) {
  return radicandFor(root, coefFinal) <= capByLevel[level];
}

const pickPromptStyleId_NoRepeat = createNoRepeatPicker<N01PromptStyleId>(N5_NUM_N01_PROMPT_WEIGHTS);

const RADICAND_CAP_BY_LEVEL: Record<number, number> = {
  1: 70,
  2: 160,
  3: 240,
  4: 340,
  5: 420,
};

const ROOT_POOL_EASY = [2, 3, 5];
const ROOT_POOL_MID = [2, 3, 5, 6, 7, 8, 10, 12];

const COEF_RANGE_BY_LEVEL: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 3 },
  2: { min: 1, max: 4 },
  3: { min: 2, max: 6 },
  4: { min: 2, max: 7 },
  5: { min: 3, max: 8 },
};

function chooseOps(level: number): [Op, Op] {
  if (level <= 2) return [rand(["+", "+", "-"]), rand(["+", "-"])];
  if (level === 3) return [rand(["+", "-"]), rand(["+", "-"])];
  return [rand(["+", "-"]), rand(["+", "-", "-"])];
}

function buildSingleRoot(level: DifficultyLevel) {
  const root = rand(level <= 2 ? ROOT_POOL_EASY : ROOT_POOL_MID);
  const { min, max } = COEF_RANGE_BY_LEVEL[level];

  let a = randInt(min, max);
  let b = randInt(min, max);
  let c = randInt(min, max);

  if (b === a) b = Math.min(max, b + 1);
  if (c === a) c = Math.max(min, c - 1);
  if (c === b) c = Math.min(max, c + 1);

  const mixedChance = level <= 2 ? 0.25 : 0.45;
  const makeOneSimplified = Math.random() < mixedChance;

  let aSimpl = false,
    bSimpl = false,
    cSimpl = false;

  if (makeOneSimplified) {
    const pick = rand([0, 1, 2]);
    if (pick === 0) aSimpl = true;
    if (pick === 1) bSimpl = true;
    if (pick === 2) cSimpl = true;
  }

  if (!aSimpl) while (!withinCap(level, root, a, RADICAND_CAP_BY_LEVEL) && a > min) a--;
  if (!bSimpl) while (!withinCap(level, root, b, RADICAND_CAP_BY_LEVEL) && b > min) b--;
  if (!cSimpl) while (!withinCap(level, root, c, RADICAND_CAP_BY_LEVEL) && c > min) c--;

  const [op1, op2] = chooseOps(level);

  const t1 = latexTerm({ root, coefFinal: a, alreadySimplified: aSimpl });
  const t2 = latexTerm({ root, coefFinal: b, alreadySimplified: bSimpl });
  const t3 = latexTerm({ root, coefFinal: c, alreadySimplified: cSimpl });

  if (t1 === t2 || t1 === t3 || t2 === t3) return null;

  const expressionLatex = `${t1} ${op1} ${t2} ${op2} ${t3}`;

  const coef2 = op1 === "+" ? b : -b;
  const coef3 = op2 === "+" ? c : -c;
  const finalCoef = a + coef2 + coef3;

  if (finalCoef === 0) return null;

  const answerLatex =
    finalCoef === 1 ? latexSqrt(root) : finalCoef === -1 ? `-${latexSqrt(root)}` : `${finalCoef}${latexSqrt(root)}`;

  return { expressionLatex, answerLatex, rootsCount: 1 as const };
}

function buildTwoRoots(level: DifficultyLevel) {
  const r1 = rand(ROOT_POOL_MID);
  const r2 = rand(ROOT_POOL_MID.filter((x) => x !== r1));

  const { min, max } = COEF_RANGE_BY_LEVEL[level];

  let a = randInt(min, max);
  let b = randInt(min, max);
  let c = randInt(min, max);

  if (c === b) c = Math.min(max, c + 1);

  const makeOneSimplified = Math.random() < (level === 4 ? 0.35 : 0.55);

  let aSimpl = false,
    bSimpl = false,
    cSimpl = false;

  if (makeOneSimplified) {
    const pick = rand([0, 1, 2]);
    if (pick === 0) aSimpl = true;
    if (pick === 1) bSimpl = true;
    if (pick === 2) cSimpl = true;
  }

  if (!aSimpl) while (!withinCap(level, r1, a, RADICAND_CAP_BY_LEVEL) && a > min) a--;
  if (!bSimpl) while (!withinCap(level, r2, b, RADICAND_CAP_BY_LEVEL) && b > min) b--;
  if (!cSimpl) while (!withinCap(level, r2, c, RADICAND_CAP_BY_LEVEL) && c > min) c--;

  const [op1, op2] = chooseOps(level);

  const t1 = latexTerm({ root: r1, coefFinal: a, alreadySimplified: aSimpl });
  const t2 = latexTerm({ root: r2, coefFinal: b, alreadySimplified: bSimpl });
  const t3 = latexTerm({ root: r2, coefFinal: c, alreadySimplified: cSimpl });

  if (t2 === t3) return null;
  if (t1 === t2 || t1 === t3) return null;

  const expressionLatex = `${t1} ${op1} ${t2} ${op2} ${t3}`;

  const coefR1 = a;
  const coefR2 = (op1 === "+" ? b : -b) + (op2 === "+" ? c : -c);
  if (coefR2 === 0) return null;

  const part1 = coefR1 === 1 ? latexSqrt(r1) : `${coefR1}${latexSqrt(r1)}`;
  const absR2 = Math.abs(coefR2);
  const part2 = absR2 === 1 ? latexSqrt(r2) : `${absR2}${latexSqrt(r2)}`;
  const sign2 = coefR2 >= 0 ? "+" : "-";

  const answerLatex = `${part1} ${sign2} ${part2}`;

  return { expressionLatex, answerLatex, rootsCount: 2 as const };
}

export function generateNQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms(difficulty: DifficultyLevel) {
  for (let tries = 0; tries < 50; tries++) {
    const built =
      difficulty <= 3
        ? buildSingleRoot(difficulty)
        : Math.random() < 0.7
          ? buildTwoRoots(difficulty)
          : buildSingleRoot(difficulty);

    if (!built) continue;

    const styleId = pickPromptStyleId_NoRepeat({
      adjustPicked: (id) => {
        if (id === ("C" as N01PromptStyleId) && Math.random() < 0.9) return "B" as N01PromptStyleId;
        return id;
      },
    });

    const promptStyle = PROMPT_STYLES[styleId] ?? PROMPT_STYLES["B"];

    const expr = `$${built.expressionLatex}$`;
    const ans = built.answerLatex === "0" ? "0" : `$${built.answerLatex}$`;

    return {
      level: "N5",
      umbrella: "NUM",
      skillCode2: "N01",
      conceptCode2: "C02",
      promptStyleId: promptStyle.id,
      marks: difficulty <= 3 ? 2 : 3,
      prompt: promptStyle.template(expr),
      answer: ans,
      expression: expr,
      meta: { rootsCount: built.rootsCount },
    };
  }

  const fallbackExpr = `$${latexSqrt(20)} + ${latexSqrt(45)} - ${latexSqrt(5)}$`;
  return {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C02",
    promptStyleId: "B",
    marks: 2,
    prompt: (PROMPT_STYLES["B"] ?? PROMPT_STYLES["A"]).template(fallbackExpr),
    answer: `$4${latexSqrt(5)}$`,
    expression: fallbackExpr,
    meta: { rootsCount: 1 },
  };
}