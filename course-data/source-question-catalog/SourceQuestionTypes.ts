import type {
  AssessmentTopicCode,
  CourseId,
  Paper,
  SkillPaperSuitability,
} from "@/shared-types/AssessmentTypes_TEMP";

export type SourceQuestionId = string;

export type SourceQuestionKind =
  | "SQA_PAST_PAPER"
  | "SQA_SPECIMEN"
  | "TEACHER_AUTHORED"
  | "SQA_STYLE";

export type SourceQuestionReviewStatus =
  | "DRAFT"
  | "CATALOGUED"
  | "REVIEWED"
  | "APPROVED"
  | "DEPRECATED";

export type SourceQuestionStandardProfile = "C" | "A" | "C+A";

export type SourceQuestionThinkingProfile =
  | "OPERATIONAL"
  | "REASONING"
  | "MIXED";

export type SourceQuestionCalculatorStatus =
  | "NON_CALCULATOR"
  | "CALCULATOR_ALLOWED"
  | "CALCULATOR_REQUIRED";

export type SourceQuestionOperationType =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "SIMPLIFY"
  | "EXPAND"
  | "FACTORISE"
  | "SOLVE"
  | "EVALUATE"
  | "INTERPRET"
  | "CONSTRUCT"
  | "PROVE"
  | "BRACKETED_SUM_AND_MULTIPLY"
  | "OTHER";

export type SourceQuestionSurfaceStyleTag =
  | "INLINE_EXPRESSION"
  | "DISPLAYED_EXPRESSION"
  | "SHORT_EVALUATE_STEM"
  | "EXPLICIT_SIMPLEST_FORM_INSTRUCTION"
  | "NO_EXPLICIT_SIMPLEST_FORM_INSTRUCTION"
  | "BRACKETED_EXPRESSION"
  | "NO_CONTEXT"
  | "CONTEXTUALISED"
  | "NUMERICAL_FLUENCY"
  | "EARLY_PAPER_FLUENCY"
  | "DIAGRAM_INCLUDED"
  | "GRAPH_GRID_INCLUDED"
  | "TABLE_INCLUDED"
  | "MULTI_PART"
  | "FORMULA_GIVEN"
  | "FORMULA_REQUIRED"
  | "WORD_PROBLEM"
  | "DIRECT_CALCULATION_COMMAND"
  | "PERCENTAGE_RELATIONSHIP"
  | "TEMPORAL_COMPARISON"
  | "PART_WHOLE_RELATIONSHIP"
  | "MONEY_CONTEXT"
  | "COUNT_CONTEXT"
  | "MEASUREMENT_CONTEXT"
  | "INTERLEAVED_SKILL";

export type SourceQuestionAnswerSpaceCategory =
  | "NONE"
  | "VERY_SMALL"
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "FULL_PAGE"
  | "GRAPH_GRID"
  | "DIAGRAM_RESPONSE";

export type SourceQuestionAnswerSpaceMeasurementMethod =
  | "PDF_RENDER"
  | "MANUAL_ESTIMATE"
  | "NOT_MEASURED";

export type SourceQuestionAnswerSpace = {
  category: SourceQuestionAnswerSpaceCategory;
  estimatedLines: number;
  measurementMethod: SourceQuestionAnswerSpaceMeasurementMethod;

  sourceMeasurement?: {
    renderDpi: number;
    pageWidthPx: number;
    pageHeightPx: number;

    topPx: number;
    bottomPx: number;
    heightPx: number;

    topPt?: number;
    bottomPt?: number;
    heightPt?: number;

    heightMm: number;
  };

  notes?: string;
};

export type SourceQuestionArithmeticComplexity =
  | "VERY_LOW"
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type SourceQuestionSimplificationVisibility =
  | "EXPLICIT_INSTRUCTION"
  | "IMPLIED_BY_STANDARD_FORM"
  | "NOT_EXPLICITLY_STATED";

export type SourceQuestionCancellationStyle =
  | "NONE"
  | "FINAL_SIMPLIFICATION_ONLY"
  | "CROSS_CANCELLATION_AVAILABLE"
  | "BRACKETED_SIMPLIFICATION_THEN_MULTIPLY"
  | "COMMON_DENOMINATOR_REQUIRED";

export type SourceQuestionFinalAnswerType =
  | "INTEGER"
  | "PROPER_FRACTION"
  | "IMPROPER_FRACTION"
  | "MIXED_NUMBER"
  | "SIMPLIFIED_EXPRESSION";

export type SourceQuestionValueSize = "SMALL" | "MEDIUM" | "LARGE";

export type SourceQuestionNumberProfile = {
  arithmeticComplexity: SourceQuestionArithmeticComplexity;

  requiresSimplification: boolean;
  simplificationVisibility: SourceQuestionSimplificationVisibility;

  cancellationStyle: SourceQuestionCancellationStyle;

  finalAnswerType: SourceQuestionFinalAnswerType;

  intermediateValueSize: SourceQuestionValueSize;
  finalValueSize: SourceQuestionValueSize;

  nonCalculatorFriendly: boolean;

  notes?: string;
};

export type SourceQuestionPercentageRelationshipType =
  | "INCREASE"
  | "DECREASE"
  | "PART_OF_WHOLE";

export type SourceQuestionPercentageExpressionStyle =
  | "INCREASED_BY"
  | "MORE_THAN"
  | "REDUCED_BY"
  | "DISCOUNT"
  | "PERCENT_OF"
  | "REPRESENTS_PERCENT_OF"
  | "SURCHARGE"
  | "OTHER";

export type SourceQuestionPercentageKnownValueRole =
  | "FINAL_VALUE"
  | "PART_VALUE";

export type SourceQuestionPercentageRequestedValueRole =
  | "ORIGINAL_VALUE"
  | "WHOLE_VALUE"
  | "CHANGE_AMOUNT";

export type SourceQuestionCalculatorBurden =
  | "MENTAL_FRIENDLY"
  | "WRITTEN_NON_CALCULATOR"
  | "CALCULATOR_NATURAL"
  | "CALCULATOR_STRONGLY_EXPECTED";

export type SourceQuestionValueFormat =
  | "INTEGER"
  | "DECIMAL"
  | "CURRENCY"
  | "SCIENTIFIC_NOTATION";

export type SourceQuestionPercentageProfile = {
  relationshipType: SourceQuestionPercentageRelationshipType;
  expressionStyle: SourceQuestionPercentageExpressionStyle;

  percentageValue: number;
  retainedPercentage: number;
  multiplier: number;

  knownValue: number;
  knownValueRole: SourceQuestionPercentageKnownValueRole;

  originalOrWholeValue: number;

  requestedValueRole: SourceQuestionPercentageRequestedValueRole;
  requestedAnswer: number;

  changeAmount?: number;

  workingStepCount: 1 | 2;

  arithmeticComplexity: SourceQuestionArithmeticComplexity;

  nonCalculatorFriendly: boolean;
  calculatorBurden: SourceQuestionCalculatorBurden;

  inverseCalculationProducesExactResult: boolean;

  knownValueFormat: SourceQuestionValueFormat;
  answerValueFormat: SourceQuestionValueFormat;

  valueMagnitude: SourceQuestionValueSize | "VERY_LARGE";

  notes?: string;
};

export type SourceQuestionWordedProblemProfile = {
  contextDomain: string;
  contextEntity: string;

  quantityType:
    | "MONEY"
    | "COUNT"
    | "MEASUREMENT";

  temporalStructure:
    | "NONE"
    | "BEFORE_AFTER"
    | "CURRENT_PREVIOUS"
    | "YEAR_ON_YEAR"
    | "PART_WHOLE_COMPARISON";

  sentenceCount: number;
  promptWordCount: number;

  introductionStyle: string;
  relationshipStatementStyle: string;
  commandStyle: string;

  informationOrder: string[];

  contextualVocabulary: string[];

  hasNamedPerson: boolean;
  usesPronounReference: boolean;
  visualContext: boolean;

  interleavedSkillIds: string[];

  generatorVariationNotes?: string;
};

export type SourceQuestionPart = {
  id: SourceQuestionId;
  label: string;
  marks: number;

  skillIds: string[];
  conceptIds: string[];

  topic: AssessmentTopicCode;
  standardProfile: SourceQuestionStandardProfile;
  thinkingProfile: SourceQuestionThinkingProfile;
};

export type SourceQuestionCatalogEntry = {
  id: SourceQuestionId;

  courseId: CourseId;
  sourceKind: SourceQuestionKind;

  year?: number;
  paper: Paper;
  questionNumber: string;

  totalMarks: number;

  familyId: string;
  surfaceStyleId: string;

  primaryTopic: AssessmentTopicCode;

  skillIds: string[];
  conceptIds: string[];

  paperSuitability: SkillPaperSuitability;
  calculatorStatus: SourceQuestionCalculatorStatus;

  standardProfile: SourceQuestionStandardProfile;
  thinkingProfile: SourceQuestionThinkingProfile;

  operationType?: SourceQuestionOperationType;
  operandStructure?: string;

  numberProfile?: SourceQuestionNumberProfile;

  percentageProfile?: SourceQuestionPercentageProfile;
  wordedProblemProfile?: SourceQuestionWordedProblemProfile;

  sourcePromptText?: string;
  sourcePromptStructure?: string[];

  surfaceStyleTags: SourceQuestionSurfaceStyleTag[];

  promptSummary: string;
  styleNotes?: string;
  privateNotes?: string;

  answerSpace: SourceQuestionAnswerSpace;

  parts?: SourceQuestionPart[];

  linkedGeneratorFamilyIds: string[];

  reviewStatus: SourceQuestionReviewStatus;
};
