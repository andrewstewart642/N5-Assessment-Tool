import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  A7ContextAreaState,
  A7FractionalEquationState,
  A7PromptSection,
  A7Rational,
} from "./Types";

const abs = (value: number) => Math.abs(value);

const positiveXText = (coefficient: number) => coefficient === 1 ? "x" : `${coefficient}x`;

const unsignedRationalLatex = (value: A7Rational, variable = false) => {
  const numerator = abs(value.numerator);
  const denominator = value.denominator;
  if (variable) {
    const numeratorText = numerator === 1 ? "x" : `${numerator}x`;
    return denominator === 1 ? numeratorText : `\\frac{${numeratorText}}{${denominator}}`;
  }
  return denominator === 1 ? `${numerator}` : `\\frac{${numerator}}{${denominator}}`;
};

const splitTermsLatex = (state: A7FractionalEquationState) => {
  const leftX = unsignedRationalLatex(state.lhsX, true);
  const leftConstant = unsignedRationalLatex(state.lhsConstant, false);
  const rightX = positiveXText(state.rhsX.numerator);
  return `${leftX} - ${leftConstant} = ${rightX}`;
};

const binomialRightLatex = (state: A7FractionalEquationState) => {
  const leftX = unsignedRationalLatex(state.lhsX, true);
  const wholeConstant = abs(state.lhsConstant.numerator);
  const denominator = state.rhsX.denominator;
  const constantNumerator = state.rhsConstant.numerator;
  const xNumerator = abs(state.rhsX.numerator);
  const xText = xNumerator === 1 ? "x" : `${xNumerator}x`;
  return `${leftX} - ${wholeConstant} = \\frac{${constantNumerator} - ${xText}}{${denominator}}`;
};

const binomialLeftLatex = (state: A7FractionalEquationState) => {
  const denominator = state.lhsX.denominator;
  const xNumerator = state.lhsX.numerator;
  const constantNumerator = state.lhsConstant.numerator;
  const xText = xNumerator === 1 ? "x" : `${xNumerator}x`;
  const rightX = unsignedRationalLatex(state.rhsX, true);
  const wholeConstant = state.rhsConstant.numerator;
  return `\\frac{${xText} + ${constantNumerator}}{${denominator}} = ${rightX} + ${wholeConstant}`;
};

export const fractionalEquationLatex = (state: A7FractionalEquationState) => {
  if (state.surfaceVariant === "SPLIT_TERMS") return splitTermsLatex(state);
  if (state.surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR") return binomialRightLatex(state);
  return binomialLeftLatex(state);
};

export const buildA7FractionalPrompt = (state: A7FractionalEquationState): {
  prompt: string;
  promptParts: PaperPart[];
  promptSections: A7PromptSection[];
} => {
  const equation = fractionalEquationLatex(state);
  const lead = "Solve the equation";

  if (state.surfaceVariant === "SPLIT_TERMS") {
    const finish = "Give your answer in its simplest form.";
    return {
      prompt: `${lead}. ${equation}. ${finish}`,
      promptParts: [
        { kind: "text", value: lead },
        { kind: "math", latex: equation, displayMode: true },
        { kind: "text", value: finish },
      ],
      promptSections: [{ label: "", text: `${lead}. ${finish}`, marks: 3 }],
    };
  }

  return {
    prompt: `${lead} ${equation}.`,
    promptParts: [
      { kind: "text", value: `${lead} ` },
      { kind: "math", latex: equation, displayMode: false },
      { kind: "text", value: "." },
    ],
    promptSections: [{ label: "", text: lead, marks: 3 }],
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
  const introduction = "A triangle and rectangle are shown in the diagram.";
  const diagramSummary = `Triangle: base ${state.triangle.base} cm, height (${triangleHeight}) cm. Rectangle: height ${state.rectangle.height} cm, width (${rectangleWidth}) cm.`;
  const partA = "Find an expression for the area of the triangle.";
  const partB = "Given that the area of the triangle is equal to the area of the rectangle, find algebraically the value of x.";

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
