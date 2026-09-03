import type { QuestionResponseType } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { AnswerCatalogEntry, CommonResponsePattern, ExpectedAnswerVariant, MarkNode, MethodPathway, SourceMarkingDirective } from "./AnswerCatalogTypes";
import { asHistoricalAnswerCatalogEntry } from "./AnswerCatalogHistoricalView";
import { answerOnly, catalogValue, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, markNode, notReviewed, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "./AnswerCatalogHelpers";
import type { A8AnswerConfig } from "./A8SimultaneousEquationsAnswerTypes";
import { CONCEPT_ID, SKILL_ID, detailedEvidence, historicalA8Review, policyIdsFor, sourceDirective } from "./A8SimultaneousEquationsAnswerCommon";

export const bareEntry = (config: A8AnswerConfig): AnswerCatalogEntry => {
  const question = config.question;
  const q = `Q${question.identity.questionNumber}`;
  const evidence = detailedEvidence(config);
  const M1 = `${question.identity.id}_M1`;
  const M2 = `${question.identity.id}_M2`;
  const M3 = `${question.identity.id}_M3`;
  const P1 = `${question.identity.id}_METHOD_ELIMINATION`;
  const directives: SourceMarkingDirective[] = [];
  const commonResponses: CommonResponsePattern[] = [];
  const directiveIds: string[] = [];

  if (config.detailedAnswerOnly === "NO_CREDIT") {
    const id = `${question.identity.id}_D_ANSWER_ONLY_ZERO`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "The correct final values without supporting working receive no marks.", "BLOCK", [`${q}_MAIN`], [M1, M2, M3], evidence, { marksAwarded: 0, maximumMarks: 0 }));
  }
  if (config.rejectedMethod) {
    const id = `${question.identity.id}_D_${config.rejectedMethod}`;
    directiveIds.push(id);
    const label = config.rejectedMethod === "GUESS_AND_CHECK" ? "guess-and-check" : "repeated substitution";
    directives.push(sourceDirective(id, `A solution obtained by ${label} receives no marks.`, "BLOCK", [`${q}_MAIN`], [M1, M2, M3], evidence, { marksAwarded: 0, maximumMarks: 0 }));
    commonResponses.push({ id: `${question.identity.id}_CR_${config.rejectedMethod}`, sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: config.rejectedMethod, normalisedResponse: `Obtain the values using ${label} rather than the source-accepted algebraic pathway.`, affectedMarkIds: [M1, M2, M3], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [id], sourceEvidence: evidence });
  }
  if (config.roundedFollowThroughAtLeastDp !== undefined) {
    const id = `${question.identity.id}_D_ROUNDED_FT`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, `After an earlier error, rounded variable values are accepted when given to at least ${config.roundedFollowThroughAtLeastDp} decimal place.`, "FOLLOW_THROUGH", [`${q}_MAIN`], [M2, M3], evidence));
  }
  if (config.reversedCoordinateFullCredit) {
    const id = `${question.identity.id}_D_REVERSED_COORDINATE_COR`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "A source-listed response with both correct variable values but a reversed final coordinate pair still receives full credit when valid algebraic working is shown.", "AWARD", [`${q}_MAIN`], [M1, M2, M3], evidence, { marksAwarded: 3, maximumMarks: 3 }));
    commonResponses.push({ id: `${question.identity.id}_CR_REVERSED_COORDINATE`, sourceStatus: "EXPLICITLY_LISTED", category: "PRESENTATION_ERROR", errorFamily: "REVERSED_FINAL_COORDINATE_PAIR", normalisedResponse: "Show valid algebra that gives the two correct variable values, then reverse their order in the written coordinate pair.", affectedMarkIds: [], marksAwarded: 3, maximumMarks: 3, followThroughAvailable: false, sourceDirectiveIds: [id], sourceEvidence: evidence });
  }
  if (config.separateScalingEitherCorrect) {
    const id = `${question.identity.id}_D_EITHER_SCALING`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "When separate scaling routes are used to obtain the two variables, the scaling mark is awarded if either scaling is correct.", "ACCEPT", [`${q}_MAIN`], [M1], evidence));
  }
  if (config.finalFractionConversionNotPenalised) {
    const id = `${question.identity.id}_D_FRACTION_CONVERSION`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "For the final variable mark, an incorrect conversion of an otherwise valid fraction to mixed-number or decimal form is not penalised.", "IGNORE_PENALTY", [`${q}_MAIN`], [M3], evidence));
  }

  const [s1, s2] = config.solution;
  const [v1, v2] = config.variableSymbols;
  const responseTypes: QuestionResponseType[] = config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE" ? ["COORDINATES"] : ["NUMBER"];
  const canonicalAnswers: ExpectedAnswerVariant[] = config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE"
    ? [{ id: `${question.identity.id}_A1`, normalisedAnswer: `(${s1}, ${s2})`, numericValue: null, answerForm: "COORDINATES", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: "Coordinates of the common solution under the source variable order." }]
    : [
        { id: `${question.identity.id}_A1`, normalisedAnswer: `${v1}=${s1}`, numericValue: s1, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: null },
        { id: `${question.identity.id}_A2`, normalisedAnswer: `${v2}=${s2}`, numericValue: s2, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: null },
      ];

  const oldProfile = config.markProfile === "SCALE_STRATEGY_CORRECT";
  const marks: MarkNode[] = [
    markNode(M1, 1, `${q}_MAIN`, "PROCESS", "Provide correct coefficient scaling that enables elimination of one variable.", "Establish an elimination-ready equivalent system.", [SKILL_ID], [CONCEPT_ID], [`${q}_S1`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M1_E1`, normalisedEvidence: "Scale one or both equations so one variable has matching or opposite coefficients.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: [P1], sourceDirectiveIds: config.separateScalingEitherCorrect ? [`${question.identity.id}_D_EITHER_SCALING`] : [],
    }),
    markNode(M2, 2, `${q}_MAIN`, "PROCESS", oldProfile ? "Follow a valid algebraic strategy through to produce values for both variables." : "Obtain a consistent value for one variable after valid scaling/elimination.", oldProfile ? "Carry the elimination strategy through to solved values." : "Solve the first variable consistently.", [SKILL_ID], [CONCEPT_ID], [`${q}_S2`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M2_E1`, normalisedEvidence: oldProfile ? "Continue a valid elimination/substitution-back strategy to candidate values." : `Obtain ${v1}=${s1} or ${v2}=${s2}, with source-permitted follow-through after an earlier error where applicable.`, acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: [P1], sourceDirectiveIds: config.roundedFollowThroughAtLeastDp !== undefined ? [`${question.identity.id}_D_ROUNDED_FT`] : [],
    }),
    markNode(M3, 3, `${q}_MAIN`, "ACCURACY", oldProfile ? "Calculate the correct values for both variables." : "Obtain a consistent value for the other variable.", oldProfile ? "Complete the system with both correct values." : "Complete the unique solution pair.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M3_E1`, normalisedEvidence: config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE" ? `State the common solution values ${v1}=${s1} and ${v2}=${s2} for point P.` : `Complete the solution with ${v1}=${s1} and ${v2}=${s2}.`, acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: config.detailedAnswerOnly !== "NO_CREDIT", visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: [P1], sourceDirectiveIds: [
        ...(config.roundedFollowThroughAtLeastDp !== undefined ? [`${question.identity.id}_D_ROUNDED_FT`] : []),
        ...(config.finalFractionConversionNotPenalised ? [`${question.identity.id}_D_FRACTION_CONVERSION`] : []),
        ...(config.reversedCoordinateFullCredit ? [`${question.identity.id}_D_REVERSED_COORDINATE_COR`] : []),
      ],
    }),
  ];

  const pathway: MethodPathway = {
    id: P1,
    variantId: "COEFFICIENT_SCALING_AND_ELIMINATION",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: ["Use an algebraic strategy consistent with the source requirement."],
    steps: [
      { id: `${q}_P1_S1`, order: 1, normalisedStep: "Scale one or both equations to obtain matching/opposite coefficients for one variable.", linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["SCALE_EQUATIONS"], resultingStateSummary: "elimination-ready equivalent equations", sourceEvidence: evidence },
      { id: `${q}_P1_S2`, order: 2, normalisedStep: "Eliminate one variable and solve for a first value.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [M2], dependsOnStepIds: [`${q}_P1_S1`], requiredOperations: ["ELIMINATE", "SOLVE"], resultingStateSummary: `${v1}=${s1} or ${v2}=${s2}`, sourceEvidence: evidence },
      { id: `${q}_P1_S3`, order: 3, normalisedStep: "Substitute back or use a second valid elimination step to obtain the other value.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M3], dependsOnStepIds: [`${q}_P1_S2`], requiredOperations: ["SUBSTITUTE", "SOLVE"], resultingStateSummary: `${v1}=${s1}, ${v2}=${s2}`, sourceEvidence: evidence },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: directiveIds.filter((id) => id.endsWith("ANSWER_ONLY_ZERO") || id.includes("GUESS_AND_CHECK") || id.includes("REPEATED_SUBSTITUTION") || id.includes("REVERSED_COORDINATE")),
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: config.rejectedMethod ? [`The source explicitly assigns zero credit to ${config.rejectedMethod === "GUESS_AND_CHECK" ? "guess-and-check" : "repeated substitution"}.`] : [],
    sourceEvidence: evidence,
  };

  const policy = policyIdsFor(question.identity.year);
  const review = historicalA8Review(config);
  return asHistoricalAnswerCatalogEntry({
    identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: question.identity.year, paper: question.identity.paper, questionNumber: question.identity.questionNumber, questionFamilyId: question.family.familyId },
    sourceContext: { sourceDocumentId: `N5_MATH_${question.identity.year}_MS`, totalMarks: 3, sourcePages: config.msPages, printedPageLabels: config.printedPageLabels, sourceEvidence: evidence, generalMarkingPolicyId: policy.policyId },
    expectedResponse: { responseTypes, canonicalAnswers, acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(null, null), requiredContextStatement: false, answerCountRequired: config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE" ? 1 : 2, invalidRelatedValues: [], extraAnswerTreatment: "QUESTION_SPECIFIC" },
    sourceDirectives: directives,
    markNodes: marks,
    methodPathways: [pathway],
    methodEquivalence: emptyMethodEquivalence(),
    workingPolicy: {
      ...workingPolicy(
        config.detailedAnswerOnly === "NO_CREDIT"
          ? answerOnly("NO_CREDIT", 0, [], evidence, [`${question.identity.id}_D_ANSWER_ONLY_ZERO`])
          : answerOnly("NOT_STATED", null, [], evidence, [], [], "The detailed question row does not state a question-specific answer-only award; any general policy remains linked separately."),
        [M1, M2, M3],
        [],
        question.identity.paper,
        question.identity.year,
      ),
      repeatedSubstitutionAccepted: config.rejectedMethod === "REPEATED_SUBSTITUTION"
        ? catalogValue(false, evidence, "SOURCE_FACT", "HIGH", "The question-specific notes explicitly reject repeated substitution.")
        : notReviewed<boolean>(config.rejectedMethod === "GUESS_AND_CHECK"
          ? "The detailed source rejects guess-and-check but does not state whether repeated substitution is accepted."
          : "The detailed source does not state whether repeated substitution is accepted."),
    },
    presentationPolicy: presentationPolicy(evidence, config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE" ? { coordinateBrackets: "NOT_STATED", otherConditions: config.reversedCoordinateFullCredit ? ["The source-listed reversed final coordinate pair still receives full credit when both variable values and algebraic working are correct."] : [] } : {}),
    visualMarking: emptyVisualMarking(),
    commonResponses,
    generalPolicy: { policyId: policy.policyId, relevantRuleIds: policy.ruleIds, questionSpecificOverrides: directiveIds },
    relationship: {
      partMarkMap: [{ questionPartId: `${q}_MAIN`, markIds: [M1, M2, M3] }],
      subgoalMarkMap: [{ questionSubgoalId: `${q}_S1`, markIds: [M1] }, { questionSubgoalId: `${q}_S2`, markIds: [M2] }, { questionSubgoalId: `${q}_S3`, markIds: [M3] }],
      promptInstructionConsequences: [{ instructionType: "ALGEBRAIC_SOLUTION", markingConsequence: "The marking instructions award process credit for coefficient scaling and a valid algebraic solving strategy.", affectedMarkIds: [M1, M2, M3], sourceEvidence: evidence }],
      informationEvidenceMap: [{ questionInformationId: `${q}_INFO_EQ1`, usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }, { questionInformationId: `${q}_INFO_EQ2`, usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3] }],
      representationEvidenceMap: config.surfaceFamily === "GRAPH_INTERSECTION_SOLVE" ? [{ visualElementId: `VIS_${q}_GRAPH`, normalisedEvidence: "The supplied graph represents the same two equations and labels their common intersection, but the source requires algebraic work for credit.", supportsMarkIds: [] }] : [],
      crossPartDependencies: [],
      errorPropagationGraph: config.roundedFollowThroughAtLeastDp !== undefined ? [{ sourceMarkIds: [M1], sourceQuestionPartIds: [`${q}_MAIN`], affectedMarkIds: [M2, M3], survivingMarkIds: [M2, M3], conditionSummary: `After an earlier error, later variable values may still score when rounded to at least ${config.roundedFollowThroughAtLeastDp} decimal place.`, sourceEvidence: evidence }] : [],
    },
    sourcePresentation: sourcePresentation(config.msPages, "TABLE_ROW", 1, directives.length, commonResponses.length),
    consistency: {
      factualFingerprint: [
        consistencyFeature("a8_mark_profile", config.markProfile, `This source uses the ${config.markProfile} decomposition.`, evidence),
        consistencyFeature("answer_only_treatment", config.detailedAnswerOnly, config.detailedAnswerOnly === "NO_CREDIT" ? "The detailed source explicitly gives no credit for unsupported correct answers." : "The detailed source does not state a question-specific answer-only total.", evidence),
        consistencyFeature("explicitly_rejected_method", config.rejectedMethod, config.rejectedMethod ? `The detailed source explicitly rejects ${config.rejectedMethod}.` : "No A8-specific method exclusion is stated in the detailed row.", evidence),
      ],
    },
    review,
  });
};
