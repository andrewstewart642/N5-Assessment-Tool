import type { A7CorpusSurfaceFamily } from "./A7CrossCorpusAnalysis";

export type A7Rational = { numerator: number; denominator: number };

export type A7LinearEquationFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: "P1" | "P2";
  family: "FRACTIONAL_COEFFICIENT";
  lhsX: A7Rational;
  lhsConstant: A7Rational;
  rhsX: A7Rational;
  rhsConstant: A7Rational;
  denominatorLcm: number;
  clearedEquation: { lhsX: number; lhsConstant: number; rhsX: number; rhsConstant: number };
  rearrangedEquation: { xCoefficient: number; constant: number };
  solution: A7Rational;
  bracketAfterClearing: boolean;
  exactFractionRequiredBySource: boolean;
  alternativeMethodShown: boolean;
  difficultySignals: string[];
};

export type A7ContextAreaFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: "P1";
  family: "CONTEXT_AREA_EQUALITY";
  triangle: {
    fixedDimension: number;
    linearDimensionCoefficient: number;
    linearDimensionConstant: number;
    halfFactorRequired: true;
  };
  rectangle: {
    fixedDimension: number;
    linearDimensionCoefficient: number;
    linearDimensionConstant: number;
  };
  equationAfterEquating: string;
  preferredStartToSolve: string;
  rearrangedEquation: { xCoefficient: number; constant: number };
  solution: number;
  partMarks: [1, 4];
  difficultySignals: string[];
};

/**
 * Normalised mathematical fingerprints derived from the reviewed A7 corpus.
 * These are calibration data, not historical prompt/marking wording.
 */
export const A7_ABSTRACT_EQUATION_FINGERPRINTS: A7LinearEquationFingerprint[] = [
  {
    sourceQuestionId: "N5_MATH_2016_P1_Q8",
    sourceAnswerId: "N5_MATH_2016_P1_Q8_MS",
    year: 2016,
    paper: "P1",
    family: "FRACTIONAL_COEFFICIENT",
    lhsX: { numerator: 2, denominator: 3 },
    lhsConstant: { numerator: -5, denominator: 6 },
    rhsX: { numerator: 2, denominator: 1 },
    rhsConstant: { numerator: 0, denominator: 1 },
    denominatorLcm: 6,
    clearedEquation: { lhsX: 4, lhsConstant: -5, rhsX: 12, rhsConstant: 0 },
    rearrangedEquation: { xCoefficient: -8, constant: 5 },
    solution: { numerator: -5, denominator: 8 },
    bracketAfterClearing: false,
    exactFractionRequiredBySource: false,
    alternativeMethodShown: true,
    difficultySignals: [
      "Negative rational solution.",
      "A fractional constant and fractional x coefficient occur on the same side.",
      "LCM 6 keeps the denominator-clearing arithmetic compact for Paper 1.",
      "An alternative route can begin by rearranging the fractional x terms.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P1_Q14",
    sourceAnswerId: "N5_MATH_2019_P1_Q14_MS",
    year: 2019,
    paper: "P1",
    family: "FRACTIONAL_COEFFICIENT",
    lhsX: { numerator: 1, denominator: 2 },
    lhsConstant: { numerator: -1, denominator: 1 },
    rhsX: { numerator: -1, denominator: 5 },
    rhsConstant: { numerator: 3, denominator: 5 },
    denominatorLcm: 10,
    clearedEquation: { lhsX: 5, lhsConstant: -10, rhsX: -2, rhsConstant: 6 },
    rearrangedEquation: { xCoefficient: 7, constant: 16 },
    solution: { numerator: 16, denominator: 7 },
    bracketAfterClearing: false,
    exactFractionRequiredBySource: true,
    alternativeMethodShown: true,
    difficultySignals: [
      "x and constants appear on both sides of the equation.",
      "LCM 10 is the largest denominator-clearing multiplier in the reviewed abstract family.",
      "The final exact fraction is improper and a decimal approximation does not earn the final mark.",
      "An alternative route combines the algebra into one fraction before the final rearrangement.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P2_Q13",
    sourceAnswerId: "N5_MATH_2025_P2_Q13_MS",
    year: 2025,
    paper: "P2",
    family: "FRACTIONAL_COEFFICIENT",
    lhsX: { numerator: 5, denominator: 2 },
    lhsConstant: { numerator: 1, denominator: 2 },
    rhsX: { numerator: 4, denominator: 3 },
    rhsConstant: { numerator: 1, denominator: 1 },
    denominatorLcm: 6,
    clearedEquation: { lhsX: 15, lhsConstant: 3, rhsX: 8, rhsConstant: 6 },
    rearrangedEquation: { xCoefficient: 7, constant: 3 },
    solution: { numerator: 3, denominator: 7 },
    bracketAfterClearing: true,
    exactFractionRequiredBySource: true,
    alternativeMethodShown: false,
    difficultySignals: [
      "A binomial numerator creates a bracketed expression after denominator clearing.",
      "Both sides contain x and non-zero constants.",
      "The final exact fraction is proper and a decimal approximation does not earn the final mark.",
      "Although placed on Paper 2, the arithmetic remains deliberately exact and compact.",
    ],
  },
];

export const A7_CONTEXT_AREA_FINGERPRINTS: A7ContextAreaFingerprint[] = [
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q15",
    sourceAnswerId: "N5_MATH_2022_P1_Q15_MS",
    year: 2022,
    paper: "P1",
    family: "CONTEXT_AREA_EQUALITY",
    triangle: {
      fixedDimension: 3,
      linearDimensionCoefficient: 1,
      linearDimensionConstant: 12,
      halfFactorRequired: true,
    },
    rectangle: {
      fixedDimension: 6,
      linearDimensionCoefficient: -1,
      linearDimensionConstant: 8,
    },
    equationAfterEquating: "(3/2)(x+12)=6(8-x)",
    preferredStartToSolve: "3(x+12)=12(8-x)",
    rearrangedEquation: { xCoefficient: 15, constant: 60 },
    solution: 4,
    partMarks: [1, 4],
    difficultySignals: [
      "The diagram must be translated into two area expressions before the equation can be solved.",
      "The triangle one-half factor is mark-bearing and must survive into the solving stage.",
      "The rearranged coefficient is two-digit, preserving a non-trivial final division despite the integer solution.",
      "All five marks are A-standard Reasoning under the teacher-moderated classification sweep.",
    ],
  },
];

export type A7FamilyFrequencyCell = {
  family: A7CorpusSurfaceFamily;
  count: number;
  total: number;
  proportion: number;
};

const frequency = (family: A7CorpusSurfaceFamily, count: number, total: number): A7FamilyFrequencyCell => ({
  family,
  count,
  total,
  proportion: count / total,
});

/** Observed frequencies only; these are not claims about future SQA policy. */
export const A7_EMPIRICAL_FAMILY_FREQUENCY = {
  overall: [
    frequency("FRACTIONAL_COEFFICIENT", 3, 4),
    frequency("CONTEXT_AREA_EQUALITY", 1, 4),
  ],
  P1: [
    frequency("FRACTIONAL_COEFFICIENT", 2, 3),
    frequency("CONTEXT_AREA_EQUALITY", 1, 3),
  ],
  P2: [
    frequency("FRACTIONAL_COEFFICIENT", 1, 1),
    frequency("CONTEXT_AREA_EQUALITY", 0, 1),
  ],
  generationPolicy: [
    "Use observed frequency as a weak prior, not as a hard prediction of future SQA papers.",
    "The fractional-coefficient family is sufficiently repeated to be the default A7 generator family.",
    "The single-source contextual family remains experimental and should not be broadened beyond equal-area modelling without new evidence or teacher moderation.",
    "Explicit teacher selection may override the empirical family prior within the evidence-supported paper/family combinations.",
  ],
} as const;

export const A7_ABSTRACT_CALIBRATION_ENVELOPE = {
  denominatorLcm: { observedMin: 6, observedMax: 10 },
  absoluteClearedCoefficient: { observedMin: 2, observedMax: 15 },
  absoluteClearedConstant: { observedMin: 0, observedMax: 10 },
  absoluteRearrangedCoefficient: { observedMin: 7, observedMax: 8 },
  solutionNumeratorMagnitude: { observedMin: 3, observedMax: 16 },
  solutionDenominator: { observedMin: 7, observedMax: 8 },
  observedNegativeSolution: true,
  observedBracketAfterClearing: true,
  generatorGuardrails: [
    "Keep denominator LCM in the observed 6-10 envelope for the first generator version.",
    "Require the reduced final rational solution to be non-integer.",
    "Avoid a cleared equation that immediately isolates x; the rearrangement mark must remain genuine.",
    "Allow x and constants on both sides, but keep coefficients within written-arithmetic scale even on Paper 2.",
    "Permit a bracketed numerator/cleared bracket as a higher-texture variant because this is directly observed in 2025.",
    "Avoid generating a historical equation or a scalar-equivalent copy of a catalogued historical equation.",
  ],
} as const;

export const A7_CONTEXT_CALIBRATION_ENVELOPE = {
  supportedSemanticStructure: "TRIANGLE_AREA_EQUALS_RECTANGLE_AREA" as const,
  supportedPartMarks: [1, 4] as const,
  requiredTriangleHalfFactor: true,
  intendedSolutionType: "POSITIVE_INTEGER" as const,
  generatorGuardrails: [
    "One shape must be a triangle whose area contributes an explicit one-half factor.",
    "The other shape must be a rectangle with one fixed and one linear dimension.",
    "At the intended solution every displayed dimension must be positive.",
    "The equal-area equation must remain linear after expansion.",
    "The start-to-solve mark must genuinely clear or transform the triangle one-half factor.",
    "After rearrangement, avoid a single-digit x coefficient dividing to an integer; this would ease away the historical final mark.",
    "The generated diagram must be procedurally original and semantically consistent with the generated dimensions.",
  ],
} as const;

/**
 * Decisions fixed by the first A7 cross-corpus calibration pass.
 * Revisit these only when new catalogue evidence or teacher moderation warrants it.
 */
export const A7_CALIBRATION_DECISIONS = [
  "A7 V1 generation supports exactly two families: core fractional-coefficient solve and experimental equal-area context.",
  "Do not invent a C-standard A7 standalone family from absence/presumption; the reviewed standalone A7 corpus and supplied classification evidence support A-standard generation here.",
  "Do not create an arbitrary numeric difficulty ladder from four historical observations. Difficulty is controlled by evidence-backed structural levers until a broader A7 corpus justifies stable bands.",
  "For generated abstract marking, use the modern exact-rational expectation evidenced in 2019 and 2025 rather than randomly reproducing the older 2016 decimal-acceptance policy.",
  "Do not universalise the 2025 repeated-substitution exclusion as a historical fact; the generated answer scheme may require an algebraic pathway because that is the intended assessment construct, but provenance must distinguish generator policy from source history.",
  "The contextual family remains narrow: equal-area triangle/rectangle modelling only. Arbitrary age, money, perimeter or other word-problem contexts are out of scope until historically evidenced and reviewed.",
  "Historical-reference selection should prefer the closest structural fingerprint, not merely any question carrying skill A7.",
] as const;
