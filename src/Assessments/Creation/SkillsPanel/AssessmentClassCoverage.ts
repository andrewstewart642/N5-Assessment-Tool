import { readMyClassesStorageValue } from "@/app/my-classes/state/ClassStorageKeys";
import { normaliseClass } from "@/app/my-classes/state/ClassNormalisation";
import type { SchoolClass } from "@/app/my-classes/types/Classes";

import type { Skill } from "@/shared-types/AssessmentTypes";

import {
  normaliseAssessmentLevelId,
  type AssessmentLevelId,
} from "../Setup/AssessmentClassCoverageStorage";

export function getCourseIdForLevelId(
  levelId: AssessmentLevelId | null
): AssessmentLevelId | null {
  return normaliseAssessmentLevelId(levelId);
}

export function loadSavedClasses(): SchoolClass[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = readMyClassesStorageValue();

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normaliseClass)
      .filter(
        (item): item is SchoolClass =>
          item !== null
      );
  } catch {
    return [];
  }
}

export function getSharedCompletedSkillIds(
  selectedClasses: SchoolClass[]
): string[] {
  if (selectedClasses.length === 0) {
    return [];
  }

  let sharedSkillIds = new Set(
    selectedClasses[0].completedSkillIds
  );

  for (
    const schoolClass of selectedClasses.slice(1)
  ) {
    const classSkillIds = new Set(
      schoolClass.completedSkillIds
    );

    sharedSkillIds = new Set(
      [...sharedSkillIds].filter((skillId) =>
        classSkillIds.has(skillId)
      )
    );
  }

  return [...sharedSkillIds];
}

export function buildFilteredSkillsData(
  allSkillsData: Record<string, Skill[]>,
  allowedSkillIds: Set<string>
): Record<string, Skill[]> {
  const filteredEntries = Object.entries(
    allSkillsData
  )
    .map(([categoryName, skills]) => {
      const visibleSkills = skills.filter(
        (skill) =>
          allowedSkillIds.has(skill.id)
      );

      return [
        categoryName,
        visibleSkills,
      ] as const;
    })
    .filter(
      ([, skills]) => skills.length > 0
    );

  return Object.fromEntries(filteredEntries);
}

export function buildClassCoverageSummary(args: {
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
}): string {
  const {
    classes,
    selectedClassIds,
    useCompleteCourseCoverage,
  } = args;

  if (useCompleteCourseCoverage) {
    return "Complete course";
  }

  if (selectedClassIds.length === 0) {
    return "";
  }

  const selectedClasses = classes.filter(
    (item) =>
      selectedClassIds.includes(item.id)
  );

  if (selectedClasses.length === 1) {
    return selectedClasses[0].name;
  }

  if (selectedClasses.length === 2) {
    return `${selectedClasses[0].name}, ${selectedClasses[1].name}`;
  }

  return `${selectedClasses.length} classes selected`;
}