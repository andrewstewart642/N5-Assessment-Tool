import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";


export function sortSavedAssessmentsForLibrary(
  savedAssessments:
    SavedAssessment[]
): SavedAssessment[] {
  return [
    ...savedAssessments,
  ].sort(
    (
      a,
      b
    ) => {
      if (
        a.isPinned !==
        b.isPinned
      ) {
        return a.isPinned
          ? -1
          : 1;
      }

      return (
        b.updatedAt -
        a.updatedAt
      );
    }
  );
}