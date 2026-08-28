import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q6 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q6";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, noFollowThrough, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("6", 5);
const A1 = "N5_MATH_2014_P1_Q6_A_M1";
const A2 = "N5_MATH_2014_P1_Q6_A_M2";
const A3 = "N5_MATH_2014_P1_Q6_A_M3";
const B1 = "N5_MATH_2014_P1_Q6_B_M1";
const P1 = "N5_MATH_2014_P1_Q6_METHOD_SLOPE_INTERCEPT";
const P2 = "N5_MATH_2014_P1_Q6_METHOD_POINT_SLOPE";
const PB = "N5_MATH_2014_P1_Q6_METHOD_USE_MODEL";
const D_A_FULL = "N5_MATH_2014_P1_Q6_D_A_ANSWER_ONLY";
const D_A_XY = "N5_MATH_2014_P1_Q6_D_A_XY_VARIABLES";
const D_A_NO_INTERCEPT = "N5_MATH_2014_P1_Q6_D_A_NO_INTERCEPT";
const D_A_FT = "N5_MATH_2014_P1_Q6_D_A_FOLLOW_THROUGH";
const D_A_PARTIAL_NO_WORK = "N5_MATH_2014_P1_Q6_D_A_PARTIAL_NO_WORK";
const D_A_WRONG_BOTH = "N5_MATH_2014_P1_Q6_D_A_WRONG_BOTH";
const D_B_NO_WORK = "N5_MATH_2014_P1_Q6_D_B_NO_WORK";
const D_B_FT_GATE = "N5_MATH_2014_P1_Q6_D_B_FT_GATE";

export const N5_MATHS_2014_P1_Q6_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P1", questionNumber: "6", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 4, sourcePages: [5], printedPageLabels: ["Page five"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["MIXED"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P1_Q6_A1", normalisedAnswer: "C = 15F + 125", numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Final simplified model uses the question variables F and C for full credit."], sourceEvidence: [evidence], notes: "Part (a)." },
      { id: "N5_MATH_2014_P1_Q6_A2", normalisedAnswer: "725 calories", numericValue: 725, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["For the part (b) mark, the value must be obtained by calculation using the equation rather than stated without working."], sourceEvidence: [evidence], notes: "Part (b)." },
    ],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_A_FULL, layer: "QUESTION_NOTE", scope: "PART", effect: "AWARD", normalisedSummary: "The correct part (a) model without working receives all three marks.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A1, A2, A3], appliesToMethodIds: [P1, P2], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_A_XY, layer: "QUESTION_NOTE", scope: "PART", effect: "LIMIT", normalisedSummary: "A numerically correct line written with generic x and y rather than F and C receives two of the three marks.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A3], appliesToMethodIds: [P1, P2], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_A_NO_INTERCEPT, layer: "QUESTION_NOTE", scope: "PART", effect: "LIMIT", normalisedSummary: "A line using the correct gradient but omitting the required non-zero intercept receives one mark.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A2, A3], appliesToMethodIds: [P1, P2], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D_A_FT, layer: "QUESTION_NOTE", scope: "PART", effect: "FOLLOW_THROUGH", normalisedSummary: "If the gradient and/or intercept is wrong, later valid working can still make one or two marks available.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A2, A3], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_A_PARTIAL_NO_WORK, layer: "QUESTION_NOTE", scope: "PART", effect: "AWARD", normalisedSummary: "An incorrect stated equation with no working can still receive one mark when either the gradient or the y-intercept is correct.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A1, A2, A3], appliesToMethodIds: [], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D_A_WRONG_BOTH, layer: "QUESTION_NOTE", scope: "PART", effect: "BLOCK", normalisedSummary: "An incorrect equation with both gradient and intercept wrong and no supporting working receives no marks.", appliesToPartIds: ["Q6_a"], appliesToMarkIds: [A1, A2, A3], appliesToMethodIds: [], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
    { id: D_B_NO_WORK, layer: "QUESTION_NOTE", scope: "PART", effect: "BLOCK", normalisedSummary: "The correct numerical estimate for part (b) without working receives no mark.", appliesToPartIds: ["Q6_b"], appliesToMarkIds: [B1], appliesToMethodIds: [PB], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
    { id: D_B_FT_GATE, layer: "QUESTION_NOTE", scope: "PART", effect: "FOLLOW_THROUGH", normalisedSummary: "Follow-through from part (a) is available only when using the candidate's model still requires both a multiplication/division and an addition/subtraction.", appliesToPartIds: ["Q6_b"], appliesToMarkIds: [B1], appliesToMethodIds: [PB], marksAwarded: null, maximumMarks: 1, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(A1, 1, "Q6_a", "PROCESS", "Find the gradient of the line from the supplied points.", "Establish the linear rate of change.", ["stat-s02-linear-model"], ["stat-s2-1"], ["Q6_S1"], [evidence], { illustrativeEvidence: [{ id: "Q6_A_M1_E1", normalisedEvidence: "Compute the gradient as 300/20 = 15 from the two labelled observations.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: ["VIS_Q6"], sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_A_FULL, D_A_PARTIAL_NO_WORK] }),
    markNode(A2, 2, "Q6_a", "PROCESS", "Substitute the gradient and one supplied point into a valid straight-line equation form.", "Use a known point to anchor the line model.", ["stat-s02-linear-model"], ["stat-s2-1"], ["Q6_S2"], [evidence], { pathwaySpecificRequirements: [{ methodPathwayId: P1, normalisedRequirement: "Substitute into slope-intercept form.", sourceEvidence: [evidence] }, { methodPathwayId: P2, normalisedRequirement: "Substitute into point-slope form.", sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_A_FULL, D_A_FT] }),
    markNode(A3, 3, "Q6_a", "ACCURACY", "Complete the chosen line method and state the simplified model in terms of F and C.", "Produce the final context-variable equation.", ["stat-s02-linear-model"], ["stat-s2-1"], ["Q6_S2"], [evidence], { pathwaySpecificRequirements: [{ methodPathwayId: P1, normalisedRequirement: "Calculate the intercept and state the simplified F/C equation.", sourceEvidence: [evidence] }, { methodPathwayId: P2, normalisedRequirement: "Expand and rearrange the point-slope equation to the simplified F/C equation.", sourceEvidence: [evidence] }], presentationConditions: ["Using F and C rather than generic x and y is required for the third mark."], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_A_FULL, D_A_XY, D_A_NO_INTERCEPT, D_A_FT, D_A_PARTIAL_NO_WORK, D_A_WRONG_BOTH] }),
    markNode(B1, 1, "Q6_b", "PROCESS", "Calculate the requested value using the equation.", "Apply the linear model to the new input.", ["stat-s02-linear-model"], ["stat-s2-1"], ["Q6_S3"], [evidence], {
      illustrativeEvidence: [{ id: "Q6_B_M1_E1", normalisedEvidence: "Substitute F=40 into the model and calculate 725.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }],
      dependencies: [{ type: "FOLLOW_THROUGH_FROM", relatedMarkIds: [A3], relatedQuestionPartIds: ["Q6_a"], conditionSummary: "May follow the candidate's part (a) model under the explicit comparable-operation gate.", sourceEvidence: [evidence] }, { type: "REQUIRES_COMPARABLE_DIFFICULTY", relatedMarkIds: [], relatedQuestionPartIds: ["Q6_a"], conditionSummary: "The carried-forward calculation must include both multiplicative/divisive and additive/subtractive demand.", sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [A3], fromQuestionPartIds: ["Q6_a"], requiresComparableDifficulty: true, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: true, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "Question-specific note defines the exact operation-complexity gate for follow-through." },
      methodPathwayIds: [PB], sourceDirectiveIds: [D_B_NO_WORK, D_B_FT_GATE],
    }),
  ],
  methodPathways: [
    { id: P1, variantId: "SLOPE_INTERCEPT", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q6_P1_S1", order: 1, normalisedStep: "Calculate the gradient from the two labelled points.", linkedQuestionSubgoalIds: ["Q6_S1"], linkedMarkIds: [A1], dependsOnStepIds: [], requiredOperations: ["GRADIENT"], resultingStateSummary: "m=15", sourceEvidence: [evidence] }, { id: "Q6_P1_S2", order: 2, normalisedStep: "Substitute m and one point into y=mx+c.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [A2], dependsOnStepIds: ["Q6_P1_S1"], requiredOperations: ["SUBSTITUTE"], resultingStateSummary: "Equation in c.", sourceEvidence: [evidence] }, { id: "Q6_P1_S3", order: 3, normalisedStep: "Calculate c and state C=15F+125 or equivalent.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [A3], dependsOnStepIds: ["Q6_P1_S2"], requiredOperations: ["SOLVE", "MODEL"], resultingStateSummary: "C=15F+125", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P2], materiallyDistinctFromMethodIds: [P2], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: P2, variantId: "POINT_SLOPE", evidenceRole: "ILLUSTRATIVE_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q6_P2_S1", order: 1, normalisedStep: "Calculate the gradient from the two labelled points.", linkedQuestionSubgoalIds: ["Q6_S1"], linkedMarkIds: [A1], dependsOnStepIds: [], requiredOperations: ["GRADIENT"], resultingStateSummary: "m=15", sourceEvidence: [evidence] }, { id: "Q6_P2_S2", order: 2, normalisedStep: "Substitute the gradient and one point into point-slope form.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [A2], dependsOnStepIds: ["Q6_P2_S1"], requiredOperations: ["SUBSTITUTE"], resultingStateSummary: "Point-slope equation.", sourceEvidence: [evidence] }, { id: "Q6_P2_S3", order: 3, normalisedStep: "Expand and rearrange to C=15F+125 or equivalent.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [A3], dependsOnStepIds: ["Q6_P2_S2"], requiredOperations: ["EXPAND", "REARRANGE", "MODEL"], resultingStateSummary: "C=15F+125", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P1], materiallyDistinctFromMethodIds: [P1], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: PB, variantId: "USE_PART_A_MODEL", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: ["Use the candidate's valid/eligible part (a) equation."], steps: [{ id: "Q6_PB_S1", order: 1, normalisedStep: "Substitute F=40 into the chosen part (a) equation and evaluate.", linkedQuestionSubgoalIds: ["Q6_S3"], linkedMarkIds: [B1], dependsOnStepIds: [], requiredOperations: ["SUBSTITUTE", "CALCULATE"], resultingStateSummary: "725 for the source-correct model.", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] },
  ],
  methodEquivalence: { equivalentMethodGroups: [{ id: "Q6_A_EQUIV", methodIds: [P1, P2], equivalenceReason: "The source explicitly supplies slope-intercept and point-slope as separate full-credit methods for part (a).", sourceEvidence: [evidence] }], methodEligibilityRules: [] },
  workingPolicy: {
    ...workingPolicy(answerOnly("NOT_STATED", null, [], [evidence]), [], [A1, A2, A3]),
    correctAnswerWithoutWorking: answerOnly("NOT_STATED", null, [], [evidence], [], [], "Treatment differs by part; use the part-specific profiles."),
    partSpecificAnswerOnly: [
      { questionPartId: "Q6_a", profile: answerOnly("FULL_CREDIT", 3, [A1, A2, A3], [evidence], [D_A_FULL]) },
      { questionPartId: "Q6_b", profile: answerOnly("NO_CREDIT", 0, [], [evidence], [D_B_NO_WORK]) },
    ],
    workingMandatoryForMarkIds: [B1],
  },
  presentationPolicy: presentationPolicy([evidence], { answerLabelling: "REQUIRED_FOR_FULL_CREDIT", otherConditions: ["Part (a) final equation must be expressed in terms of F and C for the third mark."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q6_CR_XY", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "WRONG_VARIABLE_NAMES", normalisedResponse: "Correct numerical straight-line model written as y=15x+125.", affectedMarkIds: [A3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true, sourceDirectiveIds: [D_A_XY], sourceEvidence: [evidence] },
    { id: "Q6_CR_NO_INTERCEPT", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "OMITTED_INTERCEPT", normalisedResponse: "Use the correct gradient but state a zero-intercept model.", affectedMarkIds: [A2, A3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true, sourceDirectiveIds: [D_A_NO_INTERCEPT], sourceEvidence: [evidence] },
    { id: "Q6_CR_B_ANSWER_ONLY", sourceStatus: "EXPLICITLY_LISTED", category: "ANSWER_ONLY", errorFamily: null, normalisedResponse: "State 725 in part (b) without showing use of the equation.", affectedMarkIds: [B1], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [D_B_NO_WORK], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_A_FULL, D_A_XY, D_A_NO_INTERCEPT, D_A_FT, D_A_PARTIAL_NO_WORK, D_A_WRONG_BOTH, D_B_NO_WORK, D_B_FT_GATE] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q6_a", markIds: [A1, A2, A3] }, { questionPartId: "Q6_b", markIds: [B1] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q6_S1", markIds: [A1] }, { questionSubgoalId: "Q6_S2", markIds: [A2, A3] }, { questionSubgoalId: "Q6_S3", markIds: [B1] }],
    promptInstructionConsequences: [{ instructionType: "USE_EQUATION_AND_SHOW_WORKING", markingConsequence: "Part (b) requires visible calculation; the correct answer alone receives 0/1.", affectedMarkIds: [B1], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q6_INFO_A", usedByMethodIds: [P1, P2], supportsMarkIds: [A1, A2, A3] }, { questionInformationId: "Q6_INFO_B", usedByMethodIds: [P1, P2], supportsMarkIds: [A1, A2, A3] }, { questionInformationId: "Q6_INFO_TARGET", usedByMethodIds: [PB], supportsMarkIds: [B1] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q6", normalisedEvidence: "The labelled points on the supplied best-fit line support the gradient/model construction in part (a).", supportsMarkIds: [A1, A2, A3] }],
    crossPartDependencies: ["Part (b) uses the equation produced in part (a); follow-through is explicitly gated by retained operation complexity."],
    errorPropagationGraph: [{ sourceMarkIds: [A3], sourceQuestionPartIds: ["Q6_a"], affectedMarkIds: [B1], survivingMarkIds: [B1], conditionSummary: "A wrong part (a) equation may carry into part (b) only if the new calculation still contains both multiplicative/divisive and additive/subtractive operations.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([5], "MULTI_METHOD_TABLE_ROW", 3, 8, 3),
  consistency: notReviewedConsistency(comparisonKey("Q6_MARKING_COMPARISON", question.family.familyId, ["stat-s02-linear-model"], 4, ["MIXED"], ["answer-only difference by part", "method equivalence", "variable naming", "cross-part follow-through", "comparable difficulty gate"]), [
    consistencyFeature("part_a_answer_only_treatment", "FULL_CREDIT", "Part (a) correct equation without working explicitly earns 3/3.", [evidence]),
    consistencyFeature("part_b_answer_only_treatment", "NO_CREDIT", "Part (b) correct numerical answer without working explicitly earns 0/1.", [evidence]),
    consistencyFeature("explicit_full_credit_method_count_part_a", 2, "Two full-credit line-equation methods are printed.", [evidence]),
    consistencyFeature("context_variable_names_mark_bearing", true, "Using generic x/y rather than F/C explicitly loses the third mark.", [evidence]),
    consistencyFeature("cross_part_follow_through", true, "Part (b) explicitly allows follow-through from part (a).", [evidence]),
    consistencyFeature("follow_through_comparable_operation_gate", true, "The source defines a concrete two-operation-complexity condition for part (b) follow-through.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("6"),
} satisfies AnswerCatalogEntry;
