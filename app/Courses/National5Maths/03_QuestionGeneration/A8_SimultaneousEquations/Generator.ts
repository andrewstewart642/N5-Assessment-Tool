import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";

import {
  A8_GENERATOR_FAMILY_EVIDENCE,
  A8_GENERATOR_INVARIANTS,
  A8_HISTORICAL_ROUTE_FINGERPRINTS,
  A8_PAPER_NUMERICAL_CALIBRATION,
} from "./Evidence";
import {
  a8DifficultyBand,
  historicalA8SystemOverlap,
  resolveA8Difficulty,
  selectCalibratedA8Family,
  selectCalibratedA8Route,
  type A8CalibratedRoute,
} from "./Calibration";
import {
  A8_CONTEXT_POOL_SIZE,
  contextShellsFor,
  type A8ContextShell,
  type A8ValueRange,
} from "./ContextLibrary";
import { A8_DERIVED_MASS_CONTEXT_SHELLS } from "./DerivedContextLibrary";
import { assessA8CandidateFidelity, type A8FidelityAssessment } from "./Fidelity";
import { buildA8ContextualPrompt } from "./PromptGrammar";
import type {
  A8EliminationPlan,
  A8GenerateOptions,
  A8GeneratedContext,
  A8GeneratedQuestion,
  A8GeneratorDifficulty,
  A8GeneratorFamily,
  A8GeneratorPaper,
  A8LinearEquation,
} from "./Types";
import { validateA8GeneratedQuestion } from "./Validation";

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = (seed >>> 0) || 0x9e3779b9;
  }

  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)];
  }

  chance(probability: number) {
    return this.next() < probability;
  }
}

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
const clean = (value: number) => Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(8));
const coefficientGcd = (a: number, b: number) => gcd(Math.abs(Math.round(a)), Math.abs(Math.round(b)));
const isIntegerOrHalf = (value: number) => close(value * 2, Math.round(value * 2));
const hasAtMostOneDecimal = (value: number) => close(value * 10, Math.round(value * 10));
const hasAtMostTwoDecimals = (value: number) => close(value * 100, Math.round(value * 100));
const isMultipleOf = (value: number, step: number) => close(value / step, Math.round(value / step));

const scale = (equation: A8LinearEquation, multiplier: number): A8LinearEquation => ({
  a: clean(equation.a * multiplier),
  b: clean(equation.b * multiplier),
  c: clean(equation.c * multiplier),
});

const eliminationPlan = (
  first: A8LinearEquation,
  second: A8LinearEquation,
  variable: "FIRST" | "SECOND",
): A8EliminationPlan => {
  const c1 = variable === "FIRST" ? first.a : first.b;
  const c2 = variable === "FIRST" ? second.a : second.b;
  const target = lcm(Math.abs(c1), Math.abs(c2));
  const m1 = target / Math.abs(c1);
  const m2 = target / Math.abs(c2);
  const s1 = scale(first, m1);
  const s2 = scale(second, m2);
  const s1c = variable === "FIRST" ? s1.a : s1.b;
  const s2c = variable === "FIRST" ? s2.a : s2.b;

  return {
    variable,
    firstMultiplier: m1,
    secondMultiplier: m2,
    combine: Math.sign(s1c) === Math.sign(s2c) ? "SUBTRACT" : "ADD",
    scaledFirst: s1,
    scaledSecond: s2,
  };
};

const choosePaper = (
  seed: number,
  explicitFamily: A8GeneratorFamily | undefined,
  requested?: A8GeneratorPaper,
): A8GeneratorPaper => {
  if (requested) return requested;

  if (explicitFamily) {
    const supported = A8_GENERATOR_FAMILY_EVIDENCE[explicitFamily].supportedPapers;
    if (!supported.length) throw new Error(`No paper evidence exists for ${explicitFamily}.`);
    return supported[Math.abs(seed) % supported.length] as A8GeneratorPaper;
  }

  const p1Count = A8_HISTORICAL_ROUTE_FINGERPRINTS.filter((entry) => entry.paper === "P1").length;
  const total = A8_HISTORICAL_ROUTE_FINGERPRINTS.length;
  return ((Math.abs(seed) + 19) % total) < p1Count ? "P1" : "P2";
};

const coefficientMaximum = (
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
) => {
  if (family === "GRAPH_INTERSECTION_SOLVE") return difficulty === 2 ? 3 : 4;
  if (family === "ABSTRACT_SOLVE") {
    if (difficulty === 1) return 5;
    if (difficulty === 2) return 6;
    return A8_PAPER_NUMERICAL_CALIBRATION.P1.abstract.absoluteCoefficientRangeObserved[1];
  }
  if (family === "CONTEXT_DERIVED_TOTAL") return 7;
  if (paper === "P2") return difficulty === 1 ? 4 : 5;
  if (difficulty === 1) return 5;
  if (difficulty === 2) return 6;
  return 7;
};

const coefficientPair = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
): [[number, number], [number, number]] => {
  const graph = family === "GRAPH_INTERSECTION_SOLVE";
  const contextual = family === "CONTEXT_FORM_AND_SOLVE" || family === "CONTEXT_DERIVED_TOTAL";
  const min = graph ? 1 : 2;
  const max = coefficientMaximum(family, paper, difficulty);

  for (let attempt = 0; attempt < 1800; attempt += 1) {
    let a = rng.int(min, max);
    let b = rng.int(min, max);
    let d = rng.int(min, max);
    let e = rng.int(min, max);

    if (graph) {
      const slot = rng.int(0, 3);
      const values = [a, b, d, e];
      values[slot] = 1;
      [a, b, d, e] = values as [number, number, number, number];
      if (rng.chance(0.5)) b *= -1;
      else e *= -1;
    } else if (!contextual && difficulty > 1 && rng.chance(difficulty === 2 ? 0.42 : 0.62)) {
      if (rng.chance(0.5)) b *= -1;
      else e *= -1;
    }

    if (Math.abs(a) === Math.abs(b) || Math.abs(d) === Math.abs(e)) continue;
    if (!graph && (Math.abs(a) === Math.abs(d) || Math.abs(b) === Math.abs(e))) continue;
    if (contextual && (coefficientGcd(a, b) !== 1 || coefficientGcd(d, e) !== 1)) continue;
    if (a * e - d * b === 0) continue;

    return [[a, b], [d, e]];
  }

  throw new Error("Unable to construct an A8 coefficient candidate.");
};

const abstractSolution = (
  rng: SeededRandom,
  difficulty: A8GeneratorDifficulty,
): [number, number] => {
  if (difficulty === 3 && rng.chance(0.28)) {
    let firstMagnitude = rng.int(1, 11) / 2;
    let secondMagnitude = rng.int(2, 10) / 2;
    if (Number.isInteger(firstMagnitude) && Number.isInteger(secondMagnitude)) firstMagnitude += 0.5;
    return rng.chance(0.5)
      ? [firstMagnitude, -secondMagnitude]
      : [-firstMagnitude, secondMagnitude];
  }

  const positiveMaximum = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const negativeMaximum = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  let positive = rng.int(1, positiveMaximum);
  let negative = rng.int(1, negativeMaximum);
  if (positive === negative) positive = positive === positiveMaximum ? Math.max(1, positive - 1) : positive + 1;

  return rng.chance(0.32) ? [-negative, positive] : [positive, -negative];
};

const graphSolution = (
  rng: SeededRandom,
  difficulty: A8GeneratorDifficulty,
): [number, number] => {
  const firstMinimum = difficulty === 2 ? 2 : 5;
  const firstMaximum = difficulty === 2 ? 8 : 12;
  const secondMinimum = difficulty === 2 ? 3 : 7;
  const secondMaximum = difficulty === 2 ? 10 : 14;
  let first = rng.int(firstMinimum, firstMaximum) / 2;
  let second = rng.int(secondMinimum, secondMaximum) / 2;
  if (Number.isInteger(first)) first += 0.5;
  if (Number.isInteger(second)) second += 0.5;
  if (close(first, second)) second += 1;
  return [first, second];
};

const contextualValueTextureAccepted = (
  values: [number, number],
  shell: A8ContextShell,
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
) => {
  if (family === "CONTEXT_DERIVED_TOTAL") {
    return values.every((value) => value >= 40 && isMultipleOf(value, 10));
  }

  if (paper === "P2") {
    if (shell.kind !== "PURCHASE") return false;
    if (difficulty === 1) return values.every((value) => isMultipleOf(value, 0.5));
    if (difficulty === 2) return values.every((value) => isMultipleOf(value, 0.25));
    return values.every(hasAtMostTwoDecimals);
  }

  if (shell.kind === "MASS") {
    return values.every((value) => Number.isInteger(value) && isMultipleOf(value, 5));
  }
  if (shell.kind === "RESOURCE") {
    if (difficulty === 1) return values.every((value) => isMultipleOf(value, 0.5));
    return values.every(hasAtMostOneDecimal);
  }
  return false;
};

const calibratedValueStep = (
  valueRange: A8ValueRange,
  shell: A8ContextShell,
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
) => {
  if (family === "CONTEXT_DERIVED_TOTAL") return Math.max(valueRange.step, 10);
  if (paper === "P2") {
    if (difficulty === 1) return Math.max(valueRange.step, 0.5);
    if (difficulty === 2) return Math.max(valueRange.step, 0.25);
    return valueRange.step;
  }
  if (shell.kind === "MASS") return Math.max(valueRange.step, 5);
  if (shell.kind === "RESOURCE" && difficulty === 1) return Math.max(valueRange.step, 0.5);
  return valueRange.step;
};

const calibratedValuesFromRange = (
  valueRange: A8ValueRange,
  shell: A8ContextShell,
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
): number[] => {
  const step = calibratedValueStep(valueRange, shell, paper, family, difficulty);
  const firstIndex = Math.ceil((valueRange.min - 1e-9) / step);
  const lastIndex = Math.floor((valueRange.max + 1e-9) / step);
  const values: number[] = [];
  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const value = clean(index * step);
    if (value >= valueRange.min - 1e-9 && value <= valueRange.max + 1e-9) values.push(value);
  }
  return values;
};

const contextualSolution = (
  rng: SeededRandom,
  shell: A8ContextShell,
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
): [number, number] | null => {
  const firstValues = calibratedValuesFromRange(shell.valueRanges[0], shell, paper, family, difficulty);
  const secondValues = calibratedValuesFromRange(shell.valueRanges[1], shell, paper, family, difficulty);
  const pairs: [number, number][] = [];

  for (const first of firstValues) {
    for (const second of secondValues) {
      const values: [number, number] = [first, second];
      if (first <= 0 || second <= 0 || close(first, second)) continue;
      if (contextualValueTextureAccepted(values, shell, paper, family, difficulty)) pairs.push(values);
    }
  }

  return pairs.length ? rng.pick(pairs) : null;
};

const formatNumber = (value: number, decimals = 8) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
};

const equationTerms = (equation: A8LinearEquation, variables: [string, string]) => {
  const terms: string[] = [];
  const append = (coefficient: number, variable: string) => {
    if (coefficient === 0) return;
    const magnitude = Math.abs(coefficient);
    const body = `${magnitude === 1 ? "" : formatNumber(magnitude)}${variable}`;
    if (!terms.length) terms.push(coefficient < 0 ? `-${body}` : body);
    else terms.push(`${coefficient < 0 ? "-" : "+"} ${body}`);
  };

  append(equation.a, variables[0]);
  append(equation.b, variables[1]);
  return terms.join(" ");
};

const equationPlain = (equation: A8LinearEquation, variables: [string, string]) =>
  `${equationTerms(equation, variables)} = ${formatNumber(equation.c)}`;

const equationAlignedLatex = (equation: A8LinearEquation, variables: [string, string]) =>
  `${equationTerms(equation, variables)} &= ${formatNumber(equation.c)}`;

const systemLatex = (
  equations: [A8LinearEquation, A8LinearEquation],
  variables: [string, string],
) => `\\begin{aligned}${equationAlignedLatex(equations[0], variables)}\\\\${equationAlignedLatex(equations[1], variables)}\\end{aligned}`;

const textPart = (value: string): PaperPart => ({ kind: "text", value });
const mathPart = (latex: string, displayMode = false): PaperPart => ({ kind: "math", latex, displayMode });

const NAMES = [
  "Amina", "Ben", "Cara", "Dylan", "Eva", "Fraser", "Hana", "Imran",
  "Jenna", "Kai", "Leah", "Murray", "Nadia", "Owen", "Priya", "Ravi",
  "Sofia", "Tariq", "Una", "Vikram", "Yasmin", "Zara",
] as const;

const distinctNames = (rng: SeededRandom): [string, string, string] => {
  const first = rng.pick(NAMES);
  const second = rng.pick(NAMES.filter((name) => name !== first));
  const third = rng.pick(NAMES.filter((name) => name !== first && name !== second));
  return [first, second, third];
};

const buildContext = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
  shell: A8ContextShell,
  coefficients: [[number, number], [number, number]],
  solution: [number, number],
): A8GeneratedContext => {
  const firstTotal = clean(coefficients[0][0] * solution[0] + coefficients[0][1] * solution[1]);
  const secondTotal = clean(coefficients[1][0] * solution[0] + coefficients[1][1] * solution[1]);
  const context: A8GeneratedContext = {
    contextId: shell.id,
    contextKind: shell.kind,
    itemLabels: [...shell.itemSingular],
    itemPluralLabels: [...shell.itemPlural],
    relationshipLabels: ["first relationship", "second relationship", "third relationship"],
    settingLabel: shell.setting,
    sameSettingLabel: shell.sameSetting,
    resourceLabel: shell.resourceLabel,
    activityLead: shell.activityLead,
    activityVerb: shell.activityVerb,
    unitDimension: shell.unitDimension,
    unitSymbol: shell.unitSymbol,
    unitPromptLabel: shell.unitPromptLabel,
    unitPosition: shell.unitPosition,
    displayDecimals: shell.displayDecimals,
    firstCounts: [...coefficients[0]],
    secondCounts: [...coefficients[1]],
    firstTotal,
    secondTotal,
    promptVariableDefinitions: family === "CONTEXT_DERIVED_TOTAL",
    wordingVariant: rng.int(0, 5),
    promptStructureId: null,
  };

  if (family === "CONTEXT_DERIVED_TOTAL") {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const third: [number, number] = [rng.int(2, 7), rng.int(2, 7)];
      if (third[0] === third[1]) continue;
      if (
        (third[0] === coefficients[0][0] && third[1] === coefficients[0][1]) ||
        (third[0] === coefficients[1][0] && third[1] === coefficients[1][1])
      ) continue;
      context.derivedCounts = third;
      context.derivedTotal = clean(third[0] * solution[0] + third[1] * solution[1]);
      break;
    }
  }

  return context;
};

const equationIsObviouslyReducible = (equation: A8LinearEquation) => {
  if (!Number.isInteger(equation.c)) return false;
  return gcd(coefficientGcd(equation.a, equation.b), Math.abs(Math.round(equation.c))) > 1;
};

const routeScaledCoefficientMaximum = (route: A8CalibratedRoute) => Math.max(
  Math.abs(route.plan.scaledFirst.a),
  Math.abs(route.plan.scaledFirst.b),
  Math.abs(route.plan.scaledSecond.a),
  Math.abs(route.plan.scaledSecond.b),
);

type CalibratedCandidate = {
  route: A8CalibratedRoute;
  fidelity: A8FidelityAssessment;
};

const candidateFitsCalibration = (args: {
  difficulty: A8GeneratorDifficulty;
  paper: A8GeneratorPaper;
  family: A8GeneratorFamily;
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  plans: [A8EliminationPlan, A8EliminationPlan];
  context: A8GeneratedContext | null;
}): CalibratedCandidate | null => {
  const { difficulty, paper, family, equations, solution, plans, context } = args;

  if (equations.some((equation) => close(equation.c, 0))) return null;
  if (close(equations[0].c, equations[1].c)) return null;
  if (equations.some(equationIsObviouslyReducible)) return null;
  if (historicalA8SystemOverlap(equations)) return null;

  const route = selectCalibratedA8Route(plans, family, paper, difficulty);
  if (!route) return null;

  if (family === "ABSTRACT_SOLVE") {
    const observed = A8_PAPER_NUMERICAL_CALIBRATION.P1.abstract;
    if (!equations.every((equation) => Number.isInteger(equation.c))) return null;
    if (equations.some((equation) => {
      const absolute = Math.abs(equation.c);
      return absolute < observed.absoluteConstantRangeObserved[0] || absolute > observed.absoluteConstantRangeObserved[1];
    })) return null;
    if (Math.max(...route.scaledConstants) > observed.preferredScaledConstantMaximumObserved) return null;
    if (solution.filter((value) => value < 0).length !== 1) return null;
    if (difficulty < 3 && !solution.every(Number.isInteger)) return null;
    if (difficulty === 3 && !solution.every(isIntegerOrHalf)) return null;
  }

  if (family === "GRAPH_INTERSECTION_SOLVE") {
    if (paper !== "P1") return null;
    if (!equations.every((equation) => Number.isInteger(equation.c))) return null;
    if (!equations.flatMap((equation) => [equation.a, equation.b]).some((value) => Math.abs(value) === 1)) return null;
    if (!solution.every((value) => value > 0 && isIntegerOrHalf(value))) return null;
    if (Math.max(...route.scaledConstants) > 30) return null;
  }

  if (family === "CONTEXT_FORM_AND_SOLVE") {
    if (!context) return null;
    if (equations.some((equation) => coefficientGcd(equation.a, equation.b) !== 1)) return null;

    if (paper === "P2") {
      if (context.contextKind !== "PURCHASE") return null;
      if (![...solution, context.firstTotal, context.secondTotal].every(hasAtMostTwoDecimals)) return null;
      if (Math.max(...route.scaledConstants) > 500) return null;
    } else if (context.contextKind === "RESOURCE") {
      if (![...solution, context.firstTotal, context.secondTotal, ...route.scaledConstants, route.remainingConstant].every(hasAtMostOneDecimal)) return null;
      if (Math.max(...route.scaledConstants) > 80) return null;
    } else if (context.contextKind === "MASS") {
      if (![...solution, context.firstTotal, context.secondTotal, ...route.scaledConstants].every(Number.isInteger)) return null;
      if (Math.max(...route.scaledConstants) > 1100) return null;
      if (Math.max(context.firstTotal, context.secondTotal) > 350) return null;
      const largeValues = [context.firstTotal, context.secondTotal, ...route.scaledConstants]
        .filter((value) => Math.abs(value) > 100);
      if (!largeValues.every((value) => isMultipleOf(value, 5))) return null;
    } else {
      return null;
    }
  }

  if (family === "CONTEXT_DERIVED_TOTAL") {
    if (paper !== "P2" || !context || context.contextKind !== "MASS") return null;
    if (!context.derivedCounts || context.derivedTotal === undefined) return null;
    if (!solution.every((value) => value >= 40 && isMultipleOf(value, 10))) return null;
    if (!isMultipleOf(context.derivedTotal, 10)) return null;
  }

  const fidelity = assessA8CandidateFidelity({
    difficulty,
    paper,
    family,
    equations,
    solution,
    route,
    context,
  });
  return fidelity.accepted ? { route, fidelity } : null;
};

const chooseVariableSymbols = (rng: SeededRandom, family: A8GeneratorFamily): [string, string] => {
  if (family === "CONTEXT_FORM_AND_SOLVE") {
    return rng.pick<readonly [string, string]>([["x", "y"], ["a", "b"], ["p", "q"], ["m", "n"]] as const) as [string, string];
  }
  if (family === "CONTEXT_DERIVED_TOTAL") {
    return rng.pick<readonly [string, string]>([["p", "e"], ["m", "n"], ["x", "y"]] as const) as [string, string];
  }
  return rng.pick<readonly [string, string]>([["x", "y"], ["c", "d"], ["p", "r"], ["m", "n"], ["a", "b"]] as const) as [string, string];
};

const contextCandidates = (
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
): A8ContextShell[] => {
  const derived = family === "CONTEXT_DERIVED_TOTAL";
  let shells = contextShellsFor(paper, derived);

  if (family === "CONTEXT_FORM_AND_SOLVE") {
    shells = paper === "P2"
      ? shells.filter((shell) => shell.kind === "PURCHASE")
      : shells.filter((shell) => shell.kind === "MASS" || shell.kind === "RESOURCE");
  }

  if (derived) {
    shells = [...shells, ...A8_DERIVED_MASS_CONTEXT_SHELLS].filter((shell) =>
      shell.kind === "MASS" &&
      shell.valueRanges.every((range) => range.max >= 40),
    );
  }

  return shells;
};

export const generateA8Question = (options: A8GenerateOptions): A8GeneratedQuestion => {
  const difficulty = resolveA8Difficulty(options.difficulty);
  const paper = choosePaper(options.seed, options.family, options.paper);
  const familySelection = selectCalibratedA8Family({
    seed: options.seed,
    paper,
    difficulty,
    explicitFamily: options.family,
  });
  const family = familySelection.family;
  const evidence = A8_GENERATOR_FAMILY_EVIDENCE[family];
  const band = a8DifficultyBand(difficulty);
  const rng = new SeededRandom(mixSeed(options.seed, 0xA8C411B));
  const variables = chooseVariableSymbols(rng, family);
  const contextual = family === "CONTEXT_FORM_AND_SOLVE" || family === "CONTEXT_DERIVED_TOTAL";

  if (!evidence.supportedPapers.includes(paper)) {
    throw new Error(`A8 family ${family} has no supplied historical evidence on ${paper}.`);
  }

  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const attemptRng = new SeededRandom(mixSeed(options.seed, 0x51F15EED + attempt * 977));
    const coefficients = coefficientPair(attemptRng, family, paper, difficulty);
    const shells = contextual ? contextCandidates(paper, family) : [];
    if (contextual && !shells.length) {
      throw new Error(`No calibrated A8 context shells are available for ${family} on ${paper}.`);
    }

    const contextRng = new SeededRandom(mixSeed(options.seed, 0xC07E57 + attempt * 193));
    const shell = contextual
      ? shells[positiveModulo(options.seed * 17 + difficulty * 11 + attempt * 5, shells.length)]
      : null;

    let solution: [number, number];
    if (family === "GRAPH_INTERSECTION_SOLVE") {
      solution = graphSolution(attemptRng, difficulty);
    } else if (shell) {
      const contextualCandidate = contextualSolution(contextRng, shell, paper, family, difficulty);
      if (!contextualCandidate) continue;
      solution = contextualCandidate;
    } else {
      solution = abstractSolution(attemptRng, difficulty);
    }

    const equations: [A8LinearEquation, A8LinearEquation] = [
      {
        a: coefficients[0][0],
        b: coefficients[0][1],
        c: clean(coefficients[0][0] * solution[0] + coefficients[0][1] * solution[1]),
      },
      {
        a: coefficients[1][0],
        b: coefficients[1][1],
        c: clean(coefficients[1][0] * solution[0] + coefficients[1][1] * solution[1]),
      },
    ];

    const determinant = equations[0].a * equations[1].b - equations[1].a * equations[0].b;
    if (close(determinant, 0)) continue;

    const plans: [A8EliminationPlan, A8EliminationPlan] = [
      eliminationPlan(equations[0], equations[1], "FIRST"),
      eliminationPlan(equations[0], equations[1], "SECOND"),
    ];
    const context = shell ? buildContext(contextRng, family, shell, coefficients, solution) : null;
    const calibratedCandidate = candidateFitsCalibration({
      difficulty,
      paper,
      family,
      equations,
      solution,
      plans,
      context,
    });
    if (!calibratedCandidate) continue;

    const { route: calibratedRoute, fidelity } = calibratedCandidate;
    let prompt: string;
    let promptParts: PaperPart[];
    let promptSections: A8GeneratedQuestion["promptSections"];
    let visual: A8GeneratedQuestion["visual"] = null;

    if (context) {
      const built = buildA8ContextualPrompt({
        context,
        variables,
        family,
        paper,
        names: distinctNames(contextRng),
      });
      context.promptStructureId = built.promptStructureId;
      prompt = built.prompt;
      promptParts = built.promptParts;
      promptSections = built.sections;
    } else if (family === "GRAPH_INTERSECTION_SOLVE") {
      prompt = `The graph shows two straight lines represented by the equations ${equationPlain(equations[0], variables)} and ${equationPlain(equations[1], variables)}.\nCalculate algebraically the coordinates of their point of intersection, P.`;
      promptParts = [
        textPart("The graph shows two straight lines represented by the equations"),
        mathPart(systemLatex(equations, variables), true),
        textPart("Calculate algebraically the coordinates of their point of intersection, P."),
      ];
      promptSections = [{ label: "", text: prompt, marks: 3 }];
      visual = {
        kind: "STRAIGHT_LINE_SYSTEM",
        xVariable: variables[0],
        yVariable: variables[1],
        firstEquation: equations[0],
        secondEquation: equations[1],
        intersection: solution,
        labelledIntersection: "P",
        numericScaleRequired: false,
        candidateMustReadIntersection: false,
        rendererFamilyId: "A8_SIMULTANEOUS_LINEAR_GRAPH",
      };
    } else {
      prompt = `Solve algebraically the system of equations\n${equationPlain(equations[0], variables)}\n${equationPlain(equations[1], variables)}`;
      promptParts = [
        textPart("Solve algebraically the system of equations"),
        mathPart(systemLatex(equations, variables), true),
      ];
      promptSections = [{ label: "", text: prompt, marks: 3 }];
    }

    const question: A8GeneratedQuestion = {
      generatorId: "A8_SIMULTANEOUS_EQUATIONS_V4",
      instanceId: `A8-${paper}-L${difficulty}-${family}-${options.seed}`,
      seed: options.seed,
      family,
      familyReadiness: evidence.readiness,
      paper,
      difficulty,
      marks: contextual ? 6 : 3,
      variableSymbols: variables,
      equations,
      solution,
      determinant,
      eliminationPlans: plans,
      prompt,
      promptParts,
      promptSections,
      context,
      visual,
      sourceBasis: {
        questionCatalogIds: evidence.questionCatalogIds,
        answerCatalogIds: evidence.answerCatalogIds,
        comparisonFamily: family,
      },
      generationConstraints: [
        ...A8_GENERATOR_INVARIANTS,
        `Difficulty calibration: ${band.label}.`,
        `Family prior on ${paper}: ${familySelection.observedCount}/${familySelection.observedTotal}.`,
        "Generated mathematical system must not be equivalent to a catalogued historical A8 system.",
        "Contextual coefficient rows must not have an immediately visible common factor.",
        paper === "P1"
          ? "Every accepted decimal/fractional step must remain naturally executable by written non-calculator arithmetic."
          : "Calculator availability may broaden number texture, but values and outcomes must remain deliberately constructed and exact.",
      ],
      quality: {
        difficultyBandId: band.id,
        difficultyScore: fidelity.difficultyScore,
        difficultySignals: fidelity.signals,
        calibrationSourceAnchorIds: [...band.sourceAnchors],
        familyObservedCount: familySelection.observedCount,
        familyObservedTotal: familySelection.observedTotal,
        familyObservedProportion: familySelection.observedProportion,
        familyCycleLength: familySelection.cycleLength,
        familyCycleSlot: familySelection.cycleSlot,
        historicalOverlapChecked: true,
        contextPoolSize: A8_CONTEXT_POOL_SIZE + A8_DERIVED_MASS_CONTEXT_SHELLS.length,
        contextId: context?.contextId ?? null,
        contextKind: context?.contextKind ?? null,
        promptStructureId: context?.promptStructureId ?? null,
        rowCommonFactors: [
          coefficientGcd(equations[0].a, equations[0].b),
          coefficientGcd(equations[1].a, equations[1].b),
        ],
        minimumAbsoluteCoefficient: Math.min(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)])),
        maximumAbsoluteCoefficient: Math.max(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)])),
        easiestEliminationMultiplier: Math.max(...calibratedRoute.multipliers),
        largestScaledCoefficient: routeScaledCoefficientMaximum(calibratedRoute),
        largestScaledConstant: Math.max(...calibratedRoute.scaledConstants),
        calibratedRoute: {
          eliminatedVariable: calibratedRoute.eliminatedVariable,
          multipliers: calibratedRoute.multipliers,
          scaledConstants: calibratedRoute.scaledConstants,
          remainingCoefficient: calibratedRoute.remainingCoefficient,
          remainingConstant: calibratedRoute.remainingConstant,
          solvedValue: calibratedRoute.solvedValue,
          routeScore: calibratedRoute.routeScore,
        },
        substitutionRoute: fidelity.substitution,
        paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
      },
    };

    const validation = validateA8GeneratedQuestion(question);
    if (validation.valid) return question;
  }

  throw new Error(`Unable to generate a calibrated A8 ${family} question on ${paper} at difficulty ${difficulty}.`);
};
