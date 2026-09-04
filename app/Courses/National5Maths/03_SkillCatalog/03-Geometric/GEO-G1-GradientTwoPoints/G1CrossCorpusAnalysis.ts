import type { ConsistencyClassification } from "../../../02_AnswerCatalog/AnswerCatalogTypes";
import type { CatalogMarkStandard, CatalogMarkThinking } from "../../../CatalogCoreTypes";

export const G1_SKILL_ID = "geo-g01-gradient-two-points" as const;
export const G1_CONCEPT_ID = "geo-g1-1" as const;
export const G1_EMBEDDED_S2_SKILL_ID = "stat-s02-linear-model" as const;
export const G1_EMBEDDED_S2_CONCEPT_ID = "stat-s2-1" as const;

export type G1CorpusFamily =
  | "LINE_EQUATION_FROM_TWO_POINTS"
  | "CONTEXTUAL_LINEAR_MODEL"
  | "BEST_FIT_LINEAR_MODEL"
  | "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";

export type G1SurfaceStyleId =
  | "DIRECT_COORDINATES_LINE_EQUATION"
  | "COORDINATE_DIAGRAM_LINE_EQUATION"
  | "CONTEXT_LINE_GRAPH_LABELLED_POINTS"
  | "BEST_FIT_LABELLED_POINTS_CONTEXT"
  | "BEST_FIT_GRID_READ_POINTS"
  | "SYMBOLIC_COORDINATE_GRADIENT";

export type G1FollowUpOwnership = "NONE" | "G1" | "S2";
export type G1VisualDemand = "NONE" | "SUPPORTIVE" | "ESSENTIAL";
export type G1GeneratorReadiness = "CORE" | "SUPPORTED" | "EXPERIMENTAL" | "COMPOSITE_DEFERRED";

export type G1CorpusEntrySummary = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: "P1" | "P2";
  questionNumber: string;
  catalogFamilyId: string;
  family: G1CorpusFamily;
  surfaceStyleId: G1SurfaceStyleId;
  totalMarks: 3 | 4;
  g1Marks: 3 | 4;
  embeddedS2Marks: 0 | 1;
  g1Standard: CatalogMarkStandard;
  g1Thinking: CatalogMarkThinking;
  followUpOwnership: G1FollowUpOwnership;
  visualDemand: G1VisualDemand;
  candidateReadsPrimaryCoordinatesFromVisual: boolean;
  primaryAnswerForm: "EQUATION" | "EXPRESSION";
  expectedPrimaryAnswer: string;
  sourceSpecificNotes: readonly string[];
};

/**
 * Reviewed G1 corpus summary.
 *
 * The G1 classification is mark-level rather than question-level for composite
 * best-fit questions: their first three marks are G1 C/Operational and the
 * one-mark follow-up is S2 C/Reasoning.
 */
export const G1_CORPUS_ENTRIES: readonly G1CorpusEntrySummary[] = [
  { sourceQuestionId: "N5_MATH_2014_P1_Q6", sourceAnswerId: "N5_MATH_2014_P1_Q6_MS", year: 2014, paper: "P1", questionNumber: "6", catalogFamilyId: "GEO_G1_BEST_FIT_LINEAR_MODEL", family: "BEST_FIT_LINEAR_MODEL", surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT", totalMarks: 4, g1Marks: 3, embeddedS2Marks: 1, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "S2", visualDemand: "SUPPORTIVE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "C = 15F + 125", sourceSpecificNotes: ["Two named points on the supplied best-fit line are stated explicitly, so the scattergraph is not needed to recover the gradient coordinates.", "The three G1 marks form the model; the one-mark estimate is an embedded S2 Reasoning mark."] },
  { sourceQuestionId: "N5_MATH_2015_P1_Q8", sourceAnswerId: "N5_MATH_2015_P1_Q8_MS", year: 2015, paper: "P1", questionNumber: "8", catalogFamilyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS", family: "LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION", totalMarks: 3, g1Marks: 3, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "NONE", visualDemand: "NONE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "y = 2x + 9", sourceSpecificNotes: ["Two coordinate pairs are supplied directly in text.", "The source requires the line equation in simplest form."] },
  { sourceQuestionId: "N5_MATH_2016_P1_Q5", sourceAnswerId: "N5_MATH_2016_P1_Q5_MS", year: 2016, paper: "P1", questionNumber: "5", catalogFamilyId: "GEO_G1_BEST_FIT_LINEAR_MODEL", family: "BEST_FIT_LINEAR_MODEL", surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT", totalMarks: 4, g1Marks: 3, embeddedS2Marks: 1, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "S2", visualDemand: "SUPPORTIVE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "W = 20A + 40", sourceSpecificNotes: ["The two named best-fit-line observations are stated explicitly.", "The follow-up estimate is S2-owned even though it is packaged under the same historical question."] },
  { sourceQuestionId: "N5_MATH_2017_P1_Q6", sourceAnswerId: "N5_MATH_2017_P1_Q6_MS", year: 2017, paper: "P1", questionNumber: "6", catalogFamilyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS", family: "LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION", totalMarks: 3, g1Marks: 3, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "NONE", visualDemand: "ESSENTIAL", candidateReadsPrimaryCoordinatesFromVisual: true, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "y = -2x + 4", sourceSpecificNotes: ["The coordinate diagram supplies the point coordinates; they are not duplicated as prose givens.", "Consistent coordinate-subtraction order is a source-backed gradient requirement."] },
  { sourceQuestionId: "N5_MATH_2018_P1_Q7", sourceAnswerId: "N5_MATH_2018_P1_Q7_MS", year: 2018, paper: "P1", questionNumber: "7", catalogFamilyId: "GEO_G1_CONTEXTUAL_LINEAR_MODEL", family: "CONTEXTUAL_LINEAR_MODEL", surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS", totalMarks: 4, g1Marks: 4, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "G1", visualDemand: "SUPPORTIVE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "P = (3/2)d + 2", sourceSpecificNotes: ["The graph represents a deterministic linear relationship rather than a statistical best-fit relationship.", "The one-mark follow-up calculation remains G1 because it applies the geometrically constructed deterministic model.", "The fractional gradient and two-decimal monetary presentation are genuine historical texture."] },
  { sourceQuestionId: "N5_MATH_2019_P1_Q6", sourceAnswerId: "N5_MATH_2019_P1_Q6_MS", year: 2019, paper: "P1", questionNumber: "6", catalogFamilyId: "GEO_G1_BEST_FIT_LINEAR_MODEL", family: "BEST_FIT_LINEAR_MODEL", surfaceStyleId: "BEST_FIT_GRID_READ_POINTS", totalMarks: 4, g1Marks: 3, embeddedS2Marks: 1, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "S2", visualDemand: "ESSENTIAL", candidateReadsPrimaryCoordinatesFromVisual: true, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "F = -3E + 18.5", sourceSpecificNotes: ["The candidate must obtain the designated usable points from the scaled best-fit graph.", "The one-mark contextual estimate is S2-owned."] },
  { sourceQuestionId: "N5_MATH_2019_P2_Q13", sourceAnswerId: "N5_MATH_2019_P2_Q13_MS", year: 2019, paper: "P2", questionNumber: "13", catalogFamilyId: "GEO_G1_SYMBOLIC_GRADIENT_FROM_TWO_POINTS", family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS", surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT", totalMarks: 3, g1Marks: 3, embeddedS2Marks: 0, g1Standard: "A", g1Thinking: "OPERATIONAL", followUpOwnership: "NONE", visualDemand: "NONE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EXPRESSION", expectedPrimaryAnswer: "p + 3/2", sourceSpecificNotes: ["The task begins from geometric coordinate data and therefore remains G1 despite requiring factorisation and algebraic cancellation.", "The three marks cover gradient substitution, difference-of-squares factorisation, then denominator factorisation/cancellation.", "The final gradient may be written as p + 3/2 or an equivalent simplified exact form."] },
  { sourceQuestionId: "N5_MATH_2021_P1_Q10", sourceAnswerId: "N5_MATH_2021_P1_Q10_MS", year: 2021, paper: "P1", questionNumber: "10", catalogFamilyId: "GEO_G1_CONTEXTUAL_LINEAR_MODEL", family: "CONTEXTUAL_LINEAR_MODEL", surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS", totalMarks: 4, g1Marks: 4, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "G1", visualDemand: "SUPPORTIVE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "W = (1/20)S + 150", sourceSpecificNotes: ["Large coordinate values disguise a simple exact fractional gradient.", "The deterministic follow-up calculation remains G1-owned."] },
  { sourceQuestionId: "N5_MATH_2022_P1_Q6", sourceAnswerId: "N5_MATH_2022_P1_Q6_MS", year: 2022, paper: "P1", questionNumber: "6", catalogFamilyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS", family: "LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION", totalMarks: 3, g1Marks: 3, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "NONE", visualDemand: "NONE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "y = -4x - 13", sourceSpecificNotes: ["Both supplied points contain negative coordinates.", "The source explicitly requires working for the three-mark line construction."] },
  { sourceQuestionId: "N5_MATH_2023_P1_Q7", sourceAnswerId: "N5_MATH_2023_P1_Q7_MS", year: 2023, paper: "P1", questionNumber: "7", catalogFamilyId: "GEO_G1_BEST_FIT_LINEAR_MODEL", family: "BEST_FIT_LINEAR_MODEL", surfaceStyleId: "BEST_FIT_GRID_READ_POINTS", totalMarks: 4, g1Marks: 3, embeddedS2Marks: 1, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "S2", visualDemand: "ESSENTIAL", candidateReadsPrimaryCoordinatesFromVisual: true, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "P = 1500T + 12500", sourceSpecificNotes: ["The scaled scattergraph contains a source-authorised set of line points; two must be selected/read correctly for the gradient mark.", "Large y-values are presentation texture rather than a reason to inflate arithmetic difficulty.", "The follow-up estimate is S2-owned."] },
  { sourceQuestionId: "N5_MATH_2024_P1_Q9", sourceAnswerId: "N5_MATH_2024_P1_Q9_MS", year: 2024, paper: "P1", questionNumber: "9", catalogFamilyId: "GEO_G1_BEST_FIT_LINEAR_MODEL", family: "BEST_FIT_LINEAR_MODEL", surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT", totalMarks: 4, g1Marks: 3, embeddedS2Marks: 1, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "S2", visualDemand: "SUPPORTIVE", candidateReadsPrimaryCoordinatesFromVisual: false, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "D = -2T + 32", sourceSpecificNotes: ["The best-fit-line coordinates are stated explicitly and produce a negative gradient.", "The one-mark estimate is S2-owned and has a question-specific follow-through gate."] },
  { sourceQuestionId: "N5_MATH_2025_P1_Q6", sourceAnswerId: "N5_MATH_2025_P1_Q6_MS", year: 2025, paper: "P1", questionNumber: "6", catalogFamilyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS", family: "LINE_EQUATION_FROM_TWO_POINTS", surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION", totalMarks: 3, g1Marks: 3, embeddedS2Marks: 0, g1Standard: "C", g1Thinking: "OPERATIONAL", followUpOwnership: "NONE", visualDemand: "ESSENTIAL", candidateReadsPrimaryCoordinatesFromVisual: true, primaryAnswerForm: "EQUATION", expectedPrimaryAnswer: "y = -2x + 14", sourceSpecificNotes: ["The coordinate diagram is essential to recover the point data.", "The source requires working for the three-mark line construction."] },
] as const;

export type G1FamilyComparison = {
  family: G1CorpusFamily;
  entryIds: readonly string[];
  classification: ConsistencyClassification;
  observedPattern: string;
  stableFeatures: readonly string[];
  variableFeatures: readonly string[];
  generatorDecision: string;
};

export const G1_FAMILY_COMPARISONS: readonly G1FamilyComparison[] = [
  {
    family: "LINE_EQUATION_FROM_TWO_POINTS",
    entryIds: G1_CORPUS_ENTRIES.filter((entry) => entry.family === "LINE_EQUATION_FROM_TWO_POINTS").map((entry) => entry.sourceAnswerId),
    classification: "POLICY_REGIME_VARIATION",
    observedPattern: "Four reviewed questions use the same three-mark G1 route: determine the gradient from two points, use one point to position the line, then state the simplified equation. The surface alternates between direct prose coordinates and an essential coordinate diagram, while answer-without-working treatment changes across years.",
    stableFeatures: ["three G1 marks", "C-standard", "Operational", "two non-vertical points determine the line", "gradient is the first mark-bearing stage", "substitution/line-position work is the second mark-bearing stage", "simplified line equation is the third mark-bearing stage", "source permits slope-intercept and/or point-slope routes"],
    variableFeatures: ["direct text coordinates versus coordinate diagram", "positive versus negative coordinates", "positive versus negative gradient", "answer-without-working policy", "question-specific coordinate-order and follow-through notes"],
    generatorDecision: "Treat this as the core standalone G1 family. Preserve the three independently mark-bearing stages, generate original point pairs with a non-zero non-vertical gradient, and support both direct-coordinate and coordinate-diagram surfaces.",
  },
  {
    family: "CONTEXTUAL_LINEAR_MODEL",
    entryIds: G1_CORPUS_ENTRIES.filter((entry) => entry.family === "CONTEXTUAL_LINEAR_MODEL").map((entry) => entry.sourceAnswerId),
    classification: "CONTEXT_CONDITIONED",
    observedPattern: "Two reviewed deterministic contextual graph questions use three marks to construct a straight-line model from explicit point values and a fourth G1 mark to calculate a new contextual value. Both use exact fractional gradients and keep the graph supportive rather than essential for coordinate recovery.",
    stableFeatures: ["four G1 marks", "C-standard", "Operational", "deterministic linear relationship rather than statistical best fit", "two explicit line points", "three-mark model construction followed by one-mark model application", "context-variable notation"],
    variableFeatures: ["context domain and units", "coordinate scale", "fractional gradient denominator", "precision/presentation rule for the follow-up", "answer-without-working policy"],
    generatorDecision: "Support as a distinct G1 family. Keep the fourth mark G1-owned only when the relationship is deterministic and the follow-up is a direct calculation from the constructed geometric line model.",
  },
  {
    family: "BEST_FIT_LINEAR_MODEL",
    entryIds: G1_CORPUS_ENTRIES.filter((entry) => entry.family === "BEST_FIT_LINEAR_MODEL").map((entry) => entry.sourceAnswerId),
    classification: "CONTEXT_CONDITIONED",
    observedPattern: "Five reviewed questions place a three-mark G1 straight-line model inside a scattergraph/best-fit context, then add one S2 Reasoning mark for using that fitted model to estimate a contextual value. Some sources state usable line points explicitly; others require exact point selection/reading from a scaled graph.",
    stableFeatures: ["three G1 C-standard Operational marks construct the line model", "one S2 C-standard Reasoning mark follows", "a best-fit line is supplied rather than drawn by the candidate", "the G1 mark progression remains gradient, line position/intercept, simplified contextual equation", "the one-mark follow-up must retain S2 ownership"],
    variableFeatures: ["labelled/prose points versus graph-read points", "supportive versus essential visual dependency", "positive versus negative gradient", "coordinate magnitude and axis scale", "interpolation versus extrapolation", "follow-through eligibility for the S2 mark"],
    generatorDecision: "Treat the three-mark G1 model construction as supported evidence, but keep the full four-mark composite wrapper deferred until the S2 generation layer is deliberately implemented. G1 generation must never silently absorb the S2 mark.",
  },
  {
    family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    entryIds: G1_CORPUS_ENTRIES.filter((entry) => entry.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS").map((entry) => entry.sourceAnswerId),
    classification: "INSUFFICIENT_EVIDENCE",
    observedPattern: "One reviewed question begins with two coordinate points, one parameterised, then requires a three-mark gradient simplification through substitution, difference-of-squares factorisation and common-factor cancellation.",
    stableFeatures: ["three G1 marks", "A-standard", "Operational", "geometric coordinate origin", "symbolic two-point gradient quotient", "factorisation and cancellation are subordinate algebra inside the G1 route", "simplest exact gradient expression required"],
    variableFeatures: ["Only one historical source currently fixes this family.", "No second source establishes a wider range of parameterised coordinate architectures.", "Only Paper 2 placement is historically evidenced in the reviewed corpus."],
    generatorDecision: "Keep this family experimental and narrow. Generated variants must begin from genuine coordinate geometry and must construct a cancellable gradient quotient without drifting into a free-standing algebraic factorisation exercise.",
  },
] as const;

export const G1_GENERATOR_SCOPE = [
  { family: "LINE_EQUATION_FROM_TWO_POINTS" as const, readiness: "CORE" as G1GeneratorReadiness, evidenceCount: 4, supportedPapers: ["P1"] as const, marks: 3 as const, standard: "C" as const, thinking: "OPERATIONAL" as const },
  { family: "CONTEXTUAL_LINEAR_MODEL" as const, readiness: "SUPPORTED" as G1GeneratorReadiness, evidenceCount: 2, supportedPapers: ["P1"] as const, marks: 4 as const, standard: "C" as const, thinking: "OPERATIONAL" as const },
  { family: "BEST_FIT_LINEAR_MODEL" as const, readiness: "COMPOSITE_DEFERRED" as G1GeneratorReadiness, evidenceCount: 5, supportedPapers: ["P1"] as const, marks: 4 as const, standard: "C" as const, thinking: "MIXED" as const },
  { family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS" as const, readiness: "EXPERIMENTAL" as G1GeneratorReadiness, evidenceCount: 1, supportedPapers: ["P2"] as const, marks: 3 as const, standard: "A" as const, thinking: "OPERATIONAL" as const },
] as const;

export const G1_CROSS_CORPUS_GENERATION_INVARIANTS = [
  "G1 ownership follows geometric origin. Algebraic manipulation used after coordinate-gradient setup does not move the question into an algebra Skill.",
  "Every generated numeric line question must use two distinct x-coordinates so the gradient is defined and the line is non-vertical.",
  "Standalone line-equation generation preserves three independently mark-bearing G1 stages: gradient, line position/intercept, and simplified final equation.",
  "Generated line equations should normally have a non-zero gradient and non-zero intercept so the three-mark route is not accidentally trivialised.",
  "A coordinate-diagram surface must place points exactly on the generated line and make coordinate reading unambiguous.",
  "A scaled best-fit surface must provide internally exact, readable line points consistent with the displayed axes; source coordinates and source artwork are never reused.",
  "Best-fit questions retain a 3 G1 + 1 S2 mark split. The S2 follow-up must not be reclassified as G1 simply because it shares the same question wrapper.",
  "Deterministic contextual line questions may keep the fourth follow-up mark in G1 when it is a direct calculation from the geometrically constructed model rather than a statistical estimate.",
  "The symbolic family must begin from coordinate data and use the two-point gradient definition before any factorisation or cancellation.",
  "Question generation and answer generation must consume the same generated coordinate/model state so points, gradient, intercept, final equation and mark pathway cannot drift apart.",
  "Historical wording, artwork, coordinates and exact layout are reference evidence only and are never generation templates.",
] as const;
