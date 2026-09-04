import {
  N2_GENERATOR_DIFFICULTY_BANDS,
  N2_GENERATOR_DIFFICULTY_LEVERS,
} from "./Evidence";
import type {
  N2DifficultyMetrics,
  N2Exponent,
  N2GeneratedMathState,
  N2GeneratorDifficulty,
  N2GeneratorDifficultyBandId,
} from "./Types";

export type N2DifficultyAssessment = {
  difficulty: N2GeneratorDifficulty;
  bandId: N2GeneratorDifficultyBandId;
  metrics: N2DifficultyMetrics;
  structuralLevers: string[];
  difficultySignals: string[];
};

const isRational = (value: N2Exponent): value is Exclude<N2Exponent, number> => typeof value !== "number";
const isFractional = (value: N2Exponent) => isRational(value) && value.denominator !== 1;
const isNegative = (value: N2Exponent) => typeof value === "number" ? value < 0 : value.numerator < 0;
const isNegativeFractional = (value: N2Exponent) => isRational(value) && value.denominator !== 1 && value.numerator < 0;

const metricsFor = (state: N2GeneratedMathState): N2DifficultyMetrics => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
      return {
        stageCount: 2,
        negativeExponentCount: 0,
        fractionalExponentCount: 1,
        rootNotationPresent: false,
        bracketedExpressionPresent: false,
        algebraicFractionPresent: false,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
      return {
        stageCount: 3,
        negativeExponentCount: 0,
        fractionalExponentCount: 0,
        rootNotationPresent: false,
        bracketedExpressionPresent: false,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: true,
        positivePowerOutputRequired: false,
      };
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX":
      return {
        stageCount: 3,
        negativeExponentCount: Number(state.innerExponent < 0) + Number(state.outerExponent < 0) + Number(state.secondExponent < 0),
        fractionalExponentCount: 0,
        rootNotationPresent: false,
        bracketedExpressionPresent: true,
        algebraicFractionPresent: false,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: true,
      };
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX":
      return {
        stageCount: 2,
        negativeExponentCount: 1,
        fractionalExponentCount: 1,
        rootNotationPresent: true,
        bracketedExpressionPresent: false,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return {
        stageCount: 2,
        negativeExponentCount: 0,
        fractionalExponentCount: 0,
        rootNotationPresent: false,
        bracketedExpressionPresent: true,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: true,
        positivePowerOutputRequired: false,
      };
    case "PRODUCT_OVER_ROOT":
      return {
        stageCount: 3,
        negativeExponentCount: 0,
        fractionalExponentCount: Number(state.finalExponent.denominator !== 1),
        rootNotationPresent: true,
        bracketedExpressionPresent: false,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
    case "NEGATIVE_INDEX_QUOTIENT":
      return {
        stageCount: 3,
        negativeExponentCount: 1,
        fractionalExponentCount: 0,
        rootNotationPresent: false,
        bracketedExpressionPresent: false,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: true,
      };
    case "DISTRIBUTIVE_INDEX_EXPANSION": {
      const promptExponents = [state.outsideExponent, state.firstTermExponent, state.secondTermExponent];
      return {
        stageCount: 2,
        negativeExponentCount: promptExponents.filter(isNegative).length,
        fractionalExponentCount: promptExponents.filter(isFractional).length,
        rootNotationPresent: false,
        bracketedExpressionPresent: true,
        algebraicFractionPresent: false,
        additiveTermsPresent: true,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
    }
    case "POSITIVE_POWER_PRODUCT_QUOTIENT":
      return {
        stageCount: 3,
        negativeExponentCount: 0,
        fractionalExponentCount: 0,
        rootNotationPresent: false,
        bracketedExpressionPresent: true,
        algebraicFractionPresent: true,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
  }
};

const historicalDefaultDifficulty = (state: N2GeneratedMathState): N2GeneratorDifficulty => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return 1;
    default:
      return 2;
  }
};

const signalsFor = (
  state: N2GeneratedMathState,
  metrics: N2DifficultyMetrics,
  difficulty: N2GeneratorDifficulty,
): string[] => {
  const signals: string[] = [];
  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    signals.push("exact two-stage fractional-index interpretation and evaluation");
    if (difficulty === 2) {
      const representationHarder = (state.rootIndex === 2 && state.exponentNumerator === 5)
        || (state.rootIndex === 3 && state.exponentNumerator >= 4);
      const recognitionHarder = state.rootIndex === 3 && state.exponentNumerator === 2 && state.base >= 216;
      if (representationHarder) signals.push("less familiar fractional numerator increases interpretation demand without changing the two-stage route");
      if (recognitionHarder) signals.push("larger perfect-cube base increases exact root-recognition demand without inflating the final value");
      if (state.exactResult >= 126) signals.push("moderately larger exact value remains within a controlled perfect-power range");
      if (state.exactResult > 343) signals.push("occasional stretch exact value at the top of the upper band");
    }
  }
  if (metrics.stageCount === 3) signals.push("three independently mark-bearing stages");
  if (metrics.negativeExponentCount > 0) signals.push("signed exponent manipulation");
  if (metrics.fractionalExponentCount > 0) signals.push("fractional-exponent representation");
  if (metrics.rootNotationPresent) signals.push("root notation must be translated before or during simplification");
  if (metrics.additiveTermsPresent) signals.push("parallel exponent calculations across a two-term bracket");
  if (metrics.coefficientArithmeticPresent) signals.push("coefficient arithmetic is independently visible");
  if (metrics.positivePowerOutputRequired) signals.push("positive-power conversion is a required final stage");
  if (state.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX" && state.outerExponent < 0) {
    signals.push("negative outer power increases signed-exponent coordination");
  }
  if (state.mechanism === "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX" && state.radicandExponent > 1) {
    signals.push("powered radicand produces a non-unit fractional numerator");
  }
  if (state.mechanism === "DISTRIBUTIVE_INDEX_EXPANSION") {
    const promptExponents = [state.outsideExponent, state.firstTermExponent, state.secondTermExponent];
    if (isFractional(state.outsideExponent)) {
      signals.push("fractional outside power must be distributed across both terms");
    }
    if (promptExponents.some(isNegativeFractional)) {
      signals.push("negative fractional index increases signed-fractional coordination");
    }
  }
  if (state.mechanism === "POSITIVE_POWER_PRODUCT_QUOTIENT") {
    signals.push("three distinct positive-index laws must be coordinated");
  }
  if (difficulty === 2 && state.mechanism !== "FRACTIONAL_NUMERIC_EVALUATION") {
    signals.push("upper-band parameters or representation increase the within-skill demand");
  }
  return signals;
};

export const assessN2Difficulty = (
  state: N2GeneratedMathState,
  requestedDifficulty: N2GeneratorDifficulty = historicalDefaultDifficulty(state),
): N2DifficultyAssessment => {
  const band = N2_GENERATOR_DIFFICULTY_BANDS.find((entry) => entry.difficulty === requestedDifficulty);
  if (!band) throw new Error(`Missing N2 difficulty band ${requestedDifficulty}.`);
  const metrics = metricsFor(state);
  return {
    difficulty: requestedDifficulty,
    bandId: band.bandId,
    metrics,
    structuralLevers: [
      ...N2_GENERATOR_DIFFICULTY_LEVERS.structure,
      ...N2_GENERATOR_DIFFICULTY_LEVERS.representation,
    ],
    difficultySignals: signalsFor(state, metrics, requestedDifficulty),
  };
};
