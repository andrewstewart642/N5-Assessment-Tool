import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P2_Q2 as question } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q2";
import { GENERAL_2014_RULE_IDS, answerIntegrity, answerOnly, answerReviewInProgress, comparisonKey, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, msEvidence, notReviewedConsistency, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "../../AnswerCatalogHelpers";

const evidence = msEvidence("2", 13, "MARKING_SCHEME", "P2", 2014);
const M1 = "N5_MATH_2014_P2_Q2_M1";
const M2 = "N5_MATH_2014_P2_Q2_M2";
const P1 = "N5_MATH_2014_P2_Q2_METHOD_VISUAL_COORDINATES";
const D1 = "N5_MATH_2014_P2_Q2_D_FOLLOW_B";
const D2 = "N5_MATH_2014_P2_Q2_D_PRESENTATION_CAP";

export const N5_MATHS_2014_P2_Q2_MS = {
  identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: 2014, paper: "P2", questionNumber: "2", questionFamilyId: question.family.familyId },
  sourceContext: { sourceDocumentId: "N5_MATH_2014_MS", totalMarks: 2, sourcePages: [13], printedPageLabels: ["Page thirteen"], sourceEvidence: [evidence], generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY" },
  expectedResponse: {
    responseTypes: ["COORDINATES"],
    canonicalAnswers: [
      { id: "N5_MATH_2014_P2_Q2_A1", normalisedAnswer: "B=(8,4,10)", numericValue: null, answerForm: "COORDINATES", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: [evidence], notes: "First requested coordinate." },
      { id: "N5_MATH_2014_P2_Q2_A2", normalisedAnswer: "C=(4,0,10)", numericValue: null, answerForm: "COORDINATES", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The second mark can follow a consistent incorrect B height."], sourceEvidence: [evidence], notes: "Second requested coordinate." },
    ],
    acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "MARK", effect: "FOLLOW_THROUGH", normalisedSummary: "A second coordinate consistent with an incorrect first-coordinate height can still earn the second mark.", appliesToPartIds: ["Q2_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "Omitting coordinate brackets or presenting the answers as vectors/component form caps the response at one mark.", appliesToPartIds: ["Q2_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [P1], marksAwarded: null, maximumMarks: 1, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q2_MAIN", "INTERPRETATION", "State the coordinates of B.", "Read the first target vertex from the axis-aligned 3D structure.", ["geo-g08-3d-coordinates"], ["geo-g8-1"], ["Q2_S1"], [evidence], { illustrativeEvidence: [{ id: "Q2_M1_E1", normalisedEvidence: "State (8,4,10) for B.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: ["VIS_Q2"], sourceEvidence: [evidence] }], methodPathwayIds: [P1], presentationConditions: ["Coordinate presentation is subject to the source's one-mark cap."], sourceDirectiveIds: [D2] }),
    markNode(M2, 2, "Q2_MAIN", "INTERPRETATION", "State the coordinates of C.", "Read the second target vertex, allowing the source-specified consistent-height follow-through.", ["geo-g08-3d-coordinates"], ["geo-g8-1"], ["Q2_S2"], [evidence], {
      illustrativeEvidence: [{ id: "Q2_M2_E1", normalisedEvidence: "State (4,0,10) for C.", acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: ["VIS_Q2"], sourceEvidence: [evidence] }],
      dependencies: [{ type: "CONSISTENT_WITH_EARLIER_RESULT", relatedMarkIds: [M1], relatedQuestionPartIds: ["Q2_MAIN"], conditionSummary: "The C height may follow a candidate's incorrect B height as explicitly illustrated by the source.", sourceEvidence: [evidence] }],
      followThrough: { allowed: true, fromMarkIds: [M1], fromQuestionPartIds: ["Q2_MAIN"], requiresComparableDifficulty: false, blockedForRequiredResult: false, blockedByInvalidMathematicalState: false, blockedByTrivialisedLaterWork: false, sourceBasis: "QUESTION_SPECIFIC", sourceEvidence: [evidence], notes: "The source example B=(8,4,9), C=(4,0,9) awards the C mark." },
      methodPathwayIds: [P1], presentationConditions: ["Coordinate presentation is subject to the source's one-mark cap."], sourceDirectiveIds: [D1, D2],
    }),
  ],
  methodPathways: [{ id: P1, variantId: "READ_AXIS_ALIGNED_SOLID", evidenceRole: "PRIMARY_ILLUSTRATIVE", supportsFullCredit: true, applicabilityConditions: [], steps: [
    { id: "Q2_P1_S1", order: 1, normalisedStep: "Use the vertical relation from A to B to retain x and y and determine z.", linkedQuestionSubgoalIds: ["Q2_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["INTERPRET_3D_COORDINATES"], resultingStateSummary: "B=(8,4,10)", sourceEvidence: [evidence] },
    { id: "Q2_P1_S2", order: 2, normalisedStep: "Use the cube/cuboid axis alignment to locate C.", linkedQuestionSubgoalIds: ["Q2_S2"], linkedMarkIds: [M2], dependsOnStepIds: [], requiredOperations: ["INTERPRET_3D_COORDINATES"], resultingStateSummary: "C=(4,0,10)", sourceEvidence: [evidence] },
  ], markMappingComplete: true, sourceTotalAwardRules: [], mathematicallyEquivalentMethodIds: [], materiallyDistinctFromMethodIds: [], excludedMethodReasons: [], sourceEvidence: [evidence] }],
  methodEquivalence: emptyMethodEquivalence(),
  workingPolicy: workingPolicy(answerOnly("NOT_STATED", null, [], [evidence], [], [], "This is a write-down task; the source marks the coordinate statements directly and does not state a separate answer-only rule."), [], [M1, M2], "P2", 2014),
  presentationPolicy: presentationPolicy([evidence], { coordinateBrackets: "REQUIRED_FOR_FULL_CREDIT", otherConditions: ["Vector/component-form presentation caps the question at one mark."] }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q2_CR_HEIGHT_FOLLOW", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "CONSISTENT_Z_FOLLOW_THROUGH", normalisedResponse: "Use B=(8,4,9) and then C=(4,0,9).", affectedMarkIds: [M1], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: true, sourceDirectiveIds: [D1], sourceEvidence: [evidence] },
    { id: "Q2_CR_PRESENTATION_CAP", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "PRESENTATION_ERROR", errorFamily: "COORDINATE_PRESENTATION", normalisedResponse: "Omit coordinate brackets or give the coordinate triples as vector components.", affectedMarkIds: [M1, M2], marksAwarded: null, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q2_MAIN", markIds: [M1, M2] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q2_S1", markIds: [M1] }, { questionSubgoalId: "Q2_S2", markIds: [M2] }],
    promptInstructionConsequences: [{ instructionType: "WRITE_DOWN_COORDINATES", markingConsequence: "Each requested coordinate triple is directly mark-bearing; presentation as coordinates rather than vectors matters for full credit.", affectedMarkIds: [M1, M2], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q2_INFO_A", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q2_INFO_STRUCT", usedByMethodIds: [P1], supportsMarkIds: [M1, M2] }],
    representationEvidenceMap: [{ visualElementId: "VIS_Q2", normalisedEvidence: "The 3D diagram supplies the axis alignment and vertex topology needed for both coordinate marks.", supportsMarkIds: [M1, M2] }],
    crossPartDependencies: [],
    errorPropagationGraph: [{ sourceMarkIds: [M1], sourceQuestionPartIds: ["Q2_MAIN"], affectedMarkIds: [M2], survivingMarkIds: [M2], conditionSummary: "The second coordinate can retain its mark when its height is consistent with the candidate's incorrect first coordinate.", sourceEvidence: [evidence] }],
  },
  sourcePresentation: sourcePresentation([13], "TABLE_ROW", 1, 2, 0),
  consistency: notReviewedConsistency(comparisonKey("P2_Q2_MARKING_COMPARISON", question.family.familyId, ["geo-g08-3d-coordinates"], 2, ["COORDINATES"], ["coordinate presentation", "within-question follow-through", "visual read-off"]), [
    consistencyFeature("coordinate_brackets_full_credit_gate", true, "Omitted brackets cap the question at one mark.", [evidence]),
    consistencyFeature("component_form_full_credit_gate", true, "Vector/component-form answers cap the question at one mark.", [evidence]),
    consistencyFeature("second_coordinate_follow_through", true, "A consistent second z-coordinate can score after an incorrect first z-coordinate.", [evidence]),
  ]),
  integrity: answerIntegrity(), generation: generationNotReviewed(), review: answerReviewInProgress("2", "P2", 2014),
} satisfies AnswerCatalogEntry;
