export const GEO_G1_GRADIENT_TWO_POINTS_MIXED = {
  skillId: "geo-g01-gradient-two-points",
  conceptId: "geo-g1-1",
  label: "Gradient and straight-line models",
  families: [
    "LINE_EQUATION_FROM_TWO_POINTS",
    "CONTEXTUAL_LINEAR_MODEL",
    "BEST_FIT_LINEAR_MODEL",
    "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
  ],
  // Reviewed occurrence counts are the generic prior, not equal weights:
  // 4/12 line equation, 2/12 deterministic context, 5/12 best fit, 1/12 symbolic.
  historicalOccurrenceWeights: {
    LINE_EQUATION_FROM_TWO_POINTS: 4,
    CONTEXTUAL_LINEAR_MODEL: 2,
    BEST_FIT_LINEAR_MODEL: 5,
    SYMBOLIC_GRADIENT_FROM_TWO_POINTS: 1,
  },
  papers: ["P1", "P2"],
  difficulties: [1, 2],
  generatorId: "G1_GRADIENT_TWO_POINTS_V1",
} as const;
