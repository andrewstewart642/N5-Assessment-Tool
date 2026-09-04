import type {
  G1BestFitGeneratedQuestion,
  G1ContextualGeneratedQuestion,
  G1LineEquationGeneratedQuestion,
  G1SymbolicGeneratedQuestion,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import {
  g1AnswerRationalPlain,
  g1GradientCalculationLatex,
  g1GradientCalculationPlain,
  g1ModelApplicationLatex,
  g1ModelApplicationPlain,
  g1PointSlopeLatex,
  g1PointSlopePlain,
  g1SlopeInterceptSubstitutionLatex,
  g1SlopeInterceptSubstitutionPlain,
  g1SymbolicFactorCancelLatex,
} from "./Formatting";
import type {
  G1GeneratedAnswerMethod,
  G1GeneratedAnswerProfile,
} from "./Types";

type NumericQuestion =
  | G1LineEquationGeneratedQuestion
  | G1ContextualGeneratedQuestion
  | G1BestFitGeneratedQuestion;

const methodGradientPoints = (question: NumericQuestion) => {
  if (question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS") {
    const points = question.mathState.lineReadPoints;
    return [points[0], points[points.length - 1]] as const;
  }
  return question.mathState.points;
};

const anchorPoint = (question: NumericQuestion) =>
  question.family === "BEST_FIT_LINEAR_MODEL" && question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"
    ? question.mathState.lineReadPoints[0]
    : question.mathState.points[0];

export const buildG1NumericMethods = (
  question: NumericQuestion,
  profile: G1GeneratedAnswerProfile,
): G1GeneratedAnswerMethod[] => {
  const state = question.mathState;
  const [first, second] = methodGradientPoints(question);
  const anchor = anchorPoint(question);
  const sourceEvidenceIds = [...profile.sourceAnchorIds];

  const slopeIntercept: G1GeneratedAnswerMethod = {
    methodFamilyId: "SLOPE_INTERCEPT",
    sourceEvidenceIds,
    lines: [
      {
        id: `${question.instanceId}-GRADIENT`,
        text: g1GradientCalculationPlain(first, second, state.gradient),
        latex: g1GradientCalculationLatex(first, second, state.gradient),
        markNumbers: [1],
      },
      {
        id: `${question.instanceId}-INTERCEPT`,
        text: g1SlopeInterceptSubstitutionPlain(state, anchor),
        latex: g1SlopeInterceptSubstitutionLatex(state, anchor),
        markNumbers: [2],
      },
      {
        id: `${question.instanceId}-EQUATION`,
        text: state.equationPlain,
        latex: state.equationLatex,
        markNumbers: [3],
      },
    ],
  };

  const pointSlope: G1GeneratedAnswerMethod = {
    methodFamilyId: "POINT_SLOPE",
    sourceEvidenceIds,
    lines: [
      {
        id: `${question.instanceId}-GRADIENT-POINT-SLOPE`,
        text: g1GradientCalculationPlain(first, second, state.gradient),
        latex: g1GradientCalculationLatex(first, second, state.gradient),
        markNumbers: [1],
      },
      {
        id: `${question.instanceId}-POINT-SLOPE`,
        text: g1PointSlopePlain(state, anchor),
        latex: g1PointSlopeLatex(state, anchor),
        markNumbers: [2],
      },
      {
        id: `${question.instanceId}-POINT-SLOPE-FINAL`,
        text: state.equationPlain,
        latex: state.equationLatex,
        markNumbers: [3],
      },
    ],
  };

  if (question.family !== "CONTEXTUAL_LINEAR_MODEL") {
    return [slopeIntercept, pointSlope];
  }

  const application: G1GeneratedAnswerMethod = {
    methodFamilyId: "MODEL_APPLICATION",
    sourceEvidenceIds,
    lines: [
      {
        id: `${question.instanceId}-APPLICATION`,
        text: g1ModelApplicationPlain(state, state.followUp.input, state.followUp.exactOutput),
        latex: g1ModelApplicationLatex(state, state.followUp.input, state.followUp.exactOutput),
        markNumbers: [4],
      },
      {
        id: `${question.instanceId}-APPLICATION-CONTEXT`,
        text: `${g1AnswerRationalPlain(state.followUp.exactOutput)} ${state.followUp.outputUnit}`,
        latex: null,
        markNumbers: [4],
      },
    ],
  };

  return [slopeIntercept, pointSlope, application];
};

export const buildG1SymbolicMethod = (
  question: G1SymbolicGeneratedQuestion,
  profile: G1GeneratedAnswerProfile,
): G1GeneratedAnswerMethod => {
  const state = question.mathState;
  return {
    methodFamilyId: "SYMBOLIC_FACTOR_CANCEL",
    sourceEvidenceIds: [...profile.sourceAnchorIds],
    lines: [
      {
        id: `${question.instanceId}-SYMBOLIC-QUOTIENT`,
        text: "Substitute both generated points into the two-point gradient quotient.",
        latex: `m=${state.gradientQuotientLatex}`,
        markNumbers: [1],
      },
      {
        id: `${question.instanceId}-SYMBOLIC-FACTOR`,
        text: "Factor the difference-of-squares numerator.",
        latex: `m=\\frac{${state.numeratorFactorisationLatex}}{${state.denominatorFactorisationLatex}}`,
        markNumbers: [2],
      },
      {
        id: `${question.instanceId}-SYMBOLIC-CANCEL`,
        text: "Factor the denominator, cancel the common factor and simplify the exact gradient.",
        latex: g1SymbolicFactorCancelLatex(state),
        markNumbers: [3],
      },
    ],
  };
};
