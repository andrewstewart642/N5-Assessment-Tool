import {
  getCoursePaperConfig,
  type CourseAssessmentConfig,
  type CourseAssessmentStructureId,
  type CoursePaperConfig,
} from "@/course-data/course-configs/CourseConfigTypes";
import type {
  Paper,
  Question,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes";
import type { BuildPriority } from "../../setup/AssessmentSetupStorage";
import { getBuilderCourseConfig } from "./BuilderCourseConfig";

export type BuilderPaperTargetInputs = {
  p1Target: number;
  p2Target: number;
};

function buildLegacyPaperTargetInputMap({
  p1Target,
  p2Target,
}: BuilderPaperTargetInputs): Partial<Record<Paper, number>> {
  return {
    P1: p1Target,
    P2: p2Target,
  };
}

type BuilderEditQuestionDraft =
  | null
  | {
      questionIndex: number;
      original: Question;
      draft: Question;
    };

type BuilderAssessmentStructure =
  CourseAssessmentConfig["assessmentStructures"][number];

export function getBuilderPapers(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): Paper[] {
  return courseConfig.papers.map((paper) => paper.id);
}

export function getBuilderPaperConfig(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): CoursePaperConfig {
  return getCoursePaperConfig(courseConfig, paper);
}

export function getBuilderAssessmentStructure(
  paperStructure: CourseAssessmentStructureId,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): BuilderAssessmentStructure | null {
  return (
    courseConfig.assessmentStructures.find(
      (structure) => structure.id === paperStructure
    ) ?? null
  );
}

export function getDefaultTargetMarksForPaper(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): number {
  return getBuilderPaperConfig(paper, courseConfig).defaultTargetMarks;
}

export function buildTargetMarksByPaper({
  p1Target,
  p2Target,
  courseConfig = getBuilderCourseConfig(),
}: BuilderPaperTargetInputs & {
  courseConfig?: CourseAssessmentConfig;
}): Partial<Record<Paper, number>> {
  const targetInputsByPaper = buildLegacyPaperTargetInputMap({
    p1Target,
    p2Target,
  });

  return getBuilderPapers(courseConfig).reduce<Partial<Record<Paper, number>>>(
    (targets, paper) => {
      const targetMarks = targetInputsByPaper[paper];

      if (typeof targetMarks === "number" && Number.isFinite(targetMarks)) {
        targets[paper] = targetMarks;
      }

      return targets;
    },
    {}
  );
}

export function getIncludedPapersFromTargets({
  targetMarksByPaper,
  courseConfig = getBuilderCourseConfig(),
}: {
  targetMarksByPaper: Partial<Record<Paper, number>>;
  courseConfig?: CourseAssessmentConfig;
}): Paper[] {
  return getBuilderPapers(courseConfig).filter((paper) => {
    const targetMarks = targetMarksByPaper[paper];

    return (
      typeof targetMarks === "number" &&
      Number.isFinite(targetMarks) &&
      targetMarks > 0
    );
  });
}

export function getDefaultBuilderPaper(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): Paper {
  return getBuilderPapers(courseConfig)[0] ?? "P1";
}

export function getInitialBuilderPaperForStructure({
  paperStructure,
  courseConfig = getBuilderCourseConfig(),
}: {
  paperStructure: CourseAssessmentStructureId;
  courseConfig?: CourseAssessmentConfig;
}): Paper {
  const structure = getBuilderAssessmentStructure(paperStructure, courseConfig);

  return structure?.includedPapers[0] ?? getDefaultBuilderPaper(courseConfig);
}

export function estimateMarksFromTimeForPaper({
  paper,
  minutes,
  courseConfig = getBuilderCourseConfig(),
}: {
  paper: Paper;
  minutes: number;
  courseConfig?: CourseAssessmentConfig;
}): number {
  const paperConfig = getBuilderPaperConfig(paper, courseConfig);
  return Math.max(1, Math.floor(minutes / paperConfig.minutesPerMark));
}

export function getTargetMarksForPaperFromSetupTarget({
  paper,
  buildPriority,
  marksTarget,
  timeTarget,
  courseConfig = getBuilderCourseConfig(),
}: {
  paper: Paper;
  buildPriority: BuildPriority;
  marksTarget: number | null;
  timeTarget: number | null;
  courseConfig?: CourseAssessmentConfig;
}): number | null {
  if (buildPriority === "MARKS") {
    return typeof marksTarget === "number" && marksTarget > 0
      ? marksTarget
      : null;
  }

  if (buildPriority === "TIME") {
    return typeof timeTarget === "number" && timeTarget > 0
      ? estimateMarksFromTimeForPaper({
          paper,
          minutes: timeTarget,
          courseConfig,
        })
      : null;
  }

  return null;
}

export function buildTargetMarksByPaperFromSetupTargets({
  buildPriority,
  marksTargetP1,
  marksTargetP2,
  timeTargetP1,
  timeTargetP2,
  courseConfig = getBuilderCourseConfig(),
}: {
  buildPriority: BuildPriority;
  marksTargetP1: number | null;
  marksTargetP2: number | null;
  timeTargetP1: number | null;
  timeTargetP2: number | null;
  courseConfig?: CourseAssessmentConfig;
}): Partial<Record<Paper, number>> {
  const setupTargetsByPaper: Partial<
    Record<
      Paper,
      {
        marksTarget: number | null;
        timeTarget: number | null;
      }
    >
  > = {
    P1: {
      marksTarget: marksTargetP1,
      timeTarget: timeTargetP1,
    },
    P2: {
      marksTarget: marksTargetP2,
      timeTarget: timeTargetP2,
    },
  };

  return getBuilderPapers(courseConfig).reduce<Partial<Record<Paper, number>>>(
    (targets, paper) => {
      const setupTarget = setupTargetsByPaper[paper];

      if (!setupTarget) {
        return targets;
      }

      const targetMarks = getTargetMarksForPaperFromSetupTarget({
        paper,
        buildPriority,
        marksTarget: setupTarget.marksTarget,
        timeTarget: setupTarget.timeTarget,
        courseConfig,
      });

      if (targetMarks !== null) {
        targets[paper] = targetMarks;
      }

      return targets;
    },
    {}
  );
}

export function buildEmptyQuestionDraftsByPaper(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): Record<Paper, Question | null> {
  return getBuilderPapers(courseConfig).reduce<
    Partial<Record<Paper, Question | null>>
  >(
    (drafts, paper) => {
      drafts[paper] = null;
      return drafts;
    },
    {}
  ) as Record<Paper, Question | null>;
}

export function buildEmptyEditDraftsByPaper(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): Record<Paper, BuilderEditQuestionDraft> {
  return getBuilderPapers(courseConfig).reduce<
    Partial<Record<Paper, BuilderEditQuestionDraft>>
  >(
    (drafts, paper) => {
      drafts[paper] = null;
      return drafts;
    },
    {}
  ) as Record<Paper, BuilderEditQuestionDraft>;
}

export function getBuilderPaperLabel(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): string {
  return getBuilderPaperConfig(paper, courseConfig).label;
}

export function formatBuilderPaperSuitability(
  paperSuitability: SkillPaperSuitability,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): string {
  if (paperSuitability === "BOTH") {
    return "both papers";
  }

  return getBuilderPaperLabel(paperSuitability, courseConfig);
}

export function isPaperSuitableForSkill({
  paper,
  paperSuitability,
}: {
  paper: Paper;
  paperSuitability: SkillPaperSuitability;
}): boolean {
  return paperSuitability === "BOTH" || paperSuitability === paper;
}