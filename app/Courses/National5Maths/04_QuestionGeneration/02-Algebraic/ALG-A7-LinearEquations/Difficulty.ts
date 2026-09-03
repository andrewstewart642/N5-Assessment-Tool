import { A7_GENERATOR_DIFFICULTY_BANDS } from "./Evidence";
import type {
  A7ContextAreaState,
  A7DifficultyMetrics,
  A7FractionalEquationState,
  A7GeneratorDifficulty,
  A7GeneratorDifficultyBandId,
} from "./Types";

export type A7DifficultyAssessment = {
  difficulty: A7GeneratorDifficulty;
  bandId: A7GeneratorDifficultyBandId;
  score: number;
  metrics: A7DifficultyMetrics;
  signals: string[];
};

const absoluteMax = (values: readonly number[]) => Math.max(...values.map((value) => Math.abs(value)));

const bandForScore = (score: number): { difficulty: A7GeneratorDifficulty; bandId: A7GeneratorDifficultyBandId } => {
  const band = A7_GENERATOR_DIFFICULTY_BANDS.find((candidate) => score >= candidate.scoreMin && score <= candidate.scoreMax)
    ?? A7_GENERATOR_DIFFICULTY_BANDS[A7_GENERATOR_DIFFICULTY_BANDS.length - 1];
  return { difficulty: band.difficulty, bandId: band.bandId };
};

const fractionalBracketProfile = (state: A7FractionalEquationState) => {
  const leftMultiplier = state.denominatorLcm / state.lhsX.denominator;
  const rightMultiplier = state.denominatorLcm / state.rhsX.denominator;
  const leftBinomial = state.surfaceVariant === "BINOMIAL_LEFT_NUMERATOR" || state.surfaceVariant === "BINOMIAL_BOTH_SIDES";
  const rightBinomial = state.surfaceVariant === "BINOMIAL_RIGHT_NUMERATOR" || state.surfaceVariant === "BINOMIAL_BOTH_SIDES";
  const multipliers = [
    leftBinomial && leftMultiplier > 1 ? leftMultiplier : 0,
    rightBinomial && rightMultiplier > 1 ? rightMultiplier : 0,
  ].filter((value) => value > 0);
  return {
    count: multipliers.length,
    largestMultiplier: multipliers.length ? Math.max(...multipliers) : 1,
  };
};

export const assessA7FractionalDifficulty = (state: A7FractionalEquationState): A7DifficultyAssessment => {
  const largestWorkingCoefficient = absoluteMax([
    state.clearedEquation.lhsX,
    state.clearedEquation.rhsX,
  ]);
  const largestWorkingConstant = absoluteMax([
    state.clearedEquation.lhsConstant,
    state.clearedEquation.rhsConstant,
  ]);
  const rearrangedCoefficientMagnitude = Math.abs(state.rearrangedEquation.xCoefficient);
  const solutionNumeratorMagnitude = Math.abs(state.solution.numerator);
  const bracketProfile = fractionalBracketProfile(state);
  const surfaceComplexity: 1 | 2 | 3 = state.surfaceVariant === "SPLIT_TERMS"
    ? 1
    : state.surfaceVariant === "BINOMIAL_BOTH_SIDES" ? 3 : 2;
  const nonUnitLinearCoefficientCount = [state.lhsX, state.rhsX]
    .filter((term) => Math.abs(term.numerator) > 1).length;

  let score = 0;
  const signals: string[] = [];

  if (bracketProfile.count > 0) {
    score += 4 * bracketProfile.count;
    signals.push(`${bracketProfile.count} genuine bracket expansion${bracketProfile.count === 1 ? " is" : "s are"} required after denominator clearing.`);
  }
  if (bracketProfile.largestMultiplier >= 3) {
    score += 1;
    signals.push(`The largest bracket multiplier is ${bracketProfile.largestMultiplier}.`);
  }
  if (state.denominatorLcm >= 10) {
    score += 1;
    signals.push(`LCD ${state.denominatorLcm} adds denominator-clearing arithmetic.`);
  }
  if (state.denominatorLcm >= 12) {
    score += 1;
    signals.push("The LCD is in the upper moderated range (12-15).");
  }
  if (largestWorkingCoefficient >= 12) {
    score += 1;
    signals.push(`Cleared working contains a coefficient of magnitude ${largestWorkingCoefficient}.`);
  }
  if (largestWorkingConstant >= 12) {
    score += 1;
    signals.push(`Cleared working contains a constant of magnitude ${largestWorkingConstant}.`);
  }
  if (rearrangedCoefficientMagnitude >= 10) {
    score += 1;
    signals.push(`The final rearranged x coefficient has magnitude ${rearrangedCoefficientMagnitude}.`);
  }
  if (state.solution.denominator >= 9) {
    score += 1;
    signals.push(`The reduced exact solution has denominator ${state.solution.denominator}.`);
  }
  if (solutionNumeratorMagnitude >= 12) {
    score += 1;
    signals.push(`The reduced exact solution has numerator magnitude ${solutionNumeratorMagnitude}.`);
  }

  if (!signals.length) {
    signals.push("Compact written arithmetic with no additional bracket-expansion step after denominator clearing.");
  }

  const band = bandForScore(score);
  return {
    difficulty: band.difficulty,
    bandId: band.bandId,
    score,
    metrics: {
      denominatorLcm: state.denominatorLcm,
      surfaceComplexity,
      bracketExpansionCount: bracketProfile.count,
      largestBracketMultiplier: bracketProfile.largestMultiplier,
      nonUnitLinearCoefficientCount,
      largestWorkingCoefficient,
      largestWorkingConstant,
      rearrangedCoefficientMagnitude,
      solutionNumeratorMagnitude,
      solutionDenominator: state.solution.denominator,
    },
    signals,
  };
};

export const assessA7ContextDifficulty = (state: A7ContextAreaState): A7DifficultyAssessment => {
  const largestWorkingCoefficient = absoluteMax([
    state.clearedEquation.leftXCoefficient,
    state.clearedEquation.rightXCoefficient,
  ]);
  const largestWorkingConstant = absoluteMax([
    state.clearedEquation.leftConstant,
    state.clearedEquation.rightConstant,
  ]);
  const rearrangedCoefficientMagnitude = Math.abs(state.rearrangedEquation.xCoefficient);
  const nonUnitLinearCoefficientCount = [
    state.triangle.linearDimension.xCoefficient,
    state.rectangle.linearDimension.xCoefficient,
  ].filter((coefficient) => Math.abs(coefficient) > 1).length;
  const largestBracketMultiplier = Math.max(
    state.triangle.fixedDimension,
    2 * state.rectangle.fixedDimension,
  );

  let score = 5;
  const signals = [
    "The candidate must translate two diagram dimensions into area expressions before solving.",
    "The triangle one-half factor must be preserved and transformed correctly.",
    "Both area expressions require expansion during the algebraic solve.",
  ];

  if (nonUnitLinearCoefficientCount > 0) {
    score += 2 * nonUnitLinearCoefficientCount;
    signals.push(`${nonUnitLinearCoefficientCount} generated dimension expression${nonUnitLinearCoefficientCount === 1 ? " has" : "s have"} a non-unit x coefficient.`);
  }
  if (largestBracketMultiplier >= 14) {
    score += 1;
    signals.push(`The largest area-expression multiplier is ${largestBracketMultiplier}.`);
  }
  if (largestWorkingConstant >= 60) {
    score += 1;
    signals.push(`Expanded working contains a constant of magnitude ${largestWorkingConstant}.`);
  }
  if (rearrangedCoefficientMagnitude >= 20) {
    score += 1;
    signals.push(`The final rearranged coefficient is ${rearrangedCoefficientMagnitude}.`);
  }

  return {
    difficulty: 2,
    bandId: "UPPER_VALID",
    score,
    metrics: {
      denominatorLcm: null,
      surfaceComplexity: 3,
      bracketExpansionCount: 2,
      largestBracketMultiplier,
      nonUnitLinearCoefficientCount,
      largestWorkingCoefficient,
      largestWorkingConstant,
      rearrangedCoefficientMagnitude,
      solutionNumeratorMagnitude: Math.abs(state.solution),
      solutionDenominator: null,
    },
    signals,
  };
};
