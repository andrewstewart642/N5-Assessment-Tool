import { useCallback } from "react";

import { getSpacingBasePx } from "@/app/paper-layout/N5-Question-Spacing-px";
import { makeId } from "@/math-helpers/QuestionLogic";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";

type PendingJumpRef = React.MutableRefObject<{ paper: Paper; draftId: string } | null>;

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

    const code = draft.questionCode;
    const spacingBasePx = code ? getSpacingBasePx(code) : 48;

    setQuestions((prev) => [
      ...prev,
      {
        ...draft,
        id: makeId(),
        createdAt: Date.now(),
        spacingBasePx,
      },
    ]);

    setDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
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
    setDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [viewPaper, setDraftByPaper, pendingJumpDraftRef]);

  const startEditLockedQuestion = useCallback(
    (lockedQuestionId: string) => {
      const idx = questions.findIndex((q) => q.id === lockedQuestionId);
      if (idx < 0) return;

      const original = questions[idx];

      restoreTreeForQuestion(original);

      pendingJumpDraftRef.current = {
        paper: original.paper,
        draftId: original.id,
      };

      setEditDraftByPaper((prev) => ({
        ...prev,
        [original.paper]: {
          questionIndex: idx,
          original,
          draft: { ...original },
        },
      }));
    },
    [questions, setEditDraftByPaper, restoreTreeForQuestion, pendingJumpDraftRef]
  );

  const saveEdit = useCallback(() => {
    const edit = editDraftByPaper[viewPaper];
    if (!edit) return;

    if (!isQuestionCommitEligible(edit.draft)) {
      onInvalidCommit();
      return;
    }

    const code = edit.draft.questionCode;
    const nextSpacingBasePx = code ? getSpacingBasePx(code) : 48;

    setQuestions((prev) => {
      if (edit.questionIndex < 0 || edit.questionIndex >= prev.length) return prev;

      const next = [...prev];
      next[edit.questionIndex] = {
        ...edit.draft,
        createdAt: Date.now(),
        spacingBasePx: nextSpacingBasePx,
      };
      return next;
    });

    setEditDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
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

    setQuestions((prev) => prev.filter((q) => q.id !== edit.original.id));
    setEditDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [editDraftByPaper, viewPaper, setQuestions, setEditDraftByPaper, pendingJumpDraftRef]);

  return {
    assignNewDraft,
    removeNewDraft,
    startEditLockedQuestion,
    saveEdit,
    removeWhileEditing,
  };
}