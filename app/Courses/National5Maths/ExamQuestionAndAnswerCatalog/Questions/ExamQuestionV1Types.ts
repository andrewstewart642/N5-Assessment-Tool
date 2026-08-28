// ============================================================================
// CATALOGUE CONTRACT V1 — QUESTION CATALOGUE
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";                                      /* Uses the Course-owned course ID. */
import type { AssessmentTopicCode, Paper, SkillPaperSuitability } from "@/app/Assessments/AssessmentTypes"; /* Uses shared assessment types. */
import type {                                                                                     /* Opens catalogue-wide imports. */
  ExamCatalogueConfidence,                                                                       /* Reuses catalogue confidence levels. */
  ExamCatalogueEvidenceRef,                                                                      /* Reuses traceable source references. */
  ExamCatalogueProvenance,                                                                       /* Reuses source, catalogue, and generation provenance. */
  ExamCatalogueReviewProfile,                                                                    /* Reuses the common review record. */
  ExamCatalogueValue,                                                                            /* Reuses VALUE and non-value field states. */
  ExamPaperContextId,                                                                            /* Reuses the stable Paper Context ID. */
} from "../ExamCatalogTypes";                                                                    /* Closes catalogue-wide imports. */

// ============================================================================
// SECTION 1 — QUESTION CATALOGUE IDS
// ============================================================================

export type ExamQuestionId = string;                                                             /* Gives every catalogued Question a stable ID. */
export type ExamQuestionPartId = string;                                                         /* Gives every Question part a stable ID. */
export type ExamQuestionFamilyId = string;                                                       /* Links a Question to its normalised family. */
export type ExamQuestionVisualElementId = string;                                                /* Gives each visual element a stable local ID. */

// ============================================================================
// SECTION 2 — CATALOGUE IDENTITY
// ============================================================================

export type ExamQuestionIdentity = {                                                             /* Opens the permanent identity of a Question. */
  id: ExamQuestionId;                                                                            /* Gives the Question its stable catalogue ID. */
  schemaVersion: "CATALOGUE_V1";                                                                 /* Records the catalogue contract version. */
  courseId: CourseId;                                                                            /* Links the Question to its Course. */
  paperContextId: ExamPaperContextId;                                                            /* Links the Question to its paper context. */
  year: number;                                                                                  /* Records the source year for easy lookup. */
  paper: Paper;                                                                                  /* Records the source paper for easy lookup. */
  questionNumber: string;                                                                        /* Records the printed Question number. */
  markingSchemeId: string;                                                                       /* Links directly to the matching MS entry. */
};                                                                                               /* Closes the Question identity. */

// ============================================================================
// SECTION 2 — SOURCE LOCATION AND PAGE LAYOUT
// ============================================================================

export type ExamQuestionAnswerSpaceCategory =                                                    /* Groups the amount or form of answer space. */
  | "NONE"                                                                                       /* No dedicated answer space is provided. */
  | "VERY_SMALL"                                                                                 /* Only a very small written area is provided. */
  | "SMALL"                                                                                      /* A small written area is provided. */
  | "MEDIUM"                                                                                     /* A normal written area is provided. */
  | "LARGE"                                                                                      /* A large written area is provided. */
  | "FULL_PAGE"                                                                                  /* Most of a page is available. */
  | "GRAPH_GRID"                                                                                 /* A graph or coordinate grid is supplied. */
  | "DIAGRAM_RESPONSE"                                                                           /* The candidate responds on a diagram. */
  | "MIXED";                                                                                     /* More than one response surface is used. */

export type ExamQuestionAnswerSpace = {                                                          /* Opens answer-space evidence. */
  category: ExamQuestionAnswerSpaceCategory;                                                     /* Records the broad answer-space type. */
  estimatedLines: number | null;                                                                 /* Estimates useful writing lines when relevant. */
  responseSurfaceVisualIds: ExamQuestionVisualElementId[];                                       /* Links any supplied grids, axes, or diagrams used for answers. */
  notes: string | null;                                                                          /* Records anything unusual about the answer space. */
};                                                                                               /* Closes answer-space evidence. */

export type ExamQuestionSourceLayout = {                                                         /* Opens the Question's page and layout evidence. */
  sourcePages: number[];                                                                         /* Stores physical PDF pages containing the Question. */
  printedPageLabels: string[];                                                                   /* Stores printed page labels where useful. */
  continuesAcrossPages: boolean;                                                                 /* Records whether the Question continues onto another page. */
  answerSpace: ExamQuestionAnswerSpace;                                                          /* Stores the supplied response space. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                    /* Links the layout back to the source. */
};                                                                                               /* Closes source layout. */

// ============================================================================
// SECTION 2 — QUESTION AND PART STRUCTURE
// ============================================================================

export type ExamQuestionPartDependencyType =                                                     /* Describes how one part depends on another. */
  | "INDEPENDENT"                                                                                /* The part stands alone. */
  | "FOLLOW_ON"                                                                                  /* The part uses earlier work or results. */
  | "HENCE"                                                                                      /* The prompt explicitly directs use of an earlier result. */
  | "SHARED_SETUP"                                                                               /* Parts share information but need not use earlier answers. */
  | "MIXED";                                                                                     /* More than one dependency pattern is present. */

export type ExamQuestionPart = {                                                                 /* Opens one Question part. */
  id: ExamQuestionPartId;                                                                        /* Gives the part a stable ID. */
  label: string;                                                                                 /* Stores the printed part label. */
  marks: number;                                                                                 /* Records the marks available for this part. */
  skillIds: string[];                                                                            /* Links the part to Course-owned Skills. */
  conceptIds: string[];                                                                          /* Links the part to Course-owned Concepts. */
  topic: AssessmentTopicCode;                                                                    /* Records the main assessment topic. */
  commandTypes: ExamQuestionCommandType[];                                                       /* Records the task commands used in this part. */
  responseTypes: ExamQuestionResponseType[];                                                     /* Records the expected response forms. */
  dependsOnPartIds: ExamQuestionPartId[];                                                        /* Links any earlier parts this part depends on. */
};                                                                                               /* Closes the Question part. */

export type ExamQuestionStructureProfile = {                                                     /* Opens the Question's structural shape. */
  structureType: "SINGLE" | "MULTIPART";                                                         /* Records whether the Question has parts. */
  totalMarks: number;                                                                            /* Records the total marks available. */
  parts: ExamQuestionPart[];                                                                     /* Stores every part in source order. */
  dependencyType: ExamQuestionPartDependencyType;                                                /* Summarises the dependency pattern. */
  sharedStimulus: boolean;                                                                       /* Records whether parts share one setup. */
  sharedVisuals: boolean;                                                                        /* Records whether parts share visual material. */
  sharedGivenData: boolean;                                                                      /* Records whether parts share the same givens. */
  requiredResultProvided: boolean;                                                               /* Records whether the candidate must reach a stated result. */
};                                                                                               /* Closes the Question structure. */

// ============================================================================
// SECTION 2 — CURRICULUM CLASSIFICATION
// ============================================================================

export type ExamQuestionStandardProfile =                                                        /* Records the assessed standard profile. */
  | "C"                                                                                          /* Mainly Course-grade standard work. */
  | "A"                                                                                          /* Mainly higher-demand standard work. */
  | "C+A";                                                                                       /* Mixes both standard levels. */

export type ExamQuestionThinkingProfile =                                                        /* Records the broad thinking style. */
  | "OPERATIONAL"                                                                                /* Mainly carries out known procedures. */
  | "REASONING"                                                                                  /* Mainly requires selection, interpretation, or justification. */
  | "MIXED";                                                                                     /* Mixes operational and reasoning demand. */

export type ExamQuestionCurriculumProfile = {                                                    /* Opens the Course-owned curriculum links. */
  primaryTopic: AssessmentTopicCode;                                                             /* Records the main topic. */
  primarySkillId: string;                                                                        /* Records the main Course Skill. */
  secondarySkillIds: string[];                                                                   /* Records other assessed Skills. */
  primaryConceptId: string;                                                                      /* Records the main Course Concept. */
  conceptIds: string[];                                                                          /* Records all assessed Concepts. */
  paperSuitability: SkillPaperSuitability;                                                       /* Records the Course-owned paper suitability. */
  standardProfile: ExamQuestionStandardProfile;                                                  /* Records the assessed standard level. */
  thinkingProfile: ExamQuestionThinkingProfile;                                                  /* Records the broad thinking style. */
  crossSkillQuestion: boolean;                                                                   /* Records whether more than one Skill is materially assessed. */
  skillMarkDistribution: Record<string, number>;                                                 /* Records how marks are spread across Skills. */
  conceptMarkDistribution: Record<string, number>;                                               /* Records how marks are spread across Concepts. */
};                                                                                               /* Closes the curriculum profile. */

// ============================================================================
// SECTION 2 — TASK AND RESPONSE
// ============================================================================

export type ExamQuestionCommandType =                                                            /* Describes what the candidate is asked to do. */
  | "CALCULATE"                                                                                  /* Calculate a result. */
  | "EVALUATE"                                                                                   /* Evaluate an expression or function. */
  | "FIND"                                                                                       /* Find a requested mathematical object. */
  | "STATE"                                                                                      /* State a value or fact. */
  | "WRITE_DOWN"                                                                                 /* Write down an immediate result. */
  | "DETERMINE"                                                                                  /* Determine a property, value, or conclusion. */
  | "SOLVE"                                                                                      /* Solve an equation, inequality, or problem. */
  | "SIMPLIFY"                                                                                   /* Simplify an expression or value. */
  | "EXPRESS"                                                                                    /* Express an object in a requested form. */
  | "EXPAND"                                                                                     /* Expand an algebraic expression. */
  | "FACTORISE"                                                                                  /* Factorise an expression. */
  | "CHANGE_SUBJECT"                                                                             /* Rearrange a formula for a named variable. */
  | "SHOW_THAT"                                                                                  /* Reach a result already stated in the prompt. */
  | "JUSTIFY"                                                                                    /* Give mathematical reasoning for a conclusion. */
  | "COMPARE"                                                                                    /* Compare values, data, or mathematical objects. */
  | "COMMENT"                                                                                    /* Give a valid interpreted statement. */
  | "ESTIMATE"                                                                                   /* Produce an estimate from data or a model. */
  | "DRAW"                                                                                       /* Draw a mathematical response. */
  | "SKETCH"                                                                                     /* Sketch a graph, shape, or relationship. */
  | "CONSTRUCT"                                                                                  /* Construct a mathematical object. */
  | "IDENTIFY"                                                                                   /* Identify a feature or property. */
  | "COMPLETE"                                                                                   /* Complete a supplied representation. */
  | "PROVE"                                                                                      /* Provide a proof. */
  | "OTHER";                                                                                     /* Covers a rare command not listed above. */

export type ExamQuestionResponseType =                                                           /* Describes the form of the expected response. */
  | "NUMBER"                                                                                     /* A numerical value. */
  | "EXPRESSION"                                                                                 /* An algebraic or symbolic expression. */
  | "EQUATION"                                                                                   /* An equation. */
  | "INEQUALITY"                                                                                 /* An inequality. */
  | "COORDINATES"                                                                                /* One or more coordinate values. */
  | "VECTOR"                                                                                     /* A vector in any accepted representation. */
  | "GRAPH"                                                                                      /* A completed or created graph. */
  | "SKETCH"                                                                                     /* A sketch rather than an exact graph. */
  | "DIAGRAM_ANNOTATION"                                                                         /* Information added directly to a diagram. */
  | "DRAWN_VECTOR"                                                                               /* A vector drawn on a supplied grid or diagram. */
  | "WRITTEN_COMPARISON"                                                                         /* A written comparison of values or data. */
  | "JUSTIFICATION"                                                                              /* A written or mathematical justification. */
  | "CONCLUSION"                                                                                 /* A final interpreted decision or statement. */
  | "MIXED";                                                                                     /* More than one response form is required. */

export type ExamQuestionTaskProfile = {                                                          /* Opens the task and response requirements. */
  commandTypes: ExamQuestionCommandType[];                                                       /* Records every meaningful command. */
  responseTypes: ExamQuestionResponseType[];                                                     /* Records every required response form. */
  responseCount: number | null;                                                                  /* Records the number of separate final responses when fixed. */
  explicitMethodCue: boolean;                                                                    /* Records whether the prompt points to a method. */
  methodRestricted: boolean;                                                                     /* Records whether a particular method is required or excluded. */
  workingRequestedInPrompt: boolean;                                                             /* Records whether the prompt itself asks for working. */
  justificationRequested: boolean;                                                               /* Records whether justification is explicitly requested. */
  contextualConclusionRequested: boolean;                                                        /* Records whether a context-based conclusion is requested. */
};                                                                                               /* Closes the task profile. */

// ============================================================================
// SECTION 2 — MATHEMATICAL STRUCTURE
// ============================================================================

export type ExamQuestionOperationType =                                                          /* Records mathematical operations used in the solution. */
  | "ADD"                                                                                        /* Addition is materially used. */
  | "SUBTRACT"                                                                                   /* Subtraction is materially used. */
  | "MULTIPLY"                                                                                   /* Multiplication is materially used. */
  | "DIVIDE"                                                                                     /* Division is materially used. */
  | "SIMPLIFY"                                                                                   /* Simplification is materially used. */
  | "EXPAND"                                                                                     /* Expansion is materially used. */
  | "FACTORISE"                                                                                  /* Factorisation is materially used. */
  | "SUBSTITUTE"                                                                                 /* Substitution is materially used. */
  | "REARRANGE"                                                                                  /* Rearrangement is materially used. */
  | "SOLVE"                                                                                      /* Solving is materially used. */
  | "EVALUATE"                                                                                   /* Evaluation is materially used. */
  | "INTERPRET"                                                                                  /* Interpretation is materially used. */
  | "CONSTRUCT"                                                                                  /* Construction is materially used. */
  | "COMPARE"                                                                                    /* Comparison is materially used. */
  | "PROVE"                                                                                      /* Proof is materially used. */
  | "OTHER";                                                                                     /* Covers an operation not listed above. */

export type ExamQuestionRepresentationTransition = {                                             /* Opens one change of mathematical representation. */
  from: string;                                                                                  /* Records the starting representation. */
  to: string;                                                                                    /* Records the resulting representation. */
  purpose: string;                                                                               /* Briefly explains why the change matters. */
};                                                                                               /* Closes the representation transition. */

export type ExamQuestionMathematicalStructureProfile = {                                         /* Opens the mathematical skeleton of the Question. */
  primaryGoal: string;                                                                           /* Gives a short normalised description of the mathematical target. */
  operationTypes: ExamQuestionOperationType[];                                                   /* Records the main operations needed. */
  requiredFormulaIds: string[];                                                                  /* Links any formulas that matter. */
  requiredTheoremIds: string[];                                                                  /* Links any theorems or rules that matter. */
  stageCount: number;                                                                            /* Counts meaningful dependent solution stages. */
  intermediateQuantityTypes: string[];                                                           /* Records important quantities found before the final answer. */
  methodSelectionRequired: boolean;                                                              /* Records whether the candidate must choose a method. */
  solutionCountExpected: number | null;                                                          /* Records the expected number of valid final solutions. */
  validitySelectionRequired: boolean;                                                            /* Records whether invalid mathematical answers must be rejected. */
  representationTransitions: ExamQuestionRepresentationTransition[];                             /* Records important changes between representations. */
};                                                                                               /* Closes the mathematical structure profile. */

// ============================================================================
// SECTION 2 — INFORMATION AND REASONING DEMAND
// ============================================================================

export type ExamQuestionInformationSource =                                                      /* Records where a useful fact comes from. */
  | "TEXT"                                                                                       /* The written prompt provides it. */
  | "DIAGRAM"                                                                                    /* A diagram provides it. */
  | "GRAPH"                                                                                      /* A graph provides it. */
  | "TABLE"                                                                                      /* A table or list provides it. */
  | "PREVIOUS_PART"                                                                              /* An earlier part provides it. */
  | "FORMULA_SHEET"                                                                              /* The supplied formula list provides it. */
  | "COURSE_KNOWLEDGE";                                                                          /* The candidate is expected to know it. */

export type ExamQuestionInformationExplicitness =                                                /* Records how directly a fact is supplied. */
  | "EXPLICIT"                                                                                   /* The source states or labels the fact directly. */
  | "IMPLIED"                                                                                    /* The source shows the fact without stating it directly. */
  | "MUST_INFER";                                                                                /* The candidate must work it out from other information. */

export type ExamQuestionInformationRole =                                                        /* Records the job a fact plays in the Question. */
  | "GIVEN_VALUE"                                                                                /* A supplied numerical or symbolic value. */
  | "RELATIONSHIP"                                                                               /* A supplied mathematical relationship. */
  | "CONSTRAINT"                                                                                 /* A restriction on valid work or answers. */
  | "FORMULA"                                                                                    /* A formula available to use. */
  | "CONTEXT"                                                                                    /* Information that defines the real-world setting. */
  | "TARGET";                                                                                    /* Information that defines what must be found. */

export type ExamQuestionInformationItem = {                                                      /* Opens one meaningful item of Question information. */
  id: string;                                                                                    /* Gives the information item a stable local ID. */
  informationType: string;                                                                       /* Describes the kind of information. */
  normalisedContent: string;                                                                     /* Stores the fact in short paraphrased or mathematical form. */
  value: number | string | null;                                                                 /* Stores the important value or relationship when one exists. */
  unit: string | null;                                                                           /* Stores the matching unit when relevant. */
  source: ExamQuestionInformationSource;                                                         /* Records where the information comes from. */
  explicitness: ExamQuestionInformationExplicitness;                                             /* Records whether it is stated, shown, or inferred. */
  role: ExamQuestionInformationRole;                                                             /* Records what the information is used for. */
  visualElementId: ExamQuestionVisualElementId | null;                                           /* Links a fact to its visual when relevant. */
};                                                                                               /* Closes the information item. */

export type ExamQuestionReasoningType =                                                          /* Records distinct kinds of reasoning demand. */
  | "DIRECT_PROCEDURE"                                                                           /* Apply a familiar procedure directly. */
  | "REVERSE_REASONING"                                                                          /* Work backwards from a later or final value. */
  | "METHOD_SELECTION"                                                                           /* Choose an appropriate mathematical method. */
  | "INFORMATION_MARSHALLING"                                                                    /* Combine facts from different places. */
  | "MULTI_STAGE"                                                                                /* Complete dependent stages in sequence. */
  | "REPRESENTATION_TRANSLATION"                                                                 /* Move between different mathematical forms. */
  | "JUSTIFICATION"                                                                              /* Explain why a result or conclusion is valid. */
  | "COMPARISON_INTERPRETATION"                                                                  /* Interpret and compare mathematical information. */
  | "VALIDATION"                                                                                 /* Check whether a statement or condition is satisfied. */
  | "STRUCTURE_RECOGNITION"                                                                      /* Recognise a mathematical pattern or structure. */
  | "SOLUTION_FILTERING"                                                                         /* Select valid answers from mathematical candidates. */
  | "DERIVATION";                                                                                /* Build a required equation, result, or relationship. */

export type ExamQuestionDemandLevel =                                                            /* Gives a simple relative demand rating. */
  | "VERY_LOW"                                                                                   /* Very little demand in this dimension. */
  | "LOW"                                                                                        /* Limited demand in this dimension. */
  | "MEDIUM"                                                                                     /* Moderate demand in this dimension. */
  | "HIGH"                                                                                       /* High demand in this dimension. */
  | "VERY_HIGH";                                                                                 /* Very high demand in this dimension. */

export type ExamQuestionReasoningProfile = {                                                     /* Opens the reasoning-demand profile. */
  reasoningTypes: ExamQuestionReasoningType[];                                                   /* Records all meaningful reasoning types. */
  overallDifficulty: ExamQuestionDemandLevel;                                                    /* Gives a broad overall difficulty judgement. */
  methodSelectionLoad: ExamQuestionDemandLevel;                                                  /* Rates the burden of choosing a method. */
  arithmeticLoad: ExamQuestionDemandLevel;                                                       /* Rates the numerical workload. */
  algebraicLoad: ExamQuestionDemandLevel;                                                        /* Rates the algebraic workload. */
  representationLoad: ExamQuestionDemandLevel;                                                   /* Rates the difficulty of reading or changing representations. */
  reasoningDepth: ExamQuestionDemandLevel;                                                       /* Rates the depth of reasoning required. */
  dependencyCount: number;                                                                       /* Counts meaningful dependencies in the solution. */
};                                                                                               /* Closes the reasoning profile. */

// ============================================================================
// SECTION 2 — NUMBER AND PARAMETER DESIGN
// ============================================================================

export type ExamQuestionNumberType =                                                             /* Records the types of values present in the mathematics. */
  | "INTEGER"                                                                                    /* Whole-number values. */
  | "DECIMAL"                                                                                    /* Decimal values. */
  | "FRACTION"                                                                                   /* Fractional values. */
  | "PERCENTAGE"                                                                                 /* Percentage values. */
  | "SURD"                                                                                       /* Surd values. */
  | "POWER"                                                                                      /* Values involving powers. */
  | "SCIENTIFIC_NOTATION"                                                                        /* Values written in scientific notation. */
  | "PI"                                                                                         /* Values involving pi. */
  | "EXACT_TRIG_VALUE"                                                                           /* Exact trigonometric values. */
  | "NEGATIVE"                                                                                   /* Negative values are materially present. */
  | "ALGEBRAIC";                                                                                 /* Algebraic values or coefficients are present. */

export type ExamQuestionNumberProfile = {                                                        /* Opens the broad number profile. */
  numberTypes: ExamQuestionNumberType[];                                                         /* Records the kinds of values used. */
  nonCalculatorFriendly: boolean;                                                                /* Records whether the arithmetic is naturally manageable without a calculator. */
  exactAndApproximateMixed: boolean;                                                             /* Records whether exact and approximate values mix in one solution. */
  magnitudeNotes: string | null;                                                                 /* Briefly records unusual value size when useful. */
};                                                                                               /* Closes the number profile. */

export type ExamQuestionParameterDesignProfile = {                                               /* Opens generator-facing analysis of the chosen values. */
  deliberatelyConstructedValues: boolean;                                                        /* Records whether values appear chosen to force useful mathematics. */
  exactResultDesigned: boolean;                                                                  /* Records whether the values produce an exact result by design. */
  roundingDesigned: boolean;                                                                     /* Records whether the values deliberately require rounding. */
  factorisableDesigned: boolean;                                                                 /* Records whether factorisation-friendly values are deliberate. */
  perfectSquareDesigned: boolean;                                                                /* Records whether a perfect square is deliberately produced. */
  pythagoreanTripleUsed: boolean;                                                                /* Records whether a Pythagorean triple is built in. */
  niceRatioUsed: boolean;                                                                        /* Records whether a convenient ratio is deliberately used. */
  validSolutionCountDesigned: number | null;                                                     /* Records a deliberately controlled number of valid solutions. */
  parameterConstraints: string[];                                                                /* Records rules future generators must respect. */
  safeVariationAxes: string[];                                                                   /* Records values or features that may safely vary. */
  invariantRelationships: string[];                                                              /* Records relationships that must stay fixed. */
};                                                                                               /* Closes parameter-design analysis. */

// ============================================================================
// SECTION 2 — ANSWER SPECIFICATION
// ============================================================================

export type ExamQuestionAnswerForm =                                                             /* Records the required final answer form. */
  | "EXACT"                                                                                      /* An exact value or form is required. */
  | "APPROXIMATE"                                                                                /* A rounded or approximate value is required. */
  | "SYMBOLIC"                                                                                   /* A symbolic expression or equation is required. */
  | "GRAPHICAL"                                                                                  /* A graph, sketch, or drawn response is required. */
  | "PROSE"                                                                                      /* A written statement is required. */
  | "MIXED";                                                                                     /* More than one final-answer form is required. */

export type ExamQuestionPrecisionType =                                                          /* Records how final precision is controlled. */
  | "NONE"                                                                                       /* No explicit precision rule applies. */
  | "DECIMAL_PLACES"                                                                             /* A number of decimal places is required. */
  | "SIGNIFICANT_FIGURES"                                                                        /* A number of significant figures is required. */
  | "NEAREST_UNIT"                                                                               /* A named nearest unit is required. */
  | "ACCEPTED_RANGE";                                                                            /* Any value inside an accepted range is valid. */

export type ExamQuestionUnitProfile = {                                                          /* Opens the expected unit information. */
  dimension: string | null;                                                                      /* Records the physical quantity type, such as length or area. */
  unitSymbol: string | null;                                                                     /* Records the expected unit symbol when relevant. */
  conversionRequired: boolean;                                                                   /* Records whether units must be converted. */
  unitsExplicitlyRequested: boolean;                                                             /* Records whether the prompt explicitly asks for units. */
};                                                                                               /* Closes the unit profile. */

export type ExamQuestionAnswerSpecification = {                                                  /* Opens the required final-answer rules. */
  answerForm: ExamQuestionAnswerForm;                                                            /* Records the broad answer form. */
  simplestFormRequired: boolean;                                                                 /* Records whether simplest form is explicitly required. */
  rationalDenominatorRequired: boolean;                                                          /* Records whether a rational denominator is explicitly required. */
  positivePowersRequired: boolean;                                                               /* Records whether powers must be positive. */
  scientificNotationRequired: boolean;                                                           /* Records whether scientific notation is required. */
  precisionType: ExamQuestionPrecisionType;                                                      /* Records the kind of precision rule. */
  precisionValue: number | null;                                                                 /* Stores the requested precision amount when relevant. */
  units: ExamQuestionUnitProfile;                                                                /* Stores unit expectations. */
  multipleAnswersRequired: number | null;                                                        /* Records a fixed number of final answers when required. */
  domainRestriction: string | null;                                                              /* Stores a normalised answer domain when relevant. */
  contextualWordsRequired: boolean;                                                              /* Records whether the final response must mention the context. */
  coordinateOrderRelevant: boolean;                                                              /* Records whether coordinate order affects correctness. */
  bracketsRelevant: boolean;                                                                     /* Records whether brackets are part of the accepted representation. */
};                                                                                               /* Closes the answer specification. */

// ============================================================================
// SECTION 2 — CONTEXT AND LANGUAGE
// ============================================================================

export type ExamQuestionContextRole =                                                            /* Records how important the real-world context is. */
  | "NONE"                                                                                       /* No real-world context is used. */
  | "SURFACE_ONLY"                                                                               /* The story can change without changing the mathematics. */
  | "MATHEMATICALLY_RELEVANT"                                                                    /* The context affects interpretation or validity. */
  | "MODEL_DEFINING";                                                                            /* The context defines the mathematical model itself. */

export type ExamQuestionContextProfile = {                                                       /* Opens the real-world context profile. */
  contextualised: boolean;                                                                       /* Records whether the Question uses a real-world setting. */
  contextDomain: string | null;                                                                  /* Gives a broad domain such as finance, sport, or travel. */
  contextRole: ExamQuestionContextRole;                                                          /* Records how strongly the context matters mathematically. */
  namedPeoplePresent: boolean;                                                                   /* Records whether named people are used. */
  currencyPresent: boolean;                                                                      /* Records whether money is part of the context. */
  realWorldUnitsPresent: boolean;                                                                /* Records whether real-world units are used. */
  realismConstrainsAnswer: boolean;                                                              /* Records whether unrealistic mathematical answers must be rejected. */
};                                                                                               /* Closes the context profile. */

export type ExamQuestionLanguageProfile = {                                                      /* Opens the language and wording profile. */
  informationDensity: ExamQuestionDemandLevel;                                                   /* Rates how densely information is presented. */
  scaffoldingLevel: ExamQuestionDemandLevel;                                                     /* Rates how much the wording guides the method. */
  bulletStructureUsed: boolean;                                                                  /* Records whether key givens are arranged as bullets. */
  naturalLanguageInterpretationRequired: boolean;                                                /* Records whether wording must be translated into mathematics. */
  promptSummary: string;                                                                         /* Gives a short paraphrased summary without copying the source wording. */
  styleNotes: string | null;                                                                     /* Records useful wording observations that do not fit elsewhere. */
};                                                                                               /* Closes the language profile. */

// ============================================================================
// SECTION 2 — VISUAL EVIDENCE
// ============================================================================

export type ExamQuestionVisualType =                                                             /* Describes the kind of visual material. */
  | "MATHEMATICAL_DIAGRAM"                                                                       /* A general mathematical diagram. */
  | "GEOMETRIC_DIAGRAM"                                                                          /* A geometry-focused diagram. */
  | "COORDINATE_DIAGRAM"                                                                         /* A coordinate-based diagram. */
  | "GRAPH"                                                                                      /* A plotted mathematical graph. */
  | "SCATTERGRAPH"                                                                               /* A scattergraph. */
  | "DATA_DISPLAY"                                                                               /* A chart or other data display. */
  | "TABLE"                                                                                      /* A table or structured data list. */
  | "NUMBER_LINE"                                                                                /* A number line. */
  | "COORDINATE_GRID"                                                                            /* A coordinate grid used for reading or drawing. */
  | "RESPONSE_GRID"                                                                              /* A grid mainly supplied for the candidate's response. */
  | "AXES"                                                                                       /* Empty or partly completed axes. */
  | "CONTEXT_ILLUSTRATION"                                                                       /* A contextual drawing or schematic picture. */
  | "PHOTO_OR_REALISTIC_IMAGE"                                                                   /* A photograph or realistic picture. */
  | "ICON_OR_SYMBOL"                                                                             /* A small supporting icon or symbol. */
  | "HYBRID";                                                                                    /* A visual combining several roles. */

export type ExamQuestionVisualRole =                                                             /* Records why a visual is present. */
  | "ESSENTIAL_DATA"                                                                             /* Required information exists in the visual. */
  | "STRUCTURAL_MODEL"                                                                           /* The visual shows mathematical relationships. */
  | "SUPPORTIVE"                                                                                 /* The visual helps but is not essential. */
  | "CONTEXTUAL"                                                                                 /* The visual establishes the setting. */
  | "DECORATIVE"                                                                                 /* The visual is not mathematically relevant. */
  | "RESPONSE_SURFACE"                                                                           /* The candidate writes, draws, or plots on it. */
  | "MIXED";                                                                                     /* The visual has more than one important role. */

export type ExamQuestionVisualDependency =                                                       /* Records how much the solution depends on a visual. */
  | "REQUIRED"                                                                                   /* The Question cannot be solved fully without it. */
  | "PARTIALLY_REQUIRED"                                                                         /* Some but not all required information comes from it. */
  | "REDUNDANT_WITH_TEXT"                                                                        /* The same useful information is also written in the prompt. */
  | "NOT_REQUIRED";                                                                              /* The visual can be ignored without losing mathematical information. */

export type ExamQuestionVisualInteraction =                                                      /* Records what the candidate does with the visual. */
  | "READ_ONLY"                                                                                  /* Read or inspect only. */
  | "ANNOTATE"                                                                                   /* Add labels, values, or marks. */
  | "COMPLETE"                                                                                   /* Complete part of the supplied visual. */
  | "DRAW"                                                                                       /* Draw a new object on the supplied surface. */
  | "PLOT";                                                                                      /* Plot points or a graph. */

export type ExamQuestionVisualTextRelationship =                                                 /* Records how visual information relates to the wording. */
  | "VISUAL_ONLY"                                                                                /* Important information appears only visually. */
  | "PARTLY_DUPLICATED"                                                                          /* Some information is repeated in the text. */
  | "FULLY_DUPLICATED"                                                                           /* The text repeats all mathematically useful visual information. */
  | "CONTEXT_ONLY";                                                                              /* The visual mainly supplies setting rather than mathematical facts. */

export type ExamQuestionVisualLayoutProfile = {                                                  /* Opens the layout description of one visual. */
  pageNumber: number;                                                                            /* Records the physical PDF page. */
  pagePosition: "TOP" | "MIDDLE" | "BOTTOM" | "FULL_PAGE";                                       /* Records the visual's broad page position. */
  relativeWidth: "SMALL" | "MEDIUM" | "LARGE" | "FULL_WIDTH";                                    /* Records the visual's approximate width. */
  relativeHeight: "SMALL" | "MEDIUM" | "LARGE" | "FULL_HEIGHT";                                  /* Records the visual's approximate height. */
  orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE" | "IRREGULAR";                                /* Records the visual's general shape. */
};                                                                                               /* Closes the visual layout profile. */

export type ExamQuestionVisualFactType =                                                         /* Describes a mathematical fact carried by a visual. */
  | "VALUE"                                                                                      /* A labelled value appears. */
  | "MEASUREMENT"                                                                                /* A length, angle, area, or other measurement appears. */
  | "RELATIONSHIP"                                                                               /* A mathematical relationship is shown. */
  | "POSITION"                                                                                   /* Relative position or order matters. */
  | "DIRECTION"                                                                                  /* Direction or orientation matters. */
  | "SHAPE_PROPERTY"                                                                             /* A shape property is shown. */
  | "DATA_POINT"                                                                                 /* A plotted or tabulated data value appears. */
  | "REGION"                                                                                     /* A region, sector, or shaded area matters. */
  | "AXIS_PROPERTY"                                                                              /* An axis label, scale, or interval matters. */
  | "OTHER";                                                                                     /* Covers a visual fact not listed above. */

export type ExamQuestionVisualSemanticFact = {                                                   /* Opens one fact communicated by a visual. */
  id: string;                                                                                    /* Gives the visual fact a stable local ID. */
  factType: ExamQuestionVisualFactType;                                                          /* Records the kind of fact. */
  entities: string[];                                                                            /* Names the mathematical objects involved. */
  normalisedFact: string;                                                                        /* Gives a short paraphrased description of the fact. */
  value: number | string | null;                                                                 /* Stores a useful value when one exists. */
  unit: string | null;                                                                           /* Stores the matching unit when relevant. */
  alsoPresentInText: boolean;                                                                    /* Records whether the wording repeats the fact. */
  essentialForSolution: boolean;                                                                 /* Records whether the fact is needed to solve the Question. */
};                                                                                               /* Closes the visual fact. */

export type ExamQuestionDiagramRelationshipType =                                                /* Describes common relationships shown in diagrams. */
  | "EQUAL_LENGTH"                                                                               /* Two or more lengths are equal. */
  | "PARALLEL"                                                                                   /* Lines are parallel. */
  | "PERPENDICULAR"                                                                              /* Lines are perpendicular. */
  | "TANGENT"                                                                                    /* A line is tangent to a circle. */
  | "RADIUS"                                                                                     /* A segment is a radius. */
  | "DIAMETER"                                                                                   /* A segment is a diameter. */
  | "CHORD"                                                                                      /* A segment is a chord. */
  | "MIDPOINT"                                                                                   /* A point is a midpoint. */
  | "SIMILAR"                                                                                    /* Shapes are mathematically similar. */
  | "REGULAR"                                                                                    /* A polygon is regular. */
  | "COLLINEAR"                                                                                  /* Points lie on one straight line. */
  | "VECTOR_DIRECTION"                                                                           /* A directed segment represents a vector. */
  | "OTHER";                                                                                     /* Covers another diagram relationship. */

export type ExamQuestionDiagramProfile = {                                                       /* Opens the semantic description of a mathematical diagram. */
  dimension: "2D" | "3D";                                                                        /* Records whether the diagram represents 2D or 3D mathematics. */
  mathematicalObjects: string[];                                                                 /* Lists the main shapes, lines, or objects shown. */
  labelledPoints: string[];                                                                      /* Lists named points or vertices. */
  labelledMeasurements: string[];                                                                /* Summarises labelled lengths, angles, or other values. */
  relationships: ExamQuestionDiagramRelationshipType[];                                          /* Records mathematical relationships shown. */
  shadedRegionsPresent: boolean;                                                                 /* Records whether a shaded region matters. */
  rightAngleMarkersPresent: boolean;                                                             /* Records whether right-angle markers are drawn. */
  arrowsPresent: boolean;                                                                        /* Records whether mathematical direction arrows are shown. */
  dashedOrHiddenLinesPresent: boolean;                                                           /* Records whether dashed or hidden construction lines are used. */
  intendedToScale: boolean;                                                                      /* Records whether scale is intended to be mathematically meaningful. */
  inferredFactsRequired: boolean;                                                                /* Records whether the candidate must infer unlabelled relationships. */
};                                                                                               /* Closes the diagram profile. */

export type ExamQuestionGraphFamily =                                                            /* Records the mathematical family of a graph. */
  | "STRAIGHT_LINE"                                                                              /* A straight-line graph. */
  | "PARABOLA"                                                                                   /* A quadratic graph. */
  | "SINE"                                                                                       /* A sine graph. */
  | "COSINE"                                                                                     /* A cosine graph. */
  | "SCATTER"                                                                                    /* A scattergraph. */
  | "OTHER";                                                                                     /* Another graph family. */

export type ExamQuestionGraphAxisProfile = {                                                     /* Opens one graph axis description. */
  variable: string | null;                                                                       /* Records the variable shown on the axis. */
  label: string | null;                                                                          /* Records a short normalised axis label. */
  unit: string | null;                                                                           /* Records the unit shown on the axis. */
  numericScaleShown: boolean;                                                                    /* Records whether a numeric scale is visible. */
  interval: number | null;                                                                       /* Records a regular tick interval when known. */
};                                                                                               /* Closes the graph axis profile. */

export type ExamQuestionGraphProfile = {                                                         /* Opens the semantic description of a graph. */
  graphFamily: ExamQuestionGraphFamily;                                                          /* Records the graph family. */
  xAxis: ExamQuestionGraphAxisProfile;                                                           /* Records the horizontal axis. */
  yAxis: ExamQuestionGraphAxisProfile;                                                           /* Records the vertical axis. */
  originShown: boolean;                                                                          /* Records whether the origin is shown. */
  gridShown: boolean;                                                                            /* Records whether grid lines are shown. */
  domainShown: string | null;                                                                    /* Records the displayed domain when useful. */
  rangeShown: string | null;                                                                     /* Records the displayed range when useful. */
  labelledPoints: string[];                                                                      /* Records important labelled points. */
  keyFeatures: string[];                                                                         /* Records roots, turning points, intercepts, or similar features. */
  bestFitLinePresent: boolean;                                                                   /* Records whether a line of best fit is shown. */
  candidateMustReadValues: boolean;                                                              /* Records whether values must be read from the graph. */
  candidateMustInferShape: boolean;                                                              /* Records whether graph shape carries information. */
  accuracyExpectation: "SCHEMATIC" | "APPROXIMATE" | "ACCURATE";                                 /* Records how accurately the graph is intended to be read or produced. */
};                                                                                               /* Closes the graph profile. */

export type ExamQuestionContextImageReplaceability =                                             /* Records how freely a contextual image can be replaced. */
  | "VISUAL_REQUIRED"                                                                            /* Some visual representation is genuinely needed. */
  | "ORIGINAL_EQUIVALENT_REQUIRED"                                                               /* A new original image with the same mathematical job is needed. */
  | "SCHEMATIC_REPLACEMENT_ACCEPTABLE"                                                           /* A simple original schematic would be enough. */
  | "CONTEXT_ONLY_REPLACEMENT_ACCEPTABLE"                                                        /* Any suitable original context image would work. */
  | "VISUAL_CAN_BE_OMITTED";                                                                     /* A generated Question need not include an image. */

export type ExamQuestionContextImageProfile = {                                                  /* Opens the description of a contextual picture. */
  subjectCategory: string;                                                                       /* Gives a broad subject such as vehicle, building, or object. */
  primaryObject: string;                                                                         /* Names the main object in simple generic terms. */
  sceneType: string;                                                                             /* Gives a short description of the scene type. */
  viewpoint: string | null;                                                                      /* Records viewpoint only when it affects interpretation. */
  measurementsOverlaid: boolean;                                                                 /* Records whether measurements are written on the image. */
  labelsOverlaid: boolean;                                                                       /* Records whether mathematical labels are written on the image. */
  orientationRelevant: boolean;                                                                  /* Records whether the object's orientation matters. */
  relativePositionRelevant: boolean;                                                             /* Records whether the positions of objects matter. */
  scaleRelevant: boolean;                                                                        /* Records whether apparent scale matters mathematically. */
  replaceability: ExamQuestionContextImageReplaceability;                                        /* Records how a future original image may replace it. */
  originalGenerationBrief: string | null;                                                        /* Gives a generic brief for an original replacement without copying the source. */
};                                                                                               /* Closes the context-image profile. */

export type ExamQuestionTableProfile = {                                                         /* Opens the description of a table or listed dataset. */
  rowCount: number | null;                                                                        /* Records the number of data rows when useful. */
  columnCount: number | null;                                                                     /* Records the number of columns when useful. */
  headingsPresent: boolean;                                                                      /* Records whether headings are shown. */
  unitsPresent: boolean;                                                                         /* Records whether units appear in the table. */
  orderMatters: boolean;                                                                          /* Records whether row or value order matters. */
  candidateReadsDataDirectly: boolean;                                                           /* Records whether the candidate must extract values from it. */
};                                                                                               /* Closes the table profile. */

export type ExamQuestionResponseSurfaceProfile = {                                               /* Opens a supplied visual used for the candidate's response. */
  surfaceType: "GRID" | "AXES" | "DIAGRAM" | "TABLE" | "OTHER";                                  /* Records the kind of response surface. */
  candidateAction: ExamQuestionVisualInteraction;                                                /* Records what the candidate must add. */
  accuracyRequired: boolean;                                                                     /* Records whether placement or scale must be accurate. */
  rulerExpected: boolean;                                                                        /* Records whether straight-edge accuracy is expected. */
};                                                                                               /* Closes the response-surface profile. */

export type ExamQuestionVisualElement = {                                                        /* Opens one distinct visual element. */
  id: ExamQuestionVisualElementId;                                                               /* Gives the visual a stable local ID. */
  visualType: ExamQuestionVisualType;                                                            /* Records the kind of visual. */
  roles: ExamQuestionVisualRole[];                                                               /* Records every meaningful job the visual performs. */
  mathematicalDependency: ExamQuestionVisualDependency;                                         /* Records how much solving depends on it. */
  candidateInteraction: ExamQuestionVisualInteraction;                                          /* Records how the candidate uses it. */
  textRelationship: ExamQuestionVisualTextRelationship;                                         /* Records how visual facts relate to the wording. */
  informationDensity: ExamQuestionDemandLevel;                                                   /* Rates how much useful information the visual carries. */
  layout: ExamQuestionVisualLayoutProfile;                                                       /* Stores broad source-layout information. */
  semanticFacts: ExamQuestionVisualSemanticFact[];                                               /* Stores mathematical facts carried by the visual. */
  diagramProfile: ExamCatalogueValue<ExamQuestionDiagramProfile>;                                /* Stores diagram details when this visual is a diagram. */
  graphProfile: ExamCatalogueValue<ExamQuestionGraphProfile>;                                    /* Stores graph details when this visual is a graph. */
  contextImageProfile: ExamCatalogueValue<ExamQuestionContextImageProfile>;                       /* Stores picture details when this visual is contextual. */
  tableProfile: ExamCatalogueValue<ExamQuestionTableProfile>;                                    /* Stores table details when this visual is tabular. */
  responseSurfaceProfile: ExamCatalogueValue<ExamQuestionResponseSurfaceProfile>;                /* Stores response-surface details when the candidate writes or draws on it. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                    /* Links the visual description back to the source. */
};                                                                                               /* Closes the visual element. */

export type ExamQuestionVisualEvidenceProfile = {                                                /* Opens all visual evidence for the Question. */
  elements: ExamQuestionVisualElement[];                                                         /* Stores visual elements in source order. */
  visualCount: number;                                                                           /* Records the total number of distinct visuals. */
  containsEssentialVisualData: boolean;                                                          /* Records whether any required data exists only visually. */
  containsResponseSurface: boolean;                                                              /* Records whether any visual is used for the candidate's response. */
};                                                                                               /* Closes the visual evidence profile. */

// ============================================================================
// SECTION 2 — MATHEMATICAL MODEL
// ============================================================================

export type ExamQuestionMathematicalModelProfile = {                                             /* Opens a contextual mathematical-model description. */
  modelFamily: string;                                                                            /* Names the model family, such as linear or cosine. */
  normalisedModel: string;                                                                        /* Stores the supplied model in compact mathematical form. */
  independentVariable: string;                                                                    /* Records what the input variable represents. */
  dependentVariable: string;                                                                      /* Records what the output variable represents. */
  physicalOrContextDomain: string | null;                                                         /* Records the meaningful real-world domain. */
  modelProvidedToCandidate: boolean;                                                              /* Records whether the model is supplied. */
  candidateMustConstructModel: boolean;                                                           /* Records whether the candidate must build the model. */
  candidateMustInterpretModel: boolean;                                                           /* Records whether model meaning matters to the task. */
  solveForIndependentVariable: boolean;                                                           /* Records whether the task solves backwards for the input. */
  targetDependentValueProvided: boolean;                                                          /* Records whether a target output value is given. */
  verticalShiftValue: number | null;                                                              /* Stores the vertical shift when the model has one. */
  amplitudeValue: number | null;                                                                  /* Stores the signed amplitude coefficient when relevant. */
  phaseShiftValue: number | null;                                                                 /* Stores the phase shift when the model has one. */
  periodValue: number | null;                                                                     /* Stores the model period when it is meaningful. */
  modelParameters: Record<string, number | string>;                                               /* Stores any other important named model parameters. */
};                                                                                               /* Closes the mathematical-model profile. */

// ============================================================================
// SECTION 2 — SPECIALISED MATHEMATICAL PROFILES
// ============================================================================

export type ExamQuestionArithmeticProfile = {                                                    /* Opens arithmetic-specific metadata. */
  arithmeticComplexity: ExamQuestionDemandLevel;                                                 /* Rates the arithmetic burden. */
  commonDenominatorRequired: boolean;                                                            /* Records whether a common denominator is needed. */
  cancellationAvailable: boolean;                                                                /* Records whether cancellation is a natural method. */
  simplificationRequired: boolean;                                                               /* Records whether simplification is part of the task. */
};                                                                                               /* Closes the arithmetic profile. */

export type ExamQuestionPercentageProfile = {                                                    /* Opens percentage-specific metadata. */
  relationshipType: "INCREASE" | "DECREASE" | "PART_OF_WHOLE" | "REVERSE" | "COMPOUND";          /* Records the percentage relationship. */
  percentageValues: number[];                                                                    /* Records the percentage rates used. */
  multiplierValues: number[];                                                                    /* Records matching decimal multipliers where relevant. */
  periods: number | null;                                                                        /* Records repeated periods for compound change. */
  originalValueKnown: boolean;                                                                   /* Records whether the starting value is supplied. */
  finalValueKnown: boolean;                                                                      /* Records whether the later value is supplied. */
  reverseCalculationRequired: boolean;                                                           /* Records whether the candidate works back to an original value. */
};                                                                                               /* Closes the percentage profile. */

export type ExamQuestionPowersSurdsScientificProfile = {                                         /* Opens powers, surds, and scientific-notation metadata. */
  powersPresent: boolean;                                                                        /* Records whether index laws are used. */
  surdsPresent: boolean;                                                                         /* Records whether surds are used. */
  scientificNotationPresent: boolean;                                                            /* Records whether scientific notation is used. */
  rationalisationRequired: boolean;                                                              /* Records whether a denominator must be rationalised. */
  exactSimplificationRequired: boolean;                                                          /* Records whether an exact simplified form is required. */
};                                                                                               /* Closes the powers, surds, and scientific-notation profile. */

export type ExamQuestionAlgebraProfile = {                                                       /* Opens algebraic-manipulation metadata. */
  expansionRequired: boolean;                                                                    /* Records whether brackets must be expanded. */
  factorisationRequired: boolean;                                                                /* Records whether factorisation is required. */
  completingSquareRequired: boolean;                                                             /* Records whether completing the square is required. */
  rationalExpressionPresent: boolean;                                                            /* Records whether algebraic fractions are present. */
  changeOfSubjectRequired: boolean;                                                              /* Records whether a formula must be rearranged. */
};                                                                                               /* Closes the algebra profile. */

export type ExamQuestionEquationProfile = {                                                      /* Opens equation and inequality metadata. */
  equationFamily: string;                                                                         /* Names the equation family in simple terms. */
  inequalityPresent: boolean;                                                                    /* Records whether the task is an inequality. */
  algebraicMethodRequired: boolean;                                                              /* Records whether an algebraic method is explicitly required. */
  repeatedSubstitutionInvalid: boolean;                                                          /* Records whether guess-and-check is specifically unsuitable. */
  expectedSolutionCount: number | null;                                                          /* Records the intended number of mathematical solutions. */
  rejectedSolutionReason: string | null;                                                         /* Records why a mathematical solution may be invalid. */
};                                                                                               /* Closes the equation profile. */

export type ExamQuestionFunctionProfile = {                                                      /* Opens function and graph-function metadata. */
  functionFamily: string;                                                                         /* Names the function family. */
  functionNotationUsed: boolean;                                                                 /* Records whether function notation is used. */
  transformationParametersPresent: boolean;                                                      /* Records whether transformed graph parameters are assessed. */
  rootsRelevant: boolean;                                                                        /* Records whether roots matter. */
  turningPointsRelevant: boolean;                                                                /* Records whether turning points matter. */
};                                                                                               /* Closes the function profile. */

export type ExamQuestionStatisticsProfile = {                                                    /* Opens statistics-specific metadata. */
  rawDataProvided: boolean;                                                                      /* Records whether raw values are supplied. */
  summaryStatisticsProvided: boolean;                                                            /* Records whether summary values are supplied. */
  sampleSize: number | null;                                                                     /* Records the sample size when relevant. */
  statisticsRequired: string[];                                                                  /* Lists the statistics the candidate must find. */
  comparisonRequired: boolean;                                                                   /* Records whether two data sets must be compared. */
  interpretationRequired: boolean;                                                               /* Records whether a written interpretation is required. */
};                                                                                               /* Closes the statistics profile. */

export type ExamQuestionGeometryProfile = {                                                      /* Opens geometry and measure metadata. */
  geometryFamilies: string[];                                                                    /* Lists the main geometry families involved. */
  dimensions: ("2D" | "3D")[];                                                                   /* Records whether 2D, 3D, or both are involved. */
  compoundShapeOrSolid: boolean;                                                                 /* Records whether several shapes or solids combine. */
  similarityUsed: boolean;                                                                       /* Records whether similarity is used. */
  circleGeometryUsed: boolean;                                                                   /* Records whether circle properties are used. */
  areaRequired: boolean;                                                                         /* Records whether an area is required. */
  volumeRequired: boolean;                                                                       /* Records whether a volume is required. */
};                                                                                               /* Closes the geometry profile. */

export type ExamQuestionTrigonometryProfile = {                                                  /* Opens trigonometry-specific metadata. */
  trigFunctions: ("SIN" | "COS" | "TAN")[];                                                      /* Records the trig functions used. */
  trigContext: "RIGHT_TRIANGLE" | "NON_RIGHT_TRIANGLE" | "EQUATION" | "GRAPH" | "PERIODIC_MODEL"; /* Records the main trig setting. */
  angleUnit: "DEGREES" | "RADIANS" | "GRADIANS";                                                 /* Records the intended angle unit. */
  domainStart: number | null;                                                                    /* Records the lower angle bound when relevant. */
  domainEnd: number | null;                                                                      /* Records the upper angle bound when relevant. */
  domainEndInclusive: boolean | null;                                                            /* Records whether the upper bound is included. */
  isolatedTrigValue: string | null;                                                              /* Stores the normalised trig value after rearranging. */
  inverseTrigRequired: boolean;                                                                  /* Records whether an inverse trig function is needed. */
  quadrantReasoningRequired: boolean;                                                            /* Records whether quadrants control valid solutions. */
  expectedSolutionQuadrants: ("I" | "II" | "III" | "IV")[];                                      /* Records the quadrants containing valid solutions. */
  secondSolutionRequired: boolean;                                                               /* Records whether another solution must be found from symmetry. */
  targetTrigValueSign: "NEGATIVE" | "ZERO" | "POSITIVE" | null;                                  /* Records the sign of the isolated trig value when relevant. */
  radGradSensitivity: boolean;                                                                   /* Records whether wrong calculator angle mode is a realistic marking issue. */
};                                                                                               /* Closes the trigonometry profile. */

export type ExamQuestionCoordinateGeometryProfile = {                                            /* Opens coordinate-geometry metadata. */
  dimensions: "2D" | "3D";                                                                       /* Records whether the coordinates are 2D or 3D. */
  gradientRequired: boolean;                                                                     /* Records whether a gradient is required. */
  lineEquationRequired: boolean;                                                                 /* Records whether an equation of a line is required. */
  distanceRequired: boolean;                                                                     /* Records whether a coordinate distance is required. */
  midpointRequired: boolean;                                                                     /* Records whether a midpoint is required. */
};                                                                                               /* Closes the coordinate-geometry profile. */

export type ExamQuestionVectorProfile = {                                                        /* Opens vector-specific metadata. */
  dimensions: "2D" | "3D";                                                                       /* Records the vector dimension. */
  componentFormUsed: boolean;                                                                    /* Records whether component notation is used. */
  journeyMethodRelevant: boolean;                                                                /* Records whether vector journeys are useful. */
  scalingRequired: boolean;                                                                      /* Records whether scalar multiplication is required. */
  additionOrSubtractionRequired: boolean;                                                        /* Records whether vectors are combined. */
  drawnResponseRequired: boolean;                                                                /* Records whether the candidate must draw a vector. */
};                                                                                               /* Closes the vector profile. */

export type ExamQuestionSpecialisedProfiles = {                                                  /* Opens all specialised mathematical profile slots. */
  arithmetic: ExamCatalogueValue<ExamQuestionArithmeticProfile>;                                 /* Stores arithmetic metadata when relevant. */
  percentage: ExamCatalogueValue<ExamQuestionPercentageProfile>;                                 /* Stores percentage metadata when relevant. */
  powersSurdsScientific: ExamCatalogueValue<ExamQuestionPowersSurdsScientificProfile>;            /* Stores powers, surds, or scientific-notation metadata when relevant. */
  algebra: ExamCatalogueValue<ExamQuestionAlgebraProfile>;                                       /* Stores algebra metadata when relevant. */
  equation: ExamCatalogueValue<ExamQuestionEquationProfile>;                                     /* Stores equation or inequality metadata when relevant. */
  function: ExamCatalogueValue<ExamQuestionFunctionProfile>;                                     /* Stores function metadata when relevant. */
  statistics: ExamCatalogueValue<ExamQuestionStatisticsProfile>;                                 /* Stores statistics metadata when relevant. */
  geometry: ExamCatalogueValue<ExamQuestionGeometryProfile>;                                     /* Stores geometry metadata when relevant. */
  trigonometry: ExamCatalogueValue<ExamQuestionTrigonometryProfile>;                             /* Stores trigonometry metadata when relevant. */
  coordinateGeometry: ExamCatalogueValue<ExamQuestionCoordinateGeometryProfile>;                 /* Stores coordinate-geometry metadata when relevant. */
  vectors: ExamCatalogueValue<ExamQuestionVectorProfile>;                                        /* Stores vector metadata when relevant. */
};                                                                                               /* Closes the specialised profile collection. */

// ============================================================================
// SECTION 2 — QUESTION FAMILY
// ============================================================================

export type ExamQuestionFamilyProfile = {                                                        /* Opens the normalised Question-family classification. */
  familyId: ExamQuestionFamilyId;                                                                /* Links to the main Question family. */
  subFamilyId: string | null;                                                                    /* Links to a narrower family when useful. */
  familyConfidence: ExamCatalogueConfidence;                                                     /* Records confidence in the family classification. */
  structuralSignature: string[];                                                                 /* Lists the mathematical features that define family membership. */
  surfaceStyleIds: string[];                                                                     /* Links observed presentation styles. */
  relatedFamilyIds: ExamQuestionFamilyId[];                                                      /* Links nearby or related Question families. */
};                                                                                               /* Closes the Question-family profile. */

// ============================================================================
// SECTION 2 — GENERATION ANALYSIS
// ============================================================================

export type ExamQuestionGenerationReadiness =                                                    /* Records how ready the evidence is for generation work. */
  | "NOT_READY"                                                                                  /* The catalogue evidence is not yet sufficient. */
  | "PARTIAL"                                                                                    /* Some useful generation knowledge has been reviewed. */
  | "READY_FOR_PROTOTYPE"                                                                        /* Enough evidence exists to build a first generator. */
  | "READY_FOR_PRODUCTION";                                                                      /* The family has strong reviewed generation evidence. */

export type ExamQuestionGenerationProfile = {                                                    /* Opens generator-facing knowledge derived from the Question. */
  readiness: ExamQuestionGenerationReadiness;                                                    /* Records how mature the generation evidence is. */
  linkedGeneratorFamilyIds: string[];                                                            /* Links any existing or planned generator families. */
  invariantMathematics: string[];                                                                /* Lists mathematical features that must stay unchanged. */
  variableParameters: string[];                                                                  /* Lists values or features a generator may vary. */
  parameterConstraints: string[];                                                                /* Lists rules generated values must satisfy. */
  safeContextVariations: string[];                                                               /* Lists context changes that preserve the mathematics. */
  safeRepresentationVariations: string[];                                                        /* Lists visual or representation changes that remain valid. */
  unsafeVariations: string[];                                                                    /* Lists changes that would break the Question family. */
  difficultyControls: string[];                                                                  /* Lists features that can intentionally change demand. */
  requiredValidationChecks: string[];                                                            /* Lists checks every generated Question should pass. */
  provenance: ExamCatalogueProvenance;                                                           /* Marks this section as derived generation analysis. */
};                                                                                               /* Closes generation analysis. */

// ============================================================================
// SECTION 17 — COMPLETE QUESTION CATALOGUE ENTRY
// ============================================================================

export type ExamQuestionCatalogEntry = {                                                         /* Opens the universal Question Catalogue entry. */
  identity: ExamQuestionIdentity;                                                                /* Stores permanent IDs and links. */
  sourceLayout: ExamQuestionSourceLayout;                                                        /* Stores source pages and answer-space evidence. */
  structure: ExamQuestionStructureProfile;                                                       /* Stores Question-part structure and dependencies. */
  curriculum: ExamQuestionCurriculumProfile;                                                     /* Stores Course-owned Skill and Concept links. */
  task: ExamQuestionTaskProfile;                                                                 /* Stores what the candidate is asked to do. */
  mathematics: ExamQuestionMathematicalStructureProfile;                                        /* Stores the mathematical skeleton. */
  information: ExamQuestionInformationItem[];                                                    /* Stores meaningful givens, constraints, and inferred facts. */
  reasoning: ExamQuestionReasoningProfile;                                                       /* Stores reasoning and workload demand. */
  numbers: ExamQuestionNumberProfile;                                                            /* Stores the broad number profile. */
  parameterDesign: ExamQuestionParameterDesignProfile;                                           /* Stores generator-facing value-design analysis. */
  answerSpecification: ExamQuestionAnswerSpecification;                                         /* Stores required final-answer form and precision. */
  context: ExamQuestionContextProfile;                                                           /* Stores the real-world context profile. */
  language: ExamQuestionLanguageProfile;                                                         /* Stores wording and scaffolding observations. */
  visuals: ExamCatalogueValue<ExamQuestionVisualEvidenceProfile>;                                /* Stores rich visual metadata without storing copyrighted artwork. */
  mathematicalModel: ExamCatalogueValue<ExamQuestionMathematicalModelProfile>;                   /* Stores contextual model metadata when relevant. */
  specialisedProfiles: ExamQuestionSpecialisedProfiles;                                          /* Stores all domain-specific metadata slots. */
  family: ExamQuestionFamilyProfile;                                                             /* Stores the normalised Question-family classification. */
  generation: ExamQuestionGenerationProfile;                                                     /* Stores reviewed generation-facing knowledge. */
  review: ExamCatalogueReviewProfile;                                                             /* Stores the shared catalogue review record. */
};                                                                                               /* Closes the universal Question Catalogue entry. */