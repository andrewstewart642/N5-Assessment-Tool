import type {
  A8EliminationPlan,
  A8GeneratedContext,
  A8GeneratedQuestion,
  A8LinearEquation,
} from "../../../04_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations/Types";
import { resolveA8GeneratedAnswerProfile } from "./Calibration";
import type {
  A8GeneratedAnswerLine,
  A8GeneratedAnswerMethod,
  A8GeneratedAnswerProfile,
  A8GeneratedFinalAnswer,
  A8GeneratedMarkingScheme,
  A8GeneratedMarkPoint,
} from "./Types";
import { validateA8GeneratedAnswer } from "./Validation";

const clean = (value: number) => Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(8));
const formatNumber = (value: number) => Number.isInteger(value) ? `${value}` : `${clean(value)}`;

const equationText = (equation: A8LinearEquation, variables: [string, string]) => {
  const terms: string[] = [];
  const append = (coefficient: number, variable: string) => {
    if (coefficient === 0) return;
    const magnitude = Math.abs(coefficient);
    const body = `${magnitude === 1 ? "" : formatNumber(magnitude)}${variable}`;
    if (!terms.length) terms.push(coefficient < 0 ? `−${body}` : body);
    else terms.push(`${coefficient < 0 ? "−" : "+"} ${body}`);
  };
  append(equation.a, variables[0]);
  append(equation.b, variables[1]);
  return `${terms.join(" ")} = ${formatNumber(equation.c)}`;
};

const scaledEquationText = (
  multiplier: number,
  original: A8LinearEquation,
  scaled: A8LinearEquation,
  variables: [string, string],
) => multiplier === 1
  ? equationText(scaled, variables)
  : `${formatNumber(multiplier)} × (${equationText(original, variables)}) → ${equationText(scaled, variables)}`;

const combinePlan = (plan: A8EliminationPlan): A8LinearEquation => {
  const sign = plan.combine === "ADD" ? 1 : -1;
  return {
    a: clean(plan.scaledFirst.a + sign * plan.scaledSecond.a),
    b: clean(plan.scaledFirst.b + sign * plan.scaledSecond.b),
    c: clean(plan.scaledFirst.c + sign * plan.scaledSecond.c),
  };
};

const formatContextValue = (context: A8GeneratedContext, value: number) => {
  if (context.unitPosition === "PREFIX") return `${context.unitSymbol}${value.toFixed(2)}`;
  return `${formatNumber(value)} ${context.unitSymbol}`;
};

const canonicalEquationAnswers = (question: A8GeneratedQuestion): [string, string] => [
  equationText(question.equations[0], question.variableSymbols),
  equationText(question.equations[1], question.variableSymbols),
];

const variableDefinitionText = (question: A8GeneratedQuestion) => {
  if (!question.context) return null;
  const context = question.context;
  const [v1, v2] = question.variableSymbols;
  let quantity = "value";
  if (context.unitDimension === "currency") quantity = "cost";
  else if (context.unitDimension === "mass") quantity = "weight";
  else if (context.resourceLabel) quantity = `amount of ${context.resourceLabel} needed`;
  return `${v1} = ${quantity} for one ${context.itemLabels[0]}; ${v2} = ${quantity} for one ${context.itemLabels[1]}.`;
};

const finalAnswers = (question: A8GeneratedQuestion): A8GeneratedFinalAnswer[] => {
  const [x, y] = question.solution;
  const [v1, v2] = question.variableSymbols;
  if (!question.context) {
    const answer = question.family === "GRAPH_INTERSECTION_SOLVE"
      ? `P = (${formatNumber(x)}, ${formatNumber(y)})`
      : `${v1} = ${formatNumber(x)}, ${v2} = ${formatNumber(y)}`;
    return [{ partLabel: "", normalisedAnswer: answer, numericValues: [x, y] }];
  }

  const equations = canonicalEquationAnswers(question);
  const answers: A8GeneratedFinalAnswer[] = [
    { partLabel: "a", normalisedAnswer: equations[0], numericValues: [] },
    { partLabel: "b", normalisedAnswer: equations[1], numericValues: [] },
  ];
  if (question.family === "CONTEXT_DERIVED_TOTAL") {
    answers.push({
      partLabel: "c",
      normalisedAnswer: formatContextValue(question.context, question.context.derivedTotal!),
      numericValues: [question.context.derivedTotal!],
    });
  } else {
    answers.push({
      partLabel: "c",
      normalisedAnswer: `${question.context.itemLabels[0]} = ${formatContextValue(question.context, x)}; ${question.context.itemLabels[1]} = ${formatContextValue(question.context, y)}`,
      numericValues: [x, y],
    });
  }
  return answers;
};

const defaultPlanFor = (question: A8GeneratedQuestion) =>
  question.eliminationPlans.find((plan) => plan.variable === question.quality.calibratedRoute.eliminatedVariable)
  ?? question.eliminationPlans[0];

const planIndices = (plan: A8EliminationPlan): { eliminatedIndex: 0 | 1; solvedIndex: 0 | 1 } => {
  const eliminatedIndex: 0 | 1 = plan.variable === "FIRST" ? 0 : 1;
  const solvedIndex: 0 | 1 = eliminatedIndex === 0 ? 1 : 0;
  return { eliminatedIndex, solvedIndex };
};

const communicationConditions = (question: A8GeneratedQuestion): string[] => {
  if (!question.context || question.family === "CONTEXT_DERIVED_TOTAL") return [];
  const context = question.context;
  if (context.unitDimension === "currency") {
    return [
      `State both contextual labels (${context.itemLabels[0]} and ${context.itemLabels[1]}).`,
      "Show the pound sign with each value.",
      "Give each money value to the nearest penny using two decimal figures.",
    ];
  }
  return [
    `State both contextual labels (${context.itemLabels[0]} and ${context.itemLabels[1]}).`,
    `Attach the correct ${context.unitSymbol} unit to both values.`,
  ];
};

const markPoints = (
  question: A8GeneratedQuestion,
  profile: A8GeneratedAnswerProfile,
): A8GeneratedMarkPoint[] => {
  const sourceAnchorIds = [...profile.sourceAnchorIds];
  const variables = question.variableSymbols;
  const defaultPlan = defaultPlanFor(question);
  const { eliminatedIndex, solvedIndex } = planIndices(defaultPlan);
  const scaleEvidence = `${equationText(defaultPlan.scaledFirst, variables)} and ${equationText(defaultPlan.scaledSecond, variables)}`;
  const firstValueEvidence = `${variables[solvedIndex]} = ${formatNumber(question.solution[solvedIndex])}`;
  const secondValueEvidence = `${variables[eliminatedIndex]} = ${formatNumber(question.solution[eliminatedIndex])}`;
  const pairEvidence = `${variables[0]} = ${formatNumber(question.solution[0])}, ${variables[1]} = ${formatNumber(question.solution[1])}`;

  if (!question.context) {
    if (profile.markProfile === "SCALE_STRATEGY_CORRECT") {
      return [
        {
          markNumber: 1,
          partLabel: "",
          type: "PROCESS",
          role: "SCALE",
          requirement: "Scale one or both equations correctly so that one variable can be eliminated.",
          evidenceExamples: [scaleEvidence],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [],
          followThroughFromMarkNumbers: [],
          comparableDifficultyRequired: false,
          blockingConditions: [],
          sourceAnchorIds,
        },
        {
          markNumber: 2,
          partLabel: "",
          type: "PROCESS",
          role: "STRATEGY",
          requirement: "Follow a valid algebraic elimination strategy through to values for both variables.",
          evidenceExamples: [firstValueEvidence, secondValueEvidence],
          acceptanceNotes: [],
          dependsOnMarkNumbers: [1],
          followThroughFromMarkNumbers: [1],
          comparableDifficultyRequired: true,
          blockingConditions: [],
          sourceAnchorIds,
        },
        {
          markNumber: 3,
          partLabel: "",
          type: "ACCURACY",
          role: "CORRECT_PAIR",
          requirement: question.family === "GRAPH_INTERSECTION_SOLVE"
            ? "Obtain the correct two values for the intersection point."
            : "Obtain the correct pair of variable values.",
          evidenceExamples: [question.family === "GRAPH_INTERSECTION_SOLVE"
            ? `P = (${formatNumber(question.solution[0])}, ${formatNumber(question.solution[1])})`
            : pairEvidence],
          acceptanceNotes: profile.reversedCoordinatePairFullCredit
            ? ["A reversed final coordinate pair remains full-credit when the algebraic working clearly establishes both correct variable values, matching the sole supplied graph-family source."]
            : [],
          dependsOnMarkNumbers: [2],
          followThroughFromMarkNumbers: [1, 2],
          comparableDifficultyRequired: true,
          blockingConditions: [],
          sourceAnchorIds,
        },
      ];
    }

    return [
      {
        markNumber: 1,
        partLabel: "",
        type: "PROCESS",
        role: "SCALE",
        requirement: "Scale one or both equations correctly so that one variable can be eliminated.",
        evidenceExamples: [scaleEvidence],
        acceptanceNotes: profile.separateScalingEitherCorrect
          ? ["If separate scaling routes are shown for the two variables, this mark survives when either scaling is correct."]
          : [],
        dependsOnMarkNumbers: [],
        followThroughFromMarkNumbers: [],
        comparableDifficultyRequired: false,
        blockingConditions: [],
        sourceAnchorIds,
      },
      {
        markNumber: 2,
        partLabel: "",
        type: "PROCESS",
        role: "FIRST_VALUE",
        requirement: "Obtain a consistent value for one variable after valid scaling and elimination.",
        evidenceExamples: [firstValueEvidence],
        acceptanceNotes: profile.roundedFollowThroughAtLeastDp !== null
          ? [`After an earlier error, a consistent rounded follow-through value is acceptable to at least ${profile.roundedFollowThroughAtLeastDp} decimal place.`]
          : [],
        dependsOnMarkNumbers: [1],
        followThroughFromMarkNumbers: [1],
        comparableDifficultyRequired: true,
        blockingConditions: [],
        sourceAnchorIds,
      },
      {
        markNumber: 3,
        partLabel: "",
        type: "ACCURACY",
        role: "SECOND_VALUE",
        requirement: "Obtain a consistent value for the other variable and complete the solution pair.",
        evidenceExamples: [secondValueEvidence, pairEvidence],
        acceptanceNotes: [
          ...(profile.roundedFollowThroughAtLeastDp !== null
            ? [`After an earlier error, a consistent rounded follow-through value is acceptable to at least ${profile.roundedFollowThroughAtLeastDp} decimal place.`]
            : []),
          ...(profile.finalFractionConversionNotPenalised
            ? ["An incorrect final conversion of an otherwise valid fraction to a mixed-number or decimal form is not separately penalised for this mark."]
            : []),
        ],
        dependsOnMarkNumbers: [2],
        followThroughFromMarkNumbers: [1, 2],
        comparableDifficultyRequired: true,
        blockingConditions: [],
        sourceAnchorIds,
      },
    ];
  }

  const equations = canonicalEquationAnswers(question);
  const equationAcceptance = [
    "An algebraically equivalent equation is accepted when the candidate uses consistently defined variables.",
    ...(profile.equationEvidenceCanAppearLater
      ? ["If omitted from its own part, the correct equation may be evidenced later in the solving work."]
      : []),
  ];
  const oldContextProfile = profile.markProfile === "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE";
  const finalCommunication = communicationConditions(question);

  return [
    {
      markNumber: 1,
      partLabel: "a",
      type: "REPRESENTATION",
      role: "FORM_EQUATION_1",
      requirement: "Construct a correct linear equation for the first contextual relationship.",
      evidenceExamples: [equations[0]],
      acceptanceNotes: equationAcceptance,
      dependsOnMarkNumbers: [],
      followThroughFromMarkNumbers: [],
      comparableDifficultyRequired: false,
      blockingConditions: [],
      sourceAnchorIds,
    },
    {
      markNumber: 2,
      partLabel: "b",
      type: "REPRESENTATION",
      role: "FORM_EQUATION_2",
      requirement: "Construct a correct linear equation for the second contextual relationship.",
      evidenceExamples: [equations[1]],
      acceptanceNotes: equationAcceptance,
      dependsOnMarkNumbers: [],
      followThroughFromMarkNumbers: [],
      comparableDifficultyRequired: false,
      blockingConditions: [],
      sourceAnchorIds,
    },
    {
      markNumber: 3,
      partLabel: "c",
      type: "PROCESS",
      role: "SCALE",
      requirement: "Scale one or both equations correctly so that one variable can be eliminated.",
      evidenceExamples: [scaleEvidence],
      acceptanceNotes: [],
      dependsOnMarkNumbers: [],
      followThroughFromMarkNumbers: [1, 2],
      comparableDifficultyRequired: true,
      blockingConditions: [],
      sourceAnchorIds,
    },
    {
      markNumber: 4,
      partLabel: "c",
      type: "PROCESS",
      role: oldContextProfile ? "STRATEGY" : "FIRST_VALUE",
      requirement: oldContextProfile
        ? "Follow a valid simultaneous-equation strategy through to values for both contextual unknowns."
        : "Obtain a consistent value for one contextual unknown after elimination.",
      evidenceExamples: oldContextProfile ? [firstValueEvidence, secondValueEvidence] : [firstValueEvidence],
      acceptanceNotes: [],
      dependsOnMarkNumbers: [3],
      followThroughFromMarkNumbers: [1, 2, 3],
      comparableDifficultyRequired: true,
      blockingConditions: [],
      sourceAnchorIds,
    },
    {
      markNumber: 5,
      partLabel: "c",
      type: "ACCURACY",
      role: oldContextProfile ? "CORRECT_PAIR" : "SECOND_VALUE",
      requirement: oldContextProfile
        ? "Obtain the correct pair of contextual values."
        : "Obtain a consistent value for the other contextual unknown and complete the pair.",
      evidenceExamples: oldContextProfile ? [pairEvidence] : [secondValueEvidence, pairEvidence],
      acceptanceNotes: [],
      dependsOnMarkNumbers: [4],
      followThroughFromMarkNumbers: [1, 2, 3, 4],
      comparableDifficultyRequired: true,
      blockingConditions: [],
      sourceAnchorIds,
    },
    {
      markNumber: 6,
      partLabel: "c",
      type: question.family === "CONTEXT_DERIVED_TOTAL" ? "PROCESS" : "COMMUNICATION",
      role: question.family === "CONTEXT_DERIVED_TOTAL" ? "DERIVED_TOTAL" : "COMMUNICATE",
      requirement: question.family === "CONTEXT_DERIVED_TOTAL"
        ? "Use the solved values consistently to calculate the requested further total."
        : "State both solved contextual values with the required labels and units/presentation.",
      evidenceExamples: question.family === "CONTEXT_DERIVED_TOTAL"
        ? [`${question.context.derivedCounts![0]}(${formatNumber(question.solution[0])}) + ${question.context.derivedCounts![1]}(${formatNumber(question.solution[1])}) = ${formatContextValue(question.context, question.context.derivedTotal!)}`]
        : [finalAnswers(question).find((answer) => answer.partLabel === "c")!.normalisedAnswer],
      acceptanceNotes: question.family === "CONTEXT_DERIVED_TOTAL"
        ? ["The final mark is for the further calculation, not merely for communicating the two intermediate solved values."]
        : finalCommunication,
      dependsOnMarkNumbers: [4, 5],
      followThroughFromMarkNumbers: [4, 5],
      comparableDifficultyRequired: true,
      blockingConditions: profile.negativeValuesBlockFinalMark
        ? ["This final mark is unavailable if either generated contextual value is negative."]
        : [],
      sourceAnchorIds,
    },
  ];
};

const bestSubstitution = (
  question: A8GeneratedQuestion,
  solvedIndex: 0 | 1,
  eliminatedIndex: 0 | 1,
  firstSolvedValue: number,
) => question.equations
  .map((equation, equationIndex) => {
    const knownContribution = solvedIndex === 0
      ? equation.a * firstSolvedValue
      : equation.b * firstSolvedValue;
    const unknownCoefficient = eliminatedIndex === 0 ? equation.a : equation.b;
    const numerator = equation.c - knownContribution;
    const eliminatedValue = clean(numerator / unknownCoefficient);
    const decimalPenalty = [knownContribution, numerator, eliminatedValue]
      .filter((value) => !Number.isInteger(value)).length * 4;
    return {
      equation,
      equationIndex,
      knownContribution,
      unknownCoefficient,
      numerator,
      eliminatedValue,
      score: Math.abs(unknownCoefficient) * 2 + decimalPenalty + Math.abs(numerator) * 0.02,
    };
  })
  .sort((first, second) => first.score - second.score)[0];

const answerMethod = (
  question: A8GeneratedQuestion,
  plan: A8EliminationPlan,
  profile: A8GeneratedAnswerProfile,
): A8GeneratedAnswerMethod => {
  const variables = question.variableSymbols;
  const combined = combinePlan(plan);
  const { eliminatedIndex, solvedIndex } = planIndices(plan);
  const solvedCoefficient = solvedIndex === 0 ? combined.a : combined.b;
  const firstSolvedValue = clean(combined.c / solvedCoefficient);
  const expectedFirstSolvedValue = question.solution[solvedIndex];
  if (Math.abs(firstSolvedValue - expectedFirstSolvedValue) > 1e-8) {
    throw new Error("Generated elimination plan did not solve to the shared question state.");
  }

  const substitution = bestSubstitution(question, solvedIndex, eliminatedIndex, firstSolvedValue);
  const eliminatedValue = substitution.eliminatedValue;
  const solvedValues: [number, number] = eliminatedIndex === 0
    ? [eliminatedValue, firstSolvedValue]
    : [firstSolvedValue, eliminatedValue];
  const lines: A8GeneratedAnswerLine[] = [];

  if (question.context) {
    const definition = variableDefinitionText(question);
    if (definition) {
      lines.push({
        id: `${question.instanceId}-${plan.variable}-DEFINE`,
        text: definition,
        markNumbers: [],
      });
    }
    const equations = canonicalEquationAnswers(question);
    lines.push({ id: `${question.instanceId}-${plan.variable}-EQ1`, text: equations[0], markNumbers: [1] });
    lines.push({ id: `${question.instanceId}-${plan.variable}-EQ2`, text: equations[1], markNumbers: [2] });
  }

  const scaleMark = question.context ? 3 : 1;
  lines.push({
    id: `${question.instanceId}-${plan.variable}-SCALE`,
    text: `${scaledEquationText(plan.firstMultiplier, question.equations[0], plan.scaledFirst, variables)}; ${scaledEquationText(plan.secondMultiplier, question.equations[1], plan.scaledSecond, variables)}`,
    markNumbers: [scaleMark],
  });

  const bareStrategyProfile = !question.context && profile.markProfile === "SCALE_STRATEGY_CORRECT";
  const contextStrategyProfile = !!question.context && profile.markProfile === "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE";
  const firstValueMark = question.context ? 4 : 2;
  const secondValueMark = question.context ? 5 : 3;

  lines.push({
    id: `${question.instanceId}-${plan.variable}-ELIMINATE`,
    text: `${plan.combine === "ADD" ? "Add" : "Subtract"} the scaled equations: ${equationText(combined, variables)}, so ${variables[solvedIndex]} = ${formatNumber(firstSolvedValue)}.`,
    markNumbers: [firstValueMark],
  });
  lines.push({
    id: `${question.instanceId}-${plan.variable}-SUBSTITUTE`,
    text: `Substitute ${variables[solvedIndex]} = ${formatNumber(firstSolvedValue)} into equation ${substitution.equationIndex + 1}: ${variables[eliminatedIndex]} = ${formatNumber(eliminatedValue)}.`,
    markNumbers: bareStrategyProfile || contextStrategyProfile ? [firstValueMark] : [secondValueMark],
  });

  if (bareStrategyProfile) {
    lines.push({
      id: `${question.instanceId}-${plan.variable}-PAIR`,
      text: question.family === "GRAPH_INTERSECTION_SOLVE"
        ? `P = (${formatNumber(question.solution[0])}, ${formatNumber(question.solution[1])})`
        : `${variables[0]} = ${formatNumber(question.solution[0])}, ${variables[1]} = ${formatNumber(question.solution[1])}`,
      markNumbers: [3],
    });
  }

  if (question.context) {
    if (contextStrategyProfile) {
      lines.push({
        id: `${question.instanceId}-${plan.variable}-PAIR`,
        text: `${variables[0]} = ${formatNumber(question.solution[0])}, ${variables[1]} = ${formatNumber(question.solution[1])}`,
        markNumbers: [5],
      });
    }

    if (question.family === "CONTEXT_DERIVED_TOTAL") {
      const [d1, d2] = question.context.derivedCounts!;
      const total = question.context.derivedTotal!;
      lines.push({
        id: `${question.instanceId}-${plan.variable}-DERIVED`,
        text: `${d1}(${formatNumber(question.solution[0])}) + ${d2}(${formatNumber(question.solution[1])}) = ${formatContextValue(question.context, total)}.`,
        markNumbers: [6],
      });
    } else {
      lines.push({
        id: `${question.instanceId}-${plan.variable}-COMMUNICATE`,
        text: `${question.context.itemLabels[0]} = ${formatContextValue(question.context, question.solution[0])}; ${question.context.itemLabels[1]} = ${formatContextValue(question.context, question.solution[1])}.`,
        markNumbers: [6],
      });
    }
  }

  return {
    methodFamilyId: plan.variable === "FIRST" ? "ELIMINATE_FIRST_VARIABLE" : "ELIMINATE_SECOND_VARIABLE",
    eliminatedVariable: plan.variable,
    lines,
    solvedValues,
    sourceEvidenceIds: [...profile.sourceAnchorIds],
  };
};

export const generateA8Answer = (question: A8GeneratedQuestion): A8GeneratedMarkingScheme => {
  const profile = resolveA8GeneratedAnswerProfile(question);
  if (profile.family !== question.family || profile.paper !== question.paper) {
    throw new Error(`A8 answer profile ${profile.id} does not support ${question.family} on ${question.paper}.`);
  }

  const methods: A8GeneratedAnswerMethod[] = [
    answerMethod(question, question.eliminationPlans[0], profile),
    answerMethod(question, question.eliminationPlans[1], profile),
  ];
  const defaultIndex = methods.findIndex(
    (method) => method.eliminatedVariable === question.quality.calibratedRoute.eliminatedVariable,
  );
  const contextual = !!question.context;
  const derived = question.family === "CONTEXT_DERIVED_TOTAL";
  const graph = question.family === "GRAPH_INTERSECTION_SOLVE";
  const answer: A8GeneratedMarkingScheme = {
    generatorId: "A8_SIMULTANEOUS_EQUATIONS_ANSWER_V2",
    questionInstanceId: question.instanceId,
    family: question.family,
    profileId: profile.id,
    markProfile: profile.markProfile,
    profileSourceAnchorIds: [...profile.sourceAnchorIds],
    totalMarks: question.marks,
    equationState: question.equations,
    intendedSolution: question.solution,
    finalAnswers: finalAnswers(question),
    markPoints: markPoints(question, profile),
    methods,
    defaultMethodFamilyId: methods[defaultIndex >= 0 ? defaultIndex : 0].methodFamilyId,
    workingPolicy: {
      unsupportedCorrectAnswerTreatment: profile.answerOnlyTreatment,
      algebraicWorkingRequired: true,
      permittedMethodFamilies: methods.map((method) => method.methodFamilyId),
      excludedPrototypeMethods: profile.explicitlyExcludedMethod ? [profile.explicitlyExcludedMethod] : [],
      followThroughRoundedAtLeastDp: profile.roundedFollowThroughAtLeastDp,
      separateScalingEitherCorrect: profile.separateScalingEitherCorrect,
      finalFractionConversionNotPenalised: profile.finalFractionConversionNotPenalised,
      equationEvidenceCanAppearLater: profile.equationEvidenceCanAppearLater,
      followThroughPrinciple: "Later process/value credit may survive an earlier error only when the subsequent algebra remains mathematically coherent and retains comparable difficulty; any profile-specific rounding allowance is stated explicitly above.",
      generationPolicyRationale: `${profile.rationale} This is a generated marking policy selected from the reviewed A8 corpus; it does not overwrite source-local historical rules or source silence.`,
    },
    presentationPolicy: {
      contextualLabelsRequiredForFinalMark: contextual && !derived,
      unitsRequiredForFinalMark: contextual,
      currencyNearestPennyRequired: question.context?.unitDimension === "currency",
      derivedTargetRequired: derived,
      equivalentEquationFormsAccepted: contextual,
      candidateChosenVariablesAccepted: contextual,
      negativeValuesBlockFinalMark: profile.negativeValuesBlockFinalMark,
      coordinatePairRequired: graph,
      reversedCoordinatePairFullCreditWithValidWorking: profile.reversedCoordinatePairFullCredit,
    },
    sourceBasis: question.sourceBasis,
    generationNotes: [
      "Question and answer generation consume the same deterministic mathematical state.",
      `Generated marking profile: ${profile.id} (${profile.markProfile}).`,
      `Profile anchors: ${profile.sourceAnchorIds.join(", ")}.`,
      "The default worked method follows the calibrated written route selected by Question Generation.",
      "Both coefficient-elimination directions are generated and validated against the same intended solution.",
      "Contextual worked answers define the generated variable symbols because the pupil-facing prompt intentionally leaves variable choice open.",
      "Historical source wording and source layout are not used as generated answer templates.",
    ],
  };

  const validation = validateA8GeneratedAnswer(question, answer);
  if (!validation.valid) {
    throw new Error(`Generated A8 answer failed validation: ${validation.issues.map((issue) => `${issue.code}: ${issue.message}`).join("; ")}`);
  }
  return answer;
};
