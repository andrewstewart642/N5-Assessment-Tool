export const NUM_N2_BRACKETED_INDEX_LAWS = {
  skillId: "num-n2-indices",
  label: "Apply index laws through a bracket structure",
  family: "BRACKETED_INDEX_LAWS",
  mechanisms: [
    "SQUARED_FRACTIONAL_MONOMIAL",
    "DISTRIBUTIVE_INDEX_EXPANSION",
  ],
  readiness: "SUPPORTED",
  papers: ["P1"],
  difficulties: [1, 2],
  marks: [2],
  standardProfiles: ["C+A", "A"],
  thinking: "OPERATIONAL",
  generatorId: "N2_INDICES_V1",
} as const;
