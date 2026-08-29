import type { QuestionResponseType } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { AnswerCatalogEntry, CommonResponsePattern, ExpectedAnswerVariant, MarkNode, MethodPathway, SourceMarkingDirective } from "./AnswerCatalogTypes";
import { answerIntegrity, answerOnly, catalogValue, consistencyFeature, emptyMethodEquivalence, emptyVisualMarking, generationNotReviewed, markNode, notReviewed, presentationPolicy, sourcePresentation, unitProfile, workingPolicy } from "./AnswerCatalogHelpers";
import type { A8AnswerConfig } from "./A8SimultaneousEquationsAnswerTypes";
import { CONCEPT_ID, SKILL_ID, crossCorpusFor, detailedEvidence, policyIdsFor, reviewAfterA8Comparison, sourceDirective } from "./A8SimultaneousEquationsAnswerCommon";


export const contextualEntry = (config: A8AnswerConfig): AnswerCatalogEntry => {
  if (!config.context) throw new Error("Contextual A8 Answer Catalogue entries require context config.");
  const question = config.question;
  const q = `Q${question.identity.questionNumber}`;
  const evidence = detailedEvidence(config);
  const M1 = `${question.identity.id}_A_M1`;
  const M2 = `${question.identity.id}_B_M1`;
  const M3 = `${question.identity.id}_C_M1`;
  const M4 = `${question.identity.id}_C_M2`;
  const M5 = `${question.identity.id}_C_M3`;
  const M6 = `${question.identity.id}_C_M4`;
  const P1 = `${question.identity.id}_METHOD_ELIMINATION`;
  const directives: SourceMarkingDirective[] = [];
  const commonResponses: CommonResponsePattern[] = [];
  const directiveIds: string[] = [];
  const context = config.context;
  const [v1, v2] = config.variableSymbols;
  const [s1, s2] = config.solution;
  const isDerived = config.surfaceFamily === "CONTEXT_DERIVED_TOTAL";
  const valueMarkProfile = config.markProfile !== "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE";

  if (config.detailedAnswerOnly === "NO_CREDIT") {
    const id = `${question.identity.id}_D_PART_C_ANSWER_ONLY_ZERO`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "A correct result for the four-mark solving part without supporting working receives no marks for that part.", "BLOCK", [`${q}_c`], [M3, M4, M5, M6], evidence, { scope: "PART", marksAwarded: 0, maximumMarks: 0 }));
  }
  if (config.rejectedMethod) {
    const id = `${question.identity.id}_D_${config.rejectedMethod}`;
    directiveIds.push(id);
    const label = config.rejectedMethod === "GUESS_AND_CHECK" ? "guess-and-check" : "repeated substitution";
    directives.push(sourceDirective(id, `A part-(c) solution obtained by ${label} receives no marks for the four-mark solving section.`, "BLOCK", [`${q}_c`], [M3, M4, M5, M6], evidence, { scope: "PART", marksAwarded: 0, maximumMarks: 0 }));
    commonResponses.push({ id: `${question.identity.id}_CR_${config.rejectedMethod}`, sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: config.rejectedMethod, normalisedResponse: `Use ${label} for the four-mark solving section.`, affectedMarkIds: [M3, M4, M5, M6], marksAwarded: 0, maximumMarks: 0, followThroughAvailable: false, sourceDirectiveIds: [id], sourceEvidence: evidence });
  }
  if (context.negativeValuesBlockFinalMark) {
    const id = `${question.identity.id}_D_NEGATIVE_BLOCK_FINAL`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "The final contextual/derived mark is unavailable if either solved contextual quantity is negative.", "BLOCK", [`${q}_c`], [M6], evidence, { scope: "MARK" }));
  }
  if (context.communicationRequired) {
    const id = `${question.identity.id}_D_COMMUNICATION`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, `The final communication mark requires ${context.communicationConditions.join("; ")}.`, "REQUIRE", [`${q}_c`], [M6], evidence, { scope: "MARK" }));
  }
  if (context.earlierPartEvidenceCanAppearLater) {
    const id = `${question.identity.id}_D_EQUATIONS_CAN_APPEAR_LATER`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "A correct equation omitted or incomplete in its own part can receive its equation-construction mark when the same correct equation appears elsewhere in the question.", "ACCEPT", [`${q}_a`, `${q}_b`, `${q}_c`], [M1, M2], evidence));
  }
  if (context.firstEquationRequiresSpecifiedVariables) {
    const id = `${question.identity.id}_D_FIXED_VARIABLES_A`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "The first equation-construction mark is unavailable when alternative variable symbols are used instead of the symbols explicitly defined in the prompt.", "BLOCK", [`${q}_a`], [M1], evidence, { scope: "PART" }));
  }
  if (context.currencyNearestPennyForFinalCommunication) {
    const id = `${question.identity.id}_D_NEAREST_PENNY_COMMUNICATION`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, "The final communication mark is available only when the two monetary values are stated to the nearest penny; earlier value marks can accept source-specified unrounded or nearest-penny follow-through values.", "REQUIRE", [`${q}_c`], [M4, M5, M6], evidence));
  }
  if (context.equationBadFormAccepted?.length) {
    const id = `${question.identity.id}_D_EQUATION_BAD_FORM`;
    directiveIds.push(id);
    directives.push(sourceDirective(id, `The source accepts the listed equation-total presentation variants as bad form rather than withholding the equation mark: ${context.equationBadFormAccepted.join("; ")}.`, "ACCEPT", [`${q}_a`, `${q}_b`], [M1, M2], evidence));
  }

  const canonicalAnswers: ExpectedAnswerVariant[] = [
    { id: `${question.identity.id}_A_EQ1`, normalisedAnswer: context.equationAnswers[0], numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: "Part (a)." },
    { id: `${question.identity.id}_A_EQ2`, normalisedAnswer: context.equationAnswers[1], numericValue: null, answerForm: "EQUATION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: "Part (b)." },
  ];
  if (isDerived) {
    canonicalAnswers.push({ id: `${question.identity.id}_A_DERIVED`, normalisedAnswer: `${context.derivedAnswer}${context.derivedUnit ? ` ${context.derivedUnit}` : ""}`, numericValue: context.derivedAnswer ?? null, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["The final source mark requires a calculation consistent with the solved unit values."], sourceEvidence: evidence, notes: "Part (c) final target." });
  } else {
    canonicalAnswers.push({ id: `${question.identity.id}_A_VALUE1`, normalisedAnswer: `${context.objectLabels[0]}=${s1}${context.unitSymbol ? ` ${context.unitSymbol}` : ""}`, numericValue: s1, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: context.communicationConditions, sourceEvidence: evidence, notes: "First contextual unknown." });
    canonicalAnswers.push({ id: `${question.identity.id}_A_VALUE2`, normalisedAnswer: `${context.objectLabels[1]}=${s2}${context.unitSymbol ? ` ${context.unitSymbol}` : ""}`, numericValue: s2, answerForm: "MIXED", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: context.communicationConditions, sourceEvidence: evidence, notes: "Second contextual unknown." });
  }

  const marks: MarkNode[] = [
    markNode(M1, 1, `${q}_a`, "REPRESENTATION", "Construct a correct linear equation for the first contextual relationship.", "Translate the first relationship into algebra.", [SKILL_ID], [CONCEPT_ID], [`${q}_S1`], evidence, { illustrativeEvidence: [{ id: `${q}_A_M1_E1`, normalisedEvidence: context.equationAnswers[0], acceptedLocations: context.earlierPartEvidenceCanAppearLater ? ["FINAL_ANSWER", "WORKING", "LATER_PART"] : ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: !!context.earlierPartEvidenceCanAppearLater, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }], sourceDirectiveIds: [ ...(context.firstEquationRequiresSpecifiedVariables ? [`${question.identity.id}_D_FIXED_VARIABLES_A`] : []), ...(context.equationBadFormAccepted?.length ? [`${question.identity.id}_D_EQUATION_BAD_FORM`] : []), ...(context.earlierPartEvidenceCanAppearLater ? [`${question.identity.id}_D_EQUATIONS_CAN_APPEAR_LATER`] : []) ] }),
    markNode(M2, 1, `${q}_b`, "REPRESENTATION", "Construct a correct linear equation for the second contextual relationship.", "Translate the second relationship into algebra.", [SKILL_ID], [CONCEPT_ID], [`${q}_S2`], evidence, { illustrativeEvidence: [{ id: `${q}_B_M1_E1`, normalisedEvidence: context.equationAnswers[1], acceptedLocations: context.earlierPartEvidenceCanAppearLater ? ["FINAL_ANSWER", "WORKING", "LATER_PART"] : ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: !!context.earlierPartEvidenceCanAppearLater, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }], sourceDirectiveIds: [ ...(context.equationBadFormAccepted?.length ? [`${question.identity.id}_D_EQUATION_BAD_FORM`] : []), ...(context.earlierPartEvidenceCanAppearLater ? [`${question.identity.id}_D_EQUATIONS_CAN_APPEAR_LATER`] : []) ] }),
    markNode(M3, 1, `${q}_c`, "PROCESS", "Provide correct coefficient scaling for the two simultaneous equations.", "Create an elimination-ready equivalent system.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, { methodPathwayIds: [P1] }),
    markNode(M4, 2, `${q}_c`, "PROCESS", valueMarkProfile ? "Obtain a consistent value for one contextual unknown." : "Follow a valid simultaneous-equation strategy through to produce values for both unknowns.", valueMarkProfile ? "Solve the first contextual unknown." : "Carry the solving strategy through to candidate values.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, { illustrativeEvidence: [{ id: `${q}_C_M2_E1`, normalisedEvidence: valueMarkProfile ? `Obtain ${v1}=${s1} or ${v2}=${s2}.` : "Continue the elimination strategy to values for both variables.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }], methodPathwayIds: [P1], sourceDirectiveIds: context.currencyNearestPennyForFinalCommunication ? [`${question.identity.id}_D_NEAREST_PENNY_COMMUNICATION`] : [] }),
    markNode(M5, 3, `${q}_c`, "ACCURACY", valueMarkProfile ? "Obtain a consistent value for the other contextual unknown." : "Calculate the correct values for both contextual unknowns.", "Complete the solved pair.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, { illustrativeEvidence: [{ id: `${q}_C_M3_E1`, normalisedEvidence: `Complete the pair with ${v1}=${s1} and ${v2}=${s2}.`, acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }], methodPathwayIds: [P1], sourceDirectiveIds: context.currencyNearestPennyForFinalCommunication ? [`${question.identity.id}_D_NEAREST_PENNY_COMMUNICATION`] : [] }),
    markNode(M6, 4, `${q}_c`, isDerived ? "PROCESS" : "COMMUNICATION", isDerived ? "Carry out the requested calculation consistently using the solved contextual values." : "Communicate both contextual values in the source-required form.", isDerived ? "Evaluate the target bundle/linear combination." : "Attach the source-required labels, units and presentation.", [SKILL_ID], [CONCEPT_ID], [`${q}_S4`], evidence, { secondaryTypes: isDerived ? ["ACCURACY"] : ["PRESENTATION", "UNITS", "CONCLUSION"], illustrativeEvidence: [{ id: `${q}_C_M4_E1`, normalisedEvidence: isDerived ? `Use the solved values to obtain ${context.derivedAnswer}${context.derivedUnit ? ` ${context.derivedUnit}` : ""}.` : `State ${context.objectLabels[0]}=${s1} and ${context.objectLabels[1]}=${s2} with the source-required contextual presentation.`, acceptedLocations: ["FINAL_ANSWER", "WORKING"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: true, visualElementIds: [], sourceEvidence: evidence }], presentationConditions: context.communicationConditions, blockingConditions: context.negativeValuesBlockFinalMark ? ["Either contextual unknown being negative blocks this final source mark."] : [], methodPathwayIds: [P1], sourceDirectiveIds: [ ...(context.negativeValuesBlockFinalMark ? [`${question.identity.id}_D_NEGATIVE_BLOCK_FINAL`] : []), ...(context.communicationRequired ? [`${question.identity.id}_D_COMMUNICATION`] : []), ...(context.currencyNearestPennyForFinalCommunication ? [`${question.identity.id}_D_NEAREST_PENNY_COMMUNICATION`] : []) ] }),
  ];

  const pathway: MethodPathway = {
    id: P1,
    variantId: "FORM_EQUATIONS_THEN_ELIMINATE",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: ["Use the two contextual equations or algebraically equivalent forms."],
    steps: [
      { id: `${q}_P1_S1`, order: 1, normalisedStep: "Use the two contextual relationships as simultaneous linear equations.", linkedQuestionSubgoalIds: [`${q}_S1`, `${q}_S2`], linkedMarkIds: [M1, M2], dependsOnStepIds: [], requiredOperations: ["MODEL"], resultingStateSummary: "two independent equations", sourceEvidence: evidence },
      { id: `${q}_P1_S2`, order: 2, normalisedStep: "Scale the equations to make one variable eliminable.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M3], dependsOnStepIds: [`${q}_P1_S1`], requiredOperations: ["SCALE_EQUATIONS"], resultingStateSummary: "elimination-ready system", sourceEvidence: evidence },
      { id: `${q}_P1_S3`, order: 3, normalisedStep: "Eliminate and solve for the two unknown values.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M4, M5], dependsOnStepIds: [`${q}_P1_S2`], requiredOperations: ["ELIMINATE", "SOLVE", "SUBSTITUTE"], resultingStateSummary: `${v1}=${s1}, ${v2}=${s2}`, sourceEvidence: evidence },
      { id: `${q}_P1_S4`, order: 4, normalisedStep: isDerived ? "Evaluate the requested further linear combination from the solved values." : "State both solved values in the required context/units.", linkedQuestionSubgoalIds: [`${q}_S4`], linkedMarkIds: [M6], dependsOnStepIds: [`${q}_P1_S3`], requiredOperations: [isDerived ? "EVALUATE_DERIVED_TOTAL" : "COMMUNICATE"], resultingStateSummary: isDerived ? `${context.derivedAnswer}${context.derivedUnit ? ` ${context.derivedUnit}` : ""}` : "two contextual values communicated", sourceEvidence: evidence },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: directiveIds.filter((id) => id.includes("ANSWER_ONLY_ZERO") || id.includes("GUESS_AND_CHECK") || id.includes("REPEATED_SUBSTITUTION")),
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: config.rejectedMethod ? [`The source explicitly assigns zero credit to ${config.rejectedMethod === "GUESS_AND_CHECK" ? "guess-and-check" : "repeated substitution"} for the solving section.`] : [],
    sourceEvidence: evidence,
  };

  const policy = policyIdsFor(question.identity.year);
  const responseTypes: QuestionResponseType[] = isDerived ? ["EQUATION", "NUMBER"] : ["EQUATION", "MIXED"];
  const review = reviewAfterA8Comparison(config);
  return {
    identity: { id: question.identity.answerCatalogId, schemaVersion: "N5_CATALOG_V2", sourceQuestionId: question.identity.id, courseId: question.identity.courseId, paperContextId: question.identity.paperContextId, year: question.identity.year, paper: question.identity.paper, questionNumber: question.identity.questionNumber, questionFamilyId: question.family.familyId },
    sourceContext: { sourceDocumentId: `N5_MATH_${question.identity.year}_MS`, totalMarks: 6, sourcePages: config.msPages, printedPageLabels: config.printedPageLabels, sourceEvidence: evidence, generalMarkingPolicyId: policy.policyId },
    expectedResponse: { responseTypes, canonicalAnswers, acceptedEquivalentForms: [], precisionType: "NONE", precisionValue: null, acceptedRange: null, units: unitProfile(context.unitDimension, context.unitSymbol), requiredContextStatement: context.communicationRequired, answerCountRequired: isDerived ? 3 : 4, invalidRelatedValues: context.invalidCommunicationForms ?? [], extraAnswerTreatment: "QUESTION_SPECIFIC" },
    sourceDirectives: directives,
    markNodes: marks,
    methodPathways: [pathway],
    methodEquivalence: emptyMethodEquivalence(),
    workingPolicy: {
      ...workingPolicy(answerOnly("NOT_STATED", null, [], evidence, [], [], "Whole-question answer-only treatment is not stated because the equation-construction parts and four-mark solving part have distinct evidence roles."), [M3, M4, M5], [M1, M2, M6], question.identity.paper, question.identity.year),
      partSpecificAnswerOnly: [
        { questionPartId: `${q}_a`, profile: answerOnly("NOT_STATED", null, [], evidence, [], [], "Part (a) is a direct equation-construction mark.") },
        { questionPartId: `${q}_b`, profile: answerOnly("NOT_STATED", null, [], evidence, [], [], "Part (b) is a direct equation-construction mark.") },
        { questionPartId: `${q}_c`, profile: config.detailedAnswerOnly === "NO_CREDIT" ? answerOnly("NO_CREDIT", 0, [], evidence, [`${question.identity.id}_D_PART_C_ANSWER_ONLY_ZERO`]) : answerOnly("NOT_STATED", null, [], evidence, [], [], "The detailed row does not state a question-specific part-(c) answer-only total.") },
      ],
      laterPartCanSupplyEvidence: !!context.earlierPartEvidenceCanAppearLater,
      earlierPartCanSupplyEvidence: !!context.earlierPartEvidenceCanAppearLater,
      repeatedSubstitutionAccepted: config.rejectedMethod === "REPEATED_SUBSTITUTION"
        ? catalogValue(false, evidence, "SOURCE_FACT", "HIGH", "The source explicitly rejects repeated substitution for the solving section.")
        : notReviewed<boolean>(config.rejectedMethod === "GUESS_AND_CHECK"
          ? "The detailed source rejects guess-and-check but does not state whether repeated substitution is accepted."
          : "The detailed source does not state whether repeated substitution is accepted."),
    },
    presentationPolicy: presentationPolicy(evidence, {
      units: context.communicationRequired ? "REQUIRED_FOR_MARK" : context.unitSymbol ? "NOT_STATED" : "NOT_RELEVANT",
      contextualWording: context.communicationRequired ? "REQUIRED_FOR_MARK" : "NOT_RELEVANT",
      answerLabelling: context.communicationRequired ? "REQUIRED_FOR_MARK" : "NOT_RELEVANT",
      significantNotationRequirements: context.currencyNearestPennyForFinalCommunication ? ["For the final communication mark, monetary values must be stated to the nearest penny in an accepted currency form."] : [],
      otherConditions: [...context.communicationConditions, ...(context.invalidCommunicationForms ?? []).map((form) => `The source explicitly does not accept ${form} for the final communication mark.`)],
    }),
    visualMarking: emptyVisualMarking(),
    commonResponses,
    generalPolicy: { policyId: policy.policyId, relevantRuleIds: policy.ruleIds, questionSpecificOverrides: directiveIds },
    relationship: {
      partMarkMap: [{ questionPartId: `${q}_a`, markIds: [M1] }, { questionPartId: `${q}_b`, markIds: [M2] }, { questionPartId: `${q}_c`, markIds: [M3, M4, M5, M6] }],
      subgoalMarkMap: [{ questionSubgoalId: `${q}_S1`, markIds: [M1] }, { questionSubgoalId: `${q}_S2`, markIds: [M2] }, { questionSubgoalId: `${q}_S3`, markIds: [M3, M4, M5] }, { questionSubgoalId: `${q}_S4`, markIds: [M6] }],
      promptInstructionConsequences: [{ instructionType: "FORM_EQUATIONS_THEN_CALCULATE", markingConsequence: "The two model equations each carry one mark and the subsequent solving section carries four marks.", affectedMarkIds: [M1, M2, M3, M4, M5, M6], sourceEvidence: evidence }],
      informationEvidenceMap: [{ questionInformationId: `${q}_INFO_REL1`, usedByMethodIds: [P1], supportsMarkIds: [M1, M3, M4, M5, M6] }, { questionInformationId: `${q}_INFO_REL2`, usedByMethodIds: [P1], supportsMarkIds: [M2, M3, M4, M5, M6] }, { questionInformationId: `${q}_INFO_TARGET`, usedByMethodIds: [P1], supportsMarkIds: [M6] }],
      representationEvidenceMap: [],
      crossPartDependencies: ["The four-mark final section depends on the two contextual relationships represented by the equations in parts (a) and (b)."],
      errorPropagationGraph: [],
    },
    sourcePresentation: sourcePresentation(config.msPages, config.msPages.length > 1 ? "MULTI_PAGE" : "MULTIPART_TABLE_ROW", 1, directives.length, commonResponses.length),
    consistency: {
      factualFingerprint: [
        consistencyFeature("a8_mark_profile", config.markProfile, `This source uses the ${config.markProfile} decomposition.`, evidence),
        consistencyFeature("answer_only_treatment_part_c", config.detailedAnswerOnly, config.detailedAnswerOnly === "NO_CREDIT" ? "The source explicitly gives no credit for the unsupported part-(c) result." : "The detailed source does not state a part-(c) answer-only total.", evidence),
        consistencyFeature("explicitly_rejected_method", config.rejectedMethod, config.rejectedMethod ? `The source explicitly rejects ${config.rejectedMethod} for the solving section.` : "No A8-specific method exclusion is stated in the detailed row.", evidence),
        consistencyFeature("communication_mark", context.communicationRequired, context.communicationRequired ? "The final mark is explicitly a contextual communication/presentation mark." : "The final mark is a mathematical derived calculation rather than a communication mark.", evidence),
      ],
      crossCorpusAnalysis: crossCorpusFor(config, responseTypes),
    },
    integrity: answerIntegrity(),
    generation: generationNotReviewed(),

    review,
  };
};
