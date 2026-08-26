import {
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import {
  getAssessmentPaperConfig,
} from "../../Papers/AssessmentPaperRules";

type UseAssessmentPaperPrintMetadataArgs = {
  paper:
    Paper;

  courseConfig:
    CourseAssessmentConfig;
};

export function useAssessmentPaperPrintMetadata({
  paper,
  courseConfig,
}: UseAssessmentPaperPrintMetadataArgs) {
  const paperConfig =
    useMemo(() => {
      return getAssessmentPaperConfig(
        paper,
        courseConfig
      );
    }, [
      paper,
      courseConfig,
    ]);

  return {
    printSubjectName:
      courseConfig.printSubjectName,

    printQualificationBadge:
      courseConfig.printQualificationBadge,

    printQualificationLabelLines:
      courseConfig.printQualificationLabelLines,

    paperPrintTitle:
      paperConfig.printTitle,

    paperCoverInstructionText:
      paperConfig.coverInstructionText,

    showNoCalculatorIcon:
      paperConfig.showNoCalculatorIcon,
  };
}