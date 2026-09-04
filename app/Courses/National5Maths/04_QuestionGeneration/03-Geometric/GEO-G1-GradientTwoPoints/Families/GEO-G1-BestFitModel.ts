export const GEO_G1_BEST_FIT_MODEL = {
  skillId: "geo-g01-gradient-two-points",
  conceptId: "geo-g1-1",
  label: "Construct a line-of-best-fit model",
  family: "BEST_FIT_LINEAR_MODEL",
  surfaces: [
    "BEST_FIT_LABELLED_POINTS_CONTEXT",
    "BEST_FIT_GRID_READ_POINTS",
  ],
  papers: ["P1"],
  difficulties: [1, 2],
  generatedG1Marks: 3,
  deferredEmbeddedSkillId: "stat-s02-linear-model",
  deferredEmbeddedMarks: 1,
  readiness: "COMPOSITE_DEFERRED",
  generatorId: "G1_GRADIENT_TWO_POINTS_V1",
} as const;
