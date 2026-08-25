"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

import BuilderGlobalStyles from "@/app/create-assessment/builder/BuilderStyles";

import {
  BUILDER_STORAGE_KEY_PAIRS,
} from "@/app/create-assessment/builder/BuilderStorageKeys";

import {
  clamp,
} from "@/app/create-assessment/builder/BuilderUtils";

import {
  BUILDER_DEFAULT_HUD_HEIGHT,
  BUILDER_DIVIDER_WIDTH_PX,
} from "@/app/create-assessment/builder/builder-definitions/BuilderConstants";

import {
  getAssessmentCreationCourseConfig,
} from "./Persistence/AssessmentCourseSelectionStorage";

import {
  todayDisplayDate,
} from "@/app/create-assessment/builder/builder-logic/BuilderDateHelpers";

import {
  useBuilderFlashFeedback,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderFlashFeedback";

import {
  useBuilderInitialisation,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderInitialisation";

import {
  useBuilderLayout,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderLayouts";

import {
  useBuilderMetadataTiming,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderMetadataTiming";

import {
  useBuilderPaperPrintMetadata,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderPaperPrintMetadata";

import {
  useBuilderPaperSittingState,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderPaperSittingState";

import {
  useBuilderPaperTargetMaps,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderPaperTargetMaps";

import {
  useBuilderPersistence,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderPersistence";

import {
  useAssessmentProgressRows,
} from "./HUDBar/useAssessmentProgressRows";

import {
  useBuilderProgressMetrics,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderProgressMetrics";

import {
  useBuilderTargetMarksState,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderTargetMarksState";

import {
  useBuilderUiChrome,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderUiChrome";

import {
  usePaperViewMetadata,
} from "@/app/create-assessment/builder/builder-behaviour/UsePaperViewMetadata";

import {
  usePreviewViewport,
} from "@/app/create-assessment/builder/builder-behaviour/UsePreviewViewport";

import {
  useQuestionWorkflow,
} from "@/app/create-assessment/builder/builder-behaviour/UseQuestionWorkflow";

import {
  useMeasuredQuestionHeights,
} from "@/app/create-assessment/builder/builder-preview-engine/UseMeasuredQuestionHeights";

import {
  usePreviewJumpNavigation,
} from "@/app/create-assessment/builder/builder-preview-engine/UsePreviewJumpNavigation";

import {
  usePreviewPages,
} from "@/app/create-assessment/builder/builder-preview-engine/UsePreviewPages";

import type {
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import {
  useAssessmentQualityAnalysis,
} from "./Analysis/useAssessmentQualityAnalysis";

import AssessmentSettings from "./AssessmentSettings/AssessmentSettings";

import {
  useBuilderPaperSelection,
} from "./Papers/useBuilderPaperSelection";

import AssessmentPaperWorkspace from "./PaperWorkspace/AssessmentPaperWorkspace";

import WorkspaceDivider from "./PaperWorkspace/WorkspaceDivider";

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
  useAssessmentCreatorAutoSave,
} from "./Persistence/useAssessmentCreatorAutoSave";

import {
  useAssessmentCreatorSavedAssessment,
} from "./Persistence/useAssessmentCreatorSavedAssessment";

import {
  useAssessmentQuestionState,
} from "./Questions/useAssessmentQuestionState";

import AssessmentSkillsPanel from "./SkillsPanel/AssessmentSkillsPanel";

import {
  useAssessmentSkillsCoverage,
} from "./SkillsPanel/useAssessmentSkillsCoverage";

import {
  useAssessmentSkillsPanelState,
} from "./SkillsPanel/useAssessmentSkillsPanelState";


const META_NAME_KEY =
  BUILDER_STORAGE_KEY_PAIRS.metaName;

const META_CLASS_KEY =
  BUILDER_STORAGE_KEY_PAIRS.metaClass;

const META_ASSESSMENT_DATE_KEY =
  BUILDER_STORAGE_KEY_PAIRS.metaAssessmentDate;

const P1_COVER_DATE_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p1CoverDate;

const P1_START_TIME_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p1StartTime;

const P1_END_TIME_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p1EndTime;

const P2_COVER_DATE_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p2CoverDate;

const P2_START_TIME_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p2StartTime;

const P2_END_TIME_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p2EndTime;

const P2_DATE_CUSTOM_KEY =
  BUILDER_STORAGE_KEY_PAIRS.p2DateCustom;


export default function AssessmentCreatorPage() {
  const router = useRouter();
  const { theme } = useSettings();

  useBuilderWorkspaceDocumentLock();


  /*
   * Course
   */

  const builderCourseConfig =
    useMemo(() => {
      return getAssessmentCreationCourseConfig();
    }, []);

  const activeSkillsData =
    useMemo<
      Record<string, Skill[]>
    >(() => {
      return (
        builderCourseConfig.skillTree ??
        {}
      ) as Record<string, Skill[]>;
    }, [builderCourseConfig]);


  /*
   * Question-generation controls
   */

  const [
    standardFilter,
    setStandardFilter,
  ] =
    useState<StandardFilter>(
      "C+A"
    );

  const [
    thinkingTypeFilter,
    setThinkingTypeFilter,
  ] =
    useState<ThinkingTypeFilter>(
      "ANY"
    );

  const [
    targetMarks,
    setTargetMarks,
  ] =
    useState<number>(2);


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
    useBuilderPaperSelection({
      courseConfig:
        builderCourseConfig,
    });


  /*
   * Preview display mode
   */

  const {
    previewViewMode,

    suppressPreviewSpacing,
    showPreviewAnswers,

    cyclePreviewViewMode,
  } =
    usePreviewViewMode();


  /*
   * Per-paper target marks
   */

  const {
    targetMarksByPaper:
      builderTargetMarksByPaper,

    setTargetMarksByPaper:
      setBuilderTargetMarksByPaper,

    p1Target,
    p2Target,
  } =
    useBuilderTargetMarksState({
      courseConfig:
        builderCourseConfig,
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
      courseConfig:
        builderCourseConfig,

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
      Array<HTMLDivElement | null>
    >([]);

  const builderDateFieldRef =
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
    useState(false);

  const [
    showCoverDateTime,
    setShowCoverDateTime,
  ] =
    useState(false);

  const [
    showScottishCandidateNumberBox,
    setShowScottishCandidateNumberBox,
  ] =
    useState(true);

  const [
    includeFormulaSheet,
    setIncludeFormulaSheet,
  ] =
    useState(false);


  /*
   * Builder chrome and assessment metadata
   */

  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(false);

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
    useState("");

  const [
    assessmentDate,
    setAssessmentDate,
  ] =
    useState(
      todayDisplayDate()
    );

  const [
    builderCalendarOpen,
    setBuilderCalendarOpen,
  ] =
    useState(false);

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

    setCoverDateByPaper,
    setStartTimeByPaper,
    setEndTimeByPaper,

    setCoverDateCustomByPaper,
    setEndTimeManuallyEditedByPaper,

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
    useBuilderPaperSittingState({
      courseConfig:
        builderCourseConfig,

      assessmentDate,
    });


  /*
   * Workspace layout
   */

  const DEFAULT_HUD_HEIGHT =
    BUILDER_DEFAULT_HUD_HEIGHT;

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
    useBuilderLayout({
      defaultHudHeight:
        DEFAULT_HUD_HEIGHT,
    });


  /*
   * Transitional legacy Builder persistence
   */

  useBuilderInitialisation({
    defaultHudHeight:
      DEFAULT_HUD_HEIGHT,

    clampFn: clamp,

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
      setBuilderTargetMarksByPaper,

    setQuestions,

    metaNameKey:
      META_NAME_KEY,

    metaClassKey:
      META_CLASS_KEY,

    metaAssessmentDateKey:
      META_ASSESSMENT_DATE_KEY,

    p1CoverDateKey:
      P1_COVER_DATE_KEY,

    p1StartTimeKey:
      P1_START_TIME_KEY,

    p1EndTimeKey:
      P1_END_TIME_KEY,

    p2CoverDateKey:
      P2_COVER_DATE_KEY,

    p2StartTimeKey:
      P2_START_TIME_KEY,

    p2EndTimeKey:
      P2_END_TIME_KEY,

    p2DateCustomKey:
      P2_DATE_CUSTOM_KEY,
  });

  useBuilderPersistence({
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

    metaNameKey:
      META_NAME_KEY,

    metaClassKey:
      META_CLASS_KEY,

    metaAssessmentDateKey:
      META_ASSESSMENT_DATE_KEY,

    p1CoverDateKey:
      P1_COVER_DATE_KEY,

    p1StartTimeKey:
      P1_START_TIME_KEY,

    p1EndTimeKey:
      P1_END_TIME_KEY,

    p2CoverDateKey:
      P2_COVER_DATE_KEY,

    p2StartTimeKey:
      P2_START_TIME_KEY,

    p2EndTimeKey:
      P2_END_TIME_KEY,

    p2DateCustomKey:
      P2_DATE_CUSTOM_KEY,
  });


  /*
   * Feedback and Builder chrome
   */

  const {
    qualityNotes,
    flashWarning,

    pushFlash,
    addQualityNote,
  } =
    useBuilderFlashFeedback();

  useBuilderUiChrome({
    builderCalendarOpen,
    setBuilderCalendarOpen,

    builderDateFieldRef,

    settingsOpen,
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
    useBuilderProgressMetrics({
      questions,
      viewPaper,
    });


  /*
   * Metadata timing
   */

  const {
    handleAssessmentNameFocus,
    handleAssessmentNameBlur,
  } =
    useBuilderMetadataTiming({
      assessmentName,

      setAssessmentName,

      marksByPaper,

      startTimeByPaper,

      endTimeManuallyEditedByPaper,

      endTimeSetterByPaper,
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

    selectedClassIds:
      builderSelectedClassIds,

    setSelectedClassIds:
      setBuilderSelectedClassIds,

    useCompleteCourseCoverage:
      builderUseCompleteCourseCoverage,

    setUseCompleteCourseCoverage:
      setBuilderUseCompleteCourseCoverage,
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
        setBuilderTargetMarksByPaper,

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
    });


  /*
   * Class coverage and visible skills
   */

  const {
    builderLevelLabel,
    builderAvailableClasses,

    computedClassSummary,

    filteredSkillsData,
    totalSkillsCount,

    toggleClass:
      handleBuilderToggleClass,

    selectCompleteCourseCoverage:
      handleBuilderSelectCompleteCourseCoverage,
  } =
    useAssessmentSkillsCoverage({
      loadedSavedAssessment,

      selectedClassIds:
        builderSelectedClassIds,

      setSelectedClassIds:
        setBuilderSelectedClassIds,

      useCompleteCourseCoverage:
        builderUseCompleteCourseCoverage,

      setUseCompleteCourseCoverage:
        setBuilderUseCompleteCourseCoverage,

      activeSkillsData,

      setClassName,
    });


  /*
   * Saved-assessment autosave
   */

  const {
    saveStateLabel,
    isSaving,
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
        builderTargetMarksByPaper,

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

      p1StartTime,
      p1EndTime,

      p2CoverDate,
      p2StartTime,
      p2EndTime,

      p2DateCustom,

      selectedClassIds:
        builderSelectedClassIds,

      useCompleteCourseCoverage:
        builderUseCompleteCourseCoverage,
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
    useQuestionWorkflow({
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
    usePreviewPages({
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
    usePreviewViewport({
      previewPaneRef,
      pageWrapperRefs,

      previewPages,

      showProgressPanel,

      includeCoverSheet,
      includeFormulaSheet,

      viewPaper,
    });

  usePreviewJumpNavigation({
    pendingJumpDraftRef,

    previewPages,

    viewPaper,

    pageWrapperRefs,
    previewPaneRef,
  });


  /*
   * Paper target maps and HUD
   */

  const {
    targetMarksByPaper,

    includedPapers,

    totalAssessmentMarks,
  } =
    useBuilderPaperTargetMaps({
      targetMarksByPaper:
        builderTargetMarksByPaper,

      courseConfig:
        builderCourseConfig,
    });

  const progressHudPaperRows =
    useAssessmentProgressRows({
      courseConfig:
        builderCourseConfig,

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

      courseConfig:
        builderCourseConfig,

      includedPapers,

      totalAssessmentMarks,

      qualityNotes,
    });

  /*
   * Preserve current visible behaviour.
   *
   * The HUD still receives the existing transient qualityNotes collection.
   * The merged analysis collection remains ready for the later HUD migration.
   */
  void mergedQualityNotes;


  /*
   * Printable paper metadata
   */

  const {
    coverDateTextForView,
    coverTimeTextForView,
  } =
    usePaperViewMetadata({
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
    useBuilderPaperPrintMetadata({
      paper:
        viewPaper,

      courseConfig:
        builderCourseConfig,
    });


  /*
   * Workspace dimensions
   */

  const viewerHudRow =
    showProgressPanel
      ? `${hudHeight}px`
      : "0px";

  const dividerWidth =
    BUILDER_DIVIDER_WIDTH_PX;

  const bodyGridColumns =
    `${(
      leftPaneRatio * 100
    ).toFixed(
      3
    )}% ${dividerWidth}px minmax(0, 1fr)`;


  /*
   * Compile navigation
   */

  const routerPushCompile =
    useCallback(() => {
      router.push(
        "/compile-assessment"
      );
    }, [router]);


  return (
    <>
      <BuilderGlobalStyles
        theme={theme}
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
          ref={layoutRef}
          style={{
            display:
              "grid",

            gridTemplateColumns:
              bodyGridColumns,

            minHeight: 0,

            height:
              "100%",

            overflow:
              "hidden",

            fontFamily:
              UI_TYPO.family,
          }}
        >
          <AssessmentSkillsPanel
            theme={theme}

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

              minTargetMarks: 1,

              maxTargetMarks: 6,

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
            theme={theme}

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
            theme={theme}

            viewerHudRow={
              viewerHudRow
            }

            showPreviewAnswers={
              showPreviewAnswers
            }

            topBarProps={{
              assessmentName,

              setAssessmentName,

              assessmentDate,

              setAssessmentDate,

              builderCalendarOpen,

              setBuilderCalendarOpen,

              builderDateFieldRef,

              handleAssessmentNameFocus,

              handleAssessmentNameBlur,

              viewPaper,

              setViewPaper,

              classLevelLabel:
                builderLevelLabel,

              availableClasses:
                builderAvailableClasses,

              selectedClassIds:
                builderSelectedClassIds,

              useCompleteCourseCoverage:
                builderUseCompleteCourseCoverage,

              onToggleClass:
                handleBuilderToggleClass,

              onSelectCompleteCourseCoverage:
                handleBuilderSelectCompleteCourseCoverage,

              zoomPct,

              zoomIn,

              zoomOut,

              currentViewerPage,

              totalViewerPages,
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

              saveStateLabel,

              isSaving,

              previewViewMode,

              onCyclePreviewViewMode:
                cyclePreviewViewMode,
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

          theme={theme}

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

          setAssessmentDate={
            setAssessmentDate
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