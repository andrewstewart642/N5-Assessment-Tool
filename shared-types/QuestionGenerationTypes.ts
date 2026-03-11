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
};

export type GeneratorContext = {
  difficulty: DifficultyLevel;
  skill: Skill;
  concept?: Concept;
  selectedConceptText: string;
  paper?: Paper;
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
  };

  canHandle: (conceptCode: string) => boolean;

  generate: (context: GeneratorContext) => GeneratedQuestionData;
};