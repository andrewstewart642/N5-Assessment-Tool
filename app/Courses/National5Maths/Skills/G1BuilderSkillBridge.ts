import type {
  Concept,
} from "@/app/Assessments/AssessmentTypes";
import type {
  BuilderSkillRegistration,
} from "./BuilderSkillRegistration";

export const G1_BUILDER_CONCEPTS: Concept[] = [
  {
    id: "geo-g1-1",
    code: "G1.1",
    label: "Gradient and equation of a straight line",
    shortLabel: "Gradient and equation of a straight line",
    fullDescription:
      "Generate across the calibrated G1 straight-line bank: equations from two points, deterministic contextual models, line-of-best-fit models and the rare symbolic-coordinate gradient form.",
    standard: "C+A",
    promptStyleId: "B",
    metadata: {
      standardTier: "C+A",
      thinkingType: "operational",
      paperSuitability: "BOTH",
      calculator: "optional",
      interactionType: "core",
      stepCount: "multi",
      topicTags: [
        "gradient",
        "straight line",
        "line equation",
        "line of best fit",
      ],
      canBePrimary: true,
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
    },
  },
];

export const G1_BUILDER_SKILL_REGISTRATION: BuilderSkillRegistration = {
  skillId: "geo-g01-gradient-two-points",
  apply: (skill) => ({
    ...skill,
    text: "Gradient and equation of a straight line",
    paperSuitability: "BOTH",
    concepts: G1_BUILDER_CONCEPTS,
  }),
};
