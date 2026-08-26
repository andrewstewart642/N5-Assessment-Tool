
import type {
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/src/Assessments/AssessmentTypes";

import {
  isVariantEligibleForFilters,
  type QuestionCalculatorStatus,
  type QuestionSelectionFilters,
  type QuestionVariantSelectionMeta,
} from "@/src/Assessments/Questions/Selection/QuestionSelectionTypes";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "./AssessmentQuestionDraftTypes";

import {
  useAssessmentDraftWorkflow,
} from "./useAssessmentDraftWorkflow";

import {
  useAssessmentQuestionDraftGeneration,
} from "./useAssessmentQuestionDraftGeneration";

type PendingJumpDraftRef =
  MutableRefObject<
    | {
        paper: Paper;
        draftId: string;
      }
    | null
  >;

type EditDraftRef =
  MutableRefObject<
    AssessmentEditQuestionDraftByPaper
  >;

type UseAssessmentQuestionWorkflowArgs = {
  courseConfig:
    CourseAssessmentConfig;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  activePaper:
    Paper;

  viewPaper:
    Paper;

  questions:
    Question[];

  draftByPaper:
    AssessmentQuestionDraftByPaper;

  editDraftByPaper:
    AssessmentEditQuestionDraftByPaper;

  editDraftRef:
    EditDraftRef;

  setQuestions:
    Dispatch<
      SetStateAction<
        Question[]
      >
    >;

  setDraftByPaper:
    Dispatch<
      SetStateAction<
        AssessmentQuestionDraftByPaper
      >
    >;

  setEditDraftByPaper:
    Dispatch<
      SetStateAction<
        AssessmentEditQuestionDraftByPaper
      >
    >;

  setViewPaper:
    Dispatch<
      SetStateAction<Paper>
    >;

  pendingJumpDraftRef:
    PendingJumpDraftRef;

  pushFlash:
    (
      message: string
    ) => void;

  addQualityNote:
    (
      message: string
    ) => void;

  restoreTreeForQuestion:
    (
      question: Question
    ) => void;
};

const INVALID_COMMIT_MESSAGE =
  "This question is outside your current tree filters. Adjust the filters to assign it to the paper.";

function mapCalculatorStatus(
  question:
    Question
): QuestionCalculatorStatus {
  if (
    question.calculatorStatus ===
    "NonCalculatorOnly"
  ) {
    return "NonCalculatorOnly";
  }

  if (
    question.calculatorStatus ===
    "CalculatorOnly"
  ) {
    return "CalculatorRequired";
  }

  return "CalculatorAllowed";
}

function buildFallbackSelectionMeta(
  question:
    Question
): QuestionVariantSelectionMeta {
  const totalMarks =
    typeof question.marks ===
      "number" &&
    Number.isFinite(
      question.marks
    )
      ? question.marks
      : question.targetMarks;

  let cMarks =
    typeof question.cMarks ===
      "number"
      ? question.cMarks
      : 0;

  let aMarks =
    typeof question.aMarks ===
      "number"
      ? question.aMarks
      : 0;

  if (
    cMarks === 0 &&
    aMarks === 0
  ) {
    if (
      question.standardFilter ===
      "C"
    ) {
      cMarks =
        totalMarks;
    } else if (
      question.standardFilter ===
      "A"
    ) {
      aMarks =
        totalMarks;
    } else {
      cMarks =
        totalMarks;
    }
  }

  return {
    level:
      question.difficulty,

    templateId:
      question.questionCode ??
      question.id,

    marks: {
      totalMarks,
      cMarks,
      aMarks,

      reasoningMarks:
        typeof question.reasoningMarks ===
          "number"
          ? question.reasoningMarks
          : 0,
    },

    standardProfile:
      cMarks > 0 &&
      aMarks > 0
        ? "C+A"
        : aMarks > 0
          ? "A"
          : "C",

    paperSuitability:
      question.paper,

    calculatorStatus:
      mapCalculatorStatus(
        question
      ),
  };
}

function getSelectionMetaForQuestion(
  question:
    Question
): QuestionVariantSelectionMeta {
  return (
    question.selectionMeta ??
    buildFallbackSelectionMeta(
      question
    )
  );
}

function isQuestionEligibleForFilters(
  question:
    Question,

  filters:
    QuestionSelectionFilters
): boolean {
  return isVariantEligibleForFilters(
    getSelectionMetaForQuestion(
      question
    ),
    filters
  );
}

export function useAssessmentQuestionWorkflow({
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
}: UseAssessmentQuestionWorkflowArgs) {
  const currentFilters:
    QuestionSelectionFilters = {
      selectedStandard:
        standardFilter,

      selectedThinkingType:
        thinkingTypeFilter,

      targetMarks,

      targetPaper:
        activePaper,
    };

  const {
    addQuestionToPaper,
    regenerateQuestionToPaper,
  } =
    useAssessmentQuestionDraftGeneration({
      courseConfig,

      standardFilter,
      thinkingTypeFilter,
      targetMarks,

      editDraftRef,

      setDraftByPaper,
      setEditDraftByPaper,
      setViewPaper,

      pendingJumpDraftRef,

      pushFlash,
      addQualityNote,
    });

  const newDraftForView =
    draftByPaper[
      viewPaper
    ];

  const editForView =
    editDraftByPaper[
      viewPaper
    ];

  const canAssignNewDraft =
    !!newDraftForView &&
    isQuestionEligibleForFilters(
      newDraftForView,
      currentFilters
    );

  const canSaveEdit =
    !!editForView &&
    isQuestionEligibleForFilters(
      editForView.draft,
      currentFilters
    );

  const {
    assignNewDraft,
    removeNewDraft,

    startEditLockedQuestion,

    saveEdit,
    removeWhileEditing,
  } =
    useAssessmentDraftWorkflow({
      viewPaper,

      questions,

      draftByPaper,
      editDraftByPaper,

      setQuestions,
      setDraftByPaper,
      setEditDraftByPaper,

      pendingJumpDraftRef,

      isQuestionCommitEligible:
        (
          question
        ) =>
          isQuestionEligibleForFilters(
            question,
            currentFilters
          ),

      onInvalidCommit:
        () =>
          pushFlash(
            INVALID_COMMIT_MESSAGE
          ),

      restoreTreeForQuestion,
    });

  return {
    addQuestionToPaper,
    regenerateQuestionToPaper,

    assignNewDraft,
    removeNewDraft,

    startEditLockedQuestion,

    saveEdit,
    removeWhileEditing,

    canAssignNewDraft,
    canSaveEdit,

    invalidCommitMessage:
      INVALID_COMMIT_MESSAGE,
  };
}