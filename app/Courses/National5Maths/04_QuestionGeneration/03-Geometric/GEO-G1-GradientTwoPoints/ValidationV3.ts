import { validateG1GeneratedQuestion as validateG1GeneratedQuestionV2 } from "./ValidationV2";
import type {
  G1GeneratedQuestion,
  G1ValidationIssue,
  G1ValidationResult,
} from "./Types";

const EPSILON = 1e-8;
const MAX_BEST_FIT_MAJOR_INTERVALS = 18;

const pushError = (issues: G1ValidationIssue[], code: string, message: string) => {
  if (!issues.some((issue) => issue.code === code && issue.message === message)) {
    issues.push({ severity: "ERROR", code, message });
  }
};

const nearZero = (value: number) => Math.abs(value) < EPSILON;
const nearInteger = (value: number) => Math.abs(value - Math.round(value)) < EPSILON;

const majorIntervalCount = (minimum: number, maximum: number, interval: number) => {
  if (!Number.isFinite(interval) || interval <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil((maximum - minimum) / interval - EPSILON);
};

const validateStandaloneLinePolicy = (question: G1GeneratedQuestion, issues: G1ValidationIssue[]) => {
  if (question.family !== "LINE_EQUATION_FROM_TWO_POINTS") return;
  const axisPoint = question.mathState.points.find((point) => nearZero(point.x) || nearZero(point.y));
  if (axisPoint) {
    pushError(
      issues,
      "G1_LINE_AXIS_POINT",
      "Standalone line-equation points must not lie on either coordinate axis; using an axis point removes too much of the substitution demand.",
    );
  }
};

const validateInterceptIntegrity = (question: G1GeneratedQuestion, issues: G1ValidationIssue[]) => {
  if (question.family === "SYMBOLIC_GRADIENT_FROM_TWO_POINTS") return;

  if (question.mathState.intercept.numerator === 0) {
    pushError(
      issues,
      "G1_ZERO_INTERCEPT_SHORTCUT",
      "Generated G1 line models must use a non-zero y-intercept so the equation cannot be simplified by an origin shortcut.",
    );
  }

  if (!question.visual) return;
  const visualIntercept = question.visual.line.intercept;
  const stateIntercept = question.mathState.intercept;
  if (visualIntercept.numerator * stateIntercept.denominator !== stateIntercept.numerator * visualIntercept.denominator) {
    pushError(
      issues,
      "G1_VISUAL_INTERCEPT_MISMATCH",
      "The visual specification must carry the same y-intercept as the generated mathematical state; schematic rendering may distort scale but not intercept identity or sign.",
    );
  }
};

const validateContextArithmeticPolicy = (question: G1GeneratedQuestion, issues: G1ValidationIssue[]) => {
  if (question.family !== "CONTEXTUAL_LINEAR_MODEL") return;
  const [a, b] = question.mathState.points;
  const deltaX = b.x - a.x;
  const deltaY = b.y - a.y;

  if (!nearInteger(deltaX) || !nearInteger(deltaY)) {
    pushError(
      issues,
      "G1_CONTEXT_WRITTEN_ARITHMETIC",
      "Context point values may use sensible terminating decimals, but the subtraction used in the non-calculator gradient route must simplify to clean integer differences.",
    );
  }

  const values = [a.x, a.y, b.x, b.y];
  const hasAwkwardDecimal = values.some((value) => {
    const scaledQuarter = value * 4;
    return !nearInteger(value) && !nearInteger(scaledQuarter);
  });
  if (hasAwkwardDecimal) {
    pushError(
      issues,
      "G1_CONTEXT_DECIMAL_NOISE",
      "Context coordinates must avoid gratuitous decimal precision; integer, half and quarter values are the supported written-arithmetic envelope.",
    );
  }
};

const validateBestFitVisualPolicy = (question: G1GeneratedQuestion, issues: G1ValidationIssue[]) => {
  if (question.family !== "BEST_FIT_LINEAR_MODEL") return;
  const visual = question.visual;

  if (question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS") {
    const xIntervals = majorIntervalCount(visual.axis.xMinimum, visual.axis.xMaximum, visual.axis.xTickInterval);
    const yIntervals = majorIntervalCount(visual.axis.yMinimum, visual.axis.yMaximum, visual.axis.yTickInterval);
    if (xIntervals > MAX_BEST_FIT_MAJOR_INTERVALS || yIntervals > MAX_BEST_FIT_MAJOR_INTERVALS) {
      pushError(
        issues,
        "G1_BEST_FIT_GRID_DENSITY",
        `Grid-read best-fit axes must remain readable; no axis may exceed ${MAX_BEST_FIT_MAJOR_INTERVALS} major intervals.`,
      );
    }

    const xs = visual.scatterPoints.map((point) => point.x);
    const xSpan = Math.max(...xs) - Math.min(...xs);
    const axisSpan = visual.axis.xMaximum - visual.axis.xMinimum;
    if (axisSpan <= 0 || xSpan / axisSpan < 0.3) {
      pushError(
        issues,
        "G1_BEST_FIT_HORIZONTAL_CLUSTER",
        "Grid-read scatter data must occupy a meaningful proportion of the horizontal plotting range rather than being compressed into one end of the graph.",
      );
    }
  }
};

export const validateG1GeneratedQuestion = (question: G1GeneratedQuestion): G1ValidationResult => {
  const base = validateG1GeneratedQuestionV2(question);
  const issues = [...base.issues];
  validateStandaloneLinePolicy(question, issues);
  validateInterceptIntegrity(question, issues);
  validateContextArithmeticPolicy(question, issues);
  validateBestFitVisualPolicy(question, issues);
  return {
    valid: !issues.some((issue) => issue.severity === "ERROR"),
    issues,
  };
};

export const G1_V3_VALIDATION_LIMITS = {
  maxBestFitMajorIntervalsPerAxis: MAX_BEST_FIT_MAJOR_INTERVALS,
  minGridReadHorizontalCoverage: 0.3,
  generatedLineInterceptMustBeNonZero: true,
} as const;
