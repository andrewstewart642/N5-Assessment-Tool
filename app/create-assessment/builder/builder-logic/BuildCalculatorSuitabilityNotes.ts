import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import type { QuestionCalculatorStatus } from "@/shared-types/QuestionSelectionTypes";

type BuildCalculatorSuitabilityNotesArgs = {
  questions: Question[];
  includedPapers?: Paper[];

  includeBasisNote?: boolean;
  includePassNote?: boolean;
};

type CalculatorAuditResult = {
  auditedQuestions: number;
  unknownStatusQuestions: number;
  violations: BuilderNote[];
};

function isValidCalculatorStatus(
  value: unknown
): value is QuestionCalculatorStatus {
  return (
    value === "NonCalculatorOnly" ||
    value === "CalculatorAllowed" ||
    value === "CalculatorRequired"
  );
}

function getQuestionNumberLabel(question: Question, fallbackIndex: number): string {
  const candidate = (question as Question & { number?: unknown }).number;

  if (typeof candidate === "number" && Number.isFinite(candidate)) {
    return `Q${candidate}`;
  }

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim().startsWith("Q")
      ? candidate.trim()
      : `Q${candidate.trim()}`;
  }

  return `Q${fallbackIndex + 1}`;
}

function getQuestionPaper(question: Question): Paper | null {
  return question.paper === "P1" || question.paper === "P2" ? question.paper : null;
}

function getDirectCalculatorStatus(
  question: Question
): QuestionCalculatorStatus | null {
  const directValue = (question as Question & { calculatorStatus?: unknown })
    .calculatorStatus;

  if (isValidCalculatorStatus(directValue)) {
    return directValue;
  }

  return null;
}

function getNestedCalculatorStatus(
  question: Question
): QuestionCalculatorStatus | null {
  const nestedCandidates: unknown[] = [
    (question as Question & { variantMeta?: { calculatorStatus?: unknown } })
      .variantMeta?.calculatorStatus,
    (question as Question & { selectionMeta?: { calculatorStatus?: unknown } })
      .selectionMeta?.calculatorStatus,
    (question as Question & { generatorMeta?: { calculatorStatus?: unknown } })
      .generatorMeta?.calculatorStatus,
    (
      question as Question & {
        metadata?: { calculatorStatus?: unknown };
      }
    ).metadata?.calculatorStatus,
  ];

  for (const candidate of nestedCandidates) {
    if (isValidCalculatorStatus(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getBooleanDerivedCalculatorStatus(
  question: Question
): QuestionCalculatorStatus | null {
  const q = question as Question & {
    requiresCalculator?: unknown;
    isCalculatorRequired?: unknown;
    nonCalculatorOnly?: unknown;
    isNonCalculatorOnly?: unknown;
  };

  if (q.requiresCalculator === true || q.isCalculatorRequired === true) {
    return "CalculatorRequired";
  }

  if (q.nonCalculatorOnly === true || q.isNonCalculatorOnly === true) {
    return "NonCalculatorOnly";
  }

  return null;
}

function getQuestionCalculatorStatus(
  question: Question
): QuestionCalculatorStatus | null {
  return (
    getDirectCalculatorStatus(question) ??
    getNestedCalculatorStatus(question) ??
    getBooleanDerivedCalculatorStatus(question)
  );
}

function buildBasisNote(audit: CalculatorAuditResult): BuilderNote {
  return {
    id: "calculator-audit-basis",
    severity: "suggestion",
    source: "calculator-audit",
    rank: 1,
    message: `Calculator audit checked ${audit.auditedQuestions} assigned question${
      audit.auditedQuestions === 1 ? "" : "s"
    }. ${audit.unknownStatusQuestions} had no explicit calculator metadata.`,
  };
}

function buildPassNote(audit: CalculatorAuditResult): BuilderNote {
  return {
    id: "calculator-audit-pass",
    severity: "suggestion",
    source: "calculator-audit",
    rank: 5,
    message:
      audit.unknownStatusQuestions > 0
        ? "No calculator-rule violations were detected in the audited questions, though some questions had no explicit calculator metadata."
        : "No calculator-rule violations were detected in the audited questions.",
  };
}

function buildP1ViolationNote(questionLabel: string): BuilderNote {
  return {
    id: `calculator-violation-p1-${questionLabel.toLowerCase()}`,
    severity: "essential",
    source: "calculator-audit",
    rank: 95,
    message: `${questionLabel} is calculator-required but has been placed in Paper 1.`,
  };
}

function buildP2ViolationNote(questionLabel: string): BuilderNote {
  return {
    id: `calculator-violation-p2-${questionLabel.toLowerCase()}`,
    severity: "essential",
    source: "calculator-audit",
    rank: 95,
    message: `${questionLabel} is non-calculator only but has been placed in Paper 2.`,
  };
}

function auditCalculatorSuitability(args: {
  questions: Question[];
  includedPapers: Paper[];
}): CalculatorAuditResult {
  const { questions, includedPapers } = args;

  let auditedQuestions = 0;
  let unknownStatusQuestions = 0;
  const violations: BuilderNote[] = [];

  questions.forEach((question, index) => {
    const paper = getQuestionPaper(question);

    if (!paper || !includedPapers.includes(paper)) return;

    auditedQuestions += 1;

    const calculatorStatus = getQuestionCalculatorStatus(question);
    const questionLabel = getQuestionNumberLabel(question, index);

    if (!calculatorStatus) {
      unknownStatusQuestions += 1;
      return;
    }

    if (paper === "P1" && calculatorStatus === "CalculatorRequired") {
      violations.push(buildP1ViolationNote(questionLabel));
      return;
    }

    if (paper === "P2" && calculatorStatus === "NonCalculatorOnly") {
      violations.push(buildP2ViolationNote(questionLabel));
    }
  });

  return {
    auditedQuestions,
    unknownStatusQuestions,
    violations,
  };
}

export function buildCalculatorSuitabilityNotes({
  questions,
  includedPapers = ["P1", "P2"],
  includeBasisNote = true,
  includePassNote = true,
}: BuildCalculatorSuitabilityNotesArgs): BuilderNote[] {
  const audit = auditCalculatorSuitability({
    questions,
    includedPapers,
  });

  const notes: BuilderNote[] = [];

  if (includeBasisNote) {
    notes.push(buildBasisNote(audit));
  }

  if (audit.violations.length > 0) {
    notes.push(...audit.violations);
    return notes;
  }

  if (includePassNote && audit.auditedQuestions > 0) {
    notes.push(buildPassNote(audit));
  }

  return notes;
}