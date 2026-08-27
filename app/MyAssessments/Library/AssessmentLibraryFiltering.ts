import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  getAssessmentCourseLabel,
  getAssessmentCoverageLabel,
  getAssessmentTypeLabel,
} from "../Display/AssessmentDisplayMetadata";

import type {
  AssessmentLibraryStatusFilter,
} from "./AssessmentLibraryControls";


function normaliseSearchText(
  value:
    string
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "en-GB"
    );
}


export function filterSavedAssessmentsForLibrary({
  savedAssessments,
  searchText,
  statusFilter,
}: {
  savedAssessments:
    SavedAssessment[];

  searchText:
    string;

  statusFilter:
    AssessmentLibraryStatusFilter;
}): SavedAssessment[] {
  const search =
    normaliseSearchText(
      searchText
    );


  return savedAssessments.filter(
    (
      assessment
    ) => {
      if (
        statusFilter !==
          "ALL" &&
        assessment.status !==
          statusFilter
      ) {
        return false;
      }


      if (
        !search
      ) {
        return true;
      }


      const assessmentName =
        assessment.setup
          .assessmentName
          .trim() ||
        "[Untitled file]";


      const searchableText =
        [
          assessmentName,

          getAssessmentCourseLabel(
            assessment
          ),

          getAssessmentTypeLabel(
            assessment
          ),

          getAssessmentCoverageLabel(
            assessment
          ),
        ]
          .join(
            " "
          )
          .toLocaleLowerCase(
            "en-GB"
          );


      return searchableText.includes(
        search
      );
    }
  );
}