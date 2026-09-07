export const GEO_G1_SYMBOLIC_GRADIENT = {
  skillId: "geo-g01-gradient-two-points",
  conceptId: "geo-g1-1",
  label: "Find a symbolic gradient from two points",
  family: "SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
  surfaces: ["SYMBOLIC_COORDINATE_GRADIENT"],
  // Paper 2 remains first because it is the only observed placement, but the
  // route has no calculator dependency and is valid for either paper.
  papers: ["P2", "P1"],
  difficulties: [2],
  marks: 3,
  standard: "A",
  thinking: "OPERATIONAL",
  readiness: "EXPERIMENTAL",
  generatorId: "G1_GRADIENT_TWO_POINTS_V1",
} as const;
