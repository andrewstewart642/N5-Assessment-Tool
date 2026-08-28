import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  getCurrentSavedAssessmentId,
  loadSavedAssessmentById,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperStringMap,
} from "../Papers/PaperSpecificValues";

import type {
  AssessmentTargetMarksByPaper,
} from "../Papers/MarkTargetCalculations";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "../Questions/DraftTypes";


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

  setDatesUnlinked:
    StateSetter<boolean>;

  setDateLinkOwnerPaper:
    StateSetter<
      Paper | null
    >;

  setStartTimesUnlinked:
    StateSetter<boolean>;

  setStartTimeLinkOwnerPaper:
    StateSetter<
      Paper | null
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

  setDatesUnlinked,
  setDateLinkOwnerPaper,

  setStartTimesUnlinked,
  setStartTimeLinkOwnerPaper,

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


  /*
   * This is deliberately a one-time hydration.
   *
   * Re-running it when setter references change
   * would risk overwriting teacher edits with the
   * originally persisted assessment state.
   *
   * React state setters are stable, and the
   * specialised paper-target setter supplied by
   * useAssessmentPaperTargetState is memoised.
   */
  /* eslint-disable react-hooks/exhaustive-deps */
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

    const builder =
      savedAssessment.builder;


    setCreatedAt(
      savedAssessment.createdAt
    );

    setAssessmentName(
      builder.assessmentName
    );

    setClassName(
      builder.className
    );

    setAssessmentDate(
      builder.assessmentDate
    );

    setStandardFilter(
      builder.standardFilter
    );

    setThinkingTypeFilter(
      builder.thinkingTypeFilter
    );

    setTargetMarks(
      builder.targetMarks
    );

    setActivePaper(
      builder.activePaper
    );

    setViewPaper(
      builder.viewPaper
    );


    setTargetMarksByPaper(
      builder.targetMarksByPaper ?? {
        P1:
          builder.p1Target,

        P2:
          builder.p2Target,
      }
    );


    setQuestions(
      builder.questions
    );

    setDraftByPaper(
      builder.draftByPaper
    );

    setEditDraftByPaper(
      builder.editDraftByPaper
    );


    setIncludeCoverSheet(
      builder.includeCoverSheet
    );

    setIncludeFormulaSheet(
      builder.includeFormulaSheet
    );

    setShowCoverDateTime(
      builder.showCoverDateTime
    );

    setShowScottishCandidateNumberBox(
      builder.showScottishCandidateNumberBox
    );


    setCoverDateByPaper(
      builder.coverDateByPaper ?? {
        P1:
          builder.assessmentDate,

        P2:
          builder.p2CoverDate,
      }
    );

    setStartTimeByPaper(
      builder.startTimeByPaper ?? {
        P1:
          builder.p1StartTime,

        P2:
          builder.p2StartTime,
      }
    );

    setEndTimeByPaper(
      builder.endTimeByPaper ?? {
        P1:
          builder.p1EndTime,

        P2:
          builder.p2EndTime,
      }
    );

    setCoverDateCustomByPaper(
      builder.coverDateCustomByPaper ?? {
        P1:
          false,

        P2:
          builder.p2DateCustom,
      }
    );


    /*
     * Date linking
     *
     * Historical custom P2 dates are treated as
     * already independent — preserving teacher
     * intent rather than risking overwrites.
     */

    const legacyDatesUnlinked =
      builder.p2DateCustom ||
      builder
        .coverDateCustomByPaper
        ?.P2 ===
        true;

    const hydratedDatesUnlinked =
      typeof builder.datesUnlinked ===
        "boolean"
        ? builder.datesUnlinked
        : legacyDatesUnlinked;

    setDatesUnlinked(
      hydratedDatesUnlinked
    );

    setDateLinkOwnerPaper(
      hydratedDatesUnlinked
        ? null
        : builder
            .dateLinkOwnerPaper ??
          null
    );


    /*
     * Start-time linking
     *
     * Historical assessments where both papers
     * already contain start values are treated
     * conservatively as independent.
     */

    const hasLegacyP1Start =
      builder.p1StartTime
        .trim()
        .length > 0;

    const hasLegacyP2Start =
      builder.p2StartTime
        .trim()
        .length > 0;

    const legacyStartTimesUnlinked =
      hasLegacyP1Start &&
      hasLegacyP2Start;

    const hydratedStartTimesUnlinked =
      typeof builder.startTimesUnlinked ===
        "boolean"
        ? builder.startTimesUnlinked
        : legacyStartTimesUnlinked;

    setStartTimesUnlinked(
      hydratedStartTimesUnlinked
    );

    setStartTimeLinkOwnerPaper(
      hydratedStartTimesUnlinked
        ? null
        : builder
            .startTimeLinkOwnerPaper ??
          null
    );


    /*
     * Manual End state
     *
     * New saves explicitly preserve this.
     *
     * Old saves cannot distinguish generated
     * versus manual End values, so retain the
     * historical conservative behaviour.
     */

    setEndTimeManuallyEditedByPaper(
      builder
        .endTimeManuallyEditedByPaper ?? {
        P1:
          builder.p1EndTime
            .trim()
            .length > 0,

        P2:
          builder.p2EndTime
            .trim()
            .length > 0,
      }
    );


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
  /* eslint-enable react-hooks/exhaustive-deps */


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