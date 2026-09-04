import type {
  Concept,
  DifficultyLevel,
  SkillPaperSuitability,
} from "@/app/Assessments/AssessmentTypes";
import type {
  BuilderSkillRegistration,
} from "./BuilderSkillRegistration";

type N2ConceptOptions = {
  marks?: number;
  standard: Concept["standard"];
  paperSuitability: SkillPaperSuitability;
  calculator: NonNullable<Concept["metadata"]>["calculator"];
  availableDifficultyLevels: DifficultyLevel[];
  defaultDifficultyLevel: DifficultyLevel;
  fullDescription: string;
};

const n2Concept = (
  id: string,
  code: "N2.1" | "N2.2" | "N2.3",
  label: string,
  options: N2ConceptOptions,
): Concept => ({
  id,
  code,
  label,
  shortLabel: label,
  fullDescription: options.fullDescription,
  standard: options.standard,
  marks: options.marks,
  promptStyleId: "B",
  metadata: {
    standardTier: options.standard,
    thinkingType: "operational",
    paperSuitability: options.paperSuitability,
    calculator: options.calculator,
    interactionType: "core",
    stepCount: "multi",
    topicTags: ["indices"],
    canBePrimary: true,
    availableDifficultyLevels: options.availableDifficultyLevels,
    defaultDifficultyLevel: options.defaultDifficultyLevel,
  },
});

export const N2_BUILDER_CONCEPTS: Concept[] = [
  n2Concept(
    "num-n2-simplify-indices",
    "N2.1",
    "Simplify indices",
    {
      standard: "C+A",
      paperSuitability: "BOTH",
      calculator: "optional",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Simplify expressions using calibrated index-law mechanisms, including products, quotients, powers, roots and positive-power output forms.",
    },
  ),
  n2Concept(
    "num-n2-expand-simplify",
    "N2.2",
    "Expand and simplify",
    {
      marks: 2,
      standard: "A",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Expand a compact bracketed index expression and simplify the resulting powers using the laws of indices.",
    },
  ),
  n2Concept(
    "num-n2-evaluate-fractional",
    "N2.3",
    "Evaluate fractional indices",
    {
      marks: 2,
      standard: "A",
      paperSuitability: "P1",
      calculator: "none",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Evaluate exact fractional indices using controlled perfect-power values and source-centred examination arithmetic.",
    },
  ),
];

export const N2_BUILDER_SKILL_REGISTRATION: BuilderSkillRegistration = {
  skillId: "num-n2-indices",
  apply: (skill) => ({
    ...skill,
    paperSuitability: "BOTH",
    concepts: N2_BUILDER_CONCEPTS,
  }),
};
