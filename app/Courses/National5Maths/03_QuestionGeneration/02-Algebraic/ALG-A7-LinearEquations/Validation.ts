import { historicalA7FractionalOverlap } from "./Calibration";
import {
  A7_GENERATOR_ABSTRACT_ENVELOPE,
  A7_GENERATOR_FAMILY_EVIDENCE,
} from "./Evidence";
import type {
  A7FractionalEquationState,
  A7GeneratedQuestion,
  A7Rational,
  A7ValidationIssue,
  A7ValidationResult,
} from "./Types";

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const reduced = (value: A7Rational) => {
  const divisor = gcd(Math.abs(value.numerator), Math.abs(value.denominator)) || 1;
  const denominatorSign = value.denominator < 0 ? -1 : 1;
  return {
    numerator: (value.numerator / divisor) * denominatorSign,
    denominator: Math.abs(value.denominator / divisor),
  };
};
const sameRational = (first: A7Rational, second: A7Rational) => {
  const a = reduced(first);
  const b = reduced(second);
  return a.numerator === b.numerator && a.denominator === b.denominator;
};

const error = (issues: A7ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "ERROR", code, message });
const warning = (issues: A7ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "WARNING", code, message });

const validateFractionalSurfaceGrammar = (
  state: A7FractionalEquationState,
  issues: A7ValidationIssue[],
) => {
  if (state.surfaceVariant === "SPLIT_TERMS") {
    const valid =
      state.lhsX.numerator > 0 && state.lhsX.denominator > 1 &&
      state.lhsConstant.numerator < 0 && state.lhsConstant.denominator > 1 &&
      state.rhsX.numerator > 0 && state.rhsX.denominator === 1 &&
      state.rhsConstant.numerator === 0 &&
      state.lhsX.denominator !== state.lhsConstant.denominator;
    if (!valid) {
      error(
        issues,
        "A7_SURFACE_2016_GRAMMAR",
        "SPLIT_TERMS must display exactly the clean 2016-type grammar ax/d1 - b/d2 = cx with distinct fractional denominators and no leading negative term.",
      );
    }
    if (state.solution.numerator >= 0) {
      error(issues, "A7_SURFACE_2016_SIGN", "The 2016-type surface is reserved for the observed negative-solution sign architecture.");
    }
    return;
  }

  if (state.surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR") {
    const valid =
      state.lhsX.numerator > 0 && state.lhsX.denominator > 1 &&
      state.lhsConstant.numerator < 0 && state.lhsConstant.denominator === 1 &&
      state.rhsX.numerator < 0 && state.rhsX.denominator > 1 &&
      state.rhsConstant.numerator > 0 &&
      state.rhsConstant.denominator === state.rhsX.denominator &&
      state.lhsX.denominator !== state.rhsX.denominator;
    if (!valid) {
      error(
        issues,
        "A7_SURFACE_2019_GRAMMAR",
        "BINOMIAL_RIGHT_NUMERATOR must display the clean 2019-type grammar ax/d1 - n = (b - cx)/d2 with distinct displayed denominators and positive leading terms.",
      );
    }
    if (state.solution.numerator <= 0) {
      error(issues, "A7_SURFACE_2019_SIGN", "The 2019-type surface is calibrated to a positive exact solution.");
    }
    return;
  }

  const valid =
    state.lhsX.numerator > 0 && state.lhsX.denominator > 1 &&
    state.lhsConstant.numerator > 0 &&
    state.lhsConstant.denominator === state.lhsX.denominator &&
    state.rhsX.numerator > 0 && state.rhsX.denominator > 1 &&
    state.rhsConstant.numerator > 0 && state.rhsConstant.denominator === 1 &&
    state.lhsX.denominator !== state.rhsX.denominator;
  if (!valid) {
    error(
      issues,
      "A7_SURFACE_2025_GRAMMAR",
      "BINOMIAL_LEFT_NUMERATOR must display the clean 2025-type grammar (ax+b)/d1 = cx/d2 + n with distinct displayed denominators and positive leading terms.",
    );
  }
  if (state.solution.numerator <= 0) {
    error(issues, "A7_SURFACE_2025_SIGN", "The 2025-type surface is calibrated to a positive exact solution.");
  }
};

export const validateA7GeneratedQuestion = (question: A7GeneratedQuestion): A7ValidationResult => {
  const issues: A7ValidationIssue[] = [];
  const evidence = A7_GENERATOR_FAMILY_EVIDENCE[question.family];

  if (!evidence.supportedPapers.includes(question.paper)) {
    error(issues, "A7_UNSUPPORTED_PAPER", `${question.family} has no reviewed A7 support on ${question.paper}.`);
  }
  if (question.marks !== evidence.marks) {
    error(issues, "A7_MARK_TARIFF", `Expected ${evidence.marks} marks for ${question.family}.`);
  }
  if (question.standard !== "A") {
    error(issues, "A7_STANDARD", "A7 V1 generation is calibrated only to the reviewed A-standard corpus.");
  }
  if (!question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    error(issues, "A7_REFERENCE_MISSING", "Every generated A7 instance must expose a primary historical reference.");
  }
  if (!question.promptParts.length || !question.promptSections.length) {
    error(issues, "A7_PROMPT_EMPTY", "Generated A7 question has no renderable prompt content.");
  }

  if (question.family === "FRACTIONAL_COEFFICIENT") {
    const state = question.mathState;
    if (question.thinking !== "OPERATIONAL") {
      error(issues, "A7_THINKING_FRACTIONAL", "The reviewed fractional A7 family is Operational.");
    }
    if (state.denominatorLcm < A7_GENERATOR_ABSTRACT_ENVELOPE.denominatorLcm.observedMin ||
        state.denominatorLcm > A7_GENERATOR_ABSTRACT_ENVELOPE.denominatorLcm.observedMax) {
      error(issues, "A7_DENOMINATOR_LCM", "Denominator LCM is outside the reviewed 6-10 calibration envelope.");
    }
    if (state.clearedEquation.lhsX === 0 || state.clearedEquation.rhsX === 0) {
      error(issues, "A7_X_BOTH_SIDES", "The V1 fractional family requires x to occur on both sides before rearrangement.");
    }
    if (Math.abs(state.rearrangedEquation.xCoefficient) < A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteRearrangedCoefficient.observedMin ||
        Math.abs(state.rearrangedEquation.xCoefficient) > A7_GENERATOR_ABSTRACT_ENVELOPE.absoluteRearrangedCoefficient.observedMax) {
      error(issues, "A7_REARRANGED_COEFFICIENT", "Rearranged x coefficient is outside the reviewed 7-8 envelope.");
    }
    const expected = reduced({
      numerator: state.rearrangedEquation.constant,
      denominator: state.rearrangedEquation.xCoefficient,
    });
    if (!sameRational(expected, state.solution)) {
      error(issues, "A7_SOLUTION_DRIFT", "Stored fractional solution does not solve the stored rearranged equation.");
    }
    if (state.solution.denominator === 1) {
      error(issues, "A7_INTEGER_SOLUTION", "The core three-mark A7 family requires a non-integer exact solution.");
    }
    if (state.solution.denominator < 7 || state.solution.denominator > 8) {
      error(issues, "A7_SOLUTION_DENOMINATOR", "Reduced solution denominator is outside the reviewed 7-8 envelope.");
    }
    if (historicalA7FractionalOverlap(state)) {
      error(issues, "A7_HISTORICAL_OVERLAP", "Generated displayed equation reproduces a historical cleared equation up to scalar equivalence or side swap.");
    }

    validateFractionalSurfaceGrammar(state, issues);
  } else {
    const state = question.mathState;
    if (question.paper !== "P1") {
      error(issues, "A7_CONTEXT_PAPER", "The reviewed contextual A7 family is currently supported only on Paper 1.");
    }
    if (question.thinking !== "REASONING") {
      error(issues, "A7_THINKING_CONTEXT", "The reviewed equal-area A7 family is Reasoning.");
    }
    if (!Number.isInteger(state.solution) || state.solution <= 0) {
      error(issues, "A7_CONTEXT_SOLUTION", "Equal-area V1 generation requires a positive integer solution.");
    }
    if (state.triangle.base % 2 === 0) {
      error(issues, "A7_HALF_FACTOR_EASED", "Triangle base must be odd so the one-half area factor remains structurally mark-bearing.");
    }
    const triangleHeight = state.solution + state.triangle.heightConstant;
    const rectangleWidth = state.rectangle.widthConstant - state.solution;
    if (triangleHeight <= 0 || rectangleWidth <= 0 || state.triangle.base <= 0 || state.rectangle.height <= 0) {
      error(issues, "A7_CONTEXT_DIMENSIONS", "All generated physical dimensions must be positive at the intended solution.");
    }
    const triangleArea = state.triangle.base * triangleHeight / 2;
    const rectangleArea = state.rectangle.height * rectangleWidth;
    if (triangleArea !== rectangleArea) {
      error(issues, "A7_AREA_MISMATCH", "Generated triangle and rectangle do not have equal areas at the intended solution.");
    }
    if (Math.abs(state.rearrangedEquation.xCoefficient) < 10) {
      error(issues, "A7_CONTEXT_EASED_FINAL_DIVISION", "The final rearranged coefficient must be two-digit to preserve the historical final-mark demand.");
    }
    if (question.visual.triangle.baseLabel !== `${state.triangle.base} cm` ||
        question.visual.rectangle.heightLabel !== `${state.rectangle.height} cm`) {
      error(issues, "A7_VISUAL_STATE_DRIFT", "Area visual labels do not agree with the generated mathematical state.");
    }
    if (question.visual.triangle.heightLatex !== `\\left(x+${state.triangle.heightConstant}\\right)\\,\\text{cm}` ||
        question.visual.rectangle.widthLatex !== `\\left(${state.rectangle.widthConstant}-x\\right)\\,\\text{cm}`) {
      error(issues, "A7_VISUAL_MATH_DRIFT", "Area visual mathematical labels do not agree with the generated mathematical state.");
    }
  }

  if (question.quality.calibrationSourceAnchorIds.length === 0) {
    warning(issues, "A7_NO_CALIBRATION_ANCHOR", "Generated question has no explicit calibration anchor IDs.");
  }

  return {
    valid: !issues.some((issue) => issue.severity === "ERROR"),
    issues,
  };
};
