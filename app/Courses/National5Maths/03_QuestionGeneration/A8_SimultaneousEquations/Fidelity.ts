import type { A8CalibratedRoute } from "./Calibration";
import type {
  A8GeneratedContext,
  A8GeneratorDifficulty,
  A8GeneratorFamily,
  A8GeneratorPaper,
  A8LinearEquation,
} from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const coefficientGcd = (equation: A8LinearEquation) =>
  gcd(Math.abs(Math.round(equation.a)), Math.abs(Math.round(equation.b)));
const isIntegerOrHalf = (value: number) => close(value * 2, Math.round(value * 2));
const hasAtMostOneDecimal = (value: number) => close(value * 10, Math.round(value * 10));
const hasAtMostTwoDecimals = (value: number) => close(value * 100, Math.round(value * 100));
const isMultipleOf = (value: number, step: number) => close(value / step, Math.round(value / step));

export type A8SubstitutionProfile = {
  equationIndex: 0 | 1;
  knownVariable: "FIRST" | "SECOND";
  knownValue: number;
  unknownVariable: "FIRST" | "SECOND";
  unknownCoefficient: number;
  knownContribution: number;
  numerator: number;
  solvedValue: number;
  arithmeticScore: number;
};

export type A8DifficultyComponents = {
  familyBurden: number;
  scalingBurden: number;
  scaledMagnitudeBurden: number;
  signBurden: number;
  decimalBurden: number;
  substitutionBurden: number;
  postSolveBurden: number;
};

export type A8FidelityAssessment = {
  accepted: boolean;
  classifiedDifficulty: A8GeneratorDifficulty;
  difficultyScore: number;
  difficultyComponents: A8DifficultyComponents;
  signals: string[];
  substitution: A8SubstitutionProfile;
};

const substitutionProfile = (
  route: A8CalibratedRoute,
  equations: [A8LinearEquation, A8LinearEquation],
): A8SubstitutionProfile => {
  const knownVariable: A8SubstitutionProfile["knownVariable"] =
    route.eliminatedVariable === "FIRST" ? "SECOND" : "FIRST";
  const unknownVariable: A8SubstitutionProfile["unknownVariable"] =
    knownVariable === "FIRST" ? "SECOND" : "FIRST";
  const knownValue = route.solvedValue;

  const candidates: A8SubstitutionProfile[] = equations.map((equation, equationIndex) => {
    const knownCoefficient = knownVariable === "FIRST" ? equation.a : equation.b;
    const unknownCoefficient = unknownVariable === "FIRST" ? equation.a : equation.b;
    const knownContribution = knownCoefficient * knownValue;
    const numerator = equation.c - knownContribution;
    const solvedValue = numerator / unknownCoefficient;
    const decimalPenalty = [knownContribution, numerator, solvedValue]
      .filter((value) => !Number.isInteger(value)).length * 4;
    return {
      equationIndex: equationIndex as 0 | 1,
      knownVariable,
      knownValue,
      unknownVariable,
      unknownCoefficient,
      knownContribution,
      numerator,
      solvedValue,
      arithmeticScore:
        Math.abs(unknownCoefficient) * 2 +
        decimalPenalty +
        Math.min(Math.abs(numerator) * 0.02, 6),
    };
  });

  return candidates.sort((first, second) => first.arithmeticScore - second.arithmeticScore)[0];
};

const familyBurden = (family: A8GeneratorFamily) => {
  if (family === "GRAPH_INTERSECTION_SOLVE") return 35;
  if (family === "CONTEXT_DERIVED_TOTAL") return 32;
  if (family === "CONTEXT_FORM_AND_SOLVE") return 8;
  return 0;
};

const scalingBurden = (
  route: A8CalibratedRoute,
  equations: [A8LinearEquation, A8LinearEquation],
) => {
  const maxMultiplier = Math.max(...route.multipliers);
  const bothScaled = route.multipliers.every((value) => value > 1);
  const maxCoefficient = Math.max(...equations.flatMap((equation) => [Math.abs(equation.a), Math.abs(equation.b)]));
  const multiplierBurden = maxMultiplier <= 1 ? 0 : maxMultiplier === 2 ? 3 : maxMultiplier === 3 ? 6 : maxMultiplier === 4 ? 10 : 14;
  const coefficientBurden = maxCoefficient >= 7 ? 5 : maxCoefficient >= 6 ? 3 : maxCoefficient >= 5 ? 1 : 0;
  return multiplierBurden + (bothScaled ? 3 : 0) + coefficientBurden;
};

const scaledMagnitudeBurden = (args: {
  family: A8GeneratorFamily;
  paper: A8GeneratorPaper;
  context: A8GeneratedContext | null;
  route: A8CalibratedRoute;
}) => {
  const maxScaled = Math.max(...args.route.scaledConstants);

  if (args.family === "ABSTRACT_SOLVE") {
    if (maxScaled <= 16) return 0;
    if (maxScaled <= 22) return 3;
    if (maxScaled <= 28) return 6;
    return 10;
  }

  if (args.family === "GRAPH_INTERSECTION_SOLVE") {
    if (maxScaled <= 15) return 2;
    if (maxScaled <= 22) return 4;
    return 6;
  }

  if (args.family === "CONTEXT_DERIVED_TOTAL") {
    if (maxScaled <= 3000) return 6;
    if (maxScaled <= 6000) return 10;
    return 14;
  }

  if (args.paper === "P1" && args.context?.contextKind === "MASS") {
    if (maxScaled <= 200) return 0;
    if (maxScaled <= 350) return 4;
    if (maxScaled <= 550) return 8;
    if (maxScaled <= 800) return 13;
    return 18;
  }

  if (args.paper === "P1" && args.context?.contextKind === "RESOURCE") {
    if (maxScaled <= 20) return 0;
    if (maxScaled <= 30) return 3;
    if (maxScaled <= 45) return 6;
    if (maxScaled <= 60) return 9;
    return 12;
  }

  if (args.paper === "P2" && args.context?.contextKind === "PURCHASE") {
    if (maxScaled <= 25) return 0;
    if (maxScaled <= 80) return 3;
    if (maxScaled <= 180) return 7;
    if (maxScaled <= 300) return 11;
    return 15;
  }

  return 0;
};

const signBurden = (
  equations: [A8LinearEquation, A8LinearEquation],
) => {
  const negativeCoefficients = equations
    .flatMap((equation) => [equation.a, equation.b])
    .filter((value) => value < 0).length;
  const negativeConstants = equations.filter((equation) => equation.c < 0).length;
  return Math.min(negativeCoefficients * 4, 8) + Math.min(negativeConstants * 2, 4);
};

const decimalBurden = (args: {
  paper: A8GeneratorPaper;
  family: A8GeneratorFamily;
  solution: [number, number];
  route: A8CalibratedRoute;
  substitution: A8SubstitutionProfile;
}) => {
  const finalValues = args.solution;
  let finalBurden = 0;

  if (!finalValues.every(Number.isInteger)) {
    if (args.paper === "P2" && args.family === "CONTEXT_FORM_AND_SOLVE") {
      finalBurden = finalValues.every((value) => isMultipleOf(value, 0.5))
        ? 6
        : finalValues.every((value) => isMultipleOf(value, 0.25))
          ? 10
          : finalValues.every(hasAtMostOneDecimal)
            ? 14
            : 18;
    } else {
      finalBurden = finalValues.every(isIntegerOrHalf)
        ? 10
        : finalValues.every(hasAtMostOneDecimal)
          ? 18
          : 22;
    }
  }

  const workingValues = [
    ...args.route.scaledConstants,
    args.route.remainingConstant,
    args.route.solvedValue,
    args.substitution.knownContribution,
    args.substitution.numerator,
    args.substitution.solvedValue,
  ];
  const hasWorkingDecimal = workingValues.some((value) => !Number.isInteger(value));
  const hasWorkingNonHalf = workingValues.some((value) => !isIntegerOrHalf(value));
  const hasWorkingHundredths = workingValues.some((value) => !hasAtMostOneDecimal(value));

  return finalBurden +
    (hasWorkingDecimal ? 4 : 0) +
    (hasWorkingNonHalf ? 4 : 0) +
    (hasWorkingHundredths ? 3 : 0);
};

const substitutionBurden = (substitution: A8SubstitutionProfile) => {
  if (substitution.arithmeticScore <= 4) return 0;
  if (substitution.arithmeticScore <= 6) return 2;
  if (substitution.arithmeticScore <= 9) return 4;
  if (substitution.arithmeticScore <= 12) return 6;
  return 8;
};

const postSolveBurden = (family: A8GeneratorFamily) =>
  family === "CONTEXT_DERIVED_TOTAL" ? 12 : 0;

const difficultyComponents = (args: {
  family: A8GeneratorFamily;
  paper: A8GeneratorPaper;
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  route: A8CalibratedRoute;
  context: A8GeneratedContext | null;
  substitution: A8SubstitutionProfile;
}): A8DifficultyComponents => ({
  familyBurden: familyBurden(args.family),
  scalingBurden: scalingBurden(args.route, args.equations),
  scaledMagnitudeBurden: scaledMagnitudeBurden(args),
  signBurden: signBurden(args.equations),
  decimalBurden: decimalBurden(args),
  substitutionBurden: substitutionBurden(args.substitution),
  postSolveBurden: postSolveBurden(args.family),
});

const componentTotal = (components: A8DifficultyComponents) => Math.min(
  100,
  Object.values(components).reduce((sum, value) => sum + value, 0),
);

const classifyDifficulty = (args: {
  family: A8GeneratorFamily;
  paper: A8GeneratorPaper;
  solution: [number, number];
  score: number;
}): A8GeneratorDifficulty => {
  if (args.family === "GRAPH_INTERSECTION_SOLVE" || args.family === "CONTEXT_DERIVED_TOTAL") return 3;

  const hasNonHalfFinal = args.solution.some((value) => !isIntegerOrHalf(value));
  if (args.paper === "P1" && hasNonHalfFinal) return 3;

  const hasFractionalFinal = args.solution.some((value) => !Number.isInteger(value));
  if (!hasFractionalFinal && args.score <= 25) return 1;
  if (args.score <= 35) return 2;
  return 3;
};

const acceptedAssessment = (
  valid: boolean,
  requestedDifficulty: A8GeneratorDifficulty,
  signals: string[],
  args: {
    family: A8GeneratorFamily;
    paper: A8GeneratorPaper;
    equations: [A8LinearEquation, A8LinearEquation];
    solution: [number, number];
    route: A8CalibratedRoute;
    context: A8GeneratedContext | null;
    substitution: A8SubstitutionProfile;
  },
): A8FidelityAssessment => {
  const components = difficultyComponents(args);
  const score = componentTotal(components);
  const classifiedDifficulty = classifyDifficulty({
    family: args.family,
    paper: args.paper,
    solution: args.solution,
    score,
  });
  const componentSignals = [
    `family burden ${components.familyBurden}`,
    `scaling burden ${components.scalingBurden}`,
    `scaled-number burden ${components.scaledMagnitudeBurden}`,
    `sign burden ${components.signBurden}`,
    `decimal burden ${components.decimalBurden}`,
    `substitution burden ${components.substitutionBurden}`,
    `post-solve burden ${components.postSolveBurden}`,
    `classified L${classifiedDifficulty} from total burden ${score}/100`,
  ];

  return {
    accepted: valid && classifiedDifficulty === requestedDifficulty,
    classifiedDifficulty,
    difficultyScore: score,
    difficultyComponents: components,
    signals: [...signals, ...componentSignals],
    substitution: args.substitution,
  };
};

export const assessA8CandidateFidelity = (args: {
  difficulty: A8GeneratorDifficulty;
  paper: A8GeneratorPaper;
  family: A8GeneratorFamily;
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  route: A8CalibratedRoute;
  context: A8GeneratedContext | null;
}): A8FidelityAssessment => {
  const substitution = substitutionProfile(args.route, args.equations);
  const common = { ...args, substitution };
  const coefficients = args.equations.flatMap((equation) => [equation.a, equation.b]);

  if (args.context) {
    const contextualRowsCoprime = args.equations.every((equation) => coefficientGcd(equation) === 1);
    if (!contextualRowsCoprime) {
      return acceptedAssessment(
        false,
        args.difficulty,
        ["A contextual equation has a common coefficient factor."],
        common,
      );
    }
  }

  if (args.family === "ABSTRACT_SOLVE") {
    const valid =
      args.paper === "P1" &&
      args.solution.every(isIntegerOrHalf);
    return acceptedAssessment(
      valid,
      args.difficulty,
      ["abstract three-mark solve", "difficulty derives from the actual written route rather than a coefficient bucket"],
      common,
    );
  }

  if (args.family === "GRAPH_INTERSECTION_SOLVE") {
    const valid =
      args.paper === "P1" &&
      args.solution.every((value) => value > 0 && isIntegerOrHalf(value)) &&
      coefficients.some((value) => Math.abs(value) === 1);
    return acceptedAssessment(
      valid,
      args.difficulty,
      ["graph representation adds structural demand", "graph family is upper-valid only"],
      common,
    );
  }

  if (!args.context) {
    return acceptedAssessment(
      false,
      args.difficulty,
      ["Contextual family is missing contextual state."],
      common,
    );
  }

  if (args.family === "CONTEXT_DERIVED_TOTAL") {
    const valid =
      args.paper === "P2" &&
      args.context.contextKind === "MASS" &&
      args.solution.every((value) => value >= 40 && isMultipleOf(value, 10)) &&
      args.context.derivedTotal !== undefined &&
      isMultipleOf(args.context.derivedTotal, 10);
    return acceptedAssessment(
      valid,
      args.difficulty,
      ["large round exact mass values", "supported post-solve derived-total stage", "derived-total family is upper-valid only"],
      common,
    );
  }

  if (args.paper === "P1" && args.context.contextKind === "RESOURCE") {
    const workingValues = [
      ...args.solution,
      args.context.firstTotal,
      args.context.secondTotal,
      ...args.route.scaledConstants,
      args.route.remainingConstant,
      substitution.knownContribution,
      substitution.numerator,
      substitution.solvedValue,
    ];
    if (!workingValues.every(hasAtMostOneDecimal)) {
      return acceptedAssessment(
        false,
        args.difficulty,
        ["Paper 1 resource arithmetic exceeds one decimal place."],
        common,
      );
    }

    const nonHalfValues = args.solution.filter((value) => !isIntegerOrHalf(value));
    const routeSolvesNonHalfDirectly = nonHalfValues.every(
      (value) => close(value, args.route.solvedValue) && Math.abs(args.route.remainingCoefficient) === 1,
    );
    const substitutionFractionFriendly =
      Number.isInteger(substitution.solvedValue) ||
      (isIntegerOrHalf(substitution.solvedValue) && Math.abs(substitution.unknownCoefficient) <= 2);
    const valid = routeSolvesNonHalfDirectly && substitutionFractionFriendly;
    return acceptedAssessment(
      valid,
      args.difficulty,
      valid
        ? ["resource modelling", "Paper 1 decimal arithmetic follows a deliberately hand-friendly route"]
        : ["A Paper 1 decimal would arise from an atypically awkward division."],
      common,
    );
  }

  if (args.paper === "P1" && args.context.contextKind === "MASS") {
    const values = [
      ...args.solution,
      args.context.firstTotal,
      args.context.secondTotal,
      ...args.route.scaledConstants,
    ];
    const valid =
      values.every(Number.isInteger) &&
      args.solution.every((value) => isMultipleOf(value, 5)) &&
      values
        .filter((value) => Math.abs(value) > 100)
        .every((value) => isMultipleOf(value, 5));
    return acceptedAssessment(
      valid,
      args.difficulty,
      ["round whole-number mass model", "difficulty rises with the size of the scaled written arithmetic"],
      common,
    );
  }

  if (args.paper === "P2" && args.context.contextKind === "PURCHASE") {
    const moneyValues = [
      ...args.solution,
      args.context.firstTotal,
      args.context.secondTotal,
    ];
    const valid = moneyValues.every(hasAtMostTwoDecimals);
    return acceptedAssessment(
      valid,
      args.difficulty,
      ["exact currency arithmetic", "fractional prices and decimal working increase burden inside the calculator-paper envelope"],
      common,
    );
  }

  return acceptedAssessment(
    false,
    args.difficulty,
    ["Context/paper combination is outside the calibrated A8 family envelope."],
    common,
  );
};
