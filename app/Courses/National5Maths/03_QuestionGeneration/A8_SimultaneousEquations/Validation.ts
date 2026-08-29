import type { A8GeneratedQuestion, A8LinearEquation, A8ValidationResult } from "./Types";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const satisfies = (equation: A8LinearEquation, solution: [number, number]) =>
  close(equation.a * solution[0] + equation.b * solution[1], equation.c);

export const validateA8GeneratedQuestion = (question: A8GeneratedQuestion): A8ValidationResult => {
  const issues: A8ValidationResult["issues"] = [];
  if (question.determinant === 0) issues.push({ severity: "ERROR", code: "ZERO_DETERMINANT", message: "Generated equations are not independent." });
  if (!satisfies(question.equations[0], question.solution) || !satisfies(question.equations[1], question.solution)) {
    issues.push({ severity: "ERROR", code: "SOLUTION_MISMATCH", message: "The intended solution does not satisfy both generated equations." });
  }
  if (!question.eliminationPlans.some((plan) => plan.firstMultiplier > 1 || plan.secondMultiplier > 1)) {
    issues.push({ severity: "ERROR", code: "NO_SCALING_REQUIRED", message: "The generated system does not require the coefficient-scaling step consistently observed in the A8 corpus." });
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
      if (x <= 0 || y <= 0) issues.push({ severity: "ERROR", code: "NEGATIVE_CONTEXT_VALUE", message: "Generated contextual unit values must be positive." });
      if (question.family === "CONTEXT_DERIVED_TOTAL") {
        if (!question.context.derivedCounts || question.context.derivedTotal === undefined) {
          issues.push({ severity: "ERROR", code: "MISSING_DERIVED_TARGET", message: "Derived-total family is missing its third relationship." });
        } else {
          const expected = question.context.derivedCounts[0] * x + question.context.derivedCounts[1] * y;
          if (!close(expected, question.context.derivedTotal)) issues.push({ severity: "ERROR", code: "DERIVED_TOTAL_MISMATCH", message: "The derived target does not agree with the solved values." });
        }
      }
    }
  }
  if (question.family === "GRAPH_INTERSECTION_SOLVE") {
    if (!question.visual) issues.push({ severity: "ERROR", code: "MISSING_GRAPH_SPEC", message: "Graph-intersection family requires a procedural graph specification." });
    else if (!close(question.visual.intersection[0], question.solution[0]) || !close(question.visual.intersection[1], question.solution[1])) {
      issues.push({ severity: "ERROR", code: "GRAPH_INTERSECTION_MISMATCH", message: "The visual intersection does not match the algebraic solution." });
    }
  }
  if (question.paper === "P1") {
    const awkward = [...question.solution, question.equations[0].c, question.equations[1].c].some((value) => {
      const doubled = value * 2;
      return !Number.isInteger(value) && !Number.isInteger(doubled);
    });
    if (awkward) issues.push({ severity: "WARNING", code: "P1_ARITHMETIC_BURDEN", message: "A Paper 1 instance contains values more awkward than integers or half-integers." });
  }
  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};
