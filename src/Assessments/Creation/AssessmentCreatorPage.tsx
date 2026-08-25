"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

import SkillsTree from "@/app/create-assessment/builder/components/skills-tree/SkillsTree";
import BuilderBottomHud from "@/app/create-assessment/builder/components/builder-layout/BuilderBottomHud";
import BuilderTopBar from "@/app/create-assessment/builder/components/builder-layout/BuilderTopBar";
import BuilderSettingsPanel from "@/app/create-assessment/builder/components/builder-controls/BuilderSettingsPanel";

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
  getBuilderCourseConfig,
} from "@/app/create-assessment/builder/builder-logic/BuilderCourseConfig";

import {
  todayDisplayDate,
} from "@/app/create-assessment/builder/builder-logic/BuilderDateHelpers";

import type {
  BuilderNote,
} from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

import {
  analyseTopicBalance,
} from "@/app/create-assessment/builder/builder-logic/AssessmentDistributionAnalysis";

import {
  buildCalculatorSuitabilityNotes,
} from "@/app/create-assessment/builder/builder-logic/BuildCalculatorSuitabilityNotes";

import {
  buildOperationalReasoningNotes,
} from "@/app/create-assessment/builder/builder-logic/BuildOperationalReasoningNotes";

import {
  buildStandardBalanceNotes,
} from "@/app/create-assessment/builder/builder-logic/BuildStandardBalanceNotes";

import {
  buildTopicBalanceNotes,
} from "@/app/create-assessment/builder/builder-logic/BuildTopicBalanceNotes";

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
  useBuilderProgressHudRows,
} from "@/app/create-assessment/builder/builder-behaviour/UseBuilderProgressHudRows";

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
  useSkillsTreeState,
} from "@/app/create-assessment/builder/builder-behaviour/UseSkillsTreeState";

import BuilderPreviewPane from "@/app/create-assessment/builder/builder-preview-engine/BuilderPreviewPane";

import {
  useMeasuredQuestionHeights,
} from "@/app/create-assessment/builder/builder-preview-engine/UseMeasuredQuestionHeights";

import {
  usePreviewJumpNavigation,
} from "@/app/create-assessment/builder/builder-preview-engine/UsePreviewJumpNavigation";

import {
  usePreviewPages,
} from "@/app/create-assessment/builder/builder-preview-engine/UsePreviewPages";

import {
  getFilteredConcepts,
  rankConceptsByTargetMarks,
} from "@/math-helpers/QuestionLogic";

import type {
  Question,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/src/UI/Application/Typography/Typography";

import {
  useAssessmentCreatorAutoSave,
} from "./Persistence/useAssessmentCreatorAutoSave";

import {
  useAssessmentCreatorSavedAssessment,
} from "./Persistence/useAssessmentCreatorSavedAssessment";

import {
  useAssessmentQuestionState,
} from "./Questions/useAssessmentQuestionState";

import {
  useAssessmentSkillsCoverage,
} from "./SkillsPanel/useAssessmentSkillsCoverage";

import {
  useBuilderPaperSelection,
} from "./Papers/useBuilderPaperSelection";

import {
  useBuilderWorkspaceDocumentLock,
} from "./PaperWorkspace/useBuilderWorkspaceDocumentLock";

import {
  useCompactPreviewContent,
} from "./PaperWorkspace/useCompactPreviewContent";

import {
  usePreviewViewMode,
} from "./PaperWorkspace/usePreviewViewMode";


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

  const builderCourseConfig =
    useMemo(() => {
      return getBuilderCourseConfig();
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
  ] = useState<number>(2);


  /*
   * Paper selection
   */

  const {
    activePaper,
    setActivePaper,

    viewPaper,
    setViewPaper,

    handleActivePaperChange,
  } = useBuilderPaperSelection({
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
  } = usePreviewViewMode();


  /*
   * Per-paper assessment targets
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
   * Skills Tree interaction state
   */

  const {
    collapsedCategories,
    expandedSkillIds,
    conceptIndexBySkill,
    difficultyBySkill,

    toggleCategory,
    expandCategory,

    toggleSkill:
      toggleSkillRow,

    expandSkill,

    setConceptIndex,
    setDifficulty,

    collapseAllSkills,
  } = useSkillsTreeState();


  /*
   * Questions and drafts
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
   * Builder-owned refs
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
    >([]);

  const builderDateFieldRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /*
   * Assessment document settings
   */

  const [
    includeCoverSheet,
    setIncludeCoverSheet,
  ] = useState(false);

  const [
    showCoverDateTime,
    setShowCoverDateTime,
  ] = useState(false);

  const [
    showScottishCandidateNumberBox,
    setShowScottishCandidateNumberBox,
  ] = useState(true);

  const [
    includeFormulaSheet,
    setIncludeFormulaSheet,
  ] = useState(false);


  /*
   * Builder UI state
   */

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    assessmentName,
    setAssessmentName,
  ] = useState(
    "[Untitled file]"
  );

  const [
    className,
    setClassName,
  ] = useState("");

  const [
    assessmentDate,
    setAssessmentDate,
  ] = useState(
    todayDisplayDate()
  );

  const [
    builderCalendarOpen,
    setBuilderCalendarOpen,
  ] = useState(false);

  const [
    ,
    setCreatedAt,
  ] = useState<number>(
    Date.now()
  );


  /*
   * Per-paper date and sitting metadata
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
  } = useBuilderLayout({
    defaultHudHeight:
      DEFAULT_HUD_HEIGHT,
  });


  /*
   * Legacy Builder initialisation and local persistence.
   *
   * These remain during the migration because existing local-storage
   * contracts still need to be preserved.
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
   * Builder feedback and chrome
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
   * Assessment progress
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
   * Assessment metadata timing
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
   * Preview measurement
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
   * Class coverage and Skills Tree availability
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
   * Restore Skills Tree controls when editing an existing question
   */

  const restoreTreeForQuestion =
    useCallback(
      (question: Question) => {
        setStandardFilter(
          question.standardFilter
        );

        setTargetMarks(
          question.targetMarks
        );

        setActivePaper(
          question.paper
        );

        setViewPaper(
          question.paper
        );

        if (
          !question.category ||
          !question.skillId
        ) {
          return;
        }

        expandCategory(
          question.category
        );

        expandSkill(
          question.skillId
        );

        const categorySkills =
          (
            activeSkillsData[
              question.category
            ] ?? []
          ) as Skill[];

        const skill =
          categorySkills.find(
            (entry) =>
              entry.id ===
              question.skillId
          );

        if (!skill) {
          setDifficulty(
            question.skillId,
            question.difficulty
          );

          return;
        }

        const filteredConcepts =
          getFilteredConcepts(
            skill,
            question.standardFilter
          );

        const rankedConcepts =
          rankConceptsByTargetMarks(
            filteredConcepts,
            question.targetMarks
          );

        const conceptIndex =
          rankedConcepts.findIndex(
            (concept) =>
              (
                question.conceptId &&
                concept.id ===
                  question.conceptId
              ) ||
              concept.label ===
                question.concept ||
              concept.code ===
                question.concept ||
              `${
                concept.code
              } ${
                concept.shortLabel ??
                ""
              }`.trim() ===
                question.concept.trim()
          );

        setConceptIndex(
          skill.id,
          conceptIndex >= 0
            ? conceptIndex
            : -1
        );

        setDifficulty(
          question.skillId,
          question.difficulty
        );
      },
      [
        activeSkillsData,

        expandCategory,
        expandSkill,

        setConceptIndex,
        setDifficulty,

        setStandardFilter,
        setTargetMarks,

        setActivePaper,
        setViewPaper,
      ]
    );


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
   * Skills Tree selectors
   */

  const getConceptIndex =
    (skillId: string) =>
      conceptIndexBySkill[
        skillId
      ] ?? -1;

  const getDifficulty =
    (skillId: string) =>
      difficultyBySkill[
        skillId
      ] ?? 3;


  /*
   * Compact / answer preview transformations
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
   * Preview page generation
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
   * Paper targets and HUD
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
    useBuilderProgressHudRows({
      courseConfig:
        builderCourseConfig,

      marksByPaper,
      targetMarksByPaper,
      minutesByPaper,
    });


  /*
   * Assessment analysis
   *
   * This remains in the page for this migration pass.
   * The next architectural pass can move these calculations into Analysis/.
   */

  const topicBalanceAnalysis =
    useMemo(() => {
      return analyseTopicBalance({
        questions,

        totalAssessmentMarks,

        courseConfig:
          builderCourseConfig,

        includedPapers,
      });
    }, [
      questions,
      totalAssessmentMarks,
      includedPapers,
      builderCourseConfig,
    ]);

  const topicQualityNotes =
    useMemo<
      Array<
        string | BuilderNote
      >
    >(() => {
      return buildTopicBalanceNotes({
        analysis:
          topicBalanceAnalysis,

        courseConfig:
          builderCourseConfig,

        includeBasisNote: true,

        includeRecommendationNote:
          true,
      });
    }, [
      topicBalanceAnalysis,
      builderCourseConfig,
    ]);

  const operationalReasoningNotes =
    useMemo<
      Array<
        string | BuilderNote
      >
    >(() => {
      return buildOperationalReasoningNotes(
        {
          questions,

          courseConfig:
            builderCourseConfig,

          includedPapers,

          totalAssessmentMarks,

          includeBasisNote: true,

          includeRecommendationNote:
            true,
        }
      );
    }, [
      questions,
      includedPapers,
      totalAssessmentMarks,
      builderCourseConfig,
    ]);

  const calculatorSuitabilityNotes =
    useMemo<
      Array<
        string | BuilderNote
      >
    >(() => {
      return buildCalculatorSuitabilityNotes(
        {
          questions,

          courseConfig:
            builderCourseConfig,

          includedPapers,
        }
      );
    }, [
      questions,
      includedPapers,
      builderCourseConfig,
    ]);

  const standardBalanceNotes =
    useMemo<
      Array<
        string | BuilderNote
      >
    >(() => {
      return buildStandardBalanceNotes({
        questions,

        courseConfig:
          builderCourseConfig,

        includedPapers,

        totalAssessmentMarks,

        includeBasisNote: true,

        includeRecommendationNote:
          true,
      });
    }, [
      questions,
      includedPapers,
      totalAssessmentMarks,
      builderCourseConfig,
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

  void mergedQualityNotes;


  /*
   * Paper display metadata
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
      paper: viewPaper,

      courseConfig:
        builderCourseConfig,
    });


  /*
   * Workspace layout calculations
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
   * Navigation
   */

  const routerPushCompile =
    useCallback(() => {
      router.push(
        "/compile-assessment"
      );
    }, [router]);

  const dividerColour =
    isDraggingDivider
      ? theme.accentSoft
      : theme.borderStandard;


  return (
    <>
      <BuilderGlobalStyles
        theme={theme}
      />

      <main
        style={{
          height: "100vh",
          maxHeight: "100vh",

          background:
            theme.bgPage,

          color:
            theme.textPrimary,

          display: "grid",

          gridTemplateRows:
            "1fr",

          overflow: "hidden",

          position:
            "relative",

          ...UI_TEXT.appRoot,
        }}
      >
        <div
          ref={layoutRef}
          style={{
            display: "grid",

            gridTemplateColumns:
              bodyGridColumns,

            minHeight: 0,

            height: "100%",

            overflow:
              "hidden",

            fontFamily:
              UI_TYPO.family,
          }}
        >
          <SkillsTree
            skillsData={
              filteredSkillsData
            }
            totalSkillsCount={
              totalSkillsCount
            }
            standardFilter={
              standardFilter
            }
            setStandardFilter={
              setStandardFilter
            }
            thinkingTypeFilter={
              thinkingTypeFilter
            }
            setThinkingTypeFilter={
              setThinkingTypeFilter
            }
            targetMarks={
              targetMarks
            }
            setTargetMarks={
              setTargetMarks
            }
            minTargetMarks={1}
            maxTargetMarks={6}
            activePaper={
              activePaper
            }
            setActivePaper={
              handleActivePaperChange
            }
            collapsedCategories={
              collapsedCategories
            }
            toggleCategory={
              toggleCategory
            }
            expandedSkillIds={
              expandedSkillIds
            }
            toggleSkillRow={
              toggleSkillRow
            }
            collapseAllSkills={
              collapseAllSkills
            }
            getConceptIndex={
              getConceptIndex
            }
            setConceptIndex={
              setConceptIndex
            }
            getDifficulty={
              getDifficulty
            }
            setDifficulty={
              setDifficulty
            }
            addQuestionToPaper={
              addQuestionToPaper
            }
            regenerateQuestionToPaper={
              regenerateQuestionToPaper
            }
            theme={theme}
          />

          <div
            onMouseDown={() =>
              setIsDraggingDivider(
                true
              )
            }
            onMouseUp={() =>
              setIsDraggingDivider(
                false
              )
            }
            style={{
              width:
                dividerWidth,

              background:
                dividerColour,

              cursor:
                "col-resize",

              position:
                "relative",
            }}
            title="Drag to resize panes"
          >
            <div
              style={{
                position:
                  "absolute",

                inset: 0,

                background:
                  "linear-gradient(to right, transparent 0, transparent 2px, rgba(147,197,253,0.20) 2px, rgba(147,197,253,0.20) 6px, transparent 6px, transparent 100%)",

                opacity:
                  isDraggingDivider
                    ? 1
                    : 0.3,
              }}
            />
          </div>

          <section
            data-preview-answers={
              showPreviewAnswers
                ? "shown"
                : "hidden"
            }
            style={{
              background:
                theme.bgSurface,

              display: "grid",

              gridTemplateRows:
                `65px minmax(0, 1fr) ${viewerHudRow}`,

              minHeight: 0,

              height: "100%",

              overflow:
                "hidden",

              position:
                "relative",

              fontFamily:
                UI_TYPO.family,
            }}
          >
            <BuilderTopBar
              theme={theme}
              assessmentName={
                assessmentName
              }
              setAssessmentName={
                setAssessmentName
              }
              assessmentDate={
                assessmentDate
              }
              setAssessmentDate={
                setAssessmentDate
              }
              builderCalendarOpen={
                builderCalendarOpen
              }
              setBuilderCalendarOpen={
                setBuilderCalendarOpen
              }
              builderDateFieldRef={
                builderDateFieldRef
              }
              handleAssessmentNameFocus={
                handleAssessmentNameFocus
              }
              handleAssessmentNameBlur={
                handleAssessmentNameBlur
              }
              viewPaper={
                viewPaper
              }
              setViewPaper={
                setViewPaper
              }
              classLevelLabel={
                builderLevelLabel
              }
              availableClasses={
                builderAvailableClasses
              }
              selectedClassIds={
                builderSelectedClassIds
              }
              useCompleteCourseCoverage={
                builderUseCompleteCourseCoverage
              }
              onToggleClass={
                handleBuilderToggleClass
              }
              onSelectCompleteCourseCoverage={
                handleBuilderSelectCompleteCourseCoverage
              }
              zoomPct={
                zoomPct
              }
              zoomIn={
                zoomIn
              }
              zoomOut={
                zoomOut
              }
              currentViewerPage={
                currentViewerPage
              }
              totalViewerPages={
                totalViewerPages
              }
            />

            <BuilderPreviewPane
              theme={theme}
              previewPaneRef={
                previewPaneRef
              }
              pageWrapperRefs={
                pageWrapperRefs
              }
              flashWarning={
                flashWarning
              }
              previewPages={
                previewPages
              }
              showWorkedAnswers={
                showPreviewAnswers
              }
              onPreferredAnswerMethodChange={
                handlePreferredAnswerMethodChange
              }
              viewPaper={
                viewPaper
              }
              viewerScale={
                viewerScale
              }
              activePaperCoverMarks={
                activePaperCoverMarks
              }
              showCoverDateTime={
                showCoverDateTime
              }
              coverDateTextForView={
                coverDateTextForView
              }
              coverTimeTextForView={
                coverTimeTextForView
              }
              printSubjectName={
                printSubjectName
              }
              printQualificationBadge={
                printQualificationBadge
              }
              printQualificationLabelLines={
                printQualificationLabelLines
              }
              paperPrintTitle={
                paperPrintTitle
              }
              paperCoverInstructionText={
                paperCoverInstructionText
              }
              showNoCalculatorIcon={
                showNoCalculatorIcon
              }
              showScottishCandidateNumberBox={
                showScottishCandidateNumberBox
              }
              includeCoverSheet={
                includeCoverSheet
              }
              includeFormulaSheet={
                includeFormulaSheet
              }
              renderById={
                renderById
              }
              editForView={
                previewEditForView
              }
              onMeasure={
                onMeasure
              }
              saveEdit={
                saveEdit
              }
              removeWhileEditing={
                removeWhileEditing
              }
              assignNewDraft={
                assignNewDraft
              }
              removeNewDraft={
                removeNewDraft
              }
              startEditLockedQuestion={
                startEditLockedQuestion
              }
              canAssignNewDraft={
                canAssignNewDraft
              }
              canSaveEdit={
                canSaveEdit
              }
              invalidCommitMessage={
                invalidCommitMessage
              }
            />

            <BuilderBottomHud
              theme={theme}
              routerPushCompile={
                routerPushCompile
              }
              showProgressPanel={
                showProgressPanel
              }
              hudHeight={
                hudHeight
              }
              hudResizeStartRef={
                hudResizeStartRef
              }
              setIsDraggingHud={
                setIsDraggingHud
              }
              viewPaper={
                viewPaper
              }
              paperRows={
                progressHudPaperRows
              }
              qualityNotes={
                qualityNotes
              }
              saveStateLabel={
                saveStateLabel
              }
              isSaving={
                isSaving
              }
              previewViewMode={
                previewViewMode
              }
              onCyclePreviewViewMode={
                cyclePreviewViewMode
              }
            />
          </section>
        </div>

        <BuilderSettingsPanel
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