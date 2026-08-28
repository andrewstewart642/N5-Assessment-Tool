import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q3 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q3";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("3", 3);
const M1 = "N5_MATH_2014_P1_Q3_M1";
const M2 = "N5_MATH_2014_P1_Q3_M2";
const D1 = "N5_MATH_2014_P1_Q3_D_EQUIVALENT_FULL";
const D2 = "N5_MATH_2014_P1_Q3_D_PARTIAL_STRUCTURE";
const P1 = "N5_MATH_2014_P1_Q3_METHOD_COMPLETE_SQUARE";

export const N5_MATHS_2014_P1_Q3_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P1", questionNumber: "3", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 2, sourcePages: [3], printedPageLabels: ["Page three"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["EXPRESSION"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P1_Q3_A1", normalisedAnswer: "(x-7)^2 - 5", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P1_Q3_A2", "N5_MATH_2014_P1_Q3_A3"], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [
      { id: "N5_MATH_2014_P1_Q3_A2", normalisedAnswer: "(x-7)^2 + (-5)", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P1_Q3_A1"], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Explicitly accepted source-equivalent completed-square form." },
      { id: "N5_MATH_2014_P1_Q3_A3", normalisedAnswer: "(x-7)(x-7) - 5", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: ["N5_MATH_2014_P1_Q3_A1"], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "Explicitly accepted equivalent expanded-square notation." },
    ],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "ACCEPT", normalisedSummary: "The source explicitly accepts equivalent completed-square notation, including an explicit negative addend or repeated identical factors.", appliesToPartIds: ["Q3_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "MARK", effect: "LIMIT", normalisedSummary: "Several structurally incomplete or malformed completed-square responses retain only the mark for the correct squared bracket structure.", appliesToPartIds: ["Q3_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q3_MAIN", "PROCESS", "Identify the correct squared bracket structure.", "Recognise the half-coefficient structure used in completing the square.", ["alg-a03-complete-the-square"], ["alg-a3-1"], ["Q3_S1"], [evidence], { illustrativeEvidence: [{ id: "Q3_M1_E1", normalisedEvidence: "Show a squared bracket based on x-7.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2] }),
    markNode(M2, 2, "Q3_MAIN", "ACCURACY", "Complete the completing-the-square process.", "Preserve equivalence by applying the correct constant adjustment.", ["alg-a03-complete-the-square"], ["alg-a3-1"], ["Q3_S2"], [evidence], { illustrativeEvidence: [{ id: "Q3_M2_E1", normalisedEvidence: "Complete the expression with the correct -5 adjustment or an explicitly accepted equivalent form.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "REQUIRES_EVIDENCE", relatedMarkIds: [M1], relatedQuestionPartIds: ["Q3_MAIN"], conditionSummary: "The completion mark presupposes a valid completed-square structure.", sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D1, D2] }),
  ],
  methodPathways: [{ id: P1, variantId: null, evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [{ id: "Q3_P1_S1", order: 1, normalisedStep: "Form the squared bracket using half the linear coefficient.", linkedQuestionSubgoalIds: ["Q3_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["COMPLETE_SQUARE"], resultingStateSummary: "(x-7)^2 plus an adjustment.", sourceEvidence: [evidence] }, { id: "Q3_P1_S2", order: 2, normalisedStep: "Apply the constant adjustment so the expression remains equivalent.", linkedQuestionSubgoalIds: ["Q3_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q3_P1_S1"], requiredOperations: ["ADJUST_CONSTANT"], resultingStateSummary: "(x-7)^2 - 5", sourceEvidence: [evidence] }], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The detailed instructions do not state a special correct-answer-without-working award for this Question."), [], [M1, M2]),
  presentationPolicy: presentationPolicy([evidence], { otherConditions: ["Equivalent completed-square notation is explicitly accepted."], significantNotationRequirements: ["A squared bracket structure is mark-bearing."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [{ id: "Q3_CR_PARTIAL_STRUCTURE", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "PARTIAL_METHOD", errorFamily: "INCOMPLETE_COMPLETED_SQUARE", normalisedResponse: "Correct squared-bracket structure but incomplete or malformed completion of the constant adjustment.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] }],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2] },
  relationship: { partMarkMap: [{ questionPartId: "Q3_MAIN", markIds: [M1, M2] }], subgoalMarkMap: [{ questionSubgoalId: "Q3_S1", markIds: [M1] }, { questionSubgoalId: "Q3_S2", markIds: [M2] }], promptInstructionConsequences: [{ instructionType: "TARGET_FORM", markingConsequence: "The squared bracket structure and completed constant adjustment are separately mark-bearing.", affectedMarkIds: [M1, M2], sourceEvidence: [evidence] }], informationEvidenceMap: [{ questionInformationId: "Q3_INFO_QUAD", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q3_INFO_FORM", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }], representationEvidenceMap: [], crossPartDependencies: [], errorPropagationGraph: [] },
  sourcePresentation: sourcePresentation([3], "TABLE_ROW", 1, 2, 1),
  consistency: notReviewedConsistency(comparisonKey("Q3_MARKING_COMPARISON", question.family.familyId, ["alg-a03-complete-the-square"], 2, ["EXPRESSION"], ["structural partial credit", "equivalent notation", "answer-only treatment"]), [consistencyFeature("answer_only_treatment", "NOT_STATED", "No question-specific answer-only rule is stated.", [evidence]), consistencyFeature("equivalent_notation_explicitly_accepted", true, "The source explicitly accepts multiple algebraically equivalent completed-square notations.", [evidence]), consistencyFeature("square_structure_separate_mark", true, "The squared bracket itself earns a distinct mark from completing the process.", [evidence])]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("3"),
} satisfies AnswerCatalogEntry;
