import type {
  Concept,
  DifficultyLevel,
  SkillPaperSuitability,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";

type A8ConceptOptions = {
  marks: number;
  thinkingType: NonNullable<Concept["metadata"]>["thinkingType"];
  paperSuitability: SkillPaperSuitability;
  calculator: NonNullable<Concept["metadata"]>["calculator"];
  availableDifficultyLevels: DifficultyLevel[];
  defaultDifficultyLevel: DifficultyLevel;
  fullDescription: string;
};

const a8Concept = (
  id: string,
  code: string,
  label: string,
  options: A8ConceptOptions
): Concept => ({
  id,
  code,
  label,
  shortLabel: label,
  fullDescription: options.fullDescription,
  standard: "C+A",
  marks: options.marks,
  promptStyleId: "B",
  metadata: {
    standardTier: "C+A",
    thinkingType: options.thinkingType,
    paperSuitability: options.paperSuitability,
    calculator: options.calculator,
    interactionType: "core",
    stepCount: "multi",
    topicTags: [
      "simultaneous equations",
      "elimination",
    ],
    canBePrimary: true,
    availableDifficultyLevels:
      options.availableDifficultyLevels,
    defaultDifficultyLevel:
      options.defaultDifficultyLevel,
  },
});

const A8_BUILDER_CONCEPTS: Concept[] = [
  a8Concept(
    "alg-a8-mixed",
    "A8",
    "Mixed simultaneous equations",
    {
      marks: 3,
      thinkingType: "mixed",
      paperSuitability: "BOTH",
      calculator: "optional",
      availableDifficultyLevels: [1, 2, 3],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Use the calibrated historical A8 family distribution, constrained by the selected paper, target marks and thinking type.",
    }
  ),
  a8Concept(
    "alg-a8-1",
    "A8.1",
    "Solve simultaneous equations algebraically",
    {
      marks: 3,
      thinkingType: "operational",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2, 3],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Solve a pair of simultaneous linear equations algebraically.",
    }
  ),
  a8Concept(
    "alg-a8-2",
    "A8.2",
    "Form and solve simultaneous equations from context",
    {
      marks: 6,
      thinkingType: "reasoning",
      paperSuitability: "BOTH",
      calculator: "optional",
      availableDifficultyLevels: [1, 2, 3],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Form two simultaneous equations from contextual information, solve them and communicate the contextual values.",
    }
  ),
  a8Concept(
    "alg-a8-3",
    "A8.3",
    "Find the point of intersection algebraically",
    {
      marks: 3,
      thinkingType: "operational",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [3],
      defaultDifficultyLevel: 3,
      fullDescription:
        "Use algebra to find the coordinates of the intersection of two straight lines shown on a graph.",
    }
  ),
  a8Concept(
    "alg-a8-4",
    "A8.4",
    "Solve then calculate a further quantity",
    {
      marks: 6,
      thinkingType: "reasoning",
      paperSuitability: "P2",
      calculator: "optional",
      availableDifficultyLevels: [3],
      defaultDifficultyLevel: 3,
      fullDescription:
        "Form and solve simultaneous equations, then use the solved values in a further contextual calculation.",
    }
  ),
];

export function withA8BuilderConcepts(
  skillsData: SkillsData
): SkillsData {
  const algebraicSkills =
    skillsData["Algebraic Skills"] ?? [];

  return {
    ...skillsData,
    "Algebraic Skills": algebraicSkills.map(
      (skill) =>
        skill.id ===
        "alg-a08-simultaneous-equations"
          ? {
              ...skill,
              text:
                "Work with simultaneous equations",
              paperSuitability:
                "BOTH",
              concepts:
                A8_BUILDER_CONCEPTS,
            }
          : skill
    ),
  };
}
