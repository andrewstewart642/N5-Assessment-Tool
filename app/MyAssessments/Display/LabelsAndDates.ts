import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  getCourseCatalogEntry,
} from "@/app/Courses/CourseCatalog";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";


function formatDateObject(
  date:
    Date
): string {
  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const year =
    String(
      date.getFullYear()
    );

  return `${day}/${month}/${year}`;
}


export function formatDate(
  timestamp:
    number
): string {
  return formatDateObject(
    new Date(
      timestamp
    )
  );
}


export function formatTime(
  timestamp:
    number
): string {
  return new Date(
    timestamp
  ).toLocaleTimeString(
    "en-GB",
    {
      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    }
  );
}


export function formatDateTime(
  timestamp:
    number
): string {
  return `${formatTime(
    timestamp
  )} ${formatDate(
    timestamp
  )}`;
}


export function formatAssessmentDate(
  value:
    string
): string {
  const trimmed =
    value.trim();


  if (
    !trimmed
  ) {
    return "—";
  }


  const britishDateMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );


  if (
    britishDateMatch
  ) {
    const [
      ,
      day,
      month,
      year,
    ] =
      britishDateMatch;


    return `${day.padStart(
      2,
      "0"
    )}/${month.padStart(
      2,
      "0"
    )}/${year}`;
  }


  const isoDateMatch =
    trimmed.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/
    );


  if (
    isoDateMatch
  ) {
    const [
      ,
      year,
      month,
      day,
    ] =
      isoDateMatch;


    return `${day.padStart(
      2,
      "0"
    )}/${month.padStart(
      2,
      "0"
    )}/${year}`;
  }


  const parsedTimestamp =
    Date.parse(
      trimmed
    );


  if (
    Number.isFinite(
      parsedTimestamp
    )
  ) {
    return formatDate(
      parsedTimestamp
    );
  }


  return trimmed;
}


export function getAssessmentCourseId(
  savedAssessment:
    SavedAssessment
): CourseId | null {
  const course =
    getCourseCatalogEntry(
      savedAssessment.setup
        .courseId ??
        savedAssessment.setup
          .levelId
    );


  return (
    course?.id ??
    null
  );
}


export function getAssessmentCourseLabel(
  savedAssessment:
    SavedAssessment
): string {
  const courseId =
    getAssessmentCourseId(
      savedAssessment
    );


  if (
    !courseId
  ) {
    return "Unknown course";
  }


  const course =
    getCourseCatalogEntry(
      courseId
    );


  return (
    course?.label ??
    "Unknown course"
  );
}


export function getAssessmentTypeLabel(
  savedAssessment:
    SavedAssessment
): string {
  switch (
    savedAssessment.setup
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


export function getAssessmentCoverageLabel(
  savedAssessment:
    SavedAssessment
): string {
  if (
    savedAssessment.setup
      .useCompleteCourseCoverage
  ) {
    return "Full course coverage";
  }


  const className =
    savedAssessment.setup
      .className
      .trim();


  if (
    className
  ) {
    return className;
  }


  const classCount =
    savedAssessment.setup
      .selectedClassIds
      .length;


  if (
    classCount ===
    0
  ) {
    return "No class selected";
  }


  if (
    classCount ===
    1
  ) {
    return "1 class linked";
  }


  return `${classCount} classes linked`;
}


export function getAssessmentStatusLabel(
  savedAssessment:
    SavedAssessment
): string {
  return savedAssessment.status ===
    "COMPLETE"
    ? "Complete"
    : "Draft";
}