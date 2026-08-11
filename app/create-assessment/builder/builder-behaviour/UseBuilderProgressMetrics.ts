import { useMemo } from "react";

import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import { getBuilderPapers } from "../builder-logic/BuilderPaperTargets";
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
type NumberByPaper = Partial<Record<Paper, number>>;

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
): NumberByPaper {
  return papers.reduce<NumberByPaper>((marksByPaper, paper) => {
    marksByPaper[paper] = sumMarks(questionsByPaper[paper] ?? []);
    return marksByPaper;
  }, {});
}

function buildActualQuestionMarksByPaper(
  questionsByPaper: QuestionsByPaper,
  papers: Paper[]
): NumberByPaper {
  return papers.reduce<NumberByPaper>((marksByPaper, paper) => {
    marksByPaper[paper] = sumActualQuestionMarks(
      questionsByPaper[paper] ?? []
    );

    return marksByPaper;
  }, {});
}

function buildMinutesByPaper(
  marksByPaper: NumberByPaper,
  papers: Paper[]
): NumberByPaper {
  return papers.reduce<NumberByPaper>((minutesByPaper, paper) => {
    minutesByPaper[paper] = estimateMinutes(paper, marksByPaper[paper] ?? 0);
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

  const p1Marks = marksByPaper.P1 ?? 0;
  const p2Marks = marksByPaper.P2 ?? 0;

  const p1ActualQuestionMarks = actualQuestionMarksByPaper.P1 ?? 0;
  const p2ActualQuestionMarks = actualQuestionMarksByPaper.P2 ?? 0;

  const p1Mins = minutesByPaper.P1 ?? 0;
  const p2Mins = minutesByPaper.P2 ?? 0;

  const activePaperCoverMarks = actualQuestionMarksByPaper[viewPaper] ?? 0;

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