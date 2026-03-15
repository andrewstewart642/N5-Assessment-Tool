import type {
  Paper,
  Question,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";
import type { DraftByPaper, EditDraftByPaper } from "../BuilderUtils";
import { useDraftWorkflow } from "./UseDraftWorkflow";
import { useQuestionDraftGeneration } from "./UseQuestionDraftGeneration";
import type {
  QuestionCalculatorStatus,
  QuestionSelectionFilters,
  QuestionVariantSelectionMeta,
} from "@/shared-types/QuestionSelectionTypes";
import { isVariantEligibleForFilters } from "@/shared-types/QuestionSelectionTypes";

type PendingJumpRef = React.MutableRefObject<{ paper: Paper; draftId: string } | null>;
type EditDraftRef = React.MutableRefObject<EditDraftByPaper>;

type UseQuestionWorkflowArgs = {
  standardFilter: StandardFilter;
  targetMarks: number;
  activePaper: Paper;
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

  restoreTreeForQuestion: (question: Question) => void;
};

const INVALID_COMMIT_MESSAGE =
  "This question is outside your current tree filters. Adjust the filters to assign it to the paper.";

function mapCalculatorStatus(question: Question): QuestionCalculatorStatus {
  if (question.calculatorStatus === "NonCalculatorOnly") return "NonCalculatorOnly";
  if (question.calculatorStatus === "CalculatorOnly") return "CalculatorRequired";
  return "CalculatorAllowed";
}

function buildFallbackSelectionMeta(question: Question): QuestionVariantSelectionMeta {
  const totalMarks =
    typeof question.marks === "number" && Number.isFinite(question.marks)
      ? question.marks
      : question.targetMarks;

  let cMarks = typeof question.cMarks === "number" ? question.cMarks : 0;
  let aMarks = typeof question.aMarks === "number" ? question.aMarks : 0;

  if (cMarks === 0 && aMarks === 0) {
    if (question.standardFilter === "C") cMarks = totalMarks;
    else if (question.standardFilter === "A") aMarks = totalMarks;
    else cMarks = totalMarks;
  }

  return {
    level: question.difficulty,
    templateId: question.questionCode ?? question.id,
    marks: {
      totalMarks,
      cMarks,
      aMarks,
      reasoningMarks: typeof question.reasoningMarks === "number" ? question.reasoningMarks : 0,
    },
    standardProfile: cMarks > 0 && aMarks > 0 ? "C+A" : aMarks > 0 ? "A" : "C",
    paperSuitability: question.paper,
    calculatorStatus: mapCalculatorStatus(question),
  };
}

function getSelectionMetaForQuestion(question: Question): QuestionVariantSelectionMeta {
  return question.selectionMeta ?? buildFallbackSelectionMeta(question);
}

function isQuestionEligibleForFilters(
  question: Question,
  filters: QuestionSelectionFilters
): boolean {
  return isVariantEligibleForFilters(getSelectionMetaForQuestion(question), filters);
}

export function useQuestionWorkflow({
  standardFilter,
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
}: UseQuestionWorkflowArgs) {
  const currentFilters: QuestionSelectionFilters = {
    selectedStandard: standardFilter,
    targetMarks,
    targetPaper: activePaper,
  };

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

  const newDraftForView = draftByPaper[viewPaper];
  const editForView = editDraftByPaper[viewPaper];

  const canAssignNewDraft = !!newDraftForView &&
    isQuestionEligibleForFilters(newDraftForView, currentFilters);

  const canSaveEdit = !!editForView &&
    isQuestionEligibleForFilters(editForView.draft, currentFilters);

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
    isQuestionCommitEligible: (question) =>
      isQuestionEligibleForFilters(question, currentFilters),
    onInvalidCommit: () => pushFlash(INVALID_COMMIT_MESSAGE),
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
    invalidCommitMessage: INVALID_COMMIT_MESSAGE,
  };
}