import { N5_HISTORIC_QUESTION_REGISTRY } from "./N5HistoricQuestionRegistry";
import type {
  N5HistoricQuestionRecord,
  N5Paper,
} from "./N5HistoricQuestionTypes";

export type N5StandardFilter = "C" | "A" | "Mixed";
export type N5ThinkingFilter = "Operational" | "Reasoning" | "Mixed";

export type N5HistoricQuestionQueryOptions = {
  year?: number;
  paper?: N5Paper;
  primarySkillCode?: string;
  skillCode?: string;
  concept?: string;
  standard?: N5StandardFilter;
  thinking?: N5ThinkingFilter;
  minTotalMarks?: number;
  maxTotalMarks?: number;
};

function isCStandardQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.cMarks > 0 && question.aMarks === 0;
}

function isAStandardQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.aMarks > 0 && question.cMarks === 0;
}

function isMixedStandardQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.aMarks > 0 && question.cMarks > 0;
}

function isOperationalQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.operationalMarks > 0 && question.reasoningMarks === 0;
}

function isReasoningQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.reasoningMarks > 0 && question.operationalMarks === 0;
}

function isMixedThinkingQuestion(question: N5HistoricQuestionRecord): boolean {
  return question.reasoningMarks > 0 && question.operationalMarks > 0;
}

function matchesStandard(
  question: N5HistoricQuestionRecord,
  standard: N5StandardFilter,
): boolean {
  switch (standard) {
    case "C":
      return isCStandardQuestion(question);
    case "A":
      return isAStandardQuestion(question);
    case "Mixed":
      return isMixedStandardQuestion(question);
    default:
      return false;
  }
}

function matchesThinking(
  question: N5HistoricQuestionRecord,
  thinking: N5ThinkingFilter,
): boolean {
  switch (thinking) {
    case "Operational":
      return isOperationalQuestion(question);
    case "Reasoning":
      return isReasoningQuestion(question);
    case "Mixed":
      return isMixedThinkingQuestion(question);
    default:
      return false;
  }
}

export function getAllN5HistoricQuestions(): N5HistoricQuestionRecord[] {
  return [...N5_HISTORIC_QUESTION_REGISTRY];
}

export function getN5HistoricQuestionBySourceId(
  sourceId: string,
): N5HistoricQuestionRecord | undefined {
  return N5_HISTORIC_QUESTION_REGISTRY.find(
    (question: N5HistoricQuestionRecord) => question.sourceId === sourceId,
  );
}

export function getN5HistoricQuestionsByYear(
  year: number,
): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) => question.year === year,
  );
}

export function getN5HistoricQuestionsByPaper(
  paper: N5Paper,
): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) => question.paper === paper,
  );
}

export function getN5HistoricQuestionsByPrimarySkill(
  primarySkillCode: string,
): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) =>
      question.primarySkillCode === primarySkillCode,
  );
}

export function getN5HistoricQuestionsByAnySkill(
  skillCode: string,
): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) =>
      question.allSkillCodes.includes(skillCode),
  );
}

export function getN5HistoricQuestionsByConcept(
  concept: string,
): N5HistoricQuestionRecord[] {
  const normalisedConcept = concept.trim().toLowerCase();

  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) =>
      question.concept.trim().toLowerCase() === normalisedConcept,
  );
}

export function getN5CStandardHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isCStandardQuestion);
}

export function getN5AStandardHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isAStandardQuestion);
}

export function getN5MixedStandardHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isMixedStandardQuestion);
}

export function getN5OperationalHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isOperationalQuestion);
}

export function getN5ReasoningHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isReasoningQuestion);
}

export function getN5MixedThinkingHistoricQuestions(): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(isMixedThinkingQuestion);
}

export function queryN5HistoricQuestions(
  options: N5HistoricQuestionQueryOptions,
): N5HistoricQuestionRecord[] {
  return N5_HISTORIC_QUESTION_REGISTRY.filter(
    (question: N5HistoricQuestionRecord) => {
      if (options.year !== undefined && question.year !== options.year) {
        return false;
      }

      if (options.paper !== undefined && question.paper !== options.paper) {
        return false;
      }

      if (
        options.primarySkillCode !== undefined &&
        question.primarySkillCode !== options.primarySkillCode
      ) {
        return false;
      }

      if (
        options.skillCode !== undefined &&
        !question.allSkillCodes.includes(options.skillCode)
      ) {
        return false;
      }

      if (
        options.concept !== undefined &&
        question.concept.trim().toLowerCase() !==
          options.concept.trim().toLowerCase()
      ) {
        return false;
      }

      if (
        options.standard !== undefined &&
        !matchesStandard(question, options.standard)
      ) {
        return false;
      }

      if (
        options.thinking !== undefined &&
        !matchesThinking(question, options.thinking)
      ) {
        return false;
      }

      if (
        options.minTotalMarks !== undefined &&
        question.totalMarks < options.minTotalMarks
      ) {
        return false;
      }

      if (
        options.maxTotalMarks !== undefined &&
        question.totalMarks > options.maxTotalMarks
      ) {
        return false;
      }

      return true;
    },
  );
}