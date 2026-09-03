import type { A8CorpusSurfaceFamily } from "./A8CrossCorpusAnalysis";

export type A8CalibrationPaper = "P1" | "P2";
export type A8CalibrationDifficultyLevel = 1 | 2 | 3;
export type A8CalibrationDifficultyBandId =
  | "LOWER_VALID"
  | "TYPICAL"
  | "UPPER_VALID";

export type A8ArithmeticTexture =
  | "SMALL_INTEGER"
  | "HALF_INTEGER"
  | "ONE_DECIMAL"
  | "CURRENCY_HUNDREDTHS"
  | "ROUND_LARGE_INTEGER";

export type A8HistoricalRouteFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: A8CalibrationPaper;
  family: A8CorpusSurfaceFamily;
  equations: [[number, number, number], [number, number, number]];
  solution: [number, number];
  preferredEliminationVariable: "FIRST" | "SECOND";
  preferredMultipliers: [number, number];
  preferredScaledConstants: [number, number];
  eliminationResultCoefficient: number;
  eliminationResultConstant: number;
  arithmeticTexture: A8ArithmeticTexture;
  modellingStages: number;
  representationStages: number;
  postSolveStages: number;
  difficultySignals: string[];
};

/**
 * Derived A8 calibration dataset.
 *
 * This is not a replacement for the historical Question/Answer catalogue.
 * Every row below is a normalised comparison fingerprint derived from the
 * already-catalogued source questions and matching marking schemes. It exists
 * only so generation can reason about frequency, arithmetic burden and relative
 * difficulty without rewriting historical evidence.
 */
export const A8_HISTORICAL_ROUTE_FINGERPRINTS: A8HistoricalRouteFingerprint[] = [
  {
    sourceQuestionId: "N5_MATH_2014_P2_Q3",
    sourceAnswerId: "N5_MATH_2014_P2_Q3_MS",
    year: 2014,
    paper: "P2",
    family: "CONTEXT_FORM_AND_SOLVE",
    equations: [[5, 3, 158.25], [3, 2, 98]],
    solution: [22.5, 15.25],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [2, 3],
    preferredScaledConstants: [316.5, 294],
    eliminationResultCoefficient: 1,
    eliminationResultConstant: 22.5,
    arithmeticTexture: "CURRENCY_HUNDREDTHS",
    modellingStages: 2,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "Two contextual statements must be converted into equations before solving.",
      "Calculator-paper money arithmetic is present, but the elimination route remains compact.",
      "Final communication has context and currency presentation requirements.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2015_P1_Q11",
    sourceAnswerId: "N5_MATH_2015_P1_Q11_MS",
    year: 2015,
    paper: "P1",
    family: "ABSTRACT_SOLVE",
    equations: [[3, 2, 17], [2, 5, 4]],
    solution: [7, -2],
    preferredEliminationVariable: "FIRST",
    preferredMultipliers: [2, 3],
    preferredScaledConstants: [34, 12],
    eliminationResultCoefficient: 11,
    eliminationResultConstant: 22,
    arithmeticTexture: "SMALL_INTEGER",
    modellingStages: 0,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "Both equations require scaling in the clean elimination route.",
      "Integer arithmetic stays compact enough for written non-calculator work.",
      "The solution pair has opposite signs.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2016_P1_Q4",
    sourceAnswerId: "N5_MATH_2016_P1_Q4_MS",
    year: 2016,
    paper: "P1",
    family: "CONTEXT_FORM_AND_SOLVE",
    equations: [[2, 3, 9.6], [3, 4, 13.3]],
    solution: [1.5, 2.2],
    preferredEliminationVariable: "FIRST",
    preferredMultipliers: [3, 2],
    preferredScaledConstants: [28.8, 26.6],
    eliminationResultCoefficient: 1,
    eliminationResultConstant: 2.2,
    arithmeticTexture: "ONE_DECIMAL",
    modellingStages: 2,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "Context translation adds two equation-construction stages.",
      "Paper 1 includes deliberately friendly one-decimal arithmetic rather than calculator-dependent decimals.",
      "The preferred elimination route uses multipliers 3 and 2 and collapses to a unit coefficient.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2017_P1_Q13",
    sourceAnswerId: "N5_MATH_2017_P1_Q13_MS",
    year: 2017,
    paper: "P1",
    family: "GRAPH_INTERSECTION_SOLVE",
    equations: [[3, -1, 2], [1, 3, 19]],
    solution: [2.5, 5.5],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [3, 1],
    preferredScaledConstants: [6, 19],
    eliminationResultCoefficient: 10,
    eliminationResultConstant: 25,
    arithmeticTexture: "HALF_INTEGER",
    modellingStages: 0,
    representationStages: 1,
    postSolveStages: 0,
    difficultySignals: [
      "A supporting straight-line representation is present while algebra remains the assessed method.",
      "One equation can remain unscaled in the clean route.",
      "The common solution uses half-integer coordinates.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2018_P1_Q3",
    sourceAnswerId: "N5_MATH_2018_P1_Q3_MS",
    year: 2018,
    paper: "P1",
    family: "ABSTRACT_SOLVE",
    equations: [[4, 5, -3], [6, -2, 5]],
    solution: [0.5, -1],
    preferredEliminationVariable: "FIRST",
    preferredMultipliers: [3, 2],
    preferredScaledConstants: [-9, 10],
    eliminationResultCoefficient: 19,
    eliminationResultConstant: -19,
    arithmeticTexture: "HALF_INTEGER",
    modellingStages: 0,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "A negative coefficient increases sign-management demand.",
      "The clean route still uses the recurring 3-and-2 scaling pattern.",
      "The final solution includes a half-integer rather than two integers.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P1_Q8",
    sourceAnswerId: "N5_MATH_2019_P1_Q8_MS",
    year: 2019,
    paper: "P1",
    family: "CONTEXT_FORM_AND_SOLVE",
    equations: [[7, 3, 215], [5, 4, 200]],
    solution: [20, 25],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [4, 3],
    preferredScaledConstants: [860, 600],
    eliminationResultCoefficient: 13,
    eliminationResultConstant: 260,
    arithmeticTexture: "ROUND_LARGE_INTEGER",
    modellingStages: 2,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "The numerical magnitudes are large but intentionally round and hand-calculable.",
      "The preferred route uses 4-and-3 scaling rather than introducing awkward calculator arithmetic.",
      "Context translation and final unit communication remain part of the task.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2021_P1_Q7",
    sourceAnswerId: "N5_MATH_2021_P1_Q7_MS",
    year: 2021,
    paper: "P1",
    family: "ABSTRACT_SOLVE",
    equations: [[5, 2, 4], [4, -3, 17]],
    solution: [2, -3],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [3, 2],
    preferredScaledConstants: [12, 34],
    eliminationResultCoefficient: 23,
    eliminationResultConstant: 46,
    arithmeticTexture: "SMALL_INTEGER",
    modellingStages: 0,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "A negative coefficient creates sign handling without leaving the written-arithmetic envelope.",
      "The preferred route uses multipliers 3 and 2.",
      "Both final values are integers with opposite signs.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2022_P2_Q4",
    sourceAnswerId: "N5_MATH_2022_P2_Q4_MS",
    year: 2022,
    paper: "P2",
    family: "CONTEXT_FORM_AND_SOLVE",
    equations: [[4, 3, 4.25], [5, 2, 4.7]],
    solution: [0.8, 0.35],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [2, 3],
    preferredScaledConstants: [8.5, 14.1],
    eliminationResultCoefficient: 7,
    eliminationResultConstant: 5.6,
    arithmeticTexture: "CURRENCY_HUNDREDTHS",
    modellingStages: 2,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "Two contextual equations precede the algebraic solve.",
      "Calculator-paper currency values extend to hundredths while retaining exact outcomes.",
      "The preferred elimination route is still compact, using 2-and-3 scaling.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2023_P1_Q3",
    sourceAnswerId: "N5_MATH_2023_P1_Q3_MS",
    year: 2023,
    paper: "P1",
    family: "ABSTRACT_SOLVE",
    equations: [[2, 3, 8], [5, 2, -2]],
    solution: [-2, 4],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [2, 3],
    preferredScaledConstants: [16, -6],
    eliminationResultCoefficient: 11,
    eliminationResultConstant: 22,
    arithmeticTexture: "SMALL_INTEGER",
    modellingStages: 0,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "A negative constant introduces sign handling while coefficients remain small.",
      "The clean route again uses 2-and-3 scaling.",
      "Both final values are integers with opposite signs.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2024_P1_Q7",
    sourceAnswerId: "N5_MATH_2024_P1_Q7_MS",
    year: 2024,
    paper: "P1",
    family: "ABSTRACT_SOLVE",
    equations: [[2, -7, 11], [3, 2, 4]],
    solution: [2, -1],
    preferredEliminationVariable: "FIRST",
    preferredMultipliers: [3, 2],
    preferredScaledConstants: [33, 8],
    eliminationResultCoefficient: 25,
    eliminationResultConstant: 25,
    arithmeticTexture: "SMALL_INTEGER",
    modellingStages: 0,
    representationStages: 0,
    postSolveStages: 0,
    difficultySignals: [
      "A larger coefficient and negative term create a modest increase in sign and multiplication burden.",
      "The clean route retains 3-and-2 scaling.",
      "The final values remain small integers with opposite signs.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P2_Q10",
    sourceAnswerId: "N5_MATH_2025_P2_Q10_MS",
    year: 2025,
    paper: "P2",
    family: "CONTEXT_DERIVED_TOTAL",
    equations: [[7, 3, 2400], [3, 4, 1300]],
    solution: [300, 100],
    preferredEliminationVariable: "SECOND",
    preferredMultipliers: [4, 3],
    preferredScaledConstants: [9600, 3900],
    eliminationResultCoefficient: 19,
    eliminationResultConstant: 5700,
    arithmeticTexture: "ROUND_LARGE_INTEGER",
    modellingStages: 2,
    representationStages: 0,
    postSolveStages: 1,
    difficultySignals: [
      "The two equations are an intermediate model rather than the final target.",
      "Large values remain deliberately round and exact.",
      "A further linear-combination calculation is required after solving the system.",
    ],
  },
];

export type A8FamilyFrequencyCell = {
  family: A8CorpusSurfaceFamily;
  count: number;
  total: number;
  proportion: number;
};

const frequencyCell = (
  family: A8CorpusSurfaceFamily,
  count: number,
  total: number,
): A8FamilyFrequencyCell => ({
  family,
  count,
  total,
  proportion: count / total,
});

/**
 * Empirical family frequencies from the complete supplied A8 corpus.
 *
 * Generation should use the paper-conditioned profile where the target paper
 * is already known. The overall profile is useful for corpus-wide simulation
 * and diagnostics. These are observed frequencies, not claims about future SQA
 * policy.
 */
export const A8_EMPIRICAL_FAMILY_FREQUENCY = {
  overall: [
    frequencyCell("ABSTRACT_SOLVE", 5, 11),
    frequencyCell("CONTEXT_FORM_AND_SOLVE", 4, 11),
    frequencyCell("GRAPH_INTERSECTION_SOLVE", 1, 11),
    frequencyCell("CONTEXT_DERIVED_TOTAL", 1, 11),
  ],
  P1: [
    frequencyCell("ABSTRACT_SOLVE", 5, 8),
    frequencyCell("CONTEXT_FORM_AND_SOLVE", 2, 8),
    frequencyCell("GRAPH_INTERSECTION_SOLVE", 1, 8),
    frequencyCell("CONTEXT_DERIVED_TOTAL", 0, 8),
  ],
  P2: [
    frequencyCell("ABSTRACT_SOLVE", 0, 3),
    frequencyCell("CONTEXT_FORM_AND_SOLVE", 2, 3),
    frequencyCell("GRAPH_INTERSECTION_SOLVE", 0, 3),
    frequencyCell("CONTEXT_DERIVED_TOTAL", 1, 3),
  ],
  broadSurface: {
    abstract: { count: 5, total: 11, proportion: 5 / 11 },
    contextualIncludingDerived: { count: 5, total: 11, proportion: 5 / 11 },
    graphIntegrated: { count: 1, total: 11, proportion: 1 / 11 },
  },
  generationPolicy: [
    "Default family sampling should converge to the paper-conditioned historical proportions rather than use a uniform family draw.",
    "A deterministic weighted cycle or shuffled weighted bag is preferred to independent Bernoulli draws because it preserves long-run frequency without producing implausible streaks in small teacher-facing batches.",
    "Explicit teacher family selection may override the empirical prior.",
    "Single-source graph and derived-total families remain lower-confidence for surface generation even though their observed frequency must still be represented in a full A8 distribution.",
  ],
} as const;

export type A8DifficultyBandCalibration = {
  level: A8CalibrationDifficultyLevel;
  id: A8CalibrationDifficultyBandId;
  label: string;
  description: string;
  sourceAnchors: string[];
  arithmeticCharacteristics: string[];
  structuralCharacteristics: string[];
  doNotUseToIncreaseDifficulty: string[];
};

/**
 * A8 supports three defensible difficulty controls.
 *
 * The corpus does not justify five distinct bands. Three bands are enough to
 * separate lower, central and upper burden while preserving the same assessed
 * skill. These are generator calibration bands, not historical SQA labels.
 */
export const A8_DIFFICULTY_BANDS: A8DifficultyBandCalibration[] = [
  {
    level: 1,
    id: "LOWER_VALID",
    label: "Lower valid",
    description: "An easier realisation of the same A8 process, still fully inside the historical National 5 envelope.",
    sourceAnchors: [
      "N5_MATH_2015_P1_Q11",
      "N5_MATH_2023_P1_Q3",
    ],
    arithmeticCharacteristics: [
      "Prefer the recurring 2-and-3 or 3-and-2 elimination scaling pattern.",
      "Prefer small integer abstract solutions and compact written arithmetic.",
      "For contextual questions, use the friendliest end of an already-supported number texture rather than removing the modelling steps.",
    ],
    structuralCharacteristics: [
      "Do not remove equation formation from contextual families.",
      "Do not replace algebraic solving with inspection, guess-and-check or a coefficient-1 shortcut in abstract families.",
    ],
    doNotUseToIncreaseDifficulty: [
      "additional algebraic stages not seen in the corpus",
      "unfriendly fractions",
      "calculator-dependent Paper 1 arithmetic",
    ],
  },
  {
    level: 2,
    id: "TYPICAL",
    label: "Typical",
    description: "The central historical A8 burden: normal scaling, sign management and family-specific modelling without artificial extension.",
    sourceAnchors: [
      "N5_MATH_2014_P2_Q3",
      "N5_MATH_2016_P1_Q4",
      "N5_MATH_2019_P1_Q8",
      "N5_MATH_2021_P1_Q7",
      "N5_MATH_2024_P1_Q7",
    ],
    arithmeticCharacteristics: [
      "Use the historically dominant scaling sizes: maximum preferred multiplier 3 for abstract work, with 4 permitted in contextual whole-number structures when the arithmetic remains friendly.",
      "Allow sign handling, one-decimal Paper 1 context arithmetic, or calculator-paper money arithmetic when the family supports it.",
      "Keep outcomes exact and intentionally constructed.",
    ],
    structuralCharacteristics: [
      "Preserve the normal family structure: three-mark abstract solve or 1+1+4 contextual scaffold.",
      "Difficulty comes from arithmetic and representation burden, not from adding new curriculum content.",
    ],
    doNotUseToIncreaseDifficulty: [
      "larger numbers solely for appearance",
      "arbitrary decimal constants",
      "extra sub-parts without historical family evidence",
    ],
  },
  {
    level: 3,
    id: "UPPER_VALID",
    label: "Upper valid",
    description: "The upper edge of observed A8 demand while still looking like a valid National 5 question rather than a new harder skill.",
    sourceAnchors: [
      "N5_MATH_2017_P1_Q13",
      "N5_MATH_2018_P1_Q3",
      "N5_MATH_2022_P2_Q4",
      "N5_MATH_2025_P2_Q10",
    ],
    arithmeticCharacteristics: [
      "Allow the upper observed number texture: half-integer abstract outcomes, controlled negative-term handling, calculator-paper hundredths, or large round exact values.",
      "Paper 1 must still pass a complete written-route check; upper difficulty may not introduce calculator dependence.",
      "Scaling burden should remain close to observed A8 routes rather than grow without evidence.",
    ],
    structuralCharacteristics: [
      "Graph integration or a supported derived-total stage can contribute additional demand.",
      "Within an ordinary abstract/context family, increase burden by number texture and route complexity, not by inventing an extra mathematical process.",
    ],
    doNotUseToIncreaseDifficulty: [
      "recurring decimals or awkward fractions",
      "large non-round Paper 1 products",
      "new representations or post-solve tasks outside the family evidence",
    ],
  },
];

export const A8_SUPPORTED_DIFFICULTY_LEVELS: A8CalibrationDifficultyLevel[] = [1, 2, 3];
export const A8_DEFAULT_DIFFICULTY_LEVEL: A8CalibrationDifficultyLevel = 2;

/**
 * Family-specific support for the three-band control.
 *
 * Core families have enough evidence to vary arithmetic burden across all
 * three bands. Single-source families should stay close to their historical
 * burden until more evidence exists; the builder can later disable unsupported
 * combinations rather than pretending every family has a five-step ladder.
 */
export const A8_DIFFICULTY_SUPPORT_BY_FAMILY: Record<
  A8CorpusSurfaceFamily,
  A8CalibrationDifficultyLevel[]
> = {
  ABSTRACT_SOLVE: [1, 2, 3],
  CONTEXT_FORM_AND_SOLVE: [1, 2, 3],
  GRAPH_INTERSECTION_SOLVE: [2, 3],
  CONTEXT_DERIVED_TOTAL: [3],
};

export const A8_PAPER_NUMERICAL_CALIBRATION = {
  P1: {
    abstract: {
      absoluteCoefficientRangeObserved: [2, 7] as const,
      absoluteConstantRangeObserved: [2, 17] as const,
      preferredMultiplierPairsObserved: [[2, 3], [3, 2]] as const,
      maximumPreferredMultiplierObserved: 3,
      preferredScaledConstantMaximumObserved: 34,
      integerSolutionCount: 4,
      halfIntegerSolutionCount: 1,
      oppositeSignSolutionCount: 5,
      sourceCount: 5,
      generationImplications: [
        "The cheapest legitimate abstract route should normally look like 2-and-3 scaling, not a large least-common-multiple exercise.",
        "Integer solutions are dominant; half-integers are an upper-band minority, not a default source of variation.",
        "Paper 1 validity must be decided from the full written route, not from coefficient size alone.",
      ],
    },
    contextual: {
      sourceCount: 2,
      preferredMultiplierPairsObserved: [[3, 2], [4, 3]] as const,
      arithmeticTexturesObserved: ["ONE_DECIMAL", "ROUND_LARGE_INTEGER"] as const,
      generationImplications: [
        "Small one-decimal totals can be valid when the elimination arithmetic is designed to stay simple.",
        "Large totals can also be valid when they are round and the scaled arithmetic remains hand-friendly.",
        "A raw magnitude ceiling is therefore weaker than a cheapest-route hand-calculation check.",
      ],
    },
    graph: {
      sourceCount: 1,
      coefficientOneObserved: true,
      arithmeticTextureObserved: "HALF_INTEGER" as const,
      generationImplications: [
        "The coefficient-1 prohibition used for abstract families must not be generalised to the graph family.",
        "Graph generation should stay near the single observed burden until more evidence is available.",
      ],
    },
  },
  P2: {
    contextual: {
      sourceCount: 2,
      preferredMultiplierPairsObserved: [[2, 3], [2, 3]] as const,
      arithmeticTextureObserved: "CURRENCY_HUNDREDTHS" as const,
      generationImplications: [
        "Calculator availability permits genuine money decimals, but the intended answers remain exact and contextually sensible.",
        "Calculator paper does not imply arbitrary numerical awkwardness; the elimination structure is still deliberately compact.",
      ],
    },
    derivedTotal: {
      sourceCount: 1,
      preferredMultiplierPairObserved: [4, 3] as const,
      arithmeticTextureObserved: "ROUND_LARGE_INTEGER" as const,
      generationImplications: [
        "Large values are supported when round and exact.",
        "The post-solve derived calculation is the distinctive additional demand; numerical ugliness is not needed to make this family harder.",
      ],
    },
  },
} as const;

/**
 * Mathematical source signatures used only to prevent accidental regeneration
 * of a historical question. Generator wording and source layout are never used
 * as templates.
 */
export const A8_HISTORICAL_SYSTEM_SIGNATURES = A8_HISTORICAL_ROUTE_FINGERPRINTS.map(
  (entry) => ({
    sourceQuestionId: entry.sourceQuestionId,
    paper: entry.paper,
    family: entry.family,
    equations: entry.equations,
    solution: entry.solution,
  }),
);

export const A8_CALIBRATION_DECISIONS = [
  "A8 uses three difficulty bands because the eleven-question corpus supports a meaningful lower/typical/upper separation but does not support five distinct burden levels without inventing differences.",
  "Difficulty is subordinate to validity: a harder Paper 1 instance must remain naturally solvable by written arithmetic and a harder Paper 2 instance must still use deliberately constructed exact outcomes.",
  "Family frequency and difficulty are separate controls. Default generation should reproduce the empirical family prior; teacher-selected difficulty should vary burden inside a family where evidence supports that variation.",
  "No historical question is treated as an official difficulty label. Source anchors identify the dimensions that define the calibration bands.",
  "Single-source graph and derived-total families are not given artificial full difficulty ladders.",
  "Future skills must run their own calibration pass and may legitimately expose a different number of difficulty levels.",
] as const;
