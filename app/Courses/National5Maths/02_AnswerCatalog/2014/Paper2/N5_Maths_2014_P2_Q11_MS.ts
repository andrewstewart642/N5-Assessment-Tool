import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q11 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q11";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("11", 20, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q11_M1";
const M2 = "N5_MATH_2014_P2_Q11_M2";
const M3 = "N5_MATH_2014_P2_Q11_M3";
const P1 = "N5_MATH_2014_P2_Q11_METHOD_REARRANGE";
const D_FULL = "N5_MATH_2014_P2_Q11_D_ANSWER_ONLY";
const D_LATER = "N5_MATH_2014_P2_Q11_D_LATER_INVALID";
const D_HALF = "N5_MATH_2014_P2_Q11_D_HALF_DENOMINATOR";

export const N5_MATHS_2014_P2_Q11_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "11", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 3, sourcePages: [20], printedPageLabels: ["Page twenty"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["EQUATION"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q11_A1", normalisedAnswer: "a = 2(s-ut)/t^2", numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P2_Q11_A2"], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [{ id: "N5_MATH_2014_P2_Q11_A2", normalisedAnswer: "a = (s-ut)/((1/2)t^2)", numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P2_Q11_A1"], conditionsForAcceptance: ["The historical source explicitly awards this mathematically equivalent form 2/3 rather than full credit."], sourceEvidence: [evidence], notes: "Equivalent algebraically, but source-specific mark allocation withholds the multiply-by-two mark." }],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_FULL, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The fully rearranged correct answer without working receives all three marks.", appliesToPartIds: ["Q11_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_LATER, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Subsequent incorrect working after reaching the correct result makes the final mark unavailable.", appliesToPartIds: ["Q11_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D_HALF, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Leaving the one-half factor in the denominator as a=(s-ut)/((1/2)t^2) receives two marks.", appliesToPartIds: ["Q11_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q11_MAIN", "PROCESS", "Subtract ut from both sides so the term containing a is isolated from the additive term.", "Perform the first inverse operation.", ["alg-a09-change-subject"], ["alg-a9-1"], ["Q11_S1"], [evidence], { illustrativeEvidence: [{ id: "Q11_M1_E1", normalisedEvidence: "Obtain s-ut = (1/2)at^2.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL] }),
    markNode(M2, 2, "Q11_MAIN", "PROCESS", "Remove the factor one-half by multiplying by two.", "Clear the fractional coefficient on the a term.", ["alg-a09-change-subject"], ["alg-a9-1"], ["Q11_S2"], [evidence], { illustrativeEvidence: [{ id: "Q11_M2_E1", normalisedEvidence: "Obtain 2(s-ut)=at^2.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL, D_HALF] }),
    markNode(M3, 3, "Q11_MAIN", "PROCESS", "Divide by t^2 to make a the subject.", "Complete the rearrangement to the source's full-credit form.", ["alg-a09-change-subject"], ["alg-a9-1"], ["Q11_S2"], [evidence], { secondaryTypes: ["ACCURACY", "PRESENTATION"], illustrativeEvidence: [{ id: "Q11_M3_E1", normalisedEvidence: "State a = 2(s-ut)/t^2.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], blockingConditions: ["Subsequent invalid working after the correct result blocks this mark."], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL, D_LATER, D_HALF] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q11_P1_S1", order: 1, normalisedStep: "Subtract ut from both sides.", linkedQuestionSubgoalIds: ["Q11_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["SUBTRACT"], resultingStateSummary: "s-ut=(1/2)at^2", sourceEvidence: [evidence] },
    { id: "Q11_P1_S2", order: 2, normalisedStep: "Multiply both sides by two.", linkedQuestionSubgoalIds: ["Q11_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q11_P1_S1"], requiredOperations: ["MULTIPLY"], resultingStateSummary: "2(s-ut)=at^2", sourceEvidence: [evidence] },
    { id: "Q11_P1_S3", order: 3, normalisedStep: "Divide by t^2.", linkedQuestionSubgoalIds: ["Q11_S2"], linkedMarkIds: [M3], dependsOnStepIds: ["Q11_P1_S2"], requiredOperations: ["DIVIDE"], resultingStateSummary: "a=2(s-ut)/t^2", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [D_FULL, D_HALF], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 3, [M1, M2, M3], [evidence], [D_FULL]), [], [M1, M2, M3], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { simplification: "REQUIRED_FOR_FULL_CREDIT", otherConditions: ["The mathematically equivalent form with one-half retained in the denominator is explicitly limited to 2/3 by the source."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q11_CR_HALF_DENOM", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "FRACTIONAL_COEFFICIENT_NOT_CLEARED", normalisedResponse: "State a=(s-ut)/((1/2)t^2).", affectedMarkIds: [M2], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_HALF], sourceEvidence: [evidence] },
    { id: "Q11_CR_CORRECT_THEN_INVALID", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "SUBSEQUENT_INVALID_WORK", normalisedResponse: "Reach the correct rearrangement and then perform an invalid further manipulation.", affectedMarkIds: [M3], marksAwarded: null, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_LATER], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_FULL, D_LATER, D_HALF] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q11_MAIN", markIds: [M1, M2, M3] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q11_S1", markIds: [M1] }, { questionSubgoalId: "Q11_S2", markIds: [M2, M3] }],
    promptInstructionConsequences: [{ instructionType: "CHANGE_SUBJECT", markingConsequence: "Full credit requires the target variable to be isolated in the source's completed rearranged form; a mathematically equivalent uncleared one-half form is explicitly capped at two marks.", affectedMarkIds: [M2, M3], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q11_INFO_FORMULA", usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q11_INFO_TARGET", usedByMethodIds: [P1], supportsMarkIds: [M3] }],
    representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([20], "TABLE_ROW", 1, 3, 2),
  consistency: notReviewedConsistency(comparisonKey("P2_Q11_MARKING_COMPARISON", question.family.familyId, ["alg-a09-change-subject"], 3, ["EQUATION"], ["answer-only credit", "equivalent-form treatment", "later invalid work", "rearrangement stages"]), [
    consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The completed correct rearrangement without working explicitly receives all three marks.", [evidence]),
    consistencyFeature("equivalent_half_denominator_form_max_marks", 2, "A mathematically equivalent form retaining the one-half denominator is explicitly awarded 2/3.", [evidence]),
    consistencyFeature("later_invalid_work_can_remove_final_mark", true, "A question-specific note blocks the final mark after subsequent incorrect working.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("11", "P2", 2014),
} satisfies AnswerCatalogEntry;
