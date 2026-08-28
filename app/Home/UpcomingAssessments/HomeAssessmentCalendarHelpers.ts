import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  SchoolClass,
} from "@/app/Classes/ClassData";

import {
  getHomeAssessmentProgress,
  parseHomeAssessmentDate,
  startOfHomeDay,
} from "../HomeDashboardData/HomeDashboardData";


export type HomeCalendarAssessmentStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "READY_FOR_PRINT"
  | "COMPLETE";


export function getCalendarAssessmentStatus(
  assessment:
    SavedAssessment
): HomeCalendarAssessmentStatus {
  if (
    assessment.status ===
    "COMPLETE"
  ) {
    return "COMPLETE";
  }


  const progress =
    getHomeAssessmentProgress(
      assessment
    );


  if (
    progress.targetMarks >
      0 &&
    progress.progressPct >=
      100
  ) {
    return "READY_FOR_PRINT";
  }


  if (
    progress.assignedMarks >
    0
  ) {
    return "IN_PROGRESS";
  }


  return "NOT_STARTED";
}


export function getCalendarAssessmentStatusLabel(
  assessment:
    SavedAssessment
): string {
  switch (
    getCalendarAssessmentStatus(
      assessment
    )
  ) {
    case "COMPLETE":
      return "Complete";

    case "READY_FOR_PRINT":
      return "Ready for print";

    case "IN_PROGRESS":
      return "In progress";

    case "NOT_STARTED":
    default:
      return "Not started";
  }
}


export function getCalendarAssessmentClassLabels(
  assessment:
    SavedAssessment,

  classes:
    SchoolClass[]
): string[] {
  const linkedClassNames =
    assessment.setup
      .selectedClassIds
      .map(
        (
          classId
        ) =>
          classes.find(
            (
              schoolClass
            ) =>
              schoolClass.id ===
              classId
          )?.name
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(
            value
          )
      );


  if (
    linkedClassNames.length >
    0
  ) {
    return Array.from(
      new Set(
        linkedClassNames
      )
    );
  }


  const explicitClassName =
    assessment.setup
      .className
      .trim();


  if (
    explicitClassName
  ) {
    return [
      explicitClassName,
    ];
  }


  if (
    assessment.setup
      .useCompleteCourseCoverage
  ) {
    return [
      "Whole course",
    ];
  }


  return [
    "Unassigned",
  ];
}


export function getCalendarAssessmentPrimaryClassLabel(
  assessment:
    SavedAssessment,

  classes:
    SchoolClass[]
): string {
  const labels =
    getCalendarAssessmentClassLabels(
      assessment,
      classes
    );


  if (
    labels.length <=
    1
  ) {
    return (
      labels[0] ??
      "Unassigned"
    );
  }


  return `${labels[0]} +${
    labels.length -
    1
  }`;
}


export function getCalendarPulseDurationSeconds(
  assessmentDate:
    Date,

  today:
    Date
): number {
  const assessmentDay =
    startOfHomeDay(
      assessmentDate
    ).getTime();

  const currentDay =
    startOfHomeDay(
      today
    ).getTime();


  const distanceInDays =
    Math.abs(
      Math.round(
        (
          assessmentDay -
          currentDay
        ) /
          86400000
      )
    );


  if (
    distanceInDays <=
    7
  ) {
    return 5;
  }


  if (
    distanceInDays <=
    14
  ) {
    return 10;
  }


  return 15;
}


export function getRecentHomeAssessments(
  assessments:
    SavedAssessment[],

  today:
    Date,

  limit =
    3
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
          ).getTime() <
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
            secondDate?.getTime() ??
            0
          ) -
          (
            firstDate?.getTime() ??
            0
          )
        );
      }
    )
    .slice(
      0,
      limit
    );
}