import type {
  Paper,
  Question,
} from "@/src/Assessments/AssessmentTypes";

export type AssessmentQuestionDraftByPaper =
  Record<
    Paper,
    Question | null
  >;

export type AssessmentEditQuestionDraft =
  | null
  | {
      questionIndex: number;

      original: Question;

      draft: Question;
    };

export type AssessmentEditQuestionDraftByPaper =
  Record<
    Paper,
    AssessmentEditQuestionDraft
  >;