export type G1DifficultyLevel = 1 | 2;
export type G1DifficultyBandId = "LOWER_VALID" | "UPPER_VALID";

export type G1DifficultyBandCalibration = {
  difficulty: G1DifficultyLevel;
  bandId: G1DifficultyBandId;
  scoreMin: number;
  scoreMax: number;
  description: string;
};

export const G1_DIFFICULTY_BANDS: readonly G1DifficultyBandCalibration[] = [
  {
    difficulty: 1,
    bandId: "LOWER_VALID",
    scoreMin: 0,
    scoreMax: 2,
    description: "Lower valid G1 demand: two-point gradient and line construction are direct, coordinates are easy to recover, and no substantial extra representation or symbolic burden is introduced.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    scoreMin: 3,
    scoreMax: 99,
    description: "Upper valid G1 demand: the same canonical coordinate-gradient skill is preserved but the route adds significant visual reading, exact fractional/decimal structure, large-scale interpretation, or symbolic factor-and-cancel work.",
  },
] as const;

export type G1DifficultySignals = {
  coordinateDiagramRead: boolean;
  scaledGraphPointSelection: boolean;
  contextualModel: boolean;
  bestFitContext: boolean;
  fractionalOrDecimalGradient: boolean;
  largeCoordinateScale: boolean;
  signedCoordinateBurden: boolean;
  symbolicCoordinates: boolean;
  factorisationAndCancellation: boolean;
};

export const scoreG1Difficulty = (signals: G1DifficultySignals): number => {
  let score = 0;
  if (signals.coordinateDiagramRead) score += 1;
  if (signals.scaledGraphPointSelection) score += 3;
  if (signals.contextualModel) score += 1;
  if (signals.bestFitContext) score += 1;
  if (signals.fractionalOrDecimalGradient) score += 2;
  if (signals.largeCoordinateScale) score += 1;
  if (signals.signedCoordinateBurden) score += 1;
  if (signals.symbolicCoordinates) score += 3;
  if (signals.factorisationAndCancellation) score += 2;
  return score;
};

export const classifyG1Difficulty = (signals: G1DifficultySignals): G1DifficultyBandCalibration => {
  const score = scoreG1Difficulty(signals);
  const band = G1_DIFFICULTY_BANDS.find((entry) => score >= entry.scoreMin && score <= entry.scoreMax);
  if (!band) throw new Error(`No G1 difficulty band for score ${score}.`);
  return band;
};

export const G1_DIFFICULTY_SCORING_RULES = [
  "Difficulty is determined by the pupil's actual route, not by Standard and not by the apparent size of the numbers.",
  "Reading two labelled coordinates from a simple coordinate diagram adds some representation burden but does not by itself force upper-band difficulty.",
  "Selecting exact usable points from a scaled best-fit graph is a strong upper-band signal because the visual becomes essential mathematical data.",
  "An exact fractional or decimal gradient is a meaningful extra burden when it materially affects substitution and simplification.",
  "Large coordinate magnitudes add only a small amount of demand when the designed differences preserve easy exact ratios.",
  "Negative coordinates or a negative gradient are a supporting signal, not a standalone reason to inflate difficulty.",
  "Parameterised coordinates plus factorisation/cancellation are strong upper-band signals even though the question remains Operational.",
  "Do not increase difficulty by making coordinates ugly, axis scales awkward or graph points visually ambiguous.",
] as const;

export const G1_DIFFICULTY_GENERATION_GUARDRAILS = [
  "Lower-band direct-coordinate questions should normally use small integer points, a non-zero integer gradient and a non-zero integer intercept.",
  "Lower-band coordinate-diagram questions may include negative coordinates, but every point must remain easy to read and the line must not require interpolation from the drawing.",
  "Upper-band contextual questions may use simple exact rational gradients or deliberately large but ratio-friendly coordinate scales.",
  "Upper-band graph-read questions require exact grid intersections on the supplied line; visual ambiguity is invalid rather than difficult.",
  "Upper-band symbolic questions must retain a clean factor-and-cancel structure whose algebra is challenging because of structure recognition, not because of coefficient clutter.",
] as const;
