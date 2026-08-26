import type {
  CourseId,
} from "@/src/Courses/CourseTypes";

import type {
  PaperPart,
} from "@/src/Assessments/Questions/Content/PaperParts";

import type {
  QuestionVariantSelectionMeta,
} from "@/src/Assessments/Questions/Selection/QuestionSelectionTypes";

import type {
  WorkedAnswerSet,
} from "@/src/Assessments/Questions/Generation/AnswerGenerationTypes";

/**
 * Transitional re-export.
 *
 * CourseId is now owned by Courses. Existing AssessmentTypes consumers
 * can continue importing it from here until their imports are migrated
 * directly to CourseTypes.
 */
export type {
  CourseId,
} from "@/src/Courses/CourseTypes";

/**
 * Generic paper/component identifier.
 *
 * Current N5/Higher-style courses still use "P1" and "P2", but the builder
 * should not be structurally limited to those two literal IDs.
 */
export type Paper =
  string;

export type DifficultyLevel =
  1 | 2 | 3 | 4 | 5;

export type StandardFilter =
  "C" | "A" | "C+A";

export type ThinkingTypeFilter =
  "OPERATIONAL" | "REASONING" | "ANY";

/**
 * Where a skill/concept/question can appear.
 *
 * "BOTH" is retained as the legacy/all-papers marker.
 * Any other value should match a configured course paper id.
 */
export type SkillPaperSuitability =
  "BOTH" | Paper;

export type SkillDomain =
  | "NUM"
  | "ALG"
  | "GEO"
  | "TRIG"
  | "STAT";

export type AssessmentTopicCode =
  SkillDomain;

export type QuestionTopicMarkBreakdown =
  Record<
    AssessmentTopicCode,
    number
  >;

export type ConceptInteractionType =
  | "core"
  | "modifier"
  | "either";

export type QuestionSkillRole =
  | "primary"
  | "supporting"
  | "output";

export type QuestionSkillLink = {
  skillId:
    string;

  conceptId?:
    string;

  role:
    QuestionSkillRole;
};

export type ConceptMetadata = {
  standardTier:
    "C" | "A" | "C+A";

  thinkingType:
    | "operational"
    | "reasoning"
    | "mixed";

  paperSuitability:
    SkillPaperSuitability;

  calculator:
    | "none"
    | "optional"
    | "required";

  interactionType:
    ConceptInteractionType;

  stepCount:
    "single" | "multi";

  topicTags:
    string[];

  canBePrimary?:
    boolean;

  canBeSupporting?:
    boolean;

  canBeOutputSkill?:
    boolean;

  availableDifficultyLevels?:
    DifficultyLevel[];

  defaultDifficultyLevel?:
    DifficultyLevel;
};

export type Concept = {
  id:
    string;

  code:
    string;

  label:
    string;

  shortLabel?:
    string;

  badge?:
    string;

  fullDescription?:
    string;

  teacherNote?:
    string;

  standard:
    StandardFilter;

  marks?:
    number;

  promptStyleId?:
    string;

  metadata?:
    ConceptMetadata;
};

export type Skill = {
  id:
    string;

  code:
    string;

  text:
    string;

  domain?:
    SkillDomain;

  concepts:
    Concept[];

  paperSuitability:
    SkillPaperSuitability;

  tags?:
    string[];
};

export type SkillsData =
  Record<
    string,
    Skill[]
  >;

export type Question = {
  id:
    string;

  category:
    string;

  courseId?:
    CourseId;

  skillId:
    string;

  skillCode:
    string;

  skillText:
    string;

  skillDomain?:
    SkillDomain;

  primarySkillId?:
    string;

  primaryConceptId?:
    string;

  supportingSkillIds?:
    string[];

  skillLinks?:
    QuestionSkillLink[];

  standardFilter:
    StandardFilter;

  concept:
    string;

  conceptId?:
    string;

  difficulty:
    DifficultyLevel;

  targetMarks:
    number;

  paper:
    Paper;

  createdAt:
    number;

  prompt?:
    string;

  answer?:
    string;

  marks?:
    number;

  promptParts?:
    PaperPart[];

  answerParts?:
    PaperPart[];

  /**
   * Generated pupil-style worked solutions.
   */
  workedAnswers?:
    WorkedAnswerSet;

  /**
   * Teacher-selected primary method.
   *
   * Stored separately from the mathematical
   * question itself so regeneration can retain it
   * where that method remains valid.
   */
  preferredAnswerMethodFamilyId?:
    string;

  questionCode?:
    string;

  cMarks?:
    number;

  aMarks?:
    number;

  reasoningMarks?:
    number;

  isReasoning?:
    boolean;

  calculatorStatus?:
    | "NonCalculatorOnly"
    | "CalculatorOnly"
    | "Either";

  structureType?:
    | "SingleStep"
    | "MultiStep"
    | "ExpressionSimplification"
    | "EquationSolving"
    | "GraphInterpretation"
    | "ContextualProblem"
    | "GeometricConstruction"
    | "DataAnalysis"
    | "CompoundSkills"
    | "Other";

  spacingBasePx?:
    number;

  measuredHeightBasePx?:
    number;

  /**
   * Exact generated-variant metadata, when provided by the concept module.
   */
  selectionMeta?:
    QuestionVariantSelectionMeta;

  /**
   * Topic mark ownership for whole-assessment monitoring.
   * The sum should normally equal the question total marks.
   *
   * Example:
   * - Composite volume rounded to 2 sf:
   *   GEO: 4, NUM: 1
   */
  topicMarkBreakdown?:
    QuestionTopicMarkBreakdown;
};