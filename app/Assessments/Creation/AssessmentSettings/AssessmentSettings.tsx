
import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Theme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPaperBooleanValue,
  getAssessmentPaperStringValue,
  type AssessmentPaperBooleanMap,
  type AssessmentPaperStringMap,
} from "../Papers/AssessmentPaperValueMaps";

import AssessmentSettingsPanel from "./AssessmentSettingsPanel";

type StringSetter =
  Dispatch<
    SetStateAction<string>
  >;

type BooleanSetter =
  Dispatch<
    SetStateAction<boolean>
  >;

type AssessmentSettingsProps = {
  open:
    boolean;

  onClose:
    () => void;

  theme:
    Theme;

  includeCoverSheet:
    boolean;

  setIncludeCoverSheet:
    BooleanSetter;

  showCoverDateTime:
    boolean;

  setShowCoverDateTime:
    BooleanSetter;

  assessmentDate:
    string;

  setAssessmentDate:
    StringSetter;

  coverDateByPaper:
    AssessmentPaperStringMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeByPaper:
    AssessmentPaperStringMap;

  coverDateCustomByPaper:
    AssessmentPaperBooleanMap;

  setStartTimeForPaper:
    (
      paper: Paper,
      nextValueOrUpdater:
        SetStateAction<string>
    ) => void;

  setEndTimeForPaper:
    (
      paper: Paper,
      nextValueOrUpdater:
        SetStateAction<string>
    ) => void;

  setCoverDateForPaper:
    (
      paper: Paper,
      nextValueOrUpdater:
        SetStateAction<string>
    ) => void;

  setCoverDateCustomForPaper:
    (
      paper: Paper,
      nextValueOrUpdater:
        SetStateAction<boolean>
    ) => void;

  setEndTimeManuallyEditedForPaper:
    (
      paper: Paper,
      nextValueOrUpdater:
        SetStateAction<boolean>
    ) => void;

  showScottishCandidateNumberBox:
    boolean;

  setShowScottishCandidateNumberBox:
    BooleanSetter;

  includeFormulaSheet:
    boolean;

  setIncludeFormulaSheet:
    BooleanSetter;

  showProgressPanel:
    boolean;

  setShowProgressPanel:
    BooleanSetter;

  resetLayout:
    () => void;

  resetZoom:
    () => void;
};

export default function AssessmentSettings({
  open,
  onClose,
  theme,

  includeCoverSheet,
  setIncludeCoverSheet,

  showCoverDateTime,
  setShowCoverDateTime,

  assessmentDate,
  setAssessmentDate,

  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,
  coverDateCustomByPaper,

  setStartTimeForPaper,
  setEndTimeForPaper,

  setCoverDateForPaper,
  setCoverDateCustomForPaper,

  setEndTimeManuallyEditedForPaper,

  showScottishCandidateNumberBox,
  setShowScottishCandidateNumberBox,

  includeFormulaSheet,
  setIncludeFormulaSheet,

  showProgressPanel,
  setShowProgressPanel,

  resetLayout,
  resetZoom,
}: AssessmentSettingsProps) {
  const p1StartTime =
    getAssessmentPaperStringValue({
      paper:
        "P1",

      valuesByPaper:
        startTimeByPaper,
    });

  const p1EndTime =
    getAssessmentPaperStringValue({
      paper:
        "P1",

      valuesByPaper:
        endTimeByPaper,
    });

  const p2CoverDate =
    getAssessmentPaperStringValue({
      paper:
        "P2",

      valuesByPaper:
        coverDateByPaper,

      fallback:
        assessmentDate,
    });

  const p2DateCustom =
    getAssessmentPaperBooleanValue({
      paper:
        "P2",

      valuesByPaper:
        coverDateCustomByPaper,
    });

  const p2StartTime =
    getAssessmentPaperStringValue({
      paper:
        "P2",

      valuesByPaper:
        startTimeByPaper,
    });

  const p2EndTime =
    getAssessmentPaperStringValue({
      paper:
        "P2",

      valuesByPaper:
        endTimeByPaper,
    });

  return (
    <AssessmentSettingsPanel
      open={open}

      onClose={
        onClose
      }

      theme={theme}

      includeCoverSheet={
        includeCoverSheet
      }

      onToggleIncludeCoverSheet={
        setIncludeCoverSheet
      }

      showCoverDateTime={
        showCoverDateTime
      }

      onToggleShowCoverDateTime={
        setShowCoverDateTime
      }

      p1CoverDateText={
        assessmentDate
      }

      onChangeP1CoverDateText={
        setAssessmentDate
      }

      p1StartTimeText={
        p1StartTime
      }

      onChangeP1StartTimeText={(
        value
      ) => {
        setStartTimeForPaper(
          "P1",
          value
        );
      }}

      p1EndTimeText={
        p1EndTime
      }

      onChangeP1EndTimeText={(
        value
      ) => {
        setEndTimeManuallyEditedForPaper(
          "P1",
          true
        );

        setEndTimeForPaper(
          "P1",
          value
        );
      }}

      p2CoverDateText={
        p2DateCustom
          ? p2CoverDate
          : assessmentDate
      }

      onChangeP2CoverDateText={(
        value
      ) => {
        setCoverDateCustomForPaper(
          "P2",
          true
        );

        setCoverDateForPaper(
          "P2",
          value
        );
      }}

      p2StartTimeText={
        p2StartTime
      }

      onChangeP2StartTimeText={(
        value
      ) => {
        setStartTimeForPaper(
          "P2",
          value
        );
      }}

      p2EndTimeText={
        p2EndTime
      }

      onChangeP2EndTimeText={(
        value
      ) => {
        setEndTimeManuallyEditedForPaper(
          "P2",
          true
        );

        setEndTimeForPaper(
          "P2",
          value
        );
      }}

      showScottishCandidateNumberBox={
        showScottishCandidateNumberBox
      }

      onToggleShowScottishCandidateNumberBox={
        setShowScottishCandidateNumberBox
      }

      includeFormulaSheet={
        includeFormulaSheet
      }

      onToggleIncludeFormulaSheet={
        setIncludeFormulaSheet
      }

      showProgressPanel={
        showProgressPanel
      }

      onToggleShowProgressPanel={
        setShowProgressPanel
      }

      onResetLayout={
        resetLayout
      }

      onResetZoom={
        resetZoom
      }
    />
  );
}