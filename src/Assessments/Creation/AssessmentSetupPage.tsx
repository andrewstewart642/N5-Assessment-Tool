"use client";

import { useRouter } from "next/navigation";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

import type { AssessmentLevelId } from "./Setup/AssessmentClassCoverageStorage";

import { createAssessmentFromSetup } from "./Setup/AssessmentSetupSubmission";

import { useAssessmentSetupClassCoverage } from "./Setup/useAssessmentSetupClassCoverage";
import { useAssessmentSetupConfiguration } from "./Setup/useAssessmentSetupConfiguration";
import { useAssessmentSetupTargets } from "./Setup/useAssessmentSetupTargets";

import AssessmentSetupHeader from "./Setup/Sections/AssessmentSetupHeader";
import AssessmentDetailsSection from "./Setup/Sections/AssessmentDetailsSection";
import AssessmentOptionsSection from "./Setup/Sections/AssessmentOptionsSection";

export default function AssessmentSetupPage() {
  const router = useRouter();
  const { theme } = useSettings();

  const {
    selectedLevelId,
    selectedLevelOption,
    selectedClassIds,
    useCompleteCourseCoverage,
    levelClasses,
    selectLevel,
    toggleClass,
    selectCompleteCourseCoverage,
  } = useAssessmentSetupClassCoverage();

  const {
    selectedCourseConfig,

    assessmentType,
    setAssessmentType,

    paperStructure,
    setPaperStructure,

    includeCoverSheet,
    setIncludeCoverSheet,

    includeFormulaSheet,
    setIncludeFormulaSheet,

    assessmentName,
    setAssessmentName,

    assessmentDate,
    setAssessmentDate,

    setupAssessmentModes,
    setupAssessmentStructures,

    handleAssessmentNameFocus,
    handleAssessmentNameBlur,

    resetCourseDependentConfiguration,
  } = useAssessmentSetupConfiguration({
    selectedLevelId,
  });

  const {
    buildPriority,
    setBuildPriority,

    marksTargetP1,
    setMarksTargetP1,

    marksTargetP2,
    setMarksTargetP2,

    timeTargetP1,
    setTimeTargetP1,

    timeTargetP2,
    setTimeTargetP2,

    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,

    targetsValid,
    derivedSummary,

    resetTargets,
  } = useAssessmentSetupTargets({
    paperStructure,
    courseConfig: selectedCourseConfig,
  });

  const canContinue =
    assessmentType !== null &&
    paperStructure !== null &&
    buildPriority !== null &&
    selectedLevelId !== null &&
    targetsValid;

  function handleLevelChange(
    nextLevelId: AssessmentLevelId
  ) {
    selectLevel(nextLevelId);
    resetCourseDependentConfiguration();
    resetTargets();
  }

  function handleContinue() {
    if (
      !assessmentType ||
      !paperStructure ||
      !buildPriority ||
      !selectedLevelId ||
      !targetsValid
    ) {
      return;
    }

    createAssessmentFromSetup({
      courseConfig: selectedCourseConfig,

      assessmentType,
      paperStructure,
      buildPriority,

      includeCoverSheet,
      includeFormulaSheet,

      assessmentName,
      assessmentDate,

      selectedLevelId,
      selectedClassIds,
      useCompleteCourseCoverage,

      parsedMarksP1,
      parsedMarksP2,
      parsedTimeP1,
      parsedTimeP2,
    });

    router.push("/create-assessment/builder");
  }

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.bgPage,
        color: theme.textPrimary,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gap: 22,
        }}
      >
        <AssessmentSetupHeader theme={theme} />

        <AssessmentDetailsSection
          theme={theme}
          assessmentName={assessmentName}
          onAssessmentNameChange={setAssessmentName}
          onAssessmentNameFocus={handleAssessmentNameFocus}
          onAssessmentNameBlur={handleAssessmentNameBlur}
          selectedLevelId={selectedLevelId}
          onLevelChange={handleLevelChange}
          levelLabel={selectedLevelOption?.label ?? null}
          classes={levelClasses}
          selectedClassIds={selectedClassIds}
          useCompleteCourseCoverage={useCompleteCourseCoverage}
          onToggleClass={toggleClass}
          onSelectCompleteCourseCoverage={
            selectCompleteCourseCoverage
          }
          assessmentDate={assessmentDate}
          onAssessmentDateChange={setAssessmentDate}
        />

        <AssessmentOptionsSection
          theme={theme}
          courseConfig={selectedCourseConfig}
          assessmentModes={setupAssessmentModes}
          assessmentType={assessmentType}
          onAssessmentTypeChange={setAssessmentType}
          assessmentStructures={setupAssessmentStructures}
          paperStructure={paperStructure}
          onPaperStructureChange={setPaperStructure}
          includeCoverSheet={includeCoverSheet}
          onToggleCoverSheet={() =>
            setIncludeCoverSheet((previous) => !previous)
          }
          includeFormulaSheet={includeFormulaSheet}
          onToggleFormulaSheet={() =>
            setIncludeFormulaSheet((previous) => !previous)
          }
          buildPriority={buildPriority}
          onBuildPriorityChange={setBuildPriority}
          marksTargetP1={marksTargetP1}
          onMarksTargetP1Change={setMarksTargetP1}
          marksTargetP2={marksTargetP2}
          onMarksTargetP2Change={setMarksTargetP2}
          timeTargetP1={timeTargetP1}
          onTimeTargetP1Change={setTimeTargetP1}
          timeTargetP2={timeTargetP2}
          onTimeTargetP2Change={setTimeTargetP2}
          derivedSummary={derivedSummary}
        />

        <section
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            style={{
              minWidth: 240,
              height: 58,
              borderRadius: 18,
              border: `1px solid ${
                canContinue
                  ? theme.controlSelectedBorder
                  : theme.borderStandard
              }`,
              background: canContinue
                ? theme.controlSelectedBg
                : theme.controlBg,
              color: canContinue
                ? theme.textPrimary
                : theme.textMuted,
              cursor: canContinue
                ? "pointer"
                : "not-allowed",
              fontSize: 16,
              fontWeight: 700,
              boxShadow: canContinue
                ? "0 12px 24px rgba(0,0,0,0.18)"
                : "none",
            }}
          >
            Continue to Builder →
          </button>
        </section>
      </div>
    </main>
  );
}