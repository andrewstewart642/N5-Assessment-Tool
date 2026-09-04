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

export const g1RationalLatex = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  if (reduced.denominator === 1) return `${reduced.numerator}`;
  const sign = reduced.numerator < 0 ? "-" : "";
  return `${sign}\\frac{${Math.abs(reduced.numerator)}}{${reduced.denominator}}`;
};

export const g1RationalPlain = (value: G1Rational): string => {
  const reduced = reduceG1Rational(value);
  return reduced.denominator === 1
    ? `${reduced.numerator}`
    : `${reduced.numerator}/${reduced.denominator}`;
};

const coordinateLatex = (point: G1NumericPoint) => `\\left(${point.x},${point.y}\\right)`;
const coordinatePlain = (point: G1NumericPoint) => `(${point.x}, ${point.y})`;

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
  return `${body}${sign}${g1RationalLatex({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator })}`;
};

const appendInterceptPlain = (body: string, intercept: G1Rational): string => {
  const reduced = reduceG1Rational(intercept);
  if (reduced.numerator === 0) return body;
  const sign = reduced.numerator > 0 ? " + " : " - ";
  return `${body}${sign}${g1RationalPlain({ numerator: Math.abs(reduced.numerator), denominator: reduced.denominator })}`;
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

export const buildG1DirectLinePrompt = (
  state: G1LineModelState,
  seed: number,
): G1PromptBuild => {
  const [a, b] = state.points;
  const variant = Math.abs(seed) % 3;
  const lead = variant === 0
    ? "A straight line passes through the points "
    : variant === 1
      ? "The points "
      : "A line contains the two points ";
  const middle = variant === 1 ? " lie on the same straight line. " : ". ";
  const command = variant === 2
    ? "Determine the equation of the line, giving your answer in simplest form."
    : "Find the equation of the line in its simplest form.";
  const prompt = `${lead}${coordinatePlain(a)} and ${coordinatePlain(b)}${middle}${command}`;
  return {
    prompt,
    promptParts: [
      { kind: "text", value: lead },
      { kind: "math", latex: coordinateLatex(a) },
      { kind: "text", value: " and " },
      { kind: "math", latex: coordinateLatex(b) },
      { kind: "text", value: `${middle}${command}` },
    ],
    promptSections: [{ label: "", text: prompt, marks: 3 }],
  };
};

export const buildG1DiagramLinePrompt = (seed: number): G1PromptBuild => {
  const command = Math.abs(seed) % 2 === 0
    ? "Use the coordinate diagram to find the equation of line AB. Give the equation in simplest form."
    : "The diagram shows the straight line through A and B. Determine its equation in simplest form.";
  return {
    prompt: command,
    promptParts: [{ kind: "text", value: command }],
    promptSections: [{ label: "", text: command, marks: 3 }],
  };
};

export const buildG1ContextPrompt = (
  state: G1ContextualLineState,
  seed: number,
): G1PromptBuild => {
  const [a, b] = state.points;
  const pointSentence = Math.abs(seed) % 2 === 0
    ? `Two points on the graph correspond to ${coordinatePlain(a)} and ${coordinatePlain(b)}.`
    : `The straight line contains the points ${coordinatePlain(a)} and ${coordinatePlain(b)}.`;
  const partA = `Find an equation connecting ${state.context.yVariable} and ${state.context.xVariable}. Give the equation in simplest form.`;
  const partB = `Use your equation to calculate ${state.followUp.outputDescription} when ${state.context.xVariable} = ${state.followUp.input}.`;
  const prompt = `${state.context.introduction} ${pointSentence} (a) ${partA} (b) ${partB}`;
  return {
    prompt,
    promptParts: [
      { kind: "text", value: `${state.context.introduction} Two points on the graph are ` },
      { kind: "math", latex: coordinateLatex(a) },
      { kind: "text", value: " and " },
      { kind: "math", latex: coordinateLatex(b) },
      { kind: "text", value: `. (a) ${partA} (b) ${partB}` },
    ],
    promptSections: [
      { label: "a", text: partA, marks: 3 },
      { label: "b", text: partB, marks: 1 },
    ],
  };
};

export const buildG1BestFitPrompt = (
  state: G1BestFitLineState,
  surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT" | "BEST_FIT_GRID_READ_POINTS",
): G1PromptBuild => {
  const [a, b] = state.points;
  const base = `${state.context.introduction} A line of best fit has been drawn on the scatter graph.`;
  const command = `Find the equation of the line of best fit connecting ${state.context.yVariable} and ${state.context.xVariable}. Give the equation in simplest form.`;
  const pointText = surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT"
    ? ` Two points on the drawn line are ${coordinatePlain(a)} and ${coordinatePlain(b)}.`
    : " Use two suitable points from the drawn line.";
  const prompt = `${base}${pointText} ${command}`;
  const promptParts: PaperPart[] = [{ kind: "text", value: base }];
  if (surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT") {
    promptParts.push(
      { kind: "text", value: " Two points on the drawn line are " },
      { kind: "math", latex: coordinateLatex(a) },
      { kind: "text", value: " and " },
      { kind: "math", latex: coordinateLatex(b) },
      { kind: "text", value: `. ${command}` },
    );
  } else {
    promptParts.push({ kind: "text", value: ` Use two suitable points from the drawn line. ${command}` });
  }
  return {
    prompt,
    promptParts,
    promptSections: [{ label: "a", text: command, marks: 3 }],
  };
};

const algebraicCoordinateLatex = (coefficient: number, parameter: string, power: 1 | 2) => {
  const variable = power === 1 ? parameter : `${parameter}^{2}`;
  return coefficient === 1 ? variable : `${coefficient}${variable}`;
};

export const buildG1SymbolicPrompt = (state: G1SymbolicGradientState): G1PromptBuild => {
  const numeric = `\\left(${state.numericPoint.x},${state.numericPoint.y}\\right)`;
  const parameterised = `\\left(${algebraicCoordinateLatex(state.parameterisedPoint.xCoefficient, state.parameter, 1)},${algebraicCoordinateLatex(state.parameterisedPoint.yCoefficient, state.parameter, 2)}\\right)`;
  const text = "Two points lie on a straight line. Find the gradient of the line as an expression in the parameter, giving your answer in simplest form.";
  const prompt = `${text} A = (${state.numericPoint.x}, ${state.numericPoint.y}); B contains the generated parameterised coordinates.`;
  return {
    prompt,
    promptParts: [
      { kind: "text", value: "The straight line passes through " },
      { kind: "math", latex: `A=${numeric}` },
      { kind: "text", value: " and " },
      { kind: "math", latex: `B=${parameterised}` },
      { kind: "text", value: ". Find its gradient as an expression in the parameter. Give your answer in simplest form." },
    ],
    promptSections: [{ label: "", text, marks: 3 }],
  };
};
