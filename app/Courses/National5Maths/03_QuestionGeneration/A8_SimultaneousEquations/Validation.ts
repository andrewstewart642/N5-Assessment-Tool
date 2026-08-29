import type { A8GeneratedQuestion, A8LinearEquation, A8ValidationResult } from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const rowGcd = (equation: A8LinearEquation) => gcd(Math.abs(Math.round(equation.a)), Math.abs(Math.round(equation.b)));
const satisfies = (equation: A8LinearEquation, solution: [number, number]) =>
  close(equation.a * solution[0] + equation.b * solution[1], equation.c);
const hasAtMostOneDecimalPlace = (value: number) => close(value * 10, Math.round(value * 10));

export const validateA8GeneratedQuestion = (question: A8GeneratedQuestion): A8ValidationResult => {
  const issues: A8ValidationResult["issues"] = [];
  const [first, second] = question.equations;
  const coefficients = [first.a, first.b, second.a, second.b];

  if (question.determinant === 0) {
    issues.push({ severity: "ERROR", code: "ZERO_DETERMINANT", message: "Generated equations are not independent." });
  }

  if (!satisfies(first, question.solution) || !satisfies(second, question.solution)) {
    issues.push({ severity: "ERROR", code: "SOLUTION_MISMATCH", message: "The intended solution does not satisfy both generated equations." });
  }

  if (coefficients.some((value) => Math.abs(value) < 2)) {
    issues.push({ severity: "ERROR", code: "TRIVIAL_SUBSTITUTION_COEFFICIENT", message: "A coefficient of 0 or ±1 creates a route that is atypically easy for the reviewed A8 corpus." });
  }

  if (rowGcd(first) !== 1 || rowGcd(second) !== 1) {
    issues.push({ severity: "ERROR", code: "REDUCIBLE_EQUATION", message: "A generated equation has a common coefficient factor and could be simplified before the intended simultaneous-equation work." });
  }

  if (Math.abs(first.a) === Math.abs(first.b) || Math.abs(second.a) === Math.abs(second.b)) {
    issues.push({ severity: "ERROR", code: "EQUAL_ROW_COEFFICIENTS", message: "A generated row has equal coefficient magnitudes such as 5x + 5y, which is outside the desired A8 number style." });
  }

  if (Math.abs(first.a) === Math.abs(second.a) || Math.abs(first.b) === Math.abs(second.b)) {
    issues.push({ severity: "ERROR", code: "FREE_ELIMINATION_ROUTE", message: "A variable can be eliminated without a genuine coefficient-scaling step." });
  }

  if (!question.eliminationPlans.some((plan) => plan.firstMultiplier > 1 || plan.secondMultiplier > 1)) {
    issues.push({ severity: "ERROR", code: "NO_SCALING_REQUIRED", message: "The generated system does not require the coefficient-scaling step consistently observed in the A8 corpus." });
  }

  if (question.quality.rowCommonFactors.some((value) => value !== 1)) {
    issues.push({ severity: "ERROR", code: "QUALITY_COMMON_FACTOR", message: "The stored generation-quality profile reports a reducible equation." });
  }

  if (question.quality.minimumAbsoluteCoefficient < 2) {
    issues.push({ severity: "ERROR", code: "QUALITY_MIN_COEFFICIENT", message: "The stored generation-quality profile reports a coefficient below the allowed minimum." });
  }

  if (question.family === "ABSTRACT_SOLVE") {
    const negativeSolutions = question.solution.filter((value) => value < 0).length;
    if (negativeSolutions !== 1) {
      issues.push({ severity: "ERROR", code: "ABSTRACT_SIGN_PROFILE", message: "Core abstract A8 generation should contain one positive and one negative solution, matching the supplied abstract corpus profile." });
    }
  }

  if (question.family === "CONTEXT_FORM_AND_SOLVE" || question.family === "CONTEXT_DERIVED_TOTAL") {
    if (!question.context) {
      issues.push({ severity: "ERROR", code: "MISSING_CONTEXT", message: "A contextual family was generated without contextual state." });
    } else {
      const [x, y] = question.solution;
      const [a, b] = question.context.firstCounts;
      const [d, e] = question.context.secondCounts;

      if (!close(a * x + b * y, question.context.firstTotal) || !close(d * x + e * y, question.context.secondTotal)) {
        issues.push({ severity: "ERROR", code: "CONTEXT_TOTAL_MISMATCH", message: "A contextual total is not derived from the generated unknown values." });
      }

      if (x <= 0 || y <= 0) {
        issues.push({ severity: "ERROR", code: "NEGATIVE_CONTEXT_VALUE", message: "Generated contextual unit values must be positive." });
      }

      if (question.quality.contextPoolSize < 60) {
        issues.push({ severity: "ERROR", code: "CONTEXT_POOL_TOO_SMALL", message: "The A8 contextual generator should expose at least 60 curated semantic contexts." });
      }

      if (!question.quality.contextId || question.quality.contextId !== question.context.contextId) {
        issues.push({ severity: "ERROR", code: "CONTEXT_DIAGNOSTIC_MISMATCH", message: "The quality profile is not attached to the generated contextual shell." });
      }

      if (question.context.contextKind === "PURCHASE") {
        if (question.paper !== "P2" || question.context.unitDimension !== "currency") {
          issues.push({ severity: "ERROR", code: "PURCHASE_PAPER_PROFILE", message: "Generated purchase-price contexts are reserved for calculator-paper generation." });
        }
      }

      if (question.context.contextKind === "MASS") {
        if (![question.context.firstTotal, question.context.secondTotal, x, y].every(Number.isInteger)) {
          issues.push({ severity: "ERROR", code: "MASS_INTEGER_PROFILE", message: "Generated fixed-mass contexts should use whole-kilogram values throughout." });
        }
      }

      if (question.context.contextKind === "RESOURCE") {
        if (![question.context.firstTotal, question.context.secondTotal, x, y].every(hasAtMostOneDecimalPlace)) {
          issues.push({ severity: "ERROR", code: "RESOURCE_DECIMAL_PROFILE", message: "Generated resource-use contexts should stay within simple one-decimal written arithmetic." });
        }
      }

      const partLabels = ["(a)", "(b)", "(c)"];
      for (const label of partLabels) {
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
        if (question.context.contextKind !== "MASS") {
          issues.push({ severity: "ERROR", code: "DERIVED_CONTEXT_SCOPE", message: "The experimental derived-total family is currently restricted to evidence-near mass/load contexts." });
        }
        if (!question.context.derivedCounts || question.context.derivedTotal === undefined) {
          issues.push({ severity: "ERROR", code: "MISSING_DERIVED_TARGET", message: "Derived-total family is missing its third relationship." });
        } else {
          const expected = question.context.derivedCounts[0] * x + question.context.derivedCounts[1] * y;
          if (!close(expected, question.context.derivedTotal)) {
            issues.push({ severity: "ERROR", code: "DERIVED_TOTAL_MISMATCH", message: "The derived target does not agree with the solved values." });
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
  }

  if (question.paper === "P1") {
    if (question.quality.largestScaledCoefficient > 30 || question.quality.largestScaledConstant > 120) {
      issues.push({ severity: "ERROR", code: "P1_INTERMEDIATE_BURDEN", message: "A Paper 1 elimination route produces intermediate values beyond the intended written-arithmetic envelope." });
    }

    if (question.family === "ABSTRACT_SOLVE" || question.family === "GRAPH_INTERSECTION_SOLVE") {
      if (![first.c, second.c].every(Number.isInteger)) {
        issues.push({ severity: "ERROR", code: "P1_ABSTRACT_CONSTANTS", message: "Paper 1 abstract systems should present whole-number constants." });
      }
    }
  }

  const hasDisplayMath = question.promptParts.some((part) => part.kind === "math" && part.displayMode);
  if ((question.family === "ABSTRACT_SOLVE" || question.family === "GRAPH_INTERSECTION_SOLVE") && !hasDisplayMath) {
    issues.push({ severity: "ERROR", code: "MATH_PRESENTATION_MISSING", message: "Displayed equation systems should be represented as mathematical display parts rather than plain paragraph text." });
  }

  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};
