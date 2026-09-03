import type { HistoricalQuestionCatalogView } from "../01_QuestionCatalog/QuestionCatalogHistoricalView";
import type { HistoricalAnswerCatalogView } from "../02_AnswerCatalog/AnswerCatalogHistoricalView";

/**
 * SkillCatalog is deliberately forbidden from accepting the transitional full
 * QuestionCatalogEntry / AnswerCatalogEntry contracts. Projection into these
 * historical-only views happens at the 01/02 -> 03 boundary.
 */
export type SkillHistoricalEvidencePair = {
  question: HistoricalQuestionCatalogView;
  answer: HistoricalAnswerCatalogView;
};

export type SkillHistoricalEvidenceSet = {
  skillId: string;
  entries: readonly SkillHistoricalEvidencePair[];
};

const QUESTION_FORBIDDEN_KEYS = [
  "generation",
  "parameterDesign",
  "sourceIsolation",
] as const;

const ANSWER_FORBIDDEN_KEYS = [
  "consistency",
  "generation",
  "integrity",
] as const;

const assertNoOwnKey = (
  value: object,
  key: string,
  label: string,
): void => {
  if (Object.prototype.hasOwnProperty.call(value, key)) {
    throw new Error(`${label}: forbidden downstream field '${key}' crossed the historical catalogue boundary.`);
  }
};

const assertHistoricalQuestionBoundary = (
  question: HistoricalQuestionCatalogView,
): void => {
  for (const key of QUESTION_FORBIDDEN_KEYS) {
    assertNoOwnKey(question, key, question.identity.id);
  }

  if (question.visuals.state === "VALUE") {
    for (const element of question.visuals.value.elements) {
      assertNoOwnKey(element, "generation", `${question.identity.id}/${element.id}`);
      assertNoOwnKey(element, "originality", `${question.identity.id}/${element.id}`);
      assertNoOwnKey(element, "validation", `${question.identity.id}/${element.id}`);
    }
  }
};

const assertHistoricalAnswerBoundary = (
  answer: HistoricalAnswerCatalogView,
): void => {
  for (const key of ANSWER_FORBIDDEN_KEYS) {
    assertNoOwnKey(answer, key, answer.identity.id);
  }
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
 * Callers must pass already-projected historical records. This is intentional:
 * 03_SkillCatalog never receives generator analysis, renderer policy or
 * cross-corpus judgements from the transitional source-catalog contracts.
 */
export const createSkillHistoricalEvidenceSet = (
  skillId: string,
  sourcePairs: readonly SkillHistoricalEvidencePair[],
): SkillHistoricalEvidenceSet => {
  const entries = sourcePairs.map(({ question, answer }) => {
    assertHistoricalQuestionBoundary(question);
    assertHistoricalAnswerBoundary(answer);

    if (answer.identity.sourceQuestionId !== question.identity.id) {
      throw new Error(
        `${skillId}: ${answer.identity.id} points to ${answer.identity.sourceQuestionId}, not ${question.identity.id}.`,
      );
    }

    if (question.identity.answerCatalogId !== answer.identity.id) {
      throw new Error(
        `${skillId}: ${question.identity.id} points to ${question.identity.answerCatalogId}, not ${answer.identity.id}.`,
      );
    }

    if (question.structure.totalMarks !== answer.sourceContext.totalMarks) {
      throw new Error(
        `${skillId}: mark tariff mismatch for ${question.identity.id}.`,
      );
    }

    if (
      !questionMentionsSkill(question, skillId) &&
      !answerMentionsSkill(answer, skillId)
    ) {
      throw new Error(
        `${skillId}: ${question.identity.id} does not reference the Skill at question or mark level.`,
      );
    }

    return { question, answer };
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
