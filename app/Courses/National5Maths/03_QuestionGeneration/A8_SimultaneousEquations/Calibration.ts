import {
  A8_DEFAULT_DIFFICULTY_LEVEL,
  A8_DIFFICULTY_BANDS,
  A8_DIFFICULTY_SUPPORT_BY_FAMILY,
  A8_EMPIRICAL_FAMILY_FREQUENCY,
  A8_HISTORICAL_SYSTEM_SIGNATURES,
  A8_PAPER_NUMERICAL_CALIBRATION,
} from "./Evidence";
import type {
  A8EliminationPlan,
  A8GeneratorDifficulty,
  A8GeneratorFamily,
  A8GeneratorPaper,
  A8LinearEquation,
} from "./Types";

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const gcdMany = (values: number[]) => values.reduce((result, value) => gcd(result, value), 0);

export const resolveA8Difficulty = (value?: number): A8GeneratorDifficulty => {
  const resolved = value ?? A8_DEFAULT_DIFFICULTY_LEVEL;
  if (resolved !== 1 && resolved !== 2 && resolved !== 3) {
    throw new Error(`A8 supports the evidence-derived difficulty levels 1, 2 and 3; received ${resolved}.`);
  }
  return resolved;
};

export const a8DifficultyBand = (difficulty: A8GeneratorDifficulty) => {
  const band = A8_DIFFICULTY_BANDS.find((candidate) => candidate.level === difficulty);
  if (!band) throw new Error(`No A8 calibration band exists for difficulty ${difficulty}.`);
  return band;
};

export const a8FamilySupportsDifficulty = (
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
) => A8_DIFFICULTY_SUPPORT_BY_FAMILY[family].includes(difficulty);

type FrequencyCell = {
  family: A8GeneratorFamily;
  count: number;
  total: number;
  proportion: number;
};

const calibratedFrequencyCells = (
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
): FrequencyCell[] => A8_EMPIRICAL_FAMILY_FREQUENCY[paper]
  .filter((cell) => cell.count > 0 && a8FamilySupportsDifficulty(cell.family, difficulty))
  .map((cell) => ({ ...cell, family: cell.family as A8GeneratorFamily }));

/**
 * Smooth weighted round-robin gives a deterministic cycle with the exact
 * observed counts while spreading repeated families through the cycle. This
 * avoids both uniform random sampling and implausible short-run streaks.
 */
const weightedCycle = (cells: FrequencyCell[]): A8GeneratorFamily[] => {
  const total = cells.reduce((sum, cell) => sum + cell.count, 0);
  if (total === 0) return [];

  const current = cells.map(() => 0);
  const cycle: A8GeneratorFamily[] = [];

  for (let slot = 0; slot < total; slot += 1) {
    let bestIndex = 0;
    for (let index = 0; index < cells.length; index += 1) {
      current[index] += cells[index].count;
      if (current[index] > current[bestIndex]) bestIndex = index;
    }
    cycle.push(cells[bestIndex].family);
    current[bestIndex] -= total;
  }

  return cycle;
};

export type A8CalibratedFamilySelection = {
  family: A8GeneratorFamily;
  observedCount: number;
  observedTotal: number;
  observedProportion: number;
  cycleLength: number;
  cycleSlot: number;
};

export const selectCalibratedA8Family = (args: {
  seed: number;
  paper: A8GeneratorPaper;
  difficulty: A8GeneratorDifficulty;
  explicitFamily?: A8GeneratorFamily;
}): A8CalibratedFamilySelection => {
  const cells = calibratedFrequencyCells(args.paper, args.difficulty);

  if (args.explicitFamily) {
    if (!a8FamilySupportsDifficulty(args.explicitFamily, args.difficulty)) {
      const supported = A8_DIFFICULTY_SUPPORT_BY_FAMILY[args.explicitFamily].join(", ");
      throw new Error(`${args.explicitFamily} is calibrated only for A8 difficulty level(s) ${supported}.`);
    }
    const observed = A8_EMPIRICAL_FAMILY_FREQUENCY[args.paper]
      .find((cell) => cell.family === args.explicitFamily);
    if (!observed || observed.count === 0) {
      throw new Error(`${args.explicitFamily} has no historical A8 evidence on ${args.paper}.`);
    }
    return {
      family: args.explicitFamily,
      observedCount: observed.count,
      observedTotal: observed.total,
      observedProportion: observed.proportion,
      cycleLength: 1,
      cycleSlot: 0,
    };
  }

  const cycle = weightedCycle(cells);
  if (!cycle.length) {
    throw new Error(`No calibrated A8 family is available on ${args.paper} at difficulty ${args.difficulty}.`);
  }

  // Offset avoids tying family choice to other seeded random draws while still
  // preserving an exact weighted cycle across consecutive teacher-facing seeds.
  const slot = positiveModulo(args.seed + 37, cycle.length);
  const family = cycle[slot];
  const observed = A8_EMPIRICAL_FAMILY_FREQUENCY[args.paper]
    .find((cell) => cell.family === family);

  if (!observed) throw new Error(`Missing A8 frequency evidence for ${family} on ${args.paper}.`);

  return {
    family,
    observedCount: observed.count,
    observedTotal: observed.total,
    observedProportion: observed.proportion,
    cycleLength: cycle.length,
    cycleSlot: slot,
  };
};

const multiplierKey = (plan: A8EliminationPlan) => [
  plan.firstMultiplier,
  plan.secondMultiplier,
].sort((a, b) => a - b).join(":");

export const calibratedMultiplierKeys = (
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
): string[] => {
  if (family === "ABSTRACT_SOLVE") {
    // All five historical abstract Paper 1 questions use a clean 2-and-3 or
    // 3-and-2 scaling route. Difficulty changes other burden, not this process.
    return ["2:3"];
  }
  if (family === "GRAPH_INTERSECTION_SOLVE") {
    return ["1:3"];
  }
  if (family === "CONTEXT_DERIVED_TOTAL") {
    return ["3:4"];
  }
  if (paper === "P2") {
    return ["2:3"];
  }
  if (difficulty === 1) return ["2:3"];
  return ["2:3", "3:4"];
};

export type A8CalibratedRoute = {
  plan: A8EliminationPlan;
  eliminatedVariable: "FIRST" | "SECOND";
  multipliers: [number, number];
  scaledConstants: [number, number];
  remainingCoefficient: number;
  remainingConstant: number;
  solvedValue: number;
  routeScore: number;
};

const routeResult = (plan: A8EliminationPlan): A8CalibratedRoute | null => {
  const operation = plan.combine === "ADD" ? 1 : -1;
  const remainingCoefficient = plan.variable === "FIRST"
    ? plan.scaledFirst.b + operation * plan.scaledSecond.b
    : plan.scaledFirst.a + operation * plan.scaledSecond.a;
  const remainingConstant = plan.scaledFirst.c + operation * plan.scaledSecond.c;

  if (close(remainingCoefficient, 0)) return null;
  const solvedValue = remainingConstant / remainingCoefficient;
  const scaledConstants: [number, number] = [
    Math.abs(plan.scaledFirst.c),
    Math.abs(plan.scaledSecond.c),
  ];

  return {
    plan,
    eliminatedVariable: plan.variable,
    multipliers: [plan.firstMultiplier, plan.secondMultiplier],
    scaledConstants,
    remainingCoefficient,
    remainingConstant,
    solvedValue,
    routeScore:
      Math.max(plan.firstMultiplier, plan.secondMultiplier) * 10 +
      Math.max(...scaledConstants) * 0.01 +
      Math.abs(remainingCoefficient) * 0.001,
  };
};

export const selectCalibratedA8Route = (
  plans: [A8EliminationPlan, A8EliminationPlan],
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
): A8CalibratedRoute | null => {
  const allowed = new Set(calibratedMultiplierKeys(family, paper, difficulty));
  return plans
    .filter((plan) => allowed.has(multiplierKey(plan)))
    .map(routeResult)
    .filter((route): route is A8CalibratedRoute => route !== null)
    .sort((first, second) => first.routeScore - second.routeScore)[0] ?? null;
};

const canonicalRow = (equation: A8LinearEquation) => {
  // A8 generated values are at most hundredths on P2 and tenths on P1.
  const scaled = [equation.a, equation.b, equation.c].map((value) => Math.round(value * 100));
  const divisor = gcdMany(scaled.map(Math.abs)) || 1;
  const reduced = scaled.map((value) => value / divisor);
  const firstNonZero = reduced.find((value) => value !== 0) ?? 1;
  const signed = firstNonZero < 0 ? reduced.map((value) => -value) : reduced;
  return signed.join(",");
};

export const canonicalA8SystemSignature = (
  equations: [A8LinearEquation, A8LinearEquation],
) => equations.map(canonicalRow).sort().join("|");

const HISTORICAL_SIGNATURES = new Map(
  A8_HISTORICAL_SYSTEM_SIGNATURES.map((entry) => [
    canonicalA8SystemSignature([
      { a: entry.equations[0][0], b: entry.equations[0][1], c: entry.equations[0][2] },
      { a: entry.equations[1][0], b: entry.equations[1][1], c: entry.equations[1][2] },
    ]),
    entry.sourceQuestionId,
  ]),
);

export const historicalA8SystemOverlap = (
  equations: [A8LinearEquation, A8LinearEquation],
): string | null => HISTORICAL_SIGNATURES.get(canonicalA8SystemSignature(equations)) ?? null;

export const A8_GENERATOR_CALIBRATION = {
  difficultyBands: A8_DIFFICULTY_BANDS,
  difficultySupportByFamily: A8_DIFFICULTY_SUPPORT_BY_FAMILY,
  empiricalFamilyFrequency: A8_EMPIRICAL_FAMILY_FREQUENCY,
  paperNumericalCalibration: A8_PAPER_NUMERICAL_CALIBRATION,
} as const;
