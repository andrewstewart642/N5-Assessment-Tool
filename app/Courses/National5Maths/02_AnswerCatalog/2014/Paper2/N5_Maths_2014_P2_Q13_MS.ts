import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q13 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q13";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("13", 21, "MARKING_SCHEME", "P2", 2014);
const notesEvidence = msEvidence("13", 22, "MARKING_SCHEME", "P2", 2014, "Page twenty-two");
const sourceEvidence = [evidence, notesEvidence];
const M1 = "N5_MATH_2014_P2_Q13_M1";
const M2 = "N5_MATH_2014_P2_Q13_M2";
const M3 = "N5_MATH_2014_P2_Q13_M3";
const M4 = "N5_MATH_2014_P2_Q13_M4";
const M5 = "N5_MATH_2014_P2_Q13_M5";
const P1 = "N5_MATH_2014_P2_Q13_METHOD_MAJOR_SECTOR_PLUS_TRIANGLE";
const P2 = "N5_MATH_2014_P2_Q13_METHOD_CIRCLE_MINUS_MINOR_PLUS_TRIANGLE";
const D_PI = "N5_MATH_2014_P2_Q13_D_PI_AND_SECTOR_ROUNDING";
const D_GRAD = "N5_MATH_2014_P2_Q13_D_GRAD_FULL";
const D_RAD = "N5_MATH_2014_P2_Q13_D_RAD_FOUR";
const D_M5 = "N5_MATH_2014_P2_Q13_D_M5_TRIG_TRIANGLE";

export const N5_MATHS_2014_P2_Q13_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "13", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 5, sourcePages: [21, 22], printedPageLabels: ["Page twenty-one", "Page twenty-two"], sourceEvidence, generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q13_A1", normalisedAnswer: "151.3 m^2", numericValue: 151.3, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The fifth mark is available only when the triangle area is calculated using trigonometry."], sourceEvidence, notes: null }],
    acceptedEquivalentForms: [
      { id: "N5_MATH_2014_P2_Q13_A2", normalisedAnswer: "149.9 from grad-mode trigonometry", numericValue: 149.9, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Working must be shown; the source awards 5/5."], sourceEvidence: [notesEvidence], notes: "Historical calculator-mode variant." },
      { id: "N5_MATH_2014_P2_Q13_A3", normalisedAnswer: "126.1 or 139.0 from radian-mode trigonometry", numericValue: null, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Working must be shown; the source awards 4/5."], sourceEvidence: [notesEvidence], notes: "Historical calculator-mode variant with the final mark unavailable." },
    ],
    precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("area", "m^2"), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: ["56.6", "40.1", "2.6", "24.9", "132.6", "21.4", "18.8", "153.9"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D_PI, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "IGNORE_PENALTY", normalisedSummary: "Legitimate variations in pi are accepted, and premature or incorrect rounding of the sector fractions 310/360 or 50/360 is disregarded.", appliesToPartIds: ["Q13_MAIN"], appliesToMarkIds: [M2, M3, M5], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: null, sourceEvidence: [notesEvidence] },
    { id: D_GRAD, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "The stated grad-mode result receives all five marks when working is shown.", appliesToPartIds: ["Q13_MAIN"], appliesToMarkIds: [M1, M2, M3, M4, M5], appliesToMethodIds: [P1, P2], marksAwarded: 5, maximumMarks: 5, sourceEvidence: [notesEvidence] },
    { id: D_RAD, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "The stated radian-mode results receive four marks when working is shown.", appliesToPartIds: ["Q13_MAIN"], appliesToMarkIds: [M5], appliesToMethodIds: [P1, P2], marksAwarded: 4, maximumMarks: 4, sourceEvidence: [notesEvidence] },
    { id: D_M5, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The fifth mark is available only when the area of triangle MON is calculated using trigonometry.", appliesToPartIds: ["Q13_MAIN"], appliesToMarkIds: [M5], appliesToMethodIds: [P1, P2], marksAwarded: null, maximumMarks: null, sourceEvidence: [notesEvidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q13_MAIN", "METHOD", "Use a valid strategy for the required circular-segment area.", "Recognise the target as a major segment and decompose it validly.", ["geo-g02-arc-or-sector", "trig-t03-area"], ["geo-g2-1", "trig-t3-1"], ["Q13_S1", "Q13_S4"], sourceEvidence, { pathwaySpecificRequirements: [
      { methodPathwayId: P1, normalisedRequirement: "Use major sector plus triangle.", sourceEvidence: [evidence] },
      { methodPathwayId: P2, normalisedRequirement: "Use full circle minus minor sector plus triangle.", sourceEvidence: [evidence] },
    ], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_GRAD, D_RAD] }),
    markNode(M2, 2, "Q13_MAIN", "PROCESS", "Express the required sector as the correct fraction of a full circle.", "Select 310/360 for the major sector or 50/360 for the minor sector.", ["geo-g02-arc-or-sector"], ["geo-g2-1"], ["Q13_S2"], sourceEvidence, { illustrativeEvidence: [{ id: "Q13_M2_E1", normalisedEvidence: "Use 310/360 or 50/360 according to the chosen valid strategy.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: ["VIS_Q13_DIAGRAM"], sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_PI, D_GRAD, D_RAD] }),
    markNode(M3, 3, "Q13_MAIN", "PROCESS", "Calculate the required sector area correctly.", "Evaluate the sector component with radius 7.", ["geo-g02-arc-or-sector"], ["geo-g2-1"], ["Q13_S2"], sourceEvidence, { pathwaySpecificRequirements: [
      { methodPathwayId: P1, normalisedRequirement: "Calculate the 310-degree sector area, approximately 132.56.", sourceEvidence: [evidence] },
      { methodPathwayId: P2, normalisedRequirement: "Calculate the 50-degree sector area, approximately 21.38.", sourceEvidence: [evidence] },
    ], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_PI, D_GRAD, D_RAD] }),
    markNode(M4, 4, "Q13_MAIN", "PROCESS", "Calculate the area of triangle MON using trigonometry.", "Use two radii and the included 50-degree angle in the trigonometric triangle-area formula.", ["trig-t03-area"], ["trig-t3-1"], ["Q13_S3"], sourceEvidence, { illustrativeEvidence: [{ id: "Q13_M4_E1", normalisedEvidence: "Use one-half times 7 times 7 times sin 50, approximately 18.77.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: ["VIS_Q13_DIAGRAM"], sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D_GRAD, D_RAD] }),
    markNode(M5, 5, "Q13_MAIN", "ACCURACY", "Carry out all calculations correctly within a valid segment strategy, with the triangle area obtained trigonometrically.", "Complete the major-segment area calculation.", ["geo-g02-arc-or-sector", "trig-t03-area"], ["geo-g2-1", "trig-t3-1"], ["Q13_S4"], sourceEvidence, { illustrativeEvidence: [{ id: "Q13_M5_E1", normalisedEvidence: "Obtain approximately 151.3 m^2 from a valid strategy.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], dependencies: [{ type: "REQUIRES_MARK", relatedMarkIds: [M4], relatedQuestionPartIds: ["Q13_MAIN"], conditionSummary: "The source explicitly makes the fifth mark unavailable unless triangle MON is calculated using trigonometry.", sourceEvidence: [notesEvidence] }], eligibilityConditions: ["Triangle MON area must be calculated using trigonometry."], methodPathwayIds: [P1, P2], presentationConditions: ["State square-metre units in the final source answer form."], sourceDirectiveIds: [D_PI, D_GRAD, D_RAD, D_M5] }),
  ],
  methodPathways: [
    { id: P1, variantId: "MAJOR_SECTOR_PLUS_TRIANGLE", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q13_P1_S1", order: 1, normalisedStep: "Use 310/360 of the full circle for the major sector.", linkedQuestionSubgoalIds: ["Q13_S2"], linkedMarkIds: [M1, M2, M3], dependsOnStepIds: [], requiredOperations: ["AREA_SECTOR"], resultingStateSummary: "major sector approximately 132.56", sourceEvidence: [evidence] },
      { id: "Q13_P1_S2", order: 2, normalisedStep: "Calculate triangle MON trigonometrically using one-half ab sin C.", linkedQuestionSubgoalIds: ["Q13_S3"], linkedMarkIds: [M4], dependsOnStepIds: [], requiredOperations: ["TRIG_TRIANGLE_AREA"], resultingStateSummary: "triangle approximately 18.77", sourceEvidence: [evidence] },
      { id: "Q13_P1_S3", order: 3, normalisedStep: "Add the major sector and triangle areas.", linkedQuestionSubgoalIds: ["Q13_S4"], linkedMarkIds: [M5], dependsOnStepIds: ["Q13_P1_S1", "Q13_P1_S2"], requiredOperations: ["ADD"], resultingStateSummary: "151.3 m^2", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [D_GRAD, D_RAD], mathematicallyEquivalentMethodIds: [P2], materiallyDistinctFromMethodIds: [P2], excludedMethodReasons: [], sourceEvidence },
    { id: P2, variantId: "CIRCLE_MINUS_MINOR_SECTOR_PLUS_TRIANGLE", evidenceRole: "FULL_CREDIT_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q13_P2_S1", order: 1, normalisedStep: "Calculate the full circle area and the 50/360 minor sector area.", linkedQuestionSubgoalIds: ["Q13_S1", "Q13_S2"], linkedMarkIds: [M1, M2, M3], dependsOnStepIds: [], requiredOperations: ["AREA_CIRCLE", "AREA_SECTOR"], resultingStateSummary: "circle minus minor sector gives the major sector component", sourceEvidence: [evidence] },
      { id: "Q13_P2_S2", order: 2, normalisedStep: "Calculate triangle MON trigonometrically using one-half ab sin C.", linkedQuestionSubgoalIds: ["Q13_S3"], linkedMarkIds: [M4], dependsOnStepIds: [], requiredOperations: ["TRIG_TRIANGLE_AREA"], resultingStateSummary: "triangle approximately 18.77", sourceEvidence: [evidence] },
      { id: "Q13_P2_S3", order: 3, normalisedStep: "Subtract the minor sector from the circle and add the triangle area.", linkedQuestionSubgoalIds: ["Q13_S4"], linkedMarkIds: [M5], dependsOnStepIds: ["Q13_P2_S1", "Q13_P2_S2"], requiredOperations: ["SUBTRACT", "ADD"], resultingStateSummary: "151.3 m^2", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [D_GRAD, D_RAD], mathematicallyEquivalentMethodIds: [P1], materiallyDistinctFromMethodIds: [P1], excludedMethodReasons: [], sourceEvidence },
  ],
  methodEquivalence: { equivalentMethodGroups: [{ id: "Q13_SEGMENT_EQUIV", methodIds: [P1, P2], equivalenceReason: "The source explicitly illustrates both major-sector-plus-triangle and circle-minus-minor-sector-plus-triangle as valid segment strategies.", sourceEvidence: [evidence] }], methodEligibilityRules: [] },
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], sourceEvidence, [], [], "The source does not state the ordinary correct degree-mode answer-only total. Calculator-mode variants explicitly require working for their stated awards."), [M1, M2, M3, M4], [], "P2", 2014),
  presentationPolicy: presentationPolicy(sourceEvidence, { units: "NOT_STATED", precision: { finalPrecisionType: "NONE", finalPrecisionValue: null, acceptedFinalRange: null, prematureRoundingTreatment: "ACCEPT", minimumIntermediatePrecision: null, sourceEvidence }, otherConditions: ["Legitimate variations in pi are accepted.", "Premature or incorrect rounding of the sector fractions 310/360 or 50/360 is explicitly disregarded.", "The fifth mark requires trigonometrically calculated triangle area."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q13_CR_56_6", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "SECTOR_RADIUS_DIAMETER_ERROR", normalisedResponse: "Use the 310-degree sector with 14 in place of the required radius contribution, then add the correct trig triangle, giving about 56.6.", affectedMarkIds: [M3], marksAwarded: 4, maximumMarks: 4, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_40_1", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "MINOR_SECTOR_PLUS_TRIANGLE", normalisedResponse: "Add the minor sector area to the triangle area, giving about 40.1.", affectedMarkIds: [M1], marksAwarded: 4, maximumMarks: 4, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_2_6", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "MINOR_SECTOR_MINUS_TRIANGLE", normalisedResponse: "Subtract the triangle from the minor sector, giving about 2.6.", affectedMarkIds: [M1], marksAwarded: 4, maximumMarks: 4, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_24_9", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "MINOR_SECTOR_DIAMETER_ERROR", normalisedResponse: "Use the minor-sector fraction with an incorrect radius/diameter treatment and add the correct trig triangle, giving about 24.9.", affectedMarkIds: [M1, M3], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_132_6", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "MAJOR_SECTOR_ONLY", normalisedResponse: "Calculate only the 310-degree sector area, about 132.6.", affectedMarkIds: [M1, M4, M5], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_21_4", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "MINOR_SECTOR_ONLY", normalisedResponse: "Calculate only the 50-degree sector area, about 21.4.", affectedMarkIds: [M1, M4, M5], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_18_8", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "TRIANGLE_ONLY", normalisedResponse: "Calculate only the trig triangle area, about 18.8.", affectedMarkIds: [M1, M2, M3, M5], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_153_9", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "FULL_CIRCLE_ONLY", normalisedResponse: "Calculate only the full circle area, about 153.9.", affectedMarkIds: [M1, M2, M3, M4, M5], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_GRAD", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "GRAD_MODE", normalisedResponse: "Use grad mode in the trigonometric triangle calculation and obtain about 149.9 with working.", affectedMarkIds: [], marksAwarded: 5, maximumMarks: 5, followThroughAvailable: false, sourceDirectiveIds: [D_GRAD], sourceEvidence: [notesEvidence] },
    { id: "Q13_CR_RAD", sourceStatus: "EXPLICITLY_LISTED", category: "CALCULATOR_MODE_ERROR", errorFamily: "RAD_MODE", normalisedResponse: "Use radian mode in the trigonometric triangle calculation and obtain one of the source-listed final values with working.", affectedMarkIds: [M5], marksAwarded: 4, maximumMarks: 4, followThroughAvailable: false, sourceDirectiveIds: [D_RAD], sourceEvidence: [notesEvidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D_PI, D_GRAD, D_RAD, D_M5] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q13_MAIN", markIds: [M1, M2, M3, M4, M5] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q13_S1", markIds: [M1] }, { questionSubgoalId: "Q13_S2", markIds: [M2, M3] }, { questionSubgoalId: "Q13_S3", markIds: [M4] }, { questionSubgoalId: "Q13_S4", markIds: [M1, M5] }],
    promptInstructionConsequences: [{ instructionType: "CALCULATE_MAJOR_SEGMENT_AREA", markingConsequence: "The source accepts two equivalent segment decompositions but makes the trigonometric triangle-area stage a gate for the final mark.", affectedMarkIds: [M1, M2, M3, M4, M5], sourceEvidence }],
    informationEvidenceMap: [{ questionInformationId: "Q13_INFO_CENTER", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M4] }, { questionInformationId: "Q13_INFO_CHORD", usedByMethodIds: [P1, P2], supportsMarkIds: [M1] }, { questionInformationId: "Q13_INFO_ANGLE", usedByMethodIds: [P1, P2], supportsMarkIds: [M2, M3, M4] }, { questionInformationId: "Q13_INFO_RADIUS", usedByMethodIds: [P1, P2], supportsMarkIds: [M3, M4] }, { questionInformationId: "Q13_INFO_TARGET", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M5] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q13_DIAGRAM", normalisedEvidence: "The circle/chord diagram establishes the centre, chord, central angle, radius and the major target segment.", supportsMarkIds: [M1, M2, M3, M4, M5] }],
    crossPartDependencies: [], errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([21, 22], "MULTI_PAGE", 2, 5, 10),
  consistency: notReviewedConsistency(comparisonKey("P2_Q13_MARKING_COMPARISON", question.family.familyId, ["geo-g02-arc-or-sector", "trig-t03-area"], 5, ["NUMBER"], ["alternative segment strategies", "calculator mode", "triangle-method gate", "rounding tolerance", "source-listed common responses"]), [
    consistencyFeature("explicit_full_credit_segment_method_count", 2, "The source illustrates two equivalent full-credit segment decompositions.", sourceEvidence),
    consistencyFeature("fifth_mark_requires_trig_triangle", true, "The source explicitly makes M5 unavailable unless triangle MON is calculated using trigonometry.", [notesEvidence]),
    consistencyFeature("grad_mode_with_working_full_credit", true, "The source awards 5/5 to the listed grad-mode result when working is shown.", [notesEvidence]),
    consistencyFeature("rad_mode_with_working_max_marks", 4, "The source awards 4/5 to the listed radian-mode outcomes when working is shown.", [notesEvidence]),
    consistencyFeature("sector_fraction_rounding_ignored", true, "Premature or incorrect rounding of the sector fractions is explicitly disregarded.", [notesEvidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("13", "P2", 2014),
} satisfies AnswerCatalogEntry;
