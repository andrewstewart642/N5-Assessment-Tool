import type {
  AssessmentTopicCode,
  CourseId,
  Paper,
  SkillPaperSuitability,
} from "@/src/Assessments/AssessmentTypes";


export type ExamQuestionId =
  string;


export type ExamQuestionKind =
  | "SQA_PAST_PAPER"
  | "SQA_SPECIMEN"
  | "TEACHER_AUTHORED"
  | "SQA_STYLE";


export type ExamQuestionReviewStatus =
  | "DRAFT"
  | "CATALOGUED"
  | "REVIEWED"
  | "APPROVED"
  | "DEPRECATED";


export type ExamQuestionStandardProfile =
  | "C"
  | "A"
  | "C+A";


export type ExamQuestionThinkingProfile =
  | "OPERATIONAL"
  | "REASONING"
  | "MIXED";


export type ExamQuestionCalculatorStatus =
  | "NON_CALCULATOR"
  | "CALCULATOR_ALLOWED"
  | "CALCULATOR_REQUIRED";


export type ExamQuestionOperationType =
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


export type ExamQuestionSurfaceStyleTag =
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


export type ExamQuestionAnswerSpaceCategory =
  | "NONE"
  | "VERY_SMALL"
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "FULL_PAGE"
  | "GRAPH_GRID"
  | "DIAGRAM_RESPONSE";


export type ExamQuestionAnswerSpaceMeasurementMethod =
  | "PDF_RENDER"
  | "MANUAL_ESTIMATE"
  | "NOT_MEASURED";


export type ExamQuestionPdfRenderMeasurement = {
  /**
   * 1-based page number in the source PDF file.
   *
   * This is the physical PDF page index, not the
   * printed page label shown inside the examination
   * document.
   */
  pdfPageNumber?:
    number;


  /**
   * Rendering standard used when the pixel
   * measurements were taken.
   */
  renderDpi:
    number;

  pageWidthPx:
    number;

  pageHeightPx:
    number;


  /**
   * Vertical coordinates use a TOP-LEFT origin.
   *
   * topPx:
   *   upper edge of the measured answer-space region.
   *
   * bottomPx:
   *   lower edge of the measured answer-space region.
   *
   * For ordinary written questions the standard
   * measurement convention is:
   *
   *   bottom of final prompt/instruction line
   *                    ↓
   *   top of next question / Turn-over marker /
   *   footer-barcode region
   *
   * depending on the actual historical page layout.
   */
  topPx:
    number;

  bottomPx:
    number;

  heightPx:
    number;


  /**
   * Point equivalents are retained for PDF-native
   * comparison and future extraction tooling.
   */
  topPt?:
    number;

  bottomPt?:
    number;

  heightPt?:
    number;


  /**
   * Physical height represented by heightPx at the
   * recorded render DPI.
   */
  heightMm:
    number;
};


export type ExamQuestionAnswerSpace = {
  category:
    ExamQuestionAnswerSpaceCategory;

  estimatedLines:
    number;

  measurementMethod:
    ExamQuestionAnswerSpaceMeasurementMethod;

  sourceMeasurement?:
    ExamQuestionPdfRenderMeasurement;

  notes?:
    string;
};


export type ExamQuestionArithmeticComplexity =
  | "VERY_LOW"
  | "LOW"
  | "MEDIUM"
  | "HIGH";


export type ExamQuestionSimplificationVisibility =
  | "EXPLICIT_INSTRUCTION"
  | "IMPLIED_BY_STANDARD_FORM"
  | "NOT_EXPLICITLY_STATED";


export type ExamQuestionCancellationStyle =
  | "NONE"
  | "FINAL_SIMPLIFICATION_ONLY"
  | "CROSS_CANCELLATION_AVAILABLE"
  | "BRACKETED_SIMPLIFICATION_THEN_MULTIPLY"
  | "COMMON_DENOMINATOR_REQUIRED";


export type ExamQuestionFinalAnswerType =
  | "INTEGER"
  | "PROPER_FRACTION"
  | "IMPROPER_FRACTION"
  | "MIXED_NUMBER"
  | "SIMPLIFIED_EXPRESSION";


export type ExamQuestionValueSize =
  | "SMALL"
  | "MEDIUM"
  | "LARGE";


export type ExamQuestionNumberProfile = {
  arithmeticComplexity:
    ExamQuestionArithmeticComplexity;

  requiresSimplification:
    boolean;

  simplificationVisibility:
    ExamQuestionSimplificationVisibility;

  cancellationStyle:
    ExamQuestionCancellationStyle;

  finalAnswerType:
    ExamQuestionFinalAnswerType;

  intermediateValueSize:
    ExamQuestionValueSize;

  finalValueSize:
    ExamQuestionValueSize;

  nonCalculatorFriendly:
    boolean;

  notes?:
    string;
};


/**
 * =========================================================
 * REVERSE / PART-WHOLE PERCENTAGE PROFILE
 * =========================================================
 */


export type ExamQuestionPercentageRelationshipType =
  | "INCREASE"
  | "DECREASE"
  | "PART_OF_WHOLE";


export type ExamQuestionPercentageExpressionStyle =
  | "INCREASED_BY"
  | "MORE_THAN"
  | "REDUCED_BY"
  | "DISCOUNT"
  | "PERCENT_OF"
  | "REPRESENTS_PERCENT_OF"
  | "SURCHARGE"
  | "OTHER";


export type ExamQuestionPercentageKnownValueRole =
  | "FINAL_VALUE"
  | "PART_VALUE";


export type ExamQuestionPercentageRequestedValueRole =
  | "ORIGINAL_VALUE"
  | "WHOLE_VALUE"
  | "CHANGE_AMOUNT";


export type ExamQuestionCalculatorBurden =
  | "MENTAL_FRIENDLY"
  | "WRITTEN_NON_CALCULATOR"
  | "CALCULATOR_NATURAL"
  | "CALCULATOR_STRONGLY_EXPECTED";


export type ExamQuestionValueFormat =
  | "INTEGER"
  | "DECIMAL"
  | "CURRENCY"
  | "SCIENTIFIC_NOTATION";


export type ExamQuestionPercentageProfile = {
  relationshipType:
    ExamQuestionPercentageRelationshipType;

  expressionStyle:
    ExamQuestionPercentageExpressionStyle;

  percentageValue:
    number;

  retainedPercentage:
    number;

  multiplier:
    number;

  knownValue:
    number;

  knownValueRole:
    ExamQuestionPercentageKnownValueRole;

  originalOrWholeValue:
    number;

  requestedValueRole:
    ExamQuestionPercentageRequestedValueRole;

  requestedAnswer:
    number;

  changeAmount?:
    number;

  workingStepCount:
    1 | 2;

  arithmeticComplexity:
    ExamQuestionArithmeticComplexity;

  nonCalculatorFriendly:
    boolean;

  calculatorBurden:
    ExamQuestionCalculatorBurden;

  inverseCalculationProducesExactResult:
    boolean;

  knownValueFormat:
    ExamQuestionValueFormat;

  answerValueFormat:
    ExamQuestionValueFormat;

  valueMagnitude:
    | ExamQuestionValueSize
    | "VERY_LARGE";

  notes?:
    string;
};


/**
 * =========================================================
 * COMPOUND PERCENTAGE PROFILE
 * =========================================================
 *
 * Compound percentage questions require information that
 * does not belong in ExamQuestionPercentageProfile.
 *
 * In particular:
 *
 * - the initial value is known rather than the final value;
 * - a percentage multiplier is applied repeatedly;
 * - the number of periods is mathematically significant;
 * - some questions use more than one percentage rate;
 * - final-answer rounding can itself be part of the mark.
 */


export type ExamQuestionCompoundPercentageDirection =
  | "INCREASE"
  | "DECREASE";


export type ExamQuestionCompoundPercentageRateStructure =
  | "FIXED_RATE"
  | "MULTI_RATE";


export type ExamQuestionCompoundPercentageStage = {
  percentageValue:
    number;

  multiplier:
    number;

  periods:
    number;
};


export type ExamQuestionCompoundPercentageRoundingMode =
  | "NONE"
  | "NEAREST_INTEGER"
  | "NEAREST_TEN"
  | "NEAREST_HUNDRED"
  | "NEAREST_THOUSAND";


export type ExamQuestionCompoundPercentageProfile = {
  /**
   * Overall direction of the compound change.
   *
   * The current historical N5 corpus contains
   * either repeated increases or repeated
   * decreases.
   */
  direction:
    ExamQuestionCompoundPercentageDirection;


  /**
   * FIXED_RATE:
   *
   * One percentage rate is applied throughout,
   * for example:
   *
   *   125000 × 0.98^3
   *
   * MULTI_RATE:
   *
   * Different percentage rates apply to
   * different periods, for example:
   *
   *   20000 × 0.89 × 0.94^2
   */
  rateStructure:
    ExamQuestionCompoundPercentageRateStructure;


  /**
   * One stage for each distinct percentage
   * rate used by the source question.
   */
  stages:
    ExamQuestionCompoundPercentageStage[];


  initialValue:
    number;


  /**
   * Total number of compound-change periods
   * represented by all stages.
   */
  totalPeriods:
    number;


  /**
   * Mathematical value before any explicit
   * final-answer rounding instruction.
   */
  unroundedFinalValue:
    number;


  /**
   * Final value expected by the source
   * question / marking scheme after any
   * required rounding.
   */
  requestedAnswer:
    number;


  roundingMode:
    ExamQuestionCompoundPercentageRoundingMode;


  /**
   * Distinguishes an explicit instruction such
   * as "nearest thousand pounds" from ordinary
   * currency presentation or an exact integer
   * result.
   */
  roundingExplicitInPrompt:
    boolean;


  /**
   * Useful where an SQA monetary answer is
   * naturally displayed to pounds/pence even
   * though the prompt does not explicitly say
   * "2 decimal places".
   */
  currencyDisplayDecimals?:
    0 | 2;


  arithmeticComplexity:
    ExamQuestionArithmeticComplexity;


  calculatorBurden:
    ExamQuestionCalculatorBurden;


  initialValueFormat:
    ExamQuestionValueFormat;


  answerValueFormat:
    ExamQuestionValueFormat;


  valueMagnitude:
    | ExamQuestionValueSize
    | "VERY_LARGE";


  /**
   * True where applying the multiplier once
   * per period is a natural alternative
   * representation of the mathematics.
   *
   * This does not itself establish marking-
   * scheme evidence for that answer method.
   * Answer-method evidence remains in the
   * marking-scheme catalogue.
   */
  yearByYearMethodNatural:
    boolean;


  notes?:
    string;
};


/**
 * =========================================================
 * CONTEXT / WORDING PROFILE
 * =========================================================
 */


export type ExamQuestionWordedProblemProfile = {
  contextDomain:
    string;

  contextEntity:
    string;

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

  sentenceCount:
    number;

  promptWordCount:
    number;

  introductionStyle:
    string;

  relationshipStatementStyle:
    string;

  commandStyle:
    string;

  informationOrder:
    string[];

  contextualVocabulary:
    string[];

  hasNamedPerson:
    boolean;

  usesPronounReference:
    boolean;

  visualContext:
    boolean;

  interleavedSkillIds:
    string[];

  generatorVariationNotes?:
    string;
};


export type ExamQuestionPart = {
  id:
    ExamQuestionId;

  label:
    string;

  marks:
    number;

  skillIds:
    string[];

  conceptIds:
    string[];

  topic:
    AssessmentTopicCode;

  standardProfile:
    ExamQuestionStandardProfile;

  thinkingProfile:
    ExamQuestionThinkingProfile;
};


export type ExamQuestionCatalogEntry = {
  id:
    ExamQuestionId;

  courseId:
    CourseId;

  sourceKind:
    ExamQuestionKind;

  year?:
    number;

  paper:
    Paper;

  questionNumber:
    string;

  totalMarks:
    number;

  familyId:
    string;

  surfaceStyleId:
    string;

  primaryTopic:
    AssessmentTopicCode;

  skillIds:
    string[];

  conceptIds:
    string[];

  paperSuitability:
    SkillPaperSuitability;

  calculatorStatus:
    ExamQuestionCalculatorStatus;

  standardProfile:
    ExamQuestionStandardProfile;

  thinkingProfile:
    ExamQuestionThinkingProfile;

  operationType?:
    ExamQuestionOperationType;

  operandStructure?:
    string;

  numberProfile?:
    ExamQuestionNumberProfile;


  /**
   * Reverse / part-whole percentage evidence.
   */
  percentageProfile?:
    ExamQuestionPercentageProfile;


  /**
   * Repeated percentage-change evidence.
   */
  compoundPercentageProfile?:
    ExamQuestionCompoundPercentageProfile;


  wordedProblemProfile?:
    ExamQuestionWordedProblemProfile;

  sourcePromptText?:
    string;

  sourcePromptStructure?:
    string[];

  surfaceStyleTags:
    ExamQuestionSurfaceStyleTag[];

  promptSummary:
    string;

  styleNotes?:
    string;

  privateNotes?:
    string;

  answerSpace:
    ExamQuestionAnswerSpace;

  parts?:
    ExamQuestionPart[];

  linkedGeneratorFamilyIds:
    string[];

  reviewStatus:
    ExamQuestionReviewStatus;
};