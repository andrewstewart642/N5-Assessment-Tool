export type A7DifficultyLevel = 1 | 2;
export type A7DifficultyBandId = "LOWER_VALID" | "UPPER_VALID";

export type A7DifficultyBandCalibration = {
  difficulty: A7DifficultyLevel;
  bandId: A7DifficultyBandId;
  scoreMin: number;
  scoreMax: number;
  description: string;
};

/**
 * Teacher-moderated difficulty model. Difficulty is deliberately separate from
 * Standard: every currently supported A7 family remains A-standard. The split
 * is based on the complexity of the actual written route a pupil must perform.
 */
export const A7_DIFFICULTY_BANDS: readonly A7DifficultyBandCalibration[] = [
  {
    difficulty: 1,
    bandId: "LOWER_VALID",
    scoreMin: 0,
    scoreMax: 3,
    description: "Lower valid A7 demand: denominator clearing and rearrangement remain genuine, but there is no extra bracket-expansion burden and the written arithmetic stays restrained.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    scoreMin: 4,
    scoreMax: 99,
    description: "Upper valid A7 demand: an additional expansion step and/or clearly heavier written arithmetic is required, while the question still looks and feels at home on an SQA National 5 paper.",
  },
] as const;

/**
 * Generation envelope, not a claim that every value below has appeared in the
 * reviewed corpus. It is a moderated interpolation around the historical
 * examples designed to increase variety without turning A7 into a rational-
 * expressions exercise.
 */
export const A7_FRACTIONAL_GENERATION_ENVELOPE = {
  displayedDenominatorMax: 10,
  denominatorLcmMax: 15,
  absoluteClearedCoefficientMax: 18,
  absoluteClearedConstantMax: 18,
  absoluteRearrangedCoefficient: { min: 5, max: 12 },
  solutionNumeratorMagnitude: { min: 2, max: 20 },
  solutionDenominator: { min: 2, max: 12 },
} as const;

export const A7_FRACTIONAL_DENOMINATOR_PAIRS = [
  { left: 2, right: 3, lcm: 6, difficultyBands: [1, 2] },
  { left: 3, right: 6, lcm: 6, difficultyBands: [1, 2] },
  { left: 2, right: 5, lcm: 10, difficultyBands: [1, 2] },
  { left: 5, right: 10, lcm: 10, difficultyBands: [1, 2] },
  { left: 4, right: 8, lcm: 8, difficultyBands: [1, 2] },
  { left: 3, right: 4, lcm: 12, difficultyBands: [2] },
  { left: 4, right: 6, lcm: 12, difficultyBands: [2] },
  { left: 3, right: 5, lcm: 15, difficultyBands: [2] },
] as const;

export const A7_DIFFICULTY_SCORING_RULES = [
  "Difficulty is scored from the route the pupil must actually write, not from the visual presence of a binomial or from the final answer alone.",
  "A binomial numerator only creates an additional difficulty step when denominator clearing leaves a multiplier greater than one outside that binomial and therefore requires a genuine bracket expansion.",
  "A genuine additional bracket expansion is a strong upper-band signal.",
  "A larger LCD, larger cleared coefficients/constants and a larger rearranged coefficient can also raise demand when they materially increase written arithmetic.",
  "Final-fraction size is a minor supporting signal, never the main reason a question becomes upper-band.",
  "The equal-area contextual family is upper-band because candidates must translate a diagram into algebra before solving; more complex linear dimension expressions can increase its internal score without changing the five-mark family.",
  "No difficulty increase is permitted merely by making numbers ugly: every generated surface must still pass the 'would this look and feel like SQA?' moderation check.",
] as const;
