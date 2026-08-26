import {
  useMemo,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  analyseTopicBalance,
} from "./AssessmentDistributionAnalysis";

import {
  buildCalculatorSuitabilityNotes,
} from "./BuildCalculatorSuitabilityNotes";

import {
  buildOperationalReasoningNotes,
} from "./BuildOperationalReasoningNotes";

import {
  buildStandardBalanceNotes,
} from "./BuildStandardBalanceNotes";

import {
  buildTopicBalanceNotes,
} from "./BuildTopicBalanceNotes";

import type {
  AssessmentQualityNote,
} from "./AssessmentQualityNotes";

type UseAssessmentQualityAnalysisArgs = {
  questions:
    Question[];

  courseConfig:
    CourseAssessmentConfig;

  includedPapers:
    Paper[];

  totalAssessmentMarks:
    number;

  qualityNotes:
    Array<
      string |
      AssessmentQualityNote
    >;
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
      Array<
        string |
        AssessmentQualityNote
      >
    >(() => {
      return buildTopicBalanceNotes({
        analysis:
          topicBalanceAnalysis,

        courseConfig,

        includeBasisNote:
          true,

        includeRecommendationNote:
          true,
      });
    }, [
      topicBalanceAnalysis,
      courseConfig,
    ]);

  const operationalReasoningNotes =
    useMemo<
      Array<
        string |
        AssessmentQualityNote
      >
    >(() => {
      return buildOperationalReasoningNotes({
        questions,

        courseConfig,

        includedPapers,

        totalAssessmentMarks,

        includeBasisNote:
          true,

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
      Array<
        string |
        AssessmentQualityNote
      >
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
      Array<
        string |
        AssessmentQualityNote
      >
    >(() => {
      return buildStandardBalanceNotes({
        questions,

        courseConfig,

        includedPapers,

        totalAssessmentMarks,

        includeBasisNote:
          true,

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