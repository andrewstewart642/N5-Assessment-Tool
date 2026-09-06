// shared-types/QuestionGenerationTypes.ts

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import type {
  DifficultyLevel,
  Paper,
  Skill,
  Concept,
  SkillDomain,
  SkillPaperSuitability,
  QuestionTopicMarkBreakdown,
  HistoricalQuestionReference,
} from "@/app/Assessments/AssessmentTypes";
import type {
  WorkedAnswerSet,
} from "@/app/Assessments/Questions/Generation/AnswerGenerationTypes";
import type {
  QuestionSelectionFilters,
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

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

  workedAnswers?: WorkedAnswerSet;

  /** Builder-only historical source anchor for teacher confidence. */
  historicalReference?: HistoricalQuestionReference;

  markBreakdown?: QuestionMarks;
  classification?: QuestionClassification;

  sourceSkillCode?: string;
  sourceConceptCode?: string;
  sourceConceptLabel?: string;
  templateId?: string;

  /**
   * Optional cross-skill ownership exposed by a composite generator.
   * Draft generation deliberately spreads generated data after its empty
   * default so a canonical generator can declare a real supporting skill.
   */
  supportingSkillIds?: string[];

  /** Optional exact topic mark ownership for this generated question. */
  topicMarkBreakdown?: QuestionTopicMarkBreakdown;

  /** Optional selection metadata for the specific generated question. */
  selectionMeta?: QuestionVariantSelectionMeta;
};

export type GeneratorContext = {
  difficulty: DifficultyLevel;
  skill: Skill;
  concept?: Concept;
  selectedConceptText: string;
  paper?: Paper;

  /** Optional builder selection filters. */
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
    levelSelectionProfile?: LevelSelectionProfile;
  };

  canHandle: (conceptCode: string) => boolean;

  generate: (context: GeneratorContext) => GeneratedQuestionData;
};
