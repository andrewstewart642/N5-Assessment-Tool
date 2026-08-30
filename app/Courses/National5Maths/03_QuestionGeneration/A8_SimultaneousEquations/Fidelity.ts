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

export type A8FidelityAssessment = {
  accepted: boolean;
  difficultyScore: number;
  signals: string[];
  substitution: A8SubstitutionProfile;
};

const substitutionProfile = (
  route: A8CalibratedRoute,
  equations: [A8LinearEquation, A8LinearEquation],
): A8SubstitutionProfile => {
  const knownVariable = route.eliminatedVariable === "FIRST" ? "SECOND" : "FIRST";
  const unknownVariable = knownVariable === "FIRST" ? "SECOND" : "FIRST";
  const knownValue = route.solvedValue;

  const candidates = equations.map((equation, equationIndex) => {
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
      arithmeticScore: Math.abs(unknownCoefficient) * 2 + decimalPenalty + Math.abs(numerator) * 0.02,
    };
  });

  return candidates.sort((first, second) => first.arithmeticScore - second.arithmeticScore)[0];
};

const generalDifficultyScore = (args: {
  family: A8GeneratorFamily;
  equations: [A8LinearEquation, A8LinearEquation];
  solution: [number, number];
  route: A8CalibratedRoute;
  context: A8GeneratedContext | null;
  substitution: A8SubstitutionProfile;
}) => {
  const coefficients = args.equations.flatMap((equation) => [equation.a, equation.b]);
  const maxCoefficient = Math.max(...coefficients.map(Math.abs));
  const negativeCoefficientCount = coefficients.filter((value) => value < 0).length;
  const negativeConstantCount = args.equations.filter((equation) => equation.c < 0).length;
  const maxScaledConstant = Math.max(...args.route.scaledConstants);
  const halfIntegerCount = args.solution.filter(
    (value) => !Number.isInteger(value) && isIntegerOrHalf(value),
  ).length;
  const nonHalfDecimalCount = args.solution.filter(
    (value) => !Number.isInteger(value) && !isIntegerOrHalf(value),
  ).length;

  let score =
    8 +
    maxCoefficient * 2.5 +
    Math.max(...args.route.multipliers) * 3 +
    Math.min(maxScaledConstant / 8, 22) +
    negativeCoefficientCount * 4 +
    negativeConstantCount * 2 +
    halfIntegerCount * 7 +
    nonHalfDecimalCount * 8 +
    Math.min(args.substitution.arithmeticScore, 12);

  if (args.family === "GRAPH_INTERSECTION_SOLVE") score += 10;
  if (args.context) score += 5;
  if (args.family === "CONTEXT_DERIVED_TOTAL") score += 15;
  return Math.round(score * 10) / 10;
};

const acceptedAssessment = (
  accepted: boolean,
  signals: string[],
  args: Parameters<typeof generalDifficultyScore>[0],
): A8FidelityAssessment => ({
  accepted,
  difficultyScore: generalDifficultyScore(args),
  signals,
  substitution: args.substitution,
});

/**
 * A8 fidelity is deliberately family-specific. Difficulty is produced by the
 * arithmetic/representation burden already evidenced in that family; the
 * generator must not manufacture extra mathematical stages simply to create a
 * higher level.
 */
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
  const maxCoefficient = Math.max(...coefficients.map(Math.abs));
  const maxScaledConstant = Math.max(...args.route.scaledConstants);
  const maxMultiplier = Math.max(...args.route.multipliers);
  const negativeCoefficient = coefficients.some((value) => value < 0);
  const negativeConstant = args.equations.some((equation) => equation.c < 0);
  const maxSolutionMagnitude = Math.max(...args.solution.map(Math.abs));
  const signals: string[] = [];

  if (args.context && args.context.firstCounts) {
    const contextualRowsCoprime = args.equations.every((equation) => coefficientGcd(equation) === 1);
    if (!contextualRowsCoprime) {
      return acceptedAssessment(false, ["A contextual equation has a common coefficient factor."], common);
    }
  }

  if (args.family === "ABSTRACT_SOLVE") {
    const allIntegers = args.solution.every(Number.isInteger);
    const allIntegerOrHalf = args.solution.every(isIntegerOrHalf);
    const hasHalfInteger = args.solution.some((value) => !Number.isInteger(value));

    if (args.difficulty === 1) {
      const accepted =
        allIntegers &&
        maxCoefficient <= 5 &&
        maxScaledConstant <= 24 &&
        maxSolutionMagnitude <= 4 &&
        !negativeCoefficient;
      signals.push("small integer solution pair", "maximum coefficient 5", "compact 2-and-3 written scaling");
      return acceptedAssessment(accepted, signals, common);
    }

    if (args.difficulty === 2) {
      const centralSignal =
        maxCoefficient >= 5 ||
        negativeCoefficient ||
        negativeConstant ||
        maxScaledConstant >= 20 ||
        maxSolutionMagnitude >= 4;
      const accepted =
        allIntegers &&
        maxCoefficient <= 6 &&
        maxScaledConstant <= 32 &&
        centralSignal;
      signals.push("integer outcomes", "central historical coefficient/scaling burden");
      if (negativeCoefficient || negativeConstant) signals.push("controlled sign management");
      return acceptedAssessment(accepted, signals, common);
    }

    const upperSignal =
      hasHalfInteger ||
      maxScaledConstant >= 28 ||
      (maxCoefficient >= 6 && (negativeCoefficient || negativeConstant || maxSolutionMagnitude >= 5));
    const accepted = allIntegerOrHalf && maxScaledConstant <= 34 && upperSignal;
    signals.push("upper historical abstract burden");
    if (hasHalfInteger) signals.push("supported half-integer outcome");
    if (negativeCoefficient || negativeConstant) signals.push("sign management");
    if (maxCoefficient >= 6) signals.push("upper-range coefficient");
    return acceptedAssessment(accepted, signals, common);
  }

  if (args.family === "GRAPH_INTERSECTION_SOLVE") {
    const maxCoordinate = Math.max(...args.solution.map(Math.abs));
    const baseValid =
      args.paper === "P1" &&
      args.solution.every((value) => value > 0 && isIntegerOrHalf(value)) &&
      coefficients.some((value) => Math.abs(value) === 1);
    if (args.difficulty === 2) {
      const accepted = baseValid && maxCoefficient <= 3 && maxCoordinate <= 5.5;
      return acceptedAssessment(accepted, ["graph representation", "moderate half-integer intersection"], common);
    }
    const upperSignal = maxCoefficient >= 4 || maxCoordinate >= 5.5 || maxScaledConstant >= 20;
    return acceptedAssessment(
      baseValid && upperSignal,
      ["graph representation", "upper graph arithmetic/coordinate burden"],
      common,
    );
  }

  if (!args.context) {
    return acceptedAssessment(false, ["Contextual family is missing contextual state."], common);
  }

  if (args.family === "CONTEXT_DERIVED_TOTAL") {
    const accepted =
      args.difficulty === 3 &&
      args.paper === "P2" &&
      args.context.contextKind === "MASS" &&
      args.solution.every((value) => value >= 40 && isMultipleOf(value, 10)) &&
      args.context.derivedTotal !== undefined &&
      isMultipleOf(args.context.derivedTotal, 10);
    return acceptedAssessment(
      accepted,
      ["large round exact mass values", "supported post-solve derived-total stage"],
      common,
    );
  }

  if (args.paper === "P1" && args.context.contextKind === "RESOURCE") {
    const allOneDecimal = [
      ...args.solution,
      args.context.firstTotal,
      args.context.secondTotal,
      ...args.route.scaledConstants,
      args.route.remainingConstant,
      substitution.knownContribution,
      substitution.numerator,
      substitution.solvedValue,
    ].every(hasAtMostOneDecimal);
    if (!allOneDecimal) {
      return acceptedAssessment(false, ["Paper 1 resource arithmetic exceeds one decimal place."], common);
    }

    const nonHalfValues = args.solution.filter((value) => !isIntegerOrHalf(value));
    const routeSolvesNonHalfDirectly = nonHalfValues.every(
      (value) => close(value, args.route.solvedValue) && Math.abs(args.route.remainingCoefficient) === 1,
    );
    const substitutionFractionFriendly =
      Number.isInteger(substitution.solvedValue) ||
      (isIntegerOrHalf(substitution.solvedValue) && Math.abs(substitution.unknownCoefficient) <= 2);
    if (!routeSolvesNonHalfDirectly || !substitutionFractionFriendly) {
      return acceptedAssessment(
        false,
        ["A Paper 1 decimal would arise from an atypically awkward division."],
        common,
      );
    }

    if (args.difficulty === 1) {
      const accepted =
        args.solution.every(isIntegerOrHalf) &&
        maxCoefficient <= 5 &&
        maxMultiplier <= 3 &&
        maxScaledConstant <= 35;
      return acceptedAssessment(
        accepted,
        ["resource model retained", "integer/half-unit values", "compact written decimal arithmetic"],
        common,
      );
    }

    if (args.difficulty === 2) {
      const centralSignal = maxCoefficient >= 5 || maxScaledConstant >= 25 || nonHalfValues.length === 1;
      const accepted = maxScaledConstant <= 55 && centralSignal;
      return acceptedAssessment(
        accepted,
        ["resource modelling", "controlled one-decimal arithmetic", "typical written elimination burden"],
        common,
      );
    }

    const upperSignal =
      maxMultiplier >= 4 ||
      maxCoefficient >= 6 ||
      maxScaledConstant >= 40 ||
      (nonHalfValues.length === 1 && maxCoefficient >= 5);
    return acceptedAssessment(
      maxScaledConstant <= 80 && upperSignal,
      ["resource modelling", "upper but hand-calculable one-decimal burden"],
      common,
    );
  }

  if (args.paper === "P1" && args.context.contextKind === "MASS") {
    const values = [...args.solution, args.context.firstTotal, args.context.secondTotal, ...args.route.scaledConstants];
    if (!values.every(Number.isInteger) || !args.solution.every((value) => isMultipleOf(value, 5))) {
      return acceptedAssessment(false, ["Paper 1 mass values are not deliberately round whole numbers."], common);
    }
    const maxTotal = Math.max(args.context.firstTotal, args.context.secondTotal);
    const largeValuesRound = values.filter((value) => Math.abs(value) > 100).every((value) => isMultipleOf(value, 5));
    if (!largeValuesRound) {
      return acceptedAssessment(false, ["Large Paper 1 mass arithmetic is not round enough for written work."], common);
    }

    if (args.difficulty === 1) {
      const accepted = maxCoefficient <= 5 && maxTotal <= 180 && maxScaledConstant <= 500 && maxMultiplier <= 3;
      return acceptedAssessment(accepted, ["small round whole-number mass model", "compact written route"], common);
    }
    if (args.difficulty === 2) {
      const centralSignal = maxTotal >= 150 || maxMultiplier >= 4 || maxCoefficient >= 6;
      const accepted = maxTotal <= 260 && maxScaledConstant <= 900 && centralSignal;
      return acceptedAssessment(accepted, ["round whole-number mass model", "typical larger written products"], common);
    }
    const upperSignal = maxTotal >= 240 || (maxMultiplier >= 4 && maxCoefficient >= 6);
    return acceptedAssessment(
      maxTotal <= 350 && maxScaledConstant <= 1100 && upperSignal,
      ["large but round Paper 1 arithmetic", "upper calibrated written burden"],
      common,
    );
  }

  if (args.paper === "P2" && args.context.contextKind === "PURCHASE") {
    const moneyValues = [...args.solution, args.context.firstTotal, args.context.secondTotal];
    if (!moneyValues.every(hasAtMostTwoDecimals)) {
      return acceptedAssessment(false, ["Currency values exceed exact hundredths."], common);
    }
    const maxTotal = Math.max(args.context.firstTotal, args.context.secondTotal);

    if (args.difficulty === 1) {
      const accepted =
        args.solution.every((value) => isMultipleOf(value, 0.5)) &&
        maxCoefficient <= 4 &&
        maxScaledConstant <= 120;
      return acceptedAssessment(accepted, ["simple half-pound price texture", "compact calculator-paper route"], common);
    }

    if (args.difficulty === 2) {
      const centralSignal =
        args.solution.some((value) => !isMultipleOf(value, 0.5)) ||
        maxCoefficient >= 5 ||
        maxScaledConstant >= 80;
      const accepted = maxScaledConstant <= 300 && centralSignal;
      return acceptedAssessment(accepted, ["exact currency arithmetic", "typical calculator-paper elimination burden"], common);
    }

    const upperSignal =
      args.solution.some((value) => !isMultipleOf(value, 0.25)) ||
      maxTotal >= 60 ||
      maxScaledConstant >= 180;
    return acceptedAssessment(
      maxScaledConstant <= 500 && upperSignal,
      ["exact hundredths permitted", "upper calculator-paper arithmetic within historical texture"],
      common,
    );
  }

  return acceptedAssessment(false, ["Context/paper combination is outside the calibrated A8 family envelope."], common);
};
