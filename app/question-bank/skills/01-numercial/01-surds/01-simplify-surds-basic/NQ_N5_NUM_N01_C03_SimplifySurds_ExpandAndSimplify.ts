import { PROMPT_STYLES } from "@/app/question-bank/prompt-styles/prompt-styles";
import { pickWeighted } from "@/app/question-bank/evidence-engine/pick-weighted";
import { N5_NUM_N01_PROMPT_WEIGHTS } from "@/app/question-bank/evidence/n5/num-weights";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
type Op = "+" | "-";

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function latexSqrt(n: number) {
  return `\\sqrt{${n}}`;
}

function simplifyRoot(n: number) {
  for (let i = Math.floor(Math.sqrt(n)); i > 1; i--) {
    const sq = i * i;
    if (n % sq === 0) return { coef: i, root: n / sq };
  }
  return { coef: 1, root: n };
}

function multiplySimplifiedSurds(c1: number, r1: number, c2: number, r2: number) {
  const coef = c1 * c2;
  const productRoot = r1 * r2;
  const s = simplifyRoot(productRoot);
  return { coef: coef * s.coef, root: s.root };
}

function fmtSimplifiedTermLatex(coef: number, root: number) {
  if (coef === 0) return "0";
  if (coef === 1) return latexSqrt(root);
  if (coef === -1) return `-${latexSqrt(root)}`;
  return `${coef}${latexSqrt(root)}`;
}

const DISPLAY_RADS_L1 = [2, 3, 5, 8, 12, 18, 20, 27, 32];
const DISPLAY_RADS_L2 = [2, 3, 5, 6, 7, 8, 10, 12, 15, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50];
const DISPLAY_RADS_L3 = [2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50, 54, 72, 75];
const DISPLAY_RADS_L4 = [2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50, 54, 63, 72, 75];
const DISPLAY_RADS_L5 = [2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50, 54, 63, 72, 75];

function poolByLevel(level: DifficultyLevel) {
  if (level === 1) return DISPLAY_RADS_L1;
  if (level === 2) return DISPLAY_RADS_L2;
  if (level === 3) return DISPLAY_RADS_L3;
  if (level === 4) return DISPLAY_RADS_L4;
  return DISPLAY_RADS_L5;
}

function chooseOps(level: DifficultyLevel): [Op, Op] {
  const opIn: Op =
    level === 1 ? rand(["+", "+", "+", "-"]) :
    level === 2 ? rand(["+", "+", "-", "-"]) :
    level === 3 ? rand(["+", "-"]) :
    rand(["+", "-", "-"]);

  const opOut: Op =
    level === 1 ? rand(["+", "+", "-"]) :
    level === 2 ? rand(["+", "+", "-", "-"]) :
    level === 3 ? rand(["+", "-"]) :
    rand(["+", "-", "-"]);

  return [opIn, opOut];
}

type DisplayTerm = {
  textLatex: string; // displayed
  coef: number; // simplified coef (for calculation)
  root: number; // simplified root (for calculation)
};

function makeDisplayTermFromRadicand(n: number, displaySimplified: boolean): DisplayTerm {
  const s = simplifyRoot(n);

  if (!displaySimplified) {
    return { textLatex: latexSqrt(n), coef: s.coef, root: s.root };
  }

  const textLatex = s.coef === 1 ? latexSqrt(s.root) : `${s.coef}${latexSqrt(s.root)}`;
  return { textLatex, coef: s.coef, root: s.root };
}

function makeMultiplier(level: DifficultyLevel): DisplayTerm {
  const roots =
    level <= 2 ? [2, 3, 5] :
    level === 3 ? [2, 3, 5, 6, 7] :
    [2, 3, 5, 6, 7, 10, 14, 15];

  const root = rand(roots);

  const coef =
    level <= 3 ? 1 :
    level === 4 ? rand([1, 2, 3]) :
    rand([2, 3, 3, 4]);

  const textLatex = coef === 1 ? latexSqrt(root) : `${coef}${latexSqrt(root)}`;
  return { textLatex, coef, root };
}

function addToMap(map: Map<number, number>, root: number, coef: number) {
  map.set(root, (map.get(root) ?? 0) + coef);
}

function formatAnswerFromMapLatex(map: Map<number, number>) {
  const parts = Array.from(map.entries())
    .filter(([, c]) => c !== 0)
    .sort((a, b) => a[0] - b[0])
    .map(([root, coef]) => ({ root, coef }));

  if (parts.length === 0) return "0";
  if (parts.length === 1) return fmtSimplifiedTermLatex(parts[0].coef, parts[0].root);

  const a = parts[0];
  const b = parts[1];

  const aText = fmtSimplifiedTermLatex(a.coef, a.root);
  const sign = b.coef >= 0 ? "+" : "-";
  const abs = Math.abs(b.coef);
  const bText = abs === 1 ? latexSqrt(b.root) : `${abs}${latexSqrt(b.root)}`;

  return `${aText} ${sign} ${bText}`;
}

function targetRootsCount(level: DifficultyLevel): 1 | 2 {
  if (level <= 2) return 1;
  if (level === 3) return Math.random() < 0.75 ? 1 : 2;
  return Math.random() < 0.85 ? 2 : 1;
}

function innerCoefCap(level: DifficultyLevel) {
  return level === 5 ? 6 : 3;
}

function finalCoefCap(level: DifficultyLevel) {
  if (level <= 2) return 18;
  if (level === 3) return 22;
  if (level === 4) return 28;
  return 34;
}

function generateOnce(level: DifficultyLevel) {
  const pool = poolByLevel(level);
  const multiplier = makeMultiplier(level);
  const [opIn, opOut] = chooseOps(level);

  const desiredRoots = targetRootsCount(level);
  const capInner = innerCoefCap(level);
  const capFinal = finalCoefCap(level);

  const displaySimplifiedInside = level >= 4;

  const sideUnsimplifiedChance =
    level === 1 ? 0.05 :
    level === 2 ? 0.15 :
    level === 3 ? 0.30 :
    level === 4 ? 0.55 :
    0.70;

  for (let tries = 0; tries < 260; tries++) {
    const n1 = rand(pool);
    let n2 = rand(pool);
    if (n2 === n1) n2 = rand(pool);

    const t1 = makeDisplayTermFromRadicand(n1, displaySimplifiedInside);
    const t2 = makeDisplayTermFromRadicand(n2, displaySimplifiedInside);

    if (t1.root === t2.root && t1.coef === t2.coef) continue;
    if (Math.abs(t1.coef) > capInner || Math.abs(t2.coef) > capInner) continue;

    let sideN = rand(pool);

    if (level === 1 && Math.random() < 0.65) {
      const forceFrom = rand([t1, t2]);
      const candidates = pool.filter((x) => simplifyRoot(x).root === forceFrom.root);
      if (candidates.length) sideN = rand(candidates);
    } else if (level === 2 && Math.random() < 0.55) {
      const forceFrom = rand([t1, t2]);
      const candidates = pool.filter((x) => simplifyRoot(x).root === forceFrom.root);
      if (candidates.length) sideN = rand(candidates);
    }

    const side = makeDisplayTermFromRadicand(sideN, !(Math.random() < sideUnsimplifiedChance));

    const mt1 = multiplySimplifiedSurds(multiplier.coef, multiplier.root, t1.coef, t1.root);
    const mt2 = multiplySimplifiedSurds(multiplier.coef, multiplier.root, t2.coef, t2.root);

    const map = new Map<number, number>();
    addToMap(map, mt1.root, mt1.coef);
    addToMap(map, mt2.root, opIn === "+" ? mt2.coef : -mt2.coef);
    addToMap(map, side.root, opOut === "+" ? side.coef : -side.coef);

    const nonZeroEntries = Array.from(map.entries()).filter(([, c]) => c !== 0);
    const nonZeroGroups = nonZeroEntries.length;

    if (nonZeroGroups === 0) continue;
    if (nonZeroGroups > 2) continue;

    if (desiredRoots === 1 && nonZeroGroups !== 1) continue;
    if (desiredRoots === 2 && nonZeroGroups !== 2) continue;

    if (level <= 2) {
      const only = nonZeroEntries[0]?.[1];
      if (typeof only === "number" && only < 0) continue;
    }

    if (nonZeroEntries.some(([, c]) => Math.abs(c) > capFinal)) continue;

    const answerLatex = formatAnswerFromMapLatex(map);

    const flipOuter = Math.random() < (level === 1 ? 0.22 : level === 2 ? 0.30 : 0.35);
    const swapInside = Math.random() < (level <= 2 ? 0.30 : 0.40);

    const a = swapInside ? t2 : t1;
    const b = swapInside ? t1 : t2;

    const bracketLatex = `${a.textLatex} ${opIn} ${b.textLatex}`;
    const leftLatex = `${multiplier.textLatex}(${bracketLatex})`;

    const expressionLatex = flipOuter
      ? `${side.textLatex} ${opOut} ${leftLatex}`
      : `${leftLatex} ${opOut} ${side.textLatex}`;

    const marks = level <= 2 ? 2 : level === 3 ? 3 : 4;

    return { expressionLatex, answerLatex, marks, rootsCount: nonZeroGroups as 1 | 2 };
  }

  return null;
}

let lastPromptStyleId: string | null = null;

function pickPromptStyleId_NoRepeat(): string {
  const ids = Array.from(new Set(N5_NUM_N01_PROMPT_WEIGHTS.map((w) => String(w.id))));
  const canAvoidRepeat = ids.length > 1;

  for (let tries = 0; tries < 12; tries++) {
    const picked = String(pickWeighted(N5_NUM_N01_PROMPT_WEIGHTS).id);
    if (canAvoidRepeat && lastPromptStyleId && picked === lastPromptStyleId) continue;
    lastPromptStyleId = picked;
    return picked;
  }

  const fallback = ids.find((x) => x !== lastPromptStyleId) ?? (ids[0] ?? "B");
  lastPromptStyleId = fallback;
  return fallback;
}

export function generateNQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify(difficulty: DifficultyLevel) {
  for (let tries = 0; tries < 120; tries++) {
    const built = generateOnce(difficulty);
    if (!built) continue;

    const styleId = pickPromptStyleId_NoRepeat();
    const promptStyle =
      (PROMPT_STYLES as Record<string, { id: string; template: (s: string) => string }>)[styleId] ?? PROMPT_STYLES.B;

    const expr = `$${built.expressionLatex}$`;
    const ans = built.answerLatex === "0" ? "0" : `$${built.answerLatex}$`;

    return {
      level: "N5",
      umbrella: "NUM",
      skillCode2: "N01",
      conceptCode2: "C03",
      promptStyleId: promptStyle.id,
      marks: built.marks,
      prompt: promptStyle.template(expr),
      answer: ans,
      expression: expr,
      meta: { rootsCount: built.rootsCount },
    };
  }

  const fallbackExpr = `$${latexSqrt(3)}(${latexSqrt(8)} + ${latexSqrt(12)}) + ${latexSqrt(27)}$`;
  const ps =
    (PROMPT_STYLES as Record<string, any>).B ??
    (PROMPT_STYLES as Record<string, any>)[Object.keys(PROMPT_STYLES)[0] ?? "B"] ??
    PROMPT_STYLES.B;

  return {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C03",
    promptStyleId: ps.id ?? "B",
    marks: 2,
    prompt: ps.template ? ps.template(fallbackExpr) : PROMPT_STYLES.B.template(fallbackExpr),
    answer: `$5${latexSqrt(3)} + 3$`,
    expression: fallbackExpr,
    meta: { rootsCount: 2 },
  };
}