import {
  N2_GENERATOR_DIFFICULTY_BANDS,
  N2_GENERATOR_DIFFICULTY_LEVERS,
} from "./Evidence";
import type {
  N2DifficultyMetrics,
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

const rationalIsFractional = (value: { denominator: number }) => value.denominator !== 1;

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
        negativeExponentCount: Number(state.innerExponent < 0) + Number(state.secondExponent < 0),
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
        algebraicFractionPresent: false,
        additiveTermsPresent: false,
        coefficientArithmeticPresent: true,
        positivePowerOutputRequired: false,
      };
    case "PRODUCT_OVER_ROOT":
      return {
        stageCount: 3,
        negativeExponentCount: 0,
        fractionalExponentCount: Number(rationalIsFractional(state.finalExponent)),
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
    case "DISTRIBUTIVE_INDEX_EXPANSION":
      return {
        stageCount: 2,
        negativeExponentCount: 1,
        fractionalExponentCount: 2,
        rootNotationPresent: false,
        bracketedExpressionPresent: true,
        algebraicFractionPresent: false,
        additiveTermsPresent: true,
        coefficientArithmeticPresent: false,
        positivePowerOutputRequired: false,
      };
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

const difficultyForMechanism = (state: N2GeneratedMathState): N2GeneratorDifficulty => {
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION":
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT":
    case "SQUARED_FRACTIONAL_MONOMIAL":
      return 1;
    default:
      return 2;
  }
};

const signalsFor = (state: N2GeneratedMathState, metrics: N2DifficultyMetrics): string[] => {
  const signals: string[] = [];
  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION") {
    signals.push("exact two-stage fractional-index interpretation and evaluation");
  }
  if (metrics.stageCount === 3) signals.push("three independently mark-bearing stages");
  if (metrics.negativeExponentCount > 0) signals.push("signed exponent manipulation");
  if (metrics.fractionalExponentCount > 0) signals.push("fractional-exponent representation");
  if (metrics.rootNotationPresent) signals.push("root notation must be translated before or during simplification");
  if (metrics.additiveTermsPresent) signals.push("parallel exponent calculations across a two-term bracket");
  if (metrics.coefficientArithmeticPresent) signals.push("coefficient arithmetic is independently visible");
  if (metrics.positivePowerOutputRequired) signals.push("positive-power conversion is a required final stage");
  if (state.mechanism === "POSITIVE_POWER_PRODUCT_QUOTIENT") {
    signals.push("three distinct positive-index laws must be coordinated");
  }
  return signals;
};

export const assessN2Difficulty = (state: N2GeneratedMathState): N2DifficultyAssessment => {
  const difficulty = difficultyForMechanism(state);
  const band = N2_GENERATOR_DIFFICULTY_BANDS.find((entry) => entry.difficulty === difficulty);
  if (!band) throw new Error(`Missing N2 difficulty band ${difficulty}.`);
  const metrics = metricsFor(state);
  return {
    difficulty,
    bandId: band.bandId,
    metrics,
    structuralLevers: [
      ...N2_GENERATOR_DIFFICULTY_LEVERS.structure,
      ...N2_GENERATOR_DIFFICULTY_LEVERS.representation,
    ],
    difficultySignals: signalsFor(state, metrics),
  };
};
