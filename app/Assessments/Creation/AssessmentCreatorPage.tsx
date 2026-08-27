"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import {
  useTheme,
} from "@/app/UI/Application/Theme/ThemeProvider";

import {
  useAssessmentQualityAnalysis,
} from "./Analysis/useAssessmentQualityAnalysis";

import AssessmentSettings from "./AssessmentSettings/AssessmentSettings";

import {
  getTodayAssessmentDisplayDate,
} from "./AssessmentSettings/AssessmentDateTime";

import {
  useAssessmentSettingsDrawer,
} from "./AssessmentSettings/useAssessmentSettingsDrawer";

import {
  useAssessmentCreationFeedback,
} from "./Feedback/useAssessmentCreationFeedback";

import {
  useAssessmentProgressMetrics,
} from "./HUDBar/useAssessmentProgressMetrics";

import {
  useAssessmentProgressRows,
} from "./HUDBar/useAssessmentProgressRows";

import {
  ASSESSMENT_WORKSPACE_DIVIDER_WIDTH_PX,
} from "./PaperWorkspace/AssessmentWorkspaceLayout";

import AssessmentPaperWorkspace from "./PaperWorkspace/AssessmentPaperWorkspace";

import WorkspaceDivider from "./PaperWorkspace/WorkspaceDivider";

import {
  useAssessmentPreviewJumpNavigation,
} from "./PaperWorkspace/Preview/useAssessmentPreviewJumpNavigation";

import {
  useAssessmentPaperPrintMetadata,
} from "./PaperWorkspace/Preview/useAssessmentPaperPrintMetadata";

import {
  useAssessmentPaperViewMetadata,
} from "./PaperWorkspace/Preview/useAssessmentPaperViewMetadata";

import {
  useAssessmentPreviewPages,
} from "./PaperWorkspace/Preview/useAssessmentPreviewPages";

import {
  useAssessmentPreviewViewport,
} from "./PaperWorkspace/Preview/useAssessmentPreviewViewport";

import {
  useAssessmentWorkspaceLayout,
} from "./PaperWorkspace/useAssessmentWorkspaceLayout";

import {
  useBuilderWorkspaceDocumentLock,
} from "./PaperWorkspace/useBuilderWorkspaceDocumentLock";

import {
  useCompactPreviewContent,
} from "./PaperWorkspace/useCompactPreviewContent";

import {
  usePreviewViewMode,
} from "./PaperWorkspace/usePreviewViewMode";

import {
  buildAssessmentPaperIntendedDurationMinutesByPaper,
} from "./Papers/AssessmentPaperIntendedTiming";

import {
  useAssessmentPaperAutomaticTiming,
} from "./Papers/useAssessmentPaperAutomaticTiming";

import {
  useAssessmentPaperSittingState,
} from "./Papers/useAssessmentPaperSittingState";

import {
  useAssessmentPaperTargets,
} from "./Papers/useAssessmentPaperTargets";

import {
  useAssessmentPaperTargetState,
} from "./Papers/useAssessmentPaperTargetState";

import {
  useAssessmentPaperSelection,
} from "./Papers/useAssessmentPaperSelection";

import {
  getAssessmentCreationCourseConfig,
} from "./Persistence/AssessmentCourseSelectionStorage";

import {
  useAssessmentCreationPersistence,
} from "./Persistence/useAssessmentCreationPersistence";

import {
  useAssessmentCreatorAutoSave,
} from "./Persistence/useAssessmentCreatorAutoSave";

import {
  useAssessmentCreatorInitialisation,
} from "./Persistence/useAssessmentCreatorInitialisation";

import {
  useAssessmentCreatorSavedAssessment,
} from "./Persistence/useAssessmentCreatorSavedAssessment";

import {
  useAssessmentQuestionControls,
} from "./Questions/useAssessmentQuestionControls";

import {
  useAssessmentQuestionState,
} from "./Questions/useAssessmentQuestionState";

import {
  useAssessmentQuestionWorkflow,
} from "./Questions/useAssessmentQuestionWorkflow";

import {
  useMeasuredQuestionHeights,
} from "./Questions/Preview/useMeasuredQuestionHeights";

import AssessmentSkillsPanel from "./SkillsPanel/AssessmentSkillsPanel";

import {
  useAssessmentSkillsCoverage,
} from "./SkillsPanel/useAssessmentSkillsCoverage";

import {
  useAssessmentSkillsPanelState,
} from "./SkillsPanel/useAssessmentSkillsPanelState";

import {
  useAssessmentDatePopover,
} from "./TopBar/useAssessmentDatePopover";

import {
  useAssessmentNameField,
} from "./TopBar/useAssessmentNameField";

import AssessmentCreatorStyles from "./AssessmentCreatorStyles";


export default function AssessmentCreatorPage() {
  const [
    hasMounted,
    setHasMounted,
  ] =
    useState(
      false
    );

  useEffect(
    () => {
      setHasMounted(
        true
      );
    },
    []
  );

  if (
    !hasMounted
  ) {
    return null;
  }

  return (
    <AssessmentCreatorContent />
  );
}


function AssessmentCreatorContent() {
  const router =
    useRouter();

  const {
    theme,
  } =
    useTheme();

  useBuilderWorkspaceDocumentLock();


  /*
   * Course
   */

  const courseConfig =
    useMemo(
      () =>
        getAssessmentCreationCourseConfig(),
      []
    );

  const activeSkillsData =
    useMemo(
      () =>
        courseConfig.skillTree ??
        {},
      [
        courseConfig,
      ]
    );


  /*
   * Question-generation controls
   */

  const {
    standardFilter,
    setStandardFilter,

    thinkingTypeFilter,
    setThinkingTypeFilter,

    targetMarks,
    setTargetMarks,
  } =
    useAssessmentQuestionControls();


  /*
   * Paper selection
   */

  const {
    activePaper,
    setActivePaper,

    viewPaper,
    setViewPaper,

    handleActivePaperChange,
  } =
    useAssessmentPaperSelection({
      courseConfig,
    });


  /*
   * Preview display mode
   */

  const {
    previewViewMode,
    setPreviewViewMode,

    suppressPreviewSpacing,
    showPreviewAnswers,
  } =
    usePreviewViewMode();


  /*
   * Per-paper target marks
   */

  const {
    targetMarksByPaper:
      assessmentTargetMarksByPaper,

    setTargetMarksByPaper:
      setAssessmentTargetMarksByPaper,

    p1Target,
    p2Target,
  } =
    useAssessmentPaperTargetState({
      courseConfig,
    });


  /*
   * Skills Panel state
   */

  const {
    collapsedCategories,
    expandedSkillIds,

    toggleCategory,
    toggleSkillRow,

    collapseAllSkills,

    setConceptIndex,
    setDifficulty,

    getConceptIndex,
    getDifficulty,

    restoreTreeForQuestion,
  } =
    useAssessmentSkillsPanelState({
      activeSkillsData,

      setStandardFilter,
      setTargetMarks,

      setActivePaper,
      setViewPaper,
    });


  /*
   * Question and draft state
   */

  const {
    questions,
    setQuestions,

    draftByPaper,
    setDraftByPaper,

    editDraftByPaper,
    setEditDraftByPaper,

    editForView,
    newDraftForView,

    editDraftRef,
    pendingJumpDraftRef,

    measuredHeights,
    setMeasuredHeights,

    handlePreferredAnswerMethodChange,
  } =
    useAssessmentQuestionState({
      courseConfig,
      viewPaper,
    });


  /*
   * Workspace refs
   */

  const previewPaneRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const pageWrapperRefs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >(
      []
    );

  const assessmentDateFieldRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /*
   * Document settings
   */

  const [
    includeCoverSheet,
    setIncludeCoverSheet,
  ] =
    useState(
      false
    );

  const [
    showCoverDateTime,
    setShowCoverDateTime,
  ] =
    useState(
      false
    );

  const [
    showScottishCandidateNumberBox,
    setShowScottishCandidateNumberBox,
  ] =
    useState(
      true
    );

  const [
    includeFormulaSheet,
    setIncludeFormulaSheet,
  ] =
    useState(
      false
    );


  /*
   * Assessment metadata and local UI
   */

  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(
      false
    );

  const [
    assessmentName,
    setAssessmentName,
  ] =
    useState(
      "[Untitled file]"
    );

  const [
    className,
    setClassName,
  ] =
    useState(
      ""
    );

  const [
    assessmentDate,
    setAssessmentDate,
  ] =
    useState(
      getTodayAssessmentDisplayDate()
    );

  const [
    assessmentCalendarOpen,
    setAssessmentCalendarOpen,
  ] =
    useState(
      false
    );

  const [
    ,
    setCreatedAt,
  ] =
    useState<number>(
      Date.now()
    );


  /*
   * Paper sitting metadata
   */

  const {
    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,

    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,

    coverDateCustomByPaper,

    datesUnlinked,
    setDatesUnlinked,

    dateLinkOwnerPaper,
    setDateLinkOwnerPaper,

    startTimesUnlinked,
    setStartTimesUnlinked,

    startTimeLinkOwnerPaper,
    setStartTimeLinkOwnerPaper,

    setCoverDateByPaper,
    setStartTimeByPaper,
    setEndTimeByPaper,

    setCoverDateCustomByPaper,
    setEndTimeManuallyEditedByPaper,

    setPrimaryCoverDate,

    setStartTimeForPaper,
    setEndTimeForPaper,

    setCoverDateForPaper,
    setCoverDateCustomForPaper,

    setEndTimeManuallyEditedForPaper,

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,

    p2DateCustom,

    setP1StartTime,
    setP1EndTime,

    setP2CoverDate,
    setP2StartTime,
    setP2EndTime,

    setP2DateCustom,

    setP1EndTimeManuallyEdited,
    setP2EndTimeManuallyEdited,
  } =
    useAssessmentPaperSittingState({
      courseConfig,
      assessmentDate,

      setAssessmentDate,
    });


  /*
   * Workspace layout
   */

  const {
    layoutRef,
    hudResizeStartRef,

    leftPaneRatio,
    setLeftPaneRatio,

    isDraggingDivider,
    setIsDraggingDivider,

    hudHeight,
    setHudHeight,

    setIsDraggingHud,

    showProgressPanel,
    setShowProgressPanel,

    resetLayout,
  } =
    useAssessmentWorkspaceLayout();


  /*
   * Historical local-state compatibility
   */

  useAssessmentCreatorInitialisation({
    courseConfig,

    setLeftPaneRatio,
    setHudHeight,

    setShowProgressPanel,

    setIncludeCoverSheet,
    setShowCoverDateTime,

    setShowScottishCandidateNumberBox,

    setIncludeFormulaSheet,

    setAssessmentName,
    setClassName,
    setAssessmentDate,

    setP2CoverDate,
    setCreatedAt,

    setP1StartTime,
    setP1EndTime,

    setP2StartTime,
    setP2EndTime,

    setP2DateCustom,

    setP1EndTimeManuallyEdited,
    setP2EndTimeManuallyEdited,

    setActivePaper,
    setViewPaper,

    setTargetMarksByPaper:
      setAssessmentTargetMarksByPaper,

    setQuestions,
  });


  useAssessmentCreationPersistence({
    leftPaneRatio,

    hudHeight,

    showProgressPanel,

    includeCoverSheet,

    showCoverDateTime,

    showScottishCandidateNumberBox,

    includeFormulaSheet,

    assessmentName,
    className,
    assessmentDate,

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,

    p2DateCustom,

    questions,
  });


  /*
   * Feedback
   */

  const {
    qualityNotes,
    flashWarning,

    pushFlash,
    addQualityNote,
  } =
    useAssessmentCreationFeedback();


  /*
   * Local UI behaviour
   */

  useAssessmentDatePopover({
    open:
      assessmentCalendarOpen,

    setOpen:
      setAssessmentCalendarOpen,

    fieldRef:
      assessmentDateFieldRef,
  });

  useAssessmentSettingsDrawer({
    open:
      settingsOpen,

    setOpen:
      setSettingsOpen,
  });


  /*
   * Current assessment progress
   */

  const {
    assignedForView,

    activePaperCoverMarks,

    marksByPaper,
    minutesByPaper,
  } =
    useAssessmentProgressMetrics({
      questions,
      viewPaper,
      courseConfig,
    });


  /*
   * Assessment-name field behaviour
   */

  const {
    handleAssessmentNameFocus,
    handleAssessmentNameBlur,
  } =
    useAssessmentNameField({
      assessmentName,
      setAssessmentName,
    });


  /*
   * Preview question measurement
   */

  const {
    onMeasure,
  } =
    useMeasuredQuestionHeights({
      questions,

      draftByPaper,
      editDraftByPaper,

      setMeasuredHeights,
    });


  /*
   * Saved-assessment hydration
   */

  const {
    currentAssessmentId,

    loadedSavedAssessment,

    hasLoadedSavedAssessment,

    selectedClassIds,

    setSelectedClassIds,

    useCompleteCourseCoverage,

    setUseCompleteCourseCoverage,
  } =
    useAssessmentCreatorSavedAssessment({
      setCreatedAt,

      setAssessmentName,
      setClassName,
      setAssessmentDate,

      setStandardFilter,
      setThinkingTypeFilter,
      setTargetMarks,

      setActivePaper,
      setViewPaper,

      setTargetMarksByPaper:
        setAssessmentTargetMarksByPaper,

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
    });


  /*
   * Intended sitting duration
   *
   * This is based on the assessment SETUP —
   * never the current live marks shown in HUD.
   */

  const intendedDurationMinutesByPaper =
    useMemo(
      () =>
        buildAssessmentPaperIntendedDurationMinutesByPaper({
          courseConfig,

          buildPriority:
            loadedSavedAssessment
              ?.setup
              .buildPriority ??
            null,

          marksTargetP1:
            loadedSavedAssessment
              ?.setup
              .marksTargetP1 ??
            null,

          marksTargetP2:
            loadedSavedAssessment
              ?.setup
              .marksTargetP2 ??
            null,

          timeTargetP1:
            loadedSavedAssessment
              ?.setup
              .timeTargetP1 ??
            null,

          timeTargetP2:
            loadedSavedAssessment
              ?.setup
              .timeTargetP2 ??
            null,

          targetMarksByPaper:
            assessmentTargetMarksByPaper,
        }),
      [
        courseConfig,
        loadedSavedAssessment,
        assessmentTargetMarksByPaper,
      ]
    );


  /*
   * Automatic End times
   */

  useAssessmentPaperAutomaticTiming({
    courseConfig,

    intendedDurationMinutesByPaper,

    startTimeByPaper,

    endTimeManuallyEditedByPaper,

    endTimeSetterByPaper,
  });


  /*
   * Class coverage and visible skills
   */

  const {
    builderLevelLabel:
      assessmentLevelLabel,

    builderAvailableClasses:
      availableClasses,

    computedClassSummary,

    filteredSkillsData,
    totalSkillsCount,

    toggleClass:
      handleToggleClass,

    selectCompleteCourseCoverage:
      handleSelectCompleteCourseCoverage,
  } =
    useAssessmentSkillsCoverage({
      loadedSavedAssessment,

      selectedClassIds,

      setSelectedClassIds,

      useCompleteCourseCoverage,

      setUseCompleteCourseCoverage,

      activeSkillsData,

      setClassName,
    });


  /*
   * Saved-assessment autosave
   */

  const {
    saveStatus,
  } =
    useAssessmentCreatorAutoSave({
      currentAssessmentId,

      loadedSavedAssessment,

      hasLoadedSavedAssessment,

      standardFilter,
      thinkingTypeFilter,

      targetMarks,

      activePaper,
      viewPaper,

      targetMarksByPaper:
        assessmentTargetMarksByPaper,

      p1Target,
      p2Target,

      questions,

      draftByPaper,
      editDraftByPaper,

      includeCoverSheet,
      includeFormulaSheet,

      showCoverDateTime,

      showScottishCandidateNumberBox,

      assessmentName,
      assessmentDate,

      computedClassSummary,

      coverDateByPaper,
      startTimeByPaper,
      endTimeByPaper,

      coverDateCustomByPaper,

      datesUnlinked,
      dateLinkOwnerPaper,

      startTimesUnlinked,
      startTimeLinkOwnerPaper,

      endTimeManuallyEditedByPaper,

      p1StartTime,
      p1EndTime,

      p2CoverDate,
      p2StartTime,
      p2EndTime,

      p2DateCustom,

      selectedClassIds,

      useCompleteCourseCoverage,
    });


  /*
   * Question workflow
   */

  const {
    addQuestionToPaper,
    regenerateQuestionToPaper,

    assignNewDraft,
    removeNewDraft,

    startEditLockedQuestion,

    saveEdit,
    removeWhileEditing,

    canAssignNewDraft,
    canSaveEdit,

    invalidCommitMessage,
  } =
    useAssessmentQuestionWorkflow({
      courseConfig,

      standardFilter,
      thinkingTypeFilter,

      targetMarks,

      activePaper,
      viewPaper,

      questions,

      draftByPaper,
      editDraftByPaper,

      editDraftRef,

      setQuestions,
      setDraftByPaper,
      setEditDraftByPaper,

      setViewPaper,

      pendingJumpDraftRef,

      pushFlash,
      addQualityNote,

      restoreTreeForQuestion,
    });


  /*
   * Preview content
   */

  const {
    previewAssignedForView,
    previewEditForView,
    previewNewDraftForView,
  } =
    useCompactPreviewContent({
      assignedForView,

      editForView,
      newDraftForView,

      suppressPreviewSpacing,
    });


  /*
   * Preview pages
   */

  const {
    renderById,
    previewPages,
  } =
    useAssessmentPreviewPages({
      assignedForView:
        previewAssignedForView,

      editForView:
        previewEditForView,

      newDraftForView:
        previewNewDraftForView,

      measuredHeights,

      includeCoverSheet,
      includeFormulaSheet,
    });


  /*
   * Preview viewport
   */

  const {
    zoomPct,

    currentViewerPage,
    viewerScale,

    totalViewerPages,

    zoomIn,
    zoomOut,
    resetZoom,
  } =
    useAssessmentPreviewViewport({
      previewPaneRef,
      pageWrapperRefs,

      previewPages,

      showProgressPanel,

      includeCoverSheet,
      includeFormulaSheet,

      viewPaper,
    });


  useAssessmentPreviewJumpNavigation({
    pendingJumpDraftRef,

    previewPages,

    viewPaper,

    pageWrapperRefs,
    previewPaneRef,
  });


  /*
   * Paper targets and HUD
   */

  const {
    targetMarksByPaper,

    includedPapers,

    totalAssessmentMarks,
  } =
    useAssessmentPaperTargets({
      targetMarksByPaper:
        assessmentTargetMarksByPaper,

      courseConfig,
    });

  const progressHudPaperRows =
    useAssessmentProgressRows({
      courseConfig,

      marksByPaper,

      targetMarksByPaper,

      minutesByPaper,
    });


  /*
   * Assessment-quality analysis
   */

  const {
    mergedQualityNotes,
  } =
    useAssessmentQualityAnalysis({
      questions,

      courseConfig,

      includedPapers,

      totalAssessmentMarks,

      qualityNotes,
    });

  void mergedQualityNotes;


  /*
   * Printable paper metadata
   */

  const {
    coverDateTextForView,
    coverTimeTextForView,
  } =
    useAssessmentPaperViewMetadata({
      viewPaper,

      coverDateByPaper,
      startTimeByPaper,
      endTimeByPaper,

      fallbackCoverDate:
        assessmentDate,
    });


  const {
    printSubjectName,

    printQualificationBadge,

    printQualificationLabelLines,

    paperPrintTitle,

    paperCoverInstructionText,

    showNoCalculatorIcon,
  } =
    useAssessmentPaperPrintMetadata({
      paper:
        viewPaper,

      courseConfig,
    });


  /*
   * Workspace dimensions
   */

  const viewerHudRow =
    showProgressPanel
      ? `${hudHeight}px`
      : "0px";

  const dividerWidth =
    ASSESSMENT_WORKSPACE_DIVIDER_WIDTH_PX;

  const bodyGridColumns =
    `${(
      leftPaneRatio *
      100
    ).toFixed(
      3
    )}% ${dividerWidth}px minmax(0, 1fr)`;


  /*
   * Compile navigation
   */

  const routerPushCompile =
    useCallback(
      () => {
        router.push(
          "/compile-assessment"
        );
      },
      [
        router,
      ]
    );


  return (
    <>
      <AssessmentCreatorStyles
        theme={
          theme
        }
      />

      <main
        style={{
          height:
            "100vh",

          maxHeight:
            "100vh",

          background:
            theme.bgPage,

          color:
            theme.textPrimary,

          display:
            "grid",

          gridTemplateRows:
            "1fr",

          overflow:
            "hidden",

          position:
            "relative",

          ...UI_TEXT.appRoot,
        }}
      >
        <div
          ref={
            layoutRef
          }
          style={{
            display:
              "grid",

            gridTemplateColumns:
              bodyGridColumns,

            minHeight:
              0,

            height:
              "100%",

            overflow:
              "hidden",

            fontFamily:
              UI_TYPO.family,
          }}
        >
          <AssessmentSkillsPanel
            theme={
              theme
            }

            skillsTreeProps={{
              skillsData:
                filteredSkillsData,

              totalSkillsCount,

              standardFilter,

              setStandardFilter,

              thinkingTypeFilter,

              setThinkingTypeFilter,

              targetMarks,

              setTargetMarks,

              minTargetMarks:
                1,

              maxTargetMarks:
                6,

              activePaper,

              setActivePaper:
                handleActivePaperChange,

              collapsedCategories,

              toggleCategory,

              expandedSkillIds,

              toggleSkillRow,

              collapseAllSkills,

              getConceptIndex,

              setConceptIndex,

              getDifficulty,

              setDifficulty,

              addQuestionToPaper,

              regenerateQuestionToPaper,
            }}
          />

          <WorkspaceDivider
            theme={
              theme
            }

            width={
              dividerWidth
            }

            isDragging={
              isDraggingDivider
            }

            setIsDragging={
              setIsDraggingDivider
            }
          />

          <AssessmentPaperWorkspace
            theme={
              theme
            }

            viewerHudRow={
              viewerHudRow
            }

            showPreviewAnswers={
              showPreviewAnswers
            }

            saveStatus={
              saveStatus
            }

            topBarProps={{
              assessmentName,

              setAssessmentName,

              assessmentDate,

              /*
               * Manual TopBar date edits now use
               * the same permanent-link semantics
               * as the forthcoming tray.
               */
              setAssessmentDate:
                setPrimaryCoverDate,

              builderCalendarOpen:
                assessmentCalendarOpen,

              setBuilderCalendarOpen:
                setAssessmentCalendarOpen,

              builderDateFieldRef:
                assessmentDateFieldRef,

              handleAssessmentNameFocus,

              handleAssessmentNameBlur,

              viewPaper,

              setViewPaper,

              classLevelLabel:
                assessmentLevelLabel,

              availableClasses,

              selectedClassIds,

              useCompleteCourseCoverage,

              onToggleClass:
                handleToggleClass,

              onSelectCompleteCourseCoverage:
                handleSelectCompleteCourseCoverage,
            }}

            previewChromeProps={{
              zoomPct,

              zoomIn,

              zoomOut,

              currentViewerPage,

              totalViewerPages,
            }}

            viewControlsProps={{
              previewViewMode,

              onPreviewViewModeChange:
                setPreviewViewMode,

              showHud:
                showProgressPanel,

              onShowHudChange:
                setShowProgressPanel,

              onResetLayout:
                resetLayout,

              onResetZoom:
                resetZoom,
            }}

            settingsControlsProps={{
              includeCoverSheet,

              onIncludeCoverSheetChange:
                setIncludeCoverSheet,

              includeFormulaSheet,

              onIncludeFormulaSheetChange:
                setIncludeFormulaSheet,

              showCoverDateTime,

              onShowCoverDateTimeChange:
                setShowCoverDateTime,

              showCandidateNumber:
                showScottishCandidateNumberBox,

              onShowCandidateNumberChange:
                setShowScottishCandidateNumberBox,
            }}

            previewProps={{
              previewPaneRef,

              pageWrapperRefs,

              flashWarning,

              previewPages,

              onPreferredAnswerMethodChange:
                handlePreferredAnswerMethodChange,

              viewPaper,

              viewerScale,

              activePaperCoverMarks,

              showCoverDateTime,

              coverDateTextForView,

              coverTimeTextForView,

              printSubjectName,

              printQualificationBadge,

              printQualificationLabelLines,

              paperPrintTitle,

              paperCoverInstructionText,

              showNoCalculatorIcon,

              showScottishCandidateNumberBox,

              includeCoverSheet,

              includeFormulaSheet,

              renderById,

              editForView:
                previewEditForView,

              onMeasure,

              saveEdit,

              removeWhileEditing,

              assignNewDraft,

              removeNewDraft,

              startEditLockedQuestion,

              canAssignNewDraft,

              canSaveEdit,

              invalidCommitMessage,
            }}

            hudProps={{
              routerPushCompile,

              showProgressPanel,

              hudHeight,

              hudResizeStartRef,

              setIsDraggingHud,

              viewPaper,

              paperRows:
                progressHudPaperRows,

              qualityNotes,
            }}
          />
        </div>

        <AssessmentSettings
          open={
            settingsOpen
          }

          onClose={() =>
            setSettingsOpen(
              false
            )
          }

          theme={
            theme
          }

          includeCoverSheet={
            includeCoverSheet
          }

          setIncludeCoverSheet={
            setIncludeCoverSheet
          }

          showCoverDateTime={
            showCoverDateTime
          }

          setShowCoverDateTime={
            setShowCoverDateTime
          }

          assessmentDate={
            assessmentDate
          }

          /*
           * The old Settings drawer temporarily
           * stays wired, but now obeys the new
           * linked-date state model too.
           */
          setAssessmentDate={
            setPrimaryCoverDate
          }

          coverDateByPaper={
            coverDateByPaper
          }

          startTimeByPaper={
            startTimeByPaper
          }

          endTimeByPaper={
            endTimeByPaper
          }

          coverDateCustomByPaper={
            coverDateCustomByPaper
          }

          setStartTimeForPaper={
            setStartTimeForPaper
          }

          setEndTimeForPaper={
            setEndTimeForPaper
          }

          setCoverDateForPaper={
            setCoverDateForPaper
          }

          setCoverDateCustomForPaper={
            setCoverDateCustomForPaper
          }

          setEndTimeManuallyEditedForPaper={
            setEndTimeManuallyEditedForPaper
          }

          showScottishCandidateNumberBox={
            showScottishCandidateNumberBox
          }

          setShowScottishCandidateNumberBox={
            setShowScottishCandidateNumberBox
          }

          includeFormulaSheet={
            includeFormulaSheet
          }

          setIncludeFormulaSheet={
            setIncludeFormulaSheet
          }

          showProgressPanel={
            showProgressPanel
          }

          setShowProgressPanel={
            setShowProgressPanel
          }

          resetLayout={
            resetLayout
          }

          resetZoom={
            resetZoom
          }
        />
      </main>
    </>
  );
}