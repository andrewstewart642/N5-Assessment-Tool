import type { CourseId } from "@/shared-types/AssessmentTypes";

export const ASSESSMENT_SETUP_STORAGE_KEY = "n5-assessment-setup-brief";

/**
 * These are the assessment modes currently supported by the setup flow.
 *
 * CHECK_TEST and CUSTOM are already allowed here because the course config
 * supports them. The UI can choose whether to show them now or later.
 */
export type AssessmentType =
  | "PRELIM"
  | "CLASS_TEST"
  | "HOMEWORK"
  | "CHECK_TEST"
  | "CUSTOM";

export type BuildPriority = "MARKS" | "TIME";

/**
 * Temporary N5-style paper structure.
 *
 * This will eventually become course-config-driven more fully, but for now
 * these IDs match the N5 assessment structures already defined in
 * N5MathsCourseConfig.ts.
 */
export type PaperStructure = "BOTH" | "P1_ONLY" | "P2_ONLY";

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
    const raw = window.localStorage.getItem(ASSESSMENT_SETUP_STORAGE_KEY);
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