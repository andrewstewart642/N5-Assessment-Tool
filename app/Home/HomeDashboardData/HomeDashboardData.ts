import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  SchoolClass,
} from "@/app/Classes/ClassTypes";

import {
  getCourseCoverage,
} from "@/app/Classes/Coverage/ClassCoverageHelpers";

import {
  getCourseCatalogEntry,
} from "@/app/Courses/CourseCatalog";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";


export type HomeAssessmentProgress = {
  assignedMarks:
    number;

  targetMarks:
    number;

  progressPct:
    number;
};


export type HomeClassCoverage = {
  completedSkills:
    number;

  totalSkills:
    number;

  progressPct:
    number;
};


function clampProgress(
  value:
    number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      value
    )
  );
}


function getIncludedPapers(
  assessment:
    SavedAssessment
): Array<
  "P1" | "P2"
> {
  const structure =
    assessment.setup
      .paperStructure;


  if (
    structure ===
    "P1_ONLY"
  ) {
    return [
      "P1",
    ];
  }


  if (
    structure ===
    "P2_ONLY"
  ) {
    return [
      "P2",
    ];
  }


  return [
    "P1",
    "P2",
  ];
}


function getTargetMarksForPaper(
  assessment:
    SavedAssessment,

  paper:
    "P1" | "P2"
): number {
  const modernTarget =
    assessment.builder
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
    ? assessment.builder
        .p1Target
    : assessment.builder
        .p2Target;
}


export function getHomeAssessmentProgress(
  assessment:
    SavedAssessment
): HomeAssessmentProgress {
  const papers =
    getIncludedPapers(
      assessment
    );


  const assignedMarks =
    assessment.builder
      .questions
      .filter(
        (
          question
        ) =>
          papers.includes(
            question.paper as
              "P1" | "P2"
          )
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


  const targetMarks =
    papers.reduce(
      (
        total,
        paper
      ) =>
        total +
        getTargetMarksForPaper(
          assessment,
          paper
        ),
      0
    );


  const progressPct =
    targetMarks >
    0
      ? clampProgress(
          (
            assignedMarks /
            targetMarks
          ) *
            100
        )
      : 0;


  return {
    assignedMarks,

    targetMarks,

    progressPct,
  };
}


export function getHomeAssessmentName(
  assessment:
    SavedAssessment
): string {
  return (
    assessment.setup
      .assessmentName
      .trim() ||
    "[Untitled assessment]"
  );
}


export function getHomeAssessmentCourseId(
  assessment:
    SavedAssessment
): CourseId | null {
  const course =
    getCourseCatalogEntry(
      assessment.setup
        .courseId ??
        assessment.setup
          .levelId
    );


  return (
    course?.id ??
    null
  );
}


export function getHomeAssessmentCourseLabel(
  assessment:
    SavedAssessment
): string {
  const course =
    getCourseCatalogEntry(
      assessment.setup
        .courseId ??
        assessment.setup
          .levelId
    );


  return (
    course?.label ??
    "Unknown course"
  );
}


export function getHomeAssessmentTypeLabel(
  assessment:
    SavedAssessment
): string {
  switch (
    assessment.setup
      .assessmentType
  ) {
    case "PRELIM":
      return "PRELIM";

    case "CLASS_TEST":
      return "CLASS TEST";

    case "HOMEWORK":
      return "HOMEWORK";

    case "CHECK_TEST":
      return "CHECK TEST";

    case "CUSTOM":
      return "CUSTOM";

    default:
      return "ASSESSMENT";
  }
}


export function getHomeAssessmentClassLabel(
  assessment:
    SavedAssessment
): string {
  if (
    assessment.setup
      .useCompleteCourseCoverage
  ) {
    return "Full course coverage";
  }


  const className =
    assessment.setup
      .className
      .trim();


  if (
    className
  ) {
    return className;
  }


  const classCount =
    assessment.setup
      .selectedClassIds
      .length;


  if (
    classCount ===
    1
  ) {
    return "1 class linked";
  }


  if (
    classCount >
    1
  ) {
    return `${classCount} classes linked`;
  }


  return "No class selected";
}


export function parseHomeAssessmentDate(
  value:
    string
): Date | null {
  const trimmed =
    value.trim();


  if (
    !trimmed
  ) {
    return null;
  }


  const britishMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );


  if (
    britishMatch
  ) {
    const [
      ,
      day,
      month,
      year,
    ] =
      britishMatch;


    const parsed =
      new Date(
        Number(
          year
        ),
        Number(
          month
        ) -
          1,
        Number(
          day
        )
      );


    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed;
  }


  const isoMatch =
    trimmed.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    );


  if (
    isoMatch
  ) {
    const [
      ,
      year,
      month,
      day,
    ] =
      isoMatch;


    const parsed =
      new Date(
        Number(
          year
        ),
        Number(
          month
        ) -
          1,
        Number(
          day
        )
      );


    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed;
  }


  const parsedTimestamp =
    Date.parse(
      trimmed
    );


  if (
    !Number.isFinite(
      parsedTimestamp
    )
  ) {
    return null;
  }


  return new Date(
    parsedTimestamp
  );
}


export function startOfHomeDay(
  value:
    Date
): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  );
}


export function getHomeDateKey(
  value:
    Date
): string {
  const year =
    value.getFullYear();

  const month =
    String(
      value.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      value.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;
}


export function formatHomeShortDate(
  value:
    Date
): string {
  return value.toLocaleDateString(
    "en-GB",
    {
      day:
        "numeric",

      month:
        "short",
    }
  );
}


export function formatHomeFullDate(
  value:
    Date
): string {
  return value.toLocaleDateString(
    "en-GB",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric",
    }
  );
}


export function getDaysUntilHomeDate(
  futureDate:
    Date,

  today:
    Date
): number {
  const future =
    startOfHomeDay(
      futureDate
    ).getTime();

  const current =
    startOfHomeDay(
      today
    ).getTime();


  return Math.round(
    (
      future -
      current
    ) /
      86400000
  );
}


export function getUpcomingHomeAssessments(
  assessments:
    SavedAssessment[],

  today:
    Date
): SavedAssessment[] {
  const todayTimestamp =
    startOfHomeDay(
      today
    ).getTime();


  return assessments
    .filter(
      (
        assessment
      ) => {
        const date =
          parseHomeAssessmentDate(
            assessment.setup
              .assessmentDate
          );


        if (
          !date
        ) {
          return false;
        }


        return (
          startOfHomeDay(
            date
          ).getTime() >=
          todayTimestamp
        );
      }
    )
    .sort(
      (
        first,
        second
      ) => {
        const firstDate =
          parseHomeAssessmentDate(
            first.setup
              .assessmentDate
          );

        const secondDate =
          parseHomeAssessmentDate(
            second.setup
              .assessmentDate
          );


        return (
          (
            firstDate?.getTime() ??
            0
          ) -
          (
            secondDate?.getTime() ??
            0
          )
        );
      }
    );
}


export function getMostRecentlyEditedHomeAssessment(
  assessments:
    SavedAssessment[]
): SavedAssessment | null {
  return (
    [
      ...assessments,
    ].sort(
      (
        first,
        second
      ) =>
        second.updatedAt -
        first.updatedAt
    )[0] ??
    null
  );
}


export function getHomeClassCoverage(
  schoolClass:
    SchoolClass
): HomeClassCoverage {
  try {
    return getCourseCoverage(
      schoolClass.courseId,
      schoolClass.completedConceptIds,
      schoolClass.completedSkillIds
    );
  } catch {
    return {
      completedSkills:
        schoolClass
          .completedSkillIds
          .length,

      totalSkills:
        0,

      progressPct:
        0,
    };
  }
}