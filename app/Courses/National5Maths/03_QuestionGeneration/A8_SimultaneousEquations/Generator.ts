import { A8_GENERATOR_FAMILY_EVIDENCE, A8_GENERATOR_INVARIANTS } from "./Evidence";
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
  constructor(seed: number) { this.state = (seed >>> 0) || 0x9e3779b9; }
  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number) { return Math.floor(this.next() * (max - min + 1)) + min; }
  pick<T>(values: readonly T[]): T { return values[this.int(0, values.length - 1)]; }
  chance(probability: number) { return this.next() < probability; }
}

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
const clean = (value: number) => Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(6));
const scale = (equation: A8LinearEquation, multiplier: number): A8LinearEquation => ({ a: clean(equation.a * multiplier), b: clean(equation.b * multiplier), c: clean(equation.c * multiplier) });

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
  return { variable, firstMultiplier: m1, secondMultiplier: m2, combine: Math.sign(s1c) === Math.sign(s2c) ? "SUBTRACT" : "ADD", scaledFirst: s1, scaledSecond: s2 };
};

const chooseFamily = (rng: SeededRandom, options: A8GenerateOptions): A8GeneratorFamily => {
  if (options.family) return options.family;
  const core: A8GeneratorFamily[] = ["ABSTRACT_SOLVE", "CONTEXT_FORM_AND_SOLVE"];
  if (options.includeExperimentalFamilies) core.push("GRAPH_INTERSECTION_SOLVE", "CONTEXT_DERIVED_TOTAL");
  return rng.pick(core);
};

const choosePaper = (rng: SeededRandom, family: A8GeneratorFamily, requested?: A8GeneratorPaper): A8GeneratorPaper => {
  if (requested) return requested;
  const supported = A8_GENERATOR_FAMILY_EVIDENCE[family].supportedPapers;
  return supported.length ? rng.pick(supported) : "P1";
};

const coefficientPair = (rng: SeededRandom, difficulty: A8GeneratorDifficulty, contextual: boolean): [[number, number], [number, number]] => {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const min = contextual ? 2 : 1;
    const max = difficulty <= 2 ? 5 : difficulty <= 4 ? 7 : 9;
    let a = rng.int(min, max);
    let b = rng.int(min, max);
    let d = rng.int(min, max);
    let e = rng.int(min, max);
    if (!contextual && rng.chance(0.45)) b *= -1;
    if (!contextual && rng.chance(0.35)) e *= -1;
    const det = a * e - d * b;
    if (det === 0) continue;
    const plans = [
      [lcm(Math.abs(a), Math.abs(d)) / Math.abs(a), lcm(Math.abs(a), Math.abs(d)) / Math.abs(d)],
      [lcm(Math.abs(b), Math.abs(e)) / Math.abs(b), lcm(Math.abs(b), Math.abs(e)) / Math.abs(e)],
    ];
    const best = Math.min(...plans.map(([m1, m2]) => Math.max(m1, m2)));
    if (best <= 1) continue;
    if (difficulty <= 2 && best > 3) continue;
    if (difficulty >= 4 && best < 2) continue;
    return [[a, b], [d, e]];
  }
  throw new Error("Unable to construct a non-degenerate A8 coefficient matrix for the requested difficulty.");
};

const abstractSolution = (rng: SeededRandom, difficulty: A8GeneratorDifficulty): [number, number] => {
  const value = () => {
    const base = rng.int(-7, 8) || 2;
    if (difficulty >= 4 && rng.chance(0.35)) return base + 0.5;
    return base;
  };
  let x = value();
  let y = value();
  if (x === y && rng.chance(0.5)) y += 1;
  return [x, y];
};

const CONTEXTS = [
  { id: "STATIONERY_COST", items: ["notebook", "pen set"] as [string, string], relationships: ["first order", "second order", "third order"] as [string, string, string], dimension: "currency" as const, unit: "£", position: "PREFIX" as const, decimals: 2 },
  { id: "WAREHOUSE_MASS", items: ["tile crate", "grout bag"] as [string, string], relationships: ["first load", "second load", "third load"] as [string, string, string], dimension: "mass" as const, unit: "kg", position: "SUFFIX" as const, decimals: 0 },
  { id: "DISPLAY_MATERIAL", items: ["large panel", "small panel"] as [string, string], relationships: ["first display", "second display", "third display"] as [string, string, string], dimension: "area" as const, unit: "m²", position: "SUFFIX" as const, decimals: 1 },
  { id: "ACTIVITY_TOKENS", items: ["blue token pack", "green token pack"] as [string, string], relationships: ["first kit", "second kit", "third kit"] as [string, string, string], dimension: "count" as const, unit: "tokens", position: "SUFFIX" as const, decimals: 0 },
] as const;

const contextualSolution = (rng: SeededRandom, context: typeof CONTEXTS[number], difficulty: A8GeneratorDifficulty): [number, number] => {
  if (context.dimension === "currency") {
    const candidates = difficulty <= 2 ? [0.5, 0.75, 1.25, 1.5, 2, 2.25] : [0.35, 0.55, 0.8, 1.15, 1.45, 1.75, 2.4];
    const x = rng.pick(candidates);
    let y = rng.pick(candidates);
    if (x === y) y = rng.pick(candidates.filter((v) => v !== x));
    return [x, y];
  }
  if (context.dimension === "area") {
    const values = [1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.2];
    const x = rng.pick(values);
    let y = rng.pick(values);
    if (x === y) y = rng.pick(values.filter((v) => v !== x));
    return [x, y];
  }
  const min = context.dimension === "mass" ? 20 : 4;
  const max = context.dimension === "mass" ? 180 : 30;
  const step = context.dimension === "mass" ? 5 : 1;
  const x = rng.int(Math.ceil(min / step), Math.floor(max / step)) * step;
  let y = rng.int(Math.ceil(min / step), Math.floor(max / step)) * step;
  if (x === y) y += step;
  return [x, y];
};

const formatNumber = (value: number, decimals = 6) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
};

const equationPlain = (equation: A8LinearEquation, variables: [string, string]) => {
  const terms: string[] = [];
  const append = (coefficient: number, variable: string) => {
    if (coefficient === 0) return;
    const abs = Math.abs(coefficient);
    const body = `${abs === 1 ? "" : formatNumber(abs)}${variable}`;
    if (!terms.length) terms.push(coefficient < 0 ? `-${body}` : body);
    else terms.push(`${coefficient < 0 ? "-" : "+"} ${body}`);
  };
  append(equation.a, variables[0]);
  append(equation.b, variables[1]);
  return `${terms.join(" ")} = ${formatNumber(equation.c)}`;
};

const totalText = (context: A8GeneratedContext, value: number) => {
  const number = context.displayDecimals > 0 ? value.toFixed(context.displayDecimals) : formatNumber(value);
  return context.unitPosition === "PREFIX" ? `${context.unitSymbol}${number}` : `${number} ${context.unitSymbol}`;
};

const buildContext = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
  template: typeof CONTEXTS[number],
  coefficients: [[number, number], [number, number]],
  solution: [number, number],
): A8GeneratedContext => {
  const firstTotal = clean(coefficients[0][0] * solution[0] + coefficients[0][1] * solution[1]);
  const secondTotal = clean(coefficients[1][0] * solution[0] + coefficients[1][1] * solution[1]);
  const context: A8GeneratedContext = {
    contextId: template.id,
    itemLabels: [...template.items],
    relationshipLabels: [...template.relationships],
    unitDimension: template.dimension,
    unitSymbol: template.unit,
    unitPosition: template.position,
    displayDecimals: template.decimals,
    firstCounts: [...coefficients[0]],
    secondCounts: [...coefficients[1]],
    firstTotal,
    secondTotal,
    promptVariableDefinitions: family === "CONTEXT_DERIVED_TOTAL",
  };
  if (family === "CONTEXT_DERIVED_TOTAL") {
    let third: [number, number] = [rng.int(2, 8), rng.int(2, 8)];
    if (third[0] === coefficients[0][0] && third[1] === coefficients[0][1]) third = [third[0] + 1, third[1]];
    context.derivedCounts = third;
    context.derivedTotal = clean(third[0] * solution[0] + third[1] * solution[1]);
  }
  return context;
};

const contextualPrompt = (context: A8GeneratedContext, variables: [string, string], family: A8GeneratorFamily) => {
  const [item1, item2] = context.itemLabels;
  const [firstLabel, secondLabel, thirdLabel] = context.relationshipLabels;
  const first = `${firstLabel} contains ${context.firstCounts[0]} ${item1}${context.firstCounts[0] === 1 ? "" : "s"} and ${context.firstCounts[1]} ${item2}${context.firstCounts[1] === 1 ? "" : "s"}; its total is ${totalText(context, context.firstTotal)}.`;
  const second = `${secondLabel} contains ${context.secondCounts[0]} ${item1}${context.secondCounts[0] === 1 ? "" : "s"} and ${context.secondCounts[1]} ${item2}${context.secondCounts[1] === 1 ? "" : "s"}; its total is ${totalText(context, context.secondTotal)}.`;
  const definition = context.promptVariableDefinitions ? `Let ${variables[0]} represent one ${item1} and ${variables[1]} represent one ${item2}. ` : "";
  const a = `${definition}Write a linear equation for the ${firstLabel}.`;
  const b = `Write a second linear equation for the ${secondLabel}.`;
  const c = family === "CONTEXT_DERIVED_TOTAL" && context.derivedCounts && context.derivedTotal !== undefined
    ? `Use algebra to determine the total for ${context.derivedCounts[0]} ${item1}${context.derivedCounts[0] === 1 ? "" : "s"} and ${context.derivedCounts[1]} ${item2}${context.derivedCounts[1] === 1 ? "" : "s"} in the ${thirdLabel}.`
    : `Use algebra to determine the value of one ${item1} and one ${item2}.`;
  return { prompt: `${first} (a) ${a}\n${second} (b) ${b}\n(c) ${c}`, sections: [
    { label: "a" as const, text: `${first} ${a}`, marks: 1 },
    { label: "b" as const, text: `${second} ${b}`, marks: 1 },
    { label: "c" as const, text: c, marks: 4 },
  ] };
};

export const generateA8Question = (options: A8GenerateOptions): A8GeneratedQuestion => {
  const rng = new SeededRandom(options.seed);
  const difficulty = options.difficulty ?? 3;
  const family = chooseFamily(rng, options);
  const evidence = A8_GENERATOR_FAMILY_EVIDENCE[family];
  if (evidence.readiness === "EXPERIMENTAL" && !options.includeExperimentalFamilies && !options.family) {
    throw new Error(`A8 family ${family} is experimental and requires includeExperimentalFamilies=true when selected automatically.`);
  }
  const paper = choosePaper(rng, family, options.paper);
  if (!evidence.supportedPapers.includes(paper)) {
    throw new Error(`A8 family ${family} has no supplied historical evidence on ${paper}; choose one of ${evidence.supportedPapers.join(", ")}.`);
  }
  const contextual = family === "CONTEXT_FORM_AND_SOLVE" || family === "CONTEXT_DERIVED_TOTAL";
  const coefficients = coefficientPair(rng, difficulty, contextual);
  const contextTemplate = contextual ? rng.pick(CONTEXTS) : null;
  const solution = contextual && contextTemplate ? contextualSolution(rng, contextTemplate, difficulty) : abstractSolution(rng, difficulty);
  const equations: [A8LinearEquation, A8LinearEquation] = [
    { a: coefficients[0][0], b: coefficients[0][1], c: clean(coefficients[0][0] * solution[0] + coefficients[0][1] * solution[1]) },
    { a: coefficients[1][0], b: coefficients[1][1], c: clean(coefficients[1][0] * solution[0] + coefficients[1][1] * solution[1]) },
  ];
  const determinant = equations[0].a * equations[1].b - equations[1].a * equations[0].b;
  const variables: [string, string] = contextual && family !== "CONTEXT_DERIVED_TOTAL" ? ["u", "v"] : rng.pick<readonly [string, string]>([["x", "y"], ["p", "q"], ["m", "n"]] as const) as [string, string];
  const plans: [A8EliminationPlan, A8EliminationPlan] = [eliminationPlan(equations[0], equations[1], "FIRST"), eliminationPlan(equations[0], equations[1], "SECOND")];
  let context: A8GeneratedContext | null = null;
  let prompt: string;
  let promptSections: A8GeneratedQuestion["promptSections"];
  let visual: A8GeneratedQuestion["visual"] = null;
  if (contextual) {
    context = buildContext(rng, family, contextTemplate!, coefficients, solution);
    const built = contextualPrompt(context, variables, family);
    prompt = built.prompt;
    promptSections = built.sections;
  } else if (family === "GRAPH_INTERSECTION_SOLVE") {
    prompt = `Two straight lines are represented by ${equationPlain(equations[0], variables)} and ${equationPlain(equations[1], variables)}. Their intersection is labelled P on a supporting graph. Use algebra to determine the coordinates of P.`;
    promptSections = [{ label: "", text: prompt, marks: 3 }];
    visual = { kind: "STRAIGHT_LINE_SYSTEM", xVariable: variables[0], yVariable: variables[1], firstEquation: equations[0], secondEquation: equations[1], intersection: solution, labelledIntersection: "P", numericScaleRequired: false, candidateMustReadIntersection: false, rendererFamilyId: "A8_SIMULTANEOUS_LINEAR_GRAPH" };
  } else {
    prompt = `Use algebra to solve the simultaneous equations:\n${equationPlain(equations[0], variables)}\n${equationPlain(equations[1], variables)}`;
    promptSections = [{ label: "", text: prompt, marks: 3 }];
  }
  const question: A8GeneratedQuestion = {
    generatorId: "A8_SIMULTANEOUS_EQUATIONS_V1",
    instanceId: `A8-${family}-${options.seed}`,
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
    promptSections,
    context,
    visual,
    sourceBasis: { questionCatalogIds: evidence.questionCatalogIds, answerCatalogIds: evidence.answerCatalogIds, comparisonFamily: family },
    generationConstraints: [...A8_GENERATOR_INVARIANTS],
  };
  const validation = validateA8GeneratedQuestion(question);
  if (!validation.valid) throw new Error(`Generated A8 question failed validation: ${validation.issues.map((issue) => `${issue.code}: ${issue.message}`).join("; ")}`);
  return question;
};
