import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  G1BestFitLineState,
  G1ContextualLineState,
  G1LineModelState,
  G1NumericPoint,
  G1PromptSection,
  G1Rational,
  G1SymbolicGradientState,
} from "./Types";

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

export const reduceG1Rational = (value: G1Rational): G1Rational => {
  const divisor = gcd(Math.abs(value.numerator), Math.abs(value.denominator)) || 1;
  const sign = value.denominator < 0 ? -1 : 1;
  return {
    numerator: (value.numerator / divisor) * sign,
    denominator: Math.abs(value.denominator / divisor),
  };
};

const numberToRational = (value: number): G1Rational => {
  if (Number.isInteger(value)) return { numerator: value, denominator: 1 };
  const scaled = Math.round(value * 1000);
  return reduceG1Rational({ numerator: scaled, denominator: 1000 });
};

const addRational = (a: G1Rational, b: G1Rational): G1Rational => reduceG1Rational({
  numerator: a.numerator * b.denominator + b.numerator * a.denominator,
  denominator: a.denominator * b.denominator,
});

const multiplyRational = (a: G1Rational, b: G1Rational): G1Rational => reduceG1Rational({
  numerator: a.numerator * b.numerator,
  denominator: a.denominator * b.denominator,
});

export const g1RationalLatex = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  if (reduced.denominator === 1) return `${reduced.numerator}`;
  const sign = reduced.numerator < 0 ? "-" : "";
  return `${sign}\\frac{${Math.abs(reduced.numerator)}}{${reduced.denominator}}`;
};

export const g1RationalPlain = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  return reduced.denominator === 1 ? `${reduced.numerator}` : `${reduced.numerator}/${reduced.denominator}`;
};

const terminatingDecimal = (value: G1Rational): string | null => {
  const reduced = reduceG1Rational(value);
  let denominator = reduced.denominator;
  while (denominator % 2 === 0) denominator /= 2;
  while (denominator % 5 === 0) denominator /= 5;
  if (denominator !== 1) return null;
  const numeric = reduced.numerator / reduced.denominator;
  const text = numeric.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return text.includes(".") ? text : null;
};

const interceptLatex = (value: G1Rational): string => terminatingDecimal(value) ?? g1RationalLatex(value);
const interceptPlain = (value: G1Rational): string => terminatingDecimal(value) ?? g1RationalPlain(value);

const formatNumber = (value: number) => Number.isInteger(value)
  ? `${value}`
  : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const coordinateLatex = (point: G1NumericPoint) => `\\left(${formatNumber(point.x)},${formatNumber(point.y)}\\right)`;
const coordinatePlain = (point: G1NumericPoint) => `(${formatNumber(point.x)}, ${formatNumber(point.y)})`;

const coefficientTermLatex = (coefficient: G1Rational, variable: string): string => {
  const reduced = reduceG1Rational(coefficient);
  if (reduced.denominator === 1) {
    if (reduced.numerator === 1) return variable;
    if (reduced.numerator === -1) return `-${variable}`;
    return `${reduced.numerator}${variable}`;
  }
  return `${g1RationalLatex(reduced)}${variable}`;
};

const coefficientTermPlain = (coefficient: G1Rational, variable: string): string => {
  const reduced = reduceG1Rational(coefficient);
  if (reduced.denominator === 1) {
    if (reduced.numerator === 1) return variable;
    if (reduced.numerator === -1) return `-${variable}`;
    return `${reduced.numerator}${variable}`;
  }
  return `${g1RationalPlain(reduced)}${variable}`;
};

const appendInterceptLatex = (body: string, intercept: G1Rational): string => {
  const reduced = reduceG1Rational(intercept);
  if (reduced.numerator === 0) return body;
  const sign = reduced.numerator > 0 ? "+" : "-";
  const magnitude = reduceG1Rational({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator });
  return `${body}${sign}${interceptLatex(magnitude)}`;
};

const appendInterceptPlain = (body: string, intercept: G1Rational): string => {
  const reduced = reduceG1Rational(intercept);
  if (reduced.numerator === 0) return body;
  const sign = reduced.numerator > 0 ? " + " : " - ";
  const magnitude = reduceG1Rational({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator });
  return `${body}${sign}${interceptPlain(magnitude)}`;
};

export const buildG1LineEquation = (
  xVariable: string,
  yVariable: string,
  gradient: G1Rational,
  intercept: G1Rational,
) => ({
  latex: `${yVariable}=${appendInterceptLatex(coefficientTermLatex(gradient, xVariable), intercept)}`,
  plain: `${yVariable} = ${appendInterceptPlain(coefficientTermPlain(gradient, xVariable), intercept)}`,
});

export type G1PromptBuild = {
  prompt: string;
  promptParts: PaperPart[];
  promptSections: G1PromptSection[];
};

const simplestFormLine = "Give the equation in its simplest form.";

export const buildG1DirectLinePrompt = (state: G1LineModelState, seed: number): G1PromptBuild => {
  const [a, b] = state.points;
  const variant = Math.abs(seed) % 2;
  const lead = variant === 0 ? "A straight line passes through the points " : "The points ";
  const join = variant === 0 ? "." : " lie on the same straight line.";
  const command = "Find the equation of the line.";
  const prompt = `${lead}${coordinatePlain(a)} and ${coordinatePlain(b)}${join}\n${command}\n${simplestFormLine}`;
  return {
    prompt,
    promptParts: [
      { kind: "text", value: lead },
      { kind: "math", latex: coordinateLatex(a) },
      { kind: "text", value: " and " },
      { kind: "math", latex: coordinateLatex(b) },
      { kind: "text", value: `${join}\n${command}\n${simplestFormLine}` },
    ],
    promptSections: [{ label: "", text: `${command}\n${simplestFormLine}`, marks: 3 }],
  };
};

export const buildG1DiagramLinePrompt = (): G1PromptBuild => {
  const lead = "The diagram shows a straight line through A and B.";
  const command = "Find the equation of the line.";
  const prompt = `${lead}\n${command}\n${simplestFormLine}`;
  return {
    prompt,
    promptParts: [{ kind: "text", value: prompt }],
    promptSections: [{ label: "", text: `${command}\n${simplestFormLine}`, marks: 3 }],
  };
};

const valueWithUnit = (value: number, unit: string) => {
  const number = formatNumber(value);
  if (unit === "pounds") return `£${number}`;
  if (unit === "percent") return `${number}%`;
  return `${number} ${unit}`;
};

const contextualPointSentence = (state: G1ContextualLineState, label: "A" | "B", point: G1NumericPoint): string => {
  const x = valueWithUnit(point.x, state.context.xUnit);
  const y = valueWithUnit(point.y, state.context.yUnit);
  switch (state.context.domainId) {
    case "TAXI_FARE": return `At point ${label}, a journey of ${x} costs ${y}.`;
    case "WEEKLY_WAGE": return `At point ${label}, sales are ${x} and the weekly wage is ${y}.`;
    case "WATER_DRAIN": return `At point ${label}, after ${x}, ${y} of water remains.`;
    case "BATTERY_DRAIN": return `At point ${label}, after ${x}, the battery charge remaining is ${y}.`;
    case "COURIER_CHARGE": return `At point ${label}, a delivery of ${x} costs ${y}.`;
    default: return `At point ${label}, ${state.context.xDescription} is ${x} and ${state.context.yDescription} is ${y}.`;
  }
};

const contextMeasurementSentence = (state: G1ContextualLineState) =>
  `The graph shows ${state.context.yDescription}, ${state.context.yVariable} ${state.context.yUnit}, against ${state.context.xDescription}, ${state.context.xVariable} ${state.context.xUnit}.`;

export const buildG1ContextPrompt = (state: G1ContextualLineState): G1PromptBuild => {
  const [a, b] = state.points;
  const information = [
    state.context.introduction,
    contextMeasurementSentence(state),
    contextualPointSentence(state, "A", a),
    contextualPointSentence(state, "B", b),
  ];
  const partA = `Find the equation of the line in terms of ${state.context.yVariable} and ${state.context.xVariable}.\n${simplestFormLine}`;
  const partB = `Use your equation to calculate ${state.followUp.outputDescription} when ${state.context.xVariable} = ${formatNumber(state.followUp.input)}.`;
  const prompt = `${information.join("\n")}\n(a) ${partA}\n(b) ${partB}`;
  return {
    prompt,
    promptParts: [{ kind: "text", value: prompt }],
    promptSections: [
      { label: "a", text: partA, marks: 3 },
      { label: "b", text: partB, marks: 1 },
    ],
  };
};

const bestFitPointSentence = (state: G1BestFitLineState, label: "A" | "B", point: G1NumericPoint): string => {
  const x = valueWithUnit(point.x, state.context.xUnit);
  const y = valueWithUnit(point.y, state.context.yUnit);
  return `Point ${label} represents ${state.context.xDescription} of ${x} and ${state.context.yDescription} of ${y}.`;
};

const bestFitMeasurementSentence = (state: G1BestFitLineState) =>
  `The scatter graph shows ${state.context.yDescription}, ${state.context.yVariable} ${state.context.yUnit}, against ${state.context.xDescription}, ${state.context.xVariable} ${state.context.xUnit}.`;

export const g1BestFitFollowUp = (state: G1BestFitLineState) => {
  const occupied = new Set(state.lineReadPoints.map((point) => formatNumber(point.x)));
  const sortedX = [...new Set(state.scatterPoints.map((point) => point.x))].sort((a, b) => a - b);
  const candidates = sortedX.filter((value) => !occupied.has(formatNumber(value)));
  const input = candidates[Math.max(0, Math.min(candidates.length - 1, Math.floor(candidates.length * 0.6)))]
    ?? sortedX[Math.floor(sortedX.length / 2)]
    ?? state.points[0].x;
  const exactOutput = addRational(
    multiplyRational(state.gradient, numberToRational(input)),
    state.intercept,
  );
  return {
    input,
    exactOutput,
    outputDescription: state.context.yDescription,
    outputUnit: state.context.yUnit,
  };
};

export const buildG1BestFitPrompt = (
  state: G1BestFitLineState,
  surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT" | "BEST_FIT_GRID_READ_POINTS",
): G1PromptBuild => {
  const [a, b] = state.points;
  const information = [
    state.context.introduction,
    bestFitMeasurementSentence(state),
    "A line of best fit has been drawn.",
  ];
  if (surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT") {
    information.push(bestFitPointSentence(state, "A", a));
    information.push(bestFitPointSentence(state, "B", b));
  } else {
    information.push("Use two suitable points which lie on the drawn line.");
  }

  const partA = `Find the equation of the line of best fit in terms of ${state.context.yVariable} and ${state.context.xVariable}.\n${simplestFormLine}`;
  const followUp = g1BestFitFollowUp(state);
  const partB = `Use your equation to estimate ${followUp.outputDescription} when ${state.context.xDescription} is ${valueWithUnit(followUp.input, state.context.xUnit)}.`;
  const prompt = `${information.join("\n")}\n(a) ${partA}\n(b) ${partB}`;
  return {
    prompt,
    promptParts: [{ kind: "text", value: prompt }],
    promptSections: [
      { label: "a", text: partA, marks: 3 },
      { label: "b", text: partB, marks: 1 },
    ],
  };
};

const algebraicCoordinateLatex = (coefficient: number, parameter: string, power: 1 | 2) => {
  const variable = power === 1 ? parameter : `${parameter}^{2}`;
  return coefficient === 1 ? variable : `${coefficient}${variable}`;
};

export const buildG1SymbolicPrompt = (state: G1SymbolicGradientState): G1PromptBuild => {
  const numeric = `\\left(${state.numericPoint.x},${state.numericPoint.y}\\right)`;
  const parameterised = `\\left(${algebraicCoordinateLatex(state.parameterisedPoint.xCoefficient, state.parameter, 1)},${algebraicCoordinateLatex(state.parameterisedPoint.yCoefficient, state.parameter, 2)}\\right)`;
  const plain = "Find an expression for the gradient of the line joining point A to point B.\nGive your answer in its simplest form.";
  return {
    prompt: plain,
    promptParts: [
      { kind: "text", value: "Point A has coordinates " },
      { kind: "math", latex: numeric },
      { kind: "text", value: " and point B has coordinates " },
      { kind: "math", latex: parameterised },
      { kind: "text", value: ".\nFind an expression for the gradient of the line joining A to B.\nGive your answer in its simplest form." },
    ],
    promptSections: [{ label: "", text: plain, marks: 3 }],
  };
};
