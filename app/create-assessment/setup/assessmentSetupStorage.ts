export const ASSESSMENT_SETUP_STORAGE_KEY = "n5-assessment-setup-brief";

export type AssessmentType = "PRELIM" | "CLASS_TEST" | "HOMEWORK";
export type BuildPriority = "MARKS" | "TIME";
export type PaperStructure = "BOTH" | "P1_ONLY" | "P2_ONLY";

export type AssessmentSetupBrief = {
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

    if (
      parsed.assessmentType !== "PRELIM" &&
      parsed.assessmentType !== "CLASS_TEST" &&
      parsed.assessmentType !== "HOMEWORK"
    ) {
      return null;
    }

    if (parsed.buildPriority !== "MARKS" && parsed.buildPriority !== "TIME") {
      return null;
    }

    if (
      parsed.paperStructure !== "BOTH" &&
      parsed.paperStructure !== "P1_ONLY" &&
      parsed.paperStructure !== "P2_ONLY"
    ) {
      return null;
    }

    return {
      assessmentType: parsed.assessmentType,
      buildPriority: parsed.buildPriority,
      paperStructure: parsed.paperStructure,
      includeCoverSheet: Boolean(parsed.includeCoverSheet),
      includeFormulaSheet: Boolean(parsed.includeFormulaSheet),
      marksTargetP1:
        typeof parsed.marksTargetP1 === "number" ? parsed.marksTargetP1 : null,
      marksTargetP2:
        typeof parsed.marksTargetP2 === "number" ? parsed.marksTargetP2 : null,
      timeTargetP1:
        typeof parsed.timeTargetP1 === "number" ? parsed.timeTargetP1 : null,
      timeTargetP2:
        typeof parsed.timeTargetP2 === "number" ? parsed.timeTargetP2 : null,
      assessmentName:
        typeof parsed.assessmentName === "string" && parsed.assessmentName.trim().length
          ? parsed.assessmentName
          : "[Untitled file]",
      className: typeof parsed.className === "string" ? parsed.className : "",
      assessmentDate:
        typeof parsed.assessmentDate === "string" && parsed.assessmentDate.trim().length
          ? parsed.assessmentDate
          : new Date().toISOString().slice(0, 10),
      createdAt:
        typeof parsed.createdAt === "number" && Number.isFinite(parsed.createdAt)
          ? parsed.createdAt
          : Date.now(),
    };
  } catch {
    return null;
  }
}