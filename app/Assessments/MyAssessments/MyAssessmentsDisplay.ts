import {
  ASSESSMENT_LEVEL_OPTIONS,
} from "@/app/Assessments/Creation/Setup/AssessmentClassCoverageStorage";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

export function formatDateTime(
  timestamp: number
): string {
  const date = new Date(timestamp);

  const timeText =
    date.toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const dateText =
    date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return `${timeText} ${dateText}`;
}

export function getLevelLabel(
  savedAssessment: SavedAssessment
): string {
  const match =
    ASSESSMENT_LEVEL_OPTIONS.find(
      (option) =>
        option.id ===
        savedAssessment.setup.levelId
    );

  return match?.label ?? "Unknown level";
}

export function getCoverageLabel(
  savedAssessment: SavedAssessment
): string {
  if (
    savedAssessment.setup
      .useCompleteCourseCoverage
  ) {
    return "Full course coverage";
  }

  if (
    savedAssessment.setup
      .selectedClassIds.length === 0
  ) {
    return "No classes selected";
  }

  if (
    savedAssessment.setup
      .selectedClassIds.length === 1
  ) {
    return "1 class linked";
  }

  return `${savedAssessment.setup.selectedClassIds.length} classes linked`;
}

export function getPaperStructureLabel(
  savedAssessment: SavedAssessment
): string {
  if (
    savedAssessment.setup.paperStructure ===
    "BOTH"
  ) {
    return "Paper 1 + Paper 2";
  }

  if (
    savedAssessment.setup.paperStructure ===
    "P1_ONLY"
  ) {
    return "Paper 1 only";
  }

  return "Paper 2 only";
}

export function getAssignedMarksForPaper(
  savedAssessment: SavedAssessment,
  paper: "P1" | "P2"
): number {
  return savedAssessment.builder.questions
    .filter(
      (question) =>
        question.paper === paper
    )
    .reduce(
      (total, question) =>
        total + question.targetMarks,
      0
    );
}

export function getTargetMarksForPaper(
  savedAssessment: SavedAssessment,
  paper: "P1" | "P2"
): number {
  return paper === "P1"
    ? savedAssessment.builder.p1Target
    : savedAssessment.builder.p2Target;
}

export function getOverallProgressPct(
  savedAssessment: SavedAssessment
): number {
  const assignedP1 =
    getAssignedMarksForPaper(
      savedAssessment,
      "P1"
    );

  const assignedP2 =
    getAssignedMarksForPaper(
      savedAssessment,
      "P2"
    );

  const targetP1 =
    getTargetMarksForPaper(
      savedAssessment,
      "P1"
    );

  const targetP2 =
    getTargetMarksForPaper(
      savedAssessment,
      "P2"
    );

  const totalAssigned =
    assignedP1 + assignedP2;

  const totalTarget =
    targetP1 + targetP2;

  if (totalTarget <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      (totalAssigned / totalTarget) *
        100
    )
  );
}

export function sortSavedAssessmentsForDisplay(
  savedAssessments: SavedAssessment[]
): SavedAssessment[] {
  return [...savedAssessments].sort(
    (a, b) => {
      if (
        a.isPinned !== b.isPinned
      ) {
        return a.isPinned ? -1 : 1;
      }

      return b.updatedAt - a.updatedAt;
    }
  );
}