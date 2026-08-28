export type AssessmentLibraryViewMode =
  | "TILES"
  | "LIST";


export type AssessmentLibraryStatusFilter =
  | "ALL"
  | "DRAFT"
  | "COMPLETE";


export type AssessmentLibrarySortMode =
  | "UPDATED_DESC"
  | "ASSESSMENT_DATE_DESC"
  | "CREATED_DESC"
  | "NAME_ASC";


export const DEFAULT_ASSESSMENT_LIBRARY_VIEW_MODE:
  AssessmentLibraryViewMode =
    "TILES";


export const DEFAULT_ASSESSMENT_LIBRARY_STATUS_FILTER:
  AssessmentLibraryStatusFilter =
    "ALL";


export const DEFAULT_ASSESSMENT_LIBRARY_SORT_MODE:
  AssessmentLibrarySortMode =
    "UPDATED_DESC";