export type N2DifficultyLevel = 1 | 2;
export type N2DifficultyBandId = "LOWER_VALID" | "UPPER_VALID";

export type N2DifficultyBandCalibration = {
  difficulty: N2DifficultyLevel;
  bandId: N2DifficultyBandId;
  description: string;
};

/**
 * Difficulty is deliberately separate from C/A standard and from mechanism.
 * Historical anchors locate the default centre of gravity; generated instances
 * may deliberately move within the same skill/mechanism by changing genuine
 * arithmetic, representation or coordination burden.
 */
export const N2_DIFFICULTY_BANDS: readonly N2DifficultyBandCalibration[] = [
  {
    difficulty: 1,
    bandId: "LOWER_VALID",
    description: "Lower-band N2 demand: a direct, compact and source-centred route with controlled values, familiar representation and no unnecessary secondary difficulty lever.",
  },
  {
    difficulty: 2,
    bandId: "UPPER_VALID",
    description: "Upper-band N2 demand: the same underlying skill is made materially harder through a genuine representation, recognition or coordination step while the expression remains compact and examination-natural.",
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
    "less familiar but still exact fractional-index representation",
  ],
  structure: [
    "two versus three independently mark-bearing stages",
    "single monomial versus algebraic fraction",
    "outer power versus distributive bracket",
    "one same-base combination versus multiple law types",
    "one extra representation lever rather than several decorative complications",
  ],
  arithmetic: [
    "fractional coefficient arithmetic",
    "small exact numerical powers",
    "controlled perfect-power recognition within fractional-index evaluation",
    "moderately larger exact values where the written route remains natural",
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
  "Difficulty belongs to the generated instance rather than being permanently attached to a mechanism; a mechanism may produce lower- and upper-band instances when its mathematical envelope supports both.",
  "Historical examples anchor the normal/default difficulty for a mechanism but do not impose a generation ceiling.",
  "For numerical fractional-index evaluation, lower-band items keep familiar perfect-power recognition and a modest exact result; upper-band demand may instead come from a less familiar exact root, a less routine fractional numerator or a moderately larger exact result.",
  "Numerical fractional-index answers above 343 are stretch cases only and must not become the normal centre of gravity for the upper band.",
  "For distributive expansion, lower-band items stay close to the clean source grammar: an integer outside power, one positive fractional term and one negative integer term. Upper-band items add one controlled representation lever such as a negative fractional term, two fractional bracket terms or a fractional outside power.",
  "Do not routinely stack every available distributive difficulty lever into one two-mark question; upper-band demand should remain compact and readable.",
  "A zero-power result is an authentic simplification feature but should occur only occasionally rather than being forced into every distributive item.",
  "A wholly positive-index question can be upper-band when three distinct laws must be coordinated.",
  "Signed exponents raise demand only when they create a genuine combine/convert step; merely changing a sign does not justify a difficulty increase.",
  "Root notation is an upper-band signal when the candidate must translate representation before another law can be applied.",
  "Do not increase difficulty by using large coefficients or exponents alone. Generated values must remain compact enough for the index structure to stay central.",
  "Difficulty 1 and 2 must both remain plausible on either supported paper where the selected family/mechanism has evidence; calculator availability must not be used to inflate arithmetic.",
] as const;
