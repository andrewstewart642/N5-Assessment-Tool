"use client";

import type { Dispatch, SetStateAction } from "react";

import SettingsPanel from "@/app/create-assessment/builder/components/builder-controls/SettingsPanel";
import {
  getPaperBooleanValue,
  getPaperStringValue,
  type BuilderPaperBooleanMap,
  type BuilderPaperStringMap,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperStateMaps";
import type { Theme } from "@/ui/AppTheme";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";

type StringSetter = Dispatch<SetStateAction<string>>;
type BooleanSetter = Dispatch<SetStateAction<boolean>>;

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;

  includeCoverSheet: boolean;
  setIncludeCoverSheet: BooleanSetter;

  showCoverDateTime: boolean;
  setShowCoverDateTime: BooleanSetter;

  assessmentDate: string;
  setAssessmentDate: StringSetter;

  coverDateByPaper: BuilderPaperStringMap;
  startTimeByPaper: BuilderPaperStringMap;
  endTimeByPaper: BuilderPaperStringMap;
  coverDateCustomByPaper: BuilderPaperBooleanMap;

  setStartTimeForPaper: (
    paper: Paper,
    nextValueOrUpdater: SetStateAction<string>
  ) => void;
  setEndTimeForPaper: (
    paper: Paper,
    nextValueOrUpdater: SetStateAction<string>
  ) => void;
  setCoverDateForPaper: (
    paper: Paper,
    nextValueOrUpdater: SetStateAction<string>
  ) => void;
  setCoverDateCustomForPaper: (
    paper: Paper,
    nextValueOrUpdater: SetStateAction<boolean>
  ) => void;
  setEndTimeManuallyEditedForPaper: (
    paper: Paper,
    nextValueOrUpdater: SetStateAction<boolean>
  ) => void;

  showScottishCandidateNumberBox: boolean;
  setShowScottishCandidateNumberBox: BooleanSetter;

  includeFormulaSheet: boolean;
  setIncludeFormulaSheet: BooleanSetter;

  showProgressPanel: boolean;
  setShowProgressPanel: BooleanSetter;

  resetLayout: () => void;
  resetZoom: () => void;
};

export default function BuilderSettingsPanel({
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
}: Props) {
  /**
   * Temporary adapter:
   *
   * The visual SettingsPanel still has Paper 1 / Paper 2 tabs.
   * This wrapper now reads/writes through the generic paper maps so page.tsx no
   * longer needs to manually wire every P1/P2 field into the panel.
   */
  const p1StartTime = getPaperStringValue({
    paper: "P1",
    valuesByPaper: startTimeByPaper,
  });

  const p1EndTime = getPaperStringValue({
    paper: "P1",
    valuesByPaper: endTimeByPaper,
  });

  const p2CoverDate = getPaperStringValue({
    paper: "P2",
    valuesByPaper: coverDateByPaper,
    fallback: assessmentDate,
  });

  const p2DateCustom = getPaperBooleanValue({
    paper: "P2",
    valuesByPaper: coverDateCustomByPaper,
  });

  const p2StartTime = getPaperStringValue({
    paper: "P2",
    valuesByPaper: startTimeByPaper,
  });

  const p2EndTime = getPaperStringValue({
    paper: "P2",
    valuesByPaper: endTimeByPaper,
  });

  return (
    <SettingsPanel
      open={open}
      onClose={onClose}
      theme={theme}
      includeCoverSheet={includeCoverSheet}
      onToggleIncludeCoverSheet={setIncludeCoverSheet}
      showCoverDateTime={showCoverDateTime}
      onToggleShowCoverDateTime={setShowCoverDateTime}
      p1CoverDateText={assessmentDate}
      onChangeP1CoverDateText={setAssessmentDate}
      p1StartTimeText={p1StartTime}
      onChangeP1StartTimeText={(value: string) => {
        setStartTimeForPaper("P1", value);
      }}
      p1EndTimeText={p1EndTime}
      onChangeP1EndTimeText={(value: string) => {
        setEndTimeManuallyEditedForPaper("P1", true);
        setEndTimeForPaper("P1", value);
      }}
      p2CoverDateText={p2DateCustom ? p2CoverDate : assessmentDate}
      onChangeP2CoverDateText={(value: string) => {
        setCoverDateCustomForPaper("P2", true);
        setCoverDateForPaper("P2", value);
      }}
      p2StartTimeText={p2StartTime}
      onChangeP2StartTimeText={(value: string) => {
        setStartTimeForPaper("P2", value);
      }}
      p2EndTimeText={p2EndTime}
      onChangeP2EndTimeText={(value: string) => {
        setEndTimeManuallyEditedForPaper("P2", true);
        setEndTimeForPaper("P2", value);
      }}
      showScottishCandidateNumberBox={showScottishCandidateNumberBox}
      onToggleShowScottishCandidateNumberBox={setShowScottishCandidateNumberBox}
      includeFormulaSheet={includeFormulaSheet}
      onToggleIncludeFormulaSheet={setIncludeFormulaSheet}
      showProgressPanel={showProgressPanel}
      onToggleShowProgressPanel={setShowProgressPanel}
      onResetLayout={resetLayout}
      onResetZoom={resetZoom}
    />
  );
}