"use client";

import SettingsPanel from "@/app/create-assessment/builder/components/builder-controls/SettingsPanel";
import type { Theme } from "@/ui/AppTheme";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;

  includeCoverSheet: boolean;
  setIncludeCoverSheet: React.Dispatch<React.SetStateAction<boolean>>;

  showCoverDateTime: boolean;
  setShowCoverDateTime: React.Dispatch<React.SetStateAction<boolean>>;

  assessmentDate: string;
  setAssessmentDate: React.Dispatch<React.SetStateAction<string>>;

  p1StartTime: string;
  setP1StartTime: React.Dispatch<React.SetStateAction<string>>;
  p1EndTime: string;
  setP1EndTime: React.Dispatch<React.SetStateAction<string>>;
  setP1EndTimeManuallyEdited: React.Dispatch<React.SetStateAction<boolean>>;

  p2CoverDate: string;
  setP2CoverDate: React.Dispatch<React.SetStateAction<string>>;
  p2DateCustom: boolean;
  setP2DateCustom: React.Dispatch<React.SetStateAction<boolean>>;

  p2StartTime: string;
  setP2StartTime: React.Dispatch<React.SetStateAction<string>>;
  p2EndTime: string;
  setP2EndTime: React.Dispatch<React.SetStateAction<string>>;
  setP2EndTimeManuallyEdited: React.Dispatch<React.SetStateAction<boolean>>;

  showScottishCandidateNumberBox: boolean;
  setShowScottishCandidateNumberBox: React.Dispatch<React.SetStateAction<boolean>>;

  includeFormulaSheet: boolean;
  setIncludeFormulaSheet: React.Dispatch<React.SetStateAction<boolean>>;

  showProgressPanel: boolean;
  setShowProgressPanel: React.Dispatch<React.SetStateAction<boolean>>;

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
  p1StartTime,
  setP1StartTime,
  p1EndTime,
  setP1EndTime,
  setP1EndTimeManuallyEdited,
  p2CoverDate,
  setP2CoverDate,
  p2DateCustom,
  setP2DateCustom,
  p2StartTime,
  setP2StartTime,
  p2EndTime,
  setP2EndTime,
  setP2EndTimeManuallyEdited,
  showScottishCandidateNumberBox,
  setShowScottishCandidateNumberBox,
  includeFormulaSheet,
  setIncludeFormulaSheet,
  showProgressPanel,
  setShowProgressPanel,
  resetLayout,
  resetZoom,
}: Props) {
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
      onChangeP1StartTimeText={setP1StartTime}
      p1EndTimeText={p1EndTime}
      onChangeP1EndTimeText={(value: string) => {
        setP1EndTimeManuallyEdited(true);
        setP1EndTime(value);
      }}
      p2CoverDateText={p2DateCustom ? p2CoverDate : assessmentDate}
      onChangeP2CoverDateText={(value: string) => {
        setP2DateCustom(true);
        setP2CoverDate(value);
      }}
      p2StartTimeText={p2StartTime}
      onChangeP2StartTimeText={setP2StartTime}
      p2EndTimeText={p2EndTime}
      onChangeP2EndTimeText={(value: string) => {
        setP2EndTimeManuallyEdited(true);
        setP2EndTime(value);
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