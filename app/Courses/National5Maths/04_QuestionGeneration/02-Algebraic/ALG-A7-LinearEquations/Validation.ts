import { historicalA7FractionalOverlap } from "./Calibration";
import { assessA7ContextDifficulty, assessA7FractionalDifficulty } from "./Difficulty";
import {
  A7_GENERATOR_FAMILY_EVIDENCE,
  A7_GENERATOR_FRACTIONAL_DENOMINATOR_PAIRS,
  A7_GENERATOR_FRACTIONAL_GENERATION_ENVELOPE,
} from "./Evidence";
import type {
  A7ContextAreaState,
  A7FractionalEquationState,
  A7GeneratedQuestion,
  A7LinearDimension,
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

const displayedDenominatorPair = (state: A7FractionalEquationState): [number, number] =>
  state.surfaceVariant === "SPLIT_TERMS"
    ? [state.lhsX.denominator, state.lhsConstant.denominator]
    : [state.lhsX.denominator, state.rhsX.denominator];

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
      error(issues, "A7_SURFACE_SPLIT_GRAMMAR", "SPLIT_TERMS must remain a clean ax/d1 - b/d2 = cx equation with distinct fractional denominators and no leading negative term.");
    }
    if (state.solution.numerator >= 0) {
      error(issues, "A7_SURFACE_SPLIT_SIGN", "The split-term surface is reserved for the reviewed negative-solution sign architecture.");
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
      error(issues, "A7_SURFACE_RIGHT_BINOMIAL", "BINOMIAL_RIGHT_NUMERATOR must retain the clean ax/d1 - n = (b-cx)/d2 grammar.");
    }
    if (state.solution.numerator <= 0) {
      error(issues, "A7_SURFACE_RIGHT_SIGN", "The right-binomial surface is calibrated to a positive exact solution.");
    }
    return;
  }

  if (state.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR") {
    const valid =
      state.lhsX.numerator > 0 && state.lhsX.denominator > 1 &&
      state.lhsConstant.numerator > 0 &&
      state.lhsConstant.denominator === state.lhsX.denominator &&
      state.rhsX.numerator > 0 && state.rhsX.denominator > 1 &&
      state.rhsConstant.numerator > 0 && state.rhsConstant.denominator === 1 &&
      state.lhsX.denominator !== state.rhsX.denominator;
    if (!valid) {
      error(issues, "A7_SURFACE_LEFT_BINOMIAL", "BINOMIAL_LEFT_NUMERATOR must retain the clean (ax+b)/d1 = cx/d2 + n grammar.");
    }
    if (state.solution.numerator <= 0) {
      error(issues, "A7_SURFACE_LEFT_SIGN", "The left-binomial surface is calibrated to a positive exact solution.");
    }
    return;
  }

  const valid =
    state.lhsX.numerator > 0 && state.lhsX.denominator > 1 &&
    state.lhsConstant.numerator > 0 && state.lhsConstant.denominator === state.lhsX.denominator &&
    state.rhsX.numerator > 0 && state.rhsX.denominator > 1 &&
    state.rhsConstant.numerator > 0 && state.rhsConstant.denominator === state.rhsX.denominator &&
    state.lhsX.denominator !== state.rhsX.denominator;
  if (!valid) {
    error(issues, "A7_SURFACE_DOUBLE_BINOMIAL", "BINOMIAL_BOTH_SIDES must remain a compact (ax+b)/d1 = (cx+d)/d2 equation with distinct denominators and positive leading terms.");
  }
  if (state.solution.numerator <= 0) {
    error(issues, "A7_SURFACE_DOUBLE_SIGN", "The double-binomial extension is calibrated to a positive exact solution.");
  }
};

const dimensionAt = (dimension: A7LinearDimension, x: number) =>
  dimension.xCoefficient * x + dimension.constant;

const dimensionLatex = (dimension: A7LinearDimension) => {
  const magnitude = Math.abs(dimension.xCoefficient);
  const xTerm = magnitude === 1 ? "x" : `${magnitude}x`;
  const body = dimension.xCoefficient > 0
    ? `${xTerm}+${dimension.constant}`
    : `${dimension.constant}-${xTerm}`;
  return `\\left(${body}\\right)\\,\\text{cm}`;
};

const fixedLatex = (value: number) => `${value}\\,\\text{cm}`;

const expectedVisualLatex = (state: A7ContextAreaState) => ({
  triangleBase: state.triangle.algebraicDimension === "BASE" ? dimensionLatex(state.triangle.linearDimension) : fixedLatex(state.triangle.fixedDimension),
  triangleHeight: state.triangle.algebraicDimension === "HEIGHT" ? dimensionLatex(state.triangle.linearDimension) : fixedLatex(state.triangle.fixedDimension),
  rectangleWidth: state.rectangle.algebraicDimension === "BASE" ? dimensionLatex(state.rectangle.linearDimension) : fixedLatex(state.rectangle.fixedDimension),
  rectangleHeight: state.rectangle.algebraicDimension === "HEIGHT" ? dimensionLatex(state.rectangle.linearDimension) : fixedLatex(state.rectangle.fixedDimension),
});

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
    error(issues, "A7_STANDARD", "A7 generation is calibrated only to the reviewed A-standard corpus.");
  }
  if (question.difficulty !== 1 && question.difficulty !== 2) {
    error(issues, "A7_DIFFICULTY_VALUE", "A7 difficulty must be band 1 or band 2.");
  }
  if (!question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    error(issues, "A7_REFERENCE_MISSING", "Every generated A7 instance must expose a primary historical reference.");
  }
  if (!question.promptParts.length || !question.promptSections.length) {
    error(issues, "A7_PROMPT_EMPTY", "Generated A7 question has no renderable prompt content.");
  }

  if (question.family === "FRACTIONAL_COEFFICIENT") {
    const state = question.mathState;
    const envelope = A7_GENERATOR_FRACTIONAL_GENERATION_ENVELOPE;
    const assessment = assessA7FractionalDifficulty(state);

    if (question.thinking !== "OPERATIONAL") {
      error(issues, "A7_THINKING_FRACTIONAL", "The reviewed fractional A7 family is Operational.");
    }

    const [displayedLeft, displayedRight] = displayedDenominatorPair(state);
    const allowedPair = A7_GENERATOR_FRACTIONAL_DENOMINATOR_PAIRS.some((pair) =>
      pair.left === displayedLeft && pair.right === displayedRight,
    );
    if (!allowedPair) {
      error(issues, "A7_DENOMINATOR_PAIR", `Displayed denominator pair ${displayedLeft}/${displayedRight} is outside the moderated pairing set.`);
    }
    if (displayedLeft > envelope.displayedDenominatorMax || displayedRight > envelope.displayedDenominatorMax) {
      error(issues, "A7_DISPLAYED_DENOMINATOR", "Displayed denominators exceed the moderated maximum of 10.");
    }
    if (state.denominatorLcm > envelope.denominatorLcmMax) {
      error(issues, "A7_DENOMINATOR_LCM", "Denominator LCM exceeds the moderated maximum of 15.");
    }
    if (state.clearedEquation.lhsX === 0 || state.clearedEquation.rhsX === 0) {
      error(issues, "A7_X_BOTH_SIDES", "The fractional family requires x on both sides before rearrangement.");
    }
    if (Math.abs(state.clearedEquation.lhsX) > envelope.absoluteClearedCoefficientMax ||
        Math.abs(state.clearedEquation.rhsX) > envelope.absoluteClearedCoefficientMax ||
        Math.abs(state.clearedEquation.lhsConstant) > envelope.absoluteClearedConstantMax ||
        Math.abs(state.clearedEquation.rhsConstant) > envelope.absoluteClearedConstantMax) {
      error(issues, "A7_WORKING_MAGNITUDE", "Cleared working exceeds the moderated written-arithmetic envelope.");
    }
    if (Math.abs(state.rearrangedEquation.xCoefficient) < envelope.absoluteRearrangedCoefficient.min ||
        Math.abs(state.rearrangedEquation.xCoefficient) > envelope.absoluteRearrangedCoefficient.max) {
      error(issues, "A7_REARRANGED_COEFFICIENT", "Rearranged x coefficient is outside the moderated 5-12 envelope.");
    }

    const expected = reduced({
      numerator: state.rearrangedEquation.constant,
      denominator: state.rearrangedEquation.xCoefficient,
    });
    if (!sameRational(expected, state.solution)) {
      error(issues, "A7_SOLUTION_DRIFT", "Stored fractional solution does not solve the stored rearranged equation.");
    }
    if (state.solution.denominator === 1) {
      error(issues, "A7_INTEGER_SOLUTION", "The three-mark A7 family requires a non-integer exact solution.");
    }
    if (state.solution.denominator < envelope.solutionDenominator.min ||
        state.solution.denominator > envelope.solutionDenominator.max) {
      error(issues, "A7_SOLUTION_DENOMINATOR", "Reduced solution denominator is outside the moderated 2-12 envelope.");
    }
    if (Math.abs(state.solution.numerator) < envelope.solutionNumeratorMagnitude.min ||
        Math.abs(state.solution.numerator) > envelope.solutionNumeratorMagnitude.max) {
      error(issues, "A7_SOLUTION_NUMERATOR", "Reduced solution numerator is outside the moderated magnitude envelope.");
    }
    if (historicalA7FractionalOverlap(state)) {
      error(issues, "A7_HISTORICAL_OVERLAP", "Generated displayed equation reproduces a historical cleared equation up to scalar equivalence or side swap.");
    }

    validateFractionalSurfaceGrammar(state, issues);

    if (assessment.difficulty !== question.difficulty ||
        assessment.bandId !== question.quality.difficultyBandId ||
        assessment.score !== question.quality.difficultyScore) {
      error(issues, "A7_DIFFICULTY_DRIFT", "Stored A7 difficulty metadata does not match the route-based assessment.");
    }
  } else {
    const state = question.mathState;
    const assessment = assessA7ContextDifficulty(state);

    if (question.paper !== "P1") {
      error(issues, "A7_CONTEXT_PAPER", "The reviewed contextual A7 family is currently supported only on Paper 1.");
    }
    if (question.difficulty !== 2) {
      error(issues, "A7_CONTEXT_DIFFICULTY", "The five-mark contextual A7 family is calibrated to difficulty band 2.");
    }
    if (question.thinking !== "REASONING") {
      error(issues, "A7_THINKING_CONTEXT", "The equal-area A7 family is Reasoning.");
    }
    if (!Number.isInteger(state.solution) || state.solution <= 0) {
      error(issues, "A7_CONTEXT_SOLUTION", "Equal-area generation requires a positive integer solution.");
    }
    if (state.triangle.fixedDimension % 2 === 0) {
      error(issues, "A7_HALF_FACTOR_EASED", "The triangle fixed dimension must be odd so the one-half area factor remains structurally mark-bearing.");
    }
    for (const dimension of [state.triangle.linearDimension, state.rectangle.linearDimension]) {
      if (![1, 2].includes(Math.abs(dimension.xCoefficient)) || dimension.constant < 1 || dimension.constant > 20) {
        error(issues, "A7_CONTEXT_LINEAR_DIMENSION", "Context linear dimensions must use moderated coefficients ±1/±2 and constants 1-20.");
      }
    }

    const triangleLinearValue = dimensionAt(state.triangle.linearDimension, state.solution);
    const rectangleLinearValue = dimensionAt(state.rectangle.linearDimension, state.solution);
    if (triangleLinearValue <= 0 || rectangleLinearValue <= 0 || state.triangle.fixedDimension <= 0 || state.rectangle.fixedDimension <= 0) {
      error(issues, "A7_CONTEXT_DIMENSIONS", "All generated physical dimensions must be positive at the intended solution.");
    }
    const triangleArea = state.triangle.fixedDimension * triangleLinearValue / 2;
    const rectangleArea = state.rectangle.fixedDimension * rectangleLinearValue;
    if (triangleArea !== rectangleArea) {
      error(issues, "A7_AREA_MISMATCH", "Generated triangle and rectangle do not have equal areas at the intended solution.");
    }
    if (Math.abs(state.rearrangedEquation.xCoefficient) < 10 || Math.abs(state.rearrangedEquation.xCoefficient) > 30) {
      error(issues, "A7_CONTEXT_FINAL_DIVISION", "The final contextual x coefficient must remain in the moderated two-digit 10-30 range.");
    }

    const expectedVisual = expectedVisualLatex(state);
    if (question.visual.triangle.baseLatex !== expectedVisual.triangleBase ||
        question.visual.triangle.heightLatex !== expectedVisual.triangleHeight ||
        question.visual.rectangle.widthLatex !== expectedVisual.rectangleWidth ||
        question.visual.rectangle.heightLatex !== expectedVisual.rectangleHeight) {
      error(issues, "A7_VISUAL_STATE_DRIFT", "Area visual labels do not agree with the generated dimension placement/state.");
    }
    if (assessment.difficulty !== question.difficulty ||
        assessment.bandId !== question.quality.difficultyBandId ||
        assessment.score !== question.quality.difficultyScore) {
      error(issues, "A7_CONTEXT_DIFFICULTY_DRIFT", "Stored contextual difficulty metadata does not match the route-based assessment.");
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
