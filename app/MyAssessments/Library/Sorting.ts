import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  AssessmentLibrarySortMode,
} from "./ViewOptions";


function parseAssessmentDate(
  value:
    string
): number | null {
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


    return new Date(
      Number(
        year
      ),
      Number(
        month
      ) - 1,
      Number(
        day
      )
    ).getTime();
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


    return new Date(
      Number(
        year
      ),
      Number(
        month
      ) - 1,
      Number(
        day
      )
    ).getTime();
  }


  const parsed =
    Date.parse(
      trimmed
    );


  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}


function comparePinned(
  first:
    SavedAssessment,

  second:
    SavedAssessment
): number {
  if (
    first.isPinned ===
    second.isPinned
  ) {
    return 0;
  }


  return first.isPinned
    ? -1
    : 1;
}


function compareAssessmentDateDescending(
  first:
    SavedAssessment,

  second:
    SavedAssessment
): number {
  const firstDate =
    parseAssessmentDate(
      first.setup
        .assessmentDate
    );


  const secondDate =
    parseAssessmentDate(
      second.setup
        .assessmentDate
    );


  if (
    firstDate ===
      null &&
    secondDate ===
      null
  ) {
    return (
      second.updatedAt -
      first.updatedAt
    );
  }


  if (
    firstDate ===
    null
  ) {
    return 1;
  }


  if (
    secondDate ===
    null
  ) {
    return -1;
  }


  return (
    secondDate -
    firstDate
  );
}


export function sortSavedAssessmentsForLibrary(
  savedAssessments:
    SavedAssessment[],

  sortMode:
    AssessmentLibrarySortMode =
      "UPDATED_DESC"
): SavedAssessment[] {
  return [
    ...savedAssessments,
  ].sort(
    (
      first,
      second
    ) => {
      const pinnedComparison =
        comparePinned(
          first,
          second
        );


      if (
        pinnedComparison !==
        0
      ) {
        return pinnedComparison;
      }


      switch (
        sortMode
      ) {
        case "ASSESSMENT_DATE_DESC":
          return compareAssessmentDateDescending(
            first,
            second
          );


        case "CREATED_DESC":
          return (
            second.createdAt -
            first.createdAt
          );


        case "NAME_ASC":
          return (
            first.setup
              .assessmentName
              .trim() ||
            "[Untitled file]"
          ).localeCompare(
            second.setup
              .assessmentName
              .trim() ||
              "[Untitled file]",
            "en-GB",
            {
              sensitivity:
                "base",
            }
          );


        case "UPDATED_DESC":
        default:
          return (
            second.updatedAt -
            first.updatedAt
          );
      }
    }
  );
}