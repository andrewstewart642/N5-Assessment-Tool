import type {
  A8EliminationPlan,
  A8GeneratedContext,
  A8GeneratedQuestion,
  A8LinearEquation,
} from "../../03_QuestionGeneration/A8_SimultaneousEquations/Types";
import type {
  A8GeneratedAnswerLine,
  A8GeneratedAnswerMethod,
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
  : `${formatNumber(multiplier)} × (${equationText(original, variables)})  →  ${equationText(scaled, variables)}`;

const combinePlan = (plan: A8EliminationPlan): A8LinearEquation => {
  const sign = plan.combine === "ADD" ? 1 : -1;
  return {
    a: clean(plan.scaledFirst.a + sign * plan.scaledSecond.a),
    b: clean(plan.scaledFirst.b + sign * plan.scaledSecond.b),
    c: clean(plan.scaledFirst.c + sign * plan.scaledSecond.c),
  };
};

const formatContextValue = (context: A8GeneratedContext, value: number) => {
  if (context.unitPosition === "PREFIX") {
    return `${context.unitSymbol}${value.toFixed(2)}`;
  }
  return `${formatNumber(value)} ${context.unitSymbol}`;
};

const canonicalEquationAnswers = (question: A8GeneratedQuestion): [string, string] => [
  equationText(question.equations[0], question.variableSymbols),
  equationText(question.equations[1], question.variableSymbols),
];

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
    answers.push({ partLabel: "c", normalisedAnswer: formatContextValue(question.context, question.context.derivedTotal!), numericValues: [question.context.derivedTotal!] });
  } else {
    answers.push({
      partLabel: "c",
      normalisedAnswer: `${question.context.itemLabels[0]} = ${formatContextValue(question.context, x)}; ${question.context.itemLabels[1]} = ${formatContextValue(question.context, y)}`,
      numericValues: [x, y],
    });
  }
  return answers;
};

const markPoints = (question: A8GeneratedQuestion): A8GeneratedMarkPoint[] => {
  if (!question.context) {
    return [
      { markNumber: 1, partLabel: "", type: "PROCESS", requirement: "Create a valid equivalent system by scaling one or both equations so that a variable can be eliminated.", evidenceExamples: ["Correct coefficient scaling for either variable."], dependsOnMarkNumbers: [], followThroughFromMarkNumbers: [], comparableDifficultyRequired: false, blockingConditions: [] },
      { markNumber: 2, partLabel: "", type: "PROCESS", requirement: "Eliminate and obtain a consistent value for one variable.", evidenceExamples: ["A value obtained from a valid elimination equation."], dependsOnMarkNumbers: [1], followThroughFromMarkNumbers: [1], comparableDifficultyRequired: true, blockingConditions: [] },
      { markNumber: 3, partLabel: "", type: "ACCURACY", requirement: question.family === "GRAPH_INTERSECTION_SOLVE" ? "Obtain the second variable and identify the common solution coordinates." : "Obtain the second variable and complete the unique solution pair.", evidenceExamples: ["Both generated variable values are consistent with the same system."], dependsOnMarkNumbers: [2], followThroughFromMarkNumbers: [1, 2], comparableDifficultyRequired: true, blockingConditions: [] },
    ];
  }

  const derived = question.family === "CONTEXT_DERIVED_TOTAL";
  return [
    { markNumber: 1, partLabel: "a", type: "REPRESENTATION", requirement: "Construct a correct linear equation for the first generated contextual relationship.", evidenceExamples: [canonicalEquationAnswers(question)[0]], dependsOnMarkNumbers: [], followThroughFromMarkNumbers: [], comparableDifficultyRequired: false, blockingConditions: [] },
    { markNumber: 2, partLabel: "b", type: "REPRESENTATION", requirement: "Construct a correct linear equation for the second generated contextual relationship.", evidenceExamples: [canonicalEquationAnswers(question)[1]], dependsOnMarkNumbers: [], followThroughFromMarkNumbers: [], comparableDifficultyRequired: false, blockingConditions: [] },
    { markNumber: 3, partLabel: "c", type: "PROCESS", requirement: "Scale one or both equations so that one variable can be eliminated.", evidenceExamples: ["Correct coefficient scaling for either elimination direction."], dependsOnMarkNumbers: [], followThroughFromMarkNumbers: [1, 2], comparableDifficultyRequired: true, blockingConditions: [] },
    { markNumber: 4, partLabel: "c", type: "PROCESS", requirement: "Eliminate and obtain a consistent value for one contextual unknown.", evidenceExamples: ["First consistent solved unit value."], dependsOnMarkNumbers: [3], followThroughFromMarkNumbers: [3], comparableDifficultyRequired: true, blockingConditions: [] },
    { markNumber: 5, partLabel: "c", type: "ACCURACY", requirement: "Obtain the other contextual unknown consistently.", evidenceExamples: ["Complete the generated pair of unit values."], dependsOnMarkNumbers: [4], followThroughFromMarkNumbers: [3, 4], comparableDifficultyRequired: true, blockingConditions: [] },
    { markNumber: 6, partLabel: "c", type: derived ? "PROCESS" : "COMMUNICATION", requirement: derived ? "Use the solved values to calculate the requested third linear combination." : "State both solved values with the generated contextual labels and units.", evidenceExamples: [derived ? "Correct generated derived total." : "Both generated item labels and units are attached to the solved values."], dependsOnMarkNumbers: [4, 5], followThroughFromMarkNumbers: [4, 5], comparableDifficultyRequired: true, blockingConditions: ["A contextual value must not be negative in a generated real-world instance."] },
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
): A8GeneratedAnswerMethod => {
  const variables = question.variableSymbols;
  const combined = combinePlan(plan);
  const eliminatedIndex: 0 | 1 = plan.variable === "FIRST" ? 0 : 1;
  const solvedIndex: 0 | 1 = eliminatedIndex === 0 ? 1 : 0;
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

  const scaleMark = question.context ? 3 : 1;
  const firstValueMark = question.context ? 4 : 2;
  const secondValueMark = question.context ? 5 : 3;
  const lines: A8GeneratedAnswerLine[] = [];

  if (question.context) {
    const equations = canonicalEquationAnswers(question);
    lines.push({ id: `${question.instanceId}-EQ1`, text: `Using ${variables[0]} and ${variables[1]} for the two unit values: ${equations[0]}`, markNumbers: [1] });
    lines.push({ id: `${question.instanceId}-EQ2`, text: equations[1], markNumbers: [2] });
  }

  lines.push({
    id: `${question.instanceId}-${plan.variable}-SCALE`,
    text: `${scaledEquationText(plan.firstMultiplier, question.equations[0], plan.scaledFirst, variables)}; ${scaledEquationText(plan.secondMultiplier, question.equations[1], plan.scaledSecond, variables)}`,
    markNumbers: [scaleMark],
  });
  lines.push({
    id: `${question.instanceId}-${plan.variable}-ELIMINATE`,
    text: `${plan.combine === "ADD" ? "Add" : "Subtract"} the scaled equations: ${equationText(combined, variables)}, so ${variables[solvedIndex]} = ${formatNumber(firstSolvedValue)}.`,
    markNumbers: [firstValueMark],
  });
  lines.push({
    id: `${question.instanceId}-${plan.variable}-SUBSTITUTE`,
    text: `Substitute ${variables[solvedIndex]} = ${formatNumber(firstSolvedValue)} into equation ${substitution.equationIndex + 1} to obtain ${variables[eliminatedIndex]} = ${formatNumber(eliminatedValue)}.`,
    markNumbers: [secondValueMark],
  });

  if (question.context) {
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
    sourceEvidenceIds: question.sourceBasis.answerCatalogIds,
  };
};

export const generateA8Answer = (question: A8GeneratedQuestion): A8GeneratedMarkingScheme => {
  const methods: A8GeneratedAnswerMethod[] = [
    answerMethod(question, question.eliminationPlans[0]),
    answerMethod(question, question.eliminationPlans[1]),
  ];
  const defaultIndex = methods.findIndex(
    (method) => method.eliminatedVariable === question.quality.calibratedRoute.eliminatedVariable,
  );
  const contextual = !!question.context;
  const derived = question.family === "CONTEXT_DERIVED_TOTAL";
  const answer: A8GeneratedMarkingScheme = {
    generatorId: "A8_SIMULTANEOUS_EQUATIONS_ANSWER_V1",
    questionInstanceId: question.instanceId,
    family: question.family,
    totalMarks: question.marks,
    equationState: question.equations,
    intendedSolution: question.solution,
    finalAnswers: finalAnswers(question),
    markPoints: markPoints(question),
    methods,
    defaultMethodFamilyId: methods[defaultIndex >= 0 ? defaultIndex : 0].methodFamilyId,
    workingPolicy: {
      unsupportedCorrectAnswerTreatment: "NO_CREDIT",
      algebraicWorkingRequired: true,
      permittedMethodFamilies: methods.map((method) => method.methodFamilyId),
      excludedPrototypeMethods: ["GUESS_AND_CHECK", "REPEATED_SUBSTITUTION"],
      followThroughPrinciple: "Later process credit may survive an earlier error only when the subsequent algebra retains comparable difficulty and remains mathematically coherent.",
      generationPolicyRationale: "This is a prototype-generation rule derived from the dominant A8 source pattern plus the general marking-policy requirement for appropriate working; it is not written back into historical entries as a universal source fact.",
    },
    presentationPolicy: {
      contextualLabelsRequiredForFinalMark: contextual && !derived,
      unitsRequiredForFinalMark: contextual,
      currencyNearestPennyRequired: question.context?.unitDimension === "currency",
      derivedTargetRequired: derived,
    },
    sourceBasis: question.sourceBasis,
    generationNotes: [
      "Question and answer generation consume the same deterministic mathematical state.",
      "The default worked method follows the calibrated written route selected by Question Generation.",
      "Substitution uses the friendlier original equation for the generated values rather than mechanically using equation 1.",
      "Historical source wording and source layout are not used as generated answer templates.",
    ],
  };

  const validation = validateA8GeneratedAnswer(question, answer);
  if (!validation.valid) {
    throw new Error(`Generated A8 answer failed validation: ${validation.issues.map((issue) => `${issue.code}: ${issue.message}`).join("; ")}`);
  }
  return answer;
};
