import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q2 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q2";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("2", 3);
const M1 = "N5_MATH_2014_P1_Q2_M1";
const M2 = "N5_MATH_2014_P1_Q2_M2";
const D1 = "N5_MATH_2014_P1_Q2_D_ANSWER_ONLY";
const P1 = "N5_MATH_2014_P1_Q2_METHOD_EXPAND_COLLECT";

export const N5_MATHS_2014_P1_Q2_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P1", questionNumber: "2", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 2, sourcePages: [3], printedPageLabels: ["Page three"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["EXPRESSION"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P1_Q2_A1", normalisedAnswer: "6x^2 - 13x - 5", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [{ id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The fully correct final expression without visible working receives both marks.", appliesToPartIds: ["Q2_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] }],
  markNodes: [
    markNode(M1, 1, "Q2_MAIN", "PROCESS", "Obtain any three of the four expansion terms correctly.", "Demonstrate substantially correct double-bracket expansion.", ["alg-a01-expand-brackets"], ["alg-a1-1"], ["Q2_S1"], [evidence], { illustrativeEvidence: [{ id: "Q2_M1_E1", normalisedEvidence: "Show three correct terms from the expansion before collection.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1] }),
    markNode(M2, 2, "Q2_MAIN", "ACCURACY", "Obtain the fourth expansion term correctly and collect like terms.", "Complete the expansion and simplify to the correct quadratic.", ["alg-a01-expand-brackets"], ["alg-a1-1"], ["Q2_S2"], [evidence], { illustrativeEvidence: [{ id: "Q2_M2_E1", normalisedEvidence: "State the collected expression 6x^2 - 13x - 5.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "REQUIRES_VALID_METHOD", relatedMarkIds: [M1], relatedQuestionPartIds: ["Q2_MAIN"], conditionSummary: "The final accuracy mark is tied to a completed valid expansion/collection process unless the correct final answer invokes the explicit answer-only rule.", sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q2_P1_S1", order: 1, normalisedStep: "Expand the two binomials to four terms.", linkedQuestionSubgoalIds: ["Q2_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["EXPAND"], resultingStateSummary: "Four-term quadratic expansion.", sourceEvidence: [evidence] }, { id: "Q2_P1_S2", order: 2, normalisedStep: "Collect the linear terms and state the simplified quadratic.", linkedQuestionSubgoalIds: ["Q2_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q2_P1_S1"], requiredOperations: ["COLLECT_LIKE_TERMS"], resultingStateSummary: "6x^2 - 13x - 5", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 2, [M1, M2], [evidence], [D1]), [], [M1, M2]),
  presentationPolicy: presentationPolicy([evidence]),
  visualMarking: emptyVisualMarking(),
  commonResponses: [],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1] },
  relationship: { partMarkMap: [{ questionPartId: "Q2_MAIN", markIds: [M1, M2] }], subgoalMarkMap: [{ questionSubgoalId: "Q2_S1", markIds: [M1] }, { questionSubgoalId: "Q2_S2", markIds: [M2] }], promptInstructionConsequences: [], informationEvidenceMap: [{ questionInformationId: "Q2_INFO_EXPR", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }], representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [] },
  sourcePresentation: sourcePresentation([3], "TABLE_ROW", 1, 1, 0),
  consistency: notReviewedConsistency(comparisonKey("Q2_MARKING_COMPARISON", question.family.familyId, ["alg-a01-expand-brackets"], 2, ["EXPRESSION"], ["partial expansion threshold", "answer-only credit", "collection requirement"]), [consistencyFeature("answer_only_treatment", "FULL_CREDIT", "Correct final expression without working explicitly earns both marks.", [evidence]), consistencyFeature("first_mark_partial_threshold", "3_OF_4_TERMS", "The first mark is explicitly available once three expansion terms are correct.", [evidence])]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("2"),
} satisfies AnswerCatalogEntry;
