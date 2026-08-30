import {
  a8DifficultyBand,
  a8FamilySupportsDifficulty,
  historicalA8SystemOverlap,
  selectCalibratedA8Route,
} from "./Calibration";
import {
  A8_EMPIRICAL_FAMILY_FREQUENCY,
  A8_PAPER_NUMERICAL_CALIBRATION,
} from "./Evidence";
import type { A8GeneratedQuestion, A8LinearEquation, A8ValidationResult } from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const coefficientGcd = (equation: A8LinearEquation) =>
  gcd(Math.abs(Math.round(equation.a)), Math.abs(Math.round(equation.b)));
const obviouslyReducible = (equation: A8LinearEquation) =>
  Number.isInteger(equation.c) &&
  gcd(coefficientGcd(equation), Math.abs(Math.round(equation.c))) > 1;
const satisfies = (equation: A8LinearEquation, solution: [number, number]) =>
  close(equation.a * solution[0] + equation.b * solution[1], equation.c);
const hasAtMostOneDecimal = (value: number) => close(value * 10, Math.round(value * 10));
const hasAtMostTwoDecimals = (value: number) => close(value * 100, Math.round(value * 100));
const isIntegerOrHalf = (value: number) => close(value * 2, Math.round(value * 2));
const isMultipleOf = (value: number, step: number) => close(value / step, Math.round(value / step));

export const validateA8GeneratedQuestion = (question: A8GeneratedQuestion): A8ValidationResult => {
  const issues: A8ValidationResult["issues"] = [];
  const [first, second] = question.equations;
  const coefficients = [first.a, first.b, second.a, second.b];
  const contextual = question.family === "CONTEXT_FORM_AND_SOLVE" || question.family === "CONTEXT_DERIVED_TOTAL";
  const band = a8DifficultyBand(question.difficulty);

  if (!a8FamilySupportsDifficulty(question.family, question.difficulty)) {
    issues.push({
      severity: "ERROR",
      code: "UNSUPPORTED_FAMILY_DIFFICULTY",
      message: `${question.family} is not supported at calibrated A8 difficulty ${question.difficulty}.`,
    });
  }

  if (question.quality.difficultyBandId !== band.id) {
    issues.push({
      severity: "ERROR",
      code: "DIFFICULTY_BAND_MISMATCH",
      message: "Stored A8 quality metadata does not match the calibrated difficulty band.",
    });
  }

  const observedFrequency = A8_EMPIRICAL_FAMILY_FREQUENCY[question.paper]
    .find((cell) => cell.family === question.family);
  if (
    !observedFrequency ||
    observedFrequency.count === 0 ||
    question.quality.familyObservedCount !== observedFrequency.count ||
    question.quality.familyObservedTotal !== observedFrequency.total
  ) {
    issues.push({
      severity: "ERROR",
      code: "FAMILY_FREQUENCY_MISMATCH",
      message: "Generated family metadata does not agree with the paper-conditioned A8 corpus frequency.",
    });
  }

  if (question.determinant === 0) {
    issues.push({ severity: "ERROR", code: "ZERO_DETERMINANT", message: "Generated equations are not independent." });
  }

  if (!satisfies(first, question.solution) || !satisfies(second, question.solution)) {
    issues.push({ severity: "ERROR", code: "SOLUTION_MISMATCH", message: "The intended solution does not satisfy both generated equations." });
  }

  if (historicalA8SystemOverlap(question.equations)) {
    issues.push({
      severity: "ERROR",
      code: "HISTORICAL_SYSTEM_OVERLAP",
      message: "Generated equations are mathematically equivalent to a catalogued historical A8 system.",
    });
  }

  if (first.c === 0 || second.c === 0 || close(first.c, second.c)) {
    issues.push({
      severity: "ERROR",
      code: "ATYPICAL_CONSTANT_PATTERN",
      message: "Generated constants create an atypically revealing or degenerate A8 surface.",
    });
  }

  if (obviouslyReducible(first) || obviouslyReducible(second)) {
    issues.push({
      severity: "ERROR",
      code: "REDUCIBLE_EQUATION",
      message: "A generated equation can be divided through by a common whole-number factor before the intended A8 process.",
    });
  }

  if (Math.abs(first.a) === Math.abs(first.b) || Math.abs(second.a) === Math.abs(second.b)) {
    issues.push({
      severity: "ERROR",
      code: "EQUAL_ROW_COEFFICIENTS",
      message: "A generated row has equal coefficient magnitudes, outside the reviewed A8 number style.",
    });
  }

  if (question.family !== "GRAPH_INTERSECTION_SOLVE") {
    if (coefficients.some((value) => Math.abs(value) < 2)) {
      issues.push({
        severity: "ERROR",
        code: "TRIVIAL_SUBSTITUTION_COEFFICIENT",
        message: "Non-graph A8 families should not introduce a coefficient of 0 or ±1.",
      });
    }
    if (Math.abs(first.a) === Math.abs(second.a) || Math.abs(first.b) === Math.abs(second.b)) {
      issues.push({
        severity: "ERROR",
        code: "FREE_ELIMINATION_ROUTE",
        message: "A non-graph A8 system can eliminate a variable without the calibrated scaling stage.",
      });
    }
  }

  const calibratedRoute = selectCalibratedA8Route(
    question.eliminationPlans,
    question.family,
    question.paper,
    question.difficulty,
  );
  if (!calibratedRoute) {
    issues.push({
      severity: "ERROR",
      code: "NO_CALIBRATED_ROUTE",
      message: "No elimination route matches the scaling patterns supported by the A8 cross-corpus calibration.",
    });
  } else {
    const stored = question.quality.calibratedRoute;
    if (
      stored.eliminatedVariable !== calibratedRoute.eliminatedVariable ||
      stored.multipliers[0] !== calibratedRoute.multipliers[0] ||
      stored.multipliers[1] !== calibratedRoute.multipliers[1] ||
      !close(stored.remainingCoefficient, calibratedRoute.remainingCoefficient) ||
      !close(stored.remainingConstant, calibratedRoute.remainingConstant)
    ) {
      issues.push({
        severity: "ERROR",
        code: "CALIBRATED_ROUTE_DIAGNOSTIC_MISMATCH",
        message: "Stored route diagnostics do not match the calibrated cheapest route.",
      });
    }
  }

  if (question.family === "ABSTRACT_SOLVE") {
    const observed = A8_PAPER_NUMERICAL_CALIBRATION.P1.abstract;
    const negativeSolutions = question.solution.filter((value) => value < 0).length;
    if (question.paper !== "P1") {
      issues.push({ severity: "ERROR", code: "ABSTRACT_PAPER_SCOPE", message: "The reviewed A8 abstract family has Paper 1 evidence only." });
    }
    if (negativeSolutions !== 1) {
      issues.push({ severity: "ERROR", code: "ABSTRACT_SIGN_PROFILE", message: "Abstract A8 generation should retain one positive and one negative solution." });
    }
    if (![first.c, second.c].every(Number.isInteger)) {
      issues.push({ severity: "ERROR", code: "P1_ABSTRACT_CONSTANTS", message: "Paper 1 abstract systems should present whole-number constants." });
    }
    if ([first.c, second.c].some((value) => {
      const absolute = Math.abs(value);
      return absolute < observed.absoluteConstantRangeObserved[0] || absolute > observed.absoluteConstantRangeObserved[1];
    })) {
      issues.push({ severity: "ERROR", code: "ABSTRACT_CONSTANT_ENVELOPE", message: "Abstract constants fall outside the observed Paper 1 A8 range." });
    }
    if (question.quality.largestScaledConstant > observed.preferredScaledConstantMaximumObserved) {
      issues.push({ severity: "ERROR", code: "ABSTRACT_SCALED_CONSTANT_ENVELOPE", message: "The calibrated abstract route exceeds the observed scaled-constant burden." });
    }
    if (question.difficulty < 3 && !question.solution.every(Number.isInteger)) {
      issues.push({ severity: "ERROR", code: "LOWER_BAND_HALF_INTEGER", message: "Half-integer abstract outcomes are reserved for the upper calibrated A8 band." });
    }
    if (question.difficulty === 3 && !question.solution.every(isIntegerOrHalf)) {
      issues.push({ severity: "ERROR", code: "UPPER_BAND_FRACTION_TEXTURE", message: "Upper-band abstract outcomes must remain integer or half-integer." });
    }
  }

  if (contextual) {
    if (!question.context) {
      issues.push({ severity: "ERROR", code: "MISSING_CONTEXT", message: "A contextual family was generated without contextual state." });
    } else {
      const context = question.context;
      const [x, y] = question.solution;
      const [a, b] = context.firstCounts;
      const [d, e] = context.secondCounts;

      if (!close(a * x + b * y, context.firstTotal) || !close(d * x + e * y, context.secondTotal)) {
        issues.push({ severity: "ERROR", code: "CONTEXT_TOTAL_MISMATCH", message: "A contextual total is not derived from the generated unknown values." });
      }
      if (x <= 0 || y <= 0) {
        issues.push({ severity: "ERROR", code: "NEGATIVE_CONTEXT_VALUE", message: "Generated contextual unit values must be positive." });
      }
      if (question.quality.contextPoolSize < 60) {
        issues.push({ severity: "ERROR", code: "CONTEXT_POOL_TOO_SMALL", message: "The A8 contextual generator should expose at least 60 curated semantic contexts." });
      }
      if (!question.quality.contextId || question.quality.contextId !== context.contextId) {
        issues.push({ severity: "ERROR", code: "CONTEXT_DIAGNOSTIC_MISMATCH", message: "The quality profile is not attached to the generated contextual shell." });
      }

      if (question.family === "CONTEXT_FORM_AND_SOLVE" && question.paper === "P2") {
        if (context.contextKind !== "PURCHASE" || context.unitDimension !== "currency") {
          issues.push({ severity: "ERROR", code: "P2_CONTEXT_TEXTURE", message: "Normal Paper 2 A8 contexts should use the observed purchase/currency family texture." });
        }
        if (![x, y, context.firstTotal, context.secondTotal].every(hasAtMostTwoDecimals)) {
          issues.push({ severity: "ERROR", code: "P2_CURRENCY_PRECISION", message: "Paper 2 currency generation must stay within exact hundredths." });
        }
      }

      if (question.paper === "P1" && context.contextKind === "MASS") {
        if (![x, y, context.firstTotal, context.secondTotal].every(Number.isInteger)) {
          issues.push({ severity: "ERROR", code: "P1_MASS_INTEGER_PROFILE", message: "Paper 1 mass contexts should use whole-number arithmetic." });
        }
        const largeValues = [context.firstTotal, context.secondTotal, question.quality.largestScaledConstant]
          .filter((value) => Math.abs(value) > 100);
        if (!largeValues.every((value) => isMultipleOf(value, 5))) {
          issues.push({ severity: "ERROR", code: "P1_MASS_ROUNDNESS", message: "Large Paper 1 mass arithmetic must remain deliberately round and hand-friendly." });
        }
      }

      if (question.paper === "P1" && context.contextKind === "RESOURCE") {
        if (![x, y, context.firstTotal, context.secondTotal, question.quality.largestScaledConstant].every(hasAtMostOneDecimal)) {
          issues.push({ severity: "ERROR", code: "P1_RESOURCE_DECIMAL_PROFILE", message: "Paper 1 resource-use contexts should remain within simple one-decimal written arithmetic." });
        }
      }

      for (const label of ["(a)", "(b)", "(c)"]) {
        if (!question.prompt.includes(label)) {
          issues.push({ severity: "ERROR", code: "MISSING_PART_LABEL", message: `Contextual prompt is missing ${label}.` });
        }
      }

      const disallowedSurfacePhrases = [
        "token pack",
        "first display contains",
        "second display contains",
        "first order contains",
        "second order contains",
      ];
      if (disallowedSurfacePhrases.some((phrase) => question.prompt.toLowerCase().includes(phrase))) {
        issues.push({ severity: "ERROR", code: "SEMANTIC_CONTEXT_FAILURE", message: "The generated context has fallen back to an implausible generic noun-template surface." });
      }

      if (question.family === "CONTEXT_DERIVED_TOTAL") {
        if (question.paper !== "P2" || context.contextKind !== "MASS") {
          issues.push({ severity: "ERROR", code: "DERIVED_CONTEXT_SCOPE", message: "The derived-total family is calibrated to Paper 2 mass/load contexts." });
        }
        if (!context.derivedCounts || context.derivedTotal === undefined) {
          issues.push({ severity: "ERROR", code: "MISSING_DERIVED_TARGET", message: "Derived-total family is missing its third relationship." });
        } else {
          const expected = context.derivedCounts[0] * x + context.derivedCounts[1] * y;
          if (!close(expected, context.derivedTotal)) {
            issues.push({ severity: "ERROR", code: "DERIVED_TOTAL_MISMATCH", message: "The derived target does not agree with the solved values." });
          }
          if (![x, y, context.derivedTotal].every((value) => isMultipleOf(value, 10))) {
            issues.push({ severity: "ERROR", code: "DERIVED_ROUND_INTEGER_PROFILE", message: "Derived-total values should retain the observed large round exact-number texture." });
          }
        }
      }
    }
  }

  if (question.family === "GRAPH_INTERSECTION_SOLVE") {
    if (!question.visual) {
      issues.push({ severity: "ERROR", code: "MISSING_GRAPH_SPEC", message: "Graph-intersection family requires a procedural graph specification." });
    } else if (!close(question.visual.intersection[0], question.solution[0]) || !close(question.visual.intersection[1], question.solution[1])) {
      issues.push({ severity: "ERROR", code: "GRAPH_INTERSECTION_MISMATCH", message: "The visual intersection does not match the algebraic solution." });
    }
    if (!coefficients.some((value) => Math.abs(value) === 1)) {
      issues.push({ severity: "ERROR", code: "GRAPH_COEFFICIENT_PROFILE", message: "The graph family should retain the coefficient-1 feature supported by its single historical source." });
    }
  }

  if (question.paper === "P1" && question.quality.paperArithmeticProfile !== "P1_WRITTEN") {
    issues.push({ severity: "ERROR", code: "P1_ARITHMETIC_PROFILE", message: "Paper 1 generation must be classified against the written non-calculator route." });
  }

  const hasDisplayMath = question.promptParts.some((part) => part.kind === "math" && part.displayMode);
  if ((question.family === "ABSTRACT_SOLVE" || question.family === "GRAPH_INTERSECTION_SOLVE") && !hasDisplayMath) {
    issues.push({ severity: "ERROR", code: "MATH_PRESENTATION_MISSING", message: "Displayed equation systems should be represented as mathematical display parts rather than plain paragraph text." });
  }

  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};
