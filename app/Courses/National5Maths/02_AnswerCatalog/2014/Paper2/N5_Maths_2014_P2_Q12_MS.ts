import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q12 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q12";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("12", 21, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q12_M1";
const M2 = "N5_MATH_2014_P2_Q12_M2";
const M3 = "N5_MATH_2014_P2_Q12_M3";
const P1 = "N5_MATH_2014_P2_Q12_METHOD_COSINE_EQUATION";
const D_CONSIST = "N5_MATH_2014_P2_Q12_D_SECOND_CONSISTENT";
const D_RAD_WORK = "N5_MATH_2014_P2_Q12_D_RAD_WORK";
const D_RAD_NOWORK = "N5_MATH_2014_P2_Q12_D_RAD_NOWORK";
const D_GRAD_WORK = "N5_MATH_2014_P2_Q12_D_GRAD_WORK";
const D_GRAD_NOWORK = "N5_MATH_2014_P2_Q12_D_GRAD_NOWORK";

export const N5_MATHS_2014_P2_Q12_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "12", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 3, sourcePages: [21], printedPageLabels: ["Page twenty-one"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P2_Q12_A1", normalisedAnswer: "x=63 degrees", numericValue: 63, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "First degree-mode solution." },
      { id: "N5_MATH_2014_P2_Q12_A2", normalisedAnswer: "x=297 degrees", numericValue: 297, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The second angle must be consistent with the first angle."], sourceEvidence: [evidence], notes: "Second degree-mode solution." },
    ],
    acceptedEquivalentForms: [
      { id: "N5_MATH_2014_P2_Q12_A3", normalisedAnswer: "x=1.1 and 358.9 from radian-mode calculator use", numericValue: null, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["With working the source awards 3/3; without working it awards 2/3."], sourceEvidence: [evidence], notes: "Historical calculator-mode variant." },
      { id: "N5_MATH_2014_P2_Q12_A4", normalisedAnswer: "x=70 and 290 from grad-mode calculator use", numericValue: null, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["With working the source awards 3/3; without working it awards 2/3."], sourceEvidence: [evidence], notes: "Historical calculator-mode variant." },
    ],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("angle", "degrees"), requiredContextStatement: false, answerCountRequired: 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_CONSIST, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The second angular solution must be consistent with the first solution.", appliesToPartIds: ["Q12_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D_RAD_WORK, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The stated radian-mode pair receives all three marks when working is shown.", appliesToPartIds: ["Q12_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_RAD_NOWORK, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The stated radian-mode pair without working receives two marks; the source does not assign that direct total to particular mark nodes.", appliesToPartIds: ["Q12_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D_GRAD_WORK, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The stated grad-mode pair receives all three marks when working is shown.", appliesToPartIds: ["Q12_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [P1], marksAwarded: 3, maximumMarks: 3, sourceEvidence: [evidence] },
    { id: D_GRAD_NOWORK, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The stated grad-mode pair without working receives two marks; the source does not assign that direct total to particular mark nodes.", appliesToPartIds: ["Q12_MAIN"], appliesToMarkIds: [M1, M2, M3], appliesToMethodIds: [], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q12_MAIN", "PROCESS", "Rearrange the trigonometric equation to isolate cos x.", "Reduce the equation to a single cosine value.", ["trig-t02-equations"], ["trig-t2-2"], ["Q12_S1"], [evidence], { illustrativeEvidence: [{ id: "Q12_M1_E1", normalisedEvidence: "Obtain cos x = 5/11.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_RAD_WORK, D_GRAD_WORK] }),
    markNode(M2, 2, "Q12_MAIN", "PROCESS", "Find one angular solution from the isolated cosine value.", "Use inverse cosine to obtain the first solution.", ["trig-t02-equations"], ["trig-t2-2"], ["Q12_S2"], [evidence], { illustrativeEvidence: [{ id: "Q12_M2_E1", normalisedEvidence: "Obtain x approximately 63 degrees in degree mode.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1], sourceDirectiveIds: [D_RAD_WORK, D_GRAD_WORK] }),
    markNode(M3, 3, "Q12_MAIN", "SELECTION", "Find the second solution in the stated domain, consistently with the first solution.", "Use cosine symmetry/quadrant reasoning to complete the solution set.", ["trig-t02-equations"], ["trig-t2-2"], ["Q12_S3"], [evidence], { secondaryTypes: ["ACCURACY"], illustrativeEvidence: [{ id: "Q12_M3_E1", normalisedEvidence: "Use the cosine symmetry relationship to obtain 297 degrees from the first degree-mode solution.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "CONSISTENT_WITH_EARLIER_RESULT", relatedMarkIds: [M2], relatedQuestionPartIds: ["Q12_MAIN"], conditionSummary: "The second angle must be consistent with the first angle, as explicitly stated by the source.", sourceEvidence: [evidence] }], followThrough: { allowed: true, fromMarkIds: [M2], fromQuestionPartIds: ["Q12_MAIN"], requiresComparableDifficulty: false, blockedForRequiredResult: false, blockedByInvalidMathematicalState: true, blockedByTrivialisedLaterWork: false, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source explicitly requires consistency of the second angle with the first." }, methodPathwayIds: [P1], sourceDirectiveIds: [D_CONSIST, D_RAD_WORK, D_GRAD_WORK] }),
  ],
  methodPathways: [{ id: P1, variantId: "ISOLATE_COS_AND_USE_SYMMETRY", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q12_P1_S1", order: 1, normalisedStep: "Rearrange to cos x = 5/11.", linkedQuestionSubgoalIds: ["Q12_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["REARRANGE", "DIVIDE"], resultingStateSummary: "cos x=5/11", sourceEvidence: [evidence] },
    { id: "Q12_P1_S2", order: 2, normalisedStep: "Use inverse cosine to find the first angular value.", linkedQuestionSubgoalIds: ["Q12_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q12_P1_S1"], requiredOperations: ["INVERSE_COS"], resultingStateSummary: "63 degrees in degree mode", sourceEvidence: [evidence] },
    { id: "Q12_P1_S3", order: 3, normalisedStep: "Use cosine symmetry to find the second solution in the full-turn domain.", linkedQuestionSubgoalIds: ["Q12_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q12_P1_S2"], requiredOperations: ["QUADRANT_REASONING", "FILTER_SOLUTIONS"], resultingStateSummary: "297 degrees", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [D_RAD_WORK, D_RAD_NOWORK, D_GRAD_WORK, D_GRAD_NOWORK], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source does not state the answer-only award for the ordinary correct degree-mode pair. It separately specifies 2/3 without working for the listed RAD and GRAD mode pairs."), [M1], [M2, M3], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { degreeSymbol: "NOT_STATED", otherConditions: ["All solutions in 0 to 360 degrees are required by the question.", "The source gives explicit total-credit rules for RAD and GRAD calculator-mode outputs."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q12_CR_RAD_WORK", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "RAD_MODE", normalisedResponse: "Give approximately 1.1 and 358.9 with working.", affectedMarkIds: [], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D_RAD_WORK], sourceEvidence: [evidence] },
    { id: "Q12_CR_RAD_NOWORK", sourceStatus: "EXPLICITLY_LISTED", category: "ANSWER_ONLY", errorFamily: "RAD_MODE_NO_WORK", normalisedResponse: "Give approximately 1.1 and 358.9 without working.", affectedMarkIds: [M1, M2, M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_RAD_NOWORK], sourceEvidence: [evidence] },
    { id: "Q12_CR_GRAD_WORK", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "GRAD_MODE", normalisedResponse: "Give 70 and 290 with working.", affectedMarkIds: [], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [D_GRAD_WORK], sourceEvidence: [evidence] },
    { id: "Q12_CR_GRAD_NOWORK", sourceStatus: "EXPLICITLY_LISTED", category: "ANSWER_ONLY", errorFamily: "GRAD_MODE_NO_WORK", normalisedResponse: "Give 70 and 290 without working.", affectedMarkIds: [M1, M2, M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D_GRAD_NOWORK], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_CONSIST, D_RAD_WORK, D_RAD_NOWORK, D_GRAD_WORK, D_GRAD_NOWORK] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q12_MAIN", markIds: [M1, M2, M3] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q12_S1", markIds: [M1] }, { questionSubgoalId: "Q12_S2", markIds: [M2] }, { questionSubgoalId: "Q12_S3", markIds: [M3] }],
    promptInstructionConsequences: [{ instructionType: "SOLVE_IN_DOMAIN", markingConsequence: "The mark structure separates equation rearrangement, one angular value and a second consistent angular value in the stated full-turn domain.", affectedMarkIds: [M1, M2, M3], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q12_INFO_EQ", usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q12_INFO_DOMAIN", usedByMethodIds: [P1], supportsMarkIds: [M3] }],
    representationEvidenceMap: [], crossPartDependencies: [],
    errorPropagationGraph: [{ sourceMarkIds: [M2], sourceQuestionPartIds: ["Q12_MAIN"], affectedMarkIds: [M3], survivingMarkIds: [M3], conditionSummary: "The second angular solution can follow a first angular result when it is mathematically consistent with that result.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([21], "TABLE_ROW", 1, 5, 4),
  consistency: notReviewedConsistency(comparisonKey("P2_Q12_MARKING_COMPARISON", question.family.familyId, ["trig-t02-equations"], 3, ["NUMBER"], ["calculator mode", "answer-only mode-error credit", "second-solution consistency", "multiple-solution marking"]), [
    consistencyFeature("second_solution_must_be_consistent", true, "The source explicitly conditions the second angular mark on consistency with the first angle.", [evidence]),
    consistencyFeature("rad_grad_with_working_full_credit", true, "The listed RAD and GRAD mode pairs receive 3/3 when working is shown.", [evidence]),
    consistencyFeature("rad_grad_without_working_marks", 2, "The same listed mode-error pairs receive 2/3 without working.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("12", "P2", 2014),
} satisfies AnswerCatalogEntry;
