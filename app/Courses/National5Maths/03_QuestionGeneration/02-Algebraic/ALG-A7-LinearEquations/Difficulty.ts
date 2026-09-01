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
  const band = A7_GENERATOR_DIFFICULTY_BANDS.find((candidate) => score >= candidate.scoreMin && score <= candidate.scoreMax);
  if (!band) return { difficulty: 2, bandId: "UPPER_VALID" };
  return { difficulty: band.difficulty, bandId: band.bandId };
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
  const surfaceComplexity: 1 | 2 = state.surfaceVariant === "SPLIT_TERMS" ? 1 : 2;

  let score = 0;
  const signals: string[] = [];

  if (state.denominatorLcm >= 10) {
    score += 1;
    signals.push(`LCD ${state.denominatorLcm} adds denominator-clearing arithmetic.`);
  }
  if (state.denominatorLcm >= 12) {
    score += 1;
    signals.push("LCD is in the upper moderated range (12-15).");
  }
  if (surfaceComplexity === 2) {
    score += 2;
    signals.push("A binomial numerator introduces a bracketed expression when denominators are cleared.");
  }
  if (largestWorkingCoefficient >= 12) {
    score += 1;
    signals.push(`Cleared working contains a coefficient of magnitude ${largestWorkingCoefficient}.`);
  }
  if (largestWorkingConstant >= 12) {
    score += 1;
    signals.push(`Cleared working contains a constant of magnitude ${largestWorkingConstant}.`);
  }
  if (rearrangedCoefficientMagnitude >= 9) {
    score += 1;
    signals.push(`The final rearranged x coefficient has magnitude ${rearrangedCoefficientMagnitude}.`);
  }
  if (state.solution.denominator >= 7) {
    score += 1;
    signals.push(`The reduced exact solution has denominator ${state.solution.denominator}.`);
  }
  if (solutionNumeratorMagnitude >= 10) {
    score += 1;
    signals.push(`The reduced exact solution has numerator magnitude ${solutionNumeratorMagnitude}.`);
  }

  if (!signals.length) {
    signals.push("Compact written arithmetic while preserving all three mark-bearing algebra stages.");
  }

  const band = bandForScore(score);
  return {
    difficulty: band.difficulty,
    bandId: band.bandId,
    score,
    metrics: {
      denominatorLcm: state.denominatorLcm,
      surfaceComplexity,
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

  let score = 5;
  const signals = [
    "The candidate must translate two diagram dimensions into area expressions before solving.",
    "The triangle one-half factor must be preserved and transformed correctly.",
  ];

  if (largestWorkingCoefficient >= 12) {
    score += 1;
    signals.push(`Expanded working contains a coefficient of magnitude ${largestWorkingCoefficient}.`);
  }
  if (largestWorkingConstant >= 40) {
    score += 1;
    signals.push(`Expanded working contains a constant of magnitude ${largestWorkingConstant}.`);
  }
  if (rearrangedCoefficientMagnitude >= 15) {
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
      largestWorkingCoefficient,
      largestWorkingConstant,
      rearrangedCoefficientMagnitude,
      solutionNumeratorMagnitude: Math.abs(state.solution),
      solutionDenominator: null,
    },
    signals,
  };
};
