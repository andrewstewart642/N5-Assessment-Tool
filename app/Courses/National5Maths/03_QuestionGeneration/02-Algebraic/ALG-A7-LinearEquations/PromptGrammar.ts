import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  A7ContextAreaState,
  A7FractionalEquationState,
  A7PromptSection,
  A7Rational,
} from "./Types";

const abs = (value: number) => Math.abs(value);

const unsignedRationalLatex = (value: A7Rational, variable = false) => {
  const numerator = abs(value.numerator);
  const denominator = value.denominator;
  if (variable) {
    if (denominator === 1) return numerator === 1 ? "x" : `${numerator}x`;
    return numerator === 1 ? `\\frac{x}{${denominator}}` : `\\frac{${numerator}x}{${denominator}}`;
  }
  return denominator === 1 ? `${numerator}` : `\\frac{${numerator}}{${denominator}}`;
};

const linearSideLatex = (xTerm: A7Rational, constant: A7Rational) => {
  const pieces: string[] = [];
  if (xTerm.numerator !== 0) {
    const x = unsignedRationalLatex(xTerm, true);
    pieces.push(xTerm.numerator < 0 ? `-${x}` : x);
  }
  if (constant.numerator !== 0) {
    const value = unsignedRationalLatex(constant, false);
    if (!pieces.length) pieces.push(constant.numerator < 0 ? `-${value}` : value);
    else pieces.push(constant.numerator < 0 ? `- ${value}` : `+ ${value}`);
  }
  return pieces.length ? pieces.join(" ") : "0";
};

const binomialLeftLatex = (state: A7FractionalEquationState) => {
  const denominator = state.lhsX.denominator;
  const xNumerator = state.lhsX.numerator;
  const constantNumerator = state.lhsConstant.numerator;
  const xText = xNumerator === 1 ? "x" : xNumerator === -1 ? "-x" : `${xNumerator}x`;
  const constantText = constantNumerator < 0 ? `- ${abs(constantNumerator)}` : `+ ${constantNumerator}`;
  return `\\frac{${xText} ${constantText}}{${denominator}}`;
};

export const fractionalEquationLatex = (state: A7FractionalEquationState) => {
  const left = state.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR"
    ? binomialLeftLatex(state)
    : linearSideLatex(state.lhsX, state.lhsConstant);
  const right = linearSideLatex(state.rhsX, state.rhsConstant);
  return `${left} = ${right}`;
};

export const buildA7FractionalPrompt = (state: A7FractionalEquationState): {
  prompt: string;
  promptParts: PaperPart[];
  promptSections: A7PromptSection[];
} => {
  const equation = fractionalEquationLatex(state);
  const lead = "Solve the equation.";
  const finish = "Give your answer in its simplest form.";
  return {
    prompt: `${lead} ${equation} ${finish}`,
    promptParts: [
      { kind: "text", value: lead },
      { kind: "math", latex: equation, displayMode: true },
      { kind: "text", value: finish },
    ],
    promptSections: [{ label: "", text: `${lead} ${finish}`, marks: 3 }],
  };
};

const signedLinearLabel = (coefficient: 1 | -1, constant: number) => {
  const variable = coefficient === 1 ? "x" : "-x";
  if (constant === 0) return variable;
  return constant > 0 ? `${variable} + ${constant}` : `${variable} - ${abs(constant)}`;
};

export const buildA7ContextPrompt = (state: A7ContextAreaState): {
  prompt: string;
  promptParts: PaperPart[];
  promptSections: A7PromptSection[];
} => {
  const triangleHeight = signedLinearLabel(1, state.triangle.heightConstant);
  const rectangleWidth = signedLinearLabel(-1, state.rectangle.widthConstant);
  const introduction = "A triangle and a rectangle are shown in the diagram.";
  const diagramSummary = `Triangle: base ${state.triangle.base} cm, height (${triangleHeight}) cm. Rectangle: height ${state.rectangle.height} cm, width (${rectangleWidth}) cm.`;
  const partA = "Find an expression, in terms of x, for the area of the triangle.";
  const partB = "The triangle and rectangle have equal areas. Find the value of x algebraically.";

  return {
    prompt: `${introduction} ${diagramSummary} (a) ${partA} (b) ${partB}`,
    promptParts: [
      { kind: "text", value: introduction },
      { kind: "text", value: diagramSummary },
      { kind: "text", value: `(a) ${partA}` },
      { kind: "text", value: `(b) ${partB}` },
    ],
    promptSections: [
      { label: "a", text: partA, marks: 1 },
      { label: "b", text: partB, marks: 4 },
    ],
  };
};
