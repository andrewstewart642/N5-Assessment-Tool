import {
  chooseG1Paper,
  selectG1Family,
} from "./Calibration";
import { generateG1Question as generateG1QuestionV2 } from "./GeneratorV2";
import type {
  G1GenerateOptions,
  G1GeneratedQuestion,
  G1GeneratorDifficulty,
  G1GeneratorFamily,
  G1GeneratorSurfaceStyle,
} from "./Types";
import { validateG1GeneratedQuestion } from "./Validation";

const MAX_GENERATION_ATTEMPTS = 480;

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;

const mixSeed = (seed: number, salt: number) => {
  let value = (seed ^ salt) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};

const resolveSurface = (
  family: G1GeneratorFamily,
  seed: number,
  requested: G1GeneratorSurfaceStyle | undefined,
  difficulty: G1GeneratorDifficulty | undefined,
): G1GeneratorSurfaceStyle => {
  if (requested) return requested;
  if (family === "LINE_EQUATION_FROM_TWO_POINTS") {
    return mixSeed(seed, 0x610001) % 2 === 0
      ? "DIRECT_COORDINATES_LINE_EQUATION"
      : "COORDINATE_DIAGRAM_LINE_EQUATION";
  }
  if (family === "CONTEXTUAL_LINEAR_MODEL") return "CONTEXT_LINE_GRAPH_LABELLED_POINTS";
  if (family === "BEST_FIT_LINEAR_MODEL") {
    if (difficulty === 1) return "BEST_FIT_LABELLED_POINTS_CONTEXT";
    if (difficulty === 2) return "BEST_FIT_GRID_READ_POINTS";
    return mixSeed(seed, 0x610505) % 5 < 3
      ? "BEST_FIT_LABELLED_POINTS_CONTEXT"
      : "BEST_FIT_GRID_READ_POINTS";
  }
  return "SYMBOLIC_COORDINATE_GRADIENT";
};

const desiredLineSignIsNegative = (seed: number) => positiveModulo(seed, 2) === 0;
const desiredContextSignIsNegative = (seed: number) => positiveModulo(seed, 5) < 2;

const signPolicySatisfied = (
  question: G1GeneratedQuestion,
  externalSeed: number,
) => {
  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS") {
    return (question.mathState.gradient.numerator < 0) === desiredLineSignIsNegative(externalSeed);
  }
  if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    return (question.mathState.gradient.numerator < 0) === desiredContextSignIsNegative(externalSeed);
  }
  return true;
};

const withV3Metadata = (
  question: G1GeneratedQuestion,
  externalSeed: number,
  retry: number,
): G1GeneratedQuestion => {
  const extraLevers = [
    "V3 quality-constrained retry policy",
    question.family === "LINE_EQUATION_FROM_TWO_POINTS"
      ? "smoothed 50:50 positive/negative standalone-line direction target"
      : question.family === "CONTEXTUAL_LINEAR_MODEL"
        ? "approximately 40% decreasing contextual-model direction target"
        : question.family === "BEST_FIT_LINEAR_MODEL"
          ? "best-fit visual-density and requested-difficulty suitability gate"
          : "rare symbolic family retains source-calibrated structure",
  ];
  return {
    ...question,
    seed: externalSeed,
    instanceId: `G1-V3-${question.paper}-${question.family}-${question.surfaceStyleId}-L${question.difficulty}-${externalSeed >>> 0}`,
    generationConstraints: [
      ...question.generationConstraints,
      ...G1_GENERATOR_V3_GUARDRAILS,
    ],
    quality: {
      ...question.quality,
      structuralLevers: [
        ...question.quality.structuralLevers,
        ...extraLevers,
        retry > 0 ? `deterministic internal suitability retry ${retry}` : "first-pass suitability acceptance",
      ],
    },
  } as G1GeneratedQuestion;
};

const impossibleRequest = (
  family: G1GeneratorFamily,
  surface: G1GeneratorSurfaceStyle,
  difficulty: G1GeneratorDifficulty | undefined,
) => {
  if (family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS" && difficulty === 1) {
    return "The symbolic G1 family is calibrated to upper-band difficulty.";
  }
  if (family === "BEST_FIT_LINEAR_MODEL" && surface === "BEST_FIT_GRID_READ_POINTS" && difficulty === 1) {
    return "The grid-read best-fit surface is intrinsically upper-band because selecting exact points from the scale is essential mathematical work.";
  }
  return null;
};

export const generateG1Question = (options: G1GenerateOptions): G1GeneratedQuestion => {
  const includeExperimentalFamilies = options.includeExperimentalFamilies ?? true;
  const includeDeferredCompositeFamilies = options.includeDeferredCompositeFamilies ?? true;
  const paper = chooseG1Paper(options.seed, options.family, options.paper);
  const family = selectG1Family(
    options.seed,
    paper,
    options.family,
    includeExperimentalFamilies,
    includeDeferredCompositeFamilies,
  );
  const surfaceStyleId = resolveSurface(family, options.seed, options.surfaceStyleId, options.difficulty);
  const impossible = impossibleRequest(family, surfaceStyleId, options.difficulty);
  if (impossible) throw new Error(impossible);

  let lastError = "No candidate reached the V3 suitability gate.";
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const candidateSeed = attempt === 0
      ? options.seed
      : mixSeed(options.seed, 0x610700 + attempt * 7919);
    try {
      // Best-fit V2 historically checked requested difficulty only after state
      // manufacture. V3 therefore constrains the surface first, lets V2 build a
      // valid state, then accepts only the requested route-based band.
      const candidate = generateG1QuestionV2({
        ...options,
        seed: candidateSeed,
        family,
        paper,
        surfaceStyleId,
        difficulty: family === "BEST_FIT_LINEAR_MODEL" ? undefined : options.difficulty,
      });

      if (options.difficulty && candidate.difficulty !== options.difficulty) {
        lastError = `Candidate was difficulty ${candidate.difficulty}, not requested difficulty ${options.difficulty}.`;
        continue;
      }
      if (!signPolicySatisfied(candidate, options.seed)) {
        lastError = "Candidate did not satisfy the calibrated direction-balance policy.";
        continue;
      }

      const normalized = withV3Metadata(candidate, options.seed, attempt);
      const validation = validateG1GeneratedQuestion(normalized);
      if (!validation.valid) {
        lastError = validation.issues
          .filter((issue) => issue.severity === "ERROR")
          .map((issue) => `${issue.code}: ${issue.message}`)
          .join(" | ");
        continue;
      }
      return normalized;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  throw new Error(`Unable to construct a V3-suitable G1 ${family} question for seed ${options.seed}. Last rejection: ${lastError}`);
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
  const contextId = question.family === "CONTEXTUAL_LINEAR_MODEL" || question.family === "BEST_FIT_LINEAR_MODEL"
    ? question.mathState.context.domainId
    : "NONE";
  return [
    question.family,
    question.surfaceStyleId,
    contextId,
    question.mathState.gradient.numerator,
    question.mathState.gradient.denominator,
    question.mathState.intercept.numerator,
    question.mathState.intercept.denominator,
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
    if (!accepted) {
      throw new Error(`Unable to create ${count} structurally distinct G1 questions inside the V3 calibrated generation space.`);
    }
    results.push(accepted);
  }
  return results;
};

export const G1_GENERATOR_V3_GUARDRAILS = [
  "Standalone line-equation generation uses a smoothed approximately 50:50 positive/negative direction target rather than overfitting a four-question sign sample.",
  "Neither generated standalone point may lie on an axis; an axis point removes part of the intended substitution demand.",
  "Deterministic contextual generation deliberately includes a substantial minority of physically meaningful decreasing relationships.",
  "Context decimals must remain written-arithmetic friendly: sensible terminating values are allowed only when the gradient subtraction remains clean.",
  "Requested best-fit difficulty is a construction constraint: unsuitable states are regenerated rather than surfaced as a post-generation mismatch error.",
  "Grid-read best-fit graphs reject excessive major-grid density and horizontally compressed data clouds.",
  "Labelled-point and other supportive diagrams may use schematic visual spacing; visual ugliness is never a difficulty lever.",
] as const;

export { G1_GENERATOR_DESIGN_NOTES } from "./GeneratorV2";
