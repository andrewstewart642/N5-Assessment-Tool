import {
  COURSE_CATALOG,
  getCourseCatalogEntry,
  getDefaultCourseId,
  isCourseAvailable,
  normaliseCourseId,
} from "@/app/Courses/CourseCatalog";
import type { CourseId } from "@/app/Courses/CourseTypes";

export type AssessmentLevelId = CourseId;

export type AssessmentLevelOption = {
  id: AssessmentLevelId;
  label: string;
  classCourseLabel: string;
  isAvailable: boolean;
};

export const ASSESSMENT_LEVEL_OPTIONS: AssessmentLevelOption[] =
  COURSE_CATALOG.map((course) => ({
    id: course.id,
    label: course.label,
    classCourseLabel: course.classCourseLabel,
    isAvailable: course.isAvailable,
  }));

export type AssessmentClassCoverageBrief = {
  levelId: AssessmentLevelId | null;
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  savedAt: number;
};

const STORAGE_KEY = "assessment_builder_class_coverage_brief_v1";
const LEGACY_STORAGE_KEY = "n5-assessment-class-coverage-brief";

function readStorageWithLegacyFallback(): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(STORAGE_KEY);
  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacyValue === null) return null;

  window.localStorage.setItem(STORAGE_KEY, legacyValue);
  return legacyValue;
}

export function normaliseAssessmentLevelId(
  value: unknown
): AssessmentLevelId | null {
  return normaliseCourseId(value);
}

export function isAssessmentLevelAvailable(value: unknown): boolean {
  return isCourseAvailable(value);
}

export function getDefaultAssessmentLevelId(): AssessmentLevelId {
  return getDefaultCourseId();
}

export function getAssessmentLevelOption(
  value: unknown
): AssessmentLevelOption | null {
  const course = getCourseCatalogEntry(value);
  if (!course) return null;

  return {
    id: course.id,
    label: course.label,
    classCourseLabel: course.classCourseLabel,
    isAvailable: course.isAvailable,
  };
}

export function getAssessmentLevelLabel(value: unknown): string | null {
  return getAssessmentLevelOption(value)?.label ?? null;
}

export function getAssessmentClassCourseLabel(value: unknown): string | null {
  return getAssessmentLevelOption(value)?.classCourseLabel ?? null;
}

export function saveAssessmentClassCoverageBrief(
  brief: AssessmentClassCoverageBrief
) {
  if (typeof window === "undefined") return;

  const normalisedLevelId = normaliseAssessmentLevelId(brief.levelId);
  const safeLevelId = isAssessmentLevelAvailable(normalisedLevelId)
    ? normalisedLevelId
    : getDefaultAssessmentLevelId();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...brief,
      levelId: safeLevelId,
    })
  );
}

export function loadAssessmentClassCoverageBrief(): AssessmentClassCoverageBrief | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = readStorageWithLegacyFallback();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AssessmentClassCoverageBrief>;

    const selectedClassIds = Array.isArray(parsed.selectedClassIds)
      ? parsed.selectedClassIds.filter(
          (value): value is string => typeof value === "string"
        )
      : [];

    const normalisedLevelId = normaliseAssessmentLevelId(parsed.levelId);
    const safeLevelId = isAssessmentLevelAvailable(normalisedLevelId)
      ? normalisedLevelId
      : getDefaultAssessmentLevelId();

    return {
      levelId: safeLevelId,
      selectedClassIds,
      useCompleteCourseCoverage: Boolean(parsed.useCompleteCourseCoverage),
      savedAt:
        typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt)
          ? parsed.savedAt
          : Date.now(),
    };
  } catch {
    return null;
  }
}