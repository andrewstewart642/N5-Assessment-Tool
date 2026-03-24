export type AssessmentLevelId = "N5_MATHS" | "N5_APPS" | "HIGHER_MATHS";

export type AssessmentLevelOption = {
  id: AssessmentLevelId;
  label: string;
  classCourseLabel: string;
};

export const ASSESSMENT_LEVEL_OPTIONS: AssessmentLevelOption[] = [
  {
    id: "N5_MATHS",
    label: "National 5 Maths",
    classCourseLabel: "National 5 Maths",
  },
  {
    id: "N5_APPS",
    label: "National 5 Applications of Maths",
    classCourseLabel: "National 5 Applications",
  },
  {
    id: "HIGHER_MATHS",
    label: "Higher Maths",
    classCourseLabel: "Higher Maths",
  },
];

export type AssessmentClassCoverageBrief = {
  levelId: AssessmentLevelId | null;
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  savedAt: number;
};

const STORAGE_KEY = "n5-assessment-class-coverage-brief";

export function saveAssessmentClassCoverageBrief(
  brief: AssessmentClassCoverageBrief
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
}

export function loadAssessmentClassCoverageBrief(): AssessmentClassCoverageBrief | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AssessmentClassCoverageBrief>;

    const selectedClassIds = Array.isArray(parsed.selectedClassIds)
      ? parsed.selectedClassIds.filter(
          (value): value is string => typeof value === "string"
        )
      : [];

    const levelId =
      parsed.levelId === "N5_MATHS" ||
      parsed.levelId === "N5_APPS" ||
      parsed.levelId === "HIGHER_MATHS"
        ? parsed.levelId
        : null;

    return {
      levelId,
      selectedClassIds,
      useCompleteCourseCoverage: Boolean(parsed.useCompleteCourseCoverage),
      savedAt:
        typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}