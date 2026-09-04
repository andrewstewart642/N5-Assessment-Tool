import type {
  CatalogEvidenceRef,
  CatalogMarkStandard,
  CatalogMarkThinking,
} from "../CatalogCoreTypes";
import type { QuestionCatalogEntry } from "../01_QuestionCatalog/QuestionCatalogTypes";
import type {
  AnswerCatalogEntry,
  CommonResponsePattern,
  ExpectedAnswerVariant,
  MarkNode,
  MethodPathway,
  PresentationPolicy,
  SourceMarkingDirective,
} from "./AnswerCatalogTypes";
import { asHistoricalAnswerCatalogEntry } from "./AnswerCatalogHistoricalView";
import {
  GENERAL_2014_RULE_IDS,
  answerOnly,
  answerReviewInProgress,
  consistencyFeature,
  emptyVisualMarking,
  generalPolicyEvidence,
  markNode,
  msEvidence,
  presentationPolicy,
  sourcePresentation,
  unitProfile,
  workingPolicy,
} from "./AnswerCatalogHelpers";
import {
  classifyMark,
  deriveMarkClassificationSummary,
  type ClassifiedMarkNode,
  validateClassifiedMarkNodes,
} from "./MarkClassification";
import type {
  G1AnswerConfig,
  G1AnswerMarkRef,
  G1AnswerMethodRef,
  G1AnswerOnlyRule,
  G1AnswerPartRef,
  G1CommonResponseConfig,
  G1SourceDirectiveConfig,
} from "./G1GradientAnswerCatalogSource";

const G1_SKILL_ID = "geo-g01-gradient-two-points";
const G1_CONCEPT_ID = "geo-g1-1";
const S2_SKILL_ID = "stat-s02-linear-model";
const S2_CONCEPT_ID = "stat-s2-1";

type MarkIds = Record<G1AnswerMarkRef, string>;
type MethodIds = Record<G1AnswerMethodRef, string>;

const detailedEvidence = (config: G1AnswerConfig): CatalogEvidenceRef[] =>
  config.msPages.map((page, index) =>
    msEvidence(
      config.questionNumber,
      page,
      "MARKING_SCHEME",
      config.paper,
      config.year,
      config.printedPageLabels[index] ?? `PDF page ${page}`,
    ),
  );

const partId = (q: string, part: G1AnswerPartRef) => {
  if (part === "MAIN") return `${q}_MAIN`;
  return `${q}_${part.toLowerCase()}`;
};

const sourcePartForPrimary = (question: QuestionCatalogEntry) =>
  question.structure.totalMarks === 4 ? `Q${question.identity.questionNumber}_a` : `Q${question.identity.questionNumber}_MAIN`;

const methodIdsFor = (question: QuestionCatalogEntry): MethodIds => ({
  SLOPE_INTERCEPT: `${question.identity.id}_METHOD_SLOPE_INTERCEPT`,
  POINT_SLOPE: `${question.identity.id}_METHOD_POINT_SLOPE`,
  FOLLOW_UP: `${question.identity.id}_METHOD_FOLLOW_UP`,
  SYMBOLIC: `${question.identity.id}_METHOD_SYMBOLIC_GRADIENT`,
});

const markIdsFor = (question: QuestionCatalogEntry): MarkIds => ({
  M1: `${question.identity.id}_M1`,
  M2: `${question.identity.id}_M2`,
  M3: `${question.identity.id}_M3`,
  M4: `${question.identity.id}_M4`,
});

const methodRefsToIds = (
  refs: readonly G1AnswerMethodRef[] | undefined,
  methods: MethodIds,
): string[] => (refs ?? []).map((ref) => methods[ref]);

const markRefsToIds = (
  refs: readonly G1AnswerMarkRef[],
  marks: MarkIds,
): string[] => refs.map((ref) => marks[ref]);

const classificationFor = (
  question: QuestionCatalogEntry,
  mark: MarkNode,
  ownerSkillId: string,
  standard: CatalogMarkStandard,
  thinking: CatalogMarkThinking,
): ClassifiedMarkNode => {
  const ownerConceptId = ownerSkillId === S2_SKILL_ID ? S2_CONCEPT_ID : G1_CONCEPT_ID;
  return classifyMark(
    {
      ...mark,
      skillIds: [ownerSkillId],
      conceptIds: [ownerConceptId],
    },
    {
      primarySkillId: ownerSkillId,
      standard,
      thinking,
      standardEvidence: question.sourceLayout.sourceEvidence,
      thinkingEvidence: question.sourceLayout.sourceEvidence,
      standardProvenance: "CATALOGUE_CLASSIFICATION",
      thinkingProvenance: "CATALOGUE_CLASSIFICATION",
      standardNotes:
        ownerSkillId === S2_SKILL_ID
          ? "Teacher-moderated cross-skill ownership pass: the embedded follow-up mark is C-standard S2."
          : standard === "A"
            ? "Teacher-moderated G1 sweep: this symbolic-coordinate gradient mark is A-standard."
            : "Teacher-moderated G1 sweep: this coordinate-gradient mark is C-standard.",
      thinkingNotes:
        ownerSkillId === S2_SKILL_ID
          ? "Teacher-moderated classification: the embedded best-fit follow-up estimate is Reasoning."
          : "Teacher-moderated G1 sweep: the geometric/coordinate-gradient work is Operational.",
    },
  );
};

const answerOnlyDirective = (
  question: QuestionCatalogEntry,
  rule: G1AnswerOnlyRule,
  marks: MarkIds,
  evidence: CatalogEvidenceRef[],
): SourceMarkingDirective | null => {
  if (rule.sourceKind !== "QUESTION" || rule.treatment === "NOT_STATED") return null;
  const q = `Q${question.identity.questionNumber}`;
  const awarded = rule.treatment === "FULL_CREDIT" ? rule.marksAwarded : 0;
  return {
    id: `${question.identity.id}_D_ANSWER_ONLY_${rule.part}`,
    layer: "QUESTION_NOTE",
    scope: rule.part === "MAIN" ? "QUESTION" : "PART",
    effect: rule.treatment === "FULL_CREDIT" ? "AWARD" : "BLOCK",
    normalisedSummary: rule.notes,
    appliesToPartIds: [partId(q, rule.part)],
    appliesToMarkIds: markRefsToIds(rule.markRefs, marks),
    appliesToMethodIds: [],
    marksAwarded: awarded,
    maximumMarks: awarded,
    sourceEvidence: evidence,
  };
};

const directiveFromConfig = (
  question: QuestionCatalogEntry,
  directive: G1SourceDirectiveConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
): SourceMarkingDirective => {
  const q = `Q${question.identity.questionNumber}`;
  return {
    id: `${question.identity.id}_D_${directive.idSuffix}`,
    layer: "QUESTION_NOTE",
    scope: directive.part === "MAIN" ? "QUESTION" : "PART",
    effect: directive.effect,
    normalisedSummary: directive.summary,
    appliesToPartIds: [partId(q, directive.part)],
    appliesToMarkIds: markRefsToIds(directive.markRefs, marks),
    appliesToMethodIds: methodRefsToIds(directive.methodRefs, methods),
    marksAwarded: directive.marksAwarded ?? null,
    maximumMarks: directive.maximumMarks ?? null,
    sourceEvidence: evidence,
  };
};

const commonResponseFromConfig = (
  question: QuestionCatalogEntry,
  config: G1CommonResponseConfig,
  marks: MarkIds,
  evidence: CatalogEvidenceRef[],
): CommonResponsePattern => ({
  id: `${question.identity.id}_CR_${config.idSuffix}`,
  sourceStatus: "EXPLICITLY_LISTED",
  category: config.category,
  errorFamily: config.errorFamily,
  normalisedResponse: config.normalisedResponse,
  affectedMarkIds: markRefsToIds(config.affectedMarkRefs, marks),
  marksAwarded: config.marksAwarded,
  maximumMarks: config.maximumMarks,
  followThroughAvailable: config.followThroughAvailable,
  sourceDirectiveIds: [],
  sourceEvidence: evidence,
});

const methodEquivalence = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
): AnswerCatalogEntry["methodEquivalence"] => {
  if (!config.sourceMethodRefs.includes("SLOPE_INTERCEPT") || !config.sourceMethodRefs.includes("POINT_SLOPE")) {
    return { equivalentMethodGroups: [], methodEligibilityRules: [] };
  }
  return {
    equivalentMethodGroups: [{
      id: `${question.identity.id}_METHOD_EQUIVALENCE_LINE_FORMS`,
      methodIds: [methods.SLOPE_INTERCEPT, methods.POINT_SLOPE],
      equivalenceReason: "The historical marking evidence presents slope-intercept and point-slope constructions as valid routes to the same line.",
      sourceEvidence: evidence,
    }],
    methodEligibilityRules: [],
  };
};

const standardLineMarks = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
  directives: SourceMarkingDirective[],
): ClassifiedMarkNode[] => {
  const primaryPartId = sourcePartForPrimary(question);
  const visualIds = question.structure.parts[0]?.visualElementIds ?? [];
  const primaryMethodIds = methodRefsToIds(
    config.sourceMethodRefs.filter((ref) => ref === "SLOPE_INTERCEPT" || ref === "POINT_SLOPE"),
    methods,
  );
  const directiveIdsForMark = (markId: string) =>
    directives.filter((item) => item.appliesToMarkIds.includes(markId)).map((item) => item.id);

  const M1 = classificationFor(
    question,
    markNode(
      marks.M1,
      1,
      primaryPartId,
      config.gradientEligibilityConditions.length ? "METHOD" : "PROCESS",
      question.family.subFamilyId?.includes("GRID_READ")
        ? "Obtain two source-eligible points from the supplied best-fit line and calculate the gradient."
        : "Calculate the gradient from the source-specified coordinate pair evidence.",
      "Establish the rate of change of the geometrically defined line.",
      [G1_SKILL_ID],
      [G1_CONCEPT_ID],
      [`Q${question.identity.questionNumber}_S1`],
      evidence,
      {
        illustrativeEvidence: [{
          id: `${question.identity.id}_M1_E1`,
          normalisedEvidence: config.gradientSummary,
          acceptedLocations: ["WORKING", "FINAL_ANSWER"],
          mayBeImpliedByLaterWork: true,
          mayBeImpliedByCorrectFinalAnswer: config.answerOnlyRules.some((rule) => rule.part !== "B" && rule.treatment === "FULL_CREDIT"),
          visualElementIds: visualIds,
          sourceEvidence: evidence,
        }],
        eligibilityConditions: [...config.gradientEligibilityConditions],
        methodPathwayIds: primaryMethodIds,
        sourceDirectiveIds: directiveIdsForMark(marks.M1),
      },
    ),
    G1_SKILL_ID,
    question.identity.year === 2019 && question.identity.paper === "P2" ? "A" : "C",
    "OPERATIONAL",
  );

  const M2 = classificationFor(
    question,
    markNode(
      marks.M2,
      2,
      primaryPartId,
      "PROCESS",
      "Use the gradient with one valid source point in a recognised straight-line equation form.",
      "Anchor the line using its gradient and a point.",
      [G1_SKILL_ID],
      [G1_CONCEPT_ID],
      [`Q${question.identity.questionNumber}_S2`],
      evidence,
      {
        illustrativeEvidence: [{
          id: `${question.identity.id}_M2_E1`,
          normalisedEvidence: config.substitutionSummary,
          acceptedLocations: ["WORKING"],
          mayBeImpliedByLaterWork: true,
          mayBeImpliedByCorrectFinalAnswer: config.answerOnlyRules.some((rule) => rule.part !== "B" && rule.treatment === "FULL_CREDIT"),
          visualElementIds: [],
          sourceEvidence: evidence,
        }],
        pathwaySpecificRequirements: [
          ...(config.sourceMethodRefs.includes("SLOPE_INTERCEPT") ? [{
            methodPathwayId: methods.SLOPE_INTERCEPT,
            normalisedRequirement: "Substitute the gradient and one point into slope-intercept form and determine the intercept.",
            sourceEvidence: evidence,
          }] : []),
          ...(config.sourceMethodRefs.includes("POINT_SLOPE") ? [{
            methodPathwayId: methods.POINT_SLOPE,
            normalisedRequirement: "Substitute the gradient and one point into point-slope form.",
            sourceEvidence: evidence,
          }] : []),
        ],
        dependencies: [{
          type: "CONSISTENT_WITH_EARLIER_RESULT",
          relatedMarkIds: [marks.M1],
          relatedQuestionPartIds: [primaryPartId],
          conditionSummary: "Later line construction may follow a candidate gradient where the historical source permits consistent follow-through.",
          sourceEvidence: evidence,
        }],
        methodPathwayIds: primaryMethodIds,
        sourceDirectiveIds: directiveIdsForMark(marks.M2),
      },
    ),
    G1_SKILL_ID,
    "C",
    "OPERATIONAL",
  );

  const M3 = classificationFor(
    question,
    markNode(
      marks.M3,
      3,
      primaryPartId,
      "ACCURACY",
      "Complete the line construction and state the requested equation in a source-accepted simplified form.",
      "Produce the final straight-line equation/model.",
      [G1_SKILL_ID],
      [G1_CONCEPT_ID],
      [`Q${question.identity.questionNumber}_${question.structure.totalMarks === 4 ? "S2" : "S3"}`],
      evidence,
      {
        illustrativeEvidence: [{
          id: `${question.identity.id}_M3_E1`,
          normalisedEvidence: config.completionSummary,
          acceptedLocations: ["WORKING", "FINAL_ANSWER"],
          mayBeImpliedByLaterWork: false,
          mayBeImpliedByCorrectFinalAnswer: config.answerOnlyRules.some((rule) => rule.part !== "B" && rule.treatment === "FULL_CREDIT"),
          visualElementIds: [],
          sourceEvidence: evidence,
        }],
        dependencies: [{
          type: "CONSISTENT_WITH_EARLIER_RESULT",
          relatedMarkIds: [marks.M1, marks.M2],
          relatedQuestionPartIds: [primaryPartId],
          conditionSummary: "The final model must arise from a valid or source-eligible carried line construction.",
          sourceEvidence: evidence,
        }],
        presentationConditions: config.primarySimplification === "REQUIRED_FOR_FULL_CREDIT"
          ? ["The requested equation is presented in a source-accepted simplest form."]
          : [],
        methodPathwayIds: primaryMethodIds,
        sourceDirectiveIds: directiveIdsForMark(marks.M3),
      },
    ),
    G1_SKILL_ID,
    "C",
    "OPERATIONAL",
  );

  return [M1, M2, M3];
};

const symbolicMarks = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
  directives: SourceMarkingDirective[],
): ClassifiedMarkNode[] => {
  const part = sourcePartForPrimary(question);
  const directiveIdsForMark = (markId: string) =>
    directives.filter((item) => item.appliesToMarkIds.includes(markId)).map((item) => item.id);

  return [
    classificationFor(
      question,
      markNode(
        marks.M1,
        1,
        part,
        "METHOD",
        "Form the two-point gradient quotient by substituting the numerical and parameterised coordinate pairs consistently.",
        "Translate the geometric coordinate data into an algebraic gradient expression.",
        [G1_SKILL_ID],
        [G1_CONCEPT_ID],
        [`Q${question.identity.questionNumber}_S1`],
        evidence,
        {
          illustrativeEvidence: [{
            id: `${question.identity.id}_M1_E1`,
            normalisedEvidence: config.gradientSummary,
            acceptedLocations: ["WORKING"],
            mayBeImpliedByLaterWork: true,
            mayBeImpliedByCorrectFinalAnswer: false,
            visualElementIds: [],
            sourceEvidence: evidence,
          }],
          eligibilityConditions: [...config.gradientEligibilityConditions],
          methodPathwayIds: [methods.SYMBOLIC],
          sourceDirectiveIds: directiveIdsForMark(marks.M1),
        },
      ),
      G1_SKILL_ID,
      "A",
      "OPERATIONAL",
    ),
    classificationFor(
      question,
      markNode(
        marks.M2,
        2,
        part,
        "PROCESS",
        "Factor the algebraic numerator structure created by the gradient quotient.",
        "Recognise and factor the difference-of-squares structure.",
        [G1_SKILL_ID],
        [G1_CONCEPT_ID],
        [`Q${question.identity.questionNumber}_S2`],
        evidence,
        {
          illustrativeEvidence: [{
            id: `${question.identity.id}_M2_E1`,
            normalisedEvidence: config.substitutionSummary,
            acceptedLocations: ["WORKING"],
            mayBeImpliedByLaterWork: true,
            mayBeImpliedByCorrectFinalAnswer: false,
            visualElementIds: [],
            sourceEvidence: evidence,
          }],
          dependencies: [{
            type: "CONSISTENT_WITH_EARLIER_RESULT",
            relatedMarkIds: [marks.M1],
            relatedQuestionPartIds: [part],
            conditionSummary: "Factorisation must be consistent with a valid gradient quotient.",
            sourceEvidence: evidence,
          }],
          methodPathwayIds: [methods.SYMBOLIC],
          sourceDirectiveIds: directiveIdsForMark(marks.M2),
        },
      ),
      G1_SKILL_ID,
      "A",
      "OPERATIONAL",
    ),
    classificationFor(
      question,
      markNode(
        marks.M3,
        3,
        part,
        "ACCURACY",
        "Factor/cancel the remaining common structure and state the gradient expression in simplest form.",
        "Complete the symbolic coordinate-gradient simplification.",
        [G1_SKILL_ID],
        [G1_CONCEPT_ID],
        [`Q${question.identity.questionNumber}_S3`],
        evidence,
        {
          illustrativeEvidence: [{
            id: `${question.identity.id}_M3_E1`,
            normalisedEvidence: config.completionSummary,
            acceptedLocations: ["WORKING", "FINAL_ANSWER"],
            mayBeImpliedByLaterWork: false,
            mayBeImpliedByCorrectFinalAnswer: false,
            visualElementIds: [],
            sourceEvidence: evidence,
          }],
          dependencies: [{
            type: "CONSISTENT_WITH_EARLIER_RESULT",
            relatedMarkIds: [marks.M1, marks.M2],
            relatedQuestionPartIds: [part],
            conditionSummary: "Cancellation must follow valid factorisation and preserve the gradient expression.",
            sourceEvidence: evidence,
          }],
          presentationConditions: ["The final algebraic gradient is stated in simplest form."],
          methodPathwayIds: [methods.SYMBOLIC],
          sourceDirectiveIds: directiveIdsForMark(marks.M3),
        },
      ),
      G1_SKILL_ID,
      "A",
      "OPERATIONAL",
    ),
  ];
};

const followUpMark = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
  directives: SourceMarkingDirective[],
): ClassifiedMarkNode | null => {
  if (!config.followUp) return null;
  const q = `Q${question.identity.questionNumber}`;
  const ownerSkillId = config.followUp.ownership === "S2" ? S2_SKILL_ID : G1_SKILL_ID;
  const ownerConceptId = ownerSkillId === S2_SKILL_ID ? S2_CONCEPT_ID : G1_CONCEPT_ID;
  const directiveIds = directives.filter((item) => item.appliesToMarkIds.includes(marks.M4)).map((item) => item.id);
  const followThroughDirective = directives.find((item) =>
    item.appliesToMarkIds.includes(marks.M4) && item.effect === "FOLLOW_THROUGH",
  );

  const base = markNode(
    marks.M4,
    1,
    `${q}_b`,
    ownerSkillId === S2_SKILL_ID ? "INTERPRETATION" : "PROCESS",
    ownerSkillId === S2_SKILL_ID
      ? "Use the constructed best-fit model to obtain the requested contextual estimate."
      : "Use the constructed deterministic line model to calculate the requested contextual value.",
    ownerSkillId === S2_SKILL_ID
      ? "Interpret and apply the fitted linear model at the supplied input."
      : "Apply the coordinate-geometry model at a new input.",
    [ownerSkillId],
    [ownerConceptId],
    [`${q}_S3`],
    evidence,
    {
      illustrativeEvidence: [{
        id: `${question.identity.id}_M4_E1`,
        normalisedEvidence: config.followUp.calculationSummary,
        acceptedLocations: ["WORKING", "FINAL_ANSWER"],
        mayBeImpliedByLaterWork: false,
        mayBeImpliedByCorrectFinalAnswer: config.answerOnlyRules.some((rule) => rule.part === "B" && rule.treatment === "FULL_CREDIT"),
        visualElementIds: [],
        sourceEvidence: evidence,
      }],
      dependencies: [{
        type: "FOLLOW_THROUGH_FROM",
        relatedMarkIds: [marks.M3],
        relatedQuestionPartIds: [`${q}_a`],
        conditionSummary: config.followUp.followThroughGate ?? "Use the candidate's eligible part-(a) model consistently.",
        sourceEvidence: evidence,
      }],
      followThrough: {
        allowed: true,
        fromMarkIds: [marks.M3],
        fromQuestionPartIds: [`${q}_a`],
        requiresComparableDifficulty: config.followUp.followThroughGate != null,
        blockedForRequiredResult: false,
        blockedByInvalidMathematicalState: true,
        blockedByTrivialisedLaterWork: config.followUp.followThroughGate != null,
        sourceBasis: followThroughDirective ? "QUESTION_SPECIFIC" : "GENERAL_POLICY",
        sourceEvidence: followThroughDirective ? evidence : [generalPolicyEvidence(config.paper, config.year), ...evidence],
        notes: config.followUp.followThroughGate,
      },
      methodPathwayIds: [methods.FOLLOW_UP],
      sourceDirectiveIds: directiveIds,
    },
  );

  return classificationFor(
    question,
    base,
    ownerSkillId,
    "C",
    ownerSkillId === S2_SKILL_ID ? "REASONING" : "OPERATIONAL",
  );
};

const lineMethods = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
): MethodPathway[] => {
  const q = `Q${question.identity.questionNumber}`;
  const pathways: MethodPathway[] = [];

  if (config.sourceMethodRefs.includes("SLOPE_INTERCEPT")) {
    pathways.push({
      id: methods.SLOPE_INTERCEPT,
      variantId: "SLOPE_INTERCEPT",
      evidenceRole: "PRIMARY_ILLUSTRATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [...config.gradientEligibilityConditions],
      steps: [
        { id: `${question.identity.id}_P1_S1`, order: 1, normalisedStep: config.gradientSummary, linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [marks.M1], dependsOnStepIds: [], requiredOperations: ["SUBTRACT", "DIVIDE"], resultingStateSummary: "gradient established", sourceEvidence: evidence },
        { id: `${question.identity.id}_P1_S2`, order: 2, normalisedStep: "Substitute the gradient and one valid point into slope-intercept form and determine the intercept.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [marks.M2], dependsOnStepIds: [`${question.identity.id}_P1_S1`], requiredOperations: ["SUBSTITUTE", "SOLVE"], resultingStateSummary: "intercept/model position established", sourceEvidence: evidence },
        { id: `${question.identity.id}_P1_S3`, order: 3, normalisedStep: config.completionSummary, linkedQuestionSubgoalIds: [`${q}_${question.structure.totalMarks === 4 ? "S2" : "S3"}`], linkedMarkIds: [marks.M3], dependsOnStepIds: [`${question.identity.id}_P1_S2`], requiredOperations: ["MODEL", "SIMPLIFY"], resultingStateSummary: config.canonicalPrimaryAnswer, sourceEvidence: evidence },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: config.sourceMethodRefs.includes("POINT_SLOPE") ? [methods.POINT_SLOPE] : [],
      materiallyDistinctFromMethodIds: config.sourceMethodRefs.includes("POINT_SLOPE") ? [methods.POINT_SLOPE] : [],
      excludedMethodReasons: [],
      sourceEvidence: evidence,
    });
  }

  if (config.sourceMethodRefs.includes("POINT_SLOPE")) {
    pathways.push({
      id: methods.POINT_SLOPE,
      variantId: "POINT_SLOPE",
      evidenceRole: "FULL_CREDIT_ALTERNATIVE",
      supportsFullCredit: true,
      applicabilityConditions: [...config.gradientEligibilityConditions],
      steps: [
        { id: `${question.identity.id}_P2_S1`, order: 1, normalisedStep: config.gradientSummary, linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [marks.M1], dependsOnStepIds: [], requiredOperations: ["SUBTRACT", "DIVIDE"], resultingStateSummary: "gradient established", sourceEvidence: evidence },
        { id: `${question.identity.id}_P2_S2`, order: 2, normalisedStep: "Substitute the gradient and one valid point into point-slope form.", linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [marks.M2], dependsOnStepIds: [`${question.identity.id}_P2_S1`], requiredOperations: ["SUBSTITUTE"], resultingStateSummary: "point-slope equation established", sourceEvidence: evidence },
        { id: `${question.identity.id}_P2_S3`, order: 3, normalisedStep: config.completionSummary, linkedQuestionSubgoalIds: [`${q}_${question.structure.totalMarks === 4 ? "S2" : "S3"}`], linkedMarkIds: [marks.M3], dependsOnStepIds: [`${question.identity.id}_P2_S2`], requiredOperations: ["EXPAND", "REARRANGE", "SIMPLIFY"], resultingStateSummary: config.canonicalPrimaryAnswer, sourceEvidence: evidence },
      ],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: config.sourceMethodRefs.includes("SLOPE_INTERCEPT") ? [methods.SLOPE_INTERCEPT] : [],
      materiallyDistinctFromMethodIds: config.sourceMethodRefs.includes("SLOPE_INTERCEPT") ? [methods.SLOPE_INTERCEPT] : [],
      excludedMethodReasons: [],
      sourceEvidence: evidence,
    });
  }

  if (config.followUp && config.sourceMethodRefs.includes("FOLLOW_UP")) {
    pathways.push({
      id: methods.FOLLOW_UP,
      variantId: config.followUp.ownership === "S2" ? "BEST_FIT_MODEL_ESTIMATE" : "DETERMINISTIC_MODEL_CALCULATION",
      evidenceRole: "PRIMARY_ILLUSTRATIVE",
      supportsFullCredit: true,
      applicabilityConditions: config.followUp.followThroughGate ? [config.followUp.followThroughGate] : [],
      steps: [{
        id: `${question.identity.id}_PB_S1`,
        order: 1,
        normalisedStep: config.followUp.calculationSummary,
        linkedQuestionSubgoalIds: [`${q}_S3`],
        linkedMarkIds: [marks.M4],
        dependsOnStepIds: [],
        requiredOperations: ["SUBSTITUTE", "EVALUATE"],
        resultingStateSummary: config.followUp.normalisedAnswer,
        sourceEvidence: evidence,
      }],
      markMappingComplete: true,
      sourceTotalAwardRules: [],
      mathematicallyEquivalentMethodIds: [],
      materiallyDistinctFromMethodIds: [],
      excludedMethodReasons: [],
      sourceEvidence: evidence,
    });
  }

  return pathways;
};

const symbolicMethod = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
): MethodPathway => {
  const q = `Q${question.identity.questionNumber}`;
  return {
    id: methods.SYMBOLIC,
    variantId: "GRADIENT_QUOTIENT_FACTOR_CANCEL",
    evidenceRole: "PRIMARY_ILLUSTRATIVE",
    supportsFullCredit: true,
    applicabilityConditions: [...config.gradientEligibilityConditions],
    steps: [
      { id: `${question.identity.id}_PS_S1`, order: 1, normalisedStep: config.gradientSummary, linkedQuestionSubgoalIds: [`${q}_S1`], linkedMarkIds: [marks.M1], dependsOnStepIds: [], requiredOperations: ["SUBTRACT", "DIVIDE"], resultingStateSummary: "algebraic gradient quotient", sourceEvidence: evidence },
      { id: `${question.identity.id}_PS_S2`, order: 2, normalisedStep: config.substitutionSummary, linkedQuestionSubgoalIds: [`${q}_S2`], linkedMarkIds: [marks.M2], dependsOnStepIds: [`${question.identity.id}_PS_S1`], requiredOperations: ["FACTORISE"], resultingStateSummary: "factorised numerator", sourceEvidence: evidence },
      { id: `${question.identity.id}_PS_S3`, order: 3, normalisedStep: config.completionSummary, linkedQuestionSubgoalIds: [`${q}_S3`], linkedMarkIds: [marks.M3], dependsOnStepIds: [`${question.identity.id}_PS_S2`], requiredOperations: ["FACTORISE", "SIMPLIFY"], resultingStateSummary: config.canonicalPrimaryAnswer, sourceEvidence: evidence },
    ],
    markMappingComplete: true,
    sourceTotalAwardRules: [],
    mathematicallyEquivalentMethodIds: [],
    materiallyDistinctFromMethodIds: [],
    excludedMethodReasons: [],
    sourceEvidence: evidence,
  };
};

const policyEvidenceForAnswerOnly = (
  config: G1AnswerConfig,
  evidence: CatalogEvidenceRef[],
): CatalogEvidenceRef[] => {
  if (config.year === 2021 && config.paper === "P1") {
    return [
      msEvidence(
        config.questionNumber,
        2,
        "GENERAL_MARKING_POLICY",
        config.paper,
        config.year,
        "page 02",
      ),
      ...evidence,
    ];
  }
  return [generalPolicyEvidence(config.paper, config.year), ...evidence];
};

const answerOnlyProfile = (
  config: G1AnswerConfig,
  rule: G1AnswerOnlyRule,
  marks: MarkIds,
  evidence: CatalogEvidenceRef[],
  directiveIds: string[],
) => {
  const sourceEvidence = rule.sourceKind === "GENERAL_POLICY"
    ? policyEvidenceForAnswerOnly(config, evidence)
    : evidence;
  return answerOnly(
    rule.treatment,
    rule.marksAwarded,
    rule.treatment === "FULL_CREDIT" ? markRefsToIds(rule.markRefs, marks) : [],
    sourceEvidence,
    directiveIds,
    [],
    rule.notes,
  );
};

const workingProfile = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  directives: SourceMarkingDirective[],
  evidence: CatalogEvidenceRef[],
): AnswerCatalogEntry["workingPolicy"] => {
  const q = `Q${question.identity.questionNumber}`;
  const ruleFor = (part: G1AnswerPartRef) => config.answerOnlyRules.find((rule) => rule.part === part);
  const profileFor = (rule: G1AnswerOnlyRule) => {
    const ids = directives
      .filter((item) => item.id === `${question.identity.id}_D_ANSWER_ONLY_${rule.part}`)
      .map((item) => item.id);
    return answerOnlyProfile(config, rule, marks, evidence, ids);
  };

  if (question.structure.totalMarks === 3) {
    const rule = ruleFor("MAIN");
    if (!rule) throw new Error(`Missing MAIN answer-only rule for ${question.identity.id}`);
    const mandatory = rule.treatment === "NO_CREDIT" ? markRefsToIds(rule.markRefs, marks) : [];
    const implied = rule.treatment === "FULL_CREDIT" ? markRefsToIds(rule.markRefs, marks) : [];
    return {
      ...workingPolicy(profileFor(rule), mandatory, implied, config.paper, config.year),
      partSpecificAnswerOnly: [{ questionPartId: `${q}_MAIN`, profile: profileFor(rule) }],
    };
  }

  const aRule = ruleFor("A");
  const bRule = ruleFor("B");
  if (!aRule || !bRule) throw new Error(`Missing multipart answer-only rules for ${question.identity.id}`);
  const mandatory = [
    ...(aRule.treatment === "NO_CREDIT" ? markRefsToIds(aRule.markRefs, marks) : []),
    ...(bRule.treatment === "NO_CREDIT" ? markRefsToIds(bRule.markRefs, marks) : []),
  ];
  const implied = [
    ...(aRule.treatment === "FULL_CREDIT" ? markRefsToIds(aRule.markRefs, marks) : []),
    ...(bRule.treatment === "FULL_CREDIT" ? markRefsToIds(bRule.markRefs, marks) : []),
  ];
  return {
    ...workingPolicy(
      answerOnly("NOT_STATED", null, [], evidence, [], [], "Answer-only treatment differs by part; use part-specific profiles."),
      mandatory,
      implied,
      config.paper,
      config.year,
    ),
    partSpecificAnswerOnly: [
      { questionPartId: `${q}_a`, profile: profileFor(aRule) },
      { questionPartId: `${q}_b`, profile: profileFor(bRule) },
    ],
    earlierPartCanSupplyEvidence: config.followUp != null,
  };
};

const expectedResponse = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  evidence: CatalogEvidenceRef[],
): AnswerCatalogEntry["expectedResponse"] => {
  const primary: ExpectedAnswerVariant = {
    id: `${question.identity.id}_A_PRIMARY`,
    normalisedAnswer: config.canonicalPrimaryAnswer,
    numericValue: null,
    answerForm: config.primaryAnswerForm,
    mathematicallyEquivalentToVariantIds: config.acceptedEquivalentPrimaryAnswers.map((_, index) => `${question.identity.id}_A_EQ_${index + 1}`),
    conditionsForAcceptance: config.primarySimplification === "REQUIRED_FOR_FULL_CREDIT" ? ["Use a source-accepted simplified form."] : [],
    sourceEvidence: evidence,
    notes: question.structure.totalMarks === 4 ? "Primary answer for part (a)." : null,
  };
  const equivalents: ExpectedAnswerVariant[] = config.acceptedEquivalentPrimaryAnswers.map((answer, index) => ({
    id: `${question.identity.id}_A_EQ_${index + 1}`,
    normalisedAnswer: answer,
    numericValue: null,
    answerForm: config.primaryAnswerForm,
    mathematicallyEquivalentToVariantIds: [primary.id],
    conditionsForAcceptance: [],
    sourceEvidence: evidence,
    notes: "Source-accepted equivalent full-credit primary form.",
  }));

  const canonicalAnswers: ExpectedAnswerVariant[] = [primary];
  if (config.followUp) {
    canonicalAnswers.push({
      id: `${question.identity.id}_A_FOLLOW_UP`,
      normalisedAnswer: config.followUp.normalisedAnswer,
      numericValue: config.followUp.numericValue,
      answerForm: "NUMBER",
      mathematicallyEquivalentToVariantIds: [],
      conditionsForAcceptance: config.finalPrecisionType === "DECIMAL_PLACES"
        ? [`Present the final monetary value to ${config.finalPrecisionValue} decimal places.`]
        : [],
      sourceEvidence: evidence,
      notes: "Follow-up part answer.",
    });
  }

  return {
    responseTypes: question.structure.totalMarks === 4
      ? ["EQUATION", "NUMBER"]
      : [config.primaryAnswerForm === "EXPRESSION" ? "EXPRESSION" : "EQUATION"],
    canonicalAnswers,
    acceptedEquivalentForms: equivalents,
    precisionType: config.finalPrecisionType,
    precisionValue: config.finalPrecisionValue,
    acceptedRange: null,
    units: config.followUp
      ? unitProfile(config.followUp.unitDimension, config.followUp.unitSymbol, config.followUp.unitsExplicitlyRequested)
      : unitProfile(null, null),
    requiredContextStatement: false,
    answerCountRequired: question.structure.totalMarks === 4 ? 2 : 1,
    invalidRelatedValues: [],
    extraAnswerTreatment: "QUESTION_SPECIFIC",
  };
};

const presentation = (
  config: G1AnswerConfig,
  evidence: CatalogEvidenceRef[],
): PresentationPolicy => {
  const base = presentationPolicy(evidence, {
    simplification: config.primarySimplification,
    units: config.unitsPresentation,
    answerLabelling: "NOT_STATED",
  });
  return {
    ...base,
    precision: {
      ...base.precision,
      finalPrecisionType: config.finalPrecisionType,
      finalPrecisionValue: config.finalPrecisionValue,
      prematureRoundingTreatment: config.finalPrecisionType === "DECIMAL_PLACES" ? "PENALISE" : "NOT_RELEVANT",
    },
    significantNotationRequirements: [
      ...(config.canonicalPrimaryAnswer.match(/[A-Z]/) && config.followUp ? ["Where the source uses contextual variables, the final model must retain those variables for full presentation credit unless an equivalent form is explicitly accepted."] : []),
    ],
  };
};

const relationship = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
  marks: MarkIds,
  methods: MethodIds,
  evidence: CatalogEvidenceRef[],
): AnswerCatalogEntry["relationship"] => {
  const q = `Q${question.identity.questionNumber}`;
  const primaryMarkIds = [marks.M1, marks.M2, marks.M3];
  const methodIds = config.sourceMethodRefs.map((ref) => methods[ref]);
  const visualIds = Array.from(new Set(question.structure.parts.flatMap((part) => part.visualElementIds)));

  return {
    partMarkMap: question.structure.totalMarks === 4
      ? [
          { questionPartId: `${q}_a`, markIds: primaryMarkIds },
          { questionPartId: `${q}_b`, markIds: [marks.M4] },
        ]
      : [{ questionPartId: `${q}_MAIN`, markIds: primaryMarkIds }],
    subgoalMarkMap: question.structure.totalMarks === 4
      ? [
          { questionSubgoalId: `${q}_S1`, markIds: [marks.M1] },
          { questionSubgoalId: `${q}_S2`, markIds: [marks.M2, marks.M3] },
          { questionSubgoalId: `${q}_S3`, markIds: [marks.M4] },
        ]
      : [
          { questionSubgoalId: `${q}_S1`, markIds: [marks.M1] },
          { questionSubgoalId: `${q}_S2`, markIds: [marks.M2] },
          { questionSubgoalId: `${q}_S3`, markIds: [marks.M3] },
        ],
    promptInstructionConsequences: question.information
      .filter((item) => item.role === "RESPONSE_INSTRUCTION")
      .map((item) => ({
        instructionType: item.informationType,
        markingConsequence: "The source-required output form is represented in the presentation conditions for the final primary mark.",
        affectedMarkIds: [marks.M3],
        sourceEvidence: evidence,
      })),
    informationEvidenceMap: question.information.map((item) => ({
      questionInformationId: item.id,
      usedByMethodIds: methodIds,
      supportsMarkIds: item.id.includes("TARGET")
        ? [marks.M4]
        : item.id.includes("POINT") || item.id.includes("RELATIONSHIP")
          ? primaryMarkIds
          : question.structure.totalMarks === 4 ? [...primaryMarkIds, marks.M4] : primaryMarkIds,
    })),
    representationEvidenceMap: visualIds.map((id) => ({
      visualElementId: id,
      normalisedEvidence: "The supplied coordinate/graph visual carries geometric evidence used to identify the line or its points.",
      supportsMarkIds: primaryMarkIds,
    })),
    crossPartDependencies: question.structure.totalMarks === 4
      ? ["The follow-up part applies the straight-line model constructed in part (a)."]
      : [],
    errorPropagationGraph: config.followUp
      ? [{
          sourceMarkIds: [marks.M3],
          sourceQuestionPartIds: [`${q}_a`],
          affectedMarkIds: [marks.M4],
          survivingMarkIds: [marks.M4],
          conditionSummary: config.followUp.followThroughGate ?? "General follow-through may apply when the carried model remains mathematically valid and comparably demanding.",
          sourceEvidence: evidence,
        }]
      : [],
  };
};

const reviewFor = (question: QuestionCatalogEntry, config: G1AnswerConfig) => {
  const review = answerReviewInProgress(
    question.identity.questionNumber,
    question.identity.paper,
    question.identity.year,
  );
  const {
    generationAnalysisComplete: _generationAnalysisComplete,
    ...historicalReview
  } = review;
  return {
    ...historicalReview,
    unresolvedIssues: config.followUp?.ownership === "S2"
      ? ["The embedded S2 follow-up mark is catalogued here for historical mark ownership; standalone S2 generation design remains intentionally deferred."]
      : [],
    validationNotes: [
      ...review.validationNotes,
      "G1 mark ownership, C/A standard and Operational/Reasoning classifications were teacher-moderated before this Answer Catalogue implementation.",
      "Historical source notes, answer-only treatment, follow-through gates, common responses and alternative line methods are preserved as normalised evidence rather than generator rules.",
      config.followUp?.ownership === "S2"
        ? "Cross-skill ownership retained as three G1 marks plus one embedded S2 mark."
        : `All ${question.structure.totalMarks} mark(s) remain G1-owned for this historical task.`,
    ],
  };
};

export const createG1GradientAnswerCatalogEntry = (
  question: QuestionCatalogEntry,
  config: G1AnswerConfig,
): AnswerCatalogEntry => {
  if (
    question.identity.year !== config.year ||
    question.identity.paper !== config.paper ||
    question.identity.questionNumber !== config.questionNumber
  ) {
    throw new Error(`G1 question/answer config mismatch for ${question.identity.id}`);
  }

  const evidence = detailedEvidence(config);
  const marks = markIdsFor(question);
  const methods = methodIdsFor(question);

  const answerOnlyDirectives = config.answerOnlyRules
    .map((rule) => answerOnlyDirective(question, rule, marks, evidence))
    .filter((item): item is SourceMarkingDirective => item != null);
  const sourceDirectives = [
    ...answerOnlyDirectives,
    ...config.directives.map((item) => directiveFromConfig(question, item, marks, methods, evidence)),
  ];

  const primaryMarks = config.sourceMethodRefs.includes("SYMBOLIC")
    ? symbolicMarks(question, config, marks, methods, evidence, sourceDirectives)
    : standardLineMarks(question, config, marks, methods, evidence, sourceDirectives);
  const partBMark = followUpMark(question, config, marks, methods, evidence, sourceDirectives);
  const markNodes = partBMark ? [...primaryMarks, partBMark] : primaryMarks;

  const issues = validateClassifiedMarkNodes(markNodes);
  if (issues.length) {
    throw new Error(`Invalid G1 V3 mark classification for ${question.identity.id}: ${issues.join(" | ")}`);
  }
  if (markNodes.reduce((total, mark) => total + mark.markValue, 0) !== question.structure.totalMarks) {
    throw new Error(`G1 mark total mismatch for ${question.identity.id}`);
  }

  const pathways = config.sourceMethodRefs.includes("SYMBOLIC")
    ? [symbolicMethod(question, config, marks, methods, evidence)]
    : lineMethods(question, config, marks, methods, evidence);

  const commonResponses = config.commonResponses.map((item) =>
    commonResponseFromConfig(question, item, marks, evidence),
  );
  const classification = deriveMarkClassificationSummary(markNodes);

  return asHistoricalAnswerCatalogEntry({
    identity: {
      id: question.identity.answerCatalogId,
      schemaVersion: "N5_CATALOG_V3",
      sourceQuestionId: question.identity.id,
      courseId: question.identity.courseId,
      paperContextId: question.identity.paperContextId,
      year: question.identity.year,
      paper: question.identity.paper,
      questionNumber: question.identity.questionNumber,
      questionFamilyId: question.family.familyId,
    },
    sourceContext: {
      sourceDocumentId: `N5_MATH_${config.year}_MS`,
      totalMarks: question.structure.totalMarks,
      sourcePages: config.msPages,
      printedPageLabels: config.printedPageLabels,
      sourceEvidence: evidence,
      generalMarkingPolicyId: `N5_MATH_${config.year}_GENERAL_MARKING_POLICY`,
    },
    expectedResponse: expectedResponse(question, config, evidence),
    sourceDirectives,
    markNodes,
    methodPathways: pathways,
    methodEquivalence: methodEquivalence(question, config, methods, evidence),
    workingPolicy: workingProfile(question, config, marks, sourceDirectives, evidence),
    presentationPolicy: presentation(config, evidence),
    visualMarking: emptyVisualMarking(),
    commonResponses,
    generalPolicy: {
      policyId: `N5_MATH_${config.year}_GENERAL_MARKING_POLICY`,
      relevantRuleIds: config.year === 2014 ? [...GENERAL_2014_RULE_IDS] : [],
      questionSpecificOverrides: sourceDirectives.map((item) => item.id),
    },
    relationship: relationship(question, config, marks, methods, evidence),
    sourcePresentation: sourcePresentation(
      config.msPages,
      question.structure.totalMarks === 4
        ? (config.msPages.length > 1 ? "MULTI_PAGE" : "MULTIPART_TABLE_ROW")
        : config.sourceMethodRefs.length > 1 ? "MULTI_METHOD_TABLE_ROW" : "TABLE_ROW",
      config.sourceMethodRefs.filter((ref) => ref !== "FOLLOW_UP").length,
      sourceDirectives.length,
      commonResponses.length,
    ),
    consistency: {
      factualFingerprint: [
        consistencyFeature("mark_count", question.structure.totalMarks, "Historical total mark tariff.", evidence),
        consistencyFeature(
          "skill_mark_distribution",
          Object.entries(classification.skillMarkDistribution).map(([skill, count]) => `${skill}:${count}`).join("|"),
          "Mark ownership distribution after teacher-moderated G1/S2 classification.",
          evidence,
        ),
        consistencyFeature(
          "standard_mark_distribution",
          `C:${classification.standardMarkDistribution.C}|A:${classification.standardMarkDistribution.A}`,
          "C/A mark distribution retained at one-mark-node level.",
          evidence,
        ),
        consistencyFeature(
          "thinking_mark_distribution",
          `OPERATIONAL:${classification.thinkingMarkDistribution.OPERATIONAL}|REASONING:${classification.thinkingMarkDistribution.REASONING}`,
          "Operational/Reasoning mark distribution retained at one-mark-node level.",
          evidence,
        ),
        consistencyFeature("primary_answer", config.canonicalPrimaryAnswer, "Normalised source-correct primary response.", evidence),
        consistencyFeature("source_method_count", config.sourceMethodRefs.filter((ref) => ref !== "FOLLOW_UP").length, "Number of distinct source-represented primary solution pathways.", evidence),
        consistencyFeature("source_common_response_count", commonResponses.length, "Number of explicitly source-listed/derived response patterns retained.", evidence),
      ],
    },
    review: reviewFor(question, config),
  });
};
