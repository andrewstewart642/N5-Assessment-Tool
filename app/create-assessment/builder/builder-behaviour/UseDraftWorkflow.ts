import { useCallback } from "react";

import { makeId } from "@/math-helpers/QuestionLogic_TEMP";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import { applyBuilderQuestionSpacingBase } from "../builder-logic/BuilderQuestionSpacing";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{
  paper: Paper;
  draftId: string;
} | null>;

type UseDraftWorkflowArgs = {
  viewPaper: Paper;
  questions: Question[];
  draftByPaper: DraftByPaper;
  editDraftByPaper: EditDraftByPaper;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setDraftByPaper: React.Dispatch<React.SetStateAction<DraftByPaper>>;
  setEditDraftByPaper: React.Dispatch<React.SetStateAction<EditDraftByPaper>>;
  pendingJumpDraftRef: PendingJumpRef;

  isQuestionCommitEligible: (question: Question) => boolean;
  onInvalidCommit: () => void;
  restoreTreeForQuestion: (question: Question) => void;
};

export function useDraftWorkflow({
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
}: UseDraftWorkflowArgs) {
  const assignNewDraft = useCallback(() => {
    const draft = draftByPaper[viewPaper];
    if (!draft) return;

    if (!isQuestionCommitEligible(draft)) {
      onInvalidCommit();
      return;
    }

    const committedQuestion = applyBuilderQuestionSpacingBase({
      ...draft,
      id: makeId(),
      createdAt: Date.now(),
    });

    setQuestions((prev) => [...prev, committedQuestion]);

    setDraftByPaper((prev) => ({
      ...prev,
      [viewPaper]: null,
    }));
  }, [
    draftByPaper,
    viewPaper,
    setQuestions,
    setDraftByPaper,
    isQuestionCommitEligible,
    onInvalidCommit,
  ]);

  const removeNewDraft = useCallback(() => {
    pendingJumpDraftRef.current = null;

    setDraftByPaper((prev) => ({
      ...prev,
      [viewPaper]: null,
    }));
  }, [viewPaper, setDraftByPaper, pendingJumpDraftRef]);

  const startEditLockedQuestion = useCallback(
    (lockedQuestionId: string) => {
      const questionIndex = questions.findIndex(
        (question) => question.id === lockedQuestionId
      );

      if (questionIndex < 0) return;

      const original = questions[questionIndex];

      restoreTreeForQuestion(original);

      pendingJumpDraftRef.current = {
        paper: original.paper,
        draftId: original.id,
      };

      setEditDraftByPaper((prev) => ({
        ...prev,
        [original.paper]: {
          questionIndex,
          original,
          draft: { ...original },
        },
      }));
    },
    [
      questions,
      setEditDraftByPaper,
      restoreTreeForQuestion,
      pendingJumpDraftRef,
    ]
  );

  const saveEdit = useCallback(() => {
    const edit = editDraftByPaper[viewPaper];
    if (!edit) return;

    if (!isQuestionCommitEligible(edit.draft)) {
      onInvalidCommit();
      return;
    }

    const committedQuestion = applyBuilderQuestionSpacingBase({
      ...edit.draft,
      createdAt: Date.now(),
    });

    setQuestions((prev) => {
      if (edit.questionIndex < 0 || edit.questionIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      next[edit.questionIndex] = committedQuestion;

      return next;
    });

    setEditDraftByPaper((prev) => ({
      ...prev,
      [viewPaper]: null,
    }));
  }, [
    editDraftByPaper,
    viewPaper,
    setQuestions,
    setEditDraftByPaper,
    isQuestionCommitEligible,
    onInvalidCommit,
  ]);

  const removeWhileEditing = useCallback(() => {
    pendingJumpDraftRef.current = null;

    const edit = editDraftByPaper[viewPaper];
    if (!edit) return;

    setQuestions((prev) =>
      prev.filter((question) => question.id !== edit.original.id)
    );

    setEditDraftByPaper((prev) => ({
      ...prev,
      [viewPaper]: null,
    }));
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