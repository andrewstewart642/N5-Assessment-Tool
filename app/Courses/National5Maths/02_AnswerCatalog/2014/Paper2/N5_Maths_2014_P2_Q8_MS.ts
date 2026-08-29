import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q8 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q8";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("8", 19, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q8_M1";
const M2 = "N5_MATH_2014_P2_Q8_M2";
const M3 = "N5_MATH_2014_P2_Q8_M3";
const P1 = "N5_MATH_2014_P2_Q8_METHOD_INDEX_SIMPLIFICATION";
const D_FULL = "N5_MATH_2014_P2_Q8_D_ANSWER_ONLY_FULL";
const D_OVER_ONE = "N5_MATH_2014_P2_Q8_D_OVER_ONE";
const D_5N3_NOWORK = "N5_MATH_2014_P2_Q8_D_5N3_NO_WORK";

export const N5_MATHS_2014_P2_Q8_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "8", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 3, sourcePages: [19], printedPageLabels: ["Page nineteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["EXPRESSION"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q8_A1", normalisedAnswer: "5n^4", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: ["5n^3", "5n^4/1"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_FULL, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The correct simplified expression without working receives all three marks.", appliesToPartIds: ["Q8_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_OVER_ONE, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Leaving the otherwise correct expression over a denominator of one receives two marks, with the source withholding the constant-cancellation mark while retaining the other two marks.", appliesToPartIds: ["Q8_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_5N3_NOWORK, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The incorrect final expression 5n^3 without working is explicitly awarded one mark; the source does not identify that one-mark total with a specific mark node in this note.", appliesToPartIds: ["Q8_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q8_MAIN", "PROCESS", "Simplify the product of powers in the numerator.", "Combine same-base powers in the numerator.", ["num-n2-indices"], ["num-n2-1"], ["Q8_S2"], [evidence], { illustrativeEvidence: [{ id: "Q8_M1_E1", normalisedEvidence: "Obtain 10n^6 in the numerator.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL] }),
    markNode(M2, 2, "Q8_MAIN", "PROCESS", "Cancel the numerical constants correctly.", "Reduce the coefficient from 10/2 to 5.", ["num-n2-indices"], ["num-n2-1"], ["Q8_S1"], [evidence], { illustrativeEvidence: [{ id: "Q8_M2_E1", normalisedEvidence: "Reduce the coefficient to obtain 5n^6/n^2 or equivalent.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL, D_OVER_ONE] }),
    markNode(M3, 3, "Q8_MAIN", "PROCESS", "Eliminate the variable from the denominator using the index law for division.", "Complete the same-base division to the final power.", ["num-n2-indices"], ["num-n2-1"], ["Q8_S3"], [evidence], { secondaryTypes: ["ACCURACY"], illustrativeEvidence: [{ id: "Q8_M3_E1", normalisedEvidence: "Subtract denominator exponent 2 from numerator exponent 6 to obtain 5n^4.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q8_P1_S1", order: 1, normalisedStep: "Combine numerator powers to form 10n^6.", linkedQuestionSubgoalIds: ["Q8_S2"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["MULTIPLY_POWERS"], resultingStateSummary: "10n^6/(2n^2)", sourceEvidence: [evidence] },
    { id: "Q8_P1_S2", order: 2, normalisedStep: "Cancel the numerical factor 10/2 to 5.", linkedQuestionSubgoalIds: ["Q8_S1"], linkedMarkIds: [M2], dependsOnStepIds: ["Q8_P1_S1"], requiredOperations: ["SIMPLIFY_COEFFICIENT"], resultingStateSummary: "5n^6/n^2", sourceEvidence: [evidence] },
    { id: "Q8_P1_S3", order: 3, normalisedStep: "Apply the quotient index law to obtain exponent 4.", linkedQuestionSubgoalIds: ["Q8_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q8_P1_S2"], requiredOperations: ["DIVIDE_POWERS"], resultingStateSummary: "5n^4", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [D_FULL, D_OVER_ONE, D_5N3_NOWORK], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 3, [M1, M2, M3], [evidence], [D_FULL]), [], [M1, M2, M3], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { simplification: "REQUIRED_FOR_FULL_CREDIT", otherConditions: ["The source explicitly distinguishes 5n^4 from the unreduced presentation 5n^4/1."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q8_CR_OVER_ONE", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "DENOMINATOR_ONE_RETAINED", normalisedResponse: "Give 5n^4/1 as the final answer.", affectedMarkIds: [M2], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_OVER_ONE], sourceEvidence: [evidence] },
    { id: "Q8_CR_5N3_WRONG_NUMERATOR", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "NUMERATOR_INDEX_ERROR", normalisedResponse: "Use 10n^5 over 2n^2 and simplify to 5n^3.", affectedMarkIds: [M1], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q8_CR_5N3_FINAL_INDEX", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "FINAL_INDEX_ERROR", normalisedResponse: "Correctly form 10n^6 over 2n^2 but finish at 5n^3.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q8_CR_COMPENSATING_INDEX_ERRORS", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "COMPENSATING_INDEX_ERRORS", normalisedResponse: "Use n^4 times 10n over 2n and simplify through coefficient cancellation to 5n^3.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q8_CR_5N3_NO_WORK", sourceStatus: "EXPLICITLY_LISTED", category: "ANSWER_ONLY", errorFamily: "INCORRECT_POWER_ANSWER_ONLY", normalisedResponse: "State 5n^3 without working.", affectedMarkIds: [M1, M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D_5N3_NOWORK], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_FULL, D_OVER_ONE, D_5N3_NOWORK] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q8_MAIN", markIds: [M1, M2, M3] }], subgoalMarkMap: [{ questionSubgoalId: "Q8_S1", markIds: [M2] }, { questionSubgoalId: "Q8_S2", markIds: [M1] }, { questionSubgoalId: "Q8_S3", markIds: [M3] }],
    promptInstructionConsequences: [{ instructionType: "SIMPLIFY", markingConsequence: "The source differentiates complete simplified form from an otherwise equivalent expression retaining denominator one.", affectedMarkIds: [M2, M3], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q8_INFO_EXPR", usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }], representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([19], "TABLE_ROW", 1, 3, 5),
  consistency: notReviewedConsistency(comparisonKey("Q8_MARKING_COMPARISON", question.family.familyId, ["num-n2-indices"], 3, ["EXPRESSION"], ["answer-only credit", "component index errors", "presentation over denominator one", "compensating errors"]), [
    consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The correct final expression without working explicitly receives all three marks.", [evidence]),
    consistencyFeature("incorrect_5n3_answer_only_marks", 1, "The source explicitly awards one mark to 5n^3 without working without identifying that total with a specific mark node.", [evidence]),
    consistencyFeature("source_preserves_nonintuitive_mark_patterns", true, "Different routes to the same incorrect 5n^3 final expression receive different mark combinations according to the displayed working.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("8", "P2", 2014),
} satisfies AnswerCatalogEntry;
