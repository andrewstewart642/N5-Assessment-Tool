import type {
  CourseAssessmentConfig,
  CourseAssessmentStructureId,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  BuildPriority,
} from "../Setup/AssessmentSetupStorage";

import {
  getAssessmentPaperConfig,
  getAssessmentPapers,
  getAssessmentStructure,
  getDefaultAssessmentPaper,
  getDefaultTargetMarksForAssessmentPaper,
} from "./AssessmentPaperRules";

export type AssessmentPaperTargetInputs = {
  p1Target: number;
  p2Target: number;
};

export type AssessmentTargetMarksByPaper =
  Partial<
    Record<
      Paper,
      number
    >
  >;

function buildLegacyPaperTargetInputMap({
  p1Target,
  p2Target,
}: AssessmentPaperTargetInputs): AssessmentTargetMarksByPaper {
  return {
    P1: p1Target,
    P2: p2Target,
  };
}

export function buildDefaultAssessmentTargetMarksByPaper(
  courseConfig?:
    CourseAssessmentConfig
): AssessmentTargetMarksByPaper {
  return getAssessmentPapers(
    courseConfig
  ).reduce<AssessmentTargetMarksByPaper>(
    (
      targets,
      paper
    ) => {
      targets[paper] =
        getDefaultTargetMarksForAssessmentPaper(
          paper,
          courseConfig
        );

      return targets;
    },
    {}
  );
}

export function normaliseAssessmentTargetMarksByPaper({
  targetMarksByPaper,
  courseConfig,
}: {
  targetMarksByPaper:
    AssessmentTargetMarksByPaper;

  courseConfig?:
    CourseAssessmentConfig;
}): AssessmentTargetMarksByPaper {
  return getAssessmentPapers(
    courseConfig
  ).reduce<AssessmentTargetMarksByPaper>(
    (
      targets,
      paper
    ) => {
      const currentValue =
        targetMarksByPaper[
          paper
        ];

      targets[paper] =
        typeof currentValue ===
          "number" &&
        Number.isFinite(
          currentValue
        )
          ? currentValue
          : getDefaultTargetMarksForAssessmentPaper(
              paper,
              courseConfig
            );

      return targets;
    },
    {}
  );
}

export function buildAssessmentTargetMarksByPaperFromValues({
  targetMarksByPaper,
  courseConfig,
}: {
  targetMarksByPaper:
    AssessmentTargetMarksByPaper;

  courseConfig?:
    CourseAssessmentConfig;
}): AssessmentTargetMarksByPaper {
  return getAssessmentPapers(
    courseConfig
  ).reduce<AssessmentTargetMarksByPaper>(
    (
      targets,
      paper
    ) => {
      const targetMarks =
        targetMarksByPaper[
          paper
        ];

      if (
        typeof targetMarks ===
          "number" &&
        Number.isFinite(
          targetMarks
        )
      ) {
        targets[paper] =
          targetMarks;
      }

      return targets;
    },
    {}
  );
}

export function buildAssessmentTargetMarksByPaper({
  p1Target,
  p2Target,
  courseConfig,
}: AssessmentPaperTargetInputs & {
  courseConfig?:
    CourseAssessmentConfig;
}): AssessmentTargetMarksByPaper {
  return buildAssessmentTargetMarksByPaperFromValues({
    targetMarksByPaper:
      buildLegacyPaperTargetInputMap({
        p1Target,
        p2Target,
      }),

    courseConfig,
  });
}

export function getIncludedAssessmentPapersFromTargets({
  targetMarksByPaper,
  courseConfig,
}: {
  targetMarksByPaper:
    AssessmentTargetMarksByPaper;

  courseConfig?:
    CourseAssessmentConfig;
}): Paper[] {
  return getAssessmentPapers(
    courseConfig
  ).filter(
    (paper) => {
      const targetMarks =
        targetMarksByPaper[
          paper
        ];

      return (
        typeof targetMarks ===
          "number" &&
        Number.isFinite(
          targetMarks
        ) &&
        targetMarks > 0
      );
    }
  );
}

export function getInitialAssessmentPaperForStructure({
  paperStructure,
  courseConfig,
}: {
  paperStructure:
    CourseAssessmentStructureId;

  courseConfig?:
    CourseAssessmentConfig;
}): Paper {
  const structure =
    getAssessmentStructure(
      paperStructure,
      courseConfig
    );

  return (
    structure
      ?.includedPapers[0] ??
    getDefaultAssessmentPaper(
      courseConfig
    )
  );
}

export function estimateMarksFromTimeForAssessmentPaper({
  paper,
  minutes,
  courseConfig,
}: {
  paper: Paper;

  minutes: number;

  courseConfig?:
    CourseAssessmentConfig;
}): number {
  const paperConfig =
    getAssessmentPaperConfig(
      paper,
      courseConfig
    );

  return Math.max(
    1,
    Math.floor(
      minutes /
        paperConfig.minutesPerMark
    )
  );
}

export function getAssessmentPaperTargetFromSetupTarget({
  paper,
  buildPriority,
  marksTarget,
  timeTarget,
  courseConfig,
}: {
  paper: Paper;

  buildPriority:
    BuildPriority;

  marksTarget:
    number | null;

  timeTarget:
    number | null;

  courseConfig?:
    CourseAssessmentConfig;
}): number | null {
  if (
    buildPriority ===
    "MARKS"
  ) {
    return (
      typeof marksTarget ===
        "number" &&
      marksTarget > 0
        ? marksTarget
        : null
    );
  }

  if (
    buildPriority ===
    "TIME"
  ) {
    return (
      typeof timeTarget ===
        "number" &&
      timeTarget > 0
        ? estimateMarksFromTimeForAssessmentPaper({
            paper,
            minutes:
              timeTarget,
            courseConfig,
          })
        : null
    );
  }

  return null;
}

export function buildAssessmentTargetMarksByPaperFromSetupTargets({
  buildPriority,
  marksTargetP1,
  marksTargetP2,
  timeTargetP1,
  timeTargetP2,
  courseConfig,
}: {
  buildPriority:
    BuildPriority;

  marksTargetP1:
    number | null;

  marksTargetP2:
    number | null;

  timeTargetP1:
    number | null;

  timeTargetP2:
    number | null;

  courseConfig?:
    CourseAssessmentConfig;
}): AssessmentTargetMarksByPaper {
  const setupTargetsByPaper:
    Partial<
      Record<
        Paper,
        {
          marksTarget:
            number | null;

          timeTarget:
            number | null;
        }
      >
    > = {
    P1: {
      marksTarget:
        marksTargetP1,

      timeTarget:
        timeTargetP1,
    },

    P2: {
      marksTarget:
        marksTargetP2,

      timeTarget:
        timeTargetP2,
    },
  };

  return getAssessmentPapers(
    courseConfig
  ).reduce<AssessmentTargetMarksByPaper>(
    (
      targets,
      paper
    ) => {
      const setupTarget =
        setupTargetsByPaper[
          paper
        ];

      if (!setupTarget) {
        return targets;
      }

      const targetMarks =
        getAssessmentPaperTargetFromSetupTarget({
          paper,
          buildPriority,

          marksTarget:
            setupTarget.marksTarget,

          timeTarget:
            setupTarget.timeTarget,

          courseConfig,
        });

      if (
        targetMarks !==
        null
      ) {
        targets[paper] =
          targetMarks;
      }

      return targets;
    },
    {}
  );
}