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
 * Teacher-moderated difficulty model added after visual QA of the first A7
 * generator batches. Difficulty is deliberately separate from Standard: every
 * currently supported A7 family remains A-standard, but the numerical and
 * structural gymnastics required can still vary meaningfully inside that
 * standard.
 */
export const A7_DIFFICULTY_BANDS: readonly A7DifficultyBandCalibration[] = [
  {
    difficulty: 1,
    bandId: "LOWER_VALID",
    scoreMin: 0,
    scoreMax: 4,
    description: "Lower valid A7 demand: compact denominator clearing and restrained arithmetic, while still preserving all three mark-bearing algebra stages.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    scoreMin: 5,
    scoreMax: 99,
    description: "Upper valid A7 demand: more involved denominator clearing, binomial-fraction structure and/or larger written arithmetic, without ceasing to look like an SQA National 5 question.",
  },
] as const;

/**
 * This is a generation envelope, not a claim that these values were all
 * observed historically. The historical corpus remains the anchor; the wider
 * values below are a teacher-authorised interpolation designed to increase
 * variety while preserving SQA-like restraint.
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

/**
 * Controlled denominator pairings. No displayed denominator exceeds 10 and no
 * LCD exceeds 15. The original 3/6, 2/5 and 2/3 pairings remain present, with
 * a small number of natural extensions such as 3/4, 3/5, 4/6 and 4/8.
 */
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
  "Difficulty is scored from the actual written route, not from the final answer alone.",
  "A larger LCD increases written arithmetic demand, especially at 12 or 15.",
  "A binomial numerator increases structural demand because clearing denominators introduces a bracketed expression.",
  "Larger cleared coefficients/constants and a larger rearranged coefficient increase numerical gymnastics.",
  "A less immediately simple exact fraction can add demand, but final-fraction size is only one signal among several.",
  "The equal-area contextual family is treated as upper-band A7 because candidates must translate a diagram into algebra before completing the linear solve.",
  "No difficulty increase is permitted merely by making numbers ugly; every generated surface must still pass the SQA-look-and-feel guardrails.",
] as const;
