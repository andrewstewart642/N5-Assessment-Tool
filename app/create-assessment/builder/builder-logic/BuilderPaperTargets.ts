import {
  coursePaperMatchesSuitability,
  findCoursePaperConfigForSuitability,
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

const LEGACY_DEFAULT_PAPER_ID: Paper = "P1";

export type BuilderPaperTargetInputs = {
  p1Target: number;
  p2Target: number;
};

export type BuilderTargetMarksByPaper = Partial<Record<Paper, number>>;

function buildLegacyPaperTargetInputMap({
  p1Target,
  p2Target,
}: BuilderPaperTargetInputs): BuilderTargetMarksByPaper {
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
  return [...courseConfig.papers]
    .sort((a, b) => a.order - b.order)
    .map((paper) => paper.id);
}

export function getBuilderPaperConfig(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): CoursePaperConfig {
  const exactPaperConfig = courseConfig.papers.find(
    (paperConfig) => paperConfig.id === paper
  );

  if (exactPaperConfig) {
    return exactPaperConfig;
  }

  const aliasPaperConfig = findCoursePaperConfigForSuitability(
    courseConfig,
    paper
  );

  if (aliasPaperConfig) {
    return aliasPaperConfig;
  }

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

export function getDefaultBuilderPaper(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): Paper {
  return getBuilderPapers(courseConfig)[0] ?? LEGACY_DEFAULT_PAPER_ID;
}

export function getDefaultTargetMarksForPaper(
  paper: Paper,
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): number {
  return getBuilderPaperConfig(paper, courseConfig).defaultTargetMarks;
}

export function buildDefaultTargetMarksByPaper(
  courseConfig: CourseAssessmentConfig = getBuilderCourseConfig()
): BuilderTargetMarksByPaper {
  return getBuilderPapers(courseConfig).reduce<BuilderTargetMarksByPaper>(
    (targets, paper) => {
      targets[paper] = getDefaultTargetMarksForPaper(paper, courseConfig);
      return targets;
    },
    {}
  );
}

export function normaliseTargetMarksByPaper({
  targetMarksByPaper,
  courseConfig = getBuilderCourseConfig(),
}: {
  targetMarksByPaper: BuilderTargetMarksByPaper;
  courseConfig?: CourseAssessmentConfig;
}): BuilderTargetMarksByPaper {
  return getBuilderPapers(courseConfig).reduce<BuilderTargetMarksByPaper>(
    (targets, paper) => {
      const currentValue = targetMarksByPaper[paper];

      targets[paper] =
        typeof currentValue === "number" && Number.isFinite(currentValue)
          ? currentValue
          : getDefaultTargetMarksForPaper(paper, courseConfig);

      return targets;
    },
    {}
  );
}

export function buildTargetMarksByPaperFromValues({
  targetMarksByPaper,
  courseConfig = getBuilderCourseConfig(),
}: {
  targetMarksByPaper: BuilderTargetMarksByPaper;
  courseConfig?: CourseAssessmentConfig;
}): BuilderTargetMarksByPaper {
  return getBuilderPapers(courseConfig).reduce<BuilderTargetMarksByPaper>(
    (targets, paper) => {
      const targetMarks = targetMarksByPaper[paper];

      if (typeof targetMarks === "number" && Number.isFinite(targetMarks)) {
        targets[paper] = targetMarks;
      }

      return targets;
    },
    {}
  );
}

export function buildTargetMarksByPaper({
  p1Target,
  p2Target,
  courseConfig = getBuilderCourseConfig(),
}: BuilderPaperTargetInputs & {
  courseConfig?: CourseAssessmentConfig;
}): BuilderTargetMarksByPaper {
  return buildTargetMarksByPaperFromValues({
    targetMarksByPaper: buildLegacyPaperTargetInputMap({
      p1Target,
      p2Target,
    }),
    courseConfig,
  });
}

export function getIncludedPapersFromTargets({
  targetMarksByPaper,
  courseConfig = getBuilderCourseConfig(),
}: {
  targetMarksByPaper: BuilderTargetMarksByPaper;
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
}): BuilderTargetMarksByPaper {
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

  return getBuilderPapers(courseConfig).reduce<BuilderTargetMarksByPaper>(
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

  const paperConfig = findCoursePaperConfigForSuitability(
    courseConfig,
    paperSuitability
  );

  return paperConfig?.label ?? paperSuitability;
}

export function isPaperSuitableForSkill({
  paper,
  paperSuitability,
  courseConfig = getBuilderCourseConfig(),
}: {
  paper: Paper;
  paperSuitability: SkillPaperSuitability;
  courseConfig?: CourseAssessmentConfig;
}): boolean {
  if (paperSuitability === "BOTH") {
    return true;
  }

  const paperConfig = getBuilderPaperConfig(paper, courseConfig);

  return coursePaperMatchesSuitability({
    paperConfig,
    paperSuitability,
  });
}