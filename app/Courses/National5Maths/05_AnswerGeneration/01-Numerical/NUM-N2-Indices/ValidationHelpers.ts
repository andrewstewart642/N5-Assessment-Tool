import type { N2GeneratorMechanism } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2AnswerValidationIssue, N2GeneratedMarkRole } from "./Types";

export const validationIssue = (
  code: string,
  message: string,
  severity: N2AnswerValidationIssue["severity"] = "ERROR",
): N2AnswerValidationIssue => ({ code, message, severity });

export const sameStrings = (first: readonly string[], second: readonly string[]) =>
  first.length === second.length && first.every((value, index) => value === second[index]);

export const N2_EXPECTED_MARK_ROLES: Record<N2GeneratorMechanism, readonly N2GeneratedMarkRole[]> = {
  FRACTIONAL_NUMERIC_EVALUATION: ["FRACTIONAL_INDEX_INTERPRETATION", "EXACT_NUMERICAL_EVALUATION"],
  PRODUCT_QUOTIENT_WITH_COEFFICIENT: ["NUMERATOR_PRODUCT_LAW", "COEFFICIENT_SIMPLIFICATION", "QUOTIENT_LAW"],
  POWER_OF_POWER_WITH_NEGATIVE_INDEX: ["POWER_OF_POWER", "SIGNED_EXPONENT_COMBINATION", "POSITIVE_POWER_CONVERSION"],
  RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX: ["ROOT_TO_FRACTIONAL_INDEX", "RECIPROCAL_TO_NEGATIVE_INDEX"],
  SQUARED_FRACTIONAL_MONOMIAL: ["POWERED_MONOMIAL_COMPONENT", "POWERED_MONOMIAL_COMPLETION"],
  PRODUCT_OVER_ROOT: ["NUMERATOR_PRODUCT_LAW", "ROOT_TO_FRACTIONAL_INDEX", "QUOTIENT_LAW"],
  NEGATIVE_INDEX_QUOTIENT: ["DENOMINATOR_PRODUCT_LAW", "QUOTIENT_LAW", "POSITIVE_POWER_CONVERSION"],
  DISTRIBUTIVE_INDEX_EXPANSION: ["DISTRIBUTIVE_INDEX_PRODUCT", "DISTRIBUTIVE_COMPLETION"],
  POSITIVE_POWER_PRODUCT_QUOTIENT: ["POWER_OF_POWER", "NUMERATOR_PRODUCT_LAW", "QUOTIENT_LAW"],
};
