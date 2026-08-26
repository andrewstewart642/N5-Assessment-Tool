import type {
  Question,
} from "@/src/Assessments/AssessmentTypes";

export type AssessmentPreviewPage =
  | {
      kind: "cover";
      pageNumber: number;
    }
  | {
      kind: "formula";
      pageNumber: number;
    }
  | {
      kind: "questions";
      pageNumber: number;
      questionPageIndex: number;
      questionStartIndex: number;
      pageQuestions: Question[];
    }
  | {
      kind: "empty";
      pageNumber: number;
    };

export type AssessmentPreviewRenderEntry = {
  kind:
    | "locked"
    | "edit"
    | "draft";

  q: Question;
};

export type AssessmentPreviewRenderById =
  Map<
    string,
    AssessmentPreviewRenderEntry
  >;