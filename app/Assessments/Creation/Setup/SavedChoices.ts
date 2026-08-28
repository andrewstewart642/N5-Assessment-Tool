import type { CourseId } from "@/app/Courses/CourseTypes";
import type {
  CourseAssessmentModeId,
  CourseAssessmentStructureId,
} from "@/app/Courses/CourseAssessmentConfig";

export const ASSESSMENT_SETUP_STORAGE_KEY =
  "assessment_builder_setup_brief_v1";

export const LEGACY_ASSESSMENT_SETUP_STORAGE_KEY =
  "n5-assessment-setup-brief";

export type AssessmentType = CourseAssessmentModeId;

export type BuildPriority = "MARKS" | "TIME";

export type PaperStructure = CourseAssessmentStructureId;

export type AssessmentSetupBrief = {
  /**
   * New course-aware field.
   *
   * Optional for backwards compatibility with previously saved localStorage
   * setup briefs.
   */
  courseId?: CourseId;

  assessmentType: AssessmentType;
  buildPriority: BuildPriority;
  paperStructure: PaperStructure;

  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;

  marksTargetP1: number | null;
  marksTargetP2: number | null;
  timeTargetP1: number | null;
  timeTargetP2: number | null;

  assessmentName: string;
  className: string;
  assessmentDate: string;

  createdAt: number;
};

function readStorageWithLegacyFallback(): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(
    ASSESSMENT_SETUP_STORAGE_KEY
  );

  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(
    LEGACY_ASSESSMENT_SETUP_STORAGE_KEY
  );

  if (legacyValue === null) return null;

  window.localStorage.setItem(ASSESSMENT_SETUP_STORAGE_KEY, legacyValue);
  return legacyValue;
}

function isAssessmentType(value: unknown): value is AssessmentType {
  return (
    value === "PRELIM" ||
    value === "CLASS_TEST" ||
    value === "HOMEWORK" ||
    value === "CHECK_TEST" ||
    value === "CUSTOM"
  );
}

function isBuildPriority(value: unknown): value is BuildPriority {
  return value === "MARKS" || value === "TIME";
}

function isPaperStructure(value: unknown): value is PaperStructure {
  return value === "BOTH" || value === "P1_ONLY" || value === "P2_ONLY";
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readRequiredString(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  return value.trim().length ? value : fallback;
}

export function saveAssessmentSetupBrief(
  brief: AssessmentSetupBrief
): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    ASSESSMENT_SETUP_STORAGE_KEY,
    JSON.stringify(brief)
  );
}

export function loadAssessmentSetupBrief(): AssessmentSetupBrief | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = readStorageWithLegacyFallback();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AssessmentSetupBrief>;

    if (!isAssessmentType(parsed.assessmentType)) {
      return null;
    }

    if (!isBuildPriority(parsed.buildPriority)) {
      return null;
    }

    if (!isPaperStructure(parsed.paperStructure)) {
      return null;
    }

    return {
      courseId: parsed.courseId,

      assessmentType: parsed.assessmentType,
      buildPriority: parsed.buildPriority,
      paperStructure: parsed.paperStructure,

      includeCoverSheet: Boolean(parsed.includeCoverSheet),
      includeFormulaSheet: Boolean(parsed.includeFormulaSheet),

      marksTargetP1: readNullableNumber(parsed.marksTargetP1),
      marksTargetP2: readNullableNumber(parsed.marksTargetP2),
      timeTargetP1: readNullableNumber(parsed.timeTargetP1),
      timeTargetP2: readNullableNumber(parsed.timeTargetP2),

      assessmentName: readRequiredString(
        parsed.assessmentName,
        "[Untitled file]"
      ),
      className: readString(parsed.className, ""),
      assessmentDate: readRequiredString(
        parsed.assessmentDate,
        new Date().toISOString().slice(0, 10)
      ),

      createdAt:
        typeof parsed.createdAt === "number" && Number.isFinite(parsed.createdAt)
          ? parsed.createdAt
          : Date.now(),
    };
  } catch {
    return null;
  }
}