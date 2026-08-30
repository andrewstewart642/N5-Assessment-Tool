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
    return supported[Math.abs(seed) % supported.length] ?? supported[0];
  }

  const p1Count = A8_HISTORICAL_ROUTE_FINGERPRINTS.filter((entry) => entry.paper === "P1").length;
  const total = A8_HISTORICAL_ROUTE_FINGERPRINTS.length;
  return ((Math.abs(seed) + 19) % total) < p1Count ? "P1" : "P2";
};

const coefficientMaximum = (
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
) => {
  if (family === "GRAPH_INTERSECTION_SOLVE") return 4;
  if (family === "ABSTRACT_SOLVE") {
    return A8_PAPER_NUMERICAL_CALIBRATION.P1.abstract.absoluteCoefficientRangeObserved[1];
  }
  if (family === "CONTEXT_DERIVED_TOTAL") return 7;
  return paper === "P1" ? 7 : 5;
};

/**
 * Coefficient generation creates candidates only; the calibrated route checker
 * below decides whether the complete system lies inside the historical A8
 * burden. This deliberately avoids crude rules such as "larger coefficient =
 * harder".
 */
const coefficientPair = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
): [[number, number], [number, number]] => {
  const graph = family === "GRAPH_INTERSECTION_SOLVE";
  const contextual = family === "CONTEXT_FORM_AND_SOLVE" || family === "CONTEXT_DERIVED_TOTAL";
  const min = graph ? 1 : 2;
  const max = coefficientMaximum(family, paper);

  for (let attempt = 0; attempt < 1500; attempt += 1) {
    let a = rng.int(min, max);
    let b = rng.int(min, max);
    let d = rng.int(min, max);
    let e = rng.int(min, max);

    if (graph) {
      // The single graph source contains coefficient 1 and one negative term;
      // stay close to that representation burden rather than generalising the
      // abstract-family coefficient restrictions to this family.
      const slot = rng.int(0, 3);
      const values = [a, b, d, e];
      values[slot] = 1;
      [a, b, d, e] = values as [number, number, number, number];
      if (rng.chance(0.5)) b *= -1;
      else e *= -1;
    } else if (!contextual && rng.chance(0.55)) {
      // Historical abstract systems use either all-positive coefficients or a
      // single negative second-variable coefficient.
      if (rng.chance(0.5)) b *= -1;
      else e *= -1;
    }

    if (Math.abs(a) === Math.abs(b) || Math.abs(d) === Math.abs(e)) continue;
    if (!graph && (Math.abs(a) === Math.abs(d) || Math.abs(b) === Math.abs(e))) continue;
    if (a * e - d * b === 0) continue;

    return [[a, b], [d, e]];
  }

  throw new Error("Unable to construct an A8 coefficient candidate.");
};

const abstractSolution = (
  rng: SeededRandom,
  difficulty: A8GeneratorDifficulty,
): [number, number] => {
  if (difficulty === 3 && rng.chance(0.22)) {
    const firstMagnitude = rng.int(1, 9) / 2;
    const secondMagnitude = rng.int(2, 10) / 2;
    return rng.chance(0.5)
      ? [firstMagnitude, -secondMagnitude]
      : [-firstMagnitude, secondMagnitude];
  }

  const positiveMaximum = difficulty === 1 ? 7 : 6;
  const negativeMaximum = difficulty === 1 ? 4 : 5;
  let positive = rng.int(1, positiveMaximum);
  let negative = rng.int(1, negativeMaximum);
  if (positive === negative) positive = positive === positiveMaximum ? positive - 1 : positive + 1;

  return rng.chance(0.3) ? [-negative, positive] : [positive, -negative];
};

const graphSolution = (rng: SeededRandom): [number, number] => {
  let first = rng.int(1, 11) / 2;
  let second = rng.int(3, 13) / 2;
  if (Number.isInteger(first)) first += 0.5;
  if (Number.isInteger(second)) second += 0.5;
  if (first === second) second += 1;
  return [first, second];
};

const valueFromRange = (rng: SeededRandom, valueRange: A8ValueRange) => {
  const stepCount = Math.round((valueRange.max - valueRange.min) / valueRange.step);
  return clean(valueRange.min + rng.int(0, stepCount) * valueRange.step);
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

  if (shell.kind === "MASS") return values.every(Number.isInteger);
  if (shell.kind === "RESOURCE") {
    if (difficulty === 1) return values.every((value) => isMultipleOf(value, 0.5));
    return values.every(hasAtMostOneDecimal);
  }
  return false;
};

const contextualSolution = (
  rng: SeededRandom,
  shell: A8ContextShell,
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  difficulty: A8GeneratorDifficulty,
): [number, number] => {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const values: [number, number] = [
      valueFromRange(rng, shell.valueRanges[0]),
      valueFromRange(rng, shell.valueRanges[1]),
    ];
    if (values[0] <= 0 || values[1] <= 0 || close(values[0], values[1])) continue;
    if (contextualValueTextureAccepted(values, shell, paper, family, difficulty)) return values;
  }

  throw new Error(`Unable to choose calibrated values for A8 context ${shell.id}.`);
};

const formatNumber = (value: number, decimals = 8) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
};

const equationPlain = (equation: A8LinearEquation, variables: [string, string]) => {
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
  return `${terms.join(" ")} = ${formatNumber(equation.c)}`;
};

const equationLatex = (equation: A8LinearEquation, variables: [string, string]) =>
  equationPlain(equation, variables);

const textPart = (value: string): PaperPart => ({ kind: "text", value });
const mathPart = (latex: string, displayMode = false): PaperPart => ({ kind: "math", latex, displayMode });

const promptValue = (context: A8GeneratedContext, value: number) => {
  if (context.unitDimension === "currency") return `£${value.toFixed(2)}`;
  const numeric = context.displayDecimals > 0
    ? value.toFixed(context.displayDecimals).replace(/\.0+$/, "")
    : formatNumber(value);
  return `${numeric} ${context.unitPromptLabel}`;
};

const singularOrPlural = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

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
    wordingVariant: rng.int(0, 2),
  };

  if (family === "CONTEXT_DERIVED_TOTAL") {
    for (let attempt = 0; attempt < 100; attempt += 1) {
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

const equationCommand = (variant: number, second: boolean) => {
  const choices = second
    ? [
        "Write down a second equation which represents this information.",
        "Write down an equation to represent this information.",
        "Write a second equation for this information.",
      ]
    : [
        "Write down an equation which represents this information.",
        "Write down an equation to represent this information.",
        "Write an equation for this information.",
      ];
  return choices[variant % choices.length];
};

const finalSolveCommand = (context: A8GeneratedContext, paper: A8GeneratorPaper) => {
  const [firstItem, secondItem] = context.itemLabels;
  const algebraically = paper === "P2" || context.wordingVariant === 1;
  const algebraicWord = algebraically ? " algebraically" : "";

  if (context.contextKind === "PURCHASE") {
    return `Calculate${algebraicWord} the cost of one ${firstItem} and one ${secondItem}.`;
  }
  if (context.contextKind === "MASS") {
    return `Calculate${algebraicWord} the mass of one ${firstItem} and one ${secondItem}.`;
  }
  return `Calculate${algebraicWord} the amount of ${context.resourceLabel} needed for one ${firstItem} and one ${secondItem}.`;
};

const contextualPrompt = (
  rng: SeededRandom,
  context: A8GeneratedContext,
  variables: [string, string],
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
) => {
  const [name1, name2, name3] = distinctNames(rng);
  const [item1, item2] = context.itemLabels;
  const [item1Plural, item2Plural] = context.itemPluralLabels;
  const firstItems = `${singularOrPlural(context.firstCounts[0], item1, item1Plural)} and ${singularOrPlural(context.firstCounts[1], item2, item2Plural)}`;
  const secondItems = `${singularOrPlural(context.secondCounts[0], item1, item1Plural)} and ${singularOrPlural(context.secondCounts[1], item2, item2Plural)}`;
  const firstTotal = promptValue(context, context.firstTotal);
  const secondTotal = promptValue(context, context.secondTotal);

  let introduction = "";
  let firstStatement = "";
  let secondStatement = "";

  if (context.contextKind === "PURCHASE") {
    if (context.wordingVariant === 0) {
      firstStatement = `${name1} buys ${firstItems} ${context.settingLabel}.\nThe total cost is ${firstTotal}.`;
      secondStatement = `${name2} buys ${secondItems} ${context.sameSettingLabel}.\nThe total cost is ${secondTotal}.`;
    } else if (context.wordingVariant === 1) {
      firstStatement = `${name1} pays ${firstTotal} for ${firstItems} ${context.settingLabel}.`;
      secondStatement = `${name2} pays ${secondTotal} for ${secondItems} ${context.sameSettingLabel}.`;
    } else {
      firstStatement = `${name1} purchases ${firstItems} ${context.settingLabel}.\nAltogether they cost ${firstTotal}.`;
      secondStatement = `${name2} purchases ${secondItems} ${context.sameSettingLabel}.\nAltogether they cost ${secondTotal}.`;
    }
  } else if (context.contextKind === "MASS") {
    if (context.wordingVariant === 0) {
      firstStatement = `${name1} loads ${firstItems} ${context.settingLabel}.\nThe total mass is ${firstTotal}.`;
      secondStatement = `${name2} loads ${secondItems} ${context.sameSettingLabel}.\nThe total mass is ${secondTotal}.`;
    } else if (context.wordingVariant === 1) {
      firstStatement = `A load prepared by ${name1} contains ${firstItems}.\nIts total mass is ${firstTotal}.`;
      secondStatement = `A second load prepared by ${name2} contains ${secondItems}.\nIts total mass is ${secondTotal}.`;
    } else {
      firstStatement = `${name1} has ${firstItems} ${context.settingLabel}.\nTogether they have a mass of ${firstTotal}.`;
      secondStatement = `${name2} has ${secondItems} ${context.sameSettingLabel}.\nTogether they have a mass of ${secondTotal}.`;
    }
  } else {
    introduction = `${name1} ${context.activityLead ?? "is making two types of item"}.`;
    const verb = context.activityVerb ?? "makes";
    if (context.wordingVariant === 0) {
      firstStatement = `In one batch, ${name1} ${verb} ${firstItems}.\nThe total amount of ${context.resourceLabel} used is ${firstTotal}.`;
      secondStatement = `In another batch, ${name1} ${verb} ${secondItems}.\nThe total amount of ${context.resourceLabel} used is ${secondTotal}.`;
    } else if (context.wordingVariant === 1) {
      firstStatement = `On Monday, ${name1} ${verb} ${firstItems}.\nThe total amount of ${context.resourceLabel} used is ${firstTotal}.`;
      secondStatement = `On Tuesday, ${name1} ${verb} ${secondItems}.\nThe total amount of ${context.resourceLabel} used is ${secondTotal}.`;
    } else {
      firstStatement = `For one order, ${name1} ${verb} ${firstItems}.\nThis uses ${firstTotal} of ${context.resourceLabel}.`;
      secondStatement = `For a second order, ${name1} ${verb} ${secondItems}.\nThis uses ${secondTotal} of ${context.resourceLabel}.`;
    }
  }

  const variableDefinition = context.promptVariableDefinitions
    ? `Let ${variables[0]} be the ${context.contextKind === "MASS" ? "mass" : "value"} of one ${item1} and ${variables[1]} be the ${context.contextKind === "MASS" ? "mass" : "value"} of one ${item2}.`
    : "";

  const aCommand = `(a) ${equationCommand(context.wordingVariant, false)}`;
  const bCommand = `(b) ${equationCommand(context.wordingVariant, true)}`;
  let cCommand = `(c) ${finalSolveCommand(context, paper)}`;

  if (family === "CONTEXT_DERIVED_TOTAL" && context.derivedCounts && context.derivedTotal !== undefined) {
    const thirdItems = `${singularOrPlural(context.derivedCounts[0], item1, item1Plural)} and ${singularOrPlural(context.derivedCounts[1], item2, item2Plural)}`;
    cCommand = `${name3} has ${thirdItems} on a third load.\n(c) Calculate the total mass of these items.`;
  }

  const fullPrompt = [
    introduction,
    variableDefinition,
    firstStatement,
    aCommand,
    "",
    secondStatement,
    bCommand,
    "",
    cCommand,
  ].join("\n").replace(/^\n+|\n+$/g, "").replace(/\n{3,}/g, "\n\n");

  return {
    prompt: fullPrompt,
    promptParts: [textPart(fullPrompt)],
    sections: [
      { label: "a" as const, text: [introduction, variableDefinition, firstStatement, aCommand].filter(Boolean).join("\n"), marks: 1 },
      { label: "b" as const, text: `${secondStatement}\n${bCommand}`, marks: 1 },
      { label: "c" as const, text: cCommand, marks: 4 },
    ],
  };
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

const candidateFitsCalibration = (args: {
  difficulty: A8GeneratorDifficulty;
  paper: A8GeneratorPaper;
  family: A8GeneratorFamily;
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  plans: [A8EliminationPlan, A8EliminationPlan];
  context: A8GeneratedContext | null;
}): A8CalibratedRoute | null => {
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

    if (paper === "P2") {
      if (context.contextKind !== "PURCHASE") return null;
      if (![...solution, context.firstTotal, context.secondTotal].every(hasAtMostTwoDecimals)) return null;
      if (Math.max(...route.scaledConstants) > 500) return null;
    } else if (context.contextKind === "RESOURCE") {
      if (![...solution, context.firstTotal, context.secondTotal, ...route.scaledConstants, route.remainingConstant].every(hasAtMostOneDecimal)) return null;
      const limit = difficulty === 1 ? 40 : difficulty === 2 ? 60 : 80;
      if (Math.max(...route.scaledConstants) > limit) return null;
    } else if (context.contextKind === "MASS") {
      if (![...solution, context.firstTotal, context.secondTotal, ...route.scaledConstants].every(Number.isInteger)) return null;
      const scaledLimit = difficulty === 1 ? 500 : difficulty === 2 ? 900 : 1100;
      if (Math.max(...route.scaledConstants) > scaledLimit) return null;
      if (Math.max(context.firstTotal, context.secondTotal) > 350) return null;
      const largeValues = [context.firstTotal, context.secondTotal, ...route.scaledConstants].filter((value) => Math.abs(value) > 100);
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

  return route;
};

const chooseVariableSymbols = (rng: SeededRandom, family: A8GeneratorFamily): [string, string] => {
  if (family === "CONTEXT_FORM_AND_SOLVE") {
    return rng.pick<readonly [string, string]>([["x", "y"], ["a", "b"], ["p", "q"]] as const) as [string, string];
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
    shells = shells.filter((shell) =>
      shell.kind === "MASS" &&
      shell.valueRanges.some((range) => range.max >= 100),
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

  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const attemptRng = new SeededRandom(mixSeed(options.seed, 0x51F15EED + attempt * 977));
    const coefficients = coefficientPair(attemptRng, family, paper);
    const shells = contextual ? contextCandidates(paper, family) : [];
    if (contextual && !shells.length) {
      throw new Error(`No calibrated A8 context shells are available for ${family} on ${paper}.`);
    }

    // Context choice uses its own mixed seed so adjacent teacher-facing seeds do
    // not walk through the same semantic shell cluster.
    const contextRng = new SeededRandom(mixSeed(options.seed, 0xC07E57 + attempt * 193));
    const shell = contextual ? contextRng.pick(shells) : null;
    const solution = family === "GRAPH_INTERSECTION_SOLVE"
      ? graphSolution(attemptRng)
      : shell
        ? contextualSolution(contextRng, shell, paper, family, difficulty)
        : abstractSolution(attemptRng, difficulty);

    const equations: [A8LinearEquation, A8LinearEquation] = [
      { a: coefficients[0][0], b: coefficients[0][1], c: clean(coefficients[0][0] * solution[0] + coefficients[0][1] * solution[1]) },
      { a: coefficients[1][0], b: coefficients[1][1], c: clean(coefficients[1][0] * solution[0] + coefficients[1][1] * solution[1]) },
    ];

    const determinant = equations[0].a * equations[1].b - equations[1].a * equations[0].b;
    if (close(determinant, 0)) continue;

    const plans: [A8EliminationPlan, A8EliminationPlan] = [
      eliminationPlan(equations[0], equations[1], "FIRST"),
      eliminationPlan(equations[0], equations[1], "SECOND"),
    ];
    const context = shell ? buildContext(contextRng, family, shell, coefficients, solution) : null;
    const calibratedRoute = candidateFitsCalibration({
      difficulty,
      paper,
      family,
      equations,
      solution,
      plans,
      context,
    });
    if (!calibratedRoute) continue;

    let prompt: string;
    let promptParts: PaperPart[];
    let promptSections: A8GeneratedQuestion["promptSections"];
    let visual: A8GeneratedQuestion["visual"] = null;

    if (context) {
      const built = contextualPrompt(contextRng, context, variables, family, paper);
      prompt = built.prompt;
      promptParts = built.promptParts;
      promptSections = built.sections;
    } else if (family === "GRAPH_INTERSECTION_SOLVE") {
      prompt = `The straight lines with equations ${equationPlain(equations[0], variables)} and ${equationPlain(equations[1], variables)} intersect at P.\nCalculate algebraically the coordinates of P.`;
      promptParts = [
        textPart("The graph shows two straight lines with equations"),
        mathPart(`\\begin{aligned}${equationLatex(equations[0], variables)}\\\\${equationLatex(equations[1], variables)}\\end{aligned}`, true),
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
        mathPart(`\\begin{aligned}${equationLatex(equations[0], variables)}\\\\${equationLatex(equations[1], variables)}\\end{aligned}`, true),
      ];
      promptSections = [{ label: "", text: prompt, marks: 3 }];
    }

    const question: A8GeneratedQuestion = {
      generatorId: "A8_SIMULTANEOUS_EQUATIONS_V3",
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
        paper === "P1"
          ? "The cheapest calibrated elimination route must remain naturally executable by written non-calculator arithmetic."
          : "Calculator availability may broaden number texture, but values and outcomes must remain deliberately constructed and exact.",
      ],
      quality: {
        difficultyBandId: band.id,
        calibrationSourceAnchorIds: [...band.sourceAnchors],
        familyObservedCount: familySelection.observedCount,
        familyObservedTotal: familySelection.observedTotal,
        familyObservedProportion: familySelection.observedProportion,
        familyCycleLength: familySelection.cycleLength,
        familyCycleSlot: familySelection.cycleSlot,
        historicalOverlapChecked: true,
        contextPoolSize: A8_CONTEXT_POOL_SIZE,
        contextId: context?.contextId ?? null,
        contextKind: context?.contextKind ?? null,
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
        paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
      },
    };

    const validation = validateA8GeneratedQuestion(question);
    if (validation.valid) return question;
  }

  throw new Error(`Unable to generate a calibrated A8 ${family} question on ${paper} at difficulty ${difficulty}.`);
};
