import { useMemo } from "react";

import {
  getCoursePaperConfig,
  type CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";
import type { AssessmentProgressHudPaperRow } from "../components/assessment-progress/AssessmentProgressHud";
import {
  getPaperNumberValue,
  type BuilderPaperNumberMap,
} from "../builder-logic/BuilderPaperStateMaps";

type UseBuilderProgressHudRowsArgs = {
  courseConfig: CourseAssessmentConfig;
  marksByPaper: BuilderPaperNumberMap;
  targetMarksByPaper: BuilderPaperNumberMap;
  minutesByPaper: BuilderPaperNumberMap;
};

function getSortedCoursePapers(courseConfig: CourseAssessmentConfig): Paper[] {
  return [...courseConfig.papers]
    .sort((a, b) => a.order - b.order)
    .map((paper) => paper.id);
}

export function useBuilderProgressHudRows({
  courseConfig,
  marksByPaper,
  targetMarksByPaper,
  minutesByPaper,
}: UseBuilderProgressHudRowsArgs): AssessmentProgressHudPaperRow[] {
  return useMemo(() => {
    return getSortedCoursePapers(courseConfig).map((paper) => {
      const paperConfig = getCoursePaperConfig(courseConfig, paper);

      return {
        paper,
        paperLabel: paperConfig.shortLabel,
        marks: getPaperNumberValue({
          paper,
          valuesByPaper: marksByPaper,
        }),
        targetMarks: getPaperNumberValue({
          paper,
          valuesByPaper: targetMarksByPaper,
        }),
        timeMinutes: getPaperNumberValue({
          paper,
          valuesByPaper: minutesByPaper,
        }),
      };
    });
  }, [courseConfig, marksByPaper, targetMarksByPaper, minutesByPaper]);
}