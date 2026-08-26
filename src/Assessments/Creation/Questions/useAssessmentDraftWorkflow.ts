
import {
  useCallback,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

import type {
  Paper,
  Question,
} from "@/src/Assessments/AssessmentTypes";

import {
  applyAssessmentQuestionSpacingBase,
} from "./AssessmentQuestionSpacing";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "./AssessmentQuestionDraftTypes";

type PendingJumpDraftRef =
  MutableRefObject<
    | {
        paper: Paper;
        draftId: string;
      }
    | null
  >;

type UseAssessmentDraftWorkflowArgs = {
  viewPaper:
    Paper;

  questions:
    Question[];

  draftByPaper:
    AssessmentQuestionDraftByPaper;

  editDraftByPaper:
    AssessmentEditQuestionDraftByPaper;

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

  pendingJumpDraftRef:
    PendingJumpDraftRef;

  isQuestionCommitEligible:
    (
      question: Question
    ) => boolean;

  onInvalidCommit:
    () => void;

  restoreTreeForQuestion:
    (
      question: Question
    ) => void;
};

function createAssessmentQuestionId(): string {
  return (
    Math.random()
      .toString(16)
      .slice(2) +
    Date.now()
      .toString(16)
  );
}

export function useAssessmentDraftWorkflow({
  viewPaper,

  questions,

  draftByPaper,
  editDraftByPaper,

  setQuestions,
  setDraftByPaper,
  setEditDraftByPaper,

  pendingJumpDraftRef,

  isQuestionCommitEligible,
  onInvalidCommit,

  restoreTreeForQuestion,
}: UseAssessmentDraftWorkflowArgs) {
  const assignNewDraft =
    useCallback(() => {
      const draft =
        draftByPaper[
          viewPaper
        ];

      if (!draft) {
        return;
      }

      if (
        !isQuestionCommitEligible(
          draft
        )
      ) {
        onInvalidCommit();
        return;
      }

      const committedQuestion =
        applyAssessmentQuestionSpacingBase({
          ...draft,

          id:
            createAssessmentQuestionId(),

          createdAt:
            Date.now(),
        });

      setQuestions(
        (
          previous
        ) => [
          ...previous,
          committedQuestion,
        ]
      );

      setDraftByPaper(
        (
          previous
        ) => ({
          ...previous,

          [viewPaper]:
            null,
        })
      );
    }, [
      draftByPaper,
      viewPaper,

      setQuestions,
      setDraftByPaper,

      isQuestionCommitEligible,
      onInvalidCommit,
    ]);

  const removeNewDraft =
    useCallback(() => {
      pendingJumpDraftRef.current =
        null;

      setDraftByPaper(
        (
          previous
        ) => ({
          ...previous,

          [viewPaper]:
            null,
        })
      );
    }, [
      viewPaper,
      setDraftByPaper,
      pendingJumpDraftRef,
    ]);

  const startEditLockedQuestion =
    useCallback(
      (
        lockedQuestionId:
          string
      ) => {
        const questionIndex =
          questions.findIndex(
            (
              question
            ) =>
              question.id ===
              lockedQuestionId
          );

        if (
          questionIndex <
          0
        ) {
          return;
        }

        const original =
          questions[
            questionIndex
          ];

        restoreTreeForQuestion(
          original
        );

        pendingJumpDraftRef.current = {
          paper:
            original.paper,

          draftId:
            original.id,
        };

        setEditDraftByPaper(
          (
            previous
          ) => ({
            ...previous,

            [original.paper]: {
              questionIndex,

              original,

              draft: {
                ...original,
              },
            },
          })
        );
      },
      [
        questions,
        setEditDraftByPaper,
        restoreTreeForQuestion,
        pendingJumpDraftRef,
      ]
    );

  const saveEdit =
    useCallback(() => {
      const edit =
        editDraftByPaper[
          viewPaper
        ];

      if (!edit) {
        return;
      }

      if (
        !isQuestionCommitEligible(
          edit.draft
        )
      ) {
        onInvalidCommit();
        return;
      }

      const committedQuestion =
        applyAssessmentQuestionSpacingBase({
          ...edit.draft,

          createdAt:
            Date.now(),
        });

      setQuestions(
        (
          previous
        ) => {
          if (
            edit.questionIndex <
              0 ||
            edit.questionIndex >=
              previous.length
          ) {
            return previous;
          }

          const next = [
            ...previous,
          ];

          next[
            edit.questionIndex
          ] =
            committedQuestion;

          return next;
        }
      );

      setEditDraftByPaper(
        (
          previous
        ) => ({
          ...previous,

          [viewPaper]:
            null,
        })
      );
    }, [
      editDraftByPaper,
      viewPaper,

      setQuestions,
      setEditDraftByPaper,

      isQuestionCommitEligible,
      onInvalidCommit,
    ]);

  const removeWhileEditing =
    useCallback(() => {
      pendingJumpDraftRef.current =
        null;

      const edit =
        editDraftByPaper[
          viewPaper
        ];

      if (!edit) {
        return;
      }

      setQuestions(
        (
          previous
        ) =>
          previous.filter(
            (
              question
            ) =>
              question.id !==
              edit.original.id
          )
      );

      setEditDraftByPaper(
        (
          previous
        ) => ({
          ...previous,

          [viewPaper]:
            null,
        })
      );
    }, [
      editDraftByPaper,
      viewPaper,

      setQuestions,
      setEditDraftByPaper,

      pendingJumpDraftRef,
    ]);

  return {
    assignNewDraft,
    removeNewDraft,

    startEditLockedQuestion,

    saveEdit,
    removeWhileEditing,
  };
}