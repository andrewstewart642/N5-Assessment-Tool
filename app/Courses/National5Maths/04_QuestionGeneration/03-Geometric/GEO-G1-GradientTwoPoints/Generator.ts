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

const axisWindow = (
  xVariable: string,
  yVariable: string,
  points: readonly G1NumericPoint[],
  labels?: { xLabel: string; yLabel: string; xUnit: string | null; yUnit: string | null },
): G1AxisSpec => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xMinimumRaw = Math.min(...xs);
  const xMaximumRaw = Math.max(...xs);
  const yMinimumRaw = Math.min(...ys);
  const yMaximumRaw = Math.max(...ys);
  const xPad = Math.max(2, Math.ceil((xMaximumRaw - xMinimumRaw) * 0.2));
  const yPad = Math.max(2, Math.ceil((yMaximumRaw - yMinimumRaw) * 0.15));
  return {
    xVariable,
    yVariable,
    xLabel: labels?.xLabel ?? "x",
    yLabel: labels?.yLabel ?? "y",
    xUnit: labels?.xUnit ?? null,
    yUnit: labels?.yUnit ?? null,
    xMinimum: Math.min(0, Math.floor(xMinimumRaw - xPad)),
    xMaximum: Math.max(0, Math.ceil(xMaximumRaw + xPad)),
    xTickInterval: 1,
    yMinimum: Math.min(0, Math.floor(yMinimumRaw - yPad)),
    yMaximum: Math.max(0, Math.ceil(yMaximumRaw + yPad)),
    yTickInterval: 1,
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
  return mixSeed(seed, 0x610001) % 2 === 0
    ? "DIRECT_COORDINATES_LINE_EQUATION"
    : "COORDINATE_DIAGRAM_LINE_EQUATION";
};

const lineEquationState = (seed: number): G1LineModelState & { family: "LINE_EQUATION_FROM_TWO_POINTS" } => {
  const rng = new SeededRandom(mixSeed(seed, 0x610101));
  const gradients = [-5, -4, -3, -2, 2, 3, 4, 5] as const;
  const intercepts = [-12, -10, -8, -7, -5, 4, 6, 8, 10, 11, 13, 15] as const;

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const gradient = rational(rng.pick(gradients));
    const intercept = rational(rng.pick(intercepts));
    const x1 = rng.int(-6, 4);
    const gap = rng.pick([2, 3, 4, 5] as const);
    const x2 = x1 + gap;
    if (x2 > 7) continue;
    const y1 = integerValue(evaluateLine(gradient, intercept, x1));
    const y2 = integerValue(evaluateLine(gradient, intercept, x2));
    if (y1 == null || y2 == null) continue;
    if (Math.max(Math.abs(y1), Math.abs(y2)) > 22) continue;
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
): G1LineEquationGeneratedQuestion => {
  const state = lineEquationState(seed);
  const prompt = surfaceStyleId === "DIRECT_COORDINATES_LINE_EQUATION"
    ? buildG1DirectLinePrompt(state, seed)
    : buildG1DiagramLinePrompt(seed);
  const sourceBasis = historicalReferenceForG1("LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId, "P1");
  const quality = qualityFor(
    "LINE_EQUATION_FROM_TWO_POINTS",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "two exact generated coordinate points",
      `non-zero integer gradient ${state.gradient.numerator}`,
      `non-zero intercept ${state.intercept.numerator}`,
      surfaceStyleId === "COORDINATE_DIAGRAM_LINE_EQUATION"
        ? "coordinates recovered from generated visual data"
        : "coordinates supplied directly",
    ],
  );

  return {
    generatorId: "G1_GRADIENT_TWO_POINTS_V1",
    instanceId: `G1-P1-LINE-${surfaceStyleId}-${seed >>> 0}`,
    seed,
    skillId: "geo-g01-gradient-two-points",
    conceptId: "geo-g1-1",
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    familyReadiness: "CORE",
    surfaceStyleId,
    paper: "P1",
    difficulty: 1,
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

const CONTEXTS: readonly G1ContextProfile[] = [
  {
    domainId: "BICYCLE_HIRE",
    introduction: "A bicycle-hire company uses a straight-line model for the total hire charge.",
    xDescription: "hire time",
    yDescription: "total charge",
    xVariable: "t",
    yVariable: "C",
    xUnit: "hours",
    yUnit: "pounds",
  },
  {
    domainId: "WATER_STORAGE",
    introduction: "Water enters a storage vessel at a steady rate, giving a straight-line relationship between time and volume.",
    xDescription: "time",
    yDescription: "volume of water",
    xVariable: "t",
    yVariable: "V",
    xUnit: "minutes",
    yUnit: "litres",
  },
  {
    domainId: "PARCEL_MASS",
    introduction: "A packing process gives a straight-line relationship between the number of identical items and the total parcel mass.",
    xDescription: "number of items",
    yDescription: "parcel mass",
    xVariable: "n",
    yVariable: "M",
    xUnit: "items",
    yUnit: "kg",
  },
  {
    domainId: "PRINTING_CHARGE",
    introduction: "A print service uses a straight-line model connecting the number of batches ordered and the total charge.",
    xDescription: "number of batches",
    yDescription: "total charge",
    xVariable: "b",
    yVariable: "P",
    xUnit: "batches",
    yUnit: "pounds",
  },
] as const;

const contextualState = (seed: number): G1ContextualLineState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610202));
  const gradients = [
    rational(1, 2),
    rational(3, 2),
    rational(5, 2),
    rational(1, 4),
    rational(3, 4),
    rational(1, 5),
    rational(2, 5),
    rational(3, 5),
  ] as const;
  const intercepts = [3, 4, 6, 7, 9, 11, 12, 14, 16, 18] as const;

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const context = rng.pick(CONTEXTS);
    const gradient = rng.pick(gradients);
    const intercept = rational(rng.pick(intercepts));
    const step = gradient.denominator;
    const k1 = rng.int(1, 3);
    const k2 = k1 + rng.pick([2, 3, 4] as const);
    const x1 = k1 * step;
    const x2 = k2 * step;
    const y1 = integerValue(evaluateLine(gradient, intercept, x1));
    const y2 = integerValue(evaluateLine(gradient, intercept, x2));
    if (y1 == null || y2 == null || y2 > 80) continue;
    const inputChoices = [k2 + 1, k2 + 2, k2 + 3].map((value) => value * step);
    const followInput = rng.pick(inputChoices);
    const exactOutput = evaluateLine(gradient, intercept, followInput);
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
    [...state.points, { x: state.followUp.input, y: integerValue(state.followUp.exactOutput) ?? state.followUp.exactOutput.numerator / state.followUp.exactOutput.denominator }],
    {
      xLabel: state.context.xDescription,
      yLabel: state.context.yDescription,
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
    "The line and labelled coordinates must be generated from the stored mathematical state.",
  ],
});

const contextQuestion = (seed: number): G1ContextualGeneratedQuestion => {
  const state = contextualState(seed);
  const surfaceStyleId = "CONTEXT_LINE_GRAPH_LABELLED_POINTS" as const;
  const prompt = buildG1ContextPrompt(state, seed);
  const sourceBasis = historicalReferenceForG1("CONTEXTUAL_LINEAR_MODEL", surfaceStyleId, "P1");
  const quality = qualityFor(
    "CONTEXTUAL_LINEAR_MODEL",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "deterministic contextual relationship",
      `exact fractional gradient ${state.gradient.numerator}/${state.gradient.denominator}`,
      "two explicit model-defining points",
      "three-mark model construction",
      "one-mark deterministic model application owned by G1",
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

const BEST_FIT_CONTEXTS: readonly G1ContextProfile[] = [
  {
    domainId: "SUNLIGHT_GROWTH",
    introduction: "A researcher compares daily sunlight with plant growth for a group of plants.",
    xDescription: "daily sunlight",
    yDescription: "growth",
    xVariable: "H",
    yVariable: "G",
    xUnit: "hours",
    yUnit: "mm",
  },
  {
    domainId: "MACHINE_AGE_EFFICIENCY",
    introduction: "Measurements compare the age of several machines with an efficiency score.",
    xDescription: "machine age",
    yDescription: "efficiency score",
    xVariable: "A",
    yVariable: "E",
    xUnit: "years",
    yUnit: "points",
  },
  {
    domainId: "EXERCISE_PULSE",
    introduction: "Data compare weekly exercise time with resting pulse rate for a group of adults.",
    xDescription: "weekly exercise",
    yDescription: "resting pulse rate",
    xVariable: "T",
    yVariable: "R",
    xUnit: "hours",
    yUnit: "beats/min",
  },
] as const;

const scatterAroundLine = (
  gradient: G1Rational,
  intercept: G1Rational,
  rng: SeededRandom,
): G1NumericPoint[] => {
  const offsets = [-3, 2, -2, 3, -1, 2, -2, 1] as const;
  const points: G1NumericPoint[] = [];
  for (let x = 1; x <= 8; x += 1) {
    const lineValue = integerValue(evaluateLine(gradient, intercept, x));
    if (lineValue == null) continue;
    const offset = offsets[(x + rng.int(0, offsets.length - 1)) % offsets.length];
    points.push({ x, y: Math.max(1, lineValue + offset) });
  }
  return points;
};

const bestFitState = (
  seed: number,
  surfaceStyleId: G1BestFitGeneratedQuestion["surfaceStyleId"],
): G1BestFitLineState => {
  const rng = new SeededRandom(mixSeed(seed, 0x610303));
  const gradients = surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT"
    ? ([2, 3, 4] as const)
    : ([-3, -2, 2, 3, 4] as const);
  const intercepts = [12, 16, 20, 24, 28, 32, 36, 42] as const;

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const context = rng.pick(BEST_FIT_CONTEXTS);
    const gradient = rational(rng.pick(gradients));
    const intercept = rational(rng.pick(intercepts));
    const x1 = rng.pick([1, 2, 3] as const);
    const x2 = rng.pick([6, 7, 8] as const);
    const y1 = integerValue(evaluateLine(gradient, intercept, x1));
    const y2 = integerValue(evaluateLine(gradient, intercept, x2));
    if (y1 == null || y2 == null || Math.min(y1, y2) <= 5 || Math.max(y1, y2) > 70) continue;
    const base = baseLineState(
      "BEST_FIT_LINEAR_MODEL",
      context.xVariable,
      context.yVariable,
      [{ x: x1, y: y1 }, { x: x2, y: y2 }],
      gradient,
      intercept,
    );
    if (historicalG1NumericOverlap(base)) continue;
    const scatterPoints = scatterAroundLine(gradient, intercept, rng);
    if (scatterPoints.length < 6) continue;
    const middleX = Math.round((x1 + x2) / 2);
    const middleY = integerValue(evaluateLine(gradient, intercept, middleX));
    const lineReadPoints = middleY == null
      ? [base.points[0], base.points[1]]
      : [base.points[0], { x: middleX, y: middleY }, base.points[1]];
    return {
      ...base,
      family: "BEST_FIT_LINEAR_MODEL",
      context,
      scatterPoints,
      lineReadPoints,
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
  const difficulty = assessG1Difficulty("BEST_FIT_LINEAR_MODEL", surfaceStyleId, state);
  const quality = qualityFor(
    "BEST_FIT_LINEAR_MODEL",
    surfaceStyleId,
    "P1",
    state,
    sourceBasis,
    [
      "generated scatter data and supplied fitted line",
      surfaceStyleId === "BEST_FIT_GRID_READ_POINTS"
        ? "candidate must recover exact line points from scaled visual data"
        : "two line points stated explicitly",
      "three G1 marks stop at fitted-model construction",
      "one S2 mark deliberately deferred",
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
    difficulty: difficulty.difficulty,
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
      reason: "The historical best-fit architecture adds a one-mark statistical estimate. That cross-skill mark remains deferred until the statistical generation layer is deliberately implemented.",
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
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const parameter = rng.pick(parameters);
    const denominatorScale = rng.pick([2, 3, 4] as const);
    const parameterCoefficient = rng.pick([1, 2, 3] as const);
    const constant = rng.pick([2, 4, 5, 6, 7] as const);
    if (parameterCoefficient % denominatorScale === 0 && constant % denominatorScale === 0) continue;
    const numericPoint = {
      x: denominatorScale * constant,
      y: constant * constant,
    };
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
  return mixSeed(seed, 0x610505) % 5 < 3
    ? "BEST_FIT_LABELLED_POINTS_CONTEXT"
    : "BEST_FIT_GRID_READ_POINTS";
};

export const generateG1Question = (options: G1GenerateOptions): G1GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  const includeDeferredCompositeFamilies = options.includeDeferredCompositeFamilies ?? false;
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
    if (options.difficulty === 2) {
      throw new Error("The current standalone numeric G1 line family is calibrated to lower-band difficulty only.");
    }
    question = lineQuestion(options.seed, chooseLineSurface(options.seed, options.surfaceStyleId));
  } else if (family === "CONTEXTUAL_LINEAR_MODEL") {
    if (options.difficulty === 1) {
      throw new Error("The deterministic contextual G1 family is calibrated to upper-band difficulty.");
    }
    question = contextQuestion(options.seed);
  } else if (family === "BEST_FIT_LINEAR_MODEL") {
    question = bestFitQuestion(
      options.seed,
      surfaceForBestFit(options.seed, options.surfaceStyleId, options.difficulty),
    );
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
    return `S:${state.denominatorScale}:${state.parameterCoefficient}:${state.constant % state.denominatorScale}`;
  }
  return [
    question.family,
    question.surfaceStyleId,
    Math.sign(question.mathState.gradient.numerator),
    question.mathState.gradient.denominator,
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
    for (let retry = 0; retry < 260; retry += 1) {
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
