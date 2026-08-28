import type { AnswerCatalogEntry } from "../../AnswerCatalogTypes";
import { N5_MATHS_2014_P1_Q1 as question } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q1";
import {
  GENERAL_2014_RULE_IDS,
  answerIntegrity,
  answerOnly,
  answerReviewInProgress,
  comparisonKey,
  consistencyFeature,
  emptyMethodEquivalence,
  emptyVisualMarking,
  generationNotReviewed,
  markNode,
  msEvidence,
  notReviewedConsistency,
  presentationPolicy,
  sourcePresentation,
  unitProfile,
  workingPolicy,
} from "../../AnswerCatalogHelpers";

const evidence = msEvidence("1", 3);
const M1 = "N5_MATH_2014_P1_Q1_M1";
const M2 = "N5_MATH_2014_P1_Q1_M2";
const D1 = "N5_MATH_2014_P1_Q1_D_ANSWER_ONLY";
const D2 = "N5_MATH_2014_P1_Q1_D_UNSIMPLIFIED";
const D3 = "N5_MATH_2014_P1_Q1_D_SIMPLIFICATION_ELIGIBILITY";
const D4 = "N5_MATH_2014_P1_Q1_D_LATER_INVALID";
const P1 = "N5_MATH_2014_P1_Q1_METHOD_IMPROPER";
const P2 = "N5_MATH_2014_P1_Q1_METHOD_DISTRIBUTIVE";

export const N5_MATHS_2014_P1_Q1_MS = {
  identity: {
    id: question.identity.answerCatalogId,
    schemaVersion: "N5_CATALOG_V2",
    sourceQuestionId: question.identity.id,
    courseId: question.identity.courseId,
    paperContextId: question.identity.paperContextId,
    year: 2014,
    paper: "P1",
    questionNumber: "1",
    questionFamilyId: question.family.familyId,
  },
  sourceContext: {
    sourceDocumentId: "N5_MATH_2014_MS",
    totalMarks: 2,
    sourcePages: [3],
    printedPageLabels: ["Page three"],
    sourceEvidence: [evidence],
    generalMarkingPolicyId: "N5_MATH_2014_GENERAL_MARKING_POLICY",
  },
  expectedResponse: {
    responseTypes: ["NUMBER"],
    canonicalAnswers: [{
      id: "N5_MATH_2014_P1_Q1_A1",
      normalisedAnswer: "25/27",
      numericValue: null,
      answerForm: "NUMBER",
      mathematicallyEquivalentToVariantIds: [],
      conditionsForAcceptance: ["Must be in simplest fractional form for the second mark."],
      sourceEvidence: [evidence],
      notes: null,
    }],
    acceptedEquivalentForms: [],
    precisionType: "NONE",
    precisionValue: null,
    acceptedRange: null,
    units: unitProfile(null, null),
    requiredContextStatement: false,
    answerCountRequired: 1,
    invalidRelatedValues: [],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  },
  sourceDirectives: [
    { id: D1, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "AWARD", normalisedSummary: "A correct simplified final answer alone receives both marks.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M1, M2], appliesToMethodIds: [], marksAwarded: 2, maximumMarks: 2, sourceEvidence: [evidence] },
    { id: D2, layer: "QUESTION_NOTE", scope: "QUESTION", effect: "LIMIT", normalisedSummary: "The equivalent unsimplified fraction 100/108, even without working, receives one mark.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [], marksAwarded: 1, maximumMarks: 1, sourceEvidence: [evidence] },
    { id: D3, layer: "QUESTION_NOTE", scope: "MARK", effect: "REQUIRE", normalisedSummary: "The final simplification mark is only available when there is a genuine simplification to perform.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
    { id: D4, layer: "QUESTION_NOTE", scope: "MARK", effect: "BLOCK", normalisedSummary: "Incorrect work written after reaching the correct fraction can remove the final mark.", appliesToPartIds: ["Q1_MAIN"], appliesToMarkIds: [M2], appliesToMethodIds: [], marksAwarded: null, maximumMarks: null, sourceEvidence: [evidence] },
  ],
  markNodes: [
    markNode(M1, 1, "Q1_MAIN", "PROCESS", "Begin a valid multiplication of the two fractional quantities.", "Establish a valid fraction-multiplication process.", ["num-n5-fractions"], ["num-n5-1-multiply"], ["Q1_S1"], [evidence], {
      illustrativeEvidence: [
        { id: "Q1_M1_E1", normalisedEvidence: "Convert the mixed number to an improper fraction and multiply by the proper fraction.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
        { id: "Q1_M1_E2", normalisedEvidence: "Distribute the proper fraction across the whole-number and fractional parts of the mixed number.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] },
      ],
      methodPathwayIds: [P1, P2],
      sourceDirectiveIds: [D1],
    }),
    markNode(M2, 2, "Q1_MAIN", "ACCURACY", "Give a result consistent with the multiplication and in simplest form.", "Complete and simplify the exact fraction result.", ["num-n5-fractions"], ["num-n5-1-multiply"], ["Q1_S2"], [evidence], {
      illustrativeEvidence: [{ id: "Q1_M2_E1", normalisedEvidence: "State the simplified result 25/27.", acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: [evidence] }],
      eligibilityConditions: ["A simplification opportunity must exist for this mark."],
      blockingConditions: ["Subsequent invalid manipulation after the correct fraction blocks this final mark."],
      methodPathwayIds: [P1, P2],
      presentationConditions: ["Simplest fractional form is mark-bearing."],
      sourceDirectiveIds: [D1, D2, D3, D4],
    }),
  ],
  methodPathways: [
    {
      id: P1,
      variantId: "IMPROPER_FRACTION_ROUTE",
      evidenceRole: "PRIMARY_ILLUSTRATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [],
      steps: [
        { id: "Q1_P1_S1", order: 1, normalisedStep: "Rewrite the mixed number as an improper fraction.", linkedQuestionSubgoalIds: ["Q1_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["CONVERT"], resultingStateSummary: "Two proper/improper fractions are ready for multiplication.", sourceEvidence: [evidence] },
        { id: "Q1_P1_S2", order: 2, normalisedStep: "Multiply and simplify the resulting fraction.", linkedQuestionSubgoalIds: ["Q1_S2"], linkedMarkIds: [M1, M2], dependsOnStepIds: ["Q1_P1_S1"], requiredOperations: ["MULTIPLY", "SIMPLIFY"], resultingStateSummary: "25/27", sourceEvidence: [evidence] },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: [P2],
      materiallyDistinctFromMethodIds: [P2],
      excludedMethodReasons: [],
      sourceEvidence: [evidence],
    },
    {
      id: P2,
      variantId: "DISTRIBUTIVE_ROUTE",
      evidenceRole: "ILLUSTRATIVE_ALTERNATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [],
      steps: [
        { id: "Q1_P2_S1", order: 1, normalisedStep: "Distribute multiplication across the mixed-number whole and fractional components.", linkedQuestionSubgoalIds: ["Q1_S1"], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["DISTRIBUTE", "MULTIPLY"], resultingStateSummary: null, sourceEvidence: [evidence] },
        { id: "Q1_P2_S2", order: 2, normalisedStep: "Combine the two fraction products and simplify.", linkedQuestionSubgoalIds: ["Q1_S2"], linkedMarkIds: [M2], dependsOnStepIds: ["Q1_P2_S1"], requiredOperations: ["ADD", "SIMPLIFY"], resultingStateSummary: "25/27", sourceEvidence: [evidence] },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: [P1],
      materiallyDistinctFromMethodIds: [P1],
      excludedMethodReasons: [],
      sourceEvidence: [evidence],
    },
  ],
  methodEquivalence: {
    ...emptyMethodEquivalence(),
    equivalentMethodGroups: [{ id: "Q1_EQUIV_FULL", methodIds: [P1, P2], equivalenceReason: "Both are explicitly illustrated as valid full-credit fraction-multiplication routes.", sourceEvidence: [evidence] }],
  },
  workingPolicy: workingPolicy(answerOnly("FULL_CREDIT", 2, [M1, M2], [evidence], [D1]), [], [M1]),
  presentationPolicy: presentationPolicy([evidence], { simplification: "REQUIRED_FOR_MARK" }),
  visualMarking: emptyVisualMarking(),
  commonResponses: [
    { id: "Q1_CR_UNSIMPLIFIED", sourceStatus: "EXPLICITLY_LISTED", category: "PARTIAL_METHOD", errorFamily: "UNSIMPLIFIED_EQUIVALENT", normalisedResponse: "Equivalent unsimplified fraction 100/108.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D2], sourceEvidence: [evidence] },
    { id: "Q1_CR_CORRECT_THEN_INVALID", sourceStatus: "DERIVED_FROM_EXPLICIT_NOTE", category: "COMMON_ERROR", errorFamily: "SUBSEQUENT_INVALID_WORK", normalisedResponse: "A correct intermediate/final fraction is followed by invalid manipulation.", affectedMarkIds: [M2], marksAwarded: 1, maximumMarks: 1, followThroughAvailable: false, sourceDirectiveIds: [D4], sourceEvidence: [evidence] },
  ],
  generalPolicy: { policyId: "N5_MATH_2014_GENERAL_MARKING_POLICY", relevantRuleIds: [...GENERAL_2014_RULE_IDS], questionSpecificOverrides: [D1, D2, D3, D4] },
  relationship: {
    partMarkMap: [{ questionPartId: "Q1_MAIN", markIds: [M1, M2] }],
    subgoalMarkMap: [{ questionSubgoalId: "Q1_S1", markIds: [M1] }, { questionSubgoalId: "Q1_S2", markIds: [M2] }],
    promptInstructionConsequences: [{ instructionType: "SIMPLEST_FORM", markingConsequence: "Simplification is explicitly mark-bearing for the second mark.", affectedMarkIds: [M2], sourceEvidence: [evidence] }],
    informationEvidenceMap: [{ questionInformationId: "Q1_INFO_EXPR", usedByMethodIds: [P1, P2], supportsMarkIds: [M1, M2] }, { questionInformationId: "Q1_INFO_FORM", usedByMethodIds: [P1, P2], supportsMarkIds: [M2] }],
    representationEvidenceMap: [],
    crossPartDependencies: [],
    errorPropagationGraph: [],
  },
  sourcePresentation: sourcePresentation([3], "TABLE_ROW", 2, 4, 2),
  consistency: notReviewedConsistency(
    comparisonKey("Q1_MARKING_COMPARISON", question.family.familyId, ["num-n5-fractions"], 2, ["NUMBER"], ["fraction simplification", "answer-only credit", "later invalid work", "alternative methods"]),
    [
      consistencyFeature("answer_only_treatment", "FULL_CREDIT", "The source explicitly gives full credit for the correct final answer without working.", [evidence]),
      consistencyFeature("simplification_mark_bearing", true, "Simplest form is explicitly tied to the second mark.", [evidence]),
      consistencyFeature("later_invalid_work_can_remove_final_mark", true, "A question-specific note overrides the general no-penalty principle for later work.", [evidence]),
      consistencyFeature("explicit_full_credit_method_count", 2, "Two materially distinct full-credit routes are illustrated.", [evidence]),
    ],
  ),
  integrity: answerIntegrity(),
  generation: generationNotReviewed(),
  review: answerReviewInProgress("1"),
} satisfies AnswerCatalogEntry;
