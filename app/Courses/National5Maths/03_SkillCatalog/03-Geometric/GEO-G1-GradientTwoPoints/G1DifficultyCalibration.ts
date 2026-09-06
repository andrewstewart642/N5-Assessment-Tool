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
    description: "Lower valid G1 demand: the familiar three-stage route is retained, visual reading is unambiguous, and any contextual fractional gradient is deliberately simple and factor-friendly.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    scoreMin: 3,
    scoreMax: 99,
    description: "Upper valid G1 demand: the same straight-line skill is made materially harder through a demanding exact fractional gradient, essential scaled graph reading, a ratio-friendly large contextual scale, or parameterised factor-and-cancel work.",
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
  "Standalone line-equation questions treat any surviving exact fractional gradient as a genuine higher-band lever.",
  "Deterministic contextual questions may remain lower-band with very transparent fractions such as 3/2 or unit fractions such as 1/20; more demanding reduced fractions such as 7/4 are reserved for the upper band.",
  "Terminating decimal intercepts are presentation texture and do not by themselves make a question upper-band.",
  "Reading two labelled coordinates from a sparse coordinate schematic adds representation burden but does not by itself force upper-band difficulty.",
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
  "Lower-band deterministic contexts may use simple exact fractions including unit fractions and 3/2 where the surrounding arithmetic remains transparent.",
  "Upper-band deterministic contexts should reserve more awkward exact fractional gradients such as 5/4, 7/4, 5/3 or comparable structures, while retaining clean point values.",
  "Terminating decimal intercepts are permitted in either contextual band when they are naturally readable and do not create gratuitous arithmetic.",
  "Upper-band graph-read questions require exactly two intended line points at ordinary grid intersections; ambiguity is invalid rather than difficult.",
  "Scaled graph-read axes must use a consistent major-grid system from zero rather than adding special gridlines solely through the intended points.",
  "Upper-band symbolic questions must retain a clean factor-and-cancel route whose demand comes from structure recognition rather than coefficient clutter.",
] as const;
