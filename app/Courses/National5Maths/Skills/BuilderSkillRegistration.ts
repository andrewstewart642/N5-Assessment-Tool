import type {
  Skill,
} from "@/app/Assessments/AssessmentTypes";

/**
 * One course skill's Builder-facing augmentation.
 *
 * Registrations may replace/extend the concepts exposed by the canonical
 * Skills Tree, but they must not mutate unrelated skills or chain to another
 * registration. BuilderSkillRegistry is the only composition point.
 */
export type BuilderSkillRegistration = {
  skillId: string;
  apply: (skill: Skill) => Skill;
};
