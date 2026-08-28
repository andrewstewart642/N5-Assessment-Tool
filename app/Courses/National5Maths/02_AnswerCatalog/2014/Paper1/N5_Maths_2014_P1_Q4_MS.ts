import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q4 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q4";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("4", 4);
const M1 = "N5_MATH_2014_P1_Q4_M1";
const M2 = "N5_MATH_2014_P1_Q4_M2";
const D1 = "N5_MATH_2014_P1_Q4_D_ANSWER_ONLY";
const D2 = "N5_MATH_2014_P1_Q4_D_BRACKETS";
const D3 = "N5_MATH_2014_P1_Q4_D_ROW_VECTOR";
const D4 = "N5_MATH_2014_P1_Q4_D_LATER_INVALID";
const P1 = "N5_MATH_2014_P1_Q4_METHOD_COMPONENT_LINEAR_COMBINATION";

export const N5_MATHS_2014_P1_Q4_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P1", questionNumber: "4", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 2, sourcePages: [4], printedPageLabels: ["Page four"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["VECTOR"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P1_Q4_A1", normalisedAnswer: "column vector (-4, 10, 3)", numericValue: null, answerForm: "VECTOR", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Components are presented in the required column-vector orientation."], sourceEvidence: [evidence], notes: "Outer brackets around the column presentation are not required by the source." }],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: ["row vector (-4, 10, 3) receives only 1/2"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The correct column-vector result without working receives full credit.", appliesToPartIds: ["Q4_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "ACCEPT", normalisedSummary: "Outer brackets are not required for the accepted column-vector presentation.", appliesToPartIds: ["Q4_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D3, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Writing the three components as a row rather than the required column vector limits the response to one mark.", appliesToPartIds: ["Q4_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D4, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Invalid work after obtaining the correct vector can remove the final solution mark; the source illustrates this with an unnecessary magnitude calculation.", appliesToPartIds: ["Q4_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q4_MAIN", "PROCESS", "Calculate the scalar multiple 2u correctly.", "Establish the intermediate scaled vector.", ["geo-g09-vector-components"], ["geo-g9-1"], ["Q4_S1"], [evidence], { illustrativeEvidence: [{ id: "Q4_M1_E1", normalisedEvidence: "Obtain the component vector (-4, 6, 10) for 2u.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1] }),
    markNode(M2, 2, "Q4_MAIN", "ACCURACY", "Complete the vector subtraction and state the solution.", "Produce the correct resultant with the required component orientation.", ["geo-g09-vector-components"], ["geo-g9-1"], ["Q4_S2"], [evidence], { illustrativeEvidence: [{ id: "Q4_M2_E1", normalisedEvidence: "State the resultant as the column vector with components -4, 10 and 3.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], presentationConditions: ["Column-vector orientation is mark-bearing; outer brackets are not."], blockingConditions: ["Subsequent invalid scalar/magnitude work blocks this final mark."], methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2, D3, D4] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q4_P1_S1", order: 1, normalisedStep: "Multiply u by 2 component-wise.", linkedQuestionSubgoalIds: ["Q4_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["SCALAR_MULTIPLY"], resultingStateSummary: "2u = (-4, 6, 10) in column form.", sourceEvidence: [evidence] }, { id: "Q4_P1_S2", order: 2, normalisedStep: "Subtract v component-wise and state the resultant column vector.", linkedQuestionSubgoalIds: ["Q4_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q4_P1_S1"], requiredOperations: ["VECTOR_SUBTRACT"], resultingStateSummary: "(-4, 10, 3) in column form.", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 2, [M1, M2], [evidence], [D1]), [], [M1, M2]),
  presentationPolicy: presentationPolicy([evidence], { vectorBrackets: "DO_NOT_PENALISE", vectorOrientation: "REQUIRED_FOR_FULL_CREDIT", significantNotationRequirements: ["A row-vector presentation of the correct components is explicitly capped at 1/2."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q4_CR_ROW_VECTOR", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "VECTOR_ORIENTATION", normalisedResponse: "Correct components written as a row vector.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D3], sourceEvidence: [evidence] },
    { id: "Q4_CR_MAGNITUDE_AFTER_VECTOR", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "SUBSEQUENT_INVALID_WORK", normalisedResponse: "Correct vector is followed by an invalid magnitude calculation and treated as the answer.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D4], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2, D3, D4] },
  relationship: { partMarkMap: [{ questionPartId: "Q4_MAIN", markIds: [M1, M2] }], subgoalMarkMap: [{ questionSubgoalId: "Q4_S1", markIds: [M1] }, { questionSubgoalId: "Q4_S2", markIds: [M2] }], promptInstructionConsequences: [{ instructionType: "COMPONENT_FORM", markingConsequence: "The orientation of the vector representation affects full credit even though outer brackets do not.", affectedMarkIds: [M2], sourceEvidence: [evidence] }], informationEvidenceMap: [{ questionInformationId: "Q4_INFO_U", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q4_INFO_V", usedByMethodIds: [P1], supportsMarkIds: [M2] }, { questionInformationId: "Q4_INFO_TARGET", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }], representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [] },
  sourcePresentation: sourcePresentation([4], "TABLE_ROW", 1, 4, 2),
  consistency: notReviewedConsistency(comparisonKey("Q4_MARKING_COMPARISON", question.family.familyId, ["geo-g09-vector-components"], 2, ["VECTOR"], ["vector orientation", "bracket treatment", "answer-only credit", "later invalid work"]), [consistencyFeature("answer_only_treatment", "FULL_CREDIT", "Correct column vector without working explicitly earns full credit.", [evidence]), consistencyFeature("outer_vector_brackets_required", false, "The source explicitly waives outer brackets.", [evidence]), consistencyFeature("column_orientation_required_for_full_credit", true, "A correct row-vector response is explicitly capped at 1/2.", [evidence]), consistencyFeature("later_invalid_work_can_remove_final_mark", true, "Question-specific note removes the final mark after invalid subsequent work.", [evidence])]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("4"),
} satisfies AnswerCatalogEntry;
