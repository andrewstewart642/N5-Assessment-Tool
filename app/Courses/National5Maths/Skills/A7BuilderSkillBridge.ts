import type {
  Concept,
  DifficultyLevel,
  SkillPaperSuitability,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";
import type {
  BuilderSkillRegistration,
} from "./BuilderSkillRegistration";

type A7ConceptOptions = {
  marks?: number;
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
    topicTags: ["linear equations"],
    canBePrimary: true,
    availableDifficultyLevels: options.availableDifficultyLevels,
    defaultDifficultyLevel: options.defaultDifficultyLevel,
  },
});

/**
 * Mirror the parent/child selector pattern used by fractions:
 *
 * A7.1   Work with linear equations       -> all calibrated A7.1 families
 * A7.1.1 Fractional linear equations      -> fractional family only
 * A7.1.2 Form and solve linear equations  -> contextual forming family only
 *
 * The parent deliberately has no single mark tariff. Variant-level selection
 * metadata decides which child family is eligible under the active Builder
 * marks/thinking/paper constraints.
 */
export const A7_BUILDER_CONCEPTS: Concept[] = [
  a7Concept(
    "alg-a7-linear-general",
    "A7.1",
    "Work with linear equations",
    {
      thinkingType: "mixed",
      paperSuitability: "BOTH",
      availableDifficultyLevels: [1, 2],
      defaultDifficultyLevel: 1,
      fullDescription:
        "Generate across the calibrated A7.1 linear-equation families, including fractional linear equations and form-and-solve contexts.",
    },
  ),
  a7Concept(
    "alg-a7-fractional",
    "A7.1.1",
    "Fractional linear equations",
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
    "A7.1.2",
    "Form and solve linear equations",
    {
      marks: 5,
      thinkingType: "reasoning",
      paperSuitability: "P1",
      availableDifficultyLevels: [2],
      defaultDifficultyLevel: 2,
      fullDescription:
        "Form and solve a linear equation from a contextual relationship. The currently calibrated generator family uses equal areas from a dimensioned triangle and rectangle.",
    },
  ),
];

export const A7_BUILDER_SKILL_REGISTRATION: BuilderSkillRegistration = {
  skillId: "alg-a07-linear-equations",
  apply: (skill) => ({
    ...skill,
    paperSuitability: "BOTH",
    concepts: A7_BUILDER_CONCEPTS,
  }),
};

/** @deprecated Use BuilderSkillRegistry as the single composition point. */
export function withA7BuilderConcepts(
  skillsData: SkillsData,
): SkillsData {
  return Object.fromEntries(
    Object.entries(skillsData).map(([group, skills]) => [
      group,
      skills.map((skill) =>
        skill.id === A7_BUILDER_SKILL_REGISTRATION.skillId
          ? A7_BUILDER_SKILL_REGISTRATION.apply(skill)
          : skill
      ),
    ]),
  );
}
