import { useMemo } from "react";

import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
  Question,
} from "@/shared-types/AssessmentTypes";

import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

import { analyseTopicBalance } from "@/app/create-assessment/builder/builder-logic/AssessmentDistributionAnalysis";

import { buildCalculatorSuitabilityNotes } from "@/app/create-assessment/builder/builder-logic/BuildCalculatorSuitabilityNotes";

import { buildOperationalReasoningNotes } from "@/app/create-assessment/builder/builder-logic/BuildOperationalReasoningNotes";

import { buildStandardBalanceNotes } from "@/app/create-assessment/builder/builder-logic/BuildStandardBalanceNotes";

import { buildTopicBalanceNotes } from "@/app/create-assessment/builder/builder-logic/BuildTopicBalanceNotes";

type UseAssessmentQualityAnalysisArgs = {
  questions: Question[];

  courseConfig: CourseAssessmentConfig;

  includedPapers: Paper[];

  totalAssessmentMarks: number;

  qualityNotes: Array<string | BuilderNote>;
};

export function useAssessmentQualityAnalysis({
  questions,
  courseConfig,
  includedPapers,
  totalAssessmentMarks,
  qualityNotes,
}: UseAssessmentQualityAnalysisArgs) {
  const topicBalanceAnalysis =
    useMemo(() => {
      return analyseTopicBalance({
        questions,

        totalAssessmentMarks,

        courseConfig,

        includedPapers,
      });
    }, [
      questions,
      totalAssessmentMarks,
      courseConfig,
      includedPapers,
    ]);

  const topicQualityNotes =
    useMemo<
      Array<string | BuilderNote>
    >(() => {
      return buildTopicBalanceNotes({
        analysis:
          topicBalanceAnalysis,

        courseConfig,

        includeBasisNote: true,

        includeRecommendationNote:
          true,
      });
    }, [
      topicBalanceAnalysis,
      courseConfig,
    ]);

  const operationalReasoningNotes =
    useMemo<
      Array<string | BuilderNote>
    >(() => {
      return buildOperationalReasoningNotes({
        questions,

        courseConfig,

        includedPapers,

        totalAssessmentMarks,

        includeBasisNote: true,

        includeRecommendationNote:
          true,
      });
    }, [
      questions,
      courseConfig,
      includedPapers,
      totalAssessmentMarks,
    ]);

  const calculatorSuitabilityNotes =
    useMemo<
      Array<string | BuilderNote>
    >(() => {
      return buildCalculatorSuitabilityNotes({
        questions,

        courseConfig,

        includedPapers,
      });
    }, [
      questions,
      courseConfig,
      includedPapers,
    ]);

  const standardBalanceNotes =
    useMemo<
      Array<string | BuilderNote>
    >(() => {
      return buildStandardBalanceNotes({
        questions,

        courseConfig,

        includedPapers,

        totalAssessmentMarks,

        includeBasisNote: true,

        includeRecommendationNote:
          true,
      });
    }, [
      questions,
      courseConfig,
      includedPapers,
      totalAssessmentMarks,
    ]);

  const mergedQualityNotes =
    useMemo(() => {
      return [
        ...qualityNotes,

        ...topicQualityNotes,

        ...operationalReasoningNotes,

        ...calculatorSuitabilityNotes,

        ...standardBalanceNotes,
      ];
    }, [
      qualityNotes,
      topicQualityNotes,
      operationalReasoningNotes,
      calculatorSuitabilityNotes,
      standardBalanceNotes,
    ]);

  return {
    topicBalanceAnalysis,

    topicQualityNotes,
    operationalReasoningNotes,
    calculatorSuitabilityNotes,
    standardBalanceNotes,

    mergedQualityNotes,
  };
}