import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q6 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q6";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("6", 17, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q6_M1";
const M2 = "N5_MATH_2014_P2_Q6_M2";
const M3 = "N5_MATH_2014_P2_Q6_M3";
const M4 = "N5_MATH_2014_P2_Q6_M4";
const P1 = "N5_MATH_2014_P2_Q6_METHOD_CONVERSE";
const P2 = "N5_MATH_2014_P2_Q6_METHOD_PYTHAGORAS_EXPECTED_SIDE";
const P3 = "N5_MATH_2014_P2_Q6_METHOD_COSINE_RULE";
const D1 = "N5_MATH_2014_P2_Q6_D_EXPLICIT_COMPARISON";
const D2 = "N5_MATH_2014_P2_Q6_D_RIGHT_ANGLE_CONCLUSION";
const D3 = "N5_MATH_2014_P2_Q6_D_INVALID_BEARING_CONCLUSION";

export const N5_MATHS_2014_P2_Q6_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "6", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 4, sourcePages: [17], printedPageLabels: ["Page seventeen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["CONCLUSION"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q6_A1", normalisedAnswer: "No; the relevant angle is not a right angle.", numericValue: null, answerForm: "PROSE", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["A full-credit response must include a valid strategy, evaluation, explicit comparison and a conclusion referring to the angle not being right-angled."], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: true, answerCountRequired: 1, invalidRelatedValues: ["A conclusion based only on an unsupported bearing statement"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The third mark requires an explicit comparison; merely calculating two quantities and moving straight to the conclusion does not earn it.", appliesToPartIds: ["Q6_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1, P2, P3], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The conclusion mark requires explicit reference to the relevant angle not being a right angle.", appliesToPartIds: ["Q6_MAIN"], appliesToMarkIds: [M4], appliesToMethodIds: [P1, P2, P3], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D3, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "A conclusion whose only justification is an invalid statement about a bearing does not earn the final mark.", appliesToPartIds: ["Q6_MAIN"], appliesToMarkIds: [M4], appliesToMethodIds: [P3], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q6_MAIN", "METHOD", "Use a valid strategy for deciding whether the relevant angle is 90 degrees.", "Select a valid right-angle test.", ["geo-g04-pythagoras"], ["geo-g4-1"], ["Q6_S1"], [evidence], { pathwaySpecificRequirements: [
      { methodPathwayId: P1, normalisedRequirement: "Use the converse of Pythagoras by comparing 110^2 with 85^2+75^2.", sourceEvidence: [evidence] },
      { methodPathwayId: P2, normalisedRequirement: "Use Pythagoras to calculate the side that would occur in a right triangle from 85 and 75.", sourceEvidence: [evidence] },
      { methodPathwayId: P3, normalisedRequirement: "Substitute the three side lengths correctly into the cosine rule for the relevant angle.", sourceEvidence: [evidence] },
    ], methodPathwayIds: [P1, P2, P3] }),
    markNode(M2, 2, "Q6_MAIN", "PROCESS", "Evaluate the chosen valid strategy correctly.", "Produce the numerical evidence needed for the right-angle decision.", ["geo-g04-pythagoras"], ["geo-g4-1"], ["Q6_S2"], [evidence], { pathwaySpecificRequirements: [
      { methodPathwayId: P1, normalisedRequirement: "Obtain 12100 and 12850.", sourceEvidence: [evidence] },
      { methodPathwayId: P2, normalisedRequirement: "Obtain approximately 113.36 for the side required by a right triangle.", sourceEvidence: [evidence] },
      { methodPathwayId: P3, normalisedRequirement: "Obtain approximately 86.6 degrees.", sourceEvidence: [evidence] },
    ], methodPathwayIds: [P1, P2, P3] }),
    markNode(M3, 3, "Q6_MAIN", "JUSTIFICATION", "Make an explicit mathematical comparison showing the relevant quantities are not equal to the right-angle condition.", "State the decisive comparison.", ["geo-g04-pythagoras"], ["geo-g4-1"], ["Q6_S2"], [evidence], { pathwaySpecificRequirements: [
      { methodPathwayId: P1, normalisedRequirement: "Explicitly compare 110^2 and 85^2+75^2 as unequal.", sourceEvidence: [evidence] },
      { methodPathwayId: P2, normalisedRequirement: "Explicitly compare the calculated 113.36 with the actual 110.", sourceEvidence: [evidence] },
      { methodPathwayId: P3, normalisedRequirement: "Explicitly compare 86.6 degrees with 90 degrees.", sourceEvidence: [evidence] },
    ], eligibilityConditions: ["The comparison must be written explicitly."], methodPathwayIds: [P1, P2, P3], sourceDirectiveIds: [D1] }),
    markNode(M4, 4, "Q6_MAIN", "CONCLUSION", "State the correct decision with a conclusion referring to the angle not being right-angled.", "Connect the mathematical evidence to the directional claim.", ["geo-g04-pythagoras"], ["geo-g4-1"], ["Q6_S3"], [evidence], {
      secondaryTypes: ["COMMUNICATION", "INTERPRETATION"],
      illustrativeEvidence: [{ id: "Q6_M4_E1", normalisedEvidence: "State No because the angle is not a right angle.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      dependencies: [{ type: "INDEPENDENT_OF", relatedMarkIds: [M3], relatedQuestionPartIds: ["Q6_MAIN"], conditionSummary: "The source example shows the conclusion mark can be earned even when the explicit-comparison mark is missed.", sourceEvidence: [evidence] }],
      eligibilityConditions: ["Conclusion must refer to the relevant angle not being a right angle."], blockingConditions: ["A bare directional/bearing statement without the right-angle conclusion is insufficient."], methodPathwayIds: [P1, P2, P3], sourceDirectiveIds: [D2, D3],
    }),
  ],
  methodPathways: [
    { id: P1, variantId: "CONVERSE_OF_PYTHAGORAS", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q6_P1_S1", order: 1, normalisedStep: "Form 110^2 and 85^2+75^2.", linkedQuestionSubgoalIds: ["Q6_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["SQUARE", "ADD"], resultingStateSummary: null, sourceEvidence: [evidence] },
      { id: "Q6_P1_S2", order: 2, normalisedStep: "Evaluate both quantities.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q6_P1_S1"], requiredOperations: ["EVALUATE"], resultingStateSummary: "12100 and 12850", sourceEvidence: [evidence] },
      { id: "Q6_P1_S3", order: 3, normalisedStep: "Explicitly compare the unequal values.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [M3], dependsOnStepIds: ["Q6_P1_S2"], requiredOperations: ["COMPARE"], resultingStateSummary: "12100 is not equal to 12850", sourceEvidence: [evidence] },
      { id: "Q6_P1_S4", order: 4, normalisedStep: "Conclude the relevant angle is not right-angled.", linkedQuestionSubgoalIds: ["Q6_S3"], linkedMarkIds: [M4], dependsOnStepIds: ["Q6_P1_S3"], requiredOperations: ["CONCLUDE"], resultingStateSummary: "No", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P2, P3], materiallyDistinctFromMethodIds: [P2, P3], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: P2, variantId: "EXPECTED_HYPOTENUSE", evidenceRole: "FULL_CREDIT_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q6_P2_S1", order: 1, normalisedStep: "Calculate the hypotenuse a right triangle would have from sides 85 and 75.", linkedQuestionSubgoalIds: ["Q6_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["PYTHAGORAS"], resultingStateSummary: null, sourceEvidence: [evidence] },
      { id: "Q6_P2_S2", order: 2, normalisedStep: "Obtain 113.36 and explicitly compare it with the actual 110.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [M2, M3], dependsOnStepIds: ["Q6_P2_S1"], requiredOperations: ["SQUARE_ROOT", "COMPARE"], resultingStateSummary: "113.36>110", sourceEvidence: [evidence] },
      { id: "Q6_P2_S3", order: 3, normalisedStep: "Conclude the actual triangle is not right-angled.", linkedQuestionSubgoalIds: ["Q6_S3"], linkedMarkIds: [M4], dependsOnStepIds: ["Q6_P2_S2"], requiredOperations: ["CONCLUDE"], resultingStateSummary: "No", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P1, P3], materiallyDistinctFromMethodIds: [P1, P3], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: P3, variantId: "COSINE_RULE_ANGLE", evidenceRole: "FULL_CREDIT_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q6_P3_S1", order: 1, normalisedStep: "Use the cosine rule with sides 85, 75 and 110 for the angle at Lowtown.", linkedQuestionSubgoalIds: ["Q6_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["COSINE_RULE"], resultingStateSummary: null, sourceEvidence: [evidence] },
      { id: "Q6_P3_S2", order: 2, normalisedStep: "Calculate about 86.6 degrees and explicitly compare it with 90 degrees.", linkedQuestionSubgoalIds: ["Q6_S2"], linkedMarkIds: [M2, M3], dependsOnStepIds: ["Q6_P3_S1"], requiredOperations: ["INVERSE_COS", "COMPARE"], resultingStateSummary: "86.6<90", sourceEvidence: [evidence] },
      { id: "Q6_P3_S3", order: 3, normalisedStep: "Conclude the angle is not right-angled and the direct-north claim is false.", linkedQuestionSubgoalIds: ["Q6_S3"], linkedMarkIds: [M4], dependsOnStepIds: ["Q6_P3_S2"], requiredOperations: ["CONCLUDE"], resultingStateSummary: "No", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P1, P2], materiallyDistinctFromMethodIds: [P1, P2], excludedMethodReasons: [], sourceEvidence: [evidence] },
  ],
  methodEquivalence: { equivalentMethodGroups: [{ id: "Q6_EQUIV_FULL", methodIds: [P1, P2, P3], equivalenceReason: "The source explicitly defines three full-credit right-angle verification methods with the same four-mark structure.", sourceEvidence: [evidence] }], methodEligibilityRules: [] },
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source requires justification but does not state a separate aggregate answer-only award."), [M1, M2, M3], [M4], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { contextualWording: "REQUIRED_FOR_MARK", otherConditions: ["An explicit comparison is required for M3.", "The final conclusion must refer to the angle not being right-angled for M4."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q6_CR_NO_EXPLICIT_COMPARE", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "IMPLICIT_COMPARISON_ONLY", normalisedResponse: "Calculate the relevant right-triangle value and give a valid right-angle conclusion without explicitly writing the comparison.", affectedMarkIds: [M3], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D1], sourceEvidence: [evidence] },
    { id: "Q6_CR_DIRECTION_ONLY", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "NO_RIGHT_ANGLE_REFERENCE", normalisedResponse: "Complete the mathematical comparison but conclude only that Hightown is not due north, without referring to the angle not being right-angled.", affectedMarkIds: [M4], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] },
    { id: "Q6_CR_INVALID_BEARING", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "INVALID_BEARING_JUSTIFICATION", normalisedResponse: "Use an unsupported statement that the bearing is about 87 degrees rather than 90 degrees as the only conclusion.", affectedMarkIds: [M4], marksAwarded: null, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D3], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2, D3] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q6_MAIN", markIds: [M1, M2, M3, M4] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q6_S1", markIds: [M1] }, { questionSubgoalId: "Q6_S2", markIds: [M2, M3] }, { questionSubgoalId: "Q6_S3", markIds: [M4] }],
    promptInstructionConsequences: [{ instructionType: "JUSTIFY", markingConsequence: "The justification is decomposed into strategy, evaluation, explicit comparison and a right-angle-based conclusion.", affectedMarkIds: [M1, M2, M3, M4], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q6_INFO_WEST", usedByMethodIds: [P1, P2, P3], supportsMarkIds: [M4] }, { questionInformationId: "Q6_INFO_LM", usedByMethodIds: [P1, P2, P3], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q6_INFO_MH", usedByMethodIds: [P1, P2, P3], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q6_INFO_HL", usedByMethodIds: [P1, P2, P3], supportsMarkIds: [M1, M2, M3] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q6", normalisedEvidence: "The diagram reinforces the town triangle and due-west orientation but does not itself prove a right angle.", supportsMarkIds: [M1, M4] }],
    crossPartDependencies: [], errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([17], "MULTI_METHOD_TABLE_ROW", 3, 4, 0),
  consistency: notReviewedConsistency(comparisonKey("P2_Q6_MARKING_COMPARISON", question.family.familyId, ["geo-g04-pythagoras"], 4, ["CONCLUSION"], ["alternative proof methods", "explicit comparison", "conclusion wording", "independence of comparison and conclusion marks"]), [
    consistencyFeature("explicit_full_credit_method_count", 3, "Three distinct right-angle tests are explicitly mapped to full credit.", [evidence]),
    consistencyFeature("comparison_must_be_explicit", true, "The third mark is unavailable when the comparison is only implied.", [evidence]),
    consistencyFeature("conclusion_requires_right_angle_reference", true, "The fourth mark specifically requires reference to the angle not being right-angled.", [evidence]),
    consistencyFeature("conclusion_can_survive_missing_comparison_mark", true, "The source explicitly awards 3/4 when the comparison is omitted but the conclusion is otherwise valid.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("6", "P2", 2014),
} satisfies AnswerCatalogEntry;
