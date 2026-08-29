import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q5 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q5";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("5", 16, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q5_M1";
const M2 = "N5_MATH_2014_P2_Q5_M2";
const M3 = "N5_MATH_2014_P2_Q5_M3";
const P1 = "N5_MATH_2014_P2_Q5_METHOD_SCALE_FACTOR";
const P2 = "N5_MATH_2014_P2_Q5_METHOD_CYLINDER_RADII";
const D1 = "N5_MATH_2014_P2_Q5_D_PREMATURE_ROUND";

export const N5_MATHS_2014_P2_Q5_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "5", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 3, sourcePages: [16], printedPageLabels: ["Page sixteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [{ id: "N5_MATH_2014_P2_Q5_A1", normalisedAnswer: "3072 cm^3", numericValue: 3072, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The third mark requires correct units and a volume calculation involving a power of the scale factor under the main method."], sourceEvidence: [evidence], notes: null }],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile("volume", "cm^3"), requiredContextStatement: false, answerCountRequired: 1, invalidRelatedValues: ["1920", "1200", "675000000", "183", "933", "3075"], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Premature rounding of the volume scale factor that changes the final volume makes the third mark unavailable.", appliesToPartIds: ["Q5_MAIN"], appliesToMarkIds: [M3], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q5_MAIN", "PROCESS", "State the linear scale factor between the similar solids.", "Establish the ratio of corresponding lengths.", ["geo-g06-similarity"], ["geo-g6-1"], ["Q5_S1"], [evidence], { illustrativeEvidence: [{ id: "Q5_M1_E1", normalisedEvidence: "Use 24/15 or 1.6 as the linear scale factor.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: ["VIS_Q5"], sourceEvidence: [evidence] }], pathwaySpecificRequirements: [{ methodPathwayId: P2, normalisedRequirement: "Under the alternative cylinder method, use the smaller volume and height to determine the smaller radius.", sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2] }),
    markNode(M2, 2, "Q5_MAIN", "PROCESS", "Establish the corresponding volume scaling needed by the chosen method.", "Cube the linear scale factor or scale the cylinder radius consistently.", ["geo-g06-similarity"], ["geo-g6-1"], ["Q5_S2"], [evidence], { illustrativeEvidence: [{ id: "Q5_M2_E1", normalisedEvidence: "Use (24/15)^3 or 1.6^3 = 4.096 as the volume factor.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }], pathwaySpecificRequirements: [{ methodPathwayId: P2, normalisedRequirement: "Scale the smaller radius by 24/15 to obtain the larger radius.", sourceEvidence: [evidence] }], methodPathwayIds: [P1, P2] }),
    markNode(M3, 3, "Q5_MAIN", "ACCURACY", "Calculate the larger volume and state correct cubic-centimetre units.", "Complete a valid volume calculation to 3072 cm^3.", ["geo-g06-similarity"], ["geo-g6-1"], ["Q5_S3"], [evidence], {
      secondaryTypes: ["UNITS"],
      illustrativeEvidence: [{ id: "Q5_M3_E1", normalisedEvidence: "Calculate 3072 cm^3; under the main route the calculation must involve a power of the scale factor.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: [evidence] }],
      pathwaySpecificRequirements: [{ methodPathwayId: P1, normalisedRequirement: "The final volume calculation must visibly involve a power of the scale factor.", sourceEvidence: [evidence] }, { methodPathwayId: P2, normalisedRequirement: "Use the larger cylinder radius and height to calculate its volume.", sourceEvidence: [evidence] }],
      blockingConditions: ["Premature rounding that changes the final volume blocks this mark."], presentationConditions: ["Correct cm^3 units are part of this mark."], methodPathwayIds: [P1, P2], sourceDirectiveIds: [D1],
    }),
  ],
  methodPathways: [
    { id: P1, variantId: "CUBED_LINEAR_SCALE", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q5_P1_S1", order: 1, normalisedStep: "Find linear scale factor 24/15=1.6.", linkedQuestionSubgoalIds: ["Q5_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["DIVIDE"], resultingStateSummary: "1.6", sourceEvidence: [evidence] },
      { id: "Q5_P1_S2", order: 2, normalisedStep: "Cube the linear scale factor to get 4.096.", linkedQuestionSubgoalIds: ["Q5_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q5_P1_S1"], requiredOperations: ["POWER"], resultingStateSummary: "4.096", sourceEvidence: [evidence] },
      { id: "Q5_P1_S3", order: 3, normalisedStep: "Multiply the smaller volume by the volume factor and state cm^3.", linkedQuestionSubgoalIds: ["Q5_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q5_P1_S2"], requiredOperations: ["MULTIPLY"], resultingStateSummary: "3072 cm^3", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P2], materiallyDistinctFromMethodIds: [P2], excludedMethodReasons: [], sourceEvidence: [evidence] },
    { id: P2, variantId: "RECONSTRUCT_CYLINDER_RADII", evidenceRole: "FULL_CREDIT_ALTERNATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
      { id: "Q5_P2_S1", order: 1, normalisedStep: "Use V=πr^2h for the smaller cylinder to determine its radius.", linkedQuestionSubgoalIds: ["Q5_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["REARRANGE", "SQUARE_ROOT"], resultingStateSummary: "smaller radius derived from 750/(15π)", sourceEvidence: [evidence] },
      { id: "Q5_P2_S2", order: 2, normalisedStep: "Scale that radius by 24/15.", linkedQuestionSubgoalIds: ["Q5_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q5_P2_S1"], requiredOperations: ["MULTIPLY"], resultingStateSummary: "larger radius", sourceEvidence: [evidence] },
      { id: "Q5_P2_S3", order: 3, normalisedStep: "Calculate the larger cylinder volume and state cm^3.", linkedQuestionSubgoalIds: ["Q5_S3"], linkedMarkIds: [M3], dependsOnStepIds: ["Q5_P2_S2"], requiredOperations: ["VOLUME_CYLINDER"], resultingStateSummary: "3072 cm^3", sourceEvidence: [evidence] },
    ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [P1], materiallyDistinctFromMethodIds: [P1], excludedMethodReasons: [], sourceEvidence: [evidence] },
  ],
  methodEquivalence: { equivalentMethodGroups: [{ id: "Q5_EQUIV_FULL", methodIds: [P1, P2], equivalenceReason: "The source explicitly provides a cubed-scale-factor route and a cylinder-radius reconstruction route as full-credit methods.", sourceEvidence: [evidence] }], methodEligibilityRules: [] },
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "The source does not state the total credit for a fully correct 3072 cm^3 answer without working."), [M1, M2, M3], [], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { units: "REQUIRED_FOR_MARK", precision: { finalPrecisionType: "NONE", finalPrecisionValue: null, acceptedFinalRange: null, prematureRoundingTreatment: "PENALISE", minimumIntermediatePrecision: "Do not prematurely round the volume factor in a way that changes the final result.", sourceEvidence: [evidence] } }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q5_CR_NO_UNITS", sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "UNITS_OMITTED", normalisedResponse: "State 3072 without cubic-centimetre units.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q5_CR_SQUARE_FACTOR", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "AREA_FACTOR_FOR_VOLUME", normalisedResponse: "Use (24/15)^2×750 and state 1920 cm^3.", affectedMarkIds: [M2], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q5_CR_LINEAR_FACTOR", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "LINEAR_FACTOR_FOR_VOLUME", normalisedResponse: "Use (24/15)×750 and state 1200 cm^3.", affectedMarkIds: [M2, M3], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q5_CR_RECIPROCAL_CUBE", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "RECIPROCAL_SCALE_DIRECTION", normalisedResponse: "Use (15/24)^3×750 and obtain about 183 cm^3.", affectedMarkIds: [M1], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q5_CR_RECIPROCAL_PLUS_ORIGINAL", sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "RECIPROCAL_PLUS_ORIGINAL", normalisedResponse: "Use (15/24)^3×750 + 750 and obtain about 933 cm^3.", affectedMarkIds: [M1], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [], sourceEvidence: [evidence] },
    { id: "Q5_CR_ROUND_FACTOR", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "ROUNDING_ERROR", errorFamily: "PREMATURE_VOLUME_FACTOR_ROUNDING", normalisedResponse: "Round 4.096 to 4.1 before multiplication, giving 3075 cm^3.", affectedMarkIds: [M3], marksAwarded: 2, maximumMarks: 2, followThroughAvailable: false, sourceDirectiveIds: [D1], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q5_MAIN", markIds: [M1, M2, M3] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q5_S1", markIds: [M1] }, { questionSubgoalId: "Q5_S2", markIds: [M2] }, { questionSubgoalId: "Q5_S3", markIds: [M3] }],
    promptInstructionConsequences: [],
    informationEvidenceMap: [{ questionInformationId: "Q5_INFO_SIM", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: "Q5_INFO_HSMALL", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q5_INFO_VSMALL", usedByMethodIds: [P1, P2], supportsMarkIds: [M3] }, { questionInformationId: "Q5_INFO_HLARGE", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M2, M3] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q5", normalisedEvidence: "The paired-jar diagram reinforces the corresponding-height relationship but is redundant with the text.", supportsMarkIds: [M1] }],
    crossPartDependencies: [], errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([16], "MULTI_METHOD_TABLE_ROW", 2, 3, 6),
  consistency: notReviewedConsistency(comparisonKey("P2_Q5_MARKING_COMPARISON", question.family.familyId, ["geo-g06-similarity"], 3, ["NUMBER"], ["linear-vs-volume scale factor", "units", "alternative method", "premature rounding"]), [
    consistencyFeature("units_mark_bearing", true, "Correct cubic-centimetre units are explicitly part of the third mark.", [evidence]),
    consistencyFeature("alternative_full_credit_method_count", 2, "The source gives a direct scale-factor route and an alternative cylinder-radius route.", [evidence]),
    consistencyFeature("premature_rounding_can_block_final_mark", true, "Rounding the volume factor to 4.1 and thereby changing the result blocks the third mark.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("5", "P2", 2014),
} satisfies AnswerCatalogEntry;
