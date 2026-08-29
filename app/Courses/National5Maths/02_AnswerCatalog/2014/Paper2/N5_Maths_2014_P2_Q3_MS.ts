import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q3 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q3";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("3", 14, "MARKING_SCHEME", "P2", 2014);
const A1 = "N5_MATH_2014_P2_Q3_A_M1";
const B1 = "N5_MATH_2014_P2_Q3_B_M1";
const C1 = "N5_MATH_2014_P2_Q3_C_M1";
const C2 = "N5_MATH_2014_P2_Q3_C_M2";
const C3 = "N5_MATH_2014_P2_Q3_C_M3";
const C4 = "N5_MATH_2014_P2_Q3_C_M4";
const P1 = "N5_MATH_2014_P2_Q3_METHOD_ELIMINATION";
const D1 = "N5_MATH_2014_P2_Q3_D_VARIABLE_NAMES";
const D2 = "N5_MATH_2014_P2_Q3_D_MONEY_PRESENTATION";

export const N5_MATHS_2014_P2_Q3_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "3", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 6, sourcePages: [14], printedPageLabels: ["Page fourteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["MIXED"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P2_Q3_A1", normalisedAnswer: "5a+3c=158.25", numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Equivalent variable names are accepted."], sourceEvidence: [evidence], notes: "Part (a)." },
      { id: "N5_MATH_2014_P2_Q3_A2", normalisedAnswer: "3a+2c=98", numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Equivalent variable names are accepted."], sourceEvidence: [evidence], notes: "Part (b)." },
      { id: "N5_MATH_2014_P2_Q3_A3", normalisedAnswer: "Adult £22.50; Child £15.25", numericValue: null, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["For the fourth mark the final response must identify adult and child, include pound signs, and write both amounts with two decimal figures."], sourceEvidence: [evidence], notes: "Part (c)." },
    ],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("currency", "£"), requiredContextStatement: true, answerCountRequired: 4, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "PART", effect: "ACCEPT", normalisedSummary: "Variables other than a and c are accepted when forming the equations.", appliesToPartIds: ["Q3_a"], appliesToMarkIds: [A1], appliesToMethodIds: [], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The communication mark requires adult and child labels, pound signs, and both prices written with two decimal figures in the final answer.", appliesToPartIds: ["Q3_c"], appliesToMarkIds: [C4], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(A1, 1, "Q3_a", "REPRESENTATION", "Construct a linear equation representing the first ticket purchase.", "Translate the first purchase into algebra.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S1"], [evidence], { illustrativeEvidence: [{ id: "Q3_A_M1_E1", normalisedEvidence: "Use an equation equivalent to 5 adult-price units plus 3 child-price units equals 158.25.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], sourceDirectiveIds: [D1] }),
    markNode(B1, 1, "Q3_b", "REPRESENTATION", "Construct a linear equation representing the second ticket purchase.", "Translate the second purchase into algebra.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S2"], [evidence], { illustrativeEvidence: [{ id: "Q3_B_M1_E1", normalisedEvidence: "Use an equation equivalent to 3 adult-price units plus 2 child-price units equals 98.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }] }),
    markNode(C1, 1, "Q3_c", "PROCESS", "Show evidence of scaling the simultaneous equations as part of a valid solving strategy.", "Create matching coefficients for elimination.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S3"], [evidence], { illustrativeEvidence: [{ id: "Q3_C_M1_E1", normalisedEvidence: "For example, scale to equations with matching 6c terms such as 10a+6c and 9a+6c.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1] }),
    markNode(C2, 2, "Q3_c", "PROCESS", "Follow a valid simultaneous-equation strategy through to produce values for both variables.", "Complete the elimination/substitution process sufficiently to obtain both prices.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S3", "Q3_S4"], [evidence], { methodPathwayIds: [P1] }),
    markNode(C3, 3, "Q3_c", "ACCURACY", "Calculate the correct numerical values for both ticket prices.", "Obtain the two correct solved values.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S4"], [evidence], { illustrativeEvidence: [{ id: "Q3_C_M3_E1", normalisedEvidence: "Obtain a=22.5 and c=15.25 under the source variable convention.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], methodPathwayIds: [P1] }),
    markNode(C4, 4, "Q3_c", "COMMUNICATION", "Communicate both solved prices in the required money/context form.", "Attach the correct context labels and currency formatting.", ["alg-a08-simultaneous-equations"], ["alg-a8-1"], ["Q3_S4"], [evidence], { secondaryTypes: ["PRESENTATION", "CONCLUSION"], illustrativeEvidence: [{ id: "Q3_C_M4_E1", normalisedEvidence: "State Adult £22.50 and Child £15.25.", acceptedLocations: ["FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }], presentationConditions: ["Adult and child labels, pound signs and two decimal figures for both amounts are all required for this mark."], methodPathwayIds: [P1], sourceDirectiveIds: [D2] }),
  ],
  methodPathways: [{ id: P1, variantId: "ELIMINATION_BY_SCALING", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: ["Use the two equations from parts (a) and (b) or algebraically equivalent equations."], steps: [
    { id: "Q3_P1_S1", order: 1, normalisedStep: "Scale the equations to create a matching coefficient.", linkedQuestionSubgoalIds: ["Q3_S3"], linkedMarkIds: [C1], dependsOnStepIds: [], requiredOperations: ["SCALE_EQUATIONS"], resultingStateSummary: "matching coefficients available for elimination", sourceEvidence: [evidence] },
    { id: "Q3_P1_S2", order: 2, normalisedStep: "Eliminate one variable and solve, then substitute back for the other.", linkedQuestionSubgoalIds: ["Q3_S3", "Q3_S4"], linkedMarkIds: [C2, C3], dependsOnStepIds: ["Q3_P1_S1"], requiredOperations: ["ELIMINATE", "SOLVE", "SUBSTITUTE"], resultingStateSummary: "adult=22.5, child=15.25", sourceEvidence: [evidence] },
    { id: "Q3_P1_S3", order: 3, normalisedStep: "State the two values as labelled currency amounts.", linkedQuestionSubgoalIds: ["Q3_S4"], linkedMarkIds: [C4], dependsOnStepIds: ["Q3_P1_S2"], requiredOperations: ["COMMUNICATE"], resultingStateSummary: "Adult £22.50; Child £15.25", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: {
    ...workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source does not state a whole-question answer-only total."), [C1, C2], [A1, B1, C3, C4], "P2", 2014),
    partSpecificAnswerOnly: [
      { questionPartId: "Q3_a", profile: answerOnly("NOT_STATED", null, [], [evidence], [], [], "Part (a) is a direct equation-construction mark; no separate answer-only note is given.") },
      { questionPartId: "Q3_b", profile: answerOnly("NOT_STATED", null, [], [evidence], [], [], "Part (b) is a direct equation-construction mark; no separate answer-only note is given.") },
      { questionPartId: "Q3_c", profile: answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source specifies process and communication marks but does not state a total award for final prices without working.") },
    ],
  },
  presentationPolicy: presentationPolicy([evidence], { units: "REQUIRED_FOR_MARK", contextualWording: "REQUIRED_FOR_MARK", answerLabelling: "REQUIRED_FOR_MARK", significantNotationRequirements: ["For the communication mark both money amounts must show two decimal figures.", "Pound signs are required for the communication mark."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q3_a", markIds: [A1] }, { questionPartId: "Q3_b", markIds: [B1] }, { questionPartId: "Q3_c", markIds: [C1, C2, C3, C4] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q3_S1", markIds: [A1] }, { questionSubgoalId: "Q3_S2", markIds: [B1] }, { questionSubgoalId: "Q3_S3", markIds: [C1, C2] }, { questionSubgoalId: "Q3_S4", markIds: [C2, C3, C4] }],
    promptInstructionConsequences: [{ instructionType: "CONTEXTUAL_MONEY_ANSWER", markingConsequence: "The final communication mark is explicitly conditional on labelled adult/child currency formatting with two decimal figures.", affectedMarkIds: [C4], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q3_INFO_BILL", usedByMethodIds: [P1], supportsMarkIds: [A1, C1, C2, C3] }, { questionInformationId: "Q3_INFO_BEN", usedByMethodIds: [P1], supportsMarkIds: [B1, C1, C2, C3] }],
    representationEvidenceMap: [],
    crossPartDependencies: ["Part (c) solves the pair of equations constructed from the two purchase statements in parts (a) and (b)."],
    errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([14], "MULTIPART_TABLE_ROW", 1, 2, 0),
  consistency: notReviewedConsistency(comparisonKey("P2_Q3_MARKING_COMPARISON", question.family.familyId, ["alg-a08-simultaneous-equations"], 6, ["MIXED"], ["equation construction", "scaling/elimination", "contextual currency presentation", "answer-only silence"]), [
    consistencyFeature("variable_names_flexible", true, "Equivalent variable names are explicitly accepted for the equation construction.", [evidence]),
    consistencyFeature("money_format_mark_bearing", true, "Context labels, pound signs and two decimal figures jointly control the fourth part-(c) mark.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("3", "P2", 2014),
} satisfies AnswerCatalogEntry;
