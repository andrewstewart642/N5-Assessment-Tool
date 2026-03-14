// shared-types/QuestionGenerationTypes.ts

import type { PaperPart } from "@/shared-types/PaperParts";
import type {
  DifficultyLevel,
  Paper,
  Skill,
  Concept,
  SkillDomain,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes";
import type {
  QuestionSelectionFilters,
  QuestionVariantSelectionMeta,
} from "@/shared-types/QuestionSelectionTypes";

export type StandardClassification = "C" | "A" | "Mixed";

export type CalculatorStatus =
  | "NonCalculatorOnly"
  | "CalculatorOnly"
  | "Either";

export type StructureType =
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

export type ReasoningDiagnostic = "R1" | "R2" | "R1+R2";

export type QuestionMarks = {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  reasoningMarks: number;
};

export type QuestionClassification = {
  standard: StandardClassification;
  calculatorStatus: CalculatorStatus;
  structureType: StructureType;
  isReasoning: boolean;
  reasoningDiagnostic?: ReasoningDiagnostic;
  paperSuitability?: SkillPaperSuitability;
};

export type DifficultyProfile = {
  availableLevels: DifficultyLevel[];
  defaultLevel: DifficultyLevel;
  levelDescriptions?: Partial<Record<DifficultyLevel, string>>;
};

export type GeneratorCapabilities = {
  standardCoverage: StandardClassification[];
  canGenerateReasoning: boolean;
  calculatorStatus: CalculatorStatus;
  paperSuitability: SkillPaperSuitability;
  typicalStructureTypes: StructureType[];
};

/**
 * Optional per-level selection metadata.
 *
 * This lets a concept module declare, at a high level,
 * what each difficulty level is capable of contributing.
 *
 * Important:
 * This should only be used when the whole curated bank for that level
 * genuinely matches the metadata.
 *
 * If a level contains mixed behaviour internally, the safer long-term
 * solution is per-variant metadata instead.
 */
export type LevelSelectionProfile = Partial<
  Record<DifficultyLevel, QuestionVariantSelectionMeta[]>
>;

export type GeneratedQuestionData = {
  prompt?: string;
  answer?: string;
  marks?: number;
  questionCode?: string;
  promptParts?: PaperPart[];
  answerParts?: PaperPart[];

  markBreakdown?: QuestionMarks;
  classification?: QuestionClassification;

  sourceSkillCode?: string;
  sourceConceptCode?: string;
  sourceConceptLabel?: string;
  templateId?: string;

  /**
   * Optional selection metadata for the specific generated question.
   *
   * Useful for:
   * - debugging
   * - warning bubbles
   * - paper total accounting
   * - explaining mixed C/A mark contributions
   */
  selectionMeta?: QuestionVariantSelectionMeta;
};

export type GeneratorContext = {
  difficulty: DifficultyLevel;
  skill: Skill;
  concept?: Concept;
  selectedConceptText: string;
  paper?: Paper;

  /**
   * Optional builder selection filters.
   *
   * This is kept optional so existing generators continue to work
   * before they are upgraded to use the new filtering system.
   */
  selectionFilters?: QuestionSelectionFilters;
};

export type ConceptGeneratorModule = {
  metadata: {
    moduleId: string;
    domain: SkillDomain;
    skillCode: string;
    conceptCode: string;
    conceptLabel: string;
    tags?: string[];
    difficultyProfile: DifficultyProfile;
    capabilities: GeneratorCapabilities;

    /**
     * Optional level-aware selection profile.
     *
     * This can be used by the builder to decide:
     * - which levels are compatible with the current standard pill
     * - which levels are compatible with target marks
     * - which levels should be greyed out
     *
     * Each level can expose one or more variant metadata entries.
     * For tightly curated banks, these may correspond to real variants.
     * For older concepts, this can remain undefined until upgraded.
     */
    levelSelectionProfile?: LevelSelectionProfile;
  };

  canHandle: (conceptCode: string) => boolean;

  generate: (context: GeneratorContext) => GeneratedQuestionData;
};