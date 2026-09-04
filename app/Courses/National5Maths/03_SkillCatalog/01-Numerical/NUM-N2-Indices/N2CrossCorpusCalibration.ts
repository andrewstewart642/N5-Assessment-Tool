import type { N2CorpusFamily, N2HistoricalMechanism } from "./N2CrossCorpusAnalysis";

export type N2FractionalEvaluationFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  base: number;
  exponentNumerator: number;
  exponentDenominator: number;
  exactResult: number;
  totalMarks: 2;
  standardPattern: readonly ["A", "A"];
};

export const N2_FRACTIONAL_EVALUATION_FINGERPRINTS: readonly N2FractionalEvaluationFingerprint[] = [
  {
    sourceQuestionId: "N5_MATH_2015_P1_Q14",
    sourceAnswerId: "N5_MATH_2015_P1_Q14_MS",
    base: 8,
    exponentNumerator: 5,
    exponentDenominator: 3,
    exactResult: 32,
    totalMarks: 2,
    standardPattern: ["A", "A"],
  },
  {
    sourceQuestionId: "N5_MATH_2021_P1_Q15",
    sourceAnswerId: "N5_MATH_2021_P1_Q15_MS",
    base: 16,
    exponentNumerator: 3,
    exponentDenominator: 2,
    exactResult: 64,
    totalMarks: 2,
    standardPattern: ["A", "A"],
  },
] as const;

export type N2SymbolicFingerprint = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  family: Exclude<N2CorpusFamily, "FRACTIONAL_INDEX_EVALUATION">;
  mechanism: N2HistoricalMechanism;
  stageCount: 2 | 3;
  totalMarks: 2 | 3;
  standardPattern: readonly ("C" | "A")[];
  negativeIndices: boolean;
  fractionalIndices: boolean;
  rootNotation: boolean;
  bracketed: boolean;
  algebraicFraction: boolean;
  additiveTerms: boolean;
  coefficientArithmetic: boolean;
  positivePowerOutputRequired: boolean;
  calibrationNotes: readonly string[];
};

export const N2_SYMBOLIC_FINGERPRINTS: readonly N2SymbolicFingerprint[] = [
  {
    sourceQuestionId: "N5_MATH_2014_P2_Q8",
    sourceAnswerId: "N5_MATH_2014_P2_Q8_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "C", "C"],
    negativeIndices: false,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: false,
    algebraicFraction: true,
    additiveTerms: false,
    coefficientArithmetic: true,
    positivePowerOutputRequired: false,
    calibrationNotes: ["Positive indices only.", "Coefficient simplification is independently mark-bearing."],
  },
  {
    sourceQuestionId: "N5_MATH_2016_P2_Q10",
    sourceAnswerId: "N5_MATH_2016_P2_Q10_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "A", "A"],
    negativeIndices: true,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: true,
    algebraicFraction: false,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: true,
    calibrationNotes: ["Power-of-a-power is followed by a signed-exponent step.", "Final reciprocal conversion is explicit."],
  },
  {
    sourceQuestionId: "N5_MATH_2017_P2_Q12",
    sourceAnswerId: "N5_MATH_2017_P2_Q12_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    stageCount: 2,
    totalMarks: 2,
    standardPattern: ["A", "A"],
    negativeIndices: true,
    fractionalIndices: true,
    rootNotation: true,
    bracketed: false,
    algebraicFraction: true,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: false,
    calibrationNotes: ["Both marks are representation changes.", "The requested output is one power of the same base."],
  },
  {
    sourceQuestionId: "N5_MATH_2018_P1_Q15",
    sourceAnswerId: "N5_MATH_2018_P1_Q15_MS",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "SQUARED_FRACTIONAL_MONOMIAL",
    stageCount: 2,
    totalMarks: 2,
    standardPattern: ["C", "A"],
    negativeIndices: false,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: true,
    algebraicFraction: false,
    additiveTerms: false,
    coefficientArithmetic: true,
    positivePowerOutputRequired: false,
    calibrationNotes: ["The outer power acts on coefficient and variable components.", "A fractional coefficient keeps exact arithmetic visible."],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P2_Q16",
    sourceAnswerId: "N5_MATH_2019_P2_Q16_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_OVER_ROOT",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "A", "A"],
    negativeIndices: false,
    fractionalIndices: true,
    rootNotation: true,
    bracketed: false,
    algebraicFraction: true,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: false,
    calibrationNotes: ["The root-to-fractional-index transition is a distinct stage.", "The final quotient mixes integer and fractional exponents."],
  },
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q11",
    sourceAnswerId: "N5_MATH_2022_P1_Q11_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "A", "A"],
    negativeIndices: true,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: true,
    algebraicFraction: false,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: true,
    calibrationNotes: ["Structurally close to the 2016 anchor.", "Multiple reciprocal/signed-exponent routes can earn full credit."],
  },
  {
    sourceQuestionId: "N5_MATH_2023_P1_Q12",
    sourceAnswerId: "N5_MATH_2023_P1_Q12_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "NEGATIVE_INDEX_QUOTIENT",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "C", "A"],
    negativeIndices: true,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: false,
    algebraicFraction: true,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: true,
    calibrationNotes: ["A negative numerator power is combined with a denominator product.", "Coefficient placement matters in the final reciprocal form."],
  },
  {
    sourceQuestionId: "N5_MATH_2024_P1_Q13",
    sourceAnswerId: "N5_MATH_2024_P1_Q13_MS",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    stageCount: 2,
    totalMarks: 2,
    standardPattern: ["A", "A"],
    negativeIndices: true,
    fractionalIndices: true,
    rootNotation: false,
    bracketed: true,
    algebraicFraction: false,
    additiveTerms: true,
    coefficientArithmetic: false,
    positivePowerOutputRequired: false,
    calibrationNotes: ["The outside factor distributes over two unlike indexed terms.", "One product collapses to a zero power/constant."],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P1_Q10",
    sourceAnswerId: "N5_MATH_2025_P1_Q10_MS",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT",
    stageCount: 3,
    totalMarks: 3,
    standardPattern: ["C", "C", "C"],
    negativeIndices: false,
    fractionalIndices: false,
    rootNotation: false,
    bracketed: true,
    algebraicFraction: true,
    additiveTerms: false,
    coefficientArithmetic: false,
    positivePowerOutputRequired: false,
    calibrationNotes: ["Three positive-index laws form three clean process stages.", "Working is required despite the wholly C standard profile."],
  },
] as const;

export type N2FamilyFrequencyCell = {
  family: N2CorpusFamily;
  count: number;
  total: number;
  proportion: number;
};

const frequency = (family: N2CorpusFamily, count: number, total: number): N2FamilyFrequencyCell => ({
  family,
  count,
  total,
  proportion: count / total,
});

/** Observed frequencies only; they are weak priors, not predictions of future papers. */
export const N2_EMPIRICAL_FAMILY_FREQUENCY = {
  overall: [
    frequency("FRACTIONAL_INDEX_EVALUATION", 2, 11),
    frequency("BRACKETED_INDEX_LAWS", 2, 11),
    frequency("MULTI_LAW_SIMPLIFICATION", 7, 11),
  ],
  P1: [
    frequency("FRACTIONAL_INDEX_EVALUATION", 2, 7),
    frequency("BRACKETED_INDEX_LAWS", 2, 7),
    frequency("MULTI_LAW_SIMPLIFICATION", 3, 7),
  ],
  P2: [
    frequency("FRACTIONAL_INDEX_EVALUATION", 0, 4),
    frequency("BRACKETED_INDEX_LAWS", 0, 4),
    frequency("MULTI_LAW_SIMPLIFICATION", 4, 4),
  ],
  generationPolicy: [
    "Use family frequency only as a weak sampling prior.",
    "Do not conclude that fractional or bracketed N2 questions are impossible on Paper 2 from this eleven-question sample.",
    "Multi-law simplification has the strongest cross-paper evidence and may carry the largest default share of random N2 generation.",
    "Explicit teacher family selection overrides empirical frequency within supported generation envelopes.",
  ],
} as const;

export const N2_EMPIRICAL_TARIFF_AND_CLASSIFICATION = {
  questionCount: 11,
  totalMarks: 28,
  tariffCounts: { twoMark: 5, threeMark: 6 },
  questionStandardProfileCounts: { C: 2, A: 4, mixed: 5 },
  markStandardCounts: { C: 12, A: 16 },
  thinkingMarkCounts: { OPERATIONAL: 28, REASONING: 0 },
} as const;

export const N2_FRACTIONAL_GENERATION_ENVELOPE = {
  observedRootIndices: [2, 3] as const,
  observedExponentNumerators: [3, 5] as const,
  observedBases: [8, 16] as const,
  observedExactResults: [32, 64] as const,
  generatorGuardrails: [
    "Choose a small positive integer root index and a base that is an exact corresponding perfect power.",
    "Require the final value to be an exact, manageable integer without calculator approximation.",
    "Keep the interpretation and evaluation stages independently visible so the two-mark tariff remains genuine.",
    "Avoid reproducing either historical base/exponent pair exactly.",
  ],
} as const;

export const N2_SYMBOLIC_GENERATION_ENVELOPE = {
  observedIntegerExponentMagnitude: { min: 1, max: 10 },
  observedOuterPower: { min: 2, max: 4 },
  observedRootIndex: { min: 2, max: 3 },
  observedStageCount: { min: 2, max: 3 },
  observedTariffs: [2, 3] as const,
  generatorGuardrails: [
    "Use compact integer exponents and coefficients that keep written arithmetic subordinate to the index laws being assessed.",
    "A two-mark item should contain two genuinely separable mark-bearing transformations; a three-mark item should contain three.",
    "Do not raise difficulty by using large exponents alone.",
    "Negative and fractional exponents may raise demand when they create a real representation step, not merely because they appear on the page.",
    "Keep every expression recognisably within ordinary index-law manipulation; avoid drift into rational-expression or surd-specialist techniques.",
    "When multiple full-credit routes are mathematically natural, answer generation should accept them rather than force one arbitrary sequence.",
  ],
} as const;

export const N2_CALIBRATION_DECISIONS = [
  "N2 generation is family-first and mechanism-second: select the historical family, then a reviewed mechanism grammar, then sample parameters.",
  "The repeated power-of-a-power with negative index mechanism is the strongest symbolic subfamily anchor because it occurs in both 2016 and 2022 with the same C+A mark pattern.",
  "The all-positive three-law 2025 source proves that law count alone cannot be used as an A-standard switch.",
  "The 2023 mixed split proves that a negative-index three-mark question can still contain two C marks; signed exponents alone do not determine standard.",
  "The 2015/2021 fractional-evaluation pair is stable enough for a dedicated two-mark generator family.",
  "The bracketed family must retain two separate mechanism grammars until more evidence shows that they can be safely unified.",
  "Answer-only treatment varies historically. Do not infer one universal N2 working rule from the corpus; generated policy must be explicit and aligned with the intended mark architecture.",
  "No Reasoning N2 family is supported by the reviewed corpus. Introducing one requires new evidence and teacher moderation rather than parameter interpolation.",
] as const;
