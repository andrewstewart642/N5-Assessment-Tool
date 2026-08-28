import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";


export type AssessmentProgressPaper =
  | "P1"
  | "P2";


export type AssessmentPaperProgressDisplay = {
  paper:
    AssessmentProgressPaper;

  assignedMarks:
    number;

  targetMarks:
    number;

  progressPct:
    number;
};


export function isAssessmentPaperIncluded(
  savedAssessment:
    SavedAssessment,

  paper:
    AssessmentProgressPaper
): boolean {
  const structure =
    savedAssessment.setup
      .paperStructure;

  if (
    structure ===
    "BOTH"
  ) {
    return true;
  }

  if (
    structure ===
    "P1_ONLY"
  ) {
    return (
      paper ===
      "P1"
    );
  }

  return (
    paper ===
    "P2"
  );
}


export function getAssignedMarksForPaper(
  savedAssessment:
    SavedAssessment,

  paper:
    AssessmentProgressPaper
): number {
  return savedAssessment.builder
    .questions
    .filter(
      (
        question
      ) =>
        question.paper ===
        paper
    )
    .reduce(
      (
        total,
        question
      ) =>
        total +
        question.targetMarks,
      0
    );
}


export function getTargetMarksForPaper(
  savedAssessment:
    SavedAssessment,

  paper:
    AssessmentProgressPaper
): number {
  const modernTarget =
    savedAssessment.builder
      .targetMarksByPaper?.[
        paper
      ];

  if (
    typeof modernTarget ===
      "number" &&
    Number.isFinite(
      modernTarget
    )
  ) {
    return modernTarget;
  }

  return paper ===
    "P1"
    ? savedAssessment.builder
        .p1Target
    : savedAssessment.builder
        .p2Target;
}


function calculateProgressPct({
  assignedMarks,
  targetMarks,
}: {
  assignedMarks:
    number;

  targetMarks:
    number;
}): number {
  if (
    targetMarks <=
    0
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      (
        assignedMarks /
        targetMarks
      ) *
        100
    )
  );
}


export function getAssessmentPaperProgress(
  savedAssessment:
    SavedAssessment
): AssessmentPaperProgressDisplay[] {
  const papers:
    AssessmentProgressPaper[] = [
      "P1",
      "P2",
    ];

  return papers
    .filter(
      (
        paper
      ) =>
        isAssessmentPaperIncluded(
          savedAssessment,
          paper
        )
    )
    .map(
      (
        paper
      ) => {
        const assignedMarks =
          getAssignedMarksForPaper(
            savedAssessment,
            paper
          );

        const targetMarks =
          getTargetMarksForPaper(
            savedAssessment,
            paper
          );

        return {
          paper,

          assignedMarks,

          targetMarks,

          progressPct:
            calculateProgressPct({
              assignedMarks,
              targetMarks,
            }),
        };
      }
    );
}


export function getOverallProgressPct(
  savedAssessment:
    SavedAssessment
): number {
  const rows =
    getAssessmentPaperProgress(
      savedAssessment
    );

  const assignedMarks =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        row.assignedMarks,
      0
    );

  const targetMarks =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        row.targetMarks,
      0
    );

  return calculateProgressPct({
    assignedMarks,
    targetMarks,
  });
}