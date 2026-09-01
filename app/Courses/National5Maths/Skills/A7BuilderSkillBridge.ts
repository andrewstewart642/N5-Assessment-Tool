import type {
  Concept,
  DifficultyLevel,
  SkillPaperSuitability,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";

type A7ConceptOptions = {
  marks: number;
  thinkingType: NonNullable<Concept["metadata"]>["thinkingType"];
  paperSuitability: SkillPaperSuitability;
  availableDifficultyLevels: DifficultyLevel[];
  defaultDifficultyLevel: DifficultyLevel;
  fullDescription: string;
};

const a7Concept = (
  id: string,
  code: string,
  label: string,
  options: A7ConceptOptions,
): Concept => ({
  id,
  code,
  label,
  shortLabel: label,
  fullDescription: options.fullDescription,
  standard: "A",
  marks: options.marks,
  promptStyleId: "B",
  metadata: {
    standardTier: "A",
    thinkingType: options.thinkingType,
    paperSuitability: options.paperSuitability,
    calculator: "optional",
    interactionType: "core",
    stepCount: "multi",
    topicTags: ["linear equations", "fractional coefficients"],
    canBePrimary: true,
    availableDifficultyLevels: options.availableDifficultyLevels,
    defaultDifficultyLevel: options.defaultDifficultyLevel,
  },
});

/**
 * Keep the Builder selectors explicit for the hardened A7 families. A generic
 * "mixed" selector can silently disagree with a teacher's requested 3/5-mark
 * tariff, whereas these two choices map one-to-one onto calibrated generators.
 */
const A7_BUILDER_CONCEPTS: Concept[] = [
  a7Concept(
    "alg-a7-fractional",
    "A7.1",
    "Fractional-coefficient linear equation",
    {
      marks: 3,
      thinkingType: "operational",
      paperSuitability: "BOTH",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Solve an A-standard linear equation involving fractional coefficients using an SQA-calibrated written route.",
    },
  ),
  a7Concept(
    "alg-a7-area-equality",
    "A7.2",
    "Form and solve an equal-area linear equation",
    {
      marks: 5,
      thinkingType: "reasoning",
      paperSuitability: "P1",
      availableDifficultyLevels: [2],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Use a dimensioned triangle/rectangle diagram to form and solve a five-mark equal-area linear equation.",
    },
  ),
];

export function withA7BuilderConcepts(
  skillsData: SkillsData,
): SkillsData {
  const algebraicSkills = skillsData["Algebraic Skills"] ?? [];

  return {
    ...skillsData,
    "Algebraic Skills": algebraicSkills.map((skill) =>
      skill.id === "alg-a07-linear-equations"
        ? {
            ...skill,
            text: "Work with linear equations",
            paperSuitability: "BOTH",
            concepts: A7_BUILDER_CONCEPTS,
          }
        : skill
    ),
  };
}
