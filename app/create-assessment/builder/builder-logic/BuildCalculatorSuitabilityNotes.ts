import type { BuilderNote } from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";
import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type {
  Paper,
  Question,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes_TEMP";
import type { QuestionCalculatorStatus } from "@/shared-types/QuestionSelectionTypes";

type BuildCalculatorSuitabilityNotesArgs = {
  questions: Question[];
  includedPapers?: Paper[];
  courseConfig?: CourseAssessmentConfig;

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

function getPaperCalculatorPolicy(
  courseConfig: CourseAssessmentConfig,
  paper: Paper
): SkillPaperSuitability | null {
  return courseConfig.papers.find((item) => item.id === paper)?.calculatorPolicy ?? null;
}

function getPaperLabel(
  courseConfig: CourseAssessmentConfig,
  paper: Paper
): string {
  return courseConfig.papers.find((item) => item.id === paper)?.label ?? paper;
}

function isCalculatorViolation(args: {
  paperPolicy: SkillPaperSuitability | null;
  calculatorStatus: QuestionCalculatorStatus;
}): boolean {
  const { paperPolicy, calculatorStatus } = args;

  if (!paperPolicy || paperPolicy === "BOTH") {
    return false;
  }

  if (paperPolicy === "P1" && calculatorStatus === "CalculatorRequired") {
    return true;
  }

  if (paperPolicy === "P2" && calculatorStatus === "NonCalculatorOnly") {
    return true;
  }

  return false;
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

function buildViolationNote(args: {
  questionLabel: string;
  paperLabel: string;
  calculatorStatus: QuestionCalculatorStatus;
}): BuilderNote {
  const { questionLabel, paperLabel, calculatorStatus } = args;

  const statusText =
    calculatorStatus === "CalculatorRequired"
      ? "calculator-required"
      : calculatorStatus === "NonCalculatorOnly"
        ? "non-calculator only"
        : "calculator-restricted";

  return {
    id: `calculator-violation-${paperLabel
      .toLowerCase()
      .replace(/\s+/g, "-")}-${questionLabel.toLowerCase()}`,
    severity: "essential",
    source: "calculator-audit",
    rank: 95,
    message: `${questionLabel} is ${statusText} but has been placed in ${paperLabel}.`,
  };
}

function auditCalculatorSuitability(args: {
  questions: Question[];
  includedPapers: Paper[];
  courseConfig: CourseAssessmentConfig;
}): CalculatorAuditResult {
  const { questions, includedPapers, courseConfig } = args;

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

    const paperPolicy = getPaperCalculatorPolicy(courseConfig, paper);

    if (
      isCalculatorViolation({
        paperPolicy,
        calculatorStatus,
      })
    ) {
      violations.push(
        buildViolationNote({
          questionLabel,
          paperLabel: getPaperLabel(courseConfig, paper),
          calculatorStatus,
        })
      );
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
  courseConfig = ACTIVE_COURSE_CONFIG,
  includedPapers = courseConfig.papers.map((paper) => paper.id),
  includeBasisNote = true,
  includePassNote = true,
}: BuildCalculatorSuitabilityNotesArgs): BuilderNote[] {
  const audit = auditCalculatorSuitability({
    questions,
    includedPapers,
    courseConfig,
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