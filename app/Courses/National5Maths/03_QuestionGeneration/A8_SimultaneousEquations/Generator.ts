import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";

import { A8_GENERATOR_FAMILY_EVIDENCE, A8_GENERATOR_INVARIANTS } from "./Evidence";
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

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
const clean = (value: number) => Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(8));
const absIntGcd = (a: number, b: number) => gcd(Math.abs(Math.round(a)), Math.abs(Math.round(b)));

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

const chooseFamily = (rng: SeededRandom, options: A8GenerateOptions): A8GeneratorFamily => {
  if (options.family) return options.family;

  const core: A8GeneratorFamily[] = ["ABSTRACT_SOLVE", "CONTEXT_FORM_AND_SOLVE"];
  if (options.includeExperimentalFamilies) {
    core.push("GRAPH_INTERSECTION_SOLVE", "CONTEXT_DERIVED_TOTAL");
  }
  return rng.pick(core);
};

const choosePaper = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
  requested?: A8GeneratorPaper,
): A8GeneratorPaper => {
  if (requested) return requested;
  const supported = A8_GENERATOR_FAMILY_EVIDENCE[family].supportedPapers;
  return supported.length ? rng.pick(supported) : "P1";
};

const difficultyCoefficientMax = (difficulty: A8GeneratorDifficulty) => {
  if (difficulty <= 2) return 5;
  if (difficulty <= 4) return 6;
  return 7;
};

/**
 * Construct coefficient pairs that resemble the structural discipline in the
 * historical A8 corpus: coefficients are never ±1, neither row has a common
 * factor, equal coefficients do not create a free elimination route, and no
 * row collapses to a form such as 5x + 5y = ... .
 */
const coefficientPair = (
  rng: SeededRandom,
  difficulty: A8GeneratorDifficulty,
  contextual: boolean,
): [[number, number], [number, number]] => {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const max = difficultyCoefficientMax(difficulty);
    let a = rng.int(2, max);
    let b = rng.int(2, max);
    let d = rng.int(2, max);
    let e = rng.int(2, max);

    if (!contextual) {
      // The supplied abstract corpus commonly uses one negative coefficient,
      // but also contains all-positive systems. Keep the sign pattern simple.
      if (rng.chance(0.55)) {
        if (rng.chance(0.5)) b *= -1;
        else e *= -1;
      }
    }

    if (Math.abs(a) === Math.abs(b) || Math.abs(d) === Math.abs(e)) continue;
    if (absIntGcd(a, b) !== 1 || absIntGcd(d, e) !== 1) continue;
    if (Math.abs(a) === Math.abs(d) || Math.abs(b) === Math.abs(e)) continue;

    const determinant = a * e - d * b;
    if (determinant === 0) continue;

    const firstPlan = eliminationPlan({ a, b, c: 0 }, { a: d, b: e, c: 0 }, "FIRST");
    const secondPlan = eliminationPlan({ a, b, c: 0 }, { a: d, b: e, c: 0 }, "SECOND");
    const easiest = Math.min(
      Math.max(firstPlan.firstMultiplier, firstPlan.secondMultiplier),
      Math.max(secondPlan.firstMultiplier, secondPlan.secondMultiplier),
    );

    if (difficulty <= 2 && easiest > 3) continue;
    if (difficulty === 3 && easiest > 4) continue;
    if (difficulty >= 4 && easiest > 5) continue;

    return [[a, b], [d, e]];
  }

  throw new Error("Unable to construct an assessment-quality A8 coefficient matrix.");
};

const abstractSolution = (
  rng: SeededRandom,
  difficulty: A8GeneratorDifficulty,
): [number, number] => {
  const max = difficulty <= 2 ? 5 : difficulty <= 4 ? 7 : 8;
  const halfInteger = difficulty >= 4 && rng.chance(difficulty === 4 ? 0.2 : 0.35);

  let positive = rng.int(1, max);
  let negativeMagnitude = rng.int(1, Math.min(max, 6));

  if (halfInteger) {
    if (rng.chance(0.5)) positive += 0.5;
    else negativeMagnitude += 0.5;
  }

  if (positive === negativeMagnitude) {
    positive = clean(positive + (halfInteger ? 1 : 1));
  }

  return rng.chance(0.25)
    ? [-negativeMagnitude, positive]
    : [positive, -negativeMagnitude];
};

const valueFromRange = (rng: SeededRandom, valueRange: A8ValueRange) => {
  const stepCount = Math.round((valueRange.max - valueRange.min) / valueRange.step);
  return clean(valueRange.min + rng.int(0, stepCount) * valueRange.step);
};

const contextualSolution = (
  rng: SeededRandom,
  shell: A8ContextShell,
): [number, number] => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const first = valueFromRange(rng, shell.valueRanges[0]);
    const second = valueFromRange(rng, shell.valueRanges[1]);
    if (first > 0 && second > 0 && first !== second) return [first, second];
  }

  throw new Error(`Unable to choose distinct plausible values for A8 context ${shell.id}.`);
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

const equationLatex = (equation: A8LinearEquation, variables: [string, string]) => {
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

const textPart = (value: string): PaperPart => ({ kind: "text", value });
const mathPart = (latex: string, displayMode = false): PaperPart => ({ kind: "math", latex, displayMode });

const promptValue = (context: A8GeneratedContext, value: number) => {
  if (context.unitDimension === "currency") return `£${value.toFixed(2)}`;
  const numeric = context.displayDecimals > 0
    ? value.toFixed(context.displayDecimals).replace(/\.0+$/, "")
    : formatNumber(value);
  return `${numeric} ${context.unitPromptLabel}`;
};

const singularOrPlural = (
  count: number,
  singular: string,
  plural: string,
) => `${count} ${count === 1 ? singular : plural}`;

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
    resourceLabel: shell.resourceLabel,
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

const finalSolveCommand = (
  context: A8GeneratedContext,
  paper: A8GeneratorPaper,
) => {
  const [firstItem, secondItem] = context.itemLabels;
  const algebraically = paper === "P2" || context.wordingVariant === 1;

  if (context.contextKind === "PURCHASE") {
    return algebraically
      ? `Calculate, algebraically, the cost of one ${firstItem} and the cost of one ${secondItem}.`
      : `Calculate the cost of one ${firstItem} and the cost of one ${secondItem}.`;
  }

  if (context.contextKind === "MASS") {
    return algebraically
      ? `Calculate, algebraically, the mass of one ${firstItem} and the mass of one ${secondItem}.`
      : `Calculate the mass of one ${firstItem} and the mass of one ${secondItem}.`;
  }

  return algebraically
    ? `Calculate, algebraically, the amount of ${context.resourceLabel} needed for one ${firstItem} and for one ${secondItem}.`
    : `Calculate the amount of ${context.resourceLabel} needed for one ${firstItem} and for one ${secondItem}.`;
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
      secondStatement = `${name2} buys ${secondItems} ${context.settingLabel.replace(/^at |^from |^for /, (prefix) => prefix)}.\nThe total cost is ${secondTotal}.`;
    } else if (context.wordingVariant === 1) {
      firstStatement = `${name1} pays ${firstTotal} for ${firstItems} ${context.settingLabel}.`;
      secondStatement = `${name2} pays ${secondTotal} for ${secondItems} ${context.sameSettingLabel ?? context.settingLabel}.`;
    } else {
      firstStatement = `${name1} purchases ${firstItems} ${context.settingLabel}.\nAltogether, these cost ${firstTotal}.`;
      secondStatement = `${name2} purchases ${secondItems} ${context.sameSettingLabel ?? context.settingLabel}.\nAltogether, these cost ${secondTotal}.`;
    }
  } else if (context.contextKind === "MASS") {
    if (context.wordingVariant === 0) {
      firstStatement = `${name1} loads ${firstItems} ${context.settingLabel}.\nThe total mass of the load is ${firstTotal}.`;
      secondStatement = `${name2} loads ${secondItems} ${context.sameSettingLabel ?? context.settingLabel}.\nThe total mass of the load is ${secondTotal}.`;
    } else if (context.wordingVariant === 1) {
      firstStatement = `A load prepared by ${name1} contains ${firstItems}.\nIts total mass is ${firstTotal}.`;
      secondStatement = `A second load prepared by ${name2} contains ${secondItems}.\nIts total mass is ${secondTotal}.`;
    } else {
      firstStatement = `${name1} has ${firstItems} ${context.settingLabel}.\nTogether they have a mass of ${firstTotal}.`;
      secondStatement = `${name2} has ${secondItems} ${context.sameSettingLabel ?? context.settingLabel}.\nTogether they have a mass of ${secondTotal}.`;
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
    const thirdSetting = context.contextKind === "MASS" ? "on a third load" : "in a third order";
    cCommand = `${name3} has ${thirdItems} ${thirdSetting}.\n(c) Calculate the total ${context.contextKind === "MASS" ? "mass" : "value"} of these items.`;
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
  ].filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== "")).join("\n").trim();

  return {
    prompt: fullPrompt,
    promptParts: [textPart(fullPrompt)],
    sections: [
      { label: "a" as const, text: [introduction, variableDefinition, firstStatement, aCommand].filter(Boolean).join("\n"), marks: 1 },
      { label: "b" as const, text: `${secondStatement}\n${bCommand}`, marks: 1 },
      { label: "c" as const, text: cCommand.replace(/^.*\n\(c\) /, ""), marks: 4 },
    ],
  };
};

const largestScaledMagnitude = (plans: [A8EliminationPlan, A8EliminationPlan]) => {
  const equations = plans.flatMap((plan) => [plan.scaledFirst, plan.scaledSecond]);
  return {
    coefficient: Math.max(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)])),
    constant: Math.max(...equations.map((equation) => Math.abs(equation.c))),
  };
};

const candidateArithmeticAcceptable = (
  paper: A8GeneratorPaper,
  family: A8GeneratorFamily,
  equations: [A8LinearEquation, A8LinearEquation],
  plans: [A8EliminationPlan, A8EliminationPlan],
  context: A8GeneratedContext | null,
) => {
  if (equations.some((equation) => equation.c === 0)) return false;
  if (equations[0].c === equations[1].c) return false;

  const scaled = largestScaledMagnitude(plans);
  if (paper === "P1") {
    if (scaled.coefficient > 30 || scaled.constant > 120) return false;

    if (family === "ABSTRACT_SOLVE" || family === "GRAPH_INTERSECTION_SOLVE") {
      if (!equations.every((equation) => Number.isInteger(equation.c))) return false;
      if (equations.some((equation) => Math.abs(equation.c) > 35)) return false;
    }

    if (context?.contextKind === "MASS") {
      if (![context.firstTotal, context.secondTotal].every(Number.isInteger)) return false;
    }

    if (context?.contextKind === "RESOURCE") {
      const oneDecimal = (value: number) => Number.isInteger(value * 10);
      if (![context.firstTotal, context.secondTotal].every(oneDecimal)) return false;
    }
  }

  return true;
};

const chooseVariableSymbols = (
  rng: SeededRandom,
  family: A8GeneratorFamily,
): [string, string] => {
  if (family === "CONTEXT_FORM_AND_SOLVE") return rng.pick<readonly [string, string]>([["x", "y"], ["a", "b"], ["p", "q"]] as const) as [string, string];
  if (family === "CONTEXT_DERIVED_TOTAL") return rng.pick<readonly [string, string]>([["p", "e"], ["m", "n"], ["x", "y"]] as const) as [string, string];
  return rng.pick<readonly [string, string]>([["x", "y"], ["c", "d"], ["p", "r"], ["m", "n"], ["a", "b"]] as const) as [string, string];
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
  const derived = family === "CONTEXT_DERIVED_TOTAL";
  const variables = chooseVariableSymbols(rng, family);

  for (let attempt = 0; attempt < 1500; attempt += 1) {
    const coefficients = coefficientPair(rng, difficulty, contextual);
    const availableShells = contextual ? contextShellsFor(paper, derived) : [];
    const shell = contextual ? rng.pick(availableShells) : null;
    const solution = shell ? contextualSolution(rng, shell) : abstractSolution(rng, difficulty);

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
    const plans: [A8EliminationPlan, A8EliminationPlan] = [
      eliminationPlan(equations[0], equations[1], "FIRST"),
      eliminationPlan(equations[0], equations[1], "SECOND"),
    ];

    const context = shell ? buildContext(rng, family, shell, coefficients, solution) : null;
    if (!candidateArithmeticAcceptable(paper, family, equations, plans, context)) continue;

    let prompt: string;
    let promptParts: PaperPart[];
    let promptSections: A8GeneratedQuestion["promptSections"];
    let visual: A8GeneratedQuestion["visual"] = null;

    if (context) {
      const built = contextualPrompt(rng, context, variables, family, paper);
      prompt = built.prompt;
      promptParts = built.promptParts;
      promptSections = built.sections;
    } else if (family === "GRAPH_INTERSECTION_SOLVE") {
      prompt = `The straight lines with equations ${equationPlain(equations[0], variables)} and ${equationPlain(equations[1], variables)} intersect at P.\nCalculate, algebraically, the coordinates of P.`;
      promptParts = [
        textPart("The graph shows two straight lines with equations"),
        mathPart(`\\begin{aligned}${equationLatex(equations[0], variables)}\\\\${equationLatex(equations[1], variables)}\\end{aligned}`, true),
        textPart("Calculate, algebraically, the coordinates of their point of intersection, P."),
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
      prompt = `Solve, algebraically, the system of equations\n${equationPlain(equations[0], variables)}\n${equationPlain(equations[1], variables)}`;
      promptParts = [
        textPart("Solve, algebraically, the system of equations"),
        mathPart(`\\begin{aligned}${equationLatex(equations[0], variables)}\\\\${equationLatex(equations[1], variables)}\\end{aligned}`, true),
      ];
      promptSections = [{ label: "", text: prompt, marks: 3 }];
    }

    const scaled = largestScaledMagnitude(plans);
    const question: A8GeneratedQuestion = {
      generatorId: "A8_SIMULTANEOUS_EQUATIONS_V2",
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
      promptParts,
      promptSections,
      context,
      visual,
      sourceBasis: {
        questionCatalogIds: evidence.questionCatalogIds,
        answerCatalogIds: evidence.answerCatalogIds,
        comparisonFamily: family,
      },
      generationConstraints: [...A8_GENERATOR_INVARIANTS],
      quality: {
        contextPoolSize: A8_CONTEXT_POOL_SIZE,
        contextId: context?.contextId ?? null,
        contextKind: context?.contextKind ?? null,
        rowCommonFactors: [absIntGcd(equations[0].a, equations[0].b), absIntGcd(equations[1].a, equations[1].b)],
        minimumAbsoluteCoefficient: Math.min(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)])),
        maximumAbsoluteCoefficient: Math.max(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)])),
        easiestEliminationMultiplier: Math.min(
          Math.max(plans[0].firstMultiplier, plans[0].secondMultiplier),
          Math.max(plans[1].firstMultiplier, plans[1].secondMultiplier),
        ),
        largestScaledCoefficient: scaled.coefficient,
        largestScaledConstant: scaled.constant,
        paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
      },
    };

    const validation = validateA8GeneratedQuestion(question);
    if (validation.valid) return question;
  }

  throw new Error("Unable to generate an A8 question that satisfies the tightened assessment-quality constraints.");
};
