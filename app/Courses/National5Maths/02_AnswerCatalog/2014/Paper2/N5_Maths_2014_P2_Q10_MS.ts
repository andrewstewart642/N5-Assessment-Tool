import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q10 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q10";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("10", 20, "MARKING_SCHEME", "P2", 2014);
const A1 = "N5_MATH_2014_P2_Q10_A_M1";
const A2 = "N5_MATH_2014_P2_Q10_A_M2";
const A3 = "N5_MATH_2014_P2_Q10_A_M3";
const B1 = "N5_MATH_2014_P2_Q10_B_M1";
const B2 = "N5_MATH_2014_P2_Q10_B_M2";
const P1 = "N5_MATH_2014_P2_Q10_METHOD_COSINE_THEN_BEARING";
const D_MODE = "N5_MATH_2014_P2_Q10_D_MODE_VARIANTS";
const D_M2 = "N5_MATH_2014_P2_Q10_D_M2_INVERSE_EXPRESSION";

export const N5_MATHS_2014_P2_Q10_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "10", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 5, sourcePages: [20], printedPageLabels: ["Page twenty"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P2_Q10_A1", normalisedAnswer: "84.8 degrees (85 degrees accepted by the illustrated accuracy)", numericValue: 84.8, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Part (a)." },
      { id: "N5_MATH_2014_P2_Q10_A2", normalisedAnswer: "155.2 degrees", numericValue: 155.2, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Part (b) uses the candidate's part (a) angle within a valid bearing strategy."], sourceEvidence: [evidence], notes: "Part (b)." },
    ],
    acceptedEquivalentForms: [
      { id: "N5_MATH_2014_P2_Q10_A3", normalisedAnswer: "1.48 from radian-mode inverse cosine", numericValue: 1.48, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["With working, the source awards all 3 marks for part (a)."], sourceEvidence: [evidence], notes: "Calculator-mode variant explicitly credited by the historical source." },
      { id: "N5_MATH_2014_P2_Q10_A4", normalisedAnswer: "94.2 from grad-mode inverse cosine", numericValue: 94.2, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["With working, the source awards all 3 marks for part (a)."], sourceEvidence: [evidence], notes: "Calculator-mode variant explicitly credited by the historical source." },
    ],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("angle", "degrees"), requiredContextStatement: false, answerCountRequired: 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_MODE, layer: "QUESTION_NOTE", scope: "PART", effect: "AWARD", normalisedSummary: "Part (a) receives all three marks for the stated radian-mode or grad-mode angle outputs when the working is shown.", appliesToPartIds: ["Q10_a"], appliesToMarkIds: [A1, A2, A3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_M2, layer: "QUESTION_NOTE", scope: "MARK", effect: "ACCEPT", normalisedSummary: "The second part-(a) mark may be evidenced by applying inverse cosine directly to the correctly formed ratio 16/176, without separately writing the decimal cosine value.", appliesToPartIds: ["Q10_a"], appliesToMarkIds: [A2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(A1, 1, "Q10_a", "PROCESS", "Substitute the three side lengths correctly into the cosine rule for angle ABC.", "Set up the SSS cosine-rule calculation.", ["trig-t04-cosine-rule"], ["trig-t4-2"], ["Q10_S1"], [evidence], { illustrativeEvidence: [{ id: "Q10_A_M1_E1", normalisedEvidence: "Form cos B = (8^2+11^2-13^2)/(2x8x11).", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: ["VIS_Q10"], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_MODE] }),
    markNode(A2, 2, "Q10_a", "PROCESS", "Calculate the cosine value correctly, or give the explicitly accepted equivalent inverse-cosine expression.", "Evaluate the correctly substituted cosine-rule ratio.", ["trig-t04-cosine-rule"], ["trig-t4-2"], ["Q10_S1"], [evidence], { illustrativeEvidence: [{ id: "Q10_A_M2_E1", normalisedEvidence: "Obtain cos B approximately 0.09, or use inverse cosine of 16/176 as explicitly accepted evidence.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_MODE, D_M2] }),
    markNode(A3, 3, "Q10_a", "ACCURACY", "Calculate angle ABC correctly.", "Complete the inverse-cosine evaluation.", ["trig-t04-cosine-rule"], ["trig-t4-2"], ["Q10_S1"], [evidence], { illustrativeEvidence: [{ id: "Q10_A_M3_E1", normalisedEvidence: "Obtain approximately 84.8 degrees; the source illustration also accepts 85.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_MODE] }),
    markNode(B1, 1, "Q10_b", "METHOD", "Use a valid bearing-angle strategy involving the part (a) angle.", "Translate the bearing geometry into an angle calculation.", ["trig-t05-bearings"], ["trig-t5-1"], ["Q10_S2", "Q10_S3"], [evidence], { illustrativeEvidence: [{ id: "Q10_B_M1_E1", normalisedEvidence: "Use 360 - 120 - [answer to part (a)], or an equivalent bearing construction.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: ["VIS_Q10"], sourceEvidence: [evidence] }], dependencies: [{ type: "FOLLOW_THROUGH_FROM", relatedMarkIds: [A3], relatedQuestionPartIds: ["Q10_a"], conditionSummary: "Part (b) is explicitly expressed using the candidate's answer to part (a).", sourceEvidence: [evidence] }], followThrough: { allowed: true, fromMarkIds: [A3], fromQuestionPartIds: ["Q10_a"], requiresComparableDifficulty: false, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: false, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The illustrated method directly references the answer to part (a)." }, methodPathwayIds: [P1] }),
    markNode(B2, 2, "Q10_b", "ACCURACY", "Calculate the required bearing-related angle correctly within a valid strategy.", "Complete the part (b) angle calculation.", ["trig-t05-bearings"], ["trig-t5-1"], ["Q10_S3"], [evidence], { illustrativeEvidence: [{ id: "Q10_B_M2_E1", normalisedEvidence: "Obtain 155.2 degrees from the valid strategy using the degree-mode part (a) value.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "FOLLOW_THROUGH_FROM", relatedMarkIds: [A3], relatedQuestionPartIds: ["Q10_a"], conditionSummary: "The numerical result is assessed within a valid strategy using the candidate's part (a) result.", sourceEvidence: [evidence] }], followThrough: { allowed: true, fromMarkIds: [A3], fromQuestionPartIds: ["Q10_a"], requiresComparableDifficulty: false, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: false, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: null }, methodPathwayIds: [P1] }),
  ],
  methodPathways: [{ id: P1, variantId: "COSINE_RULE_THEN_BEARING", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q10_P1_S1", order: 1, normalisedStep: "Apply the cosine rule to the three side lengths and calculate angle ABC.", linkedQuestionSubgoalIds: ["Q10_S1"], linkedMarkIds: [A1, A2, A3], dependsOnStepIds: [], requiredOperations: ["COSINE_RULE", "INVERSE_COS"], resultingStateSummary: "ABC approximately 84.8 degrees", sourceEvidence: [evidence] },
    { id: "Q10_P1_S2", order: 2, normalisedStep: "Use the 060-degree bearing and parallel north references to identify the 120-degree component used in part (b).", linkedQuestionSubgoalIds: ["Q10_S2"], linkedMarkIds: [B1], dependsOnStepIds: [], requiredOperations: ["INTERPRET_BEARING"], resultingStateSummary: "120-degree component", sourceEvidence: [evidence] },
    { id: "Q10_P1_S3", order: 3, normalisedStep: "Combine the bearing component with the part (a) angle to find the requested angle.", linkedQuestionSubgoalIds: ["Q10_S3"], linkedMarkIds: [B1, B2], dependsOnStepIds: ["Q10_P1_S1", "Q10_P1_S2"], requiredOperations: ["SUBTRACT"], resultingStateSummary: "155.2 degrees", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [D_MODE], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: { ...workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source does not state a general correct-answer-without-working award for the ordinary degree-mode response."), [A1, A2], [A3, B1, B2], "P2", 2014), partSpecificAnswerOnly: [
    { questionPartId: "Q10_a", profile: answerOnly("NOT_STATED", null, [], [evidence], [], ["The special RAD/GRAD full-credit rule explicitly requires working; the ordinary degree-mode answer-only treatment is not stated."], null) },
    { questionPartId: "Q10_b", profile: answerOnly("NOT_STATED", null, [], [evidence], [], [], "No separate answer-only total is stated for part (b).") },
  ] },
  presentationPolicy: presentationPolicy([evidence], { degreeSymbol: "NOT_STATED", otherConditions: ["The source explicitly credits radian- and grad-mode outputs in part (a) when working is shown."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q10_CR_RAD", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "RAD_MODE", normalisedResponse: "Obtain about 1.48 from the correct cosine-rule working in radian mode.", affectedMarkIds: [], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D_MODE], sourceEvidence: [evidence] },
    { id: "Q10_CR_GRAD", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "GRAD_MODE", normalisedResponse: "Obtain about 94.2 from the correct cosine-rule working in grad mode.", affectedMarkIds: [], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D_MODE], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_MODE, D_M2] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q10_a", markIds: [A1, A2, A3] }, { questionPartId: "Q10_b", markIds: [B1, B2] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q10_S1", markIds: [A1, A2, A3] }, { questionSubgoalId: "Q10_S2", markIds: [B1] }, { questionSubgoalId: "Q10_S3", markIds: [B1, B2] }],
    promptInstructionConsequences: [{ instructionType: "HENCE", markingConsequence: "Part (b) is explicitly dependent on the angle found in part (a), with follow-through available within a valid strategy.", affectedMarkIds: [B1, B2], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q10_INFO_AB", usedByMethodIds: [P1], supportsMarkIds: [A1, A2, A3] }, { questionInformationId: "Q10_INFO_BC", usedByMethodIds: [P1], supportsMarkIds: [A1, A2, A3] }, { questionInformationId: "Q10_INFO_AC", usedByMethodIds: [P1], supportsMarkIds: [A1, A2, A3] }, { questionInformationId: "Q10_INFO_BEARING", usedByMethodIds: [P1], supportsMarkIds: [B1, B2] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q10", normalisedEvidence: "The navigation diagram supplies the bearing orientation and the relationship between the route triangle and north references.", supportsMarkIds: [B1, B2] }],
    crossPartDependencies: ["Part (b) uses the candidate's angle from part (a)."],
    errorPropagationGraph: [{ sourceMarkIds: [A3], sourceQuestionPartIds: ["Q10_a"], affectedMarkIds: [B1, B2], survivingMarkIds: [B1, B2], conditionSummary: "A valid part-(b) strategy may use the candidate's part-(a) angle consistently.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([20], "MULTIPART_TABLE_ROW", 1, 2, 2),
  consistency: notReviewedConsistency(comparisonKey("P2_Q10_MARKING_COMPARISON", question.family.familyId, ["trig-t04-cosine-rule", "trig-t05-bearings"], 5, ["NUMBER"], ["calculator mode", "implied cosine evidence", "hence follow-through", "bearing geometry"]), [
    consistencyFeature("rad_grad_full_credit_with_working", true, "Part (a) explicitly awards 3/3 to specified RAD/GRAD outputs when working is shown.", [evidence]),
    consistencyFeature("inverse_expression_can_supply_second_mark", true, "The second mark can be awarded from the accepted inverse-cosine expression without a separately displayed decimal cosine value.", [evidence]),
    consistencyFeature("part_b_uses_part_a_result", true, "The illustrated bearing strategy explicitly uses the answer to part (a).", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("10", "P2", 2014),
} satisfies AnswerCatalogEntry;
