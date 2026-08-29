import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q4 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q4";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("4", 15, "MARKING_SCHEME", "P2", 2014);
const A1 = "N5_MATH_2014_P2_Q4_A_I_M1";
const A2_1 = "N5_MATH_2014_P2_Q4_A_II_M1";
const A2_2 = "N5_MATH_2014_P2_Q4_A_II_M2";
const A2_3 = "N5_MATH_2014_P2_Q4_A_II_M3";
const B1 = "N5_MATH_2014_P2_Q4_B_M1";
const P1 = "N5_MATH_2014_P2_Q4_METHOD_SD_DEVIATIONS";
const P2 = "N5_MATH_2014_P2_Q4_METHOD_SD_ALTERNATIVE_FORMULA";
const D1 = "N5_MATH_2014_P2_Q4_D_MEAN_NO_ROUND";
const D2 = "N5_MATH_2014_P2_Q4_D_SD_ANSWER_ONLY";
const D3 = "N5_MATH_2014_P2_Q4_D_B_CONSISTENT";
const D4 = "N5_MATH_2014_P2_Q4_D_B_SD_ONLY";
const D5 = "N5_MATH_2014_P2_Q4_D_B_VAGUE";

export const N5_MATHS_2014_P2_Q4_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "4", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 5, sourcePages: [15], printedPageLabels: ["Page fifteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["MIXED"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P2_Q4_A1", normalisedAnswer: "56.5", numericValue: 56.5, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Do not round this mean to 57."], sourceEvidence: [evidence], notes: "Part (a)(i)." },
      { id: "N5_MATH_2014_P2_Q4_A2", normalisedAnswer: "2.4 (approximately 2.42...)", numericValue: 2.4, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Part (a)(ii)." },
      { id: "N5_MATH_2014_P2_Q4_A3", normalisedAnswer: "No; the new standard deviation is greater, so the times are more spread out.", numericValue: null, answerForm: "PROSE", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The reasoning must be based on standard deviation and must be consistent with the candidate's part (a)(ii) result."], sourceEvidence: [evidence], notes: "Part (b)." },
    ],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("time", "s"), requiredContextStatement: true, answerCountRequired: 3, invalidRelatedValues: ["57 as the rounded mean"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "PART", effect: "BLOCK", normalisedSummary: "Rounding the mean 56.5 to 57 is not accepted for part (a)(i).", appliesToPartIds: ["Q4_a_i"], appliesToMarkIds: [A1], appliesToMethodIds: [], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "PART", effect: "BLOCK", normalisedSummary: "The correct standard deviation without working receives no marks for part (a)(ii).", appliesToPartIds: ["Q4_a_ii"], appliesToMarkIds: [A2_1, A2_2, A2_3], appliesToMethodIds: [P1, P2], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
    { id: D3, layer: "QUESTION_NOTE", scope: "PART", effect: "FOLLOW_THROUGH", normalisedSummary: "The part (b) conclusion and explanation must be consistent with the candidate's standard-deviation result from part (a)(ii).", appliesToPartIds: ["Q4_b"], appliesToMarkIds: [B1], appliesToMethodIds: [], marksAwarded: null, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D4, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The part (b) reason must clearly be based on standard deviation/spread rather than another statistic.", appliesToPartIds: ["Q4_b"], appliesToMarkIds: [B1], appliesToMethodIds: [], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D5, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "A statement that the times are less consistent, without further explanation linking this to spread or standard deviation, is insufficient.", appliesToPartIds: ["Q4_b"], appliesToMarkIds: [B1], appliesToMethodIds: [], marksAwarded: 0, maximumMarks: 0, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(A1, 1, "Q4_a_i", "PROCESS", "Calculate the mean of the six lap times.", "Determine the arithmetic mean without the source-rejected rounding.", ["stat-s01-mean-sd"], ["stat-s1-2"], ["Q4_S1"], [evidence], { illustrativeEvidence: [{ id: "Q4_A1_E1", normalisedEvidence: "Obtain a mean of 56.5 seconds.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], blockingConditions: ["57 is not accepted as a rounded replacement for 56.5."], sourceDirectiveIds: [D1] }),
    markNode(A2_1, 1, "Q4_a_ii", "PROCESS", "Establish the first-stage quantities required by a valid sample-standard-deviation formula.", "Generate squared deviations or the corresponding summary totals.", ["stat-s01-mean-sd"], ["stat-s1-2"], ["Q4_S2"], [evidence], {
      pathwaySpecificRequirements: [
        { methodPathwayId: P1, normalisedRequirement: "Calculate the six squared deviations from the mean.", sourceEvidence: [evidence] },
        { methodPathwayId: P2, normalisedRequirement: "Calculate the sum of values and the sum of squared values.", sourceEvidence: [evidence] },
      ], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D2],
    }),
    markNode(A2_2, 2, "Q4_a_ii", "PROCESS", "Substitute the calculated quantities into a valid sample-standard-deviation formula.", "Form the variance calculation with denominator n-1.", ["stat-s01-mean-sd"], ["stat-s1-2"], ["Q4_S2"], [evidence], { methodPathwayIds: [P1, P2], sourceDirectiveIds: [D2] }),
    markNode(A2_3, 3, "Q4_a_ii", "ACCURACY", "Calculate the sample standard deviation.", "Complete the calculation to approximately 2.4 seconds.", ["stat-s01-mean-sd"], ["stat-s1-2"], ["Q4_S2"], [evidence], { illustrativeEvidence: [{ id: "Q4_A2_M3_E1", normalisedEvidence: "Obtain approximately 2.4, with the source illustration showing 2.4(2...).", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D2] }),
    markNode(B1, 1, "Q4_b", "JUSTIFICATION", "Give a yes/no conclusion with a valid explanation based only on the standard deviations/spread.", "Interpret the change in spread as a change in consistency.", ["stat-s01-mean-sd"], ["stat-s1-2"], ["Q4_S3"], [evidence], {
      secondaryTypes: ["CONCLUSION", "INTERPRETATION"],
      illustrativeEvidence: [{ id: "Q4_B1_E1", normalisedEvidence: "State No because 3.2 is greater than the candidate's original standard deviation, so the new times are more spread out.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      dependencies: [{ type: "CONSISTENT_WITH_EARLIER_RESULT", relatedMarkIds: [A2_3], relatedQuestionPartIds: ["Q4_a_ii"], conditionSummary: "The conclusion must use the candidate's own standard-deviation result consistently.", sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [A2_3], fromQuestionPartIds: ["Q4_a_ii"], requiresComparableDifficulty: false, blockedForRequiredResult: false, blockedByInvalidMathematicalState: false, blockedByTrivialisedLaterWork: false, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly conditions part (b) on consistency with part (a)(ii)." },
      eligibilityConditions: ["Reason must be based on standard deviation/spread only."], blockingConditions: ["A bare 'less consistent' statement without explanation is insufficient."], sourceDirectiveIds: [D3, D4, D5],
    }),
  ],
  methodPathways: [
    { id: P1, variantId: "SQUARED_DEVIATIONS", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q4_P1_S1", order: 1, normalisedStep: "Calculate the squared deviations from the mean.", linkedQuestionSubgoalIds: ["Q4_S2"], linkedMarkIds: [A2_1], dependsOnStepIds: [], requiredOperations: ["SUBTRACT", "SQUARE"], resultingStateSummary: "six squared deviations summing to 29.5", sourceEvidence: [evidence] },
      { id: "Q4_P1_S2", order: 2, normalisedStep: "Divide the sum of squared deviations by 5 and take the square root.", linkedQuestionSubgoalIds: ["Q4_S2"], linkedMarkIds: [A2_2, A2_3], dependsOnStepIds: ["Q4_P1_S1"], requiredOperations: ["DIVIDE", "SQUARE_ROOT"], resultingStateSummary: "s≈2.4", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P2], materiallyDistinctFromMethodIds: [P2], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: P2, variantId: "ALTERNATIVE_SUM_FORMULA", evidenceRole: "ILLUSTRATIVE_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q4_P2_S1", order: 1, normalisedStep: "Calculate Σx and Σx².", linkedQuestionSubgoalIds: ["Q4_S2"], linkedMarkIds: [A2_1], dependsOnStepIds: [], requiredOperations: ["SUM", "SQUARE", "SUM"], resultingStateSummary: "Σx=339, Σx²=19183", sourceEvidence: [evidence] },
      { id: "Q4_P2_S2", order: 2, normalisedStep: "Substitute into the alternative sample-standard-deviation formula and evaluate.", linkedQuestionSubgoalIds: ["Q4_S2"], linkedMarkIds: [A2_2, A2_3], dependsOnStepIds: ["Q4_P2_S1"], requiredOperations: ["SUBSTITUTE", "DIVIDE", "SQUARE_ROOT"], resultingStateSummary: "s≈2.4", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P1], materiallyDistinctFromMethodIds: [P1], excludedMethodReasons: [], sourceEvidence: [evidence] },
  ],
  methodEquivalence: { equivalentMethodGroups: [{ id: "Q4_SD_EQUIV", methodIds: [P1, P2], equivalenceReason: "The source explicitly provides both sample-standard-deviation formulas as full-credit methods.", sourceEvidence: [evidence] }], methodEligibilityRules: [] },
  workingPolicy: {
    ...workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "Answer-only treatment differs across parts and is only explicit for part (a)(ii)."), [A2_1, A2_2, A2_3], [A1, B1], "P2", 2014),
    partSpecificAnswerOnly: [
      { questionPartId: "Q4_a_i", profile: answerOnly("NOT_STATED", null, [], [evidence], [], ["The question prompt explicitly asks for working, but the marking instructions do not state a separate answer-only total for this one-mark part."], null) },
      { questionPartId: "Q4_a_ii", profile: answerOnly("NO_CREDIT", 0, [], [evidence], [D2]) },
      { questionPartId: "Q4_b", profile: answerOnly("NOT_STATED", null, [], [evidence], [], [], "The mark itself is a reasoned conclusion, so the required explanation is direct mark-bearing evidence." ) },
    ],
  },
  presentationPolicy: presentationPolicy([evidence], { otherConditions: ["The mean 56.5 must not be replaced by 57.", "Part (b) must explicitly ground its reason in standard deviation/spread."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q4_CR_MEAN_57", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "ROUNDING_ERROR", errorFamily: "UNWANTED_MEAN_ROUNDING", normalisedResponse: "Round the exact mean 56.5 to 57.", affectedMarkIds: [A1], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [D1], sourceEvidence: [evidence] },
    { id: "Q4_CR_VAGUE_CONSISTENCY", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "UNSUPPORTED_CONSISTENCY_WORDING", normalisedResponse: "State that the new times are less consistent without explaining this using standard deviation or spread.", affectedMarkIds: [B1], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [D5], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2, D3, D4, D5] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q4_a_i", markIds: [A1] }, { questionPartId: "Q4_a_ii", markIds: [A2_1, A2_2, A2_3] }, { questionPartId: "Q4_b", markIds: [B1] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q4_S1", markIds: [A1] }, { questionSubgoalId: "Q4_S2", markIds: [A2_1, A2_2, A2_3] }, { questionSubgoalId: "Q4_S3", markIds: [B1] }],
    promptInstructionConsequences: [
      { instructionType: "SHOW_WORKING", markingConsequence: "The prompt explicitly requests working in both calculation parts; the marking instructions separately make answer-only treatment explicit only for part (a)(ii), where it is 0/3.", affectedMarkIds: [A1, A2_1, A2_2, A2_3], sourceEvidence: [evidence] },
      { instructionType: "GIVE_REASON", markingConsequence: "The part (b) mark requires an explanatory comparison grounded in standard deviation/spread.", affectedMarkIds: [B1], sourceEvidence: [evidence] },
    ],
    informationEvidenceMap: [{ questionInformationId: "Q4_INFO_DATA", usedByMethodIds: [P1, P2], supportsMarkIds: [A1, A2_1, A2_2, A2_3] }, { questionInformationId: "Q4_INFO_NEWSD", usedByMethodIds: [], supportsMarkIds: [B1] }, { questionInformationId: "Q4_INFO_CONS", usedByMethodIds: [], supportsMarkIds: [B1] }],
    representationEvidenceMap: [],
    crossPartDependencies: ["Part (b) must be marked consistently with the candidate's standard deviation from part (a)(ii)."],
    errorPropagationGraph: [{ sourceMarkIds: [A2_3], sourceQuestionPartIds: ["Q4_a_ii"], affectedMarkIds: [B1], survivingMarkIds: [B1], conditionSummary: "A part (b) conclusion can follow the candidate's own part (a)(ii) standard deviation when the comparison and explanation are internally consistent.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([15], "MULTIPART_TABLE_ROW", 2, 8, 0),
  consistency: notReviewedConsistency(comparisonKey("P2_Q4_MARKING_COMPARISON", question.family.familyId, ["stat-s01-mean-sd"], 5, ["MIXED"], ["show-working treatment", "alternative SD formulas", "cross-part consistency", "standard-deviation-only justification"]), [
    consistencyFeature("sd_answer_only_treatment", "NO_CREDIT", "The correct standard deviation without working explicitly receives 0/3.", [evidence]),
    consistencyFeature("explicit_sd_method_count", 2, "Two alternative sample-standard-deviation formulas are explicitly mapped to the same three marks.", [evidence]),
    consistencyFeature("part_b_reason_sd_only", true, "The final interpretation mark is available only when the reason is clearly based on standard deviation/spread.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("4", "P2", 2014),
} satisfies AnswerCatalogEntry;
