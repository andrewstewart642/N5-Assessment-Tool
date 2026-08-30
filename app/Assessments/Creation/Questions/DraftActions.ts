import {
  useCallback,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

import type {
  Paper,
  Question,
} from "@/app/Assessments/AssessmentTypes";

import {
  applyAssessmentQuestionSpacingBase,
} from "./Spacing";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "./DraftTypes";

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

type UseAssessmentDraftWorkflowArgs = {
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
  editDraftRef,

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

        const nextEditState:
          AssessmentEditQuestionDraftByPaper = {
            ...editDraftRef.current,

            [original.paper]: {
              questionIndex,

              original,

              draft: {
                ...original,
              },
            },
          };

        /*
         * Editing is a first-class mode, not a side effect of tree restoration.
         * Commit both the ref and visible state before changing any filters so
         * Regenerate can immediately see the selected assigned question.
         */
        editDraftRef.current =
          nextEditState;

        setEditDraftByPaper(
          nextEditState
        );

        /*
         * A paper has one active candidate surface. If an unassigned draft was
         * already present, remove it when the teacher explicitly chooses an
         * assigned question to edit. This prevents a stale draft being appended
         * beneath the question being amended.
         */
        setDraftByPaper(
          (
            previous
          ) =>
            previous[
              original.paper
            ]
              ? {
                  ...previous,

                  [original.paper]:
                    null,
                }
              : previous
        );

        pendingJumpDraftRef.current = {
          paper:
            original.paper,

          draftId:
            original.id,
        };

        /*
         * Restoring the Skills Tree is useful, but it must never be allowed to
         * prevent entry into edit mode. The edit state above is authoritative.
         */
        try {
          restoreTreeForQuestion(
            original
          );
        } catch {
          // Keep the selected question editable even if tree restoration fails.
        }
      },
      [
        questions,
        setDraftByPaper,
        setEditDraftByPaper,
        editDraftRef,
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

      const nextEditState:
        AssessmentEditQuestionDraftByPaper = {
          ...editDraftRef.current,

          [viewPaper]:
            null,
        };

      editDraftRef.current =
        nextEditState;

      setEditDraftByPaper(
        nextEditState
      );
    }, [
      editDraftByPaper,
      viewPaper,

      setQuestions,
      setEditDraftByPaper,
      editDraftRef,

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

      const nextEditState:
        AssessmentEditQuestionDraftByPaper = {
          ...editDraftRef.current,

          [viewPaper]:
            null,
        };

      editDraftRef.current =
        nextEditState;

      setEditDraftByPaper(
        nextEditState
      );
    }, [
      editDraftByPaper,
      viewPaper,

      setQuestions,
      setEditDraftByPaper,
      editDraftRef,

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