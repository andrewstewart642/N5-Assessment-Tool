import {
  getG1FamilyProfile,
  historicalG1NumericOverlap,
  historicalG1SymbolicOverlap,
} from "./Calibration";
import { assessG1Difficulty } from "./Difficulty";
import { buildG1LineEquation, reduceG1Rational } from "./PromptGrammar";
import type {
  G1GeneratedQuestion,
  G1LineModelState,
  G1NumericPoint,
  G1Rational,
  G1ValidationIssue,
  G1ValidationResult,
} from "./Types";

const error = (issues: G1ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "ERROR", code, message });
const warning = (issues: G1ValidationIssue[], code: string, message: string) =>
  issues.push({ severity: "WARNING", code, message });

const sameRational = (a: G1Rational, b: G1Rational) => {
  const ra = reduceG1Rational(a);
  const rb = reduceG1Rational(b);
  return ra.numerator === rb.numerator && ra.denominator === rb.denominator;
};

const subtractRational = (a: G1Rational, b: G1Rational): G1Rational =>
  reduceG1Rational({
    numerator: a.numerator * b.denominator - b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });

const multiplyRational = (value: G1Rational, scalar: number): G1Rational =>
  reduceG1Rational({ numerator: value.numerator * scalar, denominator: value.denominator });

const lineGradient = (a: G1NumericPoint, b: G1NumericPoint): G1Rational | null => {
  const dx = b.x - a.x;
  if (dx === 0) return null;
  return reduceG1Rational({ numerator: b.y - a.y, denominator: dx });
};

const lineIntercept = (point: G1NumericPoint, gradient: G1Rational): G1Rational =>
  subtractRational({ numerator: point.y, denominator: 1 }, multiplyRational(gradient, point.x));

const validateLineState = (
  state: G1LineModelState,
  issues: G1ValidationIssue[],
) => {
  const [a, b] = state.points;
  const calculatedGradient = lineGradient(a, b);
  if (!calculatedGradient) {
    error(issues, "G1_VERTICAL_LINE", "Generated G1 points must have distinct x-coordinates.");
    return;
  }
  if (!sameRational(calculatedGradient, state.gradient)) {
    error(issues, "G1_GRADIENT_DRIFT", "Stored gradient does not match the generated point pair.");
  }
  const interceptA = lineIntercept(a, state.gradient);
  const interceptB = lineIntercept(b, state.gradient);
  if (!sameRational(interceptA, state.intercept) || !sameRational(interceptB, state.intercept)) {
    error(issues, "G1_INTERCEPT_DRIFT", "Stored intercept is inconsistent with one or both generated points.");
  }
  if (state.gradient.numerator === 0) {
    error(issues, "G1_ZERO_GRADIENT", "The current G1 generation envelope excludes horizontal lines.");
  }
  if (state.intercept.numerator === 0) {
    error(issues, "G1_ZERO_INTERCEPT", "The current G1 generation envelope requires a non-zero intercept.");
  }
  const expectedEquation = buildG1LineEquation(
    state.xVariable,
    state.yVariable,
    state.gradient,
    state.intercept,
  );
  if (state.equationLatex !== expectedEquation.latex || state.equationPlain !== expectedEquation.plain) {
    error(issues, "G1_EQUATION_DRIFT", "Stored line equation does not match the generated gradient/intercept state.");
  }
  if (historicalG1NumericOverlap(state)) {
    error(issues, "G1_HISTORICAL_OVERLAP", "Generated numeric line reproduces a reviewed historical line or point pair.");
  }
};

const axisContains = (
  axis: { xMinimum: number; xMaximum: number; yMinimum: number; yMaximum: number },
  point: G1NumericPoint,
) => point.x >= axis.xMinimum && point.x <= axis.xMaximum && point.y >= axis.yMinimum && point.y <= axis.yMaximum;

export const validateG1GeneratedQuestion = (
  question: G1GeneratedQuestion,
): G1ValidationResult => {
  const issues: G1ValidationIssue[] = [];
  const profile = getG1FamilyProfile(question.family);

  if (!profile.supportedPapers.includes(question.paper as never)) {
    error(issues, "G1_UNSUPPORTED_PAPER", `${question.family} is not calibrated for ${question.paper}.`);
  }
  const expectedMarks = question.family === "BEST_FIT_LINEAR_MODEL" ? 3 : profile.marks;
  if (question.marks !== expectedMarks) {
    error(issues, "G1_MARK_TARIFF", `Expected ${expectedMarks} generated G1 marks for ${question.family}.`);
  }
  if (!question.prompt.trim() || question.promptParts.length === 0 || question.promptSections.length === 0) {
    error(issues, "G1_PROMPT_EMPTY", "Generated G1 question has no renderable prompt content.");
  }
  if (!question.sourceBasis.historicalReference.primaryQuestionCatalogId) {
    error(issues, "G1_REFERENCE_MISSING", "Every generated G1 question must expose a primary historical reference ID.");
  }
  if (question.sourceBasis.questionCatalogIds.length === 0 || question.sourceBasis.answerCatalogIds.length === 0) {
    error(issues, "G1_SOURCE_BASIS_EMPTY", "Generated G1 question has no cross-corpus source basis.");
  }
  if (question.thinking !== "OPERATIONAL") {
    error(issues, "G1_THINKING", "The currently generated G1 mark routes are Operational.");
  }

  const difficulty = assessG1Difficulty(question.family, question.surfaceStyleId, question.mathState);
  if (
    difficulty.difficulty !== question.difficulty
    || difficulty.bandId !== question.quality.difficultyBandId
    || difficulty.score !== question.quality.difficultyScore
  ) {
    error(issues, "G1_DIFFICULTY_DRIFT", "Stored G1 difficulty metadata does not match the route-based difficulty assessment.");
  }
  if (question.quality.historicalOverlapChecked !== true) {
    error(issues, "G1_OVERLAP_CHECK", "Generated G1 question must record historical-overlap checking.");
  }

  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.difficulty !== 1 || question.marks !== 3) {
      error(issues, "G1_LINE_PROFILE", "Standalone numeric line generation must remain P1, C-standard, lower-band and three marks in V1.");
    }
    if (state.gradient.denominator !== 1 || Math.abs(state.gradient.numerator) < 2) {
      error(issues, "G1_LINE_GRADIENT_ENVELOPE", "Standalone line generation requires a non-unit integer gradient with magnitude at least 2.");
    }
    if (question.surfaceStyleId === "DIRECT_COORDINATES_LINE_EQUATION") {
      if (question.visual !== null) {
        error(issues, "G1_DIRECT_VISUAL", "Direct-coordinate G1 questions must not carry a generated visual.");
      }
    } else {
      if (!question.visual || question.visual.kind !== "G1_COORDINATE_DIAGRAM") {
        error(issues, "G1_DIAGRAM_VISUAL", "Coordinate-diagram G1 questions require a coordinate visual spec.");
      } else {
        for (const point of question.visual.points) {
          if (!axisContains(question.visual.axis, point)) {
            error(issues, "G1_DIAGRAM_WINDOW", "Coordinate visual window does not contain every generated point.");
          }
        }
        if (!sameRational(question.visual.line.gradient, state.gradient) || !sameRational(question.visual.line.intercept, state.intercept)) {
          error(issues, "G1_DIAGRAM_LINE_DRIFT", "Coordinate visual line does not match the generated line state.");
        }
      }
    }
  } else if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.difficulty !== 2 || question.marks !== 4) {
      error(issues, "G1_CONTEXT_PROFILE", "Deterministic contextual G1 generation must remain P1, C-standard, upper-band and four G1 marks.");
    }
    if (state.gradient.denominator === 1) {
      error(issues, "G1_CONTEXT_GRADIENT", "The supported deterministic context family requires an exact non-integer gradient in V1.");
    }
    const expectedOutput = subtractRational(
      { numerator: state.followUp.exactOutput.numerator, denominator: state.followUp.exactOutput.denominator },
      { numerator: 0, denominator: 1 },
    );
    const calculatedOutput = reduceG1Rational({
      numerator: state.gradient.numerator * state.followUp.input * state.intercept.denominator
        + state.intercept.numerator * state.gradient.denominator,
      denominator: state.gradient.denominator * state.intercept.denominator,
    });
    if (!sameRational(expectedOutput, calculatedOutput)) {
      error(issues, "G1_CONTEXT_FOLLOW_UP", "Stored deterministic follow-up value does not agree with the generated line model.");
    }
    if (question.visual.kind !== "G1_CONTEXT_LINE_GRAPH") {
      error(issues, "G1_CONTEXT_VISUAL", "Deterministic contextual G1 generation requires a supportive line-graph visual spec.");
    } else {
      if (question.visual.axis.xVariable !== state.context.xVariable || question.visual.axis.yVariable !== state.context.yVariable) {
        error(issues, "G1_CONTEXT_AXIS", "Context graph variables do not match the generated contextual state.");
      }
      if (!sameRational(question.visual.line.gradient, state.gradient) || !sameRational(question.visual.line.intercept, state.intercept)) {
        error(issues, "G1_CONTEXT_LINE_DRIFT", "Context graph line does not match the generated model state.");
      }
    }
  } else if (question.family === "BEST_FIT_LINEAR_MODEL") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.marks !== 3) {
      error(issues, "G1_BEST_FIT_PROFILE", "The current G1-only best-fit shell must remain P1, C-standard and exactly three generated G1 marks.");
    }
    if (
      question.deferredComposite.totalHistoricalArchitectureMarks !== 4
      || question.deferredComposite.g1MarksGenerated !== 3
      || question.deferredComposite.embeddedSkillId !== "stat-s02-linear-model"
      || question.deferredComposite.embeddedMarksDeferred !== 1
      || state.embeddedS2MarksDeferred !== 1
    ) {
      error(issues, "G1_BEST_FIT_OWNERSHIP", "Best-fit generation must preserve the explicit 3 G1 + 1 deferred S2 ownership boundary.");
    }
    if (question.visual.kind !== "G1_BEST_FIT_GRAPH") {
      error(issues, "G1_BEST_FIT_VISUAL", "Best-fit G1 generation requires a scatter-graph visual specification.");
    } else {
      if (question.visual.scatterPoints.length < 6) {
        error(issues, "G1_BEST_FIT_SCATTER", "Generated best-fit graph requires a plausible independently generated scatter cloud.");
      }
      if (question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS" && question.visual.readableLinePoints.length < 2) {
        error(issues, "G1_BEST_FIT_READ_POINTS", "Grid-read best-fit generation requires at least two exact readable line points.");
      }
      if (question.surfaceStyleId === "BEST_FIT_LABELLED_POINTS_CONTEXT" && question.visual.labelledLinePoints.length !== 2) {
        error(issues, "G1_BEST_FIT_LABELLED_POINTS", "Labelled best-fit generation requires exactly two explicit model-defining line points.");
      }
      if (!sameRational(question.visual.line.gradient, state.gradient) || !sameRational(question.visual.line.intercept, state.intercept)) {
        error(issues, "G1_BEST_FIT_LINE_DRIFT", "Best-fit visual line does not match the generated line state.");
      }
    }
    warning(issues, "G1_BEST_FIT_DEFERRED", "Only the three G1 model-construction marks are generated; the embedded statistical mark remains deliberately deferred.");
  } else {
    const state = question.mathState;
    if (question.paper !== "P2" || question.standard !== "A" || question.difficulty !== 2 || question.marks !== 3 || question.visual !== null) {
      error(issues, "G1_SYMBOLIC_PROFILE", "Symbolic G1 generation must remain P2, A-standard, upper-band, three marks and non-visual.");
    }
    if (state.numericPoint.x !== state.denominatorScale * state.constant || state.numericPoint.y !== state.constant * state.constant) {
      error(issues, "G1_SYMBOLIC_NUMERIC_POINT", "Symbolic numeric point is inconsistent with the cancellable gradient construction.");
    }
    if (
      state.parameterisedPoint.xCoefficient !== state.denominatorScale * state.parameterCoefficient
      || state.parameterisedPoint.yCoefficient !== state.parameterCoefficient * state.parameterCoefficient
    ) {
      error(issues, "G1_SYMBOLIC_PARAMETER_POINT", "Symbolic parameterised point is inconsistent with the intended factor-and-cancel construction.");
    }
    if (!sameRational(state.finalGradientCoefficient, { numerator: state.parameterCoefficient, denominator: state.denominatorScale })) {
      error(issues, "G1_SYMBOLIC_COEFFICIENT", "Symbolic final gradient coefficient does not match the generated construction.");
    }
    if (!sameRational(state.finalGradientConstant, { numerator: state.constant, denominator: state.denominatorScale })) {
      error(issues, "G1_SYMBOLIC_CONSTANT", "Symbolic final gradient constant does not match the generated construction.");
    }
    if (!sameRational(state.excludedParameterValue, { numerator: state.constant, denominator: state.parameterCoefficient })) {
      error(issues, "G1_SYMBOLIC_DOMAIN", "Symbolic excluded parameter value does not match the vertical-line condition.");
    }
    if (historicalG1SymbolicOverlap(state)) {
      error(issues, "G1_SYMBOLIC_HISTORICAL_OVERLAP", "Generated symbolic coordinate state reproduces the reviewed historical symbolic architecture.");
    }
    warning(issues, "G1_SYMBOLIC_EXPERIMENTAL", "The symbolic coordinate-gradient family remains narrow because the reviewed corpus contains one historical source.");
  }

  if (question.quality.calibrationSourceAnchorIds.length === 0) {
    warning(issues, "G1_CALIBRATION_ANCHOR", "Generated G1 question has no primary calibration anchor ID.");
  }

  return {
    valid: !issues.some((issue) => issue.severity === "ERROR"),
    issues,
  };
};
