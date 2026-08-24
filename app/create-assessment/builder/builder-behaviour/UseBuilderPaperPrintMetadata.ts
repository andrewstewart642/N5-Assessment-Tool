import { useMemo } from "react";

import {
  findCoursePaperConfigForSuitability,
  type CourseAssessmentConfig,
  type CoursePaperConfig,
} from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";

type UseBuilderPaperPrintMetadataArgs = {
  paper: Paper;
  courseConfig: CourseAssessmentConfig;
};

function resolvePrintPaperConfig({
  paper,
  courseConfig,
}: {
  paper: Paper;
  courseConfig: CourseAssessmentConfig;
}): CoursePaperConfig {
  const exactPaperConfig = courseConfig.papers.find(
    (paperConfig) => paperConfig.id === paper
  );

  if (exactPaperConfig) {
    return exactPaperConfig;
  }

  const aliasPaperConfig = findCoursePaperConfigForSuitability(
    courseConfig,
    paper
  );

  if (aliasPaperConfig) {
    return aliasPaperConfig;
  }

  const fallbackPaperConfig = courseConfig.papers[0];

  if (!fallbackPaperConfig) {
    throw new Error(`No papers are defined for ${courseConfig.displayName}.`);
  }

  return fallbackPaperConfig;
}

export function useBuilderPaperPrintMetadata({
  paper,
  courseConfig,
}: UseBuilderPaperPrintMetadataArgs) {
  const paperConfig = useMemo(() => {
    return resolvePrintPaperConfig({
      paper,
      courseConfig,
    });
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