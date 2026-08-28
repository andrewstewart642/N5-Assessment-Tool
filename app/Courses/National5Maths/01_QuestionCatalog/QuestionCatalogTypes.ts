// ============================================================================
// NATIONAL 5 MATHS — UNIVERSAL QUESTION CATALOGUE CONTRACT
// ============================================================================
//
// This is the master contract for the redesigned Question Catalogue.
//
// It deliberately combines:
// - the broader semantic/generation architecture developed for Catalogue V2;
// - the strongest evidence-capture features from the earlier narrow pilot;
// - the expanded visual architecture required by the complete historical corpus.
//
// Historical source wording and artwork are evidence only.  The catalogue stores
// mathematical, structural, linguistic, layout and visual characteristics in a
// normalised form so that later generators can learn from the corpus without
// reproducing historical Questions or artwork.
//
// TRANSITION NOTE
// The 2014 pilot entries pre-date several additive fields restored in this pass.
// Those fields are temporarily optional so the repository remains compilable.
// The 2014 Paper 1 + Paper 2 rewrite will populate them from source evidence.
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";                                      /* Reuses the Course-owned Course identifier. */
import type { AssessmentTopicCode, Paper, SkillPaperSuitability } from "@/app/Assessments/AssessmentTypes"; /* Reuses shared assessment identifiers. */
import type {                                                                                     /* Opens shared catalogue imports. */
  CatalogConfidence,                                                                              /* Reuses catalogue confidence levels. */
  CatalogEvidenceRef,                                                                             /* Reuses traceable source evidence. */
  CatalogGenerationReadiness,                                                                     /* Reuses generation-readiness levels. */
  CatalogProvenance,                                                                              /* Reuses source/classification/generation provenance. */
  CatalogReviewProfile,                                                                           /* Reuses the catalogue review record. */
  CatalogSchemaVersion,                                                                           /* Reuses the catalogue schema identifier. */
  CatalogSourceIsolationProfile,                                                                  /* Reuses source/copyright isolation rules. */
  CatalogValue,                                                                                   /* Reuses typed VALUE/N-A/UNKNOWN/NOT_REVIEWED fields. */
  GeneratorFamilyId,                                                                              /* Reuses generator-family identifiers. */
  PaperContextId,                                                                                 /* Reuses paper-context identifiers. */
} from "../CatalogCoreTypes";                                                                     /* Closes shared catalogue imports. */
import type { VisualElementId, VisualEvidenceProfile } from "../05_VisualAssets/VisualCatalogTypes"; /* Reuses the dedicated visual catalogue subsystem. */

// ============================================================================
// SECTION 1 — QUESTION IDS
// ============================================================================

export type QuestionCatalogId = string;                                                          /* Gives every catalogued Question a stable ID. */
export type QuestionPartId = string;                                                             /* Gives every Question part a stable ID. */
export type QuestionFamilyId = string;                                                           /* Gives each normalised Question family a stable ID. */
export type QuestionInformationId = string;                                                      /* Gives each supplied-information item a stable ID. */
export type QuestionSubgoalId = string;                                                          /* Gives each mathematical subgoal a stable ID. */
export type QuestionResponseSpaceMeasurementId = string;                                         /* Gives each measured response region a stable ID. */

// ============================================================================
// SECTION 2 — CATALOGUE IDENTITY
// ============================================================================

export type QuestionCatalogIdentity = {                                                         /* Opens permanent Question identity. */
  id: QuestionCatalogId;                                                                         /* Gives the Question its stable catalogue ID. */
  schemaVersion: CatalogSchemaVersion;                                                           /* Records the catalogue schema. */
  courseId: CourseId;                                                                            /* Links the Question to its Course. */
  paperContextId: PaperContextId;                                                                /* Links the Question to paper-level context. */
  year: number;                                                                                  /* Records the historical year. */
  paper: Paper;                                                                                  /* Records Paper 1 or Paper 2. */
  questionNumber: string;                                                                        /* Records the printed Question number. */
  answerCatalogId: string;                                                                       /* Links the matching Answer/MS catalogue entry. */
};                                                                                               /* Closes Question identity. */

// ============================================================================
// SECTION 3 — SOURCE PAGE / RESPONSE-SPACE EVIDENCE
// ============================================================================

export type QuestionAnswerSpaceCategory =                                                       /* Classifies the broad amount/form of response space. */
  | "NONE"                                                                                       /* No dedicated response space is supplied. */
  | "VERY_SMALL"                                                                                 /* Only a tiny written area is supplied. */
  | "SMALL"                                                                                      /* A small working area is supplied. */
  | "MEDIUM"                                                                                     /* A normal working area is supplied. */
  | "LARGE"                                                                                      /* A substantial working area is supplied. */
  | "FULL_PAGE"                                                                                  /* Most of a page is available. */
  | "GRAPH_GRID"                                                                                 /* A graph/grid is the principal response surface. */
  | "DIAGRAM_RESPONSE"                                                                           /* Candidate responds directly on a diagram. */
  | "CONSTRUCTION_RESPONSE"                                                                      /* A construction area is supplied. */
  | "MIXED";                                                                                     /* Several response-space types are used. */

export type QuestionAnswerSpaceMeasurementMethod =                                               /* Records how physical response-space measurements were obtained. */
  | "PDF_RENDER"                                                                                 /* Measurements were taken from a controlled PDF render. */
  | "PDF_NATIVE"                                                                                 /* Measurements were extracted directly from PDF geometry. */
  | "MANUAL_ESTIMATE"                                                                            /* Dimensions were estimated manually. */
  | "NOT_MEASURED";                                                                              /* No physical measurement has yet been taken. */

export type QuestionResponseSpaceRegionType =                                                    /* Identifies what a measured region is for. */
  | "WRITTEN_WORKING"                                                                            /* Blank space intended for written mathematics. */
  | "FINAL_ANSWER"                                                                               /* A distinct final-answer region. */
  | "GRAPH_RESPONSE"                                                                             /* Space occupied by graph axes/grid response surface. */
  | "DIAGRAM_RESPONSE"                                                                           /* Space occupied by a diagram response surface. */
  | "CONSTRUCTION_RESPONSE"                                                                      /* Space intended for construction work. */
  | "TABLE_RESPONSE"                                                                             /* Space in or around a table for candidate entries. */
  | "MIXED"                                                                                      /* The measured block supports several response types. */
  | "OTHER";                                                                                     /* A rare response-space form. */

export type QuestionPdfRenderMeasurement = {                                                     /* Restores exact physical response-space evidence from the legacy pilot. */
  id: QuestionResponseSpaceMeasurementId;                                                        /* Gives this measured region a stable local ID. */
  regionType: QuestionResponseSpaceRegionType;                                                   /* Records the job of the measured region. */
  questionPartIds: QuestionPartId[];                                                              /* Links the region to the Question parts it serves. */
  pdfPageNumber: number;                                                                          /* Records the physical 1-based PDF page number. */
  printedPageLabel: string | null;                                                                /* Records the printed page label where useful. */
  measurementMethod: QuestionAnswerSpaceMeasurementMethod;                                       /* Records how the measurement was obtained. */
  renderDpi: number | null;                                                                       /* Records render DPI for pixel measurements. */
  pageWidthPx: number | null;                                                                     /* Records rendered page width when measured in pixels. */
  pageHeightPx: number | null;                                                                    /* Records rendered page height when measured in pixels. */
  topPx: number | null;                                                                           /* Records top edge using a top-left pixel origin. */
  bottomPx: number | null;                                                                        /* Records bottom edge using a top-left pixel origin. */
  leftPx: number | null;                                                                          /* Records left edge when horizontal extent matters. */
  rightPx: number | null;                                                                         /* Records right edge when horizontal extent matters. */
  heightPx: number | null;                                                                        /* Records pixel height of the usable response region. */
  widthPx: number | null;                                                                         /* Records pixel width when useful. */
  topPt: number | null;                                                                           /* Records top edge in PDF points when available. */
  bottomPt: number | null;                                                                        /* Records bottom edge in PDF points when available. */
  leftPt: number | null;                                                                          /* Records left edge in PDF points when available. */
  rightPt: number | null;                                                                         /* Records right edge in PDF points when available. */
  heightPt: number | null;                                                                        /* Records physical height in PDF points when available. */
  widthPt: number | null;                                                                         /* Records physical width in PDF points when available. */
  heightMm: number | null;                                                                        /* Records physical usable height in millimetres. */
  widthMm: number | null;                                                                         /* Records physical usable width in millimetres. */
  boundaryConvention: string;                                                                    /* Describes exactly what was treated as the upper/lower response boundary. */
  notes: string | null;                                                                           /* Records unusual source-page layout considerations. */
};                                                                                               /* Closes exact response-space measurement. */

export type QuestionAnswerSpaceProfile = {                                                       /* Opens candidate response-space evidence. */
  category: QuestionAnswerSpaceCategory;                                                         /* Records the broad response-space category. */
  estimatedWritingLines: number | null;                                                          /* Estimates useful hand-written lines. */
  responseSurfaceVisualIds: VisualElementId[];                                                   /* Links grids/axes/diagrams that form response surfaces. */
  separateFinalAnswerAreaPresent: boolean;                                                       /* Records whether a distinct final-answer area exists. */
  measurementMethod?: QuestionAnswerSpaceMeasurementMethod;                                      /* TRANSITION: records the strongest measurement method used. */
  sourceMeasurements?: QuestionPdfRenderMeasurement[];                                           /* TRANSITION: stores exact measured response regions. */
  notes: string | null;                                                                           /* Records unusual response-space behaviour. */
};                                                                                               /* Closes response-space evidence. */

export type QuestionSourceLayoutProfile = {                                                      /* Opens page-level source layout evidence. */
  sourcePages: number[];                                                                          /* Records physical PDF pages containing the Question. */
  printedPageLabels: string[];                                                                    /* Records printed page labels. */
  continuesAcrossPages: boolean;                                                                  /* Records whether the Question spans multiple pages. */
  answerSpace: QuestionAnswerSpaceProfile;                                                       /* Stores response-space evidence. */
  sourceEvidence: CatalogEvidenceRef[];                                                          /* Links layout facts to source evidence. */
};                                                                                               /* Closes source layout. */

// ============================================================================
// SECTION 4 — STANDARD / THINKING / CALCULATOR DEMAND
// ============================================================================

export type QuestionStandardProfile =                                                            /* Records Course-standard demand. */
  | "C"                                                                                          /* Mainly Course-grade standard. */
  | "A"                                                                                          /* Mainly higher-demand standard. */
  | "C+A";                                                                                       /* Mixes both levels. */

export type QuestionThinkingProfile =                                                            /* Records broad thinking demand. */
  | "OPERATIONAL"                                                                                /* Mainly known procedures. */
  | "REASONING"                                                                                  /* Mainly selection/interpretation/justification. */
  | "MIXED";                                                                                     /* Mixes operational and reasoning demand. */

export type QuestionCalculatorStatus =                                                           /* Distinguishes paper permission from actual Question need. */
  | "NON_CALCULATOR"                                                                             /* Question is intended to be completed without calculator. */
  | "CALCULATOR_ALLOWED"                                                                         /* Calculator is available but not inherently required. */
  | "CALCULATOR_REQUIRED";                                                                       /* Normal intended solution materially depends on calculator functionality. */

export type QuestionCalculatorBurden =                                                           /* Restores the graded calculator-demand evidence from the legacy pilot. */
  | "MENTAL_FRIENDLY"                                                                            /* Arithmetic is comfortably mental. */
  | "WRITTEN_NON_CALCULATOR"                                                                     /* Written arithmetic is natural without calculator. */
  | "CALCULATOR_OPTIONAL"                                                                        /* Calculator may help but is not naturally necessary. */
  | "CALCULATOR_NATURAL"                                                                         /* Calculator is the natural efficient tool. */
  | "CALCULATOR_STRONGLY_EXPECTED";                                                              /* Calculator use is strongly implied by values/functions. */

export type QuestionCalculatorProfile = {                                                       /* Opens Question-specific calculator evidence. */
  status: QuestionCalculatorStatus;                                                              /* Records whether calculator is forbidden/allowed/required for this instance. */
  burden: QuestionCalculatorBurden;                                                              /* Records how strongly the Question invites calculator use. */
  requiredFunctions: string[];                                                                    /* Records functions such as inverse trig/log/powers when materially needed. */
  modeSensitive: boolean;                                                                         /* Records degree/radian/other mode sensitivity. */
  modeRequirements: string[];                                                                     /* Records relevant calculator-mode requirements. */
  notes: string | null;                                                                           /* Records unusual calculator behaviour. */
};                                                                                               /* Closes calculator evidence. */

// ============================================================================
// SECTION 5 — QUESTION AND PART STRUCTURE
// ============================================================================

export type QuestionPartDependencyType =                                                        /* Describes how parts depend on one another. */
  | "INDEPENDENT"                                                                                /* Parts stand alone. */
  | "FOLLOW_ON"                                                                                  /* Later work uses earlier work/results. */
  | "HENCE"                                                                                      /* Prompt explicitly directs use of an earlier result. */
  | "SHARED_SETUP"                                                                               /* Parts share setup but not necessarily answers. */
  | "SHARED_RESULT"                                                                              /* Parts share/use a common derived result. */
  | "MIXED";                                                                                     /* Several dependency patterns occur. */

export type QuestionCommandType =                                                                /* Describes what the candidate is asked to do. */
  | "CALCULATE" | "EVALUATE" | "FIND" | "STATE" | "WRITE_DOWN" | "DETERMINE"                /* Covers common numerical/statement commands. */
  | "SOLVE" | "SIMPLIFY" | "EXPRESS" | "EXPAND" | "FACTORISE" | "CHANGE_SUBJECT"           /* Covers algebraic commands. */
  | "SHOW_THAT" | "JUSTIFY" | "COMPARE" | "COMMENT" | "ESTIMATE"                            /* Covers reasoning/interpretation commands. */
  | "DRAW" | "SKETCH" | "PLOT" | "CONSTRUCT" | "IDENTIFY" | "COMPLETE"                    /* Covers visual/constructive commands. */
  | "PROVE" | "INTERPRET" | "OTHER";                                                         /* Covers proof, interpretation and rare commands. */

export type QuestionResponseType =                                                               /* Describes the form of candidate response. */
  | "NUMBER" | "EXPRESSION" | "EQUATION" | "INEQUALITY" | "COORDINATES" | "VECTOR"          /* Covers common mathematical responses. */
  | "GRAPH" | "SKETCH" | "DIAGRAM_ANNOTATION" | "DRAWN_VECTOR" | "CONSTRUCTION"             /* Covers visual responses. */
  | "SHADED_REGION" | "TABLE_ENTRY" | "WRITTEN_COMPARISON" | "JUSTIFICATION"                 /* Covers region/data/written reasoning responses. */
  | "CONCLUSION" | "MIXED";                                                                    /* Covers conclusions and mixed response forms. */

export type QuestionPart = {                                                                     /* Opens one Question part. */
  id: QuestionPartId;                                                                            /* Gives the part a stable ID. */
  label: string;                                                                                 /* Records the printed part label. */
  marks: number;                                                                                 /* Records marks available. */
  primarySkillId: string;                                                                        /* Links the primary canonical Skill. */
  secondarySkillIds: string[];                                                                   /* Links additional canonical Skills. */
  conceptIds: string[];                                                                          /* Links Course concepts. */
  topic: AssessmentTopicCode;                                                                    /* Records main topic. */
  commandTypes: QuestionCommandType[];                                                           /* Records commands used in this part. */
  responseTypes: QuestionResponseType[];                                                         /* Records required response forms. */
  dependsOnPartIds: QuestionPartId[];                                                            /* Links earlier dependent parts. */
  sharedInformationIds: QuestionInformationId[];                                                 /* Links shared givens. */
  visualElementIds: VisualElementId[];                                                           /* Links visuals used by the part. */
  standardProfile?: QuestionStandardProfile;                                                     /* TRANSITION: restores standard classification at part level. */
  thinkingProfile?: QuestionThinkingProfile;                                                     /* TRANSITION: restores thinking classification at part level. */
  calculatorBurden?: QuestionCalculatorBurden;                                                   /* TRANSITION: permits part-specific calculator demand when it differs. */
};                                                                                               /* Closes one Question part. */

export type QuestionStructureProfile = {                                                        /* Opens structural shape. */
  structureType: "SINGLE" | "MULTIPART";                                                       /* Records whether explicit parts exist. */
  totalMarks: number;                                                                            /* Records Question total marks. */
  parts: QuestionPart[];                                                                         /* Stores all parts in source order. */
  dependencyType: QuestionPartDependencyType;                                                    /* Summarises part dependency. */
  sharedStimulus: boolean;                                                                       /* Records shared setup/stimulus. */
  sharedVisuals: boolean;                                                                        /* Records shared visual material. */
  sharedGivenData: boolean;                                                                      /* Records shared givens. */
  requiredResultProvided: boolean;                                                               /* Records show-that/stated-result structure. */
};                                                                                               /* Closes structure. */

// ============================================================================
// SECTION 6 — CURRICULUM CLASSIFICATION
// ============================================================================

export type QuestionCurriculumProfile = {                                                       /* Opens Course-owned curriculum links. */
  primaryTopic: AssessmentTopicCode;                                                             /* Records primary topic. */
  primarySkillId: string;                                                                        /* Records primary canonical Skill. */
  secondarySkillIds: string[];                                                                   /* Records additional canonical Skills. */
  primaryConceptId: string;                                                                      /* Records primary Concept. */
  conceptIds: string[];                                                                          /* Records all relevant Concepts. */
  paperSuitability: SkillPaperSuitability;                                                       /* Records current Skills-Tree paper suitability. */
  standardProfile: QuestionStandardProfile;                                                      /* Records overall standard demand. */
  thinkingProfile: QuestionThinkingProfile;                                                      /* Records overall thinking demand. */
  crossSkillQuestion: boolean;                                                                   /* Records material cross-Skill assessment. */
  skillMarkDistribution: Record<string, number>;                                                 /* Maps Skills to marks. */
  conceptMarkDistribution: Record<string, number>;                                               /* Maps Concepts to marks. */
};                                                                                               /* Closes curriculum profile. */

// ============================================================================
// SECTION 7 — TASK AND RESPONSE
// ============================================================================

export type QuestionTaskProfile = {                                                             /* Opens task/response requirements. */
  commandTypes: QuestionCommandType[];                                                           /* Records meaningful commands. */
  responseTypes: QuestionResponseType[];                                                         /* Records response forms. */
  responseCount: number | null;                                                                  /* Records fixed number of final responses. */
  explicitMethodCue: boolean;                                                                    /* Records whether method is signposted. */
  methodRestricted: boolean;                                                                     /* Records whether method is required/excluded. */
  workingRequestedInPrompt: boolean;                                                             /* Records explicit working instruction. */
  justificationRequested: boolean;                                                               /* Records explicit justification request. */
  contextualConclusionRequested: boolean;                                                       /* Records required contextual conclusion. */
  visualResponseRequired: boolean;                                                               /* Records whether candidate must create/alter a visual. */
};                                                                                               /* Closes task profile. */

// ============================================================================
// SECTION 8 — MATHEMATICAL STRUCTURE
// ============================================================================

export type QuestionOperationType =                                                              /* Records material mathematical operations. */
  | "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | "SIMPLIFY" | "EXPAND" | "FACTORISE"      /* Covers arithmetic/algebraic operations. */
  | "SUBSTITUTE" | "REARRANGE" | "SOLVE" | "EVALUATE" | "INTERPRET" | "CONSTRUCT"          /* Covers equation/model/constructive operations. */
  | "COMPARE" | "FILTER_SOLUTIONS" | "PROVE" | "MODEL" | "OTHER";                          /* Covers selection, proof, modelling and rare operations. */

export type QuestionRepresentationTransition = {                                                 /* Records one representation change. */
  from: string;                                                                                  /* Records starting representation. */
  to: string;                                                                                    /* Records resulting representation. */
  purpose: string;                                                                               /* Explains why the transition matters. */
};                                                                                               /* Closes representation transition. */

export type QuestionMathematicalStructureProfile = {                                             /* Opens the mathematical skeleton. */
  primaryGoal: string;                                                                           /* Gives a normalised mathematical target. */
  subgoals: { id: QuestionSubgoalId; summary: string; dependsOnSubgoalIds: QuestionSubgoalId[] }[]; /* Stores dependent mathematical subgoals. */
  operationTypes: QuestionOperationType[];                                                       /* Records material operations. */
  requiredFormulaIds: string[];                                                                  /* Links relevant formulas. */
  requiredTheoremIds: string[];                                                                  /* Links relevant rules/theorems. */
  stageCount: number;                                                                            /* Counts meaningful dependent stages. */
  intermediateQuantityTypes: string[];                                                           /* Records important intermediate quantities. */
  methodSelectionRequired: boolean;                                                              /* Records whether method choice is assessed. */
  solutionCountExpected: number | null;                                                          /* Records intended valid-solution count. */
  validitySelectionRequired: boolean;                                                            /* Records whether invalid candidates must be rejected. */
  representationTransitions: QuestionRepresentationTransition[];                                /* Records changes between representations. */
};                                                                                               /* Closes mathematical structure. */

// ============================================================================
// SECTION 9 — SUPPLIED INFORMATION
// ============================================================================

export type QuestionInformationSource =                                                         /* Records where a useful fact comes from. */
  | "TEXT" | "DIAGRAM" | "IMAGE" | "GRAPH" | "TABLE" | "PREVIOUS_PART"                       /* Covers source representations. */
  | "FORMULA_SHEET" | "COURSE_KNOWLEDGE";                                                      /* Covers supplied/reference knowledge. */

export type QuestionInformationExplicitness =                                                   /* Records how directly information is supplied. */
  | "EXPLICIT"                                                                                   /* Directly stated/labelled. */
  | "IMPLIED"                                                                                    /* Shown but not stated. */
  | "MUST_INFER";                                                                                /* Candidate must infer it. */

export type QuestionInformationRole =                                                           /* Records the job of supplied information. */
  | "GIVEN_VALUE" | "RELATIONSHIP" | "CONSTRAINT" | "FORMULA" | "CONTEXT"                    /* Covers givens and contextual structure. */
  | "TARGET" | "ORIENTATION" | "DOMAIN" | "RESPONSE_INSTRUCTION";                             /* Covers targets/orientation/domain/output rules. */

export type QuestionInformationItem = {                                                         /* Opens one information item. */
  id: QuestionInformationId;                                                                     /* Gives the item a stable ID. */
  informationType: string;                                                                       /* Names the information category. */
  normalisedContent: string;                                                                     /* Stores paraphrased/mathematical content. */
  value: number | string | null;                                                                 /* Stores a meaningful value when possible. */
  unit: string | null;                                                                            /* Stores associated unit. */
  source: QuestionInformationSource;                                                             /* Records where candidate obtains the information. */
  explicitness: QuestionInformationExplicitness;                                                 /* Records stated/shown/inferred status. */
  role: QuestionInformationRole;                                                                 /* Records function in the Question. */
  visualElementId: VisualElementId | null;                                                       /* Links visual information. */
  usedByPartIds: QuestionPartId[];                                                               /* Records which parts use it. */
};                                                                                               /* Closes information item. */

// ============================================================================
// SECTION 10 — REASONING / DIFFICULTY
// ============================================================================

export type QuestionReasoningType =                                                              /* Classifies important reasoning behaviour. */
  | "DIRECT_PROCEDURE" | "REVERSE_REASONING" | "METHOD_SELECTION" | "INFORMATION_MARSHALLING" /* Covers procedural/selection/information demand. */
  | "MULTI_STAGE" | "REPRESENTATION_TRANSLATION" | "JUSTIFICATION" | "COMPARISON_INTERPRETATION" /* Covers multi-stage/representation/written reasoning. */
  | "VALIDATION" | "STRUCTURE_RECOGNITION" | "SOLUTION_FILTERING" | "DERIVATION"               /* Covers checking/recognition/filtering/derivation. */
  | "CONTEXT_INTERPRETATION" | "VISUAL_INTERPRETATION";                                        /* Covers context and visual reasoning. */

export type QuestionDemandLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";       /* Gives a common five-point demand scale. */

export type QuestionDifficultyProfile = {                                                       /* Opens decomposed difficulty. */
  overallDifficulty: QuestionDemandLevel;                                                        /* Rates overall demand. */
  methodSelectionLoad: QuestionDemandLevel;                                                      /* Rates method-selection burden. */
  arithmeticLoad: QuestionDemandLevel;                                                           /* Rates numerical workload. */
  algebraicLoad: QuestionDemandLevel;                                                            /* Rates algebraic workload. */
  representationLoad: QuestionDemandLevel;                                                       /* Rates visual/representation workload. */
  languageLoad: QuestionDemandLevel;                                                             /* Rates reading/language burden. */
  contextInterpretationLoad: QuestionDemandLevel;                                                /* Rates contextual interpretation. */
  reasoningDepth: QuestionDemandLevel;                                                           /* Rates depth of reasoning. */
  dependencyCount: number;                                                                       /* Counts meaningful dependencies. */
  difficultyDrivers: string[];                                                                   /* Identifies the actual sources of difficulty. */
};                                                                                               /* Closes difficulty profile. */

export type QuestionReasoningProfile = {                                                        /* Opens reasoning profile. */
  reasoningTypes: QuestionReasoningType[];                                                       /* Records reasoning modes. */
  difficulty: QuestionDifficultyProfile;                                                        /* Stores decomposed demand. */
};                                                                                               /* Closes reasoning profile. */

// ============================================================================
// SECTION 11 — NUMBER / ARITHMETIC CHARACTERISTICS
// ============================================================================

export type QuestionNumberType =                                                                /* Records number forms present. */
  | "INTEGER" | "DECIMAL" | "FRACTION" | "PERCENTAGE" | "SURD" | "POWER"                    /* Covers common number forms. */
  | "SCIENTIFIC_NOTATION" | "PI" | "EXACT_TRIG_VALUE" | "NEGATIVE" | "ALGEBRAIC";            /* Covers specialist/exact/symbolic forms. */

export type QuestionSimplificationVisibility =                                                  /* Restores how explicitly simplification is signalled. */
  | "EXPLICIT_INSTRUCTION"                                                                       /* Prompt explicitly requires simplification. */
  | "IMPLIED_BY_STANDARD_FORM"                                                                   /* Simplification is expected from the required mathematical form. */
  | "NOT_EXPLICITLY_STATED"                                                                      /* Simplification is not directly signalled. */
  | "NOT_APPLICABLE";                                                                            /* Simplification is irrelevant. */

export type QuestionCancellationStyle =                                                         /* Restores the structure of fraction/arithmetic simplification. */
  | "NONE"                                                                                       /* No cancellation/simplification opportunity. */
  | "FINAL_SIMPLIFICATION_ONLY"                                                                  /* Simplification naturally occurs at the end. */
  | "CROSS_CANCELLATION_AVAILABLE"                                                               /* Cross-cancellation is naturally available before multiplication. */
  | "BRACKETED_SIMPLIFICATION_THEN_MULTIPLY"                                                     /* A bracketed component simplifies before a product. */
  | "COMMON_DENOMINATOR_REQUIRED"                                                                /* Common-denominator work is structurally required. */
  | "OTHER";                                                                                     /* Covers an uncommon arithmetic structure. */

export type QuestionFinalValueForm =                                                             /* Restores useful final-value subtype evidence without storing the answer itself. */
  | "INTEGER" | "PROPER_FRACTION" | "IMPROPER_FRACTION" | "MIXED_NUMBER"                      /* Covers common exact numerical forms. */
  | "DECIMAL" | "PERCENTAGE" | "SURD" | "SCIENTIFIC_NOTATION" | "ALGEBRAIC_EXPRESSION"        /* Covers other mathematical forms. */
  | "COORDINATE" | "VECTOR" | "PROSE" | "VISUAL" | "OTHER";                                /* Covers non-scalar outputs. */

export type QuestionValueSize = "VERY_SMALL" | "SMALL" | "MEDIUM" | "LARGE" | "VERY_LARGE";   /* Gives an ordinal magnitude classification. */
export type QuestionValueFormat = "INTEGER" | "DECIMAL" | "FRACTION" | "CURRENCY" | "SCIENTIFIC_NOTATION" | "ALGEBRAIC" | "OTHER"; /* Classifies displayed value format. */

export type QuestionNumberProfile = {                                                           /* Opens number-design evidence. */
  numberTypes: QuestionNumberType[];                                                             /* Records number types present. */
  nonCalculatorFriendly: boolean;                                                                /* Records whether arithmetic is feasible without calculator. */
  exactAndApproximateMixed: boolean;                                                             /* Records mixture of exact and approximate values. */
  simplificationVisibility?: QuestionSimplificationVisibility;                                  /* TRANSITION: restores explicit/implied simplification evidence. */
  expectedFinalValueForm?: QuestionFinalValueForm;                                               /* TRANSITION: records the expected output subtype without storing its value. */
  intermediateValueSize?: QuestionValueSize;                                                     /* TRANSITION: restores intermediate magnitude evidence. */
  finalValueSize?: QuestionValueSize;                                                            /* TRANSITION: restores final magnitude evidence. */
  dominantInputFormat?: QuestionValueFormat;                                                     /* TRANSITION: records dominant supplied-value representation. */
  dominantOutputFormat?: QuestionValueFormat;                                                    /* TRANSITION: records expected output representation. */
  magnitudeNotes: string | null;                                                                 /* Records unusual magnitude considerations. */
};                                                                                               /* Closes number profile. */

export type QuestionParameterDesignProfile = {                                                  /* Opens deliberate numerical/parameter construction. */
  deliberatelyConstructedValues: boolean;                                                       /* Records intentional parameter design. */
  exactResultDesigned: boolean;                                                                  /* Records intentional exact-result design. */
  roundingDesigned: boolean;                                                                     /* Records intentional rounding demand. */
  factorisableDesigned: boolean;                                                                 /* Records factorisation-friendly construction. */
  perfectSquareDesigned: boolean;                                                                /* Records perfect-square construction. */
  pythagoreanTripleUsed: boolean;                                                                /* Records Pythagorean-triple design. */
  niceRatioUsed: boolean;                                                                        /* Records convenient ratio design. */
  validSolutionCountDesigned: number | null;                                                     /* Records intentionally controlled solution count. */
  parameterConstraints: string[];                                                                /* Records constraints future generators must obey. */
  safeVariationAxes: string[];                                                                   /* Records parameters that may vary safely. */
  invariantRelationships: string[];                                                              /* Records relationships that must remain fixed. */
  degeneracyConditionsToAvoid: string[];                                                        /* Records combinations that break the Question. */
};                                                                                               /* Closes parameter design. */

// ============================================================================
// SECTION 12 — CONSTRAINTS / ANSWER SPECIFICATION
// ============================================================================

export type QuestionConstraintProfile = {                                                       /* Opens mathematical/context/presentation constraints. */
  mathematicalDomainConstraints: string[];                                                      /* Records domain restrictions. */
  contextValidityConstraints: string[];                                                         /* Records real-world restrictions. */
  calculatorModeConstraints: string[];                                                          /* Records degree/radian/etc. implications. */
  methodConstraints: string[];                                                                   /* Records permitted/prohibited methods. */
  presentationConstraints: string[];                                                             /* Records required output form. */
};                                                                                               /* Closes constraints. */

export type QuestionAnswerForm = "EXACT" | "APPROXIMATE" | "SYMBOLIC" | "GRAPHICAL" | "PROSE" | "MIXED"; /* Classifies broad final-answer form. */
export type QuestionPrecisionType = "NONE" | "DECIMAL_PLACES" | "SIGNIFICANT_FIGURES" | "NEAREST_UNIT" | "ACCEPTED_RANGE"; /* Classifies precision instruction. */

export type QuestionUnitProfile = {                                                             /* Opens unit behaviour. */
  dimension: string | null;                                                                      /* Records length/area/volume/time/etc. */
  unitSymbol: string | null;                                                                     /* Records expected unit symbol. */
  conversionRequired: boolean;                                                                  /* Records unit conversion. */
  unitsExplicitlyRequested: boolean;                                                            /* Records explicit unit instruction. */
};                                                                                               /* Closes unit profile. */

export type QuestionAnswerSpecification = {                                                     /* Opens Question-side answer requirements. */
  answerForm: QuestionAnswerForm;                                                                /* Records broad answer form. */
  simplestFormRequired: boolean;                                                                /* Records simplest-form requirement. */
  rationalDenominatorRequired: boolean;                                                        /* Records rationalisation requirement. */
  positivePowersRequired: boolean;                                                              /* Records positive-index requirement. */
  scientificNotationRequired: boolean;                                                         /* Records scientific-notation requirement. */
  precisionType: QuestionPrecisionType;                                                         /* Records precision rule. */
  precisionValue: number | null;                                                                /* Records requested precision. */
  units: QuestionUnitProfile;                                                                   /* Records unit behaviour. */
  multipleAnswersRequired: number | null;                                                       /* Records fixed answer count. */
  domainRestriction: string | null;                                                             /* Records valid domain. */
  contextualWordsRequired: boolean;                                                             /* Records required contextual wording. */
  coordinateOrderRelevant: boolean;                                                             /* Records coordinate-order sensitivity. */
  bracketsRelevant: boolean;                                                                    /* Records bracket significance. */
  visualAnswerRequired: boolean;                                                                /* Records graphical/diagram response requirement. */
};                                                                                               /* Closes answer specification. */

// ============================================================================
// SECTION 13 — CONTEXT / PROMPT LANGUAGE
// ============================================================================

export type QuestionContextRole = "NONE" | "SURFACE_ONLY" | "MATHEMATICALLY_RELEVANT" | "MODEL_DEFINING"; /* Classifies how context participates mathematically. */

export type QuestionContextProfile = {                                                          /* Opens real-world context evidence. */
  contextualised: boolean;                                                                       /* Records use of a real-world setting. */
  contextDomain: string | null;                                                                  /* Records broad context family. */
  contextRole: QuestionContextRole;                                                              /* Records mathematical importance of context. */
  namedPeoplePresent: boolean;                                                                   /* Records named-person styling. */
  currencyPresent: boolean;                                                                      /* Records financial context. */
  realWorldUnitsPresent: boolean;                                                                /* Records physical/contextual units. */
  realismConstrainsAnswer: boolean;                                                              /* Records whether unrealistic results must be rejected. */
  contextObjects: string[];                                                                      /* Records meaningful real-world objects. */
  contextCanBeSafelyReplaced: boolean;                                                           /* Records whether surface context may vary. */
};                                                                                               /* Closes context profile. */

export type QuestionTemporalLanguageStructure =                                                 /* Restores temporal wording structure from the legacy word-problem pilot. */
  | "NONE"                                                                                       /* No temporal relationship. */
  | "BEFORE_AFTER"                                                                               /* Explicit before/after relationship. */
  | "CURRENT_PREVIOUS"                                                                           /* Current quantity compared with a previous quantity. */
  | "YEAR_ON_YEAR"                                                                               /* Repeated annual change or annual comparison. */
  | "PART_WHOLE_COMPARISON"                                                                      /* Language compares a stated part with a whole. */
  | "SEQUENCE_OF_EVENTS"                                                                         /* Several events/stages occur in order. */
  | "OTHER";                                                                                     /* Covers an uncommon temporal structure. */

export type QuestionPromptStructureProfile = {                                                  /* Restores forensic prompt-construction evidence without storing source prose. */
  sentenceCount: number;                                                                         /* Records sentence count in the source prompt. */
  promptWordCount: number;                                                                       /* Records source prompt word count. */
  introductionStyle: string;                                                                     /* Normalises how the Question introduces givens/context. */
  relationshipStatementStyle: string | null;                                                    /* Normalises how key relationships are stated. */
  commandStyle: string;                                                                          /* Normalises how the final task command is expressed. */
  temporalStructure: QuestionTemporalLanguageStructure;                                          /* Records temporal/part-whole rhetorical structure. */
  informationOrder: string[];                                                                    /* Records the order in which semantic information roles appear. */
  normalisedPromptStructure: string[];                                                           /* Records paraphrased sentence/section roles rather than historical wording. */
  usesPronounReference: boolean;                                                                 /* Records use of pronouns linking statements. */
  lexicalFeatureTags: string[];                                                                  /* Records generic vocabulary/style features without copying sentences. */
  generatorVariationNotes: string | null;                                                       /* Records safe linguistic variation guidance. */
};                                                                                               /* Closes prompt-structure profile. */

export type QuestionLanguageProfile = {                                                         /* Opens language/prompt evidence. */
  informationDensity: QuestionDemandLevel;                                                      /* Rates information density. */
  scaffoldingLevel: QuestionDemandLevel;                                                        /* Rates method guidance. */
  bulletStructureUsed: boolean;                                                                 /* Records bullet/list presentation. */
  naturalLanguageInterpretationRequired: boolean;                                               /* Records translation from prose to mathematics. */
  promptSummary: string;                                                                        /* Stores a paraphrased structural summary only. */
  promptStructure?: QuestionPromptStructureProfile;                                              /* TRANSITION: restores objective/rhetorical prompt evidence. */
  styleNotes: string | null;                                                                     /* Records useful stylistic observations. */
};                                                                                               /* Closes language profile. */

// ============================================================================
// SECTION 14 — MATHEMATICAL MODEL
// ============================================================================

export type QuestionMathematicalModelProfile = {                                                /* Opens contextual mathematical-model evidence. */
  modelFamily: string;                                                                           /* Names model family such as linear/cosine/quadratic. */
  normalisedModel: string;                                                                       /* Stores compact mathematical model. */
  independentVariable: string;                                                                  /* Records model input. */
  dependentVariable: string;                                                                    /* Records model output. */
  physicalOrContextDomain: string | null;                                                       /* Records meaningful real-world domain. */
  modelProvidedToCandidate: boolean;                                                            /* Records whether model is supplied. */
  candidateMustConstructModel: boolean;                                                         /* Records model-construction requirement. */
  candidateMustInterpretModel: boolean;                                                         /* Records model-interpretation requirement. */
  solveForIndependentVariable: boolean;                                                        /* Records reverse solving for input. */
  targetDependentValueProvided: boolean;                                                       /* Records target output value. */
  modelParameters: Record<string, number | string>;                                             /* Stores normalised model parameters. */
};                                                                                               /* Closes model profile. */

// ============================================================================
// SECTION 15 — SPECIALISED NUMERICAL / MATHEMATICAL PROFILES
// ============================================================================

export type QuestionArithmeticProfile = {                                                       /* Opens arithmetic-specific structure. */
  arithmeticComplexity: QuestionDemandLevel;                                                    /* Rates arithmetic complexity. */
  commonDenominatorRequired: boolean;                                                           /* Records required common-denominator work. */
  cancellationAvailable: boolean;                                                               /* Records cancellation opportunity. */
  simplificationRequired: boolean;                                                              /* Records required simplification. */
  simplificationVisibility?: QuestionSimplificationVisibility;                                 /* TRANSITION: restores how simplification is signalled. */
  cancellationStyle?: QuestionCancellationStyle;                                               /* TRANSITION: restores the actual simplification/cancellation structure. */
};                                                                                               /* Closes arithmetic profile. */

export type QuestionPercentageExpressionStyle =                                                /* Restores how a percentage relationship is expressed linguistically. */
  | "INCREASED_BY" | "MORE_THAN" | "REDUCED_BY" | "DISCOUNT" | "PERCENT_OF"                  /* Covers common direct percentage phrasing. */
  | "REPRESENTS_PERCENT_OF" | "SURCHARGE" | "ANNUAL_CHANGE" | "OTHER";                        /* Covers part-whole/compound/other phrasing. */

export type QuestionPercentageKnownValueRole =                                                 /* Classifies the role of the known quantity. */
  | "INITIAL_VALUE" | "FINAL_VALUE" | "PART_VALUE" | "WHOLE_VALUE" | "CHANGE_AMOUNT" | "OTHER"; /* Covers simple/reverse/compound percentage structures. */

export type QuestionPercentageRequestedValueRole =                                             /* Classifies what the candidate is asked to recover. */
  | "INITIAL_VALUE" | "FINAL_VALUE" | "ORIGINAL_VALUE" | "PART_VALUE" | "WHOLE_VALUE"         /* Covers common percentage targets. */
  | "CHANGE_AMOUNT" | "PERCENTAGE_RATE" | "OTHER";                                            /* Covers other targets. */

export type QuestionCompoundPercentageRateStructure = "FIXED_RATE" | "MULTI_RATE";              /* Distinguishes one repeated rate from multiple staged rates. */

export type QuestionCompoundPercentageStage = {                                                /* Restores a rate-to-period mapping from the legacy compound profile. */
  percentageValue: number;                                                                       /* Records the rate for this stage. */
  multiplier: number;                                                                            /* Records the multiplicative factor for this stage. */
  periods: number;                                                                               /* Records how many periods this stage lasts. */
};                                                                                               /* Closes one compound stage. */

export type QuestionPercentageProfile = {                                                       /* Opens percentage-specific structure. */
  relationshipType: "INCREASE" | "DECREASE" | "PART_OF_WHOLE" | "REVERSE" | "COMPOUND";       /* Records broad percentage family. */
  percentageValues: number[];                                                                    /* Records percentage rates present. */
  multiplierValues: number[];                                                                    /* Records associated multipliers. */
  periods: number | null;                                                                         /* Records total period count where a simple single-rate representation suffices. */
  originalValueKnown: boolean;                                                                   /* Records whether starting/original quantity is supplied. */
  finalValueKnown: boolean;                                                                      /* Records whether final quantity is supplied. */
  reverseCalculationRequired: boolean;                                                          /* Records reverse-percentage reasoning. */
  expressionStyles?: QuestionPercentageExpressionStyle[];                                       /* TRANSITION: restores linguistic relationship style. */
  knownValueRoles?: QuestionPercentageKnownValueRole[];                                         /* TRANSITION: records the semantic role of supplied quantities. */
  requestedValueRole?: QuestionPercentageRequestedValueRole;                                    /* TRANSITION: records the semantic role of the required quantity. */
  workingStepCount?: number;                                                                     /* TRANSITION: records natural Question-side mathematical stage count. */
  inverseCalculationProducesExactResult?: boolean;                                              /* TRANSITION: records deliberate exact reverse-percentage design. */
  compoundRateStructure?: QuestionCompoundPercentageRateStructure;                              /* TRANSITION: distinguishes fixed-rate and multi-rate compound structures. */
  compoundStages?: QuestionCompoundPercentageStage[];                                           /* TRANSITION: preserves exact rate-period grouping. */
  totalPeriods?: number | null;                                                                  /* TRANSITION: stores total compound periods independently of stage count. */
};                                                                                               /* Closes percentage profile. */

export type QuestionPowersSurdsScientificProfile = { powersPresent: boolean; surdsPresent: boolean; scientificNotationPresent: boolean; rationalisationRequired: boolean; exactSimplificationRequired: boolean }; /* Stores powers/surds/scientific-notation structure. */
export type QuestionAlgebraProfile = { expansionRequired: boolean; factorisationRequired: boolean; completingSquareRequired: boolean; rationalExpressionPresent: boolean; changeOfSubjectRequired: boolean }; /* Stores algebraic manipulation structure. */
export type QuestionEquationProfile = { equationFamily: string; inequalityPresent: boolean; algebraicMethodRequired: boolean; repeatedSubstitutionInvalid: boolean; expectedSolutionCount: number | null; rejectedSolutionReason: string | null }; /* Stores equation/inequality structure. */
export type QuestionFunctionProfile = { functionFamily: string; functionNotationUsed: boolean; transformationParametersPresent: boolean; rootsRelevant: boolean; turningPointsRelevant: boolean; graphInterpretationRequired: boolean }; /* Stores function/graph structure. */
export type QuestionStatisticsProfile = { rawDataProvided: boolean; summaryStatisticsProvided: boolean; sampleSize: number | null; statisticsRequired: string[]; comparisonRequired: boolean; interpretationRequired: boolean }; /* Stores statistics structure. */
export type QuestionGeometryProfile = { geometryFamilies: string[]; dimensions: ("2D" | "3D")[]; compoundShapeOrSolid: boolean; similarityUsed: boolean; circleGeometryUsed: boolean; pythagorasUsed: boolean; areaRequired: boolean; volumeRequired: boolean; surfaceAreaRequired: boolean }; /* Stores geometry/measure structure. */
export type QuestionTrigonometryProfile = { trigFunctions: ("SIN" | "COS" | "TAN")[]; trigContext: "RIGHT_TRIANGLE" | "NON_RIGHT_TRIANGLE" | "EQUATION" | "GRAPH" | "PERIODIC_MODEL"; angleUnit: "DEGREES" | "RADIANS" | "GRADIANS"; domainStart: number | null; domainEnd: number | null; domainEndInclusive: boolean | null; quadrantReasoningRequired: boolean; inverseTrigRequired: boolean; multipleSolutionsRequired: boolean; exactTrigValuesRequired: boolean; sineRuleUsed: boolean; cosineRuleUsed: boolean; areaFormulaUsed: boolean; calculatorModeSensitive: boolean }; /* Stores trigonometry structure. */
export type QuestionBearingProfile = { bearingsPresent: boolean; threeFigureBearingsRequired: boolean; northReferenceRequired: boolean; clockwiseFromNorthReasoningRequired: boolean; scaleDrawingProhibited: boolean }; /* Stores bearing/navigation structure. */
export type QuestionCoordinateGeometryProfile = { coordinateDimension: "2D" | "3D"; midpointRequired: boolean; gradientRequired: boolean; distanceRequired: boolean; lineEquationRequired: boolean; perpendicularGradientRequired: boolean; coordinateVectorReasoningRequired: boolean }; /* Stores coordinate-geometry structure. */
export type QuestionVectorProfile = { vectorRepresentationTypes: string[]; vectorAdditionRequired: boolean; scalarMultipleRequired: boolean; magnitudeRequired: boolean; ratioOrSectionRequired: boolean; geometricVectorReasoningRequired: boolean; candidateDrawsVector: boolean }; /* Stores vector structure. */

export type QuestionSpecialisedProfiles = {                                                    /* Keeps one universal specialised-profile template. */
  arithmetic: CatalogValue<QuestionArithmeticProfile>;                                         /* Stores arithmetic evidence or explicit N/A. */
  percentage: CatalogValue<QuestionPercentageProfile>;                                         /* Stores percentage evidence or explicit N/A. */
  powersSurdsScientific: CatalogValue<QuestionPowersSurdsScientificProfile>;                   /* Stores powers/surds/scientific evidence or explicit N/A. */
  algebra: CatalogValue<QuestionAlgebraProfile>;                                                /* Stores algebra evidence or explicit N/A. */
  equationsInequalities: CatalogValue<QuestionEquationProfile>;                                /* Stores equation/inequality evidence or explicit N/A. */
  functionsGraphs: CatalogValue<QuestionFunctionProfile>;                                      /* Stores function/graph evidence or explicit N/A. */
  statistics: CatalogValue<QuestionStatisticsProfile>;                                         /* Stores statistics evidence or explicit N/A. */
  geometryMeasureCircleSimilarity: CatalogValue<QuestionGeometryProfile>;                      /* Stores geometry/measure evidence or explicit N/A. */
  trigonometry: CatalogValue<QuestionTrigonometryProfile>;                                      /* Stores trigonometry evidence or explicit N/A. */
  bearings: CatalogValue<QuestionBearingProfile>;                                               /* Stores bearing evidence or explicit N/A. */
  coordinateGeometry: CatalogValue<QuestionCoordinateGeometryProfile>;                          /* Stores coordinate-geometry evidence or explicit N/A. */
  vectors: CatalogValue<QuestionVectorProfile>;                                                 /* Stores vector evidence or explicit N/A. */
};                                                                                               /* Closes specialised profiles. */

// ============================================================================
// SECTION 16 — QUESTION FAMILY / SURFACE
// ============================================================================

export type QuestionFamilyProfile = {                                                           /* Opens family classification. */
  familyId: QuestionFamilyId;                                                                    /* Links to normalised Question family. */
  subFamilyId: string | null;                                                                    /* Links narrower sub-family. */
  familyConfidence: CatalogConfidence;                                                          /* Records confidence in family classification. */
  structuralSignature: string[];                                                                 /* Defines family membership mathematically. */
  surfaceStyleIds: string[];                                                                     /* Records observed presentation styles. */
  relatedFamilyIds: QuestionFamilyId[];                                                         /* Links neighbouring families. */
};                                                                                               /* Closes family profile. */

export type QuestionSurfaceProfile = {                                                          /* Opens broad surface/layout style. */
  abstractOrContextual: "ABSTRACT" | "CONTEXTUAL" | "MIXED";                                  /* Records contextualisation level. */
  proseAmount: "LOW" | "MEDIUM" | "HIGH";                                                     /* Rates amount of prose. */
  visualAmount: "NONE" | "LOW" | "MEDIUM" | "HIGH";                                         /* Rates amount of visual material. */
  layoutComplexity: "LOW" | "MEDIUM" | "HIGH";                                                /* Rates layout complexity. */
  informationOrderCanVarySafely: boolean;                                                      /* Records whether information order may change. */
  visualPlacementCanVarySafely: boolean;                                                       /* Records whether visual placement may change. */
};                                                                                               /* Closes surface profile. */

// ============================================================================
// SECTION 17 — GENERATION ANALYSIS
// ============================================================================

export type QuestionGenerationProfile = {                                                       /* Opens generator-facing derived knowledge. */
  readiness: CatalogGenerationReadiness;                                                        /* Records generation maturity. */
  linkedGeneratorFamilyIds: GeneratorFamilyId[];                                                /* Links relevant generator families. */
  invariantMathematics: string[];                                                               /* Lists mathematics that must remain invariant. */
  variableParameters: string[];                                                                 /* Lists values/features that may vary. */
  parameterConstraints: string[];                                                               /* Lists generator constraints. */
  safeContextVariations: string[];                                                              /* Lists safe context substitutions. */
  safeRepresentationVariations: string[];                                                       /* Lists safe presentation/visual variation. */
  unsafeVariations: string[];                                                                   /* Lists changes that break validity/family identity. */
  difficultyControls: string[];                                                                 /* Lists controlled demand levers. */
  requiredVisualCapabilities: string[];                                                         /* Lists renderer/asset capabilities needed. */
  requiredValidationChecks: string[];                                                           /* Lists generated-Question checks. */
  provenance: CatalogProvenance;                                                                /* Identifies this section as generation analysis. */
};                                                                                               /* Closes generation analysis. */

// ============================================================================
// SECTION 18 — SOURCE / COPYRIGHT ISOLATION
// ============================================================================

export type QuestionSourceIsolationProfile = CatalogSourceIsolationProfile & {                  /* Extends catalogue-wide source isolation. */
  generatorMayConsumeSourceLayoutCoordinates: false;                                            /* Prevents source coordinates being used as generated layout. */
  generatorMayConsumeHistoricalPromptWording: false;                                            /* Prevents historical prompt wording entering generators. */
  generatorMayConsumeSemanticStructure: true;                                                   /* Allows reviewed semantic structure to inform generation. */
};                                                                                               /* Closes source isolation. */

// ============================================================================
// SECTION 19 — COMPLETE QUESTION CATALOGUE ENTRY
// ============================================================================

export type QuestionCatalogEntry = {                                                            /* Opens one universal Question catalogue entry. */
  identity: QuestionCatalogIdentity;                                                             /* Stores permanent identity/linkage. */
  sourceLayout: QuestionSourceLayoutProfile;                                                     /* Stores source pages and response-space evidence. */
  structure: QuestionStructureProfile;                                                          /* Stores part/mark/dependency structure. */
  curriculum: QuestionCurriculumProfile;                                                        /* Stores Course Skill/Concept classification. */
  task: QuestionTaskProfile;                                                                     /* Stores task and response requirements. */
  mathematics: QuestionMathematicalStructureProfile;                                            /* Stores mathematical skeleton. */
  information: QuestionInformationItem[];                                                       /* Stores supplied information semantically. */
  reasoning: QuestionReasoningProfile;                                                          /* Stores reasoning and difficulty. */
  numbers: QuestionNumberProfile;                                                               /* Stores number-format/design evidence. */
  calculator?: QuestionCalculatorProfile;                                                       /* TRANSITION: restores Question-specific calculator demand. */
  parameterDesign: QuestionParameterDesignProfile;                                              /* Stores safe/unsafe parameter design. */
  constraints: QuestionConstraintProfile;                                                       /* Stores domain/context/method/presentation constraints. */
  answerSpecification: QuestionAnswerSpecification;                                             /* Stores Question-side answer requirements. */
  context: QuestionContextProfile;                                                              /* Stores real-world context characteristics. */
  language: QuestionLanguageProfile;                                                            /* Stores language and prompt construction. */
  visuals: CatalogValue<VisualEvidenceProfile>;                                                 /* Stores first-class visual evidence. */
  mathematicalModel: CatalogValue<QuestionMathematicalModelProfile>;                            /* Stores contextual-model profile or explicit N/A. */
  specialisedProfiles: QuestionSpecialisedProfiles;                                             /* Stores every specialised mathematical profile slot. */
  family: QuestionFamilyProfile;                                                                /* Stores family classification. */
  surface: QuestionSurfaceProfile;                                                              /* Stores broad surface/layout style. */
  generation: QuestionGenerationProfile;                                                       /* Stores generator-facing derived knowledge. */
  sourceIsolation: QuestionSourceIsolationProfile;                                             /* Enforces source/copyright isolation. */
  review: CatalogReviewProfile;                                                                 /* Stores review/validation state. */
};                                                                                               /* Closes universal Question entry. */

// ============================================================================
// SECTION 20 — VALIDATION INVARIANTS
// ============================================================================

export const QUESTION_CATALOG_VALIDATION_INVARIANTS = [                                         /* Documents non-negotiable catalogue rules. */
  "Question identity resolves to one paper context and one matching Answer Catalogue ID.",      /* Enforces Question ↔ paper/MS linkage. */
  "Question total marks equal the sum of Question-part marks.",                                 /* Enforces mark integrity. */
  "Canonical Skill IDs resolve in the Course Skills Tree.",                                    /* Prevents parallel historical taxonomies. */
  "Every specialised profile slot exists even when NOT_APPLICABLE.",                           /* Enforces the universal-template principle. */
  "Every visualElementId reference resolves in the Question visual profile.",                   /* Enforces visual referential integrity. */
  "A reviewed Question contains no required NOT_REVIEWED catalogue values.",                    /* Prevents incomplete reviewed entries. */
  "Generation analysis contains no verbatim historical prompt wording.",                        /* Enforces source separation. */
  "Generator-facing mathematics is derived from reviewed semantic structure rather than source layout.", /* Prevents visual/text copying. */
  "Parameter constraints prevent mathematically degenerate generated instances.",               /* Protects generator validity. */
  "Visual generation preserves semantic relationships while allowing original composition.",   /* Protects meaning and originality. */
  "PDF_RENDER response-space measurements record render DPI and pixel page dimensions.",        /* Protects comparability of physical spacing evidence. */
  "Measured response-space regions identify the Question parts they serve and the measurement boundary convention used.", /* Protects interpretation of spacing data. */
  "Where part-level standard/thinking profiles are populated, the overall Question profile must be compatible with their combined demand.", /* Protects demand classification. */
  "Calculator status describes the individual Question instance, not merely whether its source paper permits calculator use.", /* Keeps paper context distinct from Question burden. */
  "Compound-percentage multi-rate Questions preserve the mapping between each rate, multiplier and number of periods.", /* Prevents loss of stage structure. */
  "Prompt-structure analysis stores counts and paraphrased structural roles, never the full historical prompt text.", /* Retains linguistic evidence safely. */
] as const;                                                                                       /* Closes validation invariants. */
