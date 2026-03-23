// shared-types/AssessmentTypes.ts

import type { PaperPart } from "@/shared-types/PaperParts";
import type { QuestionVariantSelectionMeta } from "@/shared-types/QuestionSelectionTypes";

export type Paper = "P1" | "P2";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type StandardFilter = "C" | "A" | "C+A";

export type ThinkingTypeFilter = "OPERATIONAL" | "REASONING" | "ANY";

export type CourseId = "N5_MATH";

export type Theme = {
  pageBg: string;
  panelBg: string;
  panelBg2: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textDim: string;
  headerBg: string;
  rowHover: string;
  controlBg: string;
  accent: string;
  accentStrong: string;
  ctaBlueText: string;
};

export type SkillPaperSuitability = "P1" | "P2" | "BOTH";

export type SkillDomain = "NUM" | "ALG" | "GEO" | "TRIG" | "STAT";

export type AssessmentTopicCode = SkillDomain;

export type QuestionTopicMarkBreakdown = Record<AssessmentTopicCode, number>;

export type ConceptInteractionType = "core" | "modifier" | "either";

export type QuestionSkillRole = "primary" | "supporting" | "output";

export type QuestionSkillLink = {
  skillId: string;
  conceptId?: string;
  role: QuestionSkillRole;
};

export type ConceptMetadata = {
  standardTier: "C" | "A" | "C+A";
  thinkingType: "operational" | "reasoning" | "mixed";
  paperSuitability: SkillPaperSuitability;
  calculator: "none" | "optional" | "required";
  interactionType: ConceptInteractionType;
  stepCount: "single" | "multi";
  topicTags: string[];
  canBePrimary?: boolean;
  canBeSupporting?: boolean;
  canBeOutputSkill?: boolean;

  availableDifficultyLevels?: DifficultyLevel[];
  defaultDifficultyLevel?: DifficultyLevel;
};

export type Concept = {
  id: string;
  code: string;
  label: string;
  shortLabel?: string;
  badge?: string;
  fullDescription?: string;
  teacherNote?: string;
  standard: StandardFilter;
  marks?: number;
  promptStyleId?: string;
  metadata?: ConceptMetadata;
};

export type Skill = {
  id: string;
  code: string;
  text: string;
  domain?: SkillDomain;
  concepts: Concept[];
  paperSuitability: SkillPaperSuitability;
  tags?: string[];
};

export type SkillsData = Record<string, Skill[]>;

export type Question = {
  id: string;
  category: string;

  courseId?: CourseId;

  skillId: string;
  skillCode: string;
  skillText: string;
  skillDomain?: SkillDomain;

  primarySkillId?: string;
  primaryConceptId?: string;
  supportingSkillIds?: string[];
  skillLinks?: QuestionSkillLink[];

  standardFilter: StandardFilter;
  concept: string;
  conceptId?: string;
  difficulty: DifficultyLevel;
  targetMarks: number;
  paper: Paper;
  createdAt: number;

  prompt?: string;
  answer?: string;
  marks?: number;

  promptParts?: PaperPart[];
  answerParts?: PaperPart[];

  questionCode?: string;

  cMarks?: number;
  aMarks?: number;
  reasoningMarks?: number;
  isReasoning?: boolean;

  calculatorStatus?: "NonCalculatorOnly" | "CalculatorOnly" | "Either";

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

  spacingBasePx?: number;
  measuredHeightBasePx?: number;

  /**
   * Exact generated-variant metadata, when provided by the concept module.
   */
  selectionMeta?: QuestionVariantSelectionMeta;

  /**
   * Topic mark ownership for whole-assessment monitoring.
   * The sum should normally equal the question total marks.
   *
   * Example:
   * - Composite volume rounded to 2 sf:
   *   GEO: 4, NUM: 1
   */
  topicMarkBreakdown?: QuestionTopicMarkBreakdown;
};