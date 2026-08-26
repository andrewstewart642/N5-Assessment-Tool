import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
} from "@/src/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  SavedAssessment,
} from "@/src/Assessments/SavedAssessments/SavedAssessment";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/src/Assessments/AssessmentTypes";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperStringMap,
} from "../Papers/AssessmentPaperValueMaps";

import type {
  AssessmentTargetMarksByPaper,
} from "../Papers/AssessmentPaperTargets";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "../Questions/AssessmentQuestionDraftTypes";

type StateSetter<T> =
  Dispatch<
    SetStateAction<T>
  >;

type UseAssessmentCreatorSavedAssessmentArgs = {
  setCreatedAt:
    StateSetter<number>;

  setAssessmentName:
    StateSetter<string>;

  setClassName:
    StateSetter<string>;

  setAssessmentDate:
    StateSetter<string>;

  setStandardFilter:
    StateSetter<StandardFilter>;

  setThinkingTypeFilter:
    StateSetter<ThinkingTypeFilter>;

  setTargetMarks:
    StateSetter<number>;

  setActivePaper:
    StateSetter<Paper>;

  setViewPaper:
    StateSetter<Paper>;

  setTargetMarksByPaper:
    (
      values:
        AssessmentTargetMarksByPaper
    ) => void;

  setQuestions:
    StateSetter<Question[]>;

  setDraftByPaper:
    StateSetter<
      AssessmentQuestionDraftByPaper
    >;

  setEditDraftByPaper:
    StateSetter<
      AssessmentEditQuestionDraftByPaper
    >;

  setIncludeCoverSheet:
    StateSetter<boolean>;

  setIncludeFormulaSheet:
    StateSetter<boolean>;

  setShowCoverDateTime:
    StateSetter<boolean>;

  setShowScottishCandidateNumberBox:
    StateSetter<boolean>;

  setCoverDateByPaper:
    StateSetter<
      AssessmentPaperStringMap
    >;

  setStartTimeByPaper:
    StateSetter<
      AssessmentPaperStringMap
    >;

  setEndTimeByPaper:
    StateSetter<
      AssessmentPaperStringMap
    >;

  setCoverDateCustomByPaper:
    StateSetter<
      AssessmentPaperBooleanMap
    >;

  setEndTimeManuallyEditedByPaper:
    StateSetter<
      AssessmentPaperBooleanMap
    >;
};

export function useAssessmentCreatorSavedAssessment({
  setCreatedAt,

  setAssessmentName,
  setClassName,
  setAssessmentDate,

  setStandardFilter,
  setThinkingTypeFilter,
  setTargetMarks,

  setActivePaper,
  setViewPaper,

  setTargetMarksByPaper,

  setQuestions,
  setDraftByPaper,
  setEditDraftByPaper,

  setIncludeCoverSheet,
  setIncludeFormulaSheet,

  setShowCoverDateTime,
  setShowScottishCandidateNumberBox,

  setCoverDateByPaper,
  setStartTimeByPaper,
  setEndTimeByPaper,

  setCoverDateCustomByPaper,

  setEndTimeManuallyEditedByPaper,
}: UseAssessmentCreatorSavedAssessmentArgs) {
  const [
    currentAssessmentId,
    setCurrentAssessmentId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    loadedSavedAssessment,
    setLoadedSavedAssessment,
  ] =
    useState<
      SavedAssessment | null
    >(
      null
    );

  const [
    hasLoadedSavedAssessment,
    setHasLoadedSavedAssessment,
  ] =
    useState(
      false
    );

  const [
    selectedClassIds,
    setSelectedClassIds,
  ] =
    useState<
      string[]
    >(
      []
    );

  const [
    useCompleteCourseCoverage,
    setUseCompleteCourseCoverage,
  ] =
    useState(
      false
    );

  useEffect(() => {
    const nextAssessmentId =
      getCurrentSavedAssessmentId();

    setCurrentAssessmentId(
      nextAssessmentId
    );

    if (
      !nextAssessmentId
    ) {
      setHasLoadedSavedAssessment(
        true
      );

      return;
    }

    const savedAssessment =
      loadSavedAssessmentById(
        nextAssessmentId
      );

    setLoadedSavedAssessment(
      savedAssessment
    );

    if (
      !savedAssessment
    ) {
      setHasLoadedSavedAssessment(
        true
      );

      return;
    }

    setCreatedAt(
      savedAssessment.createdAt
    );

    setAssessmentName(
      savedAssessment.builder
        .assessmentName
    );

    setClassName(
      savedAssessment.builder
        .className
    );

    setAssessmentDate(
      savedAssessment.builder
        .assessmentDate
    );

    setStandardFilter(
      savedAssessment.builder
        .standardFilter
    );

    setThinkingTypeFilter(
      savedAssessment.builder
        .thinkingTypeFilter
    );

    setTargetMarks(
      savedAssessment.builder
        .targetMarks
    );

    setActivePaper(
      savedAssessment.builder
        .activePaper
    );

    setViewPaper(
      savedAssessment.builder
        .viewPaper
    );

    setTargetMarksByPaper(
      savedAssessment.builder
        .targetMarksByPaper ?? {
        P1:
          savedAssessment.builder
            .p1Target,

        P2:
          savedAssessment.builder
            .p2Target,
      }
    );

    setQuestions(
      savedAssessment.builder
        .questions
    );

    setDraftByPaper(
      savedAssessment.builder
        .draftByPaper
    );

    setEditDraftByPaper(
      savedAssessment.builder
        .editDraftByPaper
    );

    setIncludeCoverSheet(
      savedAssessment.builder
        .includeCoverSheet
    );

    setIncludeFormulaSheet(
      savedAssessment.builder
        .includeFormulaSheet
    );

    setShowCoverDateTime(
      savedAssessment.builder
        .showCoverDateTime
    );

    setShowScottishCandidateNumberBox(
      savedAssessment.builder
        .showScottishCandidateNumberBox
    );

    setCoverDateByPaper(
      savedAssessment.builder
        .coverDateByPaper ?? {
        P1:
          savedAssessment.builder
            .assessmentDate,

        P2:
          savedAssessment.builder
            .p2CoverDate,
      }
    );

    setStartTimeByPaper(
      savedAssessment.builder
        .startTimeByPaper ?? {
        P1:
          savedAssessment.builder
            .p1StartTime,

        P2:
          savedAssessment.builder
            .p2StartTime,
      }
    );

    setEndTimeByPaper(
      savedAssessment.builder
        .endTimeByPaper ?? {
        P1:
          savedAssessment.builder
            .p1EndTime,

        P2:
          savedAssessment.builder
            .p2EndTime,
      }
    );

    setCoverDateCustomByPaper(
      savedAssessment.builder
        .coverDateCustomByPaper ?? {
        P1:
          false,

        P2:
          savedAssessment.builder
            .p2DateCustom,
      }
    );

    setEndTimeManuallyEditedByPaper({
      P1:
        savedAssessment.builder
          .p1EndTime
          .trim()
          .length >
        0,

      P2:
        savedAssessment.builder
          .p2EndTime
          .trim()
          .length >
        0,
    });

    setSelectedClassIds(
      savedAssessment.setup
        .selectedClassIds
    );

    setUseCompleteCourseCoverage(
      savedAssessment.setup
        .useCompleteCourseCoverage
    );

    setHasLoadedSavedAssessment(
      true
    );
  }, []);

  return {
    currentAssessmentId,

    loadedSavedAssessment,

    hasLoadedSavedAssessment,

    selectedClassIds,
    setSelectedClassIds,

    useCompleteCourseCoverage,
    setUseCompleteCourseCoverage,
  };
}