import {
  classifyG1Difficulty,
  scoreG1Difficulty,
} from "../../../03_SkillCatalog/03-Geometric/GEO-G1-GradientTwoPoints/G1DifficultyCalibration";
import type {
  G1DifficultySignals,
  G1GeneratedMathState,
  G1GeneratorDifficulty,
  G1GeneratorDifficultyBandId,
  G1GeneratorFamily,
  G1GeneratorSurfaceStyle,
  G1LineModelState,
} from "./Types";

export type G1DifficultyAssessment = {
  difficulty: G1GeneratorDifficulty;
  bandId: G1GeneratorDifficultyBandId;
  score: number;
  signals: G1DifficultySignals;
  signalLabels: string[];
};

const isLineState = (state: G1GeneratedMathState): state is G1LineModelState =>
  state.family !== "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";

const lineSignals = (
  family: G1GeneratorFamily,
  surfaceStyleId: G1GeneratorSurfaceStyle,
  state: G1LineModelState,
): G1DifficultySignals => {
  const coordinateMagnitude = Math.max(
    ...state.points.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)]),
  );
  const signedCoordinateBurden = state.points.some((point) => point.x < 0 || point.y < 0)
    || state.gradient.numerator < 0
    || state.intercept.numerator < 0;

  return {
    coordinateDiagramRead: surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION",
    scaledGraphPointSelection: surfaceStyleId === "BEST_FIT_GRID_READ_POINTS",
    contextualModel: family === "CONTEXTUAL_LINEAR_MODEL",
    bestFitContext: family === "BEST_FIT_LINEAR_MODEL",
    fractionalOrDecimalGradient: state.gradient.denominator !== 1,
    largeCoordinateScale: coordinateMagnitude >= 100,
    signedCoordinateBurden,
    symbolicCoordinates: false,
    factorisationAndCancellation: false,
  };
};

const symbolicSignals = (): G1DifficultySignals => ({
  coordinateDiagramRead: false,
  scaledGraphPointSelection: false,
  contextualModel: false,
  bestFitContext: false,
  fractionalOrDecimalGradient: true,
  largeCoordinateScale: false,
  signedCoordinateBurden: false,
  symbolicCoordinates: true,
  factorisationAndCancellation: true,
});

const labelsFor = (signals: G1DifficultySignals): string[] => [
  signals.coordinateDiagramRead && "coordinates read from a generated diagram",
  signals.scaledGraphPointSelection && "exact usable points selected from a scaled graph",
  signals.contextualModel && "coordinate geometry embedded in a deterministic context",
  signals.bestFitContext && "best-fit representation wrapper",
  signals.fractionalOrDecimalGradient && "exact non-integer gradient structure",
  signals.largeCoordinateScale && "large coordinate scale with controlled exact ratios",
  signals.signedCoordinateBurden && "signed-coordinate or negative-line arithmetic",
  signals.symbolicCoordinates && "parameterised coordinate data",
  signals.factorisationAndCancellation && "factorisation and cancellation inside the gradient route",
].filter((value): value is string => Boolean(value));

export const assessG1Difficulty = (
  family: G1GeneratorFamily,
  surfaceStyleId: G1GeneratorSurfaceStyle,
  state: G1GeneratedMathState,
): G1DifficultyAssessment => {
  const signals = isLineState(state)
    ? lineSignals(family, surfaceStyleId, state)
    : symbolicSignals();
  const score = scoreG1Difficulty(signals);
  const band = classifyG1Difficulty(signals);
  return {
    difficulty: band.difficulty,
    bandId: band.bandId,
    score,
    signals,
    signalLabels: labelsFor(signals),
  };
};
