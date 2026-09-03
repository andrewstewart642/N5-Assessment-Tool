import type { CatalogEvidenceRef, CatalogMarkThinking, CatalogProvenance } from "../CatalogCoreTypes";
import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type { AnswerCatalogEntry, CommonResponsePattern, ExpectedAnswerVariant, MarkNode, MethodPathway, SourceMarkingDirective } from "./AnswerCatalogTypes";
import { asHistoricalAnswerCatalogEntry } from "./AnswerCatalogHistoricalView";
import {
  answerOnly,
  answerReviewInProgress,
  catalogValue,
  consistencyFeature,
  emptyMethodEquivalence,
  emptyVisualMarking,
  markNode,
  msEvidence,
  notReviewed,
  presentationPolicy,
  sourcePresentation,
  unitProfile,
  workingPolicy,
} from "./AnswerCatalogHelpers";
import { classifyMark, type ClassifiedMarkNode, validateClassifiedMarkNodes } from "./MarkClassification";

const SKILL_ID = "alg-a07-linear-equations";
const CONCEPT_ID = "alg-a7-1";
const TOOLKIT_DOCUMENT_ID = "N5_MATH_CREATING_EVIDENCE_TOOLKIT";
const FOI_DOCUMENT_ID = "N5_MATH_FOI_STANDARD_2022_2025_USER_COPY";

export type A7AnswerMode = "FRACTIONAL_COEFFICIENT" | "CONTEXT_AREA_EQUALITY";

export type A7AnswerConfig = {
  question: QuestionCatalogEntry;
  mode: A7AnswerMode;
  msPages: number[];
  printedPageLabels: string[];
  solution: string;
  numericSolution: number;
  thinking: CatalogMarkThinking;
  standardEvidenceKind: "TOOLKIT" | "FOI";
  exactFractionRequired?: boolean;
  repeatedSubstitutionZero?: boolean;
  alternativeMethodSummary?: string | null;
  commonResponseSummary?: string | null;
};

const detailedEvidence = (config: A7AnswerConfig): CatalogEvidenceRef[] =>
  config.msPages.map((page, index) =>
    msEvidence(
      config.question.identity.questionNumber,
      page,
      "MARKING_SCHEME",
      config.question.identity.paper,
      config.question.identity.year,
      config.printedPageLabels[index] ?? `PDF page ${page}`,
    ),
  );

const toolkitEvidence = (
  config: A7AnswerConfig,
  pdfPages: number[],
  locatorNote: string,
): CatalogEvidenceRef => ({
  documentId: TOOLKIT_DOCUMENT_ID,
  pdfPages,
  printedPageLabels: pdfPages.map((page) => `page ${page}`),
  paper: config.question.identity.paper,
  questionLocator: `Q${config.question.identity.questionNumber}`,
  evidenceType: "CLASSIFICATION_GUIDANCE",
  locatorNote,
});

const foiEvidence = (config: A7AnswerConfig): CatalogEvidenceRef => ({
  documentId: FOI_DOCUMENT_ID,
  pdfPages: [],
  printedPageLabels: [],
  paper: config.question.identity.paper,
  questionLocator: `Q${config.question.identity.questionNumber}`,
  evidenceType: "FOI_CLASSIFICATION",
  locatorNote: `${config.question.identity.year} ${config.question.identity.paper} question-level C/A mark breakdown supplied by the user; this question is wholly A-standard in that breakdown.`,
});

const standardEvidence = (config: A7AnswerConfig): { evidence: CatalogEvidenceRef[]; provenance: CatalogProvenance; notes: string } => {
  if (config.standardEvidenceKind === "FOI") {
    return {
      evidence: [foiEvidence(config)],
      provenance: "SOURCE_FACT",
      notes: "The supplied FOI breakdown fixes every mark in this question as A-standard.",
    };
  }
  return {
    evidence: [toolkitEvidence(config, [3], "The Grade A skills table identifies the historical fractional-coefficient linear-equation question as a more challenging A-standard example.")],
    provenance: "SOURCE_FACT",
    notes: "The Creating Evidence Toolkit explicitly lists this historical question under Grade A linear equations with fractional numerical coefficients.",
  };
};

const thinkingEvidence = (config: A7AnswerConfig): { evidence: CatalogEvidenceRef[]; provenance: CatalogProvenance; notes: string } => {
  if (config.mode === "CONTEXT_AREA_EQUALITY") {
    return {
      evidence: [
        toolkitEvidence(config, [6], "The reasoning table explicitly lists 2022 P1 Q15 as a contextual construct-and-solve linear-equation reasoning question."),
        toolkitEvidence(config, [8], "The common-question guidance explains that where a reasoning-mark count is not specified, the stated R classification applies to all marks in that category; teacher moderation confirmed the all-mark application for this question."),
      ],
      provenance: "CATALOGUE_CLASSIFICATION",
      notes: "Teacher-moderated rule: the source identifies the question as reasoning and gives no partial R count, so all five marks are classified Reasoning.",
    };
  }
  return {
    evidence: [toolkitEvidence(config, [8], "The common-question table classifies equations with fractions as A-standard and does not identify them as reasoning; the A7 sweep was teacher-moderated as Operational.")],
    provenance: "CATALOGUE_CLASSIFICATION",
    notes: config.question.identity.year === 2025
      ? "Operational classification extrapolates the same fractional-equation family beyond the Toolkit's dated examples and was teacher-moderated during the A7 sweep."
      : "The fractional-equation family was teacher-moderated as Operational during the A7 sweep.",
  };
};

const classificationFor = (config: A7AnswerConfig, mark: MarkNode): ClassifiedMarkNode => {
  const standard = standardEvidence(config);
  const thinking = thinkingEvidence(config);
  return classifyMark(mark, {
    primarySkillId: SKILL_ID,
    standard: "A",
    thinking: config.thinking,
    standardEvidence: standard.evidence,
    thinkingEvidence: thinking.evidence,
    standardProvenance: standard.provenance,
    thinkingProvenance: thinking.provenance,
    standardNotes: standard.notes,
    thinkingNotes: thinking.notes,
  });
};

const directive = (
  id: string,
  summary: string,
  effect: SourceMarkingDirective["effect"],
  partIds: string[],
  markIds: string[],
  evidence: CatalogEvidenceRef[],
  marksAwarded: number | null = null,
  maximumMarks: number | null = null,
): SourceMarkingDirective => ({
  id,
  layer: "QUESTION_NOTE",
  scope: "QUESTION",
  effect,
  normalisedSummary: summary,
  appliesToPartIds: partIds,
  appliesToMarkIds: markIds,
  appliesToMethodIds: [],
  marksAwarded,
  maximumMarks,
  sourceEvidence: evidence,
});

const baseReview = (config: A7AnswerConfig) => {
  const review = answerReviewInProgress(
    config.question.identity.questionNumber,
    config.question.identity.paper,
    config.question.identity.year,
  );
  const {
    generationAnalysisComplete: _generationAnalysisComplete,
    ...historicalReview
  } = review;
  return {
    ...historicalReview,
    unresolvedIssues: [],
    validationNotes: [
      ...review.validationNotes,
      "A7 mark ownership, A/C and Operational/Reasoning classifications were teacher-moderated before catalogue implementation.",
      "Cross-corpus and answer-generation policy are intentionally owned outside the historical Answer Catalog.",
    ],
  };
};

const baseEntry = (
  config: A7AnswerConfig,
  markNodes: ClassifiedMarkNode[],
  expectedResponse: AnswerCatalogEntry["expectedResponse"],
  directives: SourceMarkingDirective[],
  pathways: MethodPathway[],
  relationship: AnswerCatalogEntry["relationship"],
  commonResponses: CommonResponsePattern[],
  presentation: AnswerCatalogEntry["presentationPolicy"],
  working: AnswerCatalogEntry["workingPolicy"],
): AnswerCatalogEntry => {
  const evidence = detailedEvidence(config);
  const issues = validateClassifiedMarkNodes(markNodes);
  if (issues.length) throw new Error(`Invalid A7 V3 mark classification: ${issues.join(" | ")}`);

  return asHistoricalAnswerCatalogEntry({
    identity: {
      id: config.question.identity.answerCatalogId,
      schemaVersion: "N5_CATALOG_V3",
      sourceQuestionId: config.question.identity.id,
      courseId: config.question.identity.courseId,
      paperContextId: config.question.identity.paperContextId,
      year: config.question.identity.year,
      paper: config.question.identity.paper,
      questionNumber: config.question.identity.questionNumber,
      questionFamilyId: config.question.family.familyId,
    },
    sourceContext: {
      sourceDocumentId: `N5_MATH_${config.question.identity.year}_MS`,
      totalMarks: config.question.structure.totalMarks,
      sourcePages: config.msPages,
      printedPageLabels: config.printedPageLabels,
      sourceEvidence: evidence,
      generalMarkingPolicyId: `N5_MATH_${config.question.identity.year}_GENERAL_MARKING_POLICY`,
    },
    expectedResponse,
    sourceDirectives: directives,
    markNodes,
    methodPathways: pathways,
    methodEquivalence: emptyMethodEquivalence(),
    workingPolicy: working,
    presentationPolicy: presentation,
    visualMarking: emptyVisualMarking(),
    commonResponses,
    generalPolicy: {
      policyId: `N5_MATH_${config.question.identity.year}_GENERAL_MARKING_POLICY`,
      relevantRuleIds: [],
      questionSpecificOverrides: directives.map((item) => item.id),
    },
    relationship,
    sourcePresentation: sourcePresentation(
      config.msPages,
      config.mode === "CONTEXT_AREA_EQUALITY" ? "MULTIPART_TABLE_ROW" : config.alternativeMethodSummary ? "MULTI_METHOD_TABLE_ROW" : "TABLE_ROW",
      config.alternativeMethodSummary ? 2 : 1,
      directives.length,
      commonResponses.length,
    ),
    consistency: {
      factualFingerprint: [
        consistencyFeature("mark_count", config.question.structure.totalMarks, "Historical mark tariff for this A7 question.", evidence),
        consistencyFeature("standard", "A", "Teacher-moderated/externally evidenced mark-level standard classification is wholly A.", standardEvidence(config).evidence),
        consistencyFeature("thinking", config.thinking, "Teacher-moderated mark-level thinking classification for the whole question.", thinkingEvidence(config).evidence),
      ],
    },
    review: baseReview(config),
  });
};

const fractionalEntry = (config: A7AnswerConfig): AnswerCatalogEntry => {
  const q = `Q${config.question.identity.questionNumber}`;
  const evidence = detailedEvidence(config);
  const M1 = `${config.question.identity.id}_M1`;
  const M2 = `${config.question.identity.id}_M2`;
  const M3 = `${config.question.identity.id}_M3`;
  const P1 = `${config.question.identity.id}_METHOD_CLEAR_DENOMINATORS`;
  const P2 = `${config.question.identity.id}_METHOD_ALTERNATIVE`;
  const answerOnlyDirective = `${config.question.identity.id}_D_ANSWER_ONLY_ZERO`;
  const directives: SourceMarkingDirective[] = [
    directive(answerOnlyDirective, "A correct final answer without supporting working receives no marks.", "BLOCK", [`${q}_MAIN`], [M1, M2, M3], evidence, 0, 0),
  ];

  if (config.repeatedSubstitutionZero) {
    directives.push(directive(`${config.question.identity.id}_D_REPEATED_SUBSTITUTION_ZERO`, "Repeated substitution receives no marks for this question.", "BLOCK", [`${q}_MAIN`], [M1, M2, M3], evidence, 0, 0));
  }
  if (config.exactFractionRequired) {
    directives.push(directive(`${config.question.identity.id}_D_EXACT_FINAL_VALUE`, "The final accuracy mark is not awarded for a decimal approximation to the required exact fraction; an incorrect conversion after first stating the exact fraction is not penalised.", "REQUIRE", [`${q}_MAIN`], [M3], evidence));
  }

  const marks: ClassifiedMarkNode[] = [
    classificationFor(config, markNode(M1, 1, `${q}_MAIN`, "PROCESS", "Eliminate denominators or otherwise combine the fractional algebra into a valid equivalent linear equation.", "Establish an equivalent equation in a form suitable for linear rearrangement.", [SKILL_ID], [CONCEPT_ID], [`${q}_S1`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M1_E1`, normalisedEvidence: "Produce a valid equivalent equation after clearing denominators or combining the fractional terms.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: config.alternativeMethodSummary ? [P1, P2] : [P1],
    })),
    classificationFor(config, markNode(M2, 2, `${q}_MAIN`, "PROCESS", "Rearrange the linear equation into the form ax=b or an equivalent one-step form.", "Isolate the variable term consistently.", [SKILL_ID], [CONCEPT_ID], [`${q}_S2`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M2_E1`, normalisedEvidence: "Obtain an equivalent equation with one variable term equal to a constant.", acceptedLocations: ["WORKING"], mayBeImpliedByLaterWork: true, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: config.alternativeMethodSummary ? [P1, P2] : [P1],
    })),
    classificationFor(config, markNode(M3, 3, `${q}_MAIN`, "ACCURACY", "Solve for x and state the required exact value in the source-accepted form.", "Complete the exact linear-equation solution.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, {
      illustrativeEvidence: [{ id: `${q}_M3_E1`, normalisedEvidence: `State x=${config.solution} in an accepted exact form.`, acceptedLocations: ["WORKING", "FINAL_ANSWER"], mayBeImpliedByLaterWork: false, mayBeImpliedByCorrectFinalAnswer: false, visualElementIds: [], sourceEvidence: evidence }],
      methodPathwayIds: config.alternativeMethodSummary ? [P1, P2] : [P1],
      sourceDirectiveIds: config.exactFractionRequired ? [`${config.question.identity.id}_D_EXACT_FINAL_VALUE`] : [],
    })),
  ];

  const primaryPathway: MethodPathway = {
    id: P1,
    variantId: "CLEAR_DENOMINATORS_REARRANGE_SOLVE",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: ["Use a valid algebraic transformation consistent with the source marking instructions."],
    steps: [
      { id: `${q}_P1_S1`, order: 1, normalisedStep: "Clear denominators or form an equivalent integer-coefficient linear equation.", linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["MULTIPLY", "SIMPLIFY"], resultingStateSummary: "valid equivalent linear equation", sourceEvidence: evidence },
      { id: `${q}_P1_S2`, order: 2, normalisedStep: "Collect and rearrange terms into ax=b.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [M2], dependsOnStepIds: [`${q}_P1_S1`], requiredOperations: ["REARRANGE"], resultingStateSummary: "ax=b", sourceEvidence: evidence },
      { id: `${q}_P1_S3`, order: 3, normalisedStep: "Divide by the remaining coefficient and state the accepted exact solution.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M3], dependsOnStepIds: [`${q}_P1_S2`], requiredOperations: ["DIVIDE"], resultingStateSummary: `x=${config.solution}`, sourceEvidence: evidence },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: [answerOnlyDirective],
    mathematicallyEquivalentMethodIds: config.alternativeMethodSummary ? [P2] : [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: config.repeatedSubstitutionZero ? ["The source explicitly gives zero credit to repeated substitution."] : [],
    sourceEvidence: evidence,
  };

  const pathways: MethodPathway[] = [primaryPathway];
  if (config.alternativeMethodSummary) {
    pathways.push({
      id: P2,
      variantId: "SOURCE_LISTED_ALTERNATIVE_LINEAR_ROUTE",
      evidenceRole: "FULL_CREDIT_ALTERNATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [config.alternativeMethodSummary],
      steps: [
        { id: `${q}_P2_S1`, order: 1, normalisedStep: config.alternativeMethodSummary, linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["SIMPLIFY", "REARRANGE"], resultingStateSummary: "alternative source-listed equivalent equation", sourceEvidence: evidence },
        { id: `${q}_P2_S2`, order: 2, normalisedStep: "Continue the alternative algebraic route to an equivalent ax=b form.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [M2], dependsOnStepIds: [`${q}_P2_S1`], requiredOperations: ["REARRANGE"], resultingStateSummary: "ax=b", sourceEvidence: evidence },
        { id: `${q}_P2_S3`, order: 3, normalisedStep: "Complete the solution in the same accepted final form.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M3], dependsOnStepIds: [`${q}_P2_S2`], requiredOperations: ["DIVIDE"], resultingStateSummary: `x=${config.solution}`, sourceEvidence: evidence },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [answerOnlyDirective],
      mathematicallyEquivalentMethodIds: [P1],
      materiallyDistinctFromMethodIds: [],
      excludedMethodReasons: [],
      sourceEvidence: evidence,
    });
  }

  const canonicalAnswers: ExpectedAnswerVariant[] = [{
    id: `${config.question.identity.id}_A1`,
    normalisedAnswer: `x=${config.solution}`,
    numericValue: config.numericSolution,
    answerForm: "NUMBER",
    mathematicallyEquivalentToVariantIds: [],
    conditionsForAcceptance: config.exactFractionRequired ? ["State the exact fraction before any decimal conversion."] : [],
    sourceEvidence: evidence,
    notes: null,
  }];

  const commonResponses: CommonResponsePattern[] = config.commonResponseSummary
    ? [{ id: `${config.question.identity.id}_CR1`, sourceStatus: "EXPLICITLY_LISTED", category: "COMMON_ERROR", errorFamily: "LINEAR_TRANSFORMATION_ERROR", normalisedResponse: config.commonResponseSummary, affectedMarkIds: [M1, M2, M3], marksAwarded: null, maximumMarks: 3, followThroughAvailable: true, sourceDirectiveIds: [], sourceEvidence: evidence }]
    : [];

  const expectedResponse: AnswerCatalogEntry["expectedResponse"] = {
    responseTypes: ["NUMBER"],
    canonicalAnswers,
    acceptedEquivalentForms: [],
    precisionType: "NONE",
    precisionValue: null,
    acceptedRange: null,
    units: unitProfile(null, null),
    requiredContextStatement: false,
    answerCountRequired: 1,
    invalidRelatedValues: [],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  };

  const working = {
    ...workingPolicy(
      answerOnly("NO_CREDIT", 0, [], evidence, [answerOnlyDirective]),
      [M1, M2, M3],
      [],
      config.question.identity.paper,
      config.question.identity.year,
    ),
    repeatedSubstitutionAccepted: config.repeatedSubstitutionZero
      ? catalogValue(false, evidence, "SOURCE_FACT", "HIGH", "Question-specific notes award zero marks for repeated substitution.")
      : notReviewed<boolean>("The detailed source does not state a question-specific repeated-substitution rule."),
  };

  const presentation = presentationPolicy(evidence, {
    simplification: "REQUIRED_FOR_FULL_CREDIT",
    exactValue: config.exactFractionRequired ? "REQUIRED_FOR_FULL_CREDIT" : "NOT_STATED",
  });

  return baseEntry(
    config,
    marks,
    expectedResponse,
    directives,
    pathways,
    {
      partMarkMap: [{ questionPartId: `${q}_MAIN`, markIds: [M1, M2, M3] }],
      subgoalMarkMap: [{ questionSubgoalId: `${q}_S1`, markIds: [M1] }, { questionSubgoalId: `${q}_S2`, markIds: [M2] }, { questionSubgoalId: `${q}_S3`, markIds: [M3] }],
      promptInstructionConsequences: [],
      informationEvidenceMap: [{ questionInformationId: `${q}_INFO_EQUATION`, usedByMethodIds: pathways.map((pathway) => pathway.id), supportsMarkIds: [M1, M2, M3] }],
      representationEvidenceMap: [],
      crossPartDependencies: [],
      errorPropagationGraph: [],
    },
    commonResponses,
    presentation,
    working,
  );
};

const contextualEntry = (config: A7AnswerConfig): AnswerCatalogEntry => {
  const q = `Q${config.question.identity.questionNumber}`;
  const evidence = detailedEvidence(config);
  const ids = [1, 2, 3, 4, 5].map((index) => `${config.question.identity.id}_M${index}`);
  const [M1, M2, M3, M4, M5] = ids;
  const P1 = `${config.question.identity.id}_METHOD_AREA_EQUALITY_LINEAR`;
  const D_GUESS = `${config.question.identity.id}_D_GUESS_CHECK_ZERO`;
  const D_LATER = `${config.question.identity.id}_D_LATER_PART_EVIDENCE`;
  const D_FRACTION = `${config.question.identity.id}_D_FRACTION_STRUCTURE_REQUIRED`;
  const D_FINAL = `${config.question.identity.id}_D_FINAL_MARK_RESTRICTION`;
  const directives: SourceMarkingDirective[] = [
    directive(D_GUESS, "Guess-and-check receives no marks for the four-mark algebraic solution part.", "BLOCK", [`${q}_b`], [M2, M3, M4, M5], evidence, 0, 4),
    directive(D_LATER, "If the part (a) area expression is omitted from its answer space, an equivalent expression written in part (b) may supply the part (a) mark.", "ACCEPT", [`${q}_a`, `${q}_b`], [M1], evidence),
    directive(D_FRACTION, "The first solving mark in part (b) is unavailable if the triangle-area expression used in the equation has lost the required one-half structure.", "BLOCK", [`${q}_b`], [M3], evidence),
    directive(D_FINAL, "The final solving mark is unavailable for a decimal approximation to a fraction and for a trivial single-digit division leading to an integer answer in the source-specified error cases.", "REQUIRE", [`${q}_b`], [M5], evidence),
  ];

  const marks: ClassifiedMarkNode[] = [
    classificationFor(config, markNode(M1, 1, `${q}_a`, "REPRESENTATION", "Construct a correct expression for the area of the triangle from the supplied dimensions.", "Represent the triangle area algebraically.", [SKILL_ID], [CONCEPT_ID], [`${q}_S1`], evidence, { methodPathwayIds: [P1], sourceDirectiveIds: [D_LATER] })),
    classificationFor(config, markNode(M2, 2, `${q}_b`, "REPRESENTATION", "Construct the rectangle-area expression and equate it to the triangle-area expression.", "Create the linear equation from the equal-area relationship.", [SKILL_ID], [CONCEPT_ID], [`${q}_S2`], evidence, { methodPathwayIds: [P1] })),
    classificationFor(config, markNode(M3, 3, `${q}_b`, "PROCESS", "Start to solve the resulting equation while preserving the required fractional area structure.", "Move from the model equation into a valid linear solving route.", [SKILL_ID], [CONCEPT_ID], [`${q}_S3`], evidence, { methodPathwayIds: [P1], sourceDirectiveIds: [D_FRACTION] })),
    classificationFor(config, markNode(M4, 4, `${q}_b`, "PROCESS", "Rearrange the linear equation to an equivalent form with a single variable term.", "Isolate the variable consistently.", [SKILL_ID], [CONCEPT_ID], [`${q}_S4`], evidence, { methodPathwayIds: [P1] })),
    classificationFor(config, markNode(M5, 5, `${q}_b`, "ACCURACY", "Solve the linear equation for the required value of x.", "Complete the contextual linear-equation solution.", [SKILL_ID], [CONCEPT_ID], [`${q}_S5`], evidence, { methodPathwayIds: [P1], sourceDirectiveIds: [D_FINAL] })),
  ];

  const pathway: MethodPathway = {
    id: P1,
    variantId: "AREA_EXPRESSIONS_EQUALITY_LINEAR_SOLUTION",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: ["Use the supplied diagram dimensions and the stated equality of areas."],
    steps: [
      { id: `${q}_P1_S1`, order: 1, normalisedStep: "Form the triangle area as one-half times base times height.", linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [M1], dependsOnStepIds: [], requiredOperations: ["MODEL", "MULTIPLY"], resultingStateSummary: "triangle area expression", sourceEvidence: evidence },
      { id: `${q}_P1_S2`, order: 2, normalisedStep: "Form the rectangle area and equate the two area expressions.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [M2], dependsOnStepIds: [`${q}_P1_S1`], requiredOperations: ["MODEL"], resultingStateSummary: "one-variable linear equation", sourceEvidence: evidence },
      { id: `${q}_P1_S3`, order: 3, normalisedStep: "Clear the one-half factor or otherwise begin a valid equivalent linear solve.", linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [M3], dependsOnStepIds: [`${q}_P1_S2`], requiredOperations: ["MULTIPLY", "EXPAND"], resultingStateSummary: "expanded/equivalent linear equation", sourceEvidence: evidence },
      { id: `${q}_P1_S4`, order: 4, normalisedStep: "Collect and rearrange terms to isolate the variable coefficient.", linkedQuestionSubgoalIds: [`${q}_S4`], linkedMarkIds: [M4], dependsOnStepIds: [`${q}_P1_S3`], requiredOperations: ["REARRANGE"], resultingStateSummary: "ax=b", sourceEvidence: evidence },
      { id: `${q}_P1_S5`, order: 5, normalisedStep: "Divide to obtain the required value of x.", linkedQuestionSubgoalIds: [`${q}_S5`], linkedMarkIds: [M5], dependsOnStepIds: [`${q}_P1_S4`], requiredOperations: ["DIVIDE"], resultingStateSummary: `x=${config.solution}`, sourceEvidence: evidence },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: [D_GUESS],
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: ["Guess-and-check is explicitly assigned zero marks for part (b)."],
    sourceEvidence: evidence,
  };

  const expectedResponse: AnswerCatalogEntry["expectedResponse"] = {
    responseTypes: ["EXPRESSION", "NUMBER"],
    canonicalAnswers: [
      { id: `${config.question.identity.id}_A1`, normalisedAnswer: "3/2(x+12)", numericValue: null, answerForm: "EXPRESSION", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: ["Any source-listed algebraically equivalent triangle-area expression is acceptable."], sourceEvidence: evidence, notes: null },
      { id: `${config.question.identity.id}_A2`, normalisedAnswer: `x=${config.solution}`, numericValue: config.numericSolution, answerForm: "NUMBER", mathematicallyEquivalentToVariantIds: [], conditionsForAcceptance: [], sourceEvidence: evidence, notes: null },
    ],
    acceptedEquivalentForms: [],
    precisionType: "NONE",
    precisionValue: null,
    acceptedRange: null,
    units: unitProfile(null, null),
    requiredContextStatement: false,
    answerCountRequired: 2,
    invalidRelatedValues: [],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  };

  const working = {
    ...workingPolicy(
      answerOnly("NOT_STATED", null, [], evidence, [], [], "The question-specific row does not state a blanket answer-only award; the explicit algebraic and guess-and-check rules are retained separately."),
      [M2, M3, M4, M5],
      [M1],
      config.question.identity.paper,
      config.question.identity.year,
    ),
    laterPartCanSupplyEvidence: true,
    repeatedSubstitutionAccepted: notReviewed<boolean>("The detailed source explicitly rejects guess-and-check but does not state a separate repeated-substitution rule."),
  };

  return baseEntry(
    config,
    marks,
    expectedResponse,
    directives,
    [pathway],
    {
      partMarkMap: [{ questionPartId: `${q}_a`, markIds: [M1] }, { questionPartId: `${q}_b`, markIds: [M2, M3, M4, M5] }],
      subgoalMarkMap: [{ questionSubgoalId: `${q}_S1`, markIds: [M1] }, { questionSubgoalId: `${q}_S2`, markIds: [M2] }, { questionSubgoalId: `${q}_S3`, markIds: [M3] }, { questionSubgoalId: `${q}_S4`, markIds: [M4] }, { questionSubgoalId: `${q}_S5`, markIds: [M5] }],
      promptInstructionConsequences: [{ instructionType: "ALGEBRAIC_SOLUTION", markingConsequence: "Part (b) is assessed through an algebraic equation-solving pathway; guess-and-check receives zero credit.", affectedMarkIds: [M2, M3, M4, M5], sourceEvidence: evidence }],
      informationEvidenceMap: [
        { questionInformationId: `${q}_INFO_TRIANGLE`, usedByMethodIds: [P1], supportsMarkIds: [M1, M2, M3, M4, M5] },
        { questionInformationId: `${q}_INFO_RECTANGLE`, usedByMethodIds: [P1], supportsMarkIds: [M2, M3, M4, M5] },
        { questionInformationId: `${q}_INFO_EQUAL_AREAS`, usedByMethodIds: [P1], supportsMarkIds: [M2, M3, M4, M5] },
      ],
      representationEvidenceMap: [{ visualElementId: `VIS_${q}_AREA_DIAGRAM`, normalisedEvidence: "The diagram supplies the dimensions needed to construct the two area expressions.", supportsMarkIds: [M1, M2] }],
      crossPartDependencies: ["Part (b) uses the triangle-area expression from part (a), although the marking notes also allow that evidence to appear later in part (b)."],
      errorPropagationGraph: [{ sourceMarkIds: [M1], sourceQuestionPartIds: [`${q}_a`], affectedMarkIds: [M2, M3], survivingMarkIds: [M4, M5], conditionSummary: "An incorrect triangle-area expression can affect the model equation and first solving step; later consistent algebra may still score subject to the question-specific restrictions.", sourceEvidence: evidence }],
    },
    [],
    presentationPolicy(evidence),
    working,
  );
};

export const createA7AnswerCatalogEntry = (config: A7AnswerConfig): AnswerCatalogEntry =>
  config.mode === "CONTEXT_AREA_EQUALITY" ? contextualEntry(config) : fractionalEntry(config);
