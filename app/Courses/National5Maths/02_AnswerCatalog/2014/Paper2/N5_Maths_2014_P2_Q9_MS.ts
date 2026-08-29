import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q9 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q9";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("9", 19, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q9_M1";
const M2 = "N5_MATH_2014_P2_Q9_M2";
const M3 = "N5_MATH_2014_P2_Q9_M3";
const P1 = "N5_MATH_2014_P2_Q9_METHOD_COMMON_DENOMINATOR";
const D_FULL = "N5_MATH_2014_P2_Q9_D_ANSWER_ONLY";
const D_SPLIT = "N5_MATH_2014_P2_Q9_D_SPLIT_UNCOLLECTED";
const D_LATER = "N5_MATH_2014_P2_Q9_D_LATER_INVALID";

export const N5_MATHS_2014_P2_Q9_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "9", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 3, sourcePages: [19], printedPageLabels: ["Page nineteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["EXPRESSION"], canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q9_A1", normalisedAnswer: "(4x-15)/(x(x+5))", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The final response is one simplified fraction."], sourceEvidence: [evidence], notes: null }], acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_FULL, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The correct simplified final fraction without working receives all three marks.", appliesToPartIds: ["Q9_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_SPLIT, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "A response with both terms correctly rewritten over the common denominator but not combined into a single simplified numerator receives two marks.", appliesToPartIds: ["Q9_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_LATER, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Incorrect work after reaching the correct result makes the final simplification mark unavailable.", appliesToPartIds: ["Q9_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q9_MAIN", "PROCESS", "Establish a correct common denominator or an equivalent correct combined numerator structure.", "Set up a valid algebraic-fraction subtraction.", ["alg-a05-operations-algebraic-fractions"], ["alg-a5-1"], ["Q9_S1"], [evidence], { illustrativeEvidence: [
      { id: "Q9_M1_E1", normalisedEvidence: "Use common denominator x(x+5).", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
      { id: "Q9_M1_E2", normalisedEvidence: "Form the numerator structure 7x-3(x+5).", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
    ], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL] }),
    markNode(M2, 2, "Q9_MAIN", "PROCESS", "Form a numerator and denominator that are mutually consistent with the common-denominator strategy.", "Complete the combined single-fraction setup.", ["alg-a05-operations-algebraic-fractions"], ["alg-a5-1"], ["Q9_S2"], [evidence], { illustrativeEvidence: [{ id: "Q9_M2_E1", normalisedEvidence: "Write [7x-3(x+5)]/[x(x+5)] or an equivalent consistent form.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "CONSISTENT_WITH_EARLIER_RESULT", relatedMarkIds: [M1], relatedQuestionPartIds: ["Q9_MAIN"], conditionSummary: "The numerator/denominator combination is assessed for consistency with the candidate's valid common-denominator structure.", sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL] }),
    markNode(M3, 3, "Q9_MAIN", "ACCURACY", "Simplify the combined fraction to its final single-fraction form.", "Collect and simplify the numerator.", ["alg-a05-operations-algebraic-fractions"], ["alg-a5-1"], ["Q9_S3"], [evidence], { illustrativeEvidence: [{ id: "Q9_M3_E1", normalisedEvidence: "Obtain (4x-15)/(x(x+5)).", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], blockingConditions: ["Subsequent incorrect working after the correct result blocks this final mark."], presentationConditions: ["Final result is one fraction in simplest form."], methodPathwayIds: [P1], sourceDirectiveIds: [D_FULL, D_SPLIT, D_LATER] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q9_P1_S1", order: 1, normalisedStep: "Use x(x+5) as common denominator and scale both numerators consistently.", linkedQuestionSubgoalIds: ["Q9_S1", "Q9_S2"], linkedMarkIds: [M1, M2], dependsOnStepIds: [], requiredOperations: ["COMMON_DENOMINATOR", "MULTIPLY"], resultingStateSummary: "[7x-3(x+5)]/[x(x+5)]", sourceEvidence: [evidence] },
    { id: "Q9_P1_S2", order: 2, normalisedStep: "Expand and collect the numerator.", linkedQuestionSubgoalIds: ["Q9_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q9_P1_S1"], requiredOperations: ["EXPAND", "COLLECT_LIKE_TERMS"], resultingStateSummary: "(4x-15)/(x(x+5))", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [D_FULL, D_SPLIT], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 3, [M1, M2, M3], [evidence], [D_FULL]), [], [M1, M2, M3], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { simplification: "REQUIRED_FOR_FULL_CREDIT", otherConditions: ["The requested single-fraction form is mark-bearing at the final stage."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q9_CR_SPLIT_COMMON_DENOMINATOR", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "NOT_COMBINED_TO_SINGLE_FRACTION", normalisedResponse: "Rewrite both terms over x(x+5) correctly but leave them as two separate fractions.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_SPLIT], sourceEvidence: [evidence] },
    { id: "Q9_CR_CORRECT_THEN_INVALID", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "SUBSEQUENT_INVALID_WORK", normalisedResponse: "Reach the correct final fraction and then perform an incorrect further manipulation.", affectedMarkIds: [M3], marksAwarded: null, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_LATER], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_FULL, D_SPLIT, D_LATER] },
  relationship: { partMarkMap: [{ questionPartId: "Q9_MAIN", markIds: [M1, M2, M3] }], subgoalMarkMap: [{ questionSubgoalId: "Q9_S1", markIds: [M1] }, { questionSubgoalId: "Q9_S2", markIds: [M2] }, { questionSubgoalId: "Q9_S3", markIds: [M3] }], promptInstructionConsequences: [{ instructionType: "SINGLE_FRACTION_SIMPLEST_FORM", markingConsequence: "The third mark requires the combined expression to be simplified to one fraction.", affectedMarkIds: [M3], sourceEvidence: [evidence] }], informationEvidenceMap: [{ questionInformationId: "Q9_INFO_EXPR", usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q9_INFO_DOMAIN", usedByMethodIds: [P1], supportsMarkIds: [] }], representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [] },
  sourcePresentation: sourcePresentation([19], "TABLE_ROW", 1, 3, 1),
  consistency: notReviewedConsistency(comparisonKey("Q9_MARKING_COMPARISON", question.family.familyId, ["alg-a05-operations-algebraic-fractions"], 3, ["EXPRESSION"], ["answer-only credit", "common-denominator evidence", "single-fraction requirement", "later invalid work"]), [
    consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The correct final fraction without working explicitly receives all three marks.", [evidence]),
    consistencyFeature("uncombined_common_denominator_max_marks", 2, "A correctly rewritten but uncombined pair of fractions is explicitly capped at two marks.", [evidence]),
    consistencyFeature("later_invalid_work_can_remove_final_mark", true, "A question-specific note blocks the final mark after subsequent incorrect work.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("9", "P2", 2014),
} satisfies AnswerCatalogEntry;
