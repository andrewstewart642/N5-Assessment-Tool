import { useMemo } from "react";

import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import { getBuilderPapers } from "../builder-logic/BuilderPaperTargets";
import {
  getPaperNumberValue,
  type BuilderPaperNumberMap,
} from "../builder-logic/BuilderPaperStateMaps";
import {
  estimateMinutes,
  sumActualQuestionMarks,
  sumMarks,
} from "../BuilderUtils";

type UseBuilderProgressMetricsArgs = {
  questions: Question[];
  viewPaper: Paper;
};

type QuestionsByPaper = Partial<Record<Paper, Question[]>>;

function buildQuestionsByPaper(
  questions: Question[],
  papers: Paper[]
): QuestionsByPaper {
  return papers.reduce<QuestionsByPaper>((groupedQuestions, paper) => {
    groupedQuestions[paper] = questions.filter(
      (question) => question.paper === paper
    );

    return groupedQuestions;
  }, {});
}

function buildMarksByPaper(
  questionsByPaper: QuestionsByPaper,
  papers: Paper[]
): BuilderPaperNumberMap {
  return papers.reduce<BuilderPaperNumberMap>((marksByPaper, paper) => {
    marksByPaper[paper] = sumMarks(questionsByPaper[paper] ?? []);
    return marksByPaper;
  }, {});
}

function buildActualQuestionMarksByPaper(
  questionsByPaper: QuestionsByPaper,
  papers: Paper[]
): BuilderPaperNumberMap {
  return papers.reduce<BuilderPaperNumberMap>((marksByPaper, paper) => {
    marksByPaper[paper] = sumActualQuestionMarks(
      questionsByPaper[paper] ?? []
    );

    return marksByPaper;
  }, {});
}

function buildMinutesByPaper(
  marksByPaper: BuilderPaperNumberMap,
  papers: Paper[]
): BuilderPaperNumberMap {
  return papers.reduce<BuilderPaperNumberMap>((minutesByPaper, paper) => {
    minutesByPaper[paper] = estimateMinutes(
      paper,
      getPaperNumberValue({
        paper,
        valuesByPaper: marksByPaper,
      })
    );

    return minutesByPaper;
  }, {});
}

export function useBuilderProgressMetrics({
  questions,
  viewPaper,
}: UseBuilderProgressMetricsArgs) {
  const coursePapers = useMemo(() => getBuilderPapers(), []);

  const questionsByPaper = useMemo(() => {
    return buildQuestionsByPaper(questions, coursePapers);
  }, [questions, coursePapers]);

  const marksByPaper = useMemo(() => {
    return buildMarksByPaper(questionsByPaper, coursePapers);
  }, [questionsByPaper, coursePapers]);

  const actualQuestionMarksByPaper = useMemo(() => {
    return buildActualQuestionMarksByPaper(questionsByPaper, coursePapers);
  }, [questionsByPaper, coursePapers]);

  const minutesByPaper = useMemo(() => {
    return buildMinutesByPaper(marksByPaper, coursePapers);
  }, [marksByPaper, coursePapers]);

  const assignedForView = useMemo(() => {
    return questionsByPaper[viewPaper] ?? [];
  }, [questionsByPaper, viewPaper]);

  const p1Questions = questionsByPaper.P1 ?? [];
  const p2Questions = questionsByPaper.P2 ?? [];

  const p1Marks = getPaperNumberValue({
    paper: "P1",
    valuesByPaper: marksByPaper,
  });

  const p2Marks = getPaperNumberValue({
    paper: "P2",
    valuesByPaper: marksByPaper,
  });

  const p1ActualQuestionMarks = getPaperNumberValue({
    paper: "P1",
    valuesByPaper: actualQuestionMarksByPaper,
  });

  const p2ActualQuestionMarks = getPaperNumberValue({
    paper: "P2",
    valuesByPaper: actualQuestionMarksByPaper,
  });

  const p1Mins = getPaperNumberValue({
    paper: "P1",
    valuesByPaper: minutesByPaper,
  });

  const p2Mins = getPaperNumberValue({
    paper: "P2",
    valuesByPaper: minutesByPaper,
  });

  const activePaperCoverMarks = getPaperNumberValue({
    paper: viewPaper,
    valuesByPaper: actualQuestionMarksByPaper,
  });

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

    questionsByPaper,
    marksByPaper,
    actualQuestionMarksByPaper,
    minutesByPaper,
  };
}