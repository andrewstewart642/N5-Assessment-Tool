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
    description: "Lower valid G1 demand: the familiar three-stage route is retained, coordinates are straightforward to recover, and the gradient/intercept arithmetic remains compact and exact.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    scoreMin: 3,
    scoreMax: 99,
    description: "Upper valid G1 demand: the same straight-line skill is made materially harder through an exact fractional gradient, essential scaled graph reading, a ratio-friendly large contextual scale, or parameterised factor-and-cancel work.",
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
  // A simple exact fraction is the intended higher-band lever for otherwise
  // familiar line-equation questions. It must be strong enough to move a
  // direct-coordinate item out of the source-centred lower band by itself.
  if (signals.fractionalOrDecimalGradient) score += 3;
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
  "Difficulty is determined by the pupil's actual route, not by Standard and not by number size alone.",
  "The familiar source-centred line-equation form is lower-band when its gradient and substitution arithmetic stay integral and compact.",
  "A simple exact fractional gradient is a genuine higher-band lever because it survives into substitution and final equation simplification.",
  "Reading two labelled coordinates from a sparse coordinate diagram adds representation burden but does not by itself force upper-band difficulty.",
  "Selecting the only two exact usable points from a scaled best-fit graph is a strong upper-band signal because the visual is essential mathematical data.",
  "Large contextual values add demand only when they disguise a clean exact ratio; arbitrary large or awkward numbers are not a valid difficulty lever.",
  "Negative coordinates or a negative gradient are supporting signals and should occur at historically plausible frequencies, not be treated as difficulty on their own.",
  "Parameterised coordinates plus factorisation/cancellation are strong upper-band signals even though the question remains Operational.",
  "Do not increase difficulty through ugly axes, ambiguous points, cluttered diagrams or avoidable arithmetic noise.",
] as const;

export const G1_DIFFICULTY_GENERATION_GUARDRAILS = [
  "Lower-band direct-coordinate questions should normally use small integer points, a non-zero integer gradient and a non-zero integer intercept.",
  "Lower-band coordinate-diagram questions may contain signed coordinates and negative gradients, but the two point coordinates must be unambiguous and the schematic must not reveal the intercept by scale-reading.",
  "Upper-band standalone line questions may use simple reduced gradients with denominators 2, 3, 4 or 5 while keeping coordinate differences deliberately factor-friendly.",
  "Upper-band contextual questions may use simple exact rational gradients or large but ratio-friendly real-world scales.",
  "Upper-band graph-read questions require exactly two intended line points at clean grid intersections; ambiguity is invalid rather than difficult.",
  "Upper-band symbolic questions must retain a clean factor-and-cancel route whose demand comes from structure recognition rather than coefficient clutter.",
] as const;
