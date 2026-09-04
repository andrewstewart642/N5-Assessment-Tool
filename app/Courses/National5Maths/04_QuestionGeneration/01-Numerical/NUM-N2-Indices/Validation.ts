import {
  getN2MechanismProfile,
  historicalN2FractionalOverlap,
} from "./Calibration";
import { assessN2Difficulty } from "./Difficulty";
import {
  N2_GENERATOR_FRACTIONAL_ENVELOPE,
  N2_GENERATOR_SYMBOLIC_ENVELOPE,
} from "./Evidence";
import { addN2Exponents, reduceN2RationalExponent } from "./PromptGrammar";
import { n2SkillForMechanism } from "./SkillLabels";
import type {
  N2GeneratedQuestion,
  N2RationalExponent,
  N2ValidationIssue,
  N2ValidationResult,
} from "./Types";

const error = (issues: N2ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "ERROR", code, message });
const warning = (issues: N2ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "WARNING", code, message });

const sameRational = (first: N2RationalExponent, second: N2RationalExponent) => {
  const a = reduceN2RationalExponent(first.numerator, first.denominator);
  const b = reduceN2RationalExponent(second.numerator, second.denominator);
  return a.numerator === b.numerator && a.denominator === b.denominator;
};

const withinObservedExponentMagnitude = (values: readonly number[]) => {
  const max = N2_GENERATOR_SYMBOLIC_ENVELOPE.observedIntegerExponentMagnitude.max;
  return values.every((value) => Math.abs(value) <= max);
};

export const validateN2GeneratedQuestion = (question: N2GeneratedQuestion): N2ValidationResult => {
  const issues: N2ValidationIssue[] = [];
  const profile = getN2MechanismProfile(question.mechanism);
  const assessment = assessN2Difficulty(question.mathState, question.difficulty);
  const skill = n2SkillForMechanism(question.mechanism);

  if (question.skillId !== skill.id || question.skillLabel !== skill.label) {
    error(issues, "N2_SKILL_LABEL_DRIFT", "Generated public N2 skill label does not match the internal mechanism mapping.");
  }
  if (question.family !== profile.family || question.mathState.family !== profile.family) {
    error(issues, "N2_FAMILY_DRIFT", "Generated family does not match the calibrated mechanism family.");
  }
  if (question.mathState.mechanism !== question.mechanism) {
    error(issues, "N2_MECHANISM_DRIFT", "Generated mathematical state does not match the selected mechanism.");
  }
  if (!profile.supportedPapers.includes(question.paper)) {
    error(issues, "N2_UNSUPPORTED_PAPER", `${question.mechanism} has no reviewed mechanism-level support on ${question.paper}.`);
  }
  if (question.marks !== profile.marks || question.standardMarks.length !== profile.marks) {
    error(issues, "N2_MARK_TARIFF", "Generated tariff does not match the calibrated mechanism tariff.");
  }
  if (question.standardProfile !== profile.standardProfile || question.standardMarks.join("|") !== profile.standardMarks.join("|")) {
    error(issues, "N2_STANDARD_DRIFT", "Generated C/A profile does not match the calibrated mechanism profile.");
  }
  if (question.thinking !== "OPERATIONAL") {
    error(issues, "N2_THINKING", "N2 V1 generation is Operational only.");
  }
  if (assessment.difficulty !== question.difficulty) {
    error(issues, "N2_DIFFICULTY_DRIFT", "Generated difficulty does not match the requested instance band.");
  }
  if (question.quality.difficultyBandId !== assessment.bandId) {
    error(issues, "N2_DIFFICULTY_BAND_DRIFT", "Stored difficulty band does not match the instance assessment.");
  }
  if (!question.promptParts.length || !question.promptSections.length) {
    error(issues, "N2_PROMPT_EMPTY", "Generated N2 question has no renderable prompt content.");
  }
  if (!question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    error(issues, "N2_REFERENCE_MISSING", "Every generated N2 instance must expose a primary historical reference.");
  }

  const state = question.mathState;
  switch (state.mechanism) {
    case "FRACTIONAL_NUMERIC_EVALUATION": {
      if (!N2_GENERATOR_FRACTIONAL_ENVELOPE.observedRootIndices.includes(state.rootIndex)) {
        error(issues, "N2_FRACTIONAL_ROOT_INDEX", "Fractional evaluation uses an unsupported root index.");
      }
      if (state.base !== state.rootValue ** state.rootIndex || state.exactResult !== state.rootValue ** state.exponentNumerator) {
        error(issues, "N2_FRACTIONAL_EXACTNESS", "Stored fractional-index state is not an exact perfect-power evaluation.");
      }
      if (!Number.isInteger(state.exactResult) || state.exactResult <= 1 || state.exactResult > 625) {
        error(issues, "N2_FRACTIONAL_RESULT", "Fractional-index evaluation must finish at a controlled exact integer.");
      }
      if (question.difficulty === 1 && state.exactResult > 125) {
        error(issues, "N2_FRACTIONAL_LOWER_BAND", "Lower-band fractional evaluation should keep the exact result at 125 or below.");
      }
      if (question.difficulty === 2 && state.exactResult < 126) {
        error(issues, "N2_FRACTIONAL_UPPER_BAND", "Upper-band fractional evaluation should materially increase the exact-value burden.");
      }
      if (historicalN2FractionalOverlap(state)) {
        error(issues, "N2_HISTORICAL_OVERLAP", "Generated fractional evaluation reproduces a catalogued historical base/exponent pair.");
      }
      break;
    }
    case "PRODUCT_QUOTIENT_WITH_COEFFICIENT": {
      if (state.numeratorExponent !== state.firstExponent + state.secondExponent) {
        error(issues, "N2_PRODUCT_NUMERATOR", "Numerator exponent does not match the product law.");
      }
      if (state.coefficientNumerator % state.coefficientDenominator !== 0 || state.coefficientResult !== state.coefficientNumerator / state.coefficientDenominator) {
        error(issues, "N2_COEFFICIENT_REDUCTION", "Coefficient reduction is not an exact independent stage.");
      }
      if (state.finalExponent !== state.numeratorExponent - state.denominatorExponent || state.finalExponent <= 0) {
        error(issues, "N2_QUOTIENT_RESULT", "Final exponent does not match the quotient law or is not positive.");
      }
      if (!withinObservedExponentMagnitude([state.firstExponent, state.secondExponent, state.denominatorExponent, state.numeratorExponent, state.finalExponent])) {
        error(issues, "N2_EXPONENT_MAGNITUDE", "Product/quotient exponents exceed the observed symbolic envelope.");
      }
      break;
    }
    case "POWER_OF_POWER_WITH_NEGATIVE_INDEX": {
      if (state.poweredExponent !== state.innerExponent * state.outerExponent) {
        error(issues, "N2_POWER_OF_POWER", "Powered exponent does not match the power-of-a-power law.");
      }
      if (state.combinedExponent !== state.poweredExponent + state.secondExponent || state.combinedExponent >= 0) {
        error(issues, "N2_NEGATIVE_COMBINATION", "Signed-exponent combination must finish at a genuine negative exponent.");
      }
      if (state.finalDenominatorExponent !== Math.abs(state.combinedExponent)) {
        error(issues, "N2_POSITIVE_POWER_CONVERSION", "Positive-power denominator does not match the negative final exponent.");
      }
      if (Math.abs(state.outerExponent) < 2 || Math.abs(state.outerExponent) > 4 || state.finalDenominatorExponent > 12) {
        error(issues, "N2_NEGATIVE_POWER_ENVELOPE", "Negative-index power-of-a-power state is outside the moderated envelope.");
      }
      break;
    }
    case "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX": {
      const expected = reduceN2RationalExponent(-state.radicandExponent, state.rootIndex);
      if (!sameRational(state.finalExponent, expected)) {
        error(issues, "N2_RECIPROCAL_ROOT_RESULT", "Reciprocal-root exponent does not match the powered radicand and root index.");
      }
      if (state.radicandExponent < 1 || state.radicandExponent > 5) {
        error(issues, "N2_RECIPROCAL_ROOT_ENVELOPE", "Powered radicand is outside the moderated N2 range.");
      }
      if (state.rootIndex !== 2) {
        warning(issues, "N2_RECIPROCAL_ROOT_EXTENSION", "Cube-root reciprocal variants are a moderated extension from the strongest square-root presentation pattern.");
      }
      break;
    }
    case "SQUARED_FRACTIONAL_MONOMIAL": {
      if (state.outerPower !== 2 || state.resultExponent !== state.variableExponent * 2) {
        error(issues, "N2_SQUARED_MONOMIAL_POWER", "Squared monomial exponent state is inconsistent.");
      }
      if (state.resultCoefficientNumerator !== state.coefficientNumerator ** 2 || state.resultCoefficientDenominator !== state.coefficientDenominator ** 2) {
        error(issues, "N2_SQUARED_MONOMIAL_COEFFICIENT", "Squared fractional coefficient state is inconsistent.");
      }
      if (state.coefficientNumerator >= state.coefficientDenominator) {
        error(issues, "N2_SQUARED_MONOMIAL_FRACTION", "Powered-monomial coefficient should remain a simple proper fraction.");
      }
      break;
    }
    case "PRODUCT_OVER_ROOT": {
      if (state.numeratorExponent !== state.firstExponent + state.secondExponent) {
        error(issues, "N2_ROOT_PRODUCT", "Numerator exponent does not match the product law.");
      }
      const expected = reduceN2RationalExponent(state.numeratorExponent * state.rootIndex - 1, state.rootIndex);
      if (!sameRational(state.finalExponent, expected)) {
        error(issues, "N2_ROOT_QUOTIENT", "Final fractional exponent does not match division by the root power.");
      }
      if (state.rootIndex !== 2) {
        warning(issues, "N2_PRODUCT_ROOT_EXTENSION", "Product-over-root generation is calibrated primarily to the square-root source mechanism.");
      }
      break;
    }
    case "NEGATIVE_INDEX_QUOTIENT": {
      if (state.denominatorExponent !== state.denominatorExponents[0] + state.denominatorExponents[1]) {
        error(issues, "N2_DENOMINATOR_PRODUCT", "Denominator exponent does not match the product law.");
      }
      if (state.combinedExponent !== state.numeratorExponent - state.denominatorExponent || state.combinedExponent >= 0) {
        error(issues, "N2_NEGATIVE_QUOTIENT", "Negative-index quotient must produce a genuine negative combined exponent.");
      }
      if (state.finalDenominatorExponent !== Math.abs(state.combinedExponent)) {
        error(issues, "N2_NEGATIVE_QUOTIENT_FINAL", "Final positive-power denominator does not match the signed exponent state.");
      }
      break;
    }
    case "DISTRIBUTIVE_INDEX_EXPANSION": {
      const expectedFirst = addN2Exponents(state.outsideExponent, state.firstTermExponent);
      const expectedSecond = addN2Exponents(state.outsideExponent, state.secondTermExponent);
      if (!sameRational(state.firstResultExponent, expectedFirst)) {
        error(issues, "N2_DISTRIBUTIVE_FIRST_TERM", "First distributed term does not match same-base exponent addition.");
      }
      if (!sameRational(state.secondResultExponent, expectedSecond)) {
        error(issues, "N2_DISTRIBUTIVE_SECOND_TERM", "Second distributed term does not match same-base exponent addition.");
      }
      if (sameRational(state.firstResultExponent, state.secondResultExponent)) {
        error(issues, "N2_DISTRIBUTIVE_LIKE_TERMS", "Generated distributive route should not collapse to two identical like terms.");
      }
      if (typeof state.outsideExponent === "number" && state.outsideExponent === 1) {
        error(issues, "N2_DISTRIBUTIVE_HISTORICAL_OVERLAP", "Generation avoids the historical outside exponent of one to prevent trivial symbol substitution.");
      }
      break;
    }
    case "POSITIVE_POWER_PRODUCT_QUOTIENT": {
      if (state.poweredExponent !== state.innerExponent * state.outerExponent) {
        error(issues, "N2_POSITIVE_POWER_OF_POWER", "Nested positive exponent does not match the power-of-a-power law.");
      }
      if (state.numeratorExponent !== state.firstExponent + state.poweredExponent) {
        error(issues, "N2_POSITIVE_PRODUCT", "Numerator exponent does not match the product law.");
      }
      if (state.finalExponent !== state.numeratorExponent - state.denominatorExponent || state.finalExponent <= 0) {
        error(issues, "N2_POSITIVE_QUOTIENT", "Final exponent does not match the quotient law or is not positive.");
      }
      if (state.firstExponent === 7 && state.innerExponent === 3 && state.outerExponent === 2 && state.denominatorExponent === 4) {
        error(issues, "N2_POSITIVE_HISTORICAL_OVERLAP", "Generated all-positive state reproduces the historical parameter tuple.");
      }
      break;
    }
  }

  if (question.quality.calibrationSourceAnchorIds.length === 0) {
    warning(issues, "N2_NO_CALIBRATION_ANCHOR", "Generated N2 question has no recorded historical calibration anchor.");
  }

  return {
    valid: !issues.some((issue) => issue.severity === "ERROR"),
    issues,
  };
};
