import {
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPaperConfig,
} from "../../Papers/PaperRules";

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