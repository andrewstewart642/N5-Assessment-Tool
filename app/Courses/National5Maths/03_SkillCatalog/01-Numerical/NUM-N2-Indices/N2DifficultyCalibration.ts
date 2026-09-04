export type N2DifficultyLevel = 1 | 2;
export type N2DifficultyBandId = "LOWER_VALID" | "UPPER_VALID";

export type N2DifficultyBandCalibration = {
  difficulty: N2DifficultyLevel;
  bandId: N2DifficultyBandId;
  description: string;
};

/**
 * Difficulty is deliberately separate from C/A standard. The reviewed corpus
 * contains low-demand A-standard examples and a medium-demand wholly C example.
 */
export const N2_DIFFICULTY_BANDS: readonly N2DifficultyBandCalibration[] = [
  {
    difficulty: 1,
    bandId: "LOWER_VALID",
    description: "Lower valid N2 demand: the route is direct and compact, with either two straightforward transformations or a three-stage positive-index/coefficient route whose representation burden remains low.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    description: "Upper valid N2 demand: signed or fractional exponents, root translation, prescribed output form, distributive structure or a denser three-stage law combination materially increases the written/representation burden.",
  },
] as const;

export type N2DifficultyAnchor = {
  sourceQuestionId: string;
  difficulty: N2DifficultyLevel;
  historicalLabel: "LOW" | "MEDIUM";
  drivers: readonly string[];
};

export const N2_DIFFICULTY_ANCHORS: readonly N2DifficultyAnchor[] = [
  {
    sourceQuestionId: "N5_MATH_2014_P2_Q8",
    difficulty: 1,
    historicalLabel: "LOW",
    drivers: ["positive indices", "separate coefficient reduction", "no representation conversion"],
  },
  {
    sourceQuestionId: "N5_MATH_2015_P1_Q14",
    difficulty: 1,
    historicalLabel: "LOW",
    drivers: ["two-stage fractional-index interpretation", "exact small-number evaluation"],
  },
  {
    sourceQuestionId: "N5_MATH_2016_P2_Q10",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["power of a power", "negative exponents", "positive-power output conversion"],
  },
  {
    sourceQuestionId: "N5_MATH_2017_P2_Q12",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["root-to-fractional translation", "reciprocal-to-negative-index translation", "prescribed single-power form"],
  },
  {
    sourceQuestionId: "N5_MATH_2018_P1_Q15",
    difficulty: 1,
    historicalLabel: "LOW",
    drivers: ["single outer power", "fractional coefficient arithmetic", "two-component monomial"],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P2_Q16",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["root denominator", "fractional exponent representation", "integer-minus-fraction quotient law"],
  },
  {
    sourceQuestionId: "N5_MATH_2021_P1_Q15",
    difficulty: 1,
    historicalLabel: "LOW",
    drivers: ["two-stage fractional-index interpretation", "perfect-square base", "exact integer result"],
  },
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q11",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["nested signed exponent", "second negative power", "positive-power output conversion"],
  },
  {
    sourceQuestionId: "N5_MATH_2023_P1_Q12",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["negative numerator exponent", "denominator product", "coefficient-preserving reciprocal conversion"],
  },
  {
    sourceQuestionId: "N5_MATH_2024_P1_Q13",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["distribution over two terms", "fractional and negative exponents together", "zero-power simplification"],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P1_Q10",
    difficulty: 2,
    historicalLabel: "MEDIUM",
    drivers: ["three distinct positive-index laws", "nested power inside a quotient", "operation-order discipline"],
  },
] as const;

export const N2_DIFFICULTY_LEVERS = {
  representation: [
    "root notation converted to a fractional exponent",
    "negative exponent converted to reciprocal positive-power form",
    "fractional and integer exponents combined in one stage",
    "zero power simplified to a constant term",
  ],
  structure: [
    "two versus three independently mark-bearing stages",
    "single monomial versus algebraic fraction",
    "outer power versus distributive bracket",
    "one same-base combination versus multiple law types",
  ],
  arithmetic: [
    "fractional coefficient arithmetic",
    "small exact numerical powers",
    "signed exponent arithmetic",
  ],
  presentation: [
    "explicit positive-power final form",
    "prescribed single-power representation",
    "full simplification requirement",
  ],
} as const;

export const N2_DIFFICULTY_SCORING_RULES = [
  "Difficulty is determined by the route the pupil must perform, not by C/A standard and not by the visual ugliness of the exponents.",
  "A fractional exponent can remain lower-band when it appears in a clean two-mark exact numerical evaluation.",
  "A wholly positive-index question can be upper-band when three distinct laws must be coordinated, as shown by the 2025 anchor.",
  "Signed exponents raise demand only when they create a genuine combine/convert step; merely changing a sign does not justify a difficulty increase.",
  "Root notation is an upper-band signal when the candidate must translate representation before another law can be applied.",
  "Distributive expansion with unlike indexed terms is an upper-band signal because the candidate must maintain two parallel exponent calculations.",
  "Do not increase difficulty by using large coefficients or exponents alone. Generated values must remain compact enough for the index structure to stay central.",
  "Difficulty 1 and 2 must both remain plausible on either supported paper where the selected family/mechanism has evidence; calculator availability must not be used to inflate arithmetic.",
] as const;
