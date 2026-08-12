import { useMemo } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes";
import { calculateTotalAssessmentMarksFromPaperTargets } from "../builder-logic/AssessmentDistributionAnalysis";
import {
  buildTargetMarksByPaper,
  getIncludedPapersFromTargets,
} from "../builder-logic/BuilderPaperTargets";

type UseBuilderPaperTargetMapsArgs = {
  p1Target: number;
  p2Target: number;
  courseConfig: CourseAssessmentConfig;
};

export function useBuilderPaperTargetMaps({
  p1Target,
  p2Target,
  courseConfig,
}: UseBuilderPaperTargetMapsArgs) {
  const targetMarksByPaper = useMemo<Partial<Record<Paper, number>>>(() => {
    return buildTargetMarksByPaper({
      p1Target,
      p2Target,
      courseConfig,
    });
  }, [p1Target, p2Target, courseConfig]);

  const includedPapers = useMemo<Paper[]>(() => {
    return getIncludedPapersFromTargets({
      targetMarksByPaper,
      courseConfig,
    });
  }, [targetMarksByPaper, courseConfig]);

  const totalAssessmentMarks = useMemo(() => {
    return calculateTotalAssessmentMarksFromPaperTargets({
      includedPapers,
      targetMarksByPaper,
    });
  }, [includedPapers, targetMarksByPaper]);

  return {
    targetMarksByPaper,
    includedPapers,
    totalAssessmentMarks,
  };
}