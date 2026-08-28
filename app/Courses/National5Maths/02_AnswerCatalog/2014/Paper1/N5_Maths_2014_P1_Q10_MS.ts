import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q10 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q10";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("10", 7);
const M1 = "N5_MATH_2014_P1_Q10_M1";
const M2 = "N5_MATH_2014_P1_Q10_M2";
const D1 = "N5_MATH_2014_P1_Q10_D_FULL_FUNCTION";
const D2 = "N5_MATH_2014_P1_Q10_D_PERIODIC_PHASE";
const P1 = "N5_MATH_2014_P1_Q10_METHOD_READ_GRAPH_PARAMETERS";

export const N5_MATHS_2014_P1_Q10_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P1", questionNumber: "10", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 2, sourcePages: [7], printedPageLabels: ["Page seven"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P1_Q10_A1", normalisedAnswer: "a=3", numericValue: 3, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Amplitude parameter." },
      { id: "N5_MATH_2014_P1_Q10_A2", normalisedAnswer: "b=-40", numericValue: -40, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P1_Q10_A3"], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Phase parameter." },
    ],
    acceptedEquivalentForms: [{ id: "N5_MATH_2014_P1_Q10_A3", normalisedAnswer: "b=320", numericValue: 320, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P1_Q10_A2"], conditionsForAcceptance: ["Accepted as a periodic equivalent phase parameter for the displayed sine function."], sourceEvidence: [evidence], notes: null }],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "ACCEPT", normalisedSummary: "Writing the complete equivalent function y=3 sin(x-40) receives both marks.", appliesToPartIds: ["Q10_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "MARK", effect: "ACCEPT", normalisedSummary: "The periodic equivalent phase value b=320 is explicitly accepted for the second mark.", appliesToPartIds: ["Q10_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q10_MAIN", "INTERPRETATION", "State the value of the amplitude parameter a.", "Read the amplitude from the supplied sine graph.", ["trig-t01-graphs"], ["trig-t1-1"], ["Q10_S1"], [evidence], { illustrativeEvidence: [{ id: "Q10_M1_E1", normalisedEvidence: "State a=3.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: ["VIS_Q10"], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1] }),
    markNode(M2, 2, "Q10_MAIN", "INTERPRETATION", "State an accepted value of the phase parameter b.", "Read the horizontal phase relationship from the supplied sine graph.", ["trig-t01-graphs"], ["trig-t1-1"], ["Q10_S2"], [evidence], { illustrativeEvidence: [{ id: "Q10_M2_E1", normalisedEvidence: "State b=-40; b=320 is also explicitly accepted.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: ["VIS_Q10"], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2] }),
  ],
  methodPathways: [{ id: P1, variantId: "GRAPH_INSPECTION", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q10_P1_S1", order: 1, normalisedStep: "Read amplitude 3 from the vertical extrema.", linkedQuestionSubgoalIds: ["Q10_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["INTERPRET_GRAPH"], resultingStateSummary: "a=3", sourceEvidence: [evidence] }, { id: "Q10_P1_S2", order: 2, normalisedStep: "Read the horizontal phase parameter from the graph using an equivalent cycle position.", linkedQuestionSubgoalIds: ["Q10_S2"], linkedMarkIds: [M2], dependsOnStepIds: [], requiredOperations: ["INTERPRET_GRAPH"], resultingStateSummary: "b=-40 or accepted periodic equivalent 320.", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The Question is a write-down task; the mark requirements themselves are the stated parameter values rather than working stages."), [], [M1, M2]),
  presentationPolicy: presentationPolicy([evidence], { otherConditions: ["A complete equivalent function is accepted as evidence for both parameter marks."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [{ id: "Q10_CR_PERIODIC_B", sourceStatus: "EXPLICITLY_LISTED", category: "VALID_ALTERNATIVE", errorFamily: null, normalisedResponse: "Use b=320 as the periodic equivalent of b=-40.", affectedMarkIds: [], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] }],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2] },
  relationship: { partMarkMap: [{ questionPartId: "Q10_MAIN", markIds: [M1, M2] }], subgoalMarkMap: [{ questionSubgoalId: "Q10_S1", markIds: [M1] }, { questionSubgoalId: "Q10_S2", markIds: [M2] }], promptInstructionConsequences: [{ instructionType: "WRITE_DOWN", markingConsequence: "Each parameter value is directly mark-bearing; the scheme does not require method working.", affectedMarkIds: [M1, M2], sourceEvidence: [evidence] }], informationEvidenceMap: [{ questionInformationId: "Q10_INFO_FAMILY", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q10_INFO_DOMAIN", usedByMethodIds: [P1], supportsMarkIds: [M2] }, { questionInformationId: "Q10_INFO_AMP", usedByMethodIds: [P1], supportsMarkIds: [M1] }, { questionInformationId: "Q10_INFO_ZERO", usedByMethodIds: [P1], supportsMarkIds: [M2] }], representationEvidenceMap: [{ visualElementId: "VIS_Q10", normalisedEvidence: "The graph directly supplies the amplitude and phase landmarks needed for both marks.", supportsMarkIds: [M1, M2] }], crossPartDependencies: [], errorPropagationGraph: [] },
  sourcePresentation: sourcePresentation([7], "TABLE_ROW", 1, 2, 1),
  consistency: notReviewedConsistency(comparisonKey("Q10_MARKING_COMPARISON", question.family.familyId, ["trig-t01-graphs"], 2, ["NUMBER"], ["write-down marking", "periodic equivalence", "full-function evidence", "graph evidence"]), [consistencyFeature("working_required_by_mark_requirements", false, "Both marks are awarded for stating parameter values from the graph.", [evidence]), consistencyFeature("periodic_equivalent_phase_accepted", true, "b=320 is explicitly accepted alongside b=-40.", [evidence]), consistencyFeature("full_function_can_supply_both_parameter_marks", true, "An equivalent complete function is explicitly awarded 2/2.", [evidence])]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("10"),
} satisfies AnswerCatalogEntry;
