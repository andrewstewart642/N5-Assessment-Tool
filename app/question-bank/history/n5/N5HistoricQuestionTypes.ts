export type N5Paper = "P1" | "P2";

export type N5HistoricQuestionRecord = {
  sourceId: string;

  year: number;
  paper: N5Paper;

  questionNumber: number;
  part: string | null;

  displayLabel: string;

  primarySkillCode: string;
  supportingSkillCodes: string[];
  allSkillCodes: string[];

  concept: string;

  totalMarks: number;
  cMarks: number;
  aMarks: number;

  operationalMarks: number;
  reasoningMarks: number;
  totalThinkingMarks: number;

  estimatedHeightPx: number | null;
};

export type N5HistoricQuestionRegistry = N5HistoricQuestionRecord[];