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
  generationPolicy: [
    "Observed occurrence is the default prior for generic G1 selection: 4 line-equation, 2 deterministic-context, 5 best-fit and 1 symbolic appearance in the 12-question reviewed corpus.",
    "The prior controls family frequency, not a claim about future assessment probability.",
    "The 5/12 best-fit share refers only to the three G1 model-construction marks; the adjacent statistical mark remains separately owned and deferred.",
    "The symbolic family remains intentionally rare because one reviewed source supports it.",
  ],
} as const;

export const G1_LINE_EQUATION_GENERATION_ENVELOPE = {
  supportedSurfaces: ["DIRECT_COORDINATES_LINE_EQUATION", "COORDINATE_DIAGRAM_LINE_EQUATION"] as const,
  marks: 3 as const,
  intendedGradientTypes: ["NON_ZERO_INTEGER", "SIMPLE_EXACT_FRACTION"] as const,
  generatorGuardrails: [
    "Use two distinct x-coordinates and avoid vertical or horizontal lines.",
    "Keep the source-centred lower band dominated by small exact integer coordinates, with negative line directions occurring frequently because three of four reviewed line-family examples are negative.",
    "Permit a smaller higher-difficulty extension using reduced fractional gradients with denominators 2, 3, 4 or 5; choose coordinates so the subtraction and substitution remain exact and deliberate.",
    "Use a non-zero intercept so the second and third marks cannot collapse into a line-through-origin shortcut.",
    "Direct and coordinate-diagram surfaces should remain approximately balanced because each occurs twice in the reviewed line family.",
    "Coordinate diagrams are sparse schematics: no grid, no readable intercept scale, compact axes with arrowheads, O at the origin and exact coordinate labels beside the two points.",
    "Do not reproduce a historical point pair, line equation or affine-rescaled near-copy of a catalogued source instance.",
  ],
} as const;

export const G1_CONTEXTUAL_MODEL_GENERATION_ENVELOPE = {
  supportedSurface: "CONTEXT_LINE_GRAPH_LABELLED_POINTS" as const,
  marks: 4 as const,
  followUpOwner: "G1" as const,
  generatorGuardrails: [
    "The relationship must be deterministic and physically plausible rather than a line of best fit.",
    "Use authentic linear contexts such as fixed-charge tariffs, wage-plus-commission or steady increase/decrease models; avoid arbitrary stories with no natural linear interpretation.",
    "State the measured variables and units explicitly, then state point A and point B as separate information lines.",
    "Require the final model in the generated contextual variables; a generic y = mx + c response is not full-credit presentation.",
    "Keep the supportive diagram compact and schematic, with no grid or readable intercept scale when point values are supplied in text.",
    "Use exact manageable gradients; simple non-integer rational gradients are preferred, while large 100s/1000s values are allowed when they disguise a clean exact ratio.",
    "Permit sensible decreasing models so negative line directions are represented without forcing implausible contexts.",
    "The fourth mark must be a direct calculation from the deterministic model and remains G1-owned.",
  ],
} as const;

export const G1_BEST_FIT_GENERATION_ENVELOPE = {
  supportedSurfaces: ["BEST_FIT_LABELLED_POINTS_CONTEXT", "BEST_FIT_GRID_READ_POINTS"] as const,
  g1Marks: 3 as const,
  embeddedS2Marks: 1 as const,
  generatorGuardrails: [
    "Supply a line of best fit; do not ask the pupil to draw it in this G1 family.",
    "Use realistic paired-variable contexts and make the wording state the contextual variable letters and units.",
    "Preserve the observed surface split as a prior: three explicit/labelled-point examples for every two graph-read examples.",
    "Preserve the observed fitted-line direction as a prior: approximately two negative examples for every three positive examples.",
    "Labelled-point variants may be visually sparse because the two line points are stated explicitly.",
    "Grid-read variants must contain exactly two intended scatter points on the supplied line, both at clear grid intersections; every other scatter point must be off the line.",
    "Use only enough gridlines to recover the intended coordinates; dense spreadsheet-style grids are invalid visual noise.",
    "The G1 part stops after construction of the fitted-line equation. The one-mark follow-up remains S2-owned and deferred until that generation layer is deliberately implemented.",
  ],
} as const;

export const G1_SYMBOLIC_GENERATION_ENVELOPE = {
  supportedPaper: "P2" as const,
  marks: 3 as const,
  generatorGuardrails: [
    "Begin with two coordinate points, with at least one genuinely parameterised coordinate.",
    "Ask for an expression for the gradient of the joining line, then place the simplest-form instruction on a separate line.",
    "The gradient quotient must create a factorable numerator and a denominator sharing exactly one non-trivial factor.",
    "Keep the final gradient exact and linear in the parameter.",
    "Exclude parameter values that make the two x-coordinates equal.",
    "Do not generate a free-standing factorisation prompt; coordinate geometry is the ownership invariant.",
    "Keep the family rare in generic selection because it accounts for one of twelve reviewed G1 appearances.",
  ],
} as const;

export const G1_CALIBRATION_DECISIONS = [
  "Generic G1 selection should use reviewed occurrence counts as its starting prior rather than developer-interest weights.",
  "The common three-mark line family retains a source-centred lower band and gains a smaller higher band through simple exact fractional gradients rather than ugly arithmetic.",
  "Visual economy is part of the question architecture: coordinate and deterministic-context diagrams are sparse schematics, while only essential graph-read best-fit tasks receive a scaled grid.",
  "Best-fit model construction is valid G1 evidence, but full composite generation must preserve the recorded 3 G1 + 1 S2 ownership split.",
  "Negative line directions should appear at corpus-informed frequencies and only in contexts where the direction makes sense.",
  "Difficulty is separate from C/A Standard. Representation, exact fractional structure and graph-reading burden control the within-skill difficulty band.",
  "Generated answer schemes must preserve contextual-variable requirements and should not randomise source-year-specific marking regimes.",
] as const;
