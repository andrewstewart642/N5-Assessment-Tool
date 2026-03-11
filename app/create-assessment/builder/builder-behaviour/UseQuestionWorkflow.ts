import type {
  DifficultyLevel,
  Paper,
  Question,
  Skill,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";
import { useDraftWorkflow } from "./UseDraftWorkflow";
import { useQuestionDraftGeneration } from "./UseQuestionDraftGeneration";

type PendingJumpRef = React.MutableRefObject<{ paper: Paper; draftId: string } | null>;
type EditDraftRef = React.MutableRefObject<EditDraftByPaper>;

type UseQuestionWorkflowArgs = {
  standardFilter: StandardFilter;
  targetMarks: number;
  viewPaper: Paper;
  questions: Question[];
  draftByPaper: DraftByPaper;
  editDraftByPaper: EditDraftByPaper;
  editDraftRef: EditDraftRef;

  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setDraftByPaper: React.Dispatch<React.SetStateAction<DraftByPaper>>;
  setEditDraftByPaper: React.Dispatch<React.SetStateAction<EditDraftByPaper>>;
  setViewPaper: React.Dispatch<React.SetStateAction<Paper>>;

  pendingJumpDraftRef: PendingJumpRef;

  pushFlash: (message: string) => void;
  addQualityNote: (message: string) => void;
};

export function useQuestionWorkflow({
  standardFilter,
  targetMarks,
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
}: UseQuestionWorkflowArgs) {
  const {
    addQuestionToPaper,
    regenerateQuestionToPaper,
  } = useQuestionDraftGeneration({
    standardFilter,
    targetMarks,
    editDraftRef,
    setDraftByPaper,
    setEditDraftByPaper,
    setViewPaper,
    pendingJumpDraftRef,
    pushFlash,
    addQualityNote,
  });

  const {
    assignNewDraft,
    removeNewDraft,
    startEditLockedQuestion,
    saveEdit,
    removeWhileEditing,
  } = useDraftWorkflow({
    viewPaper,
    questions,
    draftByPaper,
    editDraftByPaper,
    setQuestions,
    setDraftByPaper,
    setEditDraftByPaper,
    pendingJumpDraftRef,
  });

  return {
    addQuestionToPaper,
    regenerateQuestionToPaper,
    assignNewDraft,
    removeNewDraft,
    startEditLockedQuestion,
    saveEdit,
    removeWhileEditing,
  };
}