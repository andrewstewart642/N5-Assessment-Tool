import { useMemo } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes";
import { getBuilderPaperConfig } from "../builder-logic/BuilderPaperTargets";

type UseBuilderPaperPrintMetadataArgs = {
  paper: Paper;
  courseConfig: CourseAssessmentConfig;
};

export function useBuilderPaperPrintMetadata({
  paper,
  courseConfig,
}: UseBuilderPaperPrintMetadataArgs) {
  const paperConfig = useMemo(() => {
    return getBuilderPaperConfig(paper, courseConfig);
  }, [paper, courseConfig]);

  return {
    printSubjectName: courseConfig.printSubjectName,
    printQualificationBadge: courseConfig.printQualificationBadge,
    printQualificationLabelLines: courseConfig.printQualificationLabelLines,

    paperPrintTitle: paperConfig.printTitle,
    paperCoverInstructionText: paperConfig.coverInstructionText,
    showNoCalculatorIcon: paperConfig.showNoCalculatorIcon,
  };
}