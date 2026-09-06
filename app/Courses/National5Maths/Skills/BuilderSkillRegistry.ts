import type {
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";
import {
  N2_BUILDER_SKILL_REGISTRATION,
} from "./N2BuilderSkillBridge";
import {
  A7_BUILDER_SKILL_REGISTRATION,
} from "./A7BuilderSkillBridge";
import {
  A8_BUILDER_SKILL_REGISTRATION,
} from "./A8BuilderSkillBridge";
import {
  G1_BUILDER_SKILL_REGISTRATION,
} from "./G1BuilderSkillBridge";
import type {
  BuilderSkillRegistration,
} from "./BuilderSkillRegistration";

const BUILDER_SKILL_REGISTRATIONS: readonly BuilderSkillRegistration[] = [
  N2_BUILDER_SKILL_REGISTRATION,
  A7_BUILDER_SKILL_REGISTRATION,
  A8_BUILDER_SKILL_REGISTRATION,
  G1_BUILDER_SKILL_REGISTRATION,
];

const registrationMap = () => {
  const bySkillId = new Map<string, BuilderSkillRegistration>();

  for (const registration of BUILDER_SKILL_REGISTRATIONS) {
    if (bySkillId.has(registration.skillId)) {
      throw new Error(
        `Duplicate National 5 Maths Builder skill registration for ${registration.skillId}.`,
      );
    }
    bySkillId.set(registration.skillId, registration);
  }

  return bySkillId;
};

/**
 * Single composition point for course-specific Builder skill capability.
 *
 * A skill registration may only transform its own Skill record. Registrations
 * never call one another; adding A9 therefore means registering A9 here rather
 * than editing A8 or AssessmentConfig.
 */
export const applyBuilderSkillRegistrations = (
  skillsData: SkillsData,
): SkillsData => {
  const bySkillId = registrationMap();
  const applied = new Set<string>();

  const result = Object.fromEntries(
    Object.entries(skillsData).map(([group, skills]) => [
      group,
      skills.map((skill) => {
        const registration = bySkillId.get(skill.id);
        if (!registration) return skill;

        applied.add(skill.id);
        return registration.apply(skill);
      }),
    ]),
  );

  const missing = [...bySkillId.keys()].filter((skillId) => !applied.has(skillId));
  if (missing.length > 0) {
    throw new Error(
      `National 5 Maths Builder registrations reference missing Skills: ${missing.join(", ")}.`,
    );
  }

  return result;
};

export const NATIONAL5_MATHS_BUILDER_SKILL_REGISTRATION_IDS =
  BUILDER_SKILL_REGISTRATIONS.map((registration) => registration.skillId);
