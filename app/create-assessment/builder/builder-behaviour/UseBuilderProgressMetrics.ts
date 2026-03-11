import { useMemo } from "react";

import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import {
  estimateMinutes,
  sumActualQuestionMarks,
  sumMarks,
} from "../BuilderUtils";

type UseBuilderProgressMetricsArgs = {
  questions: Question[];
  viewPaper: Paper;
};

export function useBuilderProgressMetrics({
  questions,
  viewPaper,
}: UseBuilderProgressMetricsArgs) {
  const assignedForView = useMemo(
    () => questions.filter((q) => q.paper === viewPaper),
    [questions, viewPaper]
  );

  const p1Questions = useMemo(
    () => questions.filter((q) => q.paper === "P1"),
    [questions]
  );

  const p2Questions = useMemo(
    () => questions.filter((q) => q.paper === "P2"),
    [questions]
  );

  const p1Marks = useMemo(() => sumMarks(p1Questions), [p1Questions]);
  const p2Marks = useMemo(() => sumMarks(p2Questions), [p2Questions]);

  const p1ActualQuestionMarks = useMemo(
    () => sumActualQuestionMarks(p1Questions),
    [p1Questions]
  );

  const p2ActualQuestionMarks = useMemo(
    () => sumActualQuestionMarks(p2Questions),
    [p2Questions]
  );

  const p1Mins = useMemo(() => estimateMinutes("P1", p1Marks), [p1Marks]);
  const p2Mins = useMemo(() => estimateMinutes("P2", p2Marks), [p2Marks]);

  const activePaperCoverMarks = useMemo(() => {
    return viewPaper === "P1" ? p1ActualQuestionMarks : p2ActualQuestionMarks;
  }, [viewPaper, p1ActualQuestionMarks, p2ActualQuestionMarks]);

  return {
    assignedForView,
    p1Questions,
    p2Questions,
    p1Marks,
    p2Marks,
    p1ActualQuestionMarks,
    p2ActualQuestionMarks,
    p1Mins,
    p2Mins,
    activePaperCoverMarks,
  };
}