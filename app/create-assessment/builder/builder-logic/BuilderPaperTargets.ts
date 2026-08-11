import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";
import {
  getCoursePaperConfig,
  type CourseAssessmentConfig,
  type CourseAssessmentStructureId,
} from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes";

export type BuilderPaperTargetInputs = {
  p1Target: number;
  p2Target: number;
};

export function getDefaultTargetMarksForPaper(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = ACTIVE_COURSE_CONFIG
): number {
  return getCoursePaperConfig(courseConfig, paper).defaultTargetMarks;
}

export function buildTargetMarksByPaper({
  p1Target,
  p2Target,
  courseConfig = ACTIVE_COURSE_CONFIG,
}: BuilderPaperTargetInputs & {
  courseConfig?: CourseAssessmentConfig;
}): Partial<Record<Paper, number>> {
  return courseConfig.papers.reduce<Partial<Record<Paper, number>>>(
    (targets, paper) => {
      if (paper.id === "P1") {
        targets[paper.id] = p1Target;
      }

      if (paper.id === "P2") {
        targets[paper.id] = p2Target;
      }

      return targets;
    },
    {}
  );
}

export function getIncludedPapersFromTargets({
  targetMarksByPaper,
  courseConfig = ACTIVE_COURSE_CONFIG,
}: {
  targetMarksByPaper: Partial<Record<Paper, number>>;
  courseConfig?: CourseAssessmentConfig;
}): Paper[] {
  return courseConfig.papers
    .map((paper) => paper.id)
    .filter((paper) => {
      const targetMarks = targetMarksByPaper[paper];

      return (
        typeof targetMarks === "number" &&
        Number.isFinite(targetMarks) &&
        targetMarks > 0
      );
    });
}

export function getDefaultBuilderPaper(
  courseConfig: CourseAssessmentConfig = ACTIVE_COURSE_CONFIG
): Paper {
  return courseConfig.papers[0]?.id ?? "P1";
}

export function getInitialBuilderPaperForStructure({
  paperStructure,
  courseConfig = ACTIVE_COURSE_CONFIG,
}: {
  paperStructure: CourseAssessmentStructureId;
  courseConfig?: CourseAssessmentConfig;
}): Paper {
  const structure = courseConfig.assessmentStructures.find(
    (item) => item.id === paperStructure
  );

  return structure?.includedPapers[0] ?? getDefaultBuilderPaper(courseConfig);
}

export function estimateMarksFromTimeForPaper({
  paper,
  minutes,
  courseConfig = ACTIVE_COURSE_CONFIG,
}: {
  paper: Paper;
  minutes: number;
  courseConfig?: CourseAssessmentConfig;
}): number {
  const paperConfig = getCoursePaperConfig(courseConfig, paper);
  return Math.max(1, Math.floor(minutes / paperConfig.minutesPerMark));
}