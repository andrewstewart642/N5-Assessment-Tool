import {
  chooseG1Paper,
  g1FamilyFrequency,
  historicalG1NumericOverlap,
  historicalG1SymbolicOverlap,
  historicalReferenceForG1,
  selectG1Family,
  G1_SURFACES_BY_FAMILY,
} from "./Calibration";
import { assessG1Difficulty } from "./Difficulty";
import {
  G1_GENERATOR_BEST_FIT_GUARDRAILS,
  G1_GENERATOR_CALIBRATION_DECISIONS,
  G1_GENERATOR_CONTEXT_GUARDRAILS,
  G1_GENERATOR_COORDINATE_VISUAL_GUARDRAILS,
  G1_GENERATOR_DIFFICULTY_RULES,
  G1_GENERATOR_INVARIANTS,
  G1_GENERATOR_LINE_GUARDRAILS,
  G1_GENERATOR_SYMBOLIC_GUARDRAILS,
} from "./Evidence";
import {
  buildG1BestFitPrompt,
  buildG1ContextPrompt,
  buildG1DiagramLinePrompt,
  buildG1DirectLinePrompt,
  buildG1LineEquation,
  buildG1SymbolicPrompt,
  reduceG1Rational,
} from "./PromptGrammar";
import {
  G1_BEST_FIT_RECIPES_V2,
  G1_CONTEXT_RECIPES_V2,
  type G1BestFitRecipeV2,
  type G1ContextRecipeV2,
  type RationalSeed,
} from "./ContextBankV2";
import type {
  G1AxisSpec,
  G1BestFitGeneratedQuestion,
  G1BestFitLineState,
  G1BestFitVisualSpec,
  G1ContextualGeneratedQuestion,
  G1ContextualLineState,
  G1ContextLineVisualSpec,
  G1CoordinateDiagramVisualSpec,
  G1GenerateOptions,
  G1GeneratedQuestion,
  G1GenerationQualityProfile,
  G1GeneratorDifficulty,
  G1GeneratorFamily,
  G1GeneratorPaper,
  G1GeneratorSurfaceStyle,
  G1LineEquationGeneratedQuestion,
  G1LineModelState,
  G1NumericPoint,
  G1Rational,
  G1SourceBasis,
  G1SymbolicGeneratedQuestion,
  G1SymbolicGradientState,
} from "./Types";
import { validateG1GeneratedQuestion } from "./Validation";

class SeededRandom {
  private state: number;
  constructor(seed: number) { this.state = (seed >>> 0) || 0x9e3779b9; }
  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number) { return Math.floor(this.next() * (max - min + 1)) + min; }
  pick<T>(values: readonly T[]): T { return values[this.int(0, values.length - 1)]; }
}

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const rational = (numerator: number, denominator = 1): G1Rational => reduceG1Rational({ numerator, denominator });
const rationalSeed = (value: RationalSeed): G1Rational => rational(value[0], value[1]);
const addRational = (a: G1Rational, b: G1Rational): G1Rational => rational(
  a.numerator * b.denominator + b.numerator * a.denominator,
  a.denominator * b.denominator,
);
const multiplyRational = (value: G1Rational, scalar: number): G1Rational => {
  const scaled = Number.isInteger(scalar)
    ? rational(scalar)
    : rational(Math.round(scalar * 1000), 1000);
  return rational(value.numerator * scaled.numerator, value.denominator * scaled.denominator);
};
const evaluateLine = (gradient: G1Rational, intercept: G1Rational, x: number): G1Rational => addRational(multiplyRational(gradient, x), intercept);
const numericValue = (value: G1Rational) => value.numerator / value.denominator;
const displayNumber = (value: G1Rational) => Number(numericValue(value).toFixed(3));
const integerValue = (value: G1Rational): number | null => value.denominator === 1 ? value.numerator : null;
const multipleOf = (value: number, interval: number) => Math.abs(value / interval - Math.round(value / interval)) < 1e-8;

const baseLineState = (
  family: G1LineModelState["family"],
  xVariable: string,
  yVariable: string,
  points: readonly [G1NumericPoint, G1NumericPoint],
  gradient: G1Rational,
  intercept: G1Rational,
): G1LineModelState => {
  const equation = buildG1LineEquation(xVariable, yVariable, gradient, intercept);
  return {
    family,
    xVariable,
    yVariable,
    points,
    gradient: reduceG1Rational(gradient),
    intercept: reduceG1Rational(intercept),
    equationLatex: equation.latex,
    equationPlain: equation.plain,
  };
};

const niceTickInterval = (range: number, targetTicks = 8) => {
  const raw = Math.max(range / Math.max(2, targetTicks), 0.0001);
  const power = 10 ** Math.floor(Math.log10(raw));
  const scaled = raw / power;
  const factor = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return factor * power;
};

const axisWindow = (
  xVariable: string,
  yVariable: string,
  points: readonly G1NumericPoint[],
  labels?: { xLabel: string; yLabel: string; xUnit: string | null; yUnit: string | null },
): G1AxisSpec => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xLow = Math.min(...xs, 0);
  const xHigh = Math.max(...xs, 0);
  const yLow = Math.min(...ys, 0);
  const yHigh = Math.max(...ys, 0);
  const xPad = Math.max(1, (xHigh - xLow) * 0.08);
  const yPad = Math.max(1, (yHigh - yLow) * 0.08);
  const xMinimum = Math.floor(xLow - xPad);
  const xMaximum = Math.ceil(xHigh + xPad);
  const yMinimum = Math.floor(yLow - yPad);
  const yMaximum = Math.ceil(yHigh + yPad);
  return {
    xVariable,
    yVariable,
    xLabel: labels?.xLabel ?? xVariable,
    yLabel: labels?.yLabel ?? yVariable,
    xUnit: labels?.xUnit ?? null,
    yUnit: labels?.yUnit ?? null,
    xMinimum,
    xMaximum,
    xTickInterval: niceTickInterval(xMaximum - xMinimum),
    yMinimum,
    yMaximum,
    yTickInterval: niceTickInterval(yMaximum - yMinimum),
  };
};

const bestFitAxis = (state: G1BestFitLineState, recipe: G1BestFitRecipeV2, gridRead: boolean): G1AxisSpec => {
  const xMaxRaw = Math.max(...state.scatterPoints.map((point) => point.x), ...state.lineReadPoints.map((point) => point.x), 1);
  const yMaxRaw = Math.max(
    ...state.scatterPoints.map((point) => point.y),
    ...state.lineReadPoints.map((point) => point.y),
    numericValue(state.intercept),
    1,
  );
  const xTick = gridRead ? recipe.xTick : niceTickInterval(xMaxRaw, 7);
  const yTick = gridRead ? recipe.yTick : niceTickInterval(yMaxRaw, 7);
  const xMaximum = Math.max(xTick * 4, Math.ceil((xMaxRaw * 1.08) / xTick) * xTick);
  const yMaximum = Math.max(yTick * 4, Math.ceil((yMaxRaw * 1.08) / yTick) * yTick);
  return {
    xVariable: state.context.xVariable,
    yVariable: state.context.yVariable,
    xLabel: state.context.xDescription,
    yLabel: state.context.yDescription,
    xUnit: state.context.xUnit,
    yUnit: state.context.yUnit,
    xMinimum: 0,
    xMaximum,
    xTickInterval: xTick,
    yMinimum: 0,
    yMaximum,
    yTickInterval: yTick,
  };
};

const qualityFor = (
  family: G1GeneratorFamily,
  surfaceStyleId: G1GeneratorSurfaceStyle,
  paper: G1GeneratorPaper,
  state: G1LineModelState | G1SymbolicGradientState,
  sourceBasis: G1SourceBasis,
  structuralLevers: string[],
): G1GenerationQualityProfile => {
  const difficulty = assessG1Difficulty(family, surfaceStyleId, state);
  const frequency = g1FamilyFrequency(family, paper);
  const primaryAnchor = sourceBasis.historicalReference.primaryQuestionCatalogId;
  return {
    difficultyBandId: difficulty.bandId,
    difficultyScore: difficulty.score,
    difficultySignals: difficulty.signals,
    historicalOverlapChecked: true,
    familyObservedCount: frequency.count,
    familyObservedTotal: frequency.total,
    familyObservedProportion: frequency.proportion,
    calibrationSourceAnchorIds: primaryAnchor ? [primaryAnchor] : [],
    paperArithmeticProfile: paper === "P1" ? "P1_WRITTEN" : "P2_CALCULATOR_AVAILABLE",
    structuralLevers,
  };
};

const chooseLineSurface = (seed: number, requested?: G1GeneratorSurfaceStyle): G1LineEquationGeneratedQuestion["surfaceStyleId"] => {
  if (requested) {
    if (requested !== "DIRECT_COORDINATES_LINE_EQUATION" && requested !== "COORDINATE_DIAGRAM_LINE_EQUATION") throw new Error(`${requested} is not a line-equation surface.`);
    return requested;
  }
  return mixSeed(seed, 0x610001) % 2 === 0 ? "DIRECT_COORDINATES_LINE_EQUATION" : "COORDINATE_DIAGRAM_LINE_EQUATION";
};

const chooseLineDifficulty = (seed: number, requested?: G1GeneratorDifficulty): G1GeneratorDifficulty => requested ?? (mixSeed(seed, 0x6100D1) % 4 === 0 ? 2 : 1);
const chooseHistoricalLineSign = (rng: SeededRandom) => rng.int(0, 3) < 3 ? -1 : 1;

const lineEquationState = (seed: number, difficulty: G1GeneratorDifficulty): G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" } => {
  const rng = new SeededRandom(mixSeed(seed, 0x610101));
  const intercepts = [-13, -11, -9, -7, -5, 4, 6, 8, 10, 12, 14, 16] as const;
  const upperFractions = [rational(1, 2), rational(3, 2), rational(1, 3), rational(2, 3), rational(4, 3), rational(1, 4), rational(3, 4), rational(5, 4), rational(2, 5), rational(3, 5), rational(4, 5)] as const;
  for (let attempt = 0; attempt < 700; attempt += 1) {
    const sign = chooseHistoricalLineSign(rng);
    const gradient = difficulty === 1 ? rational(sign * rng.pick([2, 3, 4, 5] as const)) : multiplyRational(rng.pick(upperFractions), sign);
    const intercept = rational(rng.pick(intercepts));
    let x1: number;
    let x2: number;
    if (difficulty === 1) {
      x1 = rng.int(-6, 3);
      x2 = x1 + rng.pick([2, 3, 4, 5] as const);
    } else {
      const denominator = gradient.denominator;
      const firstMultiple = rng.int(-3, 1);
      const gapMultiple = rng.pick([1, 2, 3] as const);
      x1 = firstMultiple * denominator;
      x2 = (firstMultiple + gapMultiple) * denominator;
    }
    if (x1 === x2 || x2 > 10 || x1 < -12) continue;
    const y1 = integerValue(evaluateLine(gradient, intercept, x1));
    const y2 = integerValue(evaluateLine(gradient, intercept, x2));
    if (y1 == null || y2 == null || Math.max(Math.abs(y1), Math.abs(y2)) > 30) continue;
    const state = baseLineState("LINE_EQUATION_FROM_TWO_POINTS", "x", "y", [{ x: x1, y: y1 }, { x: x2, y: y2 }], gradient, intercept) as G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" };
    if (!historicalG1NumericOverlap(state)) return state;
  }
  throw new Error("Unable to construct a non-historical G1 line-equation state.");
};

const coordinateVisual = (state: G1LineModelState): G1CoordinateDiagramVisualSpec => ({
  kind: "G1_COORDINATE_DIAGRAM",
  rendererFamilyId: "G1_COORDINATE_GRID",
  axis: axisWindow("x", "y", state.points),
  points: [{ ...state.points[0], label: "A" }, { ...state.points[1], label: "B" }],
  line: { gradient: state.gradient, intercept: state.intercept },
  requirements: [
    ...G1_GENERATOR_COORDINATE_VISUAL_GUARDRAILS,
    "Use a sparse not-to-scale schematic: axis arrows, italic x/y, origin O, one solid line and two labelled coordinate points only.",
    "Coordinate text must be collision-positioned away from the line and point marker.",
    "Do not make the drawn y-intercept scale-readable.",
  ],
});

const lineQuestion = (seed: number, surfaceStyleId: G1LineEquationGeneratedQuestion["surfaceStyleId"], requestedDifficulty?: G1GeneratorDifficulty): G1LineEquationGeneratedQuestion => {
  const targetDifficulty = chooseLineDifficulty(seed, requestedDifficulty);
  const state = lineEquationState(seed, targetDifficulty);
  const prompt = surfaceStyleId === "DIRECT_COORDINATES_LINE_EQUATION" ? buildG1DirectLinePrompt(state, seed) : buildG1DiagramLinePrompt();
  const sourceBasis = historicalReferenceForG1("LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId, "P1");
  const quality = qualityFor("LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId, "P1", state, sourceBasis, [
    "two exact generated coordinate points",
    targetDifficulty === 1 ? "source-centred integer-gradient route" : "simple exact fractional-gradient extension",
    state.gradient.numerator < 0 ? "negative gradient" : "positive gradient",
    surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION" ? "sparse non-scale schematic hides the intercept and supplies the two coordinates" : "coordinates supplied directly",
  ]);
  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-LINE-${surfaceStyleId}-L${targetDifficulty}-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    familyReadiness: "CORE",
    surfaceStyleId,
    paper: "P1",
    difficulty: quality.difficultyBandId === "UPPER_VALID" ? 2 : 1,
    marks: 3,
    standard: "C",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION" ? coordinateVisual(state) : null,
    sourceBasis,
    generationConstraints: [...G1_GENERATOR_INVARIANTS, ...G1_GENERATOR_LINE_GUARDRAILS, ...G1_GENERATOR_DIFFICULTY_RULES],
    quality,
  };
};

const chooseContextDifficulty = (seed: number, requested?: G1GeneratorDifficulty): G1GeneratorDifficulty => requested ?? (mixSeed(seed, 0x6100C2) % 3 === 0 ? 2 : 1);

const chooseContextRecipe = (rng: SeededRandom): G1ContextRecipeV2 => {
  const wantNegative = rng.int(0, 2) === 0;
  const candidates = G1_CONTEXT_RECIPES_V2.filter((recipe) => recipe.direction === (wantNegative ? "NEGATIVE" : "POSITIVE"));
  return rng.pick(candidates.length ? candidates : G1_CONTEXT_RECIPES_V2);
};

const contextualState = (seed: number, targetDifficulty: G1GeneratorDifficulty): G1ContextualLineState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610202));
  for (let attempt = 0; attempt < 1400; attempt += 1) {
    const recipe = chooseContextRecipe(rng);
    const context = recipe.context;
    const gradient = rationalSeed(rng.pick(targetDifficulty === 1 ? recipe.lowerGradients : recipe.upperGradients));
    const intercept = rationalSeed(rng.pick(recipe.intercepts));
    const step = gradient.denominator * recipe.xScale;
    const k1 = rng.int(1, 2);
    const k2 = k1 + rng.pick([1, 2] as const);
    const x1 = k1 * step;
    const x2 = k2 * step;
    const y1 = displayNumber(evaluateLine(gradient, intercept, x1));
    const y2 = displayNumber(evaluateLine(gradient, intercept, x2));
    if (!Number.isFinite(y1) || !Number.isFinite(y2) || Math.min(y1, y2) <= 0) continue;
    const followInput = (k2 + rng.pick([1, 2] as const)) * step;
    const exactOutput = evaluateLine(gradient, intercept, followInput);
    if (numericValue(exactOutput) <= 0) continue;
    const base = baseLineState("CONTEXTUAL_LINEAR_MODEL", context.xVariable, context.yVariable, [{ x: x1, y: y1 }, { x: x2, y: y2 }], gradient, intercept);
    if (historicalG1NumericOverlap(base)) continue;
    const state: G1ContextualLineState = {
      ...base,
      family: "CONTEXTUAL_LINEAR_MODEL",
      context,
      followUp: { input: followInput, exactOutput, outputUnit: context.yUnit, outputDescription: context.yDescription },
    };
    const assessed = assessG1Difficulty("CONTEXTUAL_LINEAR_MODEL", "CONTEXT_LINE_GRAPH_LABELLED_POINTS", state);
    if (assessed.difficulty !== targetDifficulty) continue;
    return state;
  }
  throw new Error(`Unable to construct a non-historical deterministic G1 context state at difficulty ${targetDifficulty}.`);
};

const contextVisual = (state: G1ContextualLineState): G1ContextLineVisualSpec => ({
  kind: "G1_CONTEXT_LINE_GRAPH",
  rendererFamilyId: "G1_CONTEXT_LINE_GRAPH",
  axis: axisWindow(state.context.xVariable, state.context.yVariable, state.points, {
    xLabel: state.context.xVariable,
    yLabel: state.context.yVariable,
    xUnit: state.context.xUnit,
    yUnit: state.context.yUnit,
  }),
  line: { gradient: state.gradient, intercept: state.intercept },
  labelledPoints: [{ ...state.points[0], label: "A" }, { ...state.points[1], label: "B" }],
  requirements: [
    ...G1_GENERATOR_CONTEXT_GUARDRAILS,
    "Render the supporting context diagram as a compact non-scale schematic with no gridlines or axis numbers.",
    "Point labels must be collision-positioned away from the line.",
    "The line and labelled points must be generated from the stored mathematical state.",
  ],
});

const contextQuestion = (seed: number, requestedDifficulty?: G1GeneratorDifficulty): G1ContextualGeneratedQuestion => {
  const targetDifficulty = chooseContextDifficulty(seed, requestedDifficulty);
  const state = contextualState(seed, targetDifficulty);
  const surfaceStyleId = "CONTEXT_LINE_GRAPH_LABELLED_POINTS" as const;
  const prompt = buildG1ContextPrompt(state);
  const sourceBasis = historicalReferenceForG1("CONTEXTUAL_LINEAR_MODEL", surfaceStyleId, "P1");
  const quality = qualityFor("CONTEXTUAL_LINEAR_MODEL", surfaceStyleId, "P1", state, sourceBasis, [
    "broad plausible deterministic context bank",
    targetDifficulty === 1 ? "simple exact fractional-gradient route" : "harder exact fractional-gradient route",
    state.intercept.denominator === 1 ? "integer intercept" : "terminating-decimal intercept",
    state.gradient.numerator < 0 ? "physically meaningful decreasing model" : "physically meaningful increasing model",
    "context variables required in the final equation",
    "one-mark deterministic application remains G1-owned",
  ]);
  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-CONTEXT-${state.context.domainId}-L${targetDifficulty}-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "CONTEXTUAL_LINEAR_MODEL",
    familyReadiness: "SUPPORTED",
    surfaceStyleId,
    paper: "P1",
    difficulty: quality.difficultyBandId === "UPPER_VALID" ? 2 : 1,
    marks: 4,
    standard: "C",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: contextVisual(state),
    sourceBasis,
    generationConstraints: [...G1_GENERATOR_INVARIANTS, ...G1_GENERATOR_CONTEXT_GUARDRAILS, ...G1_GENERATOR_DIFFICULTY_RULES],
    quality,
  };
};

const chooseBestFitRecipe = (rng: SeededRandom): G1BestFitRecipeV2 => {
  const wantNegative = rng.int(0, 4) < 2;
  const candidates = G1_BEST_FIT_RECIPES_V2.filter((recipe) => recipe.direction === (wantNegative ? "NEGATIVE" : "POSITIVE"));
  return rng.pick(candidates.length ? candidates : G1_BEST_FIT_RECIPES_V2);
};

const bestFitState = (seed: number, surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"]): { state: G1BestFitLineState; recipe: G1BestFitRecipeV2 } => {
  const rng = new SeededRandom(mixSeed(seed, 0x610303));
  const gridRead = surfaceStyleId === "BEST_FIT_GRID_READ_POINTS";
  for (let attempt = 0; attempt < 1800; attempt += 1) {
    const recipe = chooseBestFitRecipe(rng);
    const context = recipe.context;
    const gradient = rationalSeed(rng.pick(recipe.gradients));
    const intercept = rationalSeed(rng.pick(recipe.intercepts));
    const candidates = recipe.xValues.map((x) => ({ x, y: displayNumber(evaluateLine(gradient, intercept, x)) })).filter((point) => point.y > 1);
    let pointA: G1NumericPoint | undefined;
    let pointB: G1NumericPoint | undefined;
    if (gridRead) {
      const readable = candidates.filter((point) => multipleOf(point.x, recipe.xTick) && multipleOf(point.y, recipe.yTick));
      if (readable.length < 2) continue;
      pointA = readable[0];
      pointB = readable[readable.length - 1];
    } else {
      if (candidates.length < 4) continue;
      pointA = candidates[1];
      pointB = candidates[candidates.length - 2];
    }
    if (!pointA || !pointB || pointA.x === pointB.x) continue;
    const base = baseLineState("BEST_FIT_LINEAR_MODEL", context.xVariable, context.yVariable, [pointA, pointB], gradient, intercept);
    if (historicalG1NumericOverlap(base)) continue;

    const scatterPoints = recipe.xValues.map((x) => {
      const lineY = displayNumber(evaluateLine(gradient, intercept, x));
      const intended = gridRead && ((Math.abs(x - pointA!.x) < 1e-8) || (Math.abs(x - pointB!.x) < 1e-8));
      if (intended) return { x, y: lineY };
      let offset = rng.pick(recipe.scatterOffsets);
      if (Math.abs(offset) < 1e-8) offset = recipe.scatterOffsets.find((value) => Math.abs(value) > 1e-8) ?? 1;
      return { x, y: Math.max(recipe.yTick * 0.25, Number((lineY + offset).toFixed(3))) };
    });

    const state: G1BestFitLineState = {
      ...base,
      family: "BEST_FIT_LINEAR_MODEL",
      context,
      scatterPoints,
      lineReadPoints: [base.points[0], base.points[1]],
      embeddedS2MarksDeferred: 1,
    };
    return { state, recipe };
  }
  throw new Error("Unable to construct a non-historical G1 best-fit state.");
};

const bestFitVisual = (state: G1BestFitLineState, recipe: G1BestFitRecipeV2, surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"]): G1BestFitVisualSpec => ({
  kind: "G1_BEST_FIT_GRAPH",
  rendererFamilyId: "G1_BEST_FIT_SCATTER_GRAPH",
  axis: bestFitAxis(state, recipe, surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"),
  line: { gradient: state.gradient, intercept: state.intercept },
  scatterPoints: state.scatterPoints,
  readableLinePoints: state.lineReadPoints,
  labelledLinePoints: surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT" ? [{ ...state.points[0], label: "A" }, { ...state.points[1], label: "B" }] : [],
  requirements: [
    ...G1_GENERATOR_BEST_FIT_GUARDRAILS,
    "Scaled graph axes begin at zero.",
    "Grid-read surfaces use one uniform major-grid system only; no extra point-specific gridlines are permitted.",
    "Exactly two scatter points lie on the fitted line and both lie on ordinary major-grid intersections.",
    "The scatter cloud is independently generated around the stored line; no historical data set is reused.",
  ],
});

const bestFitQuestion = (seed: number, surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"]): G1BestFitGeneratedQuestion => {
  const { state, recipe } = bestFitState(seed, surfaceStyleId);
  const prompt = buildG1BestFitPrompt(state, surfaceStyleId);
  const sourceBasis = historicalReferenceForG1("BEST_FIT_LINEAR_MODEL", surfaceStyleId, "P1");
  const quality = qualityFor("BEST_FIT_LINEAR_MODEL", surfaceStyleId, "P1", state, sourceBasis, [
    "generated scatter data and supplied fitted line",
    state.gradient.numerator < 0 ? "negative fitted-line direction" : "positive fitted-line direction",
    surfaceStyleId === "BEST_FIT_GRID_READ_POINTS" ? "exactly two usable line points lie on the ordinary uniform grid" : "two model-defining fitted-line points are stated explicitly",
    "axis minima are zero on scaled graph-read surfaces",
    "context variables required in the final equation",
    "part (a) carries three G1 marks",
    "part (b) is retained in the wrapper and identified as the adjacent one-mark S2 estimate",
  ]);
  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-BEST-FIT-${surfaceStyleId}-${state.context.domainId}-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "BEST_FIT_LINEAR_MODEL",
    familyReadiness: "COMPOSITE_DEFERRED",
    surfaceStyleId,
    paper: "P1",
    difficulty: quality.difficultyBandId === "UPPER_VALID" ? 2 : 1,
    marks: 3,
    standard: "C",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: bestFitVisual(state, recipe, surfaceStyleId),
    deferredComposite: {
      totalHistoricalArchitectureMarks: 4,
      g1MarksGenerated: 3,
      embeddedSkillId: "stat-s02-linear-model",
      embeddedMarksDeferred: 1,
      reason: "The complete historical-style wrapper is generated: part (a) contributes three G1 marks and part (b) is the adjacent one-mark S2 estimate. The S2 mark is retained in the question architecture but excluded from the G1 mark tariff until the standalone S2 answer/generation layer is implemented.",
    },
    sourceBasis,
    generationConstraints: [...G1_GENERATOR_INVARIANTS, ...G1_GENERATOR_BEST_FIT_GUARDRAILS, ...G1_GENERATOR_DIFFICULTY_RULES],
    quality,
  };
};

const symbolicState = (seed: number): G1SymbolicGradientState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610404));
  const parameters = ["p", "q", "r", "t", "u"] as const;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const parameter = rng.pick(parameters);
    const denominatorScale = rng.pick([2, 3, 4] as const);
    const parameterCoefficient = rng.pick([1, 2, 3] as const);
    const constant = rng.pick([2, 4, 5, 6, 7] as const);
    if (parameterCoefficient % denominatorScale === 0 && constant % denominatorScale === 0) continue;
    const numericPoint = { x: denominatorScale * constant, y: constant * constant };
    const parameterisedPoint = { xCoefficient: denominatorScale * parameterCoefficient, yCoefficient: parameterCoefficient * parameterCoefficient };
    const kp = parameterCoefficient === 1 ? parameter : `${parameterCoefficient}${parameter}`;
    const xParameter = parameterisedPoint.xCoefficient === 1 ? parameter : `${parameterisedPoint.xCoefficient}${parameter}`;
    const yParameter = parameterisedPoint.yCoefficient === 1 ? `${parameter}^{2}` : `${parameterisedPoint.yCoefficient}${parameter}^{2}`;
    const state: G1SymbolicGradientState = {
      family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
      parameter,
      denominatorScale,
      parameterCoefficient,
      constant,
      numericPoint,
      parameterisedPoint,
      gradientQuotientLatex: `\\frac{${yParameter}-${constant * constant}}{${xParameter}-${denominatorScale * constant}}`,
      numeratorFactorisationLatex: `\\left(${kp}-${constant}\\right)\\left(${kp}+${constant}\\right)`,
      denominatorFactorisationLatex: `${denominatorScale}\\left(${kp}-${constant}\\right)`,
      finalGradientCoefficient: rational(parameterCoefficient, denominatorScale),
      finalGradientConstant: rational(constant, denominatorScale),
      finalGradientLatex: buildG1LineEquation(parameter, "m", rational(parameterCoefficient, denominatorScale), rational(constant, denominatorScale)).latex.replace(/^m=/, ""),
      excludedParameterValue: rational(constant, parameterCoefficient),
    };
    if (!historicalG1SymbolicOverlap(state)) return state;
  }
  throw new Error("Unable to construct a non-historical symbolic G1 gradient state.");
};

const symbolicQuestion = (seed: number): G1SymbolicGeneratedQuestion => {
  const state = symbolicState(seed);
  const surfaceStyleId = "SYMBOLIC_COORDINATE_GRADIENT" as const;
  const prompt = buildG1SymbolicPrompt(state);
  const sourceBasis = historicalReferenceForG1("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", surfaceStyleId, "P2");
  const quality = qualityFor("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", surfaceStyleId, "P2", state, sourceBasis, ["rare source-calibrated P2 family", "parameterised coordinate point", "two-point gradient quotient", "difference-of-squares factorisation", "common-factor cancellation", "exact linear gradient expression"]);
  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P2-SYMBOLIC-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    familyReadiness: "EXPERIMENTAL",
    surfaceStyleId,
    paper: "P2",
    difficulty: 2,
    marks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: null,
    sourceBasis,
    generationConstraints: [...G1_GENERATOR_INVARIANTS, ...G1_GENERATOR_SYMBOLIC_GUARDRAILS, ...G1_GENERATOR_DIFFICULTY_RULES],
    quality,
  };
};

const validateRequestedSurface = (family: G1GeneratorFamily, requestedSurface?: G1GeneratorSurfaceStyle) => {
  if (!requestedSurface) return;
  if (!G1_SURFACES_BY_FAMILY[family].includes(requestedSurface as never)) throw new Error(`${requestedSurface} is not calibrated for ${family}.`);
};

const surfaceForBestFit = (seed: number, requestedSurface: G1GeneratorSurfaceStyle | undefined, requestedDifficulty: G1GeneratorDifficulty | undefined): G1BestFitGeneratedQuestion["surfaceStyleId"] => {
  if (requestedSurface) {
    if (requestedSurface !== "BEST_FIT_LABELLED_POINTS_CONTEXT" && requestedSurface !== "BEST_FIT_GRID_READ_POINTS") throw new Error(`${requestedSurface} is not a best-fit surface.`);
    return requestedSurface;
  }
  if (requestedDifficulty === 1) return "BEST_FIT_LABELLED_POINTS_CONTEXT";
  if (requestedDifficulty === 2) return "BEST_FIT_GRID_READ_POINTS";
  return mixSeed(seed, 0x610505) % 5 < 3 ? "BEST_FIT_LABELLED_POINTS_CONTEXT" : "BEST_FIT_GRID_READ_POINTS";
};

export const generateG1Question = (options: G1GenerateOptions): G1GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  const includeDeferredCompositeFamilies = options.includeDeferredCompositeFamilies ?? true;
  const paper = chooseG1Paper(options.seed, options.family, options.paper);
  const family = selectG1Family(options.seed, paper, options.family, includeExperimentalFamilies, includeDeferredCompositeFamilies);
  validateRequestedSurface(family, options.surfaceStyleId);
  let question: G1GeneratedQuestion;
  if (family === "LINE_EQUATION_FROM_TWO_POINTS") {
    question = lineQuestion(options.seed, chooseLineSurface(options.seed, options.surfaceStyleId), options.difficulty);
  } else if (family === "CONTEXTUAL_LINEAR_MODEL") {
    question = contextQuestion(options.seed, options.difficulty);
  } else if (family === "BEST_FIT_LINEAR_MODEL") {
    question = bestFitQuestion(options.seed, surfaceForBestFit(options.seed, options.surfaceStyleId, options.difficulty));
  } else {
    if (options.difficulty === 1) throw new Error("The symbolic G1 family is calibrated to upper-band difficulty.");
    question = symbolicQuestion(options.seed);
  }
  if (options.difficulty && question.difficulty !== options.difficulty) throw new Error(`Generated ${family} at difficulty ${question.difficulty}, not requested difficulty ${options.difficulty}.`);
  const validation = validateG1GeneratedQuestion(question);
  if (!validation.valid) {
    const errors = validation.issues.filter((issue) => issue.severity === "ERROR");
    throw new Error(`Generated invalid G1 question: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(" | ")}`);
  }
  return question;
};

const exactSignature = (question: G1GeneratedQuestion): string => {
  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    const state = question.mathState;
    return `S:${state.parameter}:${state.denominatorScale}:${state.parameterCoefficient}:${state.constant}`;
  }
  const state = question.mathState;
  return [question.family, question.surfaceStyleId, state.points[0].x, state.points[0].y, state.points[1].x, state.points[1].y, state.gradient.numerator, state.gradient.denominator, state.intercept.numerator, state.intercept.denominator].join(":");
};

const structuralSignature = (question: G1GeneratedQuestion): string => {
  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    const state = question.mathState;
    return `S:${state.denominatorScale}:${state.parameterCoefficient}:${state.constant}:${state.parameter}`;
  }
  const contextId = question.family === "CONTEXTUAL_LINEAR_MODEL" || question.family === "BEST_FIT_LINEAR_MODEL" ? question.mathState.context.domainId : "NONE";
  return [question.family, question.surfaceStyleId, contextId, question.mathState.gradient.numerator, question.mathState.gradient.denominator, question.mathState.intercept.numerator, question.mathState.intercept.denominator, Math.abs(question.mathState.points[1].x - question.mathState.points[0].x)].join(":");
};

export const generateG1QuestionBatch = (count: number, options: Omit<G1GenerateOptions, "seed"> & { seed: number }): G1GeneratedQuestion[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error("G1 batch count must be a positive integer.");
  const results: G1GeneratedQuestion[] = [];
  const seenExact = new Set<string>();
  const seenStructural = new Set<string>();
  for (let index = 0; index < count; index += 1) {
    let accepted: G1GeneratedQuestion | null = null;
    for (let retry = 0; retry < 420; retry += 1) {
      const candidateSeed = mixSeed(options.seed, (index + 1) * 173 + retry * 7919);
      const candidate = generateG1Question({ ...options, seed: candidateSeed });
      const exact = exactSignature(candidate);
      const structural = structuralSignature(candidate);
      if (seenExact.has(exact) || seenStructural.has(structural)) continue;
      seenExact.add(exact);
      seenStructural.add(structural);
      accepted = candidate;
      break;
    }
    if (!accepted) throw new Error(`Unable to create ${count} structurally distinct G1 questions inside the calibrated generation space.`);
    results.push(accepted);
  }
  return results;
};

export const G1_GENERATOR_DESIGN_NOTES = G1_GENERATOR_CALIBRATION_DECISIONS;
