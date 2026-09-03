import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import {
  toHistoricalQuestionCatalogView,
  type HistoricalQuestionCatalogView,
} from "../01_QuestionCatalog/QuestionCatalogHistoricalView";
import type { AnswerCatalogEntry } from "../02_AnswerCatalog/AnswerCatalogTypes";
import {
  toHistoricalAnswerCatalogView,
  type HistoricalAnswerCatalogView,
} from "../02_AnswerCatalog/AnswerCatalogHistoricalView";

export type SkillHistoricalSourcePair = {
  question: QuestionCatalogEntry;
  answer: AnswerCatalogEntry;
};

export type SkillHistoricalEvidencePair = {
  question: HistoricalQuestionCatalogView;
  answer: HistoricalAnswerCatalogView;
};

export type SkillHistoricalEvidenceSet = {
  skillId: string;
  entries: readonly SkillHistoricalEvidencePair[];
};

const questionMentionsSkill = (
  question: HistoricalQuestionCatalogView,
  skillId: string,
) =>
  question.curriculum.primarySkillId === skillId ||
  question.curriculum.secondarySkillIds.includes(skillId) ||
  question.structure.parts.some(
    (part) =>
      part.primarySkillId === skillId ||
      part.secondarySkillIds.includes(skillId),
  );

const answerMentionsSkill = (
  answer: HistoricalAnswerCatalogView,
  skillId: string,
) => answer.markNodes.some((mark) => mark.skillIds.includes(skillId));

/**
 * Creates the canonical evidence set used by one SkillCatalog slice.
 *
 * The raw imports remain the authoritative question-by-question historical
 * records. SkillCatalog receives restricted historical views and validates the
 * Question ↔ Answer relationship before any cross-corpus synthesis runs.
 */
export const createSkillHistoricalEvidenceSet = (
  skillId: string,
  sourcePairs: readonly SkillHistoricalSourcePair[],
): SkillHistoricalEvidenceSet => {
  const entries = sourcePairs.map(({ question, answer }) => {
    const historicalQuestion = toHistoricalQuestionCatalogView(question);
    const historicalAnswer = toHistoricalAnswerCatalogView(answer);

    if (historicalAnswer.identity.sourceQuestionId !== historicalQuestion.identity.id) {
      throw new Error(
        `${skillId}: ${historicalAnswer.identity.id} points to ${historicalAnswer.identity.sourceQuestionId}, not ${historicalQuestion.identity.id}.`,
      );
    }

    if (historicalQuestion.identity.answerCatalogId !== historicalAnswer.identity.id) {
      throw new Error(
        `${skillId}: ${historicalQuestion.identity.id} points to ${historicalQuestion.identity.answerCatalogId}, not ${historicalAnswer.identity.id}.`,
      );
    }

    if (historicalQuestion.structure.totalMarks !== historicalAnswer.sourceContext.totalMarks) {
      throw new Error(
        `${skillId}: mark tariff mismatch for ${historicalQuestion.identity.id}.`,
      );
    }

    if (
      !questionMentionsSkill(historicalQuestion, skillId) &&
      !answerMentionsSkill(historicalAnswer, skillId)
    ) {
      throw new Error(
        `${skillId}: ${historicalQuestion.identity.id} does not reference the Skill at question or mark level.`,
      );
    }

    return {
      question: historicalQuestion,
      answer: historicalAnswer,
    };
  });

  const questionIds = new Set<string>();
  const answerIds = new Set<string>();
  for (const entry of entries) {
    if (questionIds.has(entry.question.identity.id)) {
      throw new Error(`${skillId}: duplicate question evidence ${entry.question.identity.id}.`);
    }
    if (answerIds.has(entry.answer.identity.id)) {
      throw new Error(`${skillId}: duplicate answer evidence ${entry.answer.identity.id}.`);
    }
    questionIds.add(entry.question.identity.id);
    answerIds.add(entry.answer.identity.id);
  }

  return { skillId, entries };
};

export const findSkillEvidenceByAnswerId = (
  evidence: SkillHistoricalEvidenceSet,
  answerCatalogId: string,
): SkillHistoricalEvidencePair => {
  const match = evidence.entries.find(
    (entry) => entry.answer.identity.id === answerCatalogId,
  );
  if (!match) {
    throw new Error(
      `${evidence.skillId}: no historical evidence pair for ${answerCatalogId}.`,
    );
  }
  return match;
};

export const validateSkillCorpusSummaryCoverage = (
  evidence: SkillHistoricalEvidenceSet,
  summarisedAnswerIds: readonly string[],
): void => {
  const expected = new Set(evidence.entries.map((entry) => entry.answer.identity.id));
  const actual = new Set(summarisedAnswerIds);

  const missing = [...expected].filter((id) => !actual.has(id));
  const unexpected = [...actual].filter((id) => !expected.has(id));

  if (missing.length || unexpected.length) {
    throw new Error(
      `${evidence.skillId}: SkillCatalog corpus summary does not match historical evidence. ` +
        `Missing: ${missing.join(", ") || "none"}. Unexpected: ${unexpected.join(", ") || "none"}.`,
    );
  }
};
