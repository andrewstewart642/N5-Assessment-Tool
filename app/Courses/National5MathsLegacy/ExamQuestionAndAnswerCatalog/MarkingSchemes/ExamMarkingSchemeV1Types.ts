// ============================================================================
// CATALOGUE CONTRACT V1 — MARKING SCHEME CATALOGUE
// ============================================================================

import type { CourseId } from "@/app/Courses/CourseTypes";                                        /* Uses the Course-owned course ID. */
import type { Paper } from "@/app/Assessments/AssessmentTypes";                                   /* Uses the shared paper type. */
import type {                                                                                      /* Opens catalogue-wide imports. */
  ExamCatalogueConfidence,                                                                        /* Reuses catalogue confidence levels. */
  ExamCatalogueEvidenceRef,                                                                       /* Reuses traceable source references. */
  ExamCatalogueProvenance,                                                                        /* Reuses source, catalogue, and generation provenance. */
  ExamCatalogueReviewProfile,                                                                     /* Reuses the common review record. */
  ExamCatalogueValue,                                                                             /* Reuses VALUE and non-value field states. */
  ExamGeneralMarkingPolicyId,                                                                      /* Reuses the stable general marking-policy ID. */
  ExamPaperContextId,                                                                              /* Reuses the stable Paper Context ID. */
} from "../ExamCatalogTypes";                                                                      /* Closes catalogue-wide imports. */
import type {                                                                                      /* Opens Question-owned imports. */
  ExamQuestionFamilyId,                                                                            /* Reuses the Question-family ID. */
  ExamQuestionId,                                                                                  /* Reuses the linked Question ID. */
  ExamQuestionPartId,                                                                              /* Reuses stable Question-part IDs. */
  ExamQuestionResponseType,                                                                        /* Reuses the Question response types. */
  ExamQuestionUnitProfile,                                                                         /* Reuses unit information. */
  ExamQuestionVisualElementId,                                                                      /* Reuses visual element IDs. */
} from "../Questions/ExamQuestionV1Types";                                                        /* Closes Question-owned imports. */

// ============================================================================
// SECTION 1 — MARKING SCHEME IDENTITY
// ============================================================================

export type ExamMarkingSchemeId = string;                                                         /* Gives every catalogued MS a stable ID. */
export type ExamMarkId = string;                                                                  /* Gives every individual mark a stable ID. */
export type ExamMarkingMethodId = string;                                                         /* Gives every method pathway a stable ID. */
export type ExamMarkingRuleId = string;                                                           /* Gives every marking rule a stable ID. */
export type ExamCommonResponseId = string;                                                        /* Gives every common-response pattern a stable ID. */
export type ExamSharedMarkingRuleId = string;                                                     /* Gives every shared rule a stable ID. */

export type ExamMarkingSchemeIdentity = {                                                        /* Opens the permanent identity of an MS entry. */
  id: ExamMarkingSchemeId;                                                                        /* Gives the MS its stable catalogue ID. */
  schemaVersion: "CATALOGUE_V1";                                                                  /* Records the catalogue contract version. */
  sourceQuestionId: ExamQuestionId;                                                               /* Links directly to the matching Question entry. */
  courseId: CourseId;                                                                             /* Links the MS to its Course. */
  paperContextId: ExamPaperContextId;                                                             /* Links the MS to the matching paper context. */
  year: number;                                                                                   /* Records the source year for easy lookup. */
  paper: Paper;                                                                                   /* Records the source paper for easy lookup. */
  questionNumber: string;                                                                         /* Records the printed Question number. */
  questionFamilyId: ExamQuestionFamilyId;                                                        /* Links the MS to the Question's normalised family. */
};                                                                                                /* Closes the MS identity. */

// ============================================================================
// SECTION 2 — SOURCE MARKING CONTEXT
// ============================================================================

export type ExamMarkingSchemeSourceContext = {                                                   /* Opens the Question-specific source context for this MS. */
  totalMarks: number;                                                                             /* Records the total marks available for the Question. */
  sourcePages: number[];                                                                          /* Stores physical PDF pages containing this Question's marking guidance. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links directly to the source marking pages. */
};                                                                                                /* Closes the source marking context. */

// ============================================================================
// SECTION 3 — EXPECTED RESPONSE
// ============================================================================

export type ExamExpectedAnswerForm =                                                             /* Records the broad form of an accepted final answer. */
  | "NUMBER"                                                                                      /* A numerical value. */
  | "EXPRESSION"                                                                                  /* An algebraic or symbolic expression. */
  | "EQUATION"                                                                                    /* An equation. */
  | "INEQUALITY"                                                                                  /* An inequality. */
  | "COORDINATES"                                                                                 /* One or more coordinate values. */
  | "VECTOR"                                                                                      /* A vector response. */
  | "GRAPHICAL"                                                                                   /* A graph, sketch, or drawn response. */
  | "PROSE"                                                                                       /* A written statement or conclusion. */
  | "MIXED";                                                                                      /* More than one answer form is needed. */

export type ExamExpectedPrecisionType =                                                          /* Records how accepted precision is controlled. */
  | "NONE"                                                                                        /* No special precision rule applies. */
  | "DECIMAL_PLACES"                                                                              /* A fixed number of decimal places is required. */
  | "SIGNIFICANT_FIGURES"                                                                         /* A fixed number of significant figures is required. */
  | "NEAREST_UNIT"                                                                                /* A named nearest unit is required. */
  | "RANGE";                                                                                      /* Any value inside an accepted range is allowed. */

export type ExamExpectedAnswerVariant = {                                                        /* Opens one accepted form of the final answer. */
  id: string;                                                                                     /* Gives the answer variant a stable local ID. */
  normalisedAnswer: string;                                                                       /* Stores a short normalised answer without copying source prose. */
  numericValue: number | null;                                                                    /* Stores a numeric value when one exists. */
  answerForm: ExamExpectedAnswerForm;                                                             /* Records the form of this answer. */
  notes: string | null;                                                                           /* Records any small acceptance detail. */
};                                                                                                /* Closes the accepted answer variant. */

export type ExamMarkingSchemeExpectedResponse = {                                                /* Opens the complete expected-response profile. */
  responseTypes: ExamQuestionResponseType[];                                                     /* Reuses the response forms expected by the Question. */
  canonicalAnswer: ExamExpectedAnswerVariant;                                                    /* Stores the main normalised final answer. */
  acceptedEquivalentForms: ExamExpectedAnswerVariant[];                                          /* Stores materially different accepted forms. */
  precisionType: ExamExpectedPrecisionType;                                                       /* Records the final precision rule. */
  precisionValue: number | null;                                                                  /* Stores the precision amount when relevant. */
  acceptedRange: { min: number; max: number } | null;                                            /* Stores a numeric tolerance range when relevant. */
  units: ExamQuestionUnitProfile;                                                                 /* Stores the expected unit treatment. */
  requiredContextStatement: boolean;                                                              /* Records whether a meaningful context statement is needed. */
  answerCountRequired: number | null;                                                             /* Records how many final answers are required when fixed. */
  invalidRelatedValues: string[];                                                                 /* Records plausible but unacceptable mathematical values. */
};                                                                                                /* Closes the expected-response profile. */

// ============================================================================
// SECTION 4 — MARK TYPES AND EVIDENCE
// ============================================================================

export type ExamMarkType =                                                                       /* Describes the main purpose of an individual mark. */
  | "METHOD"                                                                                      /* Rewards choosing or setting up a valid method. */
  | "PROCESS"                                                                                     /* Rewards carrying out a mathematical process. */
  | "ACCURACY"                                                                                    /* Rewards a correct value or result. */
  | "INTERPRETATION"                                                                              /* Rewards interpreting mathematical information. */
  | "REPRESENTATION"                                                                              /* Rewards a correct graph, diagram, vector, or representation. */
  | "COMMUNICATION"                                                                               /* Rewards mathematically meaningful communication. */
  | "CONCLUSION"                                                                                  /* Rewards a valid final decision or conclusion. */
  | "ROUNDING"                                                                                    /* Rewards correct final rounding. */
  | "UNITS"                                                                                       /* Rewards required units where the scheme makes them mark-bearing. */
  | "PRESENTATION"                                                                                /* Rewards a required mathematical form or notation. */
  | "SELECTION"                                                                                   /* Rewards choosing valid solutions or rejecting invalid ones. */
  | "JUSTIFICATION"                                                                               /* Rewards reasoning that supports a claim. */
  | "OTHER";                                                                                      /* Covers a rare mark purpose not listed above. */

export type ExamMarkEvidenceLocation =                                                          /* Records where acceptable evidence may appear. */
  | "WORKING"                                                                                     /* Evidence appears in written working. */
  | "FINAL_ANSWER"                                                                                /* Evidence appears in the final answer. */
  | "DIAGRAM"                                                                                     /* Evidence is written or shown on a diagram. */
  | "GRAPH"                                                                                       /* Evidence is shown on a graph. */
  | "GRID"                                                                                        /* Evidence is drawn on a supplied grid. */
  | "PREVIOUS_PART"                                                                               /* Evidence appears in an earlier part. */
  | "LATER_PART"                                                                                  /* Evidence appears in a later part. */
  | "ANYWHERE_IN_QUESTION";                                                                       /* Evidence may appear anywhere in the Question response. */

export type ExamMarkEvidenceCondition = {                                                       /* Opens one condition that can satisfy a mark. */
  id: string;                                                                                     /* Gives the condition a stable local ID. */
  evidenceSummary: string;                                                                        /* Gives a short human-friendly description of what is enough. */
  acceptedLocations: ExamMarkEvidenceLocation[];                                                 /* Records where the evidence may appear. */
  mayBeImpliedByLaterWork: boolean;                                                               /* Records whether later work can prove this step happened. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the condition back to the source MS. */
};                                                                                                /* Closes the evidence condition. */

// ============================================================================
// SECTION 5 — MARK DEPENDENCIES AND FOLLOW-THROUGH
// ============================================================================

export type ExamMarkDependencyType =                                                            /* Describes how one mark relates to earlier evidence. */
  | "REQUIRES_MARK"                                                                               /* A named earlier mark must be established. */
  | "REQUIRES_EVIDENCE"                                                                           /* A named mathematical step must be visible or implied. */
  | "CONSISTENT_WITH_EARLIER_RESULT"                                                              /* Later work must follow the candidate's earlier result. */
  | "IMPLIED_BY_LATER_EVIDENCE"                                                                   /* Later work can establish the earlier step. */
  | "FOLLOW_THROUGH_FROM"                                                                         /* The mark can survive an earlier error. */
  | "INDEPENDENT_OF"                                                                              /* The mark remains independent of another mark. */
  | "BLOCKED_BY_ERROR"                                                                            /* A stated error makes the mark unavailable. */
  | "REQUIRES_VALID_METHOD";                                                                      /* The mark only exists inside a valid method. */

export type ExamMarkDependency = {                                                               /* Opens one relationship between marks or evidence. */
  type: ExamMarkDependencyType;                                                                  /* Records the dependency type. */
  relatedMarkIds: ExamMarkId[];                                                                   /* Links the marks involved. */
  conditionSummary: string | null;                                                                /* Briefly explains any extra condition. */
};                                                                                                /* Closes the mark dependency. */

export type ExamFollowThroughProfile = {                                                         /* Opens follow-through rules for one mark. */
  allowed: boolean;                                                                               /* Records whether follow-through is available. */
  fromMarkIds: ExamMarkId[];                                                                      /* Records the earlier marks or errors it can follow. */
  requiresComparableDifficulty: boolean;                                                         /* Records whether later work must remain suitably demanding. */
  blockedForRequiredResult: boolean;                                                              /* Records whether a stated-result task blocks follow-through. */
  blockedByInvalidMathematicalState: boolean;                                                     /* Records whether impossible mathematics blocks follow-through. */
  notes: string | null;                                                                           /* Records an unusual follow-through detail. */
};                                                                                                /* Closes the follow-through profile. */

// ============================================================================
// SECTION 6 — MARK NODE
// ============================================================================

export type ExamMarkNode = {                                                                     /* Opens one individual available mark. */
  id: ExamMarkId;                                                                                 /* Gives the mark a stable ID. */
  markNumber: number;                                                                             /* Records the source order of the mark. */
  markValue: 1;                                                                                   /* Records that each N5 mark is worth one mark. */
  questionPartId: ExamQuestionPartId;                                                             /* Links the mark to its Question part. */
  primaryType: ExamMarkType;                                                                      /* Records the main purpose of the mark. */
  secondaryTypes: ExamMarkType[];                                                                 /* Records any additional mark purposes. */
  genericPurpose: string;                                                                         /* Gives a short normalised description of what the mark rewards. */
  skillIds: string[];                                                                             /* Links the mark to Course-owned Skills. */
  conceptIds: string[];                                                                           /* Links the mark to Course-owned Concepts. */
  requiredEvidence: ExamMarkEvidenceCondition[];                                                  /* Stores the acceptable evidence conditions. */
  dependencies: ExamMarkDependency[];                                                             /* Stores relationships with other marks. */
  followThrough: ExamFollowThroughProfile;                                                        /* Stores follow-through behaviour. */
  eligibilityConditions: string[];                                                                /* Lists conditions that must be true before this mark is available. */
  blockingConditions: string[];                                                                   /* Lists conditions that make this mark unavailable. */
  methodFamilyIds: ExamMarkingMethodId[];                                                         /* Links methods capable of earning this mark. */
  presentationConditions: string[];                                                               /* Lists exact-form, unit, notation, or presentation conditions. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the mark back to source marking evidence. */
  confidence: ExamCatalogueConfidence;                                                           /* Records confidence in the normalised mark interpretation. */
};                                                                                                /* Closes the mark node. */

// ============================================================================
// SECTION 7 — METHOD PATHWAYS
// ============================================================================

export type ExamMethodEvidenceRole =                                                             /* Records how a method appears in the source MS. */
  | "PRIMARY_ILLUSTRATIVE"                                                                        /* The main illustrated method. */
  | "ILLUSTRATIVE_ALTERNATIVE"                                                                    /* Another fully illustrated valid method. */
  | "FULL_CREDIT_ALTERNATIVE"                                                                     /* A valid full-credit method described more briefly. */
  | "PARTIAL_METHOD_EVIDENCE"                                                                     /* A method shown mainly through partial-credit guidance. */
  | "GENERIC_VALID_METHOD";                                                                       /* A valid method supported by generic marking guidance. */

export type ExamMethodStep = {                                                                   /* Opens one mathematical step in a method pathway. */
  id: string;                                                                                     /* Gives the step a stable local ID. */
  order: number;                                                                                  /* Records the step order within this pathway. */
  subgoal: string;                                                                                /* Gives a short normalised mathematical subgoal. */
  linkedMarkIds: ExamMarkId[];                                                                    /* Links marks that this step can earn. */
  dependsOnStepIds: string[];                                                                     /* Links earlier steps this step depends on. */
};                                                                                                /* Closes the method step. */

export type ExamMethodPathway = {                                                                /* Opens one valid solution route. */
  id: ExamMarkingMethodId;                                                                        /* Gives the method a stable ID. */
  variantId: string | null;                                                                       /* Stores a narrower source-specific route when useful. */
  evidenceRole: ExamMethodEvidenceRole;                                                          /* Records how strongly the source documents the method. */
  supportsFullCredit: boolean;                                                                    /* Records whether this route can earn full marks. */
  applicabilityConditions: string[];                                                              /* Lists conditions needed for the method to be valid. */
  steps: ExamMethodStep[];                                                                        /* Stores the method's ordered mathematical steps. */
  markMappingComplete: boolean;                                                                   /* Records whether every mark on this route is mapped. */
  alternativeEquivalentMethodIds: ExamMarkingMethodId[];                                         /* Links methods that are mathematically equivalent for marking. */
  excludedMethodReasons: string[];                                                                /* Records why tempting methods are invalid or restricted. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the pathway back to source evidence. */
};                                                                                                /* Closes the method pathway. */

// ============================================================================
// SECTION 8 — CORRECT ANSWER WITHOUT WORKING
// ============================================================================

export type ExamAnswerOnlyTreatment =                                                            /* Records the source treatment of a correct answer with no working. */
  | "FULL_CREDIT"                                                                                 /* The correct answer alone earns every mark. */
  | "PARTIAL_CREDIT"                                                                              /* The correct answer alone earns some marks. */
  | "NO_CREDIT"                                                                                   /* The correct answer alone earns no marks. */
  | "NOT_STATED";                                                                                 /* The source gives no clear answer-only rule. */

export type ExamCorrectAnswerWithoutWorking = {                                                  /* Opens answer-only treatment. */
  treatment: ExamAnswerOnlyTreatment;                                                            /* Records the broad treatment. */
  marksAwarded: number | null;                                                                    /* Records the exact award when known. */
  markIdsAwarded: ExamMarkId[];                                                                   /* Links marks that can be earned from the answer alone. */
  notes: string | null;                                                                           /* Records a short exceptional detail. */
};                                                                                                /* Closes answer-only treatment. */

// ============================================================================
// SECTION 9 — WORKING AND EVIDENCE POLICY
// ============================================================================

export type ExamWorkingEvidencePolicy = {                                                        /* Opens Question-specific rules about visible working. */
  correctAnswerWithoutWorking: ExamCorrectAnswerWithoutWorking;                                  /* Stores answer-only treatment. */
  workingMandatoryForMarkIds: ExamMarkId[];                                                       /* Lists marks that need process evidence. */
  workingMayBeImpliedForMarkIds: ExamMarkId[];                                                    /* Lists marks whose evidence can be inferred from later work. */
  diagramWorkCanScore: boolean;                                                                   /* Records whether working on a diagram can earn marks. */
  graphWorkCanScore: boolean;                                                                     /* Records whether working on a graph can earn marks. */
  laterPartCanSupplyEvidence: boolean;                                                            /* Records whether later parts can evidence earlier marks. */
  earlierPartCanSupplyEvidence: boolean;                                                          /* Records whether earlier parts can evidence later marks. */
  repeatedSubstitutionAccepted: boolean;                                                          /* Records whether guess-and-check can count as a valid method. */
};                                                                                                /* Closes the working and evidence policy. */

// ============================================================================
// SECTION 10 — PRECISION, UNITS, NOTATION, AND PRESENTATION
// ============================================================================

export type ExamPresentationRequirement =                                                       /* Records the strength of a presentation rule. */
  | "REQUIRED_FOR_MARK"                                                                           /* The presentation directly controls a mark. */
  | "REQUIRED_FOR_FULL_CREDIT"                                                                    /* Full marks need the presentation. */
  | "ACCEPTED_VARIATION"                                                                          /* The variation is explicitly acceptable. */
  | "DO_NOT_PENALISE"                                                                             /* The issue should not lose marks here. */
  | "NOT_RELEVANT";                                                                               /* The rule does not apply to this Question. */

export type ExamPrecisionPolicy = {                                                              /* Opens final and intermediate precision rules. */
  finalPrecisionType: ExamExpectedPrecisionType;                                                 /* Records the required final precision type. */
  finalPrecisionValue: number | null;                                                             /* Stores the requested precision amount. */
  acceptedFinalRange: { min: number; max: number } | null;                                       /* Stores an accepted numeric range when relevant. */
  prematureRoundingAllowed: boolean;                                                              /* Records whether early rounding can still earn full marks. */
  minimumIntermediatePrecision: string | null;                                                    /* Records any stated minimum precision for working values. */
};                                                                                                /* Closes the precision policy. */

export type ExamPresentationPolicy = {                                                           /* Opens all Question-specific presentation rules. */
  precision: ExamPrecisionPolicy;                                                                 /* Stores final and intermediate rounding rules. */
  simplification: ExamPresentationRequirement;                                                    /* Records simplification treatment. */
  exactValue: ExamPresentationRequirement;                                                        /* Records exact-value treatment. */
  units: ExamPresentationRequirement;                                                             /* Records unit treatment. */
  degreeSymbol: ExamPresentationRequirement;                                                      /* Records degree-symbol treatment. */
  coordinateBrackets: ExamPresentationRequirement;                                                /* Records coordinate-bracket treatment. */
  vectorBrackets: ExamPresentationRequirement;                                                    /* Records vector-bracket treatment. */
  positivePowers: ExamPresentationRequirement;                                                    /* Records positive-power treatment. */
  rationalDenominator: ExamPresentationRequirement;                                               /* Records rational-denominator treatment. */
  contextualWording: ExamPresentationRequirement;                                                 /* Records context-language treatment. */
  answerLabelling: ExamPresentationRequirement;                                                   /* Records whether the final answer must be clearly identified. */
  otherConditions: string[];                                                                      /* Stores rare presentation rules not covered above. */
};                                                                                                /* Closes the presentation policy. */

// ============================================================================
// SECTION 11 — QUESTION-SPECIFIC MARKING RULES
// ============================================================================

export type ExamMarkingRuleCategory =                                                            /* Groups Question-specific marking rules. */
  | "FOLLOW_THROUGH"                                                                              /* Controls follow-through after an error. */
  | "ROUNDING"                                                                                    /* Controls precision or rounding. */
  | "WRONG_OPERATION"                                                                             /* Covers a wrong mathematical operation. */
  | "WRONG_VALUE"                                                                                 /* Covers use of a wrong supplied or derived value. */
  | "METHOD_LIMIT"                                                                                /* Limits credit for a method. */
  | "METHOD_EXCLUSION"                                                                            /* Excludes a method from credit. */
  | "ERROR_LIMIT"                                                                                 /* Caps marks after a particular error. */
  | "ANSWER_ONLY"                                                                                 /* Controls answer-only credit. */
  | "PRESENTATION"                                                                                /* Controls form, notation, or presentation. */
  | "ALTERNATIVE_METHOD"                                                                          /* Describes treatment of another valid method. */
  | "SOLUTION_SELECTION"                                                                          /* Controls extra, missing, or invalid solutions. */
  | "CROSS_PART"                                                                                 /* Controls evidence across Question parts. */
  | "OTHER";                                                                                      /* Covers an unusual rule. */

export type ExamMarkingRuleOutcome = {                                                           /* Opens the structured result of a marking rule. */
  marksAwarded: number | null;                                                                    /* Records a fixed score when the source gives one. */
  maximumMarks: number | null;                                                                    /* Records a score ceiling when the source gives one. */
  unavailableMarkIds: ExamMarkId[];                                                               /* Lists marks made unavailable. */
  followThroughMarkIds: ExamMarkId[];                                                             /* Lists marks that remain available by follow-through. */
};                                                                                                /* Closes the marking-rule outcome. */

export type ExamMarkingRule = {                                                                  /* Opens one Question-specific marking rule. */
  id: ExamMarkingRuleId;                                                                          /* Gives the rule a stable ID. */
  category: ExamMarkingRuleCategory;                                                             /* Records the rule category. */
  conditionSummary: string;                                                                       /* Gives a short description of what triggers the rule. */
  outcome: ExamMarkingRuleOutcome;                                                                /* Stores the marking consequence. */
  appliesToMarkIds: ExamMarkId[];                                                                 /* Links the marks directly affected. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the rule back to source guidance. */
};                                                                                                /* Closes the marking rule. */

// ============================================================================
// SECTION 12 — COMMONLY OBSERVED OR DISCUSSED RESPONSES
// ============================================================================

export type ExamCommonResponseCategory =                                                         /* Groups common or specifically discussed responses. */
  | "COMMON_ERROR"                                                                                /* A recurring wrong approach. */
  | "MISCONCEPTION"                                                                               /* A recognisable mathematical misunderstanding. */
  | "PARTIAL_METHOD"                                                                              /* A partly valid method. */
  | "VALID_ALTERNATIVE"                                                                           /* A valid alternative response. */
  | "ROUNDING_ERROR"                                                                              /* A precision-related error. */
  | "ANSWER_ONLY"                                                                                 /* A response containing only the final answer. */
  | "NOTATION_ERROR"                                                                              /* A response with a notation or form issue. */
  | "CALCULATOR_MODE_ERROR"                                                                       /* A response affected by RAD or GRAD mode. */
  | "OTHER";                                                                                      /* Covers another useful response pattern. */

export type ExamCommonResponsePattern = {                                                        /* Opens one normalised response pattern. */
  id: ExamCommonResponseId;                                                                       /* Gives the response pattern a stable ID. */
  category: ExamCommonResponseCategory;                                                          /* Records the response category. */
  errorFamily: string | null;                                                                     /* Links similar mistakes under a common error family. */
  responseSummary: string;                                                                        /* Gives a short paraphrased description of the response. */
  affectedMarkIds: ExamMarkId[];                                                                  /* Links marks affected by the response. */
  marksAwarded: number | null;                                                                    /* Records a fixed award when the source gives one. */
  maximumMarks: number | null;                                                                    /* Records a score ceiling when relevant. */
  followThroughAvailable: boolean;                                                                /* Records whether later credit can survive. */
  linkedRuleIds: ExamMarkingRuleId[];                                                             /* Links any Question-specific rules that explain the outcome. */
  usefulForGeneratorValidation: boolean;                                                         /* Records whether this error pattern should test generated MS logic. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the pattern back to source guidance. */
};                                                                                                /* Closes the common-response pattern. */

// ============================================================================
// SECTION 13 — SHARED AND CROSS-QUESTION RULES
// ============================================================================

export type ExamSharedRuleScope =                                                                /* Records how widely a shared marking rule applies. */
  | "QUESTION"                                                                                    /* The rule applies to one Question only. */
  | "QUESTION_GROUP"                                                                              /* The rule applies across named Questions. */
  | "PAPER"                                                                                       /* The rule applies across one paper. */
  | "ASSESSMENT"                                                                                  /* The rule applies across the full assessment. */
  | "COURSE_POLICY";                                                                              /* The rule comes from general Course marking policy. */

export type ExamSharedMarkingRuleCategory =                                                      /* Groups shared marking rules. */
  | "CALCULATOR_MODE"                                                                             /* Covers RAD or GRAD mode errors. */
  | "REPEATED_ERROR"                                                                              /* Covers repeated use of the same error. */
  | "NOTATION"                                                                                    /* Covers notation penalties shared across Questions. */
  | "PRESENTATION"                                                                                /* Covers shared presentation penalties. */
  | "UNITS"                                                                                       /* Covers shared unit treatment. */
  | "MULTIPLE_ATTEMPTS"                                                                           /* Covers how repeated attempts are marked. */
  | "OTHER";                                                                                      /* Covers another shared rule. */

export type ExamSharedMarkingRuleRef = {                                                         /* Opens a reference to a shared marking rule. */
  ruleId: ExamSharedMarkingRuleId;                                                                /* Links to the shared rule definition. */
  scope: ExamSharedRuleScope;                                                                     /* Records the rule's scope. */
  category: ExamSharedMarkingRuleCategory;                                                       /* Records the rule category. */
  affectedQuestionIds: ExamQuestionId[];                                                         /* Lists Questions covered by the rule when known. */
  penaltyLimit: "ONCE" | "PER_QUESTION" | "PER_OCCURRENCE" | "NONE";                              /* Records how often a penalty may apply. */
  applicationSummary: string;                                                                     /* Gives a short human-friendly statement of the rule. */
  sourceEvidence: ExamCatalogueEvidenceRef[];                                                     /* Links the rule back to source policy. */
};                                                                                                /* Closes the shared-rule reference. */

// ============================================================================
// SECTION 14 — GENERAL MARKING POLICY REFERENCE
// ============================================================================

export type ExamGeneralMarkingPolicyRef = {                                                      /* Opens the link to the wider general marking policy. */
  policyId: ExamGeneralMarkingPolicyId;                                                           /* Links to the full year or regime policy entry. */
  relevantRuleIds: string[];                                                                      /* Lists general rules that directly matter to this MS. */
  notes: string[];                                                                                /* Adds short Question-specific policy notes when useful. */
};                                                                                                /* Closes the general marking-policy reference. */

// ============================================================================
// SECTION 15 — QUESTION ↔ MARKING SCHEME RELATIONSHIP
// ============================================================================

export type ExamPartMarkMap = {                                                                  /* Opens the mapping from a Question part to its marks. */
  questionPartId: ExamQuestionPartId;                                                             /* Identifies the Question part. */
  markIds: ExamMarkId[];                                                                          /* Lists the marks belonging to that part. */
};                                                                                                /* Closes the part-to-mark mapping. */

export type ExamSubgoalMarkMap = {                                                               /* Opens the mapping from a mathematical subgoal to marks. */
  subgoalId: string;                                                                              /* Gives the subgoal a stable local ID. */
  subgoalSummary: string;                                                                         /* Gives a short description of the mathematical goal. */
  markIds: ExamMarkId[];                                                                          /* Lists marks attached to the subgoal. */
};                                                                                                /* Closes the subgoal-to-mark mapping. */

export type ExamPromptInstructionConsequence = {                                                 /* Opens a prompt instruction and its marking effect. */
  instructionType: string;                                                                        /* Names the instruction, such as show-that or round-to. */
  markingConsequence: string;                                                                     /* Briefly states how it changes marking. */
  affectedMarkIds: ExamMarkId[];                                                                  /* Links the marks controlled by the instruction. */
};                                                                                                /* Closes the prompt-instruction consequence. */

export type ExamInformationEvidenceLink = {                                                      /* Opens the link from Question information to marking evidence. */
  questionInformationId: string;                                                                  /* Links to a meaningful information item from the Question entry. */
  usedByMethodIds: ExamMarkingMethodId[];                                                         /* Lists methods that use this information. */
  supportsMarkIds: ExamMarkId[];                                                                  /* Lists marks whose evidence depends on it. */
};                                                                                                /* Closes the information-to-evidence link. */

export type ExamRepresentationEvidenceLink = {                                                   /* Opens the link from a visual response to marks. */
  visualElementId: ExamQuestionVisualElementId;                                                   /* Links to the Question's visual element. */
  evidenceSummary: string;                                                                        /* Briefly describes what must be shown or read there. */
  supportsMarkIds: ExamMarkId[];                                                                  /* Lists marks the visual evidence can earn. */
};                                                                                                /* Closes the representation-evidence link. */

export type ExamErrorPropagationLink = {                                                         /* Opens one mapped error-propagation route. */
  sourceMarkIds: ExamMarkId[];                                                                    /* Links marks where the earlier error occurs. */
  affectedMarkIds: ExamMarkId[];                                                                  /* Links later marks affected by the error. */
  survivingMarkIds: ExamMarkId[];                                                                 /* Lists marks that can still be earned. */
  conditionSummary: string;                                                                       /* Briefly explains when this propagation applies. */
};                                                                                                /* Closes the error-propagation link. */

export type ExamQuestionMarkingRelationship = {                                                  /* Opens the full relationship between Question and MS. */
  partMarkMap: ExamPartMarkMap[];                                                                 /* Maps Question parts to marks. */
  subgoalMarkMap: ExamSubgoalMarkMap[];                                                           /* Maps mathematical subgoals to marks. */
  promptInstructionConsequences: ExamPromptInstructionConsequence[];                              /* Maps prompt instructions to marking effects. */
  informationEvidenceMap: ExamInformationEvidenceLink[];                                         /* Maps Question information to method and mark use. */
  representationEvidenceMap: ExamRepresentationEvidenceLink[];                                   /* Maps diagrams, graphs, and grids to mark evidence. */
  crossPartDependencies: string[];                                                                /* Records important evidence links across Question parts. */
  errorPropagationGraph: ExamErrorPropagationLink[];                                              /* Stores structured follow-through and error effects. */
};                                                                                                /* Closes the Question-to-MS relationship. */

// ============================================================================
// SECTION 16 — SOURCE MARKING-SCHEME LAYOUT
// ============================================================================

export type ExamMarkingSchemeMeasurementMethod =                                                 /* Records how layout size was measured. */
  | "PDF_RENDER"                                                                                  /* Measured from a rendered PDF. */
  | "MANUAL_ESTIMATE"                                                                             /* Estimated manually. */
  | "NOT_MEASURED";                                                                               /* No layout measurement has been made. */

export type ExamMarkingSchemeMeasuredBlock = {                                                   /* Opens one measured area of the source MS. */
  measurementMethod: ExamMarkingSchemeMeasurementMethod;                                         /* Records how the block was measured. */
  pdfPageNumber: number | null;                                                                   /* Records the physical PDF page when known. */
  renderDpi: number | null;                                                                       /* Records the render resolution when measured from PDF. */
  topPx: number | null;                                                                           /* Records the top edge in rendered pixels. */
  bottomPx: number | null;                                                                        /* Records the bottom edge in rendered pixels. */
  leftPx: number | null;                                                                          /* Records the left edge when useful. */
  rightPx: number | null;                                                                         /* Records the right edge when useful. */
  heightMm: number | null;                                                                        /* Records physical block height when known. */
  widthMm: number | null;                                                                         /* Records physical block width when known. */
  notes: string | null;                                                                           /* Records a short layout note. */
};                                                                                                /* Closes the measured block. */

export type ExamMarkingSchemeLayoutEvidence = {                                                  /* Opens source-layout evidence for this Question's MS. */
  coreEvidenceBlocks: ExamMarkingSchemeMeasuredBlock[];                                           /* Stores the tight blocks containing the main marking evidence. */
  fullQuestionBlocks: ExamMarkingSchemeMeasuredBlock[];                                           /* Stores the full Question-specific MS section including notes and CORs. */
};                                                                                                /* Closes source-layout evidence. */

// ============================================================================
// SECTION 17 — MARKING SCHEME GENERATION ANALYSIS
// ============================================================================

export type ExamMarkingGenerationReadiness =                                                     /* Records how ready this evidence is for MS generation. */
  | "NOT_READY"                                                                                   /* The evidence is not yet sufficient. */
  | "PARTIAL"                                                                                     /* Some generation logic has been reviewed. */
  | "READY_FOR_PROTOTYPE"                                                                         /* Enough evidence exists for a first generator. */
  | "READY_FOR_PRODUCTION";                                                                       /* The family has strong reviewed marking evidence. */

export type ExamMarkingSchemeGenerationProfile = {                                               /* Opens generator-facing MS knowledge. */
  readiness: ExamMarkingGenerationReadiness;                                                     /* Records how mature the MS generation evidence is. */
  linkedMarkingGeneratorFamilyIds: string[];                                                      /* Links existing or planned MS generator families. */
  requiredMethodFamilyIds: ExamMarkingMethodId[];                                                 /* Lists method families a generated MS should support. */
  minimumIllustrativeMethodCount: number;                                                         /* Records the minimum number of illustrated routes expected. */
  requiredMarkTypes: ExamMarkType[];                                                              /* Lists mark types that must appear for this family. */
  followThroughTemplateNotes: string[];                                                           /* Records reusable follow-through behaviour. */
  presentationTemplateNotes: string[];                                                            /* Records reusable precision or notation rules. */
  commonErrorFamilyIds: string[];                                                                 /* Links useful error families for generated MS testing. */
  requiredValidationChecks: string[];                                                             /* Lists checks every generated MS should pass. */
  provenance: ExamCatalogueProvenance;                                                            /* Marks this section as derived generation analysis. */
};                                                                                                /* Closes MS generation analysis. */

// ============================================================================
// SECTION 18 — COMPLETE MARKING SCHEME CATALOGUE ENTRY
// ============================================================================

export type ExamMarkingSchemeCatalogEntry = {                                                    /* Opens the universal Marking Scheme Catalogue entry. */
  identity: ExamMarkingSchemeIdentity;                                                           /* Stores permanent IDs and Question links. */
  sourceContext: ExamMarkingSchemeSourceContext;                                                 /* Stores source pages, marks, and policy link. */
  expectedResponse: ExamMarkingSchemeExpectedResponse;                                           /* Stores accepted final-answer requirements. */
  markNodes: ExamMarkNode[];                                                                       /* Stores every individual available mark. */
  methodPathways: ExamMethodPathway[];                                                            /* Stores materially distinct valid solution routes. */
  workingPolicy: ExamWorkingEvidencePolicy;                                                       /* Stores answer-only and working-evidence rules. */
  presentationPolicy: ExamPresentationPolicy;                                                     /* Stores rounding, units, notation, and form rules. */
  questionSpecificRules: ExamMarkingRule[];                                                       /* Stores structured Question-specific marking rules. */
  commonResponses: ExamCommonResponsePattern[];                                                   /* Stores useful common or specifically discussed responses. */
  sharedRuleRefs: ExamSharedMarkingRuleRef[];                                                     /* Links cross-Question and paper-level rules. */
  generalPolicy: ExamGeneralMarkingPolicyRef;                                                /* Links to the wider general marking policy. */
  relationship: ExamQuestionMarkingRelationship;                                                  /* Stores the explicit Question-to-MS evidence map. */
  sourceLayout: ExamCatalogueValue<ExamMarkingSchemeLayoutEvidence>;                              /* Stores source layout measurements when reviewed. */
  generation: ExamMarkingSchemeGenerationProfile;                                                /* Stores reviewed MS generation knowledge. */
  review: ExamCatalogueReviewProfile;                                                         /* Stores the shared catalogue review record. */
};                                                                                                /* Closes the universal Marking Scheme Catalogue entry. */
