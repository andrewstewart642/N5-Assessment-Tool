import type {
  Question,
  Skill,
  SkillsData,
} from "@/app/Assessments/AssessmentTypes";

type CoverageAwareSkill =
  Skill & {
    coverageUnitId?: string;
  };

type CoverageAwareQuestion =
  Question & {
    coverageSkillIds?: string[];
  };

export function getSkillCoverageUnitId(
  skill: Skill
): string {
  const explicit =
    (skill as CoverageAwareSkill)
      .coverageUnitId
      ?.trim();

  return explicit || skill.id;
}

export function getCoverageUnitIdsFromSkillsData(
  skillsData: SkillsData
): string[] {
  const unique = new Set<string>();

  Object.values(
    skillsData
  ).forEach((skills) => {
    skills.forEach((skill) => {
      unique.add(
        getSkillCoverageUnitId(
          skill
        )
      );
    });
  });

  return [...unique];
}

export function getCoverageUnitLabelMap(
  skillsData: SkillsData
): Record<string, string> {
  const labels: Record<string, string> = {};

  Object.values(
    skillsData
  ).forEach((skills) => {
    skills.forEach((skill) => {
      const unitId =
        getSkillCoverageUnitId(
          skill
        );

      if (!labels[unitId]) {
        labels[unitId] =
          `${skill.code} ${skill.text}`;
      }
    });
  });

  return labels;
}

/**
 * Resolve the formal course-specification coverage represented by a committed
 * question.
 *
 * Current single-skill questions fall back to primarySkillId/skillId. Future
 * compound questions can declare explicit coverageSkillIds without changing
 * the Metrics engine. Coverage is never inferred from incidental maths used
 * inside a question.
 */
export function getQuestionCoverageUnitIds(
  question: Question
): string[] {
  const explicit =
    (question as CoverageAwareQuestion)
      .coverageSkillIds
      ?.map((value) =>
        value.trim()
      )
      .filter(Boolean);

  if (
    explicit &&
    explicit.length > 0
  ) {
    return [
      ...new Set(
        explicit
      ),
    ];
  }

  const fallback =
    question.primarySkillId ??
    question.skillId;

  return fallback
    ? [fallback]
    : [];
}

export function getRepresentedCoverageUnitIds(
  questions: Question[]
): string[] {
  const represented =
    new Set<string>();

  questions.forEach((question) => {
    getQuestionCoverageUnitIds(
      question
    ).forEach((unitId) => {
      represented.add(unitId);
    });
  });

  return [...represented];
}

export function isSkillRepresentedInAssessment({
  skill,
  representedUnitIds,
}: {
  skill: Skill;
  representedUnitIds: ReadonlySet<string>;
}): boolean {
  return representedUnitIds.has(
    getSkillCoverageUnitId(
      skill
    )
  );
}
