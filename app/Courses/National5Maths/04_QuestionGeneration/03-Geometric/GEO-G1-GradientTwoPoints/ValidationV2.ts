import {
  getG1FamilyProfile,
  historicalG1NumericOverlap,
  historicalG1SymbolicOverlap,
} from "./Calibration";
import { assessG1Difficulty } from "./Difficulty";
import { buildG1LineEquation, g1BestFitFollowUp, reduceG1Rational } from "./PromptGrammar";
import type {
  G1GeneratedQuestion,
  G1LineModelState,
  G1NumericPoint,
  G1Rational,
  G1ValidationIssue,
  G1ValidationResult,
} from "./Types";

const error = (issues: G1ValidationIssue[], code: string, message: string) => issues.push({ severity: "ERROR", code, message });
const warning = (issues: G1ValidationIssue[], code: string, message: string) => issues.push({ severity: "WARNING", code, message });

const sameRational = (a: G1Rational, b: G1Rational) => {
  const ra = reduceG1Rational(a);
  const rb = reduceG1Rational(b);
  return ra.numerator === rb.numerator && ra.denominator === rb.denominator;
};

const subtractRational = (a: G1Rational, b: G1Rational): G1Rational => reduceG1Rational({
  numerator: a.numerator * b.denominator - b.numerator * a.denominator,
  denominator: a.denominator * b.denominator,
});

const numberToRational = (value: number): G1Rational => Number.isInteger(value)
  ? { numerator: value, denominator: 1 }
  : reduceG1Rational({ numerator: Math.round(value * 1000), denominator: 1000 });

const multiplyRational = (a: G1Rational, b: G1Rational): G1Rational => reduceG1Rational({
  numerator: a.numerator * b.numerator,
  denominator: a.denominator * b.denominator,
});

const lineGradient = (a: G1NumericPoint, b: G1NumericPoint): G1Rational | null => {
  const dx = b.x - a.x;
  if (Math.abs(dx) < 1e-9) return null;
  return reduceG1Rational({ numerator: Math.round((b.y - a.y) * 1000), denominator: Math.round(dx * 1000) });
};

const lineIntercept = (point: G1NumericPoint, gradient: G1Rational): G1Rational => subtractRational(
  numberToRational(point.y),
  multiplyRational(gradient, numberToRational(point.x)),
);

const pointOnLine = (point: G1NumericPoint, gradient: G1Rational, intercept: G1Rational) => {
  const expected = gradient.numerator / gradient.denominator * point.x + intercept.numerator / intercept.denominator;
  return Math.abs(expected - point.y) < 1e-8;
};

const samePoint = (a: G1NumericPoint, b: G1NumericPoint) => Math.abs(a.x - b.x) < 1e-8 && Math.abs(a.y - b.y) < 1e-8;
const multipleOf = (value: number, interval: number) => interval > 0 && Math.abs(value / interval - Math.round(value / interval)) < 1e-8;

const validateLineState = (state: G1LineModelState, issues: G1ValidationIssue[]) => {
  const [a, b] = state.points;
  const calculatedGradient = lineGradient(a, b);
  if (!calculatedGradient) {
    error(issues, "G1_VERTICAL_LINE", "Generated G1 points must have distinct x-coordinates.");
    return;
  }
  if (!sameRational(calculatedGradient, state.gradient)) error(issues, "G1_GRADIENT_DRIFT", "Stored gradient does not match the generated point pair.");
  if (!sameRational(lineIntercept(a, state.gradient), state.intercept) || !sameRational(lineIntercept(b, state.gradient), state.intercept)) {
    error(issues, "G1_INTERCEPT_DRIFT", "Stored intercept is inconsistent with one or both generated points.");
  }
  if (state.gradient.numerator === 0) error(issues, "G1_ZERO_GRADIENT", "The G1 generation envelope excludes horizontal lines.");
  if (state.intercept.numerator === 0) error(issues, "G1_ZERO_INTERCEPT", "The G1 generation envelope requires a non-zero intercept.");
  const expected = buildG1LineEquation(state.xVariable, state.yVariable, state.gradient, state.intercept);
  if (state.equationLatex !== expected.latex || state.equationPlain !== expected.plain) error(issues, "G1_EQUATION_DRIFT", "Stored line equation does not match the generated gradient/intercept state.");
  if (historicalG1NumericOverlap(state)) error(issues, "G1_HISTORICAL_OVERLAP", "Generated numeric line reproduces a reviewed historical line or point pair.");
};

const validatePrompt = (question: G1GeneratedQuestion, issues: G1ValidationIssue[]) => {
  if (!question.prompt.trim() || question.promptParts.length === 0 || question.promptSections.length === 0) error(issues, "G1_PROMPT_EMPTY", "Generated G1 question has no renderable prompt content.");
  if (!question.prompt.includes("\n")) error(issues, "G1_PROMPT_STRUCTURE", "New information and instructions must be separated onto new lines.");
  if (!question.prompt.includes("simplest form")) error(issues, "G1_SIMPLEST_FORM_PROMPT", "Generated G1 prompts must preserve the simplest-form instruction.");
};

export const validateG1GeneratedQuestion = (question: G1GeneratedQuestion): G1ValidationResult => {
  const issues: G1ValidationIssue[] = [];
  const profile = getG1FamilyProfile(question.family);
  if (!profile.supportedPapers.includes(question.paper as never)) error(issues, "G1_UNSUPPORTED_PAPER", `${question.family} is not calibrated for ${question.paper}.`);
  const expectedG1Marks = question.family === "BEST_FIT_LINEAR_MODEL" ? 3 : profile.marks;
  if (question.marks !== expectedG1Marks) error(issues, "G1_MARK_TARIFF", `Expected ${expectedG1Marks} G1-owned marks for ${question.family}.`);
  validatePrompt(question, issues);

  if (!question.sourceBasis.historicalReference.primaryQuestionCatalogId) error(issues, "G1_REFERENCE_MISSING", "Every generated G1 question must expose a primary historical reference ID.");
  if (!question.sourceBasis.questionCatalogIds.length || !question.sourceBasis.answerCatalogIds.length) error(issues, "G1_SOURCE_BASIS_EMPTY", "Generated G1 question has no cross-corpus source basis.");
  if (question.thinking !== "OPERATIONAL") error(issues, "G1_THINKING", "The generated G1-owned mark routes are Operational.");

  const difficulty = assessG1Difficulty(question.family, question.surfaceStyleId, question.mathState);
  if (difficulty.difficulty !== question.difficulty || difficulty.bandId !== question.quality.difficultyBandId || difficulty.score !== question.quality.difficultyScore) {
    error(issues, "G1_DIFFICULTY_DRIFT", "Stored G1 difficulty metadata does not match the route-based assessment.");
  }
  if (question.quality.historicalOverlapChecked !== true) error(issues, "G1_OVERLAP_CHECK", "Generated G1 question must record historical-overlap checking.");

  if (question.family === "LINE_EQUATION_FROM_TWO_POINTS") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.marks !== 3) error(issues, "G1_LINE_PROFILE", "Standalone numeric line generation must remain P1, C-standard and three marks.");
    if (question.difficulty === 1 && (state.gradient.denominator !== 1 || Math.abs(state.gradient.numerator) < 2)) error(issues, "G1_LINE_LOWER_ENVELOPE", "Lower-band line generation requires a compact non-unit integer gradient.");
    if (question.difficulty === 2 && (state.gradient.denominator === 1 || ![2, 3, 4, 5].includes(state.gradient.denominator))) error(issues, "G1_LINE_UPPER_ENVELOPE", "Upper-band standalone line generation requires a simple reduced fractional gradient.");
    if (question.surfaceStyleId === "DIRECT_COORDINATES_LINE_EQUATION") {
      if (question.visual !== null) error(issues, "G1_DIRECT_VISUAL", "Direct-coordinate questions must not carry a visual.");
    } else if (!question.visual || question.visual.kind !== "G1_COORDINATE_DIAGRAM") {
      error(issues, "G1_DIAGRAM_VISUAL", "Coordinate-diagram questions require a sparse schematic visual specification.");
    } else if (!sameRational(question.visual.line.gradient, state.gradient) || !sameRational(question.visual.line.intercept, state.intercept)) {
      error(issues, "G1_DIAGRAM_LINE_DRIFT", "Coordinate visual line does not match the generated line state.");
    }
  } else if (question.family === "CONTEXTUAL_LINEAR_MODEL") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.marks !== 4) error(issues, "G1_CONTEXT_PROFILE", "Deterministic contextual generation must remain P1, C-standard and four G1 marks.");
    if (state.gradient.denominator === 1) error(issues, "G1_CONTEXT_GRADIENT", "The deterministic contextual generation envelope retains an exact non-integer gradient.");
    if (!question.prompt.includes(`in terms of ${state.context.yVariable} and ${state.context.xVariable}`)) error(issues, "G1_CONTEXT_VARIABLES", "Contextual line questions must require the generated contextual variables.");
    if (!question.prompt.includes("(a)") || !question.prompt.includes("(b)")) error(issues, "G1_CONTEXT_PARTS", "Deterministic contextual wrappers must contain both parts (a) and (b).");
    const calculatedOutput = addRationalForValidation(state.gradient, state.followUp.input, state.intercept);
    if (!sameRational(state.followUp.exactOutput, calculatedOutput)) error(issues, "G1_CONTEXT_FOLLOW_UP", "Stored deterministic follow-up value does not agree with the line model.");
    if (question.visual.kind !== "G1_CONTEXT_LINE_GRAPH") error(issues, "G1_CONTEXT_VISUAL", "Deterministic contextual generation requires a supportive schematic line graph.");
  } else if (question.family === "BEST_FIT_LINEAR_MODEL") {
    const state = question.mathState;
    validateLineState(state, issues);
    if (question.paper !== "P1" || question.standard !== "C" || question.marks !== 3) error(issues, "G1_BEST_FIT_PROFILE", "Best-fit part (a) must remain P1, C-standard and exactly three G1 marks.");
    if (!question.prompt.includes(`in terms of ${state.context.yVariable} and ${state.context.xVariable}`)) error(issues, "G1_BEST_FIT_VARIABLES", "Best-fit part (a) must require the generated contextual variables.");
    const partB = question.promptSections.find((section) => section.label === "b");
    if (!partB || partB.marks !== 1 || !question.prompt.includes("(b)")) error(issues, "G1_BEST_FIT_S2_WRAPPER", "The complete best-fit wrapper must include the adjacent one-mark part (b).");
    if (question.deferredComposite.totalHistoricalArchitectureMarks !== 4 || question.deferredComposite.g1MarksGenerated !== 3 || question.deferredComposite.embeddedSkillId !== "stat-s02-linear-model" || question.deferredComposite.embeddedMarksDeferred !== 1 || state.embeddedS2MarksDeferred !== 1) {
      error(issues, "G1_BEST_FIT_OWNERSHIP", "Best-fit generation must preserve the 3 G1 + 1 S2 ownership boundary.");
    }
    const followUp = g1BestFitFollowUp(state);
    if (!Number.isFinite(followUp.input) || !Number.isFinite(followUp.exactOutput.numerator / followUp.exactOutput.denominator)) error(issues, "G1_BEST_FIT_FOLLOW_UP", "Embedded statistical estimate must be computable from the generated line model.");
    if (question.visual.kind !== "G1_BEST_FIT_GRAPH") {
      error(issues, "G1_BEST_FIT_VISUAL", "Best-fit generation requires a scatter-graph visual specification.");
    } else {
      if (question.visual.scatterPoints.length < 6) error(issues, "G1_BEST_FIT_SCATTER", "Best-fit graph requires a plausible independently generated scatter cloud.");
      if (!sameRational(question.visual.line.gradient, state.gradient) || !sameRational(question.visual.line.intercept, state.intercept)) error(issues, "G1_BEST_FIT_LINE_DRIFT", "Best-fit visual line does not match the generated line state.");
      if (question.surfaceStyleId === "BEST_FIT_GRID_READ_POINTS") {
        if (question.visual.axis.xMinimum !== 0 || question.visual.axis.yMinimum !== 0) error(issues, "G1_BEST_FIT_AXIS_ORIGIN", "Scaled graph-read axes must begin at zero.");
        if (question.visual.readableLinePoints.length !== 2) error(issues, "G1_BEST_FIT_READ_POINT_COUNT", "Grid-read generation must expose exactly two intended readable line points.");
        const scatterOnLine = question.visual.scatterPoints.filter((point) => pointOnLine(point, state.gradient, state.intercept));
        if (scatterOnLine.length !== 2) error(issues, "G1_BEST_FIT_ON_LINE_COUNT", "Exactly two scatter points must lie on the fitted line in a grid-read question.");
        for (const point of question.visual.readableLinePoints) {
          if (!pointOnLine(point, state.gradient, state.intercept)) error(issues, "G1_BEST_FIT_READ_POINT_DRIFT", "Every intended readable point must lie exactly on the fitted line.");
          if (!question.visual.scatterPoints.some((scatter) => samePoint(scatter, point))) error(issues, "G1_BEST_FIT_READ_POINT_VISIBLE", "Every intended readable point must also be a visible scatter point.");
          if (!multipleOf(point.x, question.visual.axis.xTickInterval) || !multipleOf(point.y, question.visual.axis.yTickInterval)) error(issues, "G1_BEST_FIT_GRID_INTERSECTION", "Each intended readable point must lie on the ordinary uniform major grid.");
        }
        if (question.visual.labelledLinePoints.length !== 0) error(issues, "G1_BEST_FIT_GRID_LABELS", "Grid-read points must not be labelled A/B for the pupil.");
      } else if (question.visual.labelledLinePoints.length !== 2) {
        error(issues, "G1_BEST_FIT_LABELLED_POINTS", "Labelled best-fit generation requires exactly two explicit model-defining line points.");
      }
    }
    warning(issues, "G1_BEST_FIT_EMBEDDED_S2", "Part (b) is present in the generated wrapper and is identified as the adjacent S2 mark; the standalone S2 answer layer remains deferred.");
  } else {
    const state = question.mathState;
    if (question.paper !== "P2" || question.standard !== "A" || question.difficulty !== 2 || question.marks !== 3 || question.visual !== null) error(issues, "G1_SYMBOLIC_PROFILE", "Symbolic G1 generation must remain P2, A-standard, upper-band, three marks and non-visual.");
    if (state.numericPoint.x !== state.denominatorScale * state.constant || state.numericPoint.y !== state.constant * state.constant) error(issues, "G1_SYMBOLIC_NUMERIC_POINT", "Symbolic numeric point does not match the factor-and-cancel construction.");
    if (historicalG1SymbolicOverlap(state)) error(issues, "G1_SYMBOLIC_HISTORICAL_OVERLAP", "Generated symbolic state reproduces the reviewed historical parameter structure.");
  }

  return { valid: !issues.some((issue) => issue.severity === "ERROR"), issues };
};

const addRationalForValidation = (gradient: G1Rational, input: number, intercept: G1Rational): G1Rational => {
  const product = multiplyRational(gradient, numberToRational(input));
  return reduceG1Rational({
    numerator: product.numerator * intercept.denominator + intercept.numerator * product.denominator,
    denominator: product.denominator * intercept.denominator,
  });
};
