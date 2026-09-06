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
import type {
  G1AxisSpec,
  G1BestFitGeneratedQuestion,
  G1BestFitLineState,
  G1BestFitVisualSpec,
  G1ContextProfile,
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

  constructor(seed: number) {
    this.state = (seed >>> 0) || 0x9e3779b9;
  }

  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)];
  }
}

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const rational = (numerator: number, denominator = 1): G1Rational =>
  reduceG1Rational({ numerator, denominator });

const addRational = (a: G1Rational, b: G1Rational): G1Rational =>
  rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);

const multiplyRational = (value: G1Rational, scalar: number): G1Rational =>
  rational(value.numerator * scalar, value.denominator);

const evaluateLine = (gradient: G1Rational, intercept: G1Rational, x: number): G1Rational =>
  addRational(multiplyRational(gradient, x), intercept);

const numericValue = (value: G1Rational) => {
  const reduced = reduceG1Rational(value);
  return reduced.numerator / reduced.denominator;
};

const integerValue = (value: G1Rational): number | null => {
  const reduced = reduceG1Rational(value);
  return reduced.denominator === 1 ? reduced.numerator : null;
};

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
  includeOrigin = true,
): G1AxisSpec => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xLow = Math.min(...xs, ...(includeOrigin ? [0] : []));
  const xHigh = Math.max(...xs, ...(includeOrigin ? [0] : []));
  const yLow = Math.min(...ys, ...(includeOrigin ? [0] : []));
  const yHigh = Math.max(...ys, ...(includeOrigin ? [0] : []));
  const xPad = Math.max(1, (xHigh - xLow) * 0.12);
  const yPad = Math.max(1, (yHigh - yLow) * 0.12);
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

const chooseLineSurface = (
  seed: number,
  requested?: G1GeneratorSurfaceStyle,
): G1LineEquationGeneratedQuestion["surfaceStyleId"] => {
  if (requested) {
    if (requested !== "DIRECT_COORDINATES_LINE_EQUATION" && requested !== "COORDINATE_DIAGRAM_LINE_EQUATION") {
      throw new Error(`${requested} is not a line-equation surface.`);
    }
    return requested;
  }
  // Two direct and two diagram instances are observed in the reviewed line family.
  return mixSeed(seed, 0x610001) % 2 === 0
    ? "DIRECT_COORDINATES_LINE_EQUATION"
    : "COORDINATE_DIAGRAM_LINE_EQUATION";
};

const chooseLineDifficulty = (seed: number, requested?: G1GeneratorDifficulty): G1GeneratorDifficulty => {
  if (requested) return requested;
  // The historical centre of gravity remains the baseline. A smaller extension
  // band introduces clean fractional gradients without overwhelming the family.
  return mixSeed(seed, 0x6100D1) % 4 === 0 ? 2 : 1;
};

const chooseHistoricalLineSign = (rng: SeededRandom) => rng.int(0, 3) < 3 ? -1 : 1;

const lineEquationState = (
  seed: number,
  difficulty: G1GeneratorDifficulty,
): G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" } => {
  const rng = new SeededRandom(mixSeed(seed, 0x610101));
  const intercepts = [-13, -11, -9, -7, -5, 4, 6, 8, 10, 12, 14, 16] as const;
  const upperFractions = [
    rational(1, 2), rational(3, 2), rational(1, 3), rational(2, 3), rational(4, 3),
    rational(1, 4), rational(3, 4), rational(5, 4), rational(2, 5), rational(3, 5), rational(4, 5),
  ] as const;

  for (let attempt = 0; attempt < 700; attempt += 1) {
    const sign = chooseHistoricalLineSign(rng);
    const gradient = difficulty === 1
      ? rational(sign * rng.pick([2, 3, 4, 5] as const))
      : multiplyRational(rng.pick(upperFractions), sign);
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
    if (y1 == null || y2 == null) continue;
    if (Math.max(Math.abs(y1), Math.abs(y2)) > 30) continue;

    const state = baseLineState(
      "LINE_EQUATION_FROM_TWO_POINTS",
      "x",
      "y",
      [{ x: x1, y: y1 }, { x: x2, y: y2 }],
      gradient,
      intercept,
    ) as G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" };
    if (historicalG1NumericOverlap(state)) continue;
    return state;
  }
  throw new Error("Unable to construct a non-historical G1 line-equation state.");
};

const coordinateVisual = (state: G1LineModelState): G1CoordinateDiagramVisualSpec => ({
  kind: "G1_COORDINATE_DIAGRAM",
  rendererFamilyId: "G1_COORDINATE_GRID",
  axis: axisWindow("x", "y", state.points),
  points: [
    { ...state.points[0], label: "A" },
    { ...state.points[1], label: "B" },
  ],
  line: { gradient: state.gradient, intercept: state.intercept },
  requirements: [
    ...G1_GENERATOR_COORDINATE_VISUAL_GUARDRAILS,
    "Render only generated geometry; historical diagram geometry is not reusable.",
  ],
});

const lineQuestion = (
  seed: number,
  surfaceStyleId: G1LineEquationGeneratedQuestion["surfaceStyleId"],
  requestedDifficulty?: G1GeneratorDifficulty,
): G1LineEquationGeneratedQuestion => {
  const targetDifficulty = chooseLineDifficulty(seed, requestedDifficulty);
  const state = lineEquationState(seed, targetDifficulty);
  const prompt = surfaceStyleId === "DIRECT_COORDINATES_LINE_EQUATION"
    ? buildG1DirectLinePrompt(state, seed)
    : buildG1DiagramLinePrompt();
  const sourceBasis = historicalReferenceForG1("LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId, "P1");
  const quality = qualityFor(
    "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "two exact generated coordinate points",
      targetDifficulty === 1 ? "source-centred integer-gradient route" : "simple exact fractional-gradient extension",
      state.gradient.numerator < 0 ? "negative gradient" : "positive gradient",
      surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION"
        ? "coordinates recovered from a sparse schematic diagram"
        : "coordinates supplied directly",
    ],
  );

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
    generationConstraints: [
      ...G1_GENERATOR_INVARIANTS,
      ...G1_GENERATOR_LINE_GUARDRAILS,
      ...G1_GENERATOR_DIFFICULTY_RULES,
    ],
    quality,
  };
};

type ContextRecipe = {
  context: G1ContextProfile;
  gradients: readonly G1Rational[];
  intercepts: readonly number[];
  xScale: number;
};

const CONTEXT_RECIPES: readonly ContextRecipe[] = [
  {
    context: {
      domainId: "TAXI_FARE",
      introduction: "A taxi fare is made up of a fixed charge and a charge for the distance travelled.",
      xDescription: "distance travelled",
      yDescription: "taxi fare",
      xVariable: "d",
      yVariable: "P",
      xUnit: "miles",
      yUnit: "pounds",
    },
    gradients: [rational(3, 2), rational(5, 4), rational(7, 4)],
    intercepts: [2, 3, 4, 5],
    xScale: 1,
  },
  {
    context: {
      domainId: "WEEKLY_WAGE",
      introduction: "An employee is paid a basic weekly wage together with commission on sales.",
      xDescription: "sales",
      yDescription: "weekly wage",
      xVariable: "S",
      yVariable: "W",
      xUnit: "pounds",
      yUnit: "pounds",
    },
    gradients: [rational(1, 20), rational(1, 25), rational(1, 40)],
    intercepts: [120, 140, 160, 180, 200],
    xScale: 100,
  },
  {
    context: {
      domainId: "COURIER_CHARGE",
      introduction: "A courier company charges a fixed booking fee and an additional amount for each kilometre travelled.",
      xDescription: "delivery distance",
      yDescription: "delivery charge",
      xVariable: "d",
      yVariable: "C",
      xUnit: "km",
      yUnit: "pounds",
    },
    gradients: [rational(5, 4), rational(3, 2), rational(7, 5)],
    intercepts: [4, 5, 6, 8],
    xScale: 1,
  },
  {
    context: {
      domainId: "WATER_DRAIN",
      introduction: "Water is drained from a storage tank at a steady rate.",
      xDescription: "time elapsed",
      yDescription: "volume of water remaining",
      xVariable: "t",
      yVariable: "V",
      xUnit: "minutes",
      yUnit: "litres",
    },
    gradients: [rational(-5, 2), rational(-3, 2), rational(-7, 4)],
    intercepts: [180, 200, 220, 240],
    xScale: 2,
  },
  {
    context: {
      domainId: "BATTERY_DRAIN",
      introduction: "A device battery loses charge at a steady rate while it is in use.",
      xDescription: "time in use",
      yDescription: "battery charge remaining",
      xVariable: "t",
      yVariable: "B",
      xUnit: "hours",
      yUnit: "percent",
    },
    gradients: [rational(-15, 2), rational(-25, 4), rational(-10, 3)],
    intercepts: [90, 95, 100],
    xScale: 1,
  },
] as const;

const contextualState = (seed: number): G1ContextualLineState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610202));

  for (let attempt = 0; attempt < 700; attempt += 1) {
    const recipe = rng.pick(CONTEXT_RECIPES);
    const context = recipe.context;
    const gradient = rng.pick(recipe.gradients);
    const intercept = rational(rng.pick(recipe.intercepts));
    const step = gradient.denominator * recipe.xScale;
    const k1 = rng.int(1, 2);
    const k2 = k1 + rng.pick([1, 2] as const);
    const x1 = k1 * step;
    const x2 = k2 * step;
    const y1 = integerValue(evaluateLine(gradient, intercept, x1));
    const y2 = integerValue(evaluateLine(gradient, intercept, x2));
    if (y1 == null || y2 == null || Math.min(y1, y2) <= 0) continue;
    const followInput = (k2 + rng.pick([1, 2] as const)) * step;
    const exactOutput = evaluateLine(gradient, intercept, followInput);
    if (numericValue(exactOutput) <= 0) continue;

    const base = baseLineState(
      "CONTEXTUAL_LINEAR_MODEL",
      context.xVariable,
      context.yVariable,
      [{ x: x1, y: y1 }, { x: x2, y: y2 }],
      gradient,
      intercept,
    );
    if (historicalG1NumericOverlap(base)) continue;

    return {
      ...base,
      family: "CONTEXTUAL_LINEAR_MODEL",
      context,
      followUp: {
        input: followInput,
        exactOutput,
        outputUnit: context.yUnit,
        outputDescription: context.yDescription,
      },
    };
  }
  throw new Error("Unable to construct a non-historical deterministic G1 context state.");
};

const contextVisual = (state: G1ContextualLineState): G1ContextLineVisualSpec => ({
  kind: "G1_CONTEXT_LINE_GRAPH",
  rendererFamilyId: "G1_CONTEXT_LINE_GRAPH",
  axis: axisWindow(
    state.context.xVariable,
    state.context.yVariable,
    state.points,
    {
      xLabel: state.context.xVariable,
      yLabel: state.context.yVariable,
      xUnit: state.context.xUnit,
      yUnit: state.context.yUnit,
    },
  ),
  line: { gradient: state.gradient, intercept: state.intercept },
  labelledPoints: [
    { ...state.points[0], label: "A" },
    { ...state.points[1], label: "B" },
  ],
  requirements: [
    ...G1_GENERATOR_CONTEXT_GUARDRAILS,
    "The line and labelled points must be generated from the stored mathematical state.",
  ],
});

const contextQuestion = (seed: number): G1ContextualGeneratedQuestion => {
  const state = contextualState(seed);
  const surfaceStyleId = "CONTEXT_LINE_GRAPH_LABELLED_POINTS" as const;
  const prompt = buildG1ContextPrompt(state);
  const sourceBasis = historicalReferenceForG1("CONTEXTUAL_LINEAR_MODEL", surfaceStyleId, "P1");
  const quality = qualityFor(
    "CONTEXTUAL_LINEAR_MODEL",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "plausible deterministic real-world relationship",
      `exact gradient ${state.gradient.numerator}/${state.gradient.denominator}`,
      Math.max(...state.points.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)])) >= 100
        ? "large but ratio-friendly contextual scale"
        : "compact contextual scale",
      state.gradient.numerator < 0 ? "physically meaningful decreasing model" : "physically meaningful increasing model",
      "context variables required in the final equation",
      "one-mark deterministic application remains G1-owned",
    ],
  );

  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-CONTEXT-${state.context.domainId}-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "CONTEXTUAL_LINEAR_MODEL",
    familyReadiness: "SUPPORTED",
    surfaceStyleId,
    paper: "P1",
    difficulty: 2,
    marks: 4,
    standard: "C",
    thinking: "OPERATIONAL",
    ...prompt,
    mathState: state,
    visual: contextVisual(state),
    sourceBasis,
    generationConstraints: [
      ...G1_GENERATOR_INVARIANTS,
      ...G1_GENERATOR_CONTEXT_GUARDRAILS,
      ...G1_GENERATOR_DIFFICULTY_RULES,
    ],
    quality,
  };
};

type BestFitRecipe = {
  context: G1ContextProfile;
  direction: "POSITIVE" | "NEGATIVE";
  xValues: readonly number[];
  gradients: readonly number[];
  intercepts: readonly number[];
  scatterOffsets: readonly number[];
};

const BEST_FIT_RECIPES: readonly BestFitRecipe[] = [
  {
    direction: "NEGATIVE",
    context: { domainId: "ENGINE_FUEL", introduction: "A motoring study compares engine size with fuel consumption for several cars.", xDescription: "engine size", yDescription: "fuel consumption", xVariable: "E", yVariable: "F", xUnit: "litres", yUnit: "km/litre" },
    xValues: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
    gradients: [-2, -4],
    intercepts: [18, 20, 22, 24],
    scatterOffsets: [-1, 1, -2, 2],
  },
  {
    direction: "NEGATIVE",
    context: { domainId: "RALLY_DISTANCE", introduction: "During a timed route, measurements compare elapsed time with the distance still to travel.", xDescription: "time elapsed", yDescription: "distance remaining", xVariable: "T", yVariable: "D", xUnit: "minutes", yUnit: "km" },
    xValues: [1, 2, 3, 4, 5, 6, 7, 8],
    gradients: [-2, -3, -4],
    intercepts: [28, 32, 36, 40],
    scatterOffsets: [-2, 2, -3, 3],
  },
  {
    direction: "POSITIVE",
    context: { domainId: "CALF_GROWTH", introduction: "A farmer records the age and mass of several young animals.", xDescription: "age", yDescription: "mass", xVariable: "A", yVariable: "W", xUnit: "weeks", yUnit: "kg" },
    xValues: [2, 4, 6, 8, 10, 12, 14, 16],
    gradients: [2, 3, 4],
    intercepts: [30, 40, 50, 60],
    scatterOffsets: [-4, 4, -6, 6],
  },
  {
    direction: "POSITIVE",
    context: { domainId: "SUNLIGHT_GROWTH", introduction: "A researcher compares daily sunlight with plant growth for a group of plants.", xDescription: "daily sunlight", yDescription: "growth", xVariable: "H", yVariable: "G", xUnit: "hours", yUnit: "mm" },
    xValues: [1, 2, 3, 4, 5, 6, 7, 8],
    gradients: [2, 3, 4],
    intercepts: [10, 12, 16, 20],
    scatterOffsets: [-2, 2, -3, 3],
  },
  {
    direction: "NEGATIVE",
    context: { domainId: "MACHINE_EFFICIENCY", introduction: "Measurements compare the age of several machines with an efficiency score.", xDescription: "machine age", yDescription: "efficiency score", xVariable: "A", yVariable: "E", xUnit: "years", yUnit: "points" },
    xValues: [1, 2, 3, 4, 5, 6, 7, 8],
    gradients: [-2, -3],
    intercepts: [40, 44, 48, 52, 56],
    scatterOffsets: [-2, 2, -3, 3],
  },
] as const;

const selectBestFitRecipe = (rng: SeededRandom): BestFitRecipe => {
  // Five reviewed best-fit questions include two negative-gradient examples.
  const wantNegative = rng.int(0, 4) < 2;
  const candidates = BEST_FIT_RECIPES.filter((recipe) => recipe.direction === (wantNegative ? "NEGATIVE" : "POSITIVE"));
  return rng.pick(candidates);
};

const bestFitState = (
  seed: number,
  surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"],
): G1BestFitLineState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610303));

  for (let attempt = 0; attempt < 700; attempt += 1) {
    const recipe = selectBestFitRecipe(rng);
    const context = recipe.context;
    const gradient = rational(rng.pick(recipe.gradients));
    const intercept = rational(rng.pick(recipe.intercepts));
    const xValues = recipe.xValues;
    const readIndexA = 1;
    const readIndexB = xValues.length - 2;
    const x1 = xValues[readIndexA];
    const x2 = xValues[readIndexB];
    const y1 = numericValue(evaluateLine(gradient, intercept, x1));
    const y2 = numericValue(evaluateLine(gradient, intercept, x2));
    if (!Number.isFinite(y1) || !Number.isFinite(y2) || Math.min(y1, y2) <= 2) continue;

    const base = baseLineState(
      "BEST_FIT_LINEAR_MODEL",
      context.xVariable,
      context.yVariable,
      [{ x: x1, y: y1 }, { x: x2, y: y2 }],
      gradient,
      intercept,
    );
    if (historicalG1NumericOverlap(base)) continue;

    const scatterPoints = xValues.map((x, index) => {
      const lineY = numericValue(evaluateLine(gradient, intercept, x));
      if (surfaceStyleId === "BEST_FIT_GRID_READ_POINTS" && (index === readIndexA || index === readIndexB)) {
        return { x, y: lineY };
      }
      const offset = rng.pick(recipe.scatterOffsets);
      return { x, y: Math.max(0.5, lineY + offset) };
    });

    return {
      ...base,
      family: "BEST_FIT_LINEAR_MODEL",
      context,
      scatterPoints,
      lineReadPoints: [base.points[0], base.points[1]],
      embeddedS2MarksDeferred: 1,
    };
  }
  throw new Error("Unable to construct a non-historical G1 best-fit state.");
};

const bestFitVisual = (
  state: G1BestFitLineState,
  surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"],
): G1BestFitVisualSpec => ({
  kind: "G1_BEST_FIT_GRAPH",
  rendererFamilyId: "G1_BEST_FIT_SCATTER_GRAPH",
  axis: axisWindow(
    state.context.xVariable,
    state.context.yVariable,
    [...state.scatterPoints, ...state.lineReadPoints],
    {
      xLabel: state.context.xDescription,
      yLabel: state.context.yDescription,
      xUnit: state.context.xUnit,
      yUnit: state.context.yUnit,
    },
    false,
  ),
  line: { gradient: state.gradient, intercept: state.intercept },
  scatterPoints: state.scatterPoints,
  readableLinePoints: state.lineReadPoints,
  labelledLinePoints: surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT"
    ? [
      { ...state.points[0], label: "A" },
      { ...state.points[1], label: "B" },
    ]
    : [],
  requirements: [
    ...G1_GENERATOR_BEST_FIT_GUARDRAILS,
    "The scatter cloud is independently generated around the stored line; no historical data set is reused.",
  ],
});

const bestFitQuestion = (
  seed: number,
  surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"],
): G1BestFitGeneratedQuestion => {
  const state = bestFitState(seed, surfaceStyleId);
  const prompt = buildG1BestFitPrompt(state, surfaceStyleId);
  const sourceBasis = historicalReferenceForG1("BEST_FIT_LINEAR_MODEL", surfaceStyleId, "P1");
  const quality = qualityFor(
    "BEST_FIT_LINEAR_MODEL",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "generated scatter data and supplied fitted line",
      state.gradient.numerator < 0 ? "negative fitted-line direction" : "positive fitted-line direction",
      surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"
        ? "exactly two intended scatter points lie on the fitted line at readable grid intersections"
        : "two model-defining fitted-line points are stated explicitly",
      "context variables required in the final equation",
      "three G1 marks stop at fitted-model construction",
      "one adjacent S2 mark deliberately deferred",
    ],
  );

  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-BEST-FIT-${surfaceStyleId}-${seed >>> 0}`,
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
    visual: bestFitVisual(state, surfaceStyleId),
    deferredComposite: {
      totalHistoricalArchitectureMarks: 4,
      g1MarksGenerated: 3,
      embeddedSkillId: "stat-s02-linear-model",
      embeddedMarksDeferred: 1,
      reason: "The reviewed best-fit architecture includes an adjacent one-mark statistical estimate. That cross-skill mark remains deferred until the statistical generation layer is deliberately implemented.",
    },
    sourceBasis,
    generationConstraints: [
      ...G1_GENERATOR_INVARIANTS,
      ...G1_GENERATOR_BEST_FIT_GUARDRAILS,
      ...G1_GENERATOR_DIFFICULTY_RULES,
    ],
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
    const parameterisedPoint = {
      xCoefficient: denominatorScale * parameterCoefficient,
      yCoefficient: parameterCoefficient * parameterCoefficient,
    };
    const kp = parameterCoefficient === 1 ? parameter : `${parameterCoefficient}${parameter}`;
    const xParameter = parameterisedPoint.xCoefficient === 1 ? parameter : `${parameterisedPoint.xCoefficient}${parameter}`;
    const yParameter = parameterisedPoint.yCoefficient === 1
      ? `${parameter}^{2}`
      : `${parameterisedPoint.yCoefficient}${parameter}^{2}`;
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
    if (historicalG1SymbolicOverlap(state)) continue;
    return state;
  }
  throw new Error("Unable to construct a non-historical symbolic G1 gradient state.");
};

const symbolicQuestion = (seed: number): G1SymbolicGeneratedQuestion => {
  const state = symbolicState(seed);
  const surfaceStyleId = "SYMBOLIC_COORDINATE_GRADIENT" as const;
  const prompt = buildG1SymbolicPrompt(state);
  const sourceBasis = historicalReferenceForG1("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", surfaceStyleId, "P2");
  const quality = qualityFor(
    "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    surfaceStyleId,
    "P2",
    state,
    sourceBasis,
    [
      "rare source-calibrated P2 family",
      "parameterised coordinate point",
      "two-point gradient quotient",
      "difference-of-squares factorisation",
      "common-factor cancellation",
      "exact linear gradient expression",
    ],
  );
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
    generationConstraints: [
      ...G1_GENERATOR_INVARIANTS,
      ...G1_GENERATOR_SYMBOLIC_GUARDRAILS,
      ...G1_GENERATOR_DIFFICULTY_RULES,
    ],
    quality,
  };
};

const validateRequestedSurface = (
  family: G1GeneratorFamily,
  requestedSurface?: G1GeneratorSurfaceStyle,
) => {
  if (!requestedSurface) return;
  if (!G1_SURFACES_BY_FAMILY[family].includes(requestedSurface as never)) {
    throw new Error(`${requestedSurface} is not calibrated for ${family}.`);
  }
};

const surfaceForBestFit = (
  seed: number,
  requestedSurface: G1GeneratorSurfaceStyle | undefined,
  requestedDifficulty: G1GeneratorDifficulty | undefined,
): G1BestFitGeneratedQuestion["surfaceStyleId"] => {
  if (requestedSurface) {
    if (requestedSurface !== "BEST_FIT_LABELLED_POINTS_CONTEXT" && requestedSurface !== "BEST_FIT_GRID_READ_POINTS") {
      throw new Error(`${requestedSurface} is not a best-fit surface.`);
    }
    return requestedSurface;
  }
  if (requestedDifficulty === 1) return "BEST_FIT_LABELLED_POINTS_CONTEXT";
  if (requestedDifficulty === 2) return "BEST_FIT_GRID_READ_POINTS";
  // Observed best-fit split: 3 explicit-point surfaces and 2 graph-read surfaces.
  return mixSeed(seed, 0x610505) % 5 < 3
    ? "BEST_FIT_LABELLED_POINTS_CONTEXT"
    : "BEST_FIT_GRID_READ_POINTS";
};

export const generateG1Question = (options: G1GenerateOptions): G1GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  // Generic G1 generation includes the three G1 marks from the historically
  // common best-fit wrapper while retaining the adjacent S2 mark as deferred.
  const includeDeferredCompositeFamilies = options.includeDeferredCompositeFamilies ?? true;
  const paper = chooseG1Paper(options.seed, options.family, options.paper);
  const family = selectG1Family(
    options.seed,
    paper,
    options.family,
    includeExperimentalFamilies,
    includeDeferredCompositeFamilies,
  );
  validateRequestedSurface(family, options.surfaceStyleId);

  let question: G1GeneratedQuestion;
  if (family === "LINE_EQUATION_FROM_TWO_POINTS") {
    question = lineQuestion(options.seed, chooseLineSurface(options.seed, options.surfaceStyleId), options.difficulty);
  } else if (family === "CONTEXTUAL_LINEAR_MODEL") {
    if (options.difficulty === 1) {
      throw new Error("The deterministic contextual G1 family is calibrated to upper-band difficulty.");
    }
    question = contextQuestion(options.seed);
  } else if (family === "BEST_FIT_LINEAR_MODEL") {
    question = bestFitQuestion(options.seed, surfaceForBestFit(options.seed, options.surfaceStyleId, options.difficulty));
  } else {
    if (options.difficulty === 1) {
      throw new Error("The symbolic G1 family is calibrated to upper-band difficulty.");
    }
    question = symbolicQuestion(options.seed);
  }

  if (options.difficulty && question.difficulty !== options.difficulty) {
    throw new Error(`Generated ${family} at difficulty ${question.difficulty}, not requested difficulty ${options.difficulty}.`);
  }

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
  return [
    question.family,
    question.surfaceStyleId,
    state.points[0].x,
    state.points[0].y,
    state.points[1].x,
    state.points[1].y,
    state.gradient.numerator,
    state.gradient.denominator,
    state.intercept.numerator,
    state.intercept.denominator,
  ].join(":");
};

const structuralSignature = (question: G1GeneratedQuestion): string => {
  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") {
    const state = question.mathState;
    return `S:${state.denominatorScale}:${state.parameterCoefficient}:${state.constant}:${state.parameter}`;
  }
  return [
    question.family,
    question.surfaceStyleId,
    question.mathState.gradient.numerator,
    question.mathState.gradient.denominator,
    question.mathState.intercept.numerator,
    Math.abs(question.mathState.points[1].x - question.mathState.points[0].x),
  ].join(":");
};

export const generateG1QuestionBatch = (
  count: number,
  options: Omit<G1GenerateOptions, "seed"> & { seed: number },
): G1GeneratedQuestion[] => {
  if (!Number.isInteger(count) || count < 1) throw new Error("G1 batch count must be a positive integer.");
  const results: G1GeneratedQuestion[] = [];
  const seenExact = new Set<string>();
  const seenStructural = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    let accepted: G1GeneratedQuestion | null = null;
    for (let retry = 0; retry < 320; retry += 1) {
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
    if (!accepted) {
      throw new Error(`Unable to create ${count} structurally distinct G1 questions inside the calibrated generation space.`);
    }
    results.push(accepted);
  }
  return results;
};

export const G1_GENERATOR_DESIGN_NOTES = G1_GENERATOR_CALIBRATION_DECISIONS;
