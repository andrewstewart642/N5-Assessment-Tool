import type { G1CorpusFamily } from "./G1CrossCorpusAnalysis";

export type G1Rational = { numerator: number; denominator: number };
export type G1NumericPoint = { x: number; y: number };

export type G1NumericLineFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  family: Exclude<G1CorpusFamily, "SYMBOLIC_GRADIENT_FROM_TWO_POINTS">;
  paper: "P1";
  primaryPoints: readonly [G1NumericPoint, G1NumericPoint];
  additionalPermittedLinePoints: readonly G1NumericPoint[];
  gradient: G1Rational;
  intercept: G1Rational;
  pointAcquisition: "TEXT" | "DIAGRAM" | "GRAPH";
  visualRole: "NONE" | "SUPPORTIVE" | "ESSENTIAL";
  followUp: null | { owner: "G1" | "S2"; input: number; output: number };
  difficultySignals: readonly string[];
};

export const G1_NUMERIC_LINE_FINGERPRINTS: readonly G1NumericLineFingerprint[] = [
  { sourceQuestionId: "N5_MATH_2014_P1_Q6", sourceAnswerId: "N5_MATH_2014_P1_Q6_MS", family: "BEST_FIT_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 5, y: 200 }, { x: 25, y: 500 }], additionalPermittedLinePoints: [], gradient: { numerator: 15, denominator: 1 }, intercept: { numerator: 125, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "SUPPORTIVE", followUp: { owner: "S2", input: 40, output: 725 }, difficultySignals: ["contextual variables", "best-fit wrapper", "explicit line points", "follow-on statistical estimate"] },
  { sourceQuestionId: "N5_MATH_2015_P1_Q8", sourceAnswerId: "N5_MATH_2015_P1_Q8_MS", family: "LINE_EQUATION_FROM_TWO_POINTS", paper: "P1", primaryPoints: [{ x: -2, y: 5 }, { x: 3, y: 15 }], additionalPermittedLinePoints: [], gradient: { numerator: 2, denominator: 1 }, intercept: { numerator: 9, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "NONE", followUp: null, difficultySignals: ["signed coordinate subtraction", "small integer gradient", "direct prose coordinates"] },
  { sourceQuestionId: "N5_MATH_2016_P1_Q5", sourceAnswerId: "N5_MATH_2016_P1_Q5_MS", family: "BEST_FIT_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 3, y: 100 }, { x: 15, y: 340 }], additionalPermittedLinePoints: [], gradient: { numerator: 20, denominator: 1 }, intercept: { numerator: 40, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "SUPPORTIVE", followUp: { owner: "S2", input: 12, output: 280 }, difficultySignals: ["larger coordinate differences", "contextual variables", "best-fit wrapper"] },
  { sourceQuestionId: "N5_MATH_2017_P1_Q6", sourceAnswerId: "N5_MATH_2017_P1_Q6_MS", family: "LINE_EQUATION_FROM_TWO_POINTS", paper: "P1", primaryPoints: [{ x: -1, y: 6 }, { x: 3, y: -2 }], additionalPermittedLinePoints: [], gradient: { numerator: -2, denominator: 1 }, intercept: { numerator: 4, denominator: 1 }, pointAcquisition: "DIAGRAM", visualRole: "ESSENTIAL", followUp: null, difficultySignals: ["candidate reads coordinates from diagram", "negative gradient", "signed coordinate subtraction"] },
  { sourceQuestionId: "N5_MATH_2018_P1_Q7", sourceAnswerId: "N5_MATH_2018_P1_Q7_MS", family: "CONTEXTUAL_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 8, y: 14 }, { x: 12, y: 20 }], additionalPermittedLinePoints: [], gradient: { numerator: 3, denominator: 2 }, intercept: { numerator: 2, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "SUPPORTIVE", followUp: { owner: "G1", input: 5, output: 9.5 }, difficultySignals: ["fractional gradient", "deterministic contextual model", "precision-sensitive monetary follow-up"] },
  { sourceQuestionId: "N5_MATH_2019_P1_Q6", sourceAnswerId: "N5_MATH_2019_P1_Q6_MS", family: "BEST_FIT_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 1.5, y: 14 }, { x: 3.5, y: 8 }], additionalPermittedLinePoints: [], gradient: { numerator: -3, denominator: 1 }, intercept: { numerator: 37, denominator: 2 }, pointAcquisition: "GRAPH", visualRole: "ESSENTIAL", followUp: { owner: "S2", input: 1.1, output: 15.2 }, difficultySignals: ["scaled graph reading", "decimal coordinates", "negative gradient", "best-fit wrapper"] },
  { sourceQuestionId: "N5_MATH_2021_P1_Q10", sourceAnswerId: "N5_MATH_2021_P1_Q10_MS", family: "CONTEXTUAL_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 6000, y: 450 }, { x: 7200, y: 510 }], additionalPermittedLinePoints: [], gradient: { numerator: 1, denominator: 20 }, intercept: { numerator: 150, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "SUPPORTIVE", followUp: { owner: "G1", input: 1000, output: 200 }, difficultySignals: ["large coordinate scale", "small exact fractional gradient", "deterministic contextual model"] },
  { sourceQuestionId: "N5_MATH_2022_P1_Q6", sourceAnswerId: "N5_MATH_2022_P1_Q6_MS", family: "LINE_EQUATION_FROM_TWO_POINTS", paper: "P1", primaryPoints: [{ x: -3, y: -1 }, { x: -5, y: 7 }], additionalPermittedLinePoints: [], gradient: { numerator: -4, denominator: 1 }, intercept: { numerator: -13, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "NONE", followUp: null, difficultySignals: ["both points use negative x-values", "negative gradient", "negative intercept"] },
  { sourceQuestionId: "N5_MATH_2023_P1_Q7", sourceAnswerId: "N5_MATH_2023_P1_Q7_MS", family: "BEST_FIT_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 5, y: 20000 }, { x: 15, y: 35000 }], additionalPermittedLinePoints: [{ x: 25, y: 50000 }], gradient: { numerator: 1500, denominator: 1 }, intercept: { numerator: 12500, denominator: 1 }, pointAcquisition: "GRAPH", visualRole: "ESSENTIAL", followUp: { owner: "S2", input: 8, output: 24500 }, difficultySignals: ["candidate selects exact graph-readable line points", "large y-scale", "best-fit wrapper"] },
  { sourceQuestionId: "N5_MATH_2024_P1_Q9", sourceAnswerId: "N5_MATH_2024_P1_Q9_MS", family: "BEST_FIT_LINEAR_MODEL", paper: "P1", primaryPoints: [{ x: 3, y: 26 }, { x: 10, y: 12 }], additionalPermittedLinePoints: [], gradient: { numerator: -2, denominator: 1 }, intercept: { numerator: 32, denominator: 1 }, pointAcquisition: "TEXT", visualRole: "SUPPORTIVE", followUp: { owner: "S2", input: 7, output: 18 }, difficultySignals: ["negative contextual gradient", "best-fit wrapper", "explicit line points"] },
  { sourceQuestionId: "N5_MATH_2025_P1_Q6", sourceAnswerId: "N5_MATH_2025_P1_Q6_MS", family: "LINE_EQUATION_FROM_TWO_POINTS", paper: "P1", primaryPoints: [{ x: 1, y: 12 }, { x: 6, y: 2 }], additionalPermittedLinePoints: [], gradient: { numerator: -2, denominator: 1 }, intercept: { numerator: 14, denominator: 1 }, pointAcquisition: "DIAGRAM", visualRole: "ESSENTIAL", followUp: null, difficultySignals: ["candidate reads coordinates from diagram", "negative gradient", "positive-coordinate points"] },
] as const;

export type G1SymbolicGradientFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  numericPoint: { x: number; y: number };
  parameterisedPoint: { x: string; y: string };
  gradientQuotient: string;
  numeratorFactorisation: string;
  denominatorFactorisation: string;
  finalGradient: string;
  domainExclusion: string;
  difficultySignals: readonly string[];
};

export const G1_SYMBOLIC_GRADIENT_FINGERPRINT: G1SymbolicGradientFingerprint = {
  sourceQuestionId: "N5_MATH_2019_P2_Q13",
  sourceAnswerId: "N5_MATH_2019_P2_Q13_MS",
  numericPoint: { x: 6, y: 9 },
  parameterisedPoint: { x: "4p", y: "4p^2" },
  gradientQuotient: "(4p^2 - 9)/(4p - 6)",
  numeratorFactorisation: "(2p + 3)(2p - 3)",
  denominatorFactorisation: "2(2p - 3)",
  finalGradient: "p + 3/2",
  domainExclusion: "p != 3/2",
  difficultySignals: ["parameterised coordinate", "difference-of-squares recognition", "common-factor cancellation", "exact rational constant remains in the final gradient"],
};

export type G1FamilyFrequencyCell = { family: G1CorpusFamily; count: number; total: number; proportion: number };
const frequency = (family: G1CorpusFamily, count: number, total: number): G1FamilyFrequencyCell => ({ family, count, total, proportion: count / total });

export const G1_EMPIRICAL_FAMILY_FREQUENCY = {
  overall: [frequency("LINE_EQUATION_FROM_TWO_POINTS", 4, 12), frequency("CONTEXTUAL_LINEAR_MODEL", 2, 12), frequency("BEST_FIT_LINEAR_MODEL", 5, 12), frequency("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", 1, 12)],
  P1: [frequency("LINE_EQUATION_FROM_TWO_POINTS", 4, 11), frequency("CONTEXTUAL_LINEAR_MODEL", 2, 11), frequency("BEST_FIT_LINEAR_MODEL", 5, 11), frequency("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", 0, 11)],
  P2: [frequency("LINE_EQUATION_FROM_TWO_POINTS", 0, 1), frequency("CONTEXTUAL_LINEAR_MODEL", 0, 1), frequency("BEST_FIT_LINEAR_MODEL", 0, 1), frequency("SYMBOLIC_GRADIENT_FROM_TWO_POINTS", 1, 1)],
  generationPolicy: ["Observed frequency is a weak prior rather than a prediction of future assessment content.", "The direct/diagram three-mark line family is the safest standalone default.", "Best-fit frequency must not be mistaken for permission to absorb the embedded S2 mark into G1.", "The symbolic family remains narrow despite being fully valid because only one reviewed source currently supports it."],
} as const;

export const G1_LINE_EQUATION_GENERATION_ENVELOPE = {
  supportedSurfaces: ["DIRECT_COORDINATES_LINE_EQUATION", "COORDINATE_DIAGRAM_LINE_EQUATION"] as const,
  marks: 3 as const,
  intendedGradientTypes: ["NON_ZERO_INTEGER"] as const,
  generatorGuardrails: ["Use two distinct x-coordinates and avoid vertical lines.", "Prefer small signed integer coordinates so Paper 1 arithmetic remains exact and readable.", "Avoid zero gradient and normally avoid gradients of +1 or -1 in V1 so the gradient stage remains visibly mark-bearing.", "Use a non-zero intercept so the second and third marks cannot collapse into a line-through-origin shortcut.", "Coordinate-diagram points must lie exactly on the generated line and be positioned on readable grid intersections.", "Permit negative coordinates and negative gradients because both are repeatedly evidenced.", "Do not reproduce a historical point pair or an affine-rescaled near-copy of a catalogued source instance."],
} as const;

export const G1_CONTEXTUAL_MODEL_GENERATION_ENVELOPE = {
  supportedSurface: "CONTEXT_LINE_GRAPH_LABELLED_POINTS" as const,
  marks: 4 as const,
  followUpOwner: "G1" as const,
  generatorGuardrails: ["The relationship must be deterministic, not a line of best fit.", "State the two model-defining point values explicitly so the graph is supportive rather than the sole coordinate source.", "Use an exact manageable gradient; a simple non-integer rational gradient is strongly evidenced and helps distinguish this family from the core direct-coordinate surface.", "Keep the context mathematically relevant to the line model and use units consistently.", "The fourth mark must be a direct calculation from the constructed deterministic model rather than a statistical estimate.", "If currency or measurement precision is imposed, answer generation must derive that requirement from the generated state rather than from a copied historical presentation rule."],
} as const;

export const G1_BEST_FIT_GENERATION_ENVELOPE = {
  supportedSurfaces: ["BEST_FIT_LABELLED_POINTS_CONTEXT", "BEST_FIT_GRID_READ_POINTS"] as const,
  g1Marks: 3 as const,
  embeddedS2Marks: 1 as const,
  generatorGuardrails: ["Supply a best-fit line; do not ask the candidate to draw the line in this G1 family.", "Labelled-point variants may duplicate the two line points in prose and therefore use the scattergraph supportively.", "Grid-read variants must expose at least two exact, unambiguous points on the supplied line at readable grid intersections.", "For grid-read variants, axis scale, tick spacing and line placement must be mathematically exact because the visual carries essential data.", "The G1 part stops after construction of the fitted line equation. The one-mark follow-up is S2-owned and remains deferred until S2 answer/generation policy is implemented.", "Context, variables and units may vary, but the generated best-fit line must not reuse historical coordinates, scales or artwork."],
} as const;

export const G1_SYMBOLIC_GENERATION_ENVELOPE = {
  supportedPaper: "P2" as const,
  marks: 3 as const,
  generatorGuardrails: ["Begin with two coordinate points, with at least one genuinely parameterised coordinate.", "The gradient quotient must create a factorable algebraic numerator and a denominator sharing exactly one non-trivial factor.", "The intended simplification must require gradient substitution, factorisation and cancellation as three distinct mark-bearing stages.", "Keep the final gradient exact and linear in the parameter.", "Exclude parameter values that make the two x-coordinates equal.", "Do not generate a pure factorisation prompt; the coordinate-geometric origin is an invariant of G1 ownership.", "Avoid reproducing the historical difference-of-squares constants or a scalar-equivalent copy of the source quotient."],
} as const;

export const G1_CALIBRATION_DECISIONS = [
  "G1 V1 should support the core three-mark line-equation family first, then deterministic contextual models, with the symbolic family kept experimental.",
  "Best-fit model construction is valid G1 evidence, but full composite generation must preserve the recorded 3 G1 + 1 S2 ownership split.",
  "Difficulty is separate from C/A Standard. A C-standard graph-reading instance may be upper-band, while a structurally clean C-standard direct-coordinate instance may be lower-band.",
  "Large contextual numbers are not a difficulty lever by themselves; exact ratio structure and visual-reading burden matter more.",
  "The presence of later algebra does not transfer ownership away from G1 when the task begins from coordinate geometry or a geometrically defined line.",
  "Generated answer schemes should not randomly reproduce year-specific answer-without-working regimes. A deliberate generated policy must be chosen in AnswerGeneration and provenance kept separate from historical evidence.",
] as const;
